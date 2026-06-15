import { PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { getVideoCategoryTitle, VIDEO_CATEGORIES } from "../studioOptions";

export const templeVideo = defineType({
  name: "templeVideo",
  title: "Temple Video",
  description: "Add a YouTube video for devotees to watch on the temple website.",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Example: Mahashivratri Celebration 2027",
      type: "string",
      validation: (rule) =>
        rule.required().min(2).max(120).error("Title is required before publishing."),
    }),
    defineField({
      name: "videoUrl",
      title: "YouTube URL",
      description: "Paste the full YouTube or YouTube Shorts link.",
      type: "url",
      validation: (rule) =>
        rule
          .required()
          .error("Video URL is required before publishing.")
          .uri({
            scheme: ["http", "https"],
            allowRelative: false,
          })
          .custom((value) =>
            !value || isYouTubeUrl(value)
              ? true
              : "Enter a valid YouTube link, such as https://www.youtube.com/watch?v=...",
          ),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      description: "Upload a cover image (optional).",
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: VIDEO_CATEGORIES,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Add a short description of the video.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.required().min(3).max(500).error("Description is required before publishing."),
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
      title: "⭐ Feature this Video",
      description: "Show this video before other videos in the same category.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Date, Newest",
      name: "dateDesc",
      by: [
        { field: "featured", direction: "desc" },
        { field: "date", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "thumbnail",
      category: "category",
      featured: "featured",
    },
    prepare({ title, media, category, featured }) {
      return {
        title: title || "Untitled Temple Video",
        media,
        subtitle: `${featured ? "Featured video | " : ""}${
          getVideoCategoryTitle(category) ?? "Choose a category"
        }`,
      };
    },
  },
});

function isYouTubeUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    return (
      hostname === "youtu.be" || hostname === "youtube.com" || hostname.endsWith(".youtube.com")
    );
  } catch {
    return false;
  }
}
