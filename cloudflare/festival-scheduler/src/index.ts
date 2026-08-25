export interface Env {
  FESTIVAL_SCHEDULER_SECRET: string;
  VERCEL_FESTIVAL_ENDPOINT: string;
}

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      fetch(env.VERCEL_FESTIVAL_ENDPOINT, {
        headers: { Authorization: `Bearer ${env.FESTIVAL_SCHEDULER_SECRET}` },
      }).then((response) => {
        if (!response.ok) throw new Error(`Festival endpoint returned ${response.status}`);
      }),
    );
  },
} satisfies ExportedHandler<Env>;
