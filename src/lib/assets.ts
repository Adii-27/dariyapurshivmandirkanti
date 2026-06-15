import bannerAsset from "@/assets/banner.png.asset.json";
import logoAsset from "@/assets/logo.png.asset.json";

import exterior1 from "@/assets/gallery/exterior1.jpg.asset.json";
import exterior2 from "@/assets/gallery/exterior2.jpg.asset.json";
import exterior3 from "@/assets/gallery/exterior3.jpg.asset.json";
import day1 from "@/assets/gallery/day1.jpg.asset.json";
import day2 from "@/assets/gallery/day2.jpg.asset.json";
import evening1 from "@/assets/gallery/evening1.jpg.asset.json";
import night1 from "@/assets/gallery/night1.jpg.asset.json";
import interior1 from "@/assets/gallery/interior1.jpg.asset.json";
import interior2 from "@/assets/gallery/interior2.jpg.asset.json";
import interior3 from "@/assets/gallery/interior3.jpg.asset.json";
import festival1 from "@/assets/gallery/festival1.jpg.asset.json";
import festival2 from "@/assets/gallery/festival2.jpg.asset.json";
import festival3 from "@/assets/gallery/festival3.jpg.asset.json";
import festival4 from "@/assets/gallery/festival4.jpg.asset.json";

export const ASSETS = {
  images: {
    banner: bannerAsset,
    logo: logoAsset,
    gallery: {
      exterior: [exterior1, exterior2, exterior3],
      day: [day1, day2],
      evening: evening1,
      night: night1,
      interior: [interior1, interior2, interior3],
      festival: [festival1, festival2, festival3, festival4],
    },
  },
} as const;

export type AssetType = typeof ASSETS;
