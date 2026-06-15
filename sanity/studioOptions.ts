export const GALLERY_CATEGORIES = [
  { title: "Day View", value: "day" },
  { title: "Evening View", value: "evening" },
  { title: "Night View", value: "night" },
  { title: "Exterior View", value: "exterior" },
  { title: "Interior View", value: "interior" },
  { title: "Festival Images", value: "festivals" },
];

export const VIDEO_CATEGORIES = [
  { title: "Temple Introduction", value: "introduction" },
  { title: "Highlights", value: "highlights" },
  { title: "Festivals & Events Activities", value: "festivals-events" },
];

export function getGalleryCategoryTitle(value?: string) {
  return GALLERY_CATEGORIES.find((category) => category.value === value)?.title;
}

export function getVideoCategoryTitle(value?: string) {
  return VIDEO_CATEGORIES.find((category) => category.value === value)?.title;
}
