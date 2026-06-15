import { BellIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const templeNotice = defineType({
  name: "templeNotice",
  title: "Temple Notice",
  description: "Publish short, important notices for temple visitors.",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "title",
      title: "Notice Title",
      description: "Example: Temple Timings Changed for Monday",
      type: "string",
      validation: (rule) => rule.required().min(3).max(140),
    }),
    defineField({
      name: "noticeContent",
      title: "Notice Content",
      description: "Write the complete notice for devotees.",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required().min(10).max(2000),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "featured",
      title: "⭐ Feature this Notice",
      description: "Show this notice more prominently in Temple Updates.",
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
      title: "Date, Newest",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      featured: "featured",
      published: "published",
    },
    prepare({ title, date, featured, published }) {
      return {
        title: title || "Untitled Temple Notice",
        subtitle: [
          published ? "Visible on website" : "Not visible on website",
          featured ? "Featured notice" : null,
          date ? new Date(date).toLocaleDateString("en-IN") : null,
        ]
          .filter(Boolean)
          .join(" | "),
      };
    },
  },
});
