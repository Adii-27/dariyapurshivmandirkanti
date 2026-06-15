import { ImageIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { SingleCategoryInput } from "../components/SingleCategoryInput";
import { GALLERY_CATEGORIES, getGalleryCategoryTitle } from "../studioOptions";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Temple Photo",
  description: "Upload temple photos that will automatically appear on the website.",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Enter a clear title for the temple photo.",
      type: "string",
      validation: (rule) =>
        rule.required().min(2).max(140).error("Title is required before publishing."),
    }),
    defineField({
      name: "image",
      title: "Photo",
      description: "Choose a clear temple photo.",
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
      validation: (rule) => rule.required().error("Image is required before publishing."),
    }),
    defineField({
      name: "categories",
      title: "Category",
      description: "Choose the section where this photo belongs.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: GALLERY_CATEGORIES,
      },
      components: {
        input: SingleCategoryInput,
      },
      validation: (rule) => rule.required().length(1).unique(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Add a short note about the photo.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.required().min(3).max(400).error("Description is required before publishing."),
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
      title: "Featured",
      type: "boolean",
      initialValue: false,
      hidden: true,
      readOnly: true,
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
      media: "image",
      categories: "categories",
      featured: "featured",
    },
    prepare({ title, media, categories, featured }) {
      const categoryText =
        Array.isArray(categories) && categories[0]
          ? (getGalleryCategoryTitle(categories[0]) ?? categories[0])
          : "Choose a category";
      return {
        title: title || "Temple Photo",
        media,
        subtitle: `${featured ? "Featured photo | " : ""}${categoryText}`,
      };
    },
  },
});
