import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "SANITY_STUDIO_PROJECT_ID is required. Copy .env.example to .env.local and add the Sanity project ID.",
  );
}

export default defineConfig({
  name: "dariyapur-shiv-mandir",
  title: "Dariyapur Shiv Mandir Kanti",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
