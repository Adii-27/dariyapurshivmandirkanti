import { UsersIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const communityPost = defineType({
  name: "communityPost",
  title: "Community Post",
  description: "Use this section for temple news, community activities, and announcements.",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Example: Temple Cleaning Drive",
      type: "string",
      validation: (rule) => rule.required().min(3).max(140),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "featuredImage",
      title: "Temple Photo",
      description: "Upload a related image (optional).",
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
    }),
    defineField({
      name: "content",
      title: "Content",
      description: "Write the announcement or update for devotees.",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        }),
        defineArrayMember({
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
        }),
      ],
      validation: (rule) => rule.required().min(1),
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
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "featured",
      title: "⭐ Feature this Post",
      description: "Show this post more prominently in Temple Updates.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      description: "Optional date and time for an announced festival or event.",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      description: "Optional ending date and time for an announced festival or event.",
      type: "datetime",
      validation: (rule) =>
        rule
          .min(rule.valueOfField("startDate"))
          .error("End date must be after the start date."),
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
      media: "featuredImage",
      date: "date",
      featured: "featured",
      published: "published",
    },
    prepare({ title, media, date, featured, published }) {
      return {
        title: title || "Untitled Community Post",
        media,
        subtitle: [
          published ? "Visible on website" : "Not visible on website",
          featured ? "Featured post" : null,
          date ? new Date(date).toLocaleDateString("en-IN") : null,
        ]
          .filter(Boolean)
          .join(" | "),
      };
    },
  },
});
