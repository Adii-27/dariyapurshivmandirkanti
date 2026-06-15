import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import {
  GALLERY_PREVIEW,
  type GalleryCategory,
  type TemplePhoto,
  TEMPLE_PHOTOS,
} from "@/lib/media";
import { Section, SectionHeading } from "./Section";

type Filter = "All" | GalleryCategory;

const categories: Filter[] = [
  "All",
  "Day",
  "Evening",
  "Night",
  "Exterior",
  "Interior",
  "Festivals",
];

export function Gallery({ photos = TEMPLE_PHOTOS }: { photos?: TemplePhoto[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const preview = useMemo(
    () => (photos === TEMPLE_PHOTOS ? GALLERY_PREVIEW : photos.slice(0, 8)),
    [photos],
  );

  const visible = useMemo(() => {
    if (filter !== "All") {
      return photos.filter((photo) => photo.categories.includes(filter));
    }
    return expanded ? photos : preview;
  }, [expanded, filter, photos, preview]);

  const next = useCallback(
    () => setOpenIdx((index) => (index === null ? null : (index + 1) % visible.length)),
    [visible.length],
  );
  const prev = useCallback(
    () =>
      setOpenIdx((index) =>
        index === null ? null : (index - 1 + visible.length) % visible.length,
      ),
    [visible.length],
  );

  useEffect(() => {
    if (openIdx !== null && !visible[openIdx]) setOpenIdx(null);
  }, [openIdx, visible]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIdx(null);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [next, openIdx, prev]);

  return (
    <Section id="gallery" className="bg-secondary/40">
      <SectionHeading
        eyebrow="Temple Gallery"
        title="Moments of Devotion"
        hindi="मंदिर दर्शन वीथिका"
      >
        A preview of authentic temple photographs, with the complete day, evening, night, exterior,
        interior and festival collection available below.
      </SectionHeading>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setFilter(category);
              setOpenIdx(null);
            }}
            className={`interactive-surface min-h-11 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
              filter === category
                ? "border-saffron-deep bg-saffron-deep text-cream shadow-sacred"
                : "border-border bg-card text-ink/70 hover:border-gold hover:text-saffron-deep"
            }`}
            aria-pressed={filter === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((photo, index) => (
          <motion.button
            key={photo.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
            onClick={() => setOpenIdx(index)}
            whileTap={{ scale: 0.985, opacity: 0.92 }}
            className={`group interactive-surface relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm hover:border-gold/50 hover:shadow-sacred ${
              filter === "All" && index === 0
                ? "col-span-2 row-span-2 sm:aspect-[4/3] lg:aspect-square"
                : ""
            }`}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              loading={index < 4 ? "eager" : "lazy"}
              fetchPriority={index < 2 ? "high" : "auto"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="touch-overlay absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <div className="touch-caption absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <div className="text-[10px] uppercase tracking-widest text-gold-soft">
                {photo.categories.join(" · ")}
              </div>
              <div className="mt-0.5 text-sm font-medium text-cream">{photo.caption}</div>
              <div className="font-hindi text-xs text-cream/80">{photo.hindi}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {filter === "All" && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-full gradient-saffron px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sacred"
          >
            <Images className="h-4 w-4" />
            {expanded ? "Show Gallery Preview" : "View Complete Gallery"}
          </button>
        </div>
      )}

      <AnimatePresence>
        {openIdx !== null && visible[openIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/85 p-3 backdrop-blur-xl sm:p-4"
            onClick={() => setOpenIdx(null)}
            role="dialog"
            aria-modal="true"
            aria-label={visible[openIdx].caption}
          >
            <button
              type="button"
              autoFocus
              onClick={(event) => {
                event.stopPropagation();
                setOpenIdx(null);
              }}
              aria-label="Close gallery"
              className="interactive-surface absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur hover:bg-cream/25 sm:right-5 sm:top-5"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-cream backdrop-blur transition-colors duration-300 hover:bg-ink/75 sm:left-5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-cream backdrop-blur transition-colors duration-300 hover:bg-ink/75 sm:right-5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <motion.div
              key={visible[openIdx].id}
              initial={{ scale: 0.94, opacity: 0, rotate: -0.35, y: 8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.965, opacity: 0, rotate: 0.6, y: 8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[85dvh] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl shadow-glow sm:max-w-5xl"
            >
              <img
                src={visible[openIdx].src}
                alt={visible[openIdx].caption}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="max-h-[85dvh] max-w-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink to-transparent p-5 text-cream">
                <div className="text-[10px] uppercase tracking-widest text-gold-soft">
                  {visible[openIdx].categories.join(" · ")} · {openIdx + 1} / {visible.length}
                </div>
                <p className="mt-1 font-display text-lg">{visible[openIdx].caption}</p>
                <p className="font-hindi text-sm text-cream/80">{visible[openIdx].hindi}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
