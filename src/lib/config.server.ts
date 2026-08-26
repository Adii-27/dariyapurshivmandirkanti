import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

function normalizeUpstashUrl(rawUrl?: string): string | undefined {
  if (!rawUrl || typeof rawUrl !== "string") return undefined;
  const url = rawUrl.trim().replace(/^["']|["']$/g, "").trim();
  if (!url) return undefined;

  if (url.startsWith("https://") || url.startsWith("http://")) {
    try {
      new URL(url);
      return url;
    } catch {
      return undefined;
    }
  }

  // If provided as a domain without protocol (e.g., xxx.upstash.io)
  if (url.includes(".upstash.io") || url.includes("localhost") || url.includes("127.0.0.1")) {
    const withHttps = `https://${url}`;
    try {
      new URL(withHttps);
      return withHttps;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export function getServerConfig() {
  const upstashRedisUrl =
    normalizeUpstashUrl(process.env.UPSTASH_REDIS_REST_URL) ||
    normalizeUpstashUrl(process.env.UPSTASH_REDIS_URL);

  const upstashRedisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_TOKEN?.trim();

  return {
    nodeEnv: process.env.NODE_ENV,
    sanityReadToken: process.env.SANITY_API_READ_TOKEN,
    upstashRedisUrl,
    upstashRedisToken,
    webPushVapidPrivateKey: process.env.WEB_PUSH_VAPID_PRIVATE_KEY,
    webPushVapidSubject: process.env.WEB_PUSH_VAPID_SUBJECT,
    sanityPushWebhookSecret: process.env.SANITY_PUSH_WEBHOOK_SECRET,
    festivalSchedulerSecret: process.env.FESTIVAL_SCHEDULER_SECRET,
  };
}
