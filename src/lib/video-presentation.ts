import type { TempleVideo } from "./media";

const PORTRAIT_RATIO = 9 / 16;
const LANDSCAPE_RATIO = 16 / 9;

export function getInitialVideoAspectRatio(video: TempleVideo) {
  try {
    const url = new URL(video.src);
    if (url.pathname.startsWith("/shorts/")) return PORTRAIT_RATIO;
  } catch {
    // Non-URL video sources are handled by the native metadata event.
  }

  return video.embedUrl ? LANDSCAPE_RATIO : PORTRAIT_RATIO;
}

export function isPortraitRatio(aspectRatio: number) {
  return aspectRatio < 1;
}
