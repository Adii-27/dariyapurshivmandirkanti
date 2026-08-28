import { createFileRoute } from "@tanstack/react-router";
import { getServerConfig } from "@/lib/config.server";

const VISITOR_KEY = "stats:website_visitors";
const BASELINE_COUNT = 1420;
const MAX_IP_INCREMENTS_PER_WINDOW = 10;
const IP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_TRACKED_IPS = 5000;

let localMemoryCount = BASELINE_COUNT;
const ipIncrementTimestamps = new Map<string, number[]>();

function hasVisitorCookie(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;
  return /(?:^|;\s*)dsmk_vc=/.test(cookieHeader);
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipIncrementTimestamps.get(ip);

  if (!timestamps) {
    if (ipIncrementTimestamps.size >= MAX_TRACKED_IPS) {
      for (const [key, times] of ipIncrementTimestamps.entries()) {
        if (times.length === 0 || now - times[times.length - 1] > IP_WINDOW_MS) {
          ipIncrementTimestamps.delete(key);
        }
      }
    }
    ipIncrementTimestamps.set(ip, [now]);
    return false;
  }

  const fresh = timestamps.filter((time) => now - time < IP_WINDOW_MS);
  if (fresh.length >= MAX_IP_INCREMENTS_PER_WINDOW) {
    ipIncrementTimestamps.set(ip, fresh);
    return true;
  }

  fresh.push(now);
  ipIncrementTimestamps.set(ip, fresh);
  return false;
}

function createCounterResponse(count: number, setCookie: boolean): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store, max-age=0",
  });
  if (setCookie) {
    headers.set(
      "Set-Cookie",
      "dsmk_vc=1; Path=/; Max-Age=86400; SameSite=Lax; HttpOnly; Secure",
    );
  }
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers,
  });
}

export const Route = createFileRoute("/api/visitors")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const requestedIncrement = url.searchParams.get("inc") === "1";
        const alreadyCounted = hasVisitorCookie(request);
        const clientIp = getClientIp(request);
        const rateLimited = requestedIncrement && isIpRateLimited(clientIp);
        const shouldExecuteIncrement = requestedIncrement && !alreadyCounted && !rateLimited;
        const config = getServerConfig();

        if (config.upstashRedisUrl && config.upstashRedisToken) {
          try {
            if (shouldExecuteIncrement) {
              const res = await fetch(config.upstashRedisUrl, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${config.upstashRedisToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(["INCR", VISITOR_KEY]),
              });
              if (res.ok) {
                const data = (await res.json()) as { result?: number };
                if (typeof data.result === "number") {
                  return createCounterResponse(data.result + BASELINE_COUNT, true);
                }
              }
            } else {
              const res = await fetch(config.upstashRedisUrl, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${config.upstashRedisToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(["GET", VISITOR_KEY]),
              });
              if (res.ok) {
                const data = (await res.json()) as { result?: string | number | null };
                const num = Number(data.result);
                if (Number.isFinite(num) && num > 0) {
                  return createCounterResponse(num + BASELINE_COUNT, false);
                }
              }
            }
          } catch {
            // Fall back to memory count if Upstash call encounters network error
          }
        }

        if (shouldExecuteIncrement) {
          localMemoryCount += 1;
          return createCounterResponse(localMemoryCount, true);
        }

        return createCounterResponse(localMemoryCount, false);
      },
    },
  },
});
