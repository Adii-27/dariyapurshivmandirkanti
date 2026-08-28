import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import webPush from "web-push";
import { getServerConfig } from "@/lib/config.server";
import { generateHinduFestivals } from "@/lib/hindu-festivals";
import type { StoredPushSubscription } from "@/lib/push";

const SUBSCRIPTION_SET = "push:subscriptions";
const DAY_MS = 86_400_000;

export type TemplePushPayload = {
  eventId: string;
  title: string;
  body: string;
  url: string;
  tag: string;
  urgency?: "low" | "normal" | "high";
};

type RedisReply<T> = { result?: T; error?: string };

function requiredPushConfig() {
  const config = getServerConfig();
  if (!config.upstashRedisUrl || !config.upstashRedisToken) {
    throw new Error("Push storage is not configured");
  }
  return {
    ...config,
    upstashRedisUrl: config.upstashRedisUrl,
    upstashRedisToken: config.upstashRedisToken,
  };
}

async function redis<T = unknown>(command: string[]): Promise<T> {
  const config = requiredPushConfig();
  const response = await fetch(config.upstashRedisUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.upstashRedisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`Redis request failed (${response.status})`);
  const reply = (await response.json()) as RedisReply<T>;
  if (reply.error) throw new Error(`Redis error: ${reply.error}`);
  return reply.result as T;
}

export function subscriptionId(endpoint: string) {
  return createHash("sha256").update(endpoint).digest("hex");
}

export async function saveSubscription(subscription: StoredPushSubscription) {
  const id = subscriptionId(subscription.endpoint);
  await redis(["SET", `push:subscription:${id}`, JSON.stringify(subscription)]);
  await redis(["SADD", SUBSCRIPTION_SET, id]);
}

export async function deleteSubscription(endpoint: string) {
  const id = subscriptionId(endpoint);
  await Promise.all([
    redis(["DEL", `push:subscription:${id}`]),
    redis(["SREM", SUBSCRIPTION_SET, id]),
  ]);
}

function hasRequiredSubscriptionFields(value: unknown): value is StoredPushSubscription {
  if (!value || typeof value !== "object") return false;
  const subscription = value as StoredPushSubscription;
  return Boolean(
    subscription.endpoint &&
    subscription.endpoint.startsWith("https://") &&
    subscription.keys?.p256dh &&
    subscription.keys?.auth,
  );
}

function configureVapid() {
  const config = requiredPushConfig();
  const publicKey = process.env.VITE_WEB_PUSH_PUBLIC_KEY;
  if (!publicKey || !config.webPushVapidPrivateKey || !config.webPushVapidSubject) {
    throw new Error("VAPID is not configured");
  }
  webPush.setVapidDetails(config.webPushVapidSubject, publicKey, config.webPushVapidPrivateKey);
}

export async function deliverPush(payload: TemplePushPayload) {
  configureVapid();
  const ids = await redis<string[]>(["SMEMBERS", SUBSCRIPTION_SET]);
  const results = await Promise.allSettled(
    ids.map(async (id) => {
      const value = await redis<string | null>(["GET", `push:subscription:${id}`]);
      if (!value) {
        await redis(["SREM", SUBSCRIPTION_SET, id]);
        return;
      }

      let subscription: unknown;
      try {
        subscription = JSON.parse(value) as unknown;
      } catch {
        await redis(["DEL", `push:subscription:${id}`]);
        await redis(["SREM", SUBSCRIPTION_SET, id]);
        return;
      }
      if (!hasRequiredSubscriptionFields(subscription)) {
        await redis(["DEL", `push:subscription:${id}`]);
        await redis(["SREM", SUBSCRIPTION_SET, id]);
        return;
      }

      const dedupeKey = `push:delivery:${payload.eventId}:${id}`;
      const reserved = await redis<string | null>(["SET", dedupeKey, "1", "NX", "EX", "7776000"]);
      if (reserved !== "OK") return;

      try {
        await webPush.sendNotification(subscription, JSON.stringify(payload), {
          TTL: 60 * 60 * 24,
          urgency: payload.urgency ?? "normal",
        });
      } catch (error) {
        await redis(["DEL", dedupeKey]);
        const statusCode =
          typeof error === "object" && error && "statusCode" in error
            ? Number(error.statusCode)
            : 0;
        if (statusCode === 404 || statusCode === 410)
          await deleteSubscription(subscription.endpoint);
        throw error;
      }
    }),
  );
  return {
    attempted: ids.length,
    delivered: results.filter((result) => result.status === "fulfilled").length,
  };
}

