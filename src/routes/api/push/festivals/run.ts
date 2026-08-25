import { timingSafeEqual } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { getServerConfig } from "@/lib/config.server";
import { sendDueScheduledPushes, sendFestivalReminders } from "@/lib/push.server";

function isAuthorized(request: Request) {
  const secret = getServerConfig().festivalSchedulerSecret;
  const authorization = request.headers.get("authorization");
  if (!secret || !authorization?.startsWith("Bearer ")) return false;
  const supplied = Buffer.from(authorization.slice(7));
  const expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export const Route = createFileRoute("/api/push/festivals/run")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAuthorized(request))
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        try {
          const [festivals, scheduled] = await Promise.all([
            sendFestivalReminders(),
            sendDueScheduledPushes(),
          ]);
          return Response.json({ ok: true, festivals, scheduled });
        } catch (error) {
          console.error("Festival push delivery failed", error);
          return Response.json({ error: "Festival push delivery failed" }, { status: 502 });
        }
      },
    },
  },
});
