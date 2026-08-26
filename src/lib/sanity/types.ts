import type { TemplePhoto, TempleVideo } from "@/lib/media";
import type { TempleFaq } from "@/lib/faq";
import type { FestivalUpdate, TempleUpdate } from "@/lib/updates";

export type CmsContent = {
  gallery: TemplePhoto[];
  videos: TempleVideo[];
  festivals: FestivalUpdate[];
  updates: TempleUpdate[];
  faqs: TempleFaq[];
};
