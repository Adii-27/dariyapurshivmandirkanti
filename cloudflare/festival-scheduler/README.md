# Festival scheduler

This intentionally tiny Cloudflare Worker has one responsibility: at 00:05 India time (18:35 UTC), wake the existing Vercel endpoint that checks the website's existing calculated festivals and any Sanity content whose existing Schedule Publish time has passed.

Configure Worker secrets, never `vars`:

```text
FESTIVAL_SCHEDULER_SECRET=<the same random value configured in Vercel>
VERCEL_FESTIVAL_ENDPOINT=https://dariyapurshivmandirkantiorg.vercel.app/api/push/festivals/run
```

Deploy this Worker separately with a Cloudflare Workers Free account. It has no route, storage, or user-facing traffic.
