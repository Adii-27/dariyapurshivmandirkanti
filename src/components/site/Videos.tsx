import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Play, X } from "lucide-react";
import type { TempleVideo, VideoCategory } from "@/lib/media";
import { getInitialVideoAspectRatio, isPortraitRatio } from "@/lib/video-presentation";
import { Section, SectionHeading } from "./Section";

type Filter = "All Videos" | VideoCategory;
type MobileFullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};
type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: "portrait" | "landscape") => Promise<void>;
  unlock?: () => void;
};

const filters: Filter[] = [
  "All Videos",
  "Temple Introduction",
  "Highlights",
  "Festivals & Events Activities",
];

export function Videos({ videos = [] }: { videos?: TempleVideo[] }) {
  const [filter, setFilter] = useState<Filter>("All Videos");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(9 / 16);
  const [cardAspectRatios, setCardAspectRatios] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);

  const visible = useMemo(
    () => (filter === "All Videos" ? videos : videos.filter((video) => video.category === filter)),
    [filter, videos],
  );

  useEffect(() => {
    if (openIdx !== null && !visible[openIdx]) setOpenIdx(null);
  }, [openIdx, visible]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIdx(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx]);

  const activeVideo = openIdx === null ? null : visible[openIdx];
  const videoOrientation = videoAspectRatio < 1 ? "portrait" : "landscape";

  useEffect(() => {
    if (!activeVideo) return;
    const player = playerRef.current;
    if (!player) return;

    const onFullscreenChange = () => {
      const fullscreen = document.fullscreenElement === player;
      setIsFullscreen(fullscreen);
      if (!fullscreen) {
        (screen.orientation as LockableScreenOrientation | undefined)?.unlock?.();
      }
    };
    const onWebkitBeginFullscreen = () => setIsFullscreen(true);
    const onWebkitEndFullscreen = () => setIsFullscreen(false);

    document.addEventListener("fullscreenchange", onFullscreenChange);
    player.addEventListener("webkitbeginfullscreen", onWebkitBeginFullscreen);
    player.addEventListener("webkitendfullscreen", onWebkitEndFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      player.removeEventListener("webkitbeginfullscreen", onWebkitBeginFullscreen);
      player.removeEventListener("webkitendfullscreen", onWebkitEndFullscreen);
      (screen.orientation as LockableScreenOrientation | undefined)?.unlock?.();
    };
  }, [activeVideo]);

  const enterFullscreen = async () => {
    const player = playerRef.current as MobileFullscreenVideo | null;
    if (!player) return;

    try {
      if (player.requestFullscreen) {
        await player.requestFullscreen();
        setIsFullscreen(true);
        const orientation = screen.orientation as LockableScreenOrientation | undefined;
        await orientation?.lock?.(videoOrientation);
      } else {
        player.webkitEnterFullscreen?.();
      }
    } catch {
      // Browsers that reject explicit orientation locking still preserve the video's aspect ratio.
    }
  };

  return (
    <Section id="videos" className="bg-gradient-to-b from-cream via-secondary/30 to-cream">
      <SectionHeading
        eyebrow="Temple Videos"
        title="Temple Video Gallery"
        hindi="मंदिर वीडियो संग्रह"
      >
        Watch the official temple introduction and all five uploaded highlights, with dedicated
        space prepared for future festival and event activity updates.
      </SectionHeading>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setFilter(item);
              setOpenIdx(null);
            }}
            className={`interactive-surface min-h-11 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
              filter === item
                ? "border-saffron-deep bg-saffron-deep text-cream shadow-sacred"
                : "border-border bg-card text-ink/70 hover:border-gold hover:text-saffron-deep"
            }`}
            aria-pressed={filter === item}
          >
            {item}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-12 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((video, index) => {
            const cardAspectRatio = cardAspectRatios[video.id] ?? getInitialVideoAspectRatio(video);

            return (
              <motion.button
                key={video.id}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.985, opacity: 0.92 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
                onClick={() => {
                  setVideoAspectRatio(cardAspectRatio);
                  setOpenIdx(index);
                }}
                style={{ aspectRatio: cardAspectRatio }}
                className="group relative w-full overflow-hidden rounded-3xl border border-gold/40 bg-ink text-left shadow-sacred transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-gold/70 hover:shadow-glow focus-visible:ring-offset-2"
                aria-label={`Play video: ${video.title}`}
                data-orientation={isPortraitRatio(cardAspectRatio) ? "portrait" : "landscape"}
              >
                {video.poster ? (
                  <img
                    src={video.poster}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onLoad={(event) => {
                      if (video.embedUrl) return;
                      const { naturalWidth, naturalHeight } = event.currentTarget;
                      if (naturalWidth > 0 && naturalHeight > 0) {
                        setCardAspectRatios((current) => ({
                          ...current,
                          [video.id]: naturalWidth / naturalHeight,
                        }));
                      }
                    }}
                    className="absolute inset-0 h-full w-full object-contain opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                  />
                ) : !video.embedUrl ? (
                  <video
                    src={`${video.src}#t=0.1`}
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    onLoadedMetadata={(event) => {
                      const { videoWidth, videoHeight } = event.currentTarget;
                      if (videoWidth > 0 && videoHeight > 0) {
                        setCardAspectRatios((current) => ({
                          ...current,
                          [video.id]: videoWidth / videoHeight,
                        }));
                      }
                    }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-cream/95 text-saffron-deep shadow-sacred ring-4 ring-cream/30 transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
                    <Play className="ml-1 h-8 w-8 fill-current" />
                  </div>
                </div>

                {video.duration && (
                  <div className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold text-cream backdrop-blur">
                    {video.duration}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-[10px] uppercase tracking-widest text-gold-soft">
                    {video.category}
                  </div>
                  <div className="mt-0.5 font-display text-xl font-semibold leading-tight text-cream">
                    {video.title}
                  </div>
                  <div className="font-hindi text-sm text-cream/80">{video.hindi}</div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-cream/70">
                    {video.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div
          className="mx-auto mt-12 max-w-xl rounded-3xl border border-dashed border-gold/60 bg-card/70 p-8 text-center"
          role="status"
        >
          <h3 className="font-display text-2xl font-semibold text-ink">
            Festivals & Events Activities
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            New festival and event videos will appear here as they are published.
          </p>
        </div>
      )}

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed inset-0 z-[70] grid place-items-center bg-ink/90 p-3 backdrop-blur-xl sm:p-5"
            onClick={() => setOpenIdx(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeVideo.title}
          >
            <button
              type="button"
              autoFocus
              onClick={(event) => {
                event.stopPropagation();
                setOpenIdx(null);
              }}
              aria-label="Close video"
              className="interactive-surface absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur hover:bg-cream/25 sm:right-5 sm:top-5"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              key={activeVideo.id}
              initial={{ scale: 0.94, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.965, opacity: 0, y: 8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              style={{
                aspectRatio: videoAspectRatio,
                width: `min(94vw, 64rem, calc(82dvh * ${videoAspectRatio}))`,
              }}
              className="relative overflow-hidden rounded-2xl bg-transparent shadow-[0_0_48px_rgba(245,158,11,0.28)] ring-1 ring-gold/35"
            >
              {activeVideo.embedUrl ? (
                <iframe
                  src={`${activeVideo.embedUrl}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0 bg-black"
                />
              ) : (
                <video
                  ref={playerRef}
                  src={activeVideo.src}
                  poster={activeVideo.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(event) => {
                    const { videoWidth, videoHeight } = event.currentTarget;
                    if (videoWidth > 0 && videoHeight > 0) {
                      setVideoAspectRatio(videoWidth / videoHeight);
                    }
                  }}
                  data-orientation={videoOrientation}
                  className={`block bg-black ${
                    isFullscreen
                      ? "fixed inset-0 h-screen w-screen object-contain"
                      : "absolute inset-0 h-full w-full object-contain"
                  }`}
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-ink/80 to-transparent p-4 pb-10 text-cream">
                <div className="min-w-0 drop-shadow">
                  <div className="truncate pr-28 font-display text-base font-semibold sm:text-lg">
                    {activeVideo.title}
                  </div>
                  <div className="font-hindi truncate pr-28 text-xs text-cream/80">
                    {activeVideo.hindi}
                  </div>
                </div>
              </div>
              {!activeVideo.embedUrl && (
                <button
                  type="button"
                  onClick={enterFullscreen}
                  className="absolute right-3 top-3 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cream backdrop-blur transition-colors duration-300 hover:bg-ink/80 focus-visible:ring-cream"
                  aria-label="Play video fullscreen"
                >
                  <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
