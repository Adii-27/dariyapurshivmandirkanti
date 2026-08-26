import { HelpCircleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { schedulePublishField } from "./schedulePublishField";

const FAQ_CATEGORIES = ["Temple", "Timings & Aarti", "Location", "Seva", "Festivals", "General"];

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  description: "Publish answers to common questions from temple devotees.",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().min(5).max(220),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().min(10).max(2000),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: FAQ_CATEGORIES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      description: "Lower numbers appear first. Leave empty to use the question order.",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "featured",
      title: "⭐ Featured FAQ",
      type: "boolean",
      initialValue: false,
    }),
    schedulePublishField,
  ],
  orderings: [
    {
      title: "Featured, then Display Order",
      name: "featuredThenOrder",
      by: [
        { field: "featured", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "question", subtitle: "category", featured: "featured" },
    prepare({ title, subtitle, featured }) {
      return {
        title: title || "Untitled FAQ",
        subtitle: `${featured ? "Featured | " : ""}${subtitle || "Choose a category"}`,
      };
    },
  },
});
