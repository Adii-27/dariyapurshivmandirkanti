import { createHash } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import {
  deliverPush,
  releaseWebhook,
  reserveWebhook,
  schedulePush,
  verifySanityWebhook,
} from "@/lib/push.server";

type SanityPushDocument = {
  _id?: string;
  _type?: "galleryItem" | "templeVideo" | "communityPost" | "templeNotice";
  title?: string;
  description?: string;
  noticeContent?: string;
  publishAt?: string;
};

type SanityPushWebhook = SanityPushDocument & { documents?: SanityPushDocument[] };

function contentPayload(document: SanityPushDocument) {
  if (!document._id || !document._type) return null;
  const title = document.title?.trim() || "Temple update";
  if (document._type === "galleryItem") {
    return {
      eventId: `sanity:${document._id}`,
      title: "New photo has been uploaded",
      body: "A new temple photo is now available.",
      url: "/#gallery",
      tag: `gallery-${document._id}`,
    };
  }
  if (document._type === "templeVideo") {
    return {
      eventId: `sanity:${document._id}`,
      title: "New temple video is available",
      body: title,
      url: "/#videos",
      tag: `video-${document._id}`,
    };
  }
  if (document._type === "communityPost") {
    return {
      eventId: `sanity:${document._id}`,
      title,
      body: document.description?.trim() || "A new community update is available.",
      url: "/#updates",
      tag: `community-${document._id}`,
    };
  }
  if (document._type === "templeNotice") {
    return {
      eventId: `sanity:${document._id}`,
      title,
      body: document.noticeContent?.trim() || "An important temple notice is available.",
      url: "/#updates",
      tag: `notice-${document._id}`,
      urgency: "high" as const,
    };
  }
  return null;
}

function batchPayload(documents: SanityPushDocument[]) {
  const type = documents[0]?._type;
  if (!type || documents.some((document) => document._type !== type)) return null;
  const ids = documents
    .map((document) => document._id)
    .filter((id): id is string => Boolean(id))
    .sort();
  if (ids.length < 2 || (type !== "galleryItem" && type !== "templeVideo")) return null;
  return type === "galleryItem"
    ? {
        eventId: `sanity:gallery:${ids.join(":")}`,
        title: "New photos have been uploaded",
        body: "New temple photos are now available.",
        url: "/#gallery",
        tag: `gallery-${ids[0]}`,
      }
    : {
        eventId: `sanity:video:${ids.join(":")}`,
        title: "New temple videos are available",
        body: "New temple videos are now available.",
        url: "/#videos",
        tag: `video-${ids[0]}`,
      };
}

function resolveIdempotencyKey(request: Request, rawBody: string): string {
  const headerKey =
    request.headers.get("idempotency-key") ||
    request.headers.get("sanity-transaction-id") ||
    request.headers.get("sanity-webhook-id");
  if (headerKey && headerKey.trim().length > 0) {
    return headerKey.trim();
  }
  return createHash("sha256").update(rawBody).digest("hex");
}

export const Route = createFileRoute("/api/push/sanity")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        if (!verifySanityWebhook(rawBody, request.headers.get("sanity-webhook-signature"))) {
          return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
        }
        const idempotencyKey = resolveIdempotencyKey(request, rawBody);

        try {
          if ((await reserveWebhook(idempotencyKey)) !== "OK") {
            return Response.json({ ok: true, duplicate: true });
          }

          const webhook = JSON.parse(rawBody) as SanityPushWebhook;
          const documents = webhook.documents?.length ? webhook.documents : [webhook];
          const batch = batchPayload(documents);
          const payloads = batch
            ? [batch]
            : documents.map(contentPayload).filter((payload) => payload !== null);
          if (payloads.length === 0) return Response.json({ ok: true, ignored: true });
          const futurePublishAt = documents
            .map((document) => document.publishAt)
            .find((publishAt) => publishAt && new Date(publishAt).getTime() > Date.now());
          if (futurePublishAt) {
            await Promise.all(payloads.map((payload) => schedulePush(payload, futurePublishAt)));
            return Response.json({ ok: true, scheduled: true });
          }
          const results = await Promise.all(payloads.map((payload) => deliverPush(payload)));
          return Response.json({ ok: true, notifications: results });
        } catch (error) {
          try {
            await releaseWebhook(idempotencyKey);
          } catch {
            // Ignore release failure if storage is down
          }
          const message = error instanceof Error ? error.message : "Push delivery failed";
          const status = message.includes("not configured") ? 503 : 502;
          console.error("Sanity push delivery failed", error);
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