export function verifySanityWebhook(rawBody: string, signature: string | null) {
  const secret = getServerConfig().sanityPushWebhookSecret;
  if (!secret || !signature) return false;
  const values = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, value] = part.split("=", 2);
      return [key.trim(), value?.trim()];
    }),
  );
  const timestamp = values.t;
  const expected = values.v1;
  if (!timestamp || !expected) return false;

  const ts = Number(timestamp);
  const tsMs = ts < 1e11 ? ts * 1000 : ts;
  if (Number.isNaN(tsMs) || Math.abs(Date.now() - tsMs) > 300_000) return false;

  const digestBase64 = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("base64");
  const digestBase64Url = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("base64url");

  const expectedBuf = Buffer.from(expected);
  const leftBase64 = Buffer.from(digestBase64);
  const leftBase64Url = Buffer.from(digestBase64Url);

  const matchesBase64 =
    leftBase64.length === expectedBuf.length && timingSafeEqual(leftBase64, expectedBuf);
  const matchesBase64Url =
    leftBase64Url.length === expectedBuf.length && timingSafeEqual(leftBase64Url, expectedBuf);

  return matchesBase64 || matchesBase64Url;
}

export async function reserveWebhook(idempotencyKey: string) {
  return redis<string | null>(["SET", `push:webhook:${idempotencyKey}`, "1", "NX", "EX", "604800"]);
}

export async function releaseWebhook(idempotencyKey: string) {
  await redis(["DEL", `push:webhook:${idempotencyKey}`]);
}

export async function schedulePush(payload: TemplePushPayload, publishAt: string) {
  const dueAt = new Date(publishAt).getTime();
  if (!Number.isFinite(dueAt)) throw new Error("Scheduled publish date is invalid");
  await redis(["SET", `push:scheduled:${payload.eventId}`, JSON.stringify(payload)]);
  await redis(["ZADD", "push:scheduled", String(dueAt), payload.eventId]);
}

export async function sendDueScheduledPushes(now = Date.now()) {
  const eventIds = await redis<string[]>([
    "ZRANGEBYSCORE",
    "push:scheduled",
    "-inf",
    String(now),
    "LIMIT",
    "0",
    "100",
  ]);
  let delivered = 0;
  for (const eventId of eventIds) {
    const value = await redis<string | null>(["GET", `push:scheduled:${eventId}`]);
    if (!value) {
      await redis(["ZREM", "push:scheduled", eventId]);
      continue;
    }
    try {
      const payload = JSON.parse(value) as TemplePushPayload;
      await deliverPush(payload);
      await redis(["DEL", `push:scheduled:${eventId}`]);
      await redis(["ZREM", "push:scheduled", eventId]);
      delivered += 1;
    } catch (error) {
      console.error("Scheduled push delivery failed", error);
    }
  }
  return { due: eventIds.length, delivered };
}

export async function sendFestivalReminders(now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const todayUtc = new Date(`${today}T00:00:00+05:30`).getTime();
  const reminders = generateHinduFestivals(now).flatMap((festival) => {
    const daysAway = Math.round((new Date(festival.date).getTime() - todayUtc) / DAY_MS);
    const kind = daysAway === 7 ? "7d" : daysAway === 1 ? "1d" : daysAway === 0 ? "today" : null;
    if (!kind) return [];
    const copy =
      kind === "7d"
        ? { title: `🔱 ${festival.name} is approaching`, body: festival.description }
        : kind === "1d"
          ? { title: `🔱 ${festival.name} is tomorrow`, body: festival.description }
          : { title: `🕉️ Today is ${festival.name}`, body: festival.description };
    return [
      {
        eventId: `festival:${festival.id}:${today}:${kind}`,
        ...copy,
        url: "/#festivals",
        tag: `festival-${festival.id}`,
        urgency: "normal" as const,
      },
    ];
  });
  const outcomes = await Promise.all(reminders.map((reminder) => deliverPush(reminder)));
  return { today, reminders: reminders.length, outcomes };
}
