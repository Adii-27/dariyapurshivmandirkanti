import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "SANITY_STUDIO_PROJECT_ID is required. Copy .env.example to .env.local and add the Sanity project ID.",
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: process.env.gmvrx14x6u1c59kgegztxz9n,
  },
});
