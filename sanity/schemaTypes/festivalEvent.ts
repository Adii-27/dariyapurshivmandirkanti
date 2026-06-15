import { CalendarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const festivalEvent = defineType({
  name: "festivalEvent",
  title: "Festivals & Events (Deprecated)",
  description:
    "Deprecated: existing documents are preserved, but this collection is no longer used by the website.",
  type: "document",
  icon: CalendarIcon,
  deprecated: {
    reason:
      "Use Community Posts for announcements. Upcoming Festivals now uses Google Calendar only.",
  },
  fields: [
    defineField({
      name: "festivalName",
      title: "Festival Name",
      description: "Example: Mahashivratri Celebration 2027",
      type: "string",
      validation: (rule) => rule.required().min(2).max(140),
    }),
    defineField({
      name: "bannerImage",
      title: "Banner Image",
      description: "Upload the main festival or event image.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          hidden: true,
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Write the festival announcement for devotees.",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(10).max(800),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      description: "Choose the date and time when the festival begins.",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      description: "Choose the date and time when the festival ends.",
      type: "datetime",
      validation: (rule) =>
        rule
          .required()
          .min(rule.valueOfField("startDate"))
          .error("End date must be after the start date."),
    }),
    defineField({
      name: "countdownEnabled",
      title: "Countdown Enabled",
      type: "boolean",
      initialValue: true,
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "featured",
      title: "⭐ Featured Festival",
      description: "Show this festival more prominently on the website.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
      hidden: true,
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Start Date, Soonest",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "festivalName",
      media: "bannerImage",
      startDate: "startDate",
      featured: "featured",
      published: "published",
    },
    prepare({ title, media, startDate, featured, published }) {
      return {
        title: title || "Untitled Festival",
        media,
        subtitle: [
          published ? "Visible on website" : "Not visible on website",
          featured ? "Featured festival" : null,
          startDate ? new Date(startDate).toLocaleDateString("en-IN") : null,
        ]
          .filter(Boolean)
          .join(" | "),
      };
    },
  },
});
