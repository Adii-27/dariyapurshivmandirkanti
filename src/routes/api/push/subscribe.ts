import { createFileRoute } from "@tanstack/react-router";
import { deleteSubscription, saveSubscription } from "@/lib/push.server";

type SubscriptionPayload = {
  endpoint?: unknown;
  expirationTime?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
};

function validSubscription(value: SubscriptionPayload): value is {
  endpoint: string;
  expirationTime?: unknown;
  keys: { p256dh: string; auth: string };
} {
  return (
    typeof value.endpoint === "string" &&
    value.endpoint.startsWith("https://") &&
    typeof value.keys?.p256dh === "string" &&
    typeof value.keys.auth === "string"
  );
}

export const Route = createFileRoute("/api/push/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: SubscriptionPayload;
        try {
          body = (await request.json()) as SubscriptionPayload;
        } catch {
          return Response.json({ error: "Invalid subscription" }, { status: 400 });
        }
        if (!validSubscription(body)) {
          return Response.json({ error: "Invalid subscription" }, { status: 400 });
        }
        await saveSubscription({
          endpoint: body.endpoint,
          expirationTime: typeof body.expirationTime === "number" ? body.expirationTime : null,
          keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
        });
        return Response.json({ ok: true }, { status: 201 });
      },
      DELETE: async ({ request }) => {
        let body: { endpoint?: unknown };
        try {
          body = (await request.json()) as { endpoint?: unknown };
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }
        if (typeof body.endpoint !== "string" || !body.endpoint.startsWith("https://")) {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }
        await deleteSubscription(body.endpoint);
        return new Response(null, { status: 204 });
      },
    },
  },
});
