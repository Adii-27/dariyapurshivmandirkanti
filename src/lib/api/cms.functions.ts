import { createServerFn } from "@tanstack/react-start";
import type { CmsContent } from "@/lib/sanity/types";

export const getCmsContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<CmsContent | null> => {
    const { getCmsContentFromSanity } = await import("@/lib/sanity/cms.server");
    return getCmsContentFromSanity();
  },
);
