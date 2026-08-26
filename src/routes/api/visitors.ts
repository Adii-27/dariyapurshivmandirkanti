import { createFileRoute } from "@tanstack/react-router";
import { getServerConfig } from "@/lib/config.server";

const VISITOR_KEY = "stats:website_visitors";
const BASELINE_COUNT = 1420;

let localMemoryCount = BASELINE_COUNT;

export const Route = createFileRoute("/api/visitors")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const shouldIncrement = url.searchParams.get("inc") === "1";
        const config = getServerConfig();

        if (config.upstashRedisUrl && config.upstashRedisToken) {
          try {
            if (shouldIncrement) {
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
                  return Response.json({ count: data.result + BASELINE_COUNT });
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
                  return Response.json({ count: num + BASELINE_COUNT });
                }
              }
            }
          } catch {
            // Fall back to memory count if Upstash call encounters network error
          }
        }

        if (shouldIncrement) {
          localMemoryCount += 1;
        }
        return Response.json({ count: localMemoryCount });
      },
    },
  },
});
