import type { TemplePhoto, TempleVideo } from "@/lib/media";
import type { FestivalUpdate, TempleUpdate } from "@/lib/updates";

export type CmsContent = {
  gallery: TemplePhoto[];
  videos: TempleVideo[];
  festivals: FestivalUpdate[];
  updates: TempleUpdate[];
};
