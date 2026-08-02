import { defineField } from "sanity";

export const schedulePublishField = defineField({
  name: "publishAt",
  title: "Schedule Publish",
  description:
    "Leave empty to publish immediately. Select a future date and time to automatically publish this content.",
  type: "datetime",
});
