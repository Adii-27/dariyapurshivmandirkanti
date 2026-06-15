import { Select } from "@sanity/ui";
import { PatchEvent, set, unset, type ArrayOfPrimitivesInputProps } from "sanity";
import { GALLERY_CATEGORIES } from "../studioOptions";

export function SingleCategoryInput(props: ArrayOfPrimitivesInputProps) {
  const firstValue = Array.isArray(props.value) ? props.value[0] : undefined;
  const selectedCategory = typeof firstValue === "string" ? firstValue : "";

  return (
    <Select
      value={selectedCategory}
      disabled={props.readOnly}
      onChange={(event) => {
        const value = event.currentTarget.value;
        props.onChange(PatchEvent.from(value ? set([value]) : unset()));
      }}
    >
      <option value="">Choose a photo category</option>
      {GALLERY_CATEGORIES.map((category) => (
        <option key={category.value} value={category.value}>
          {category.title}
        </option>
      ))}
    </Select>
  );
}
