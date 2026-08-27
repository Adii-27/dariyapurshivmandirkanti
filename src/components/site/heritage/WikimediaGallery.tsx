import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Maximize2 } from "lucide-react";
import type { WikimediaFile } from "@/lib/wikimedia/commons";
import { WikimediaImageModal } from "./WikimediaImageModal";

export function WikimediaGallery({ files }: { files: WikimediaFile[] }) {
  const [selectedFile, setSelectedFile] = useState<WikimediaFile | null>(null);

  if (!files.length) return null;

  const featured = files[0];
  const supporting = files.slice(1);

  return (
    <div>
      {/* Editorial Grid: Featured Item + Supporting Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Featured Image Card */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedFile(featured)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedFile(featured);
                }
              }}
              aria-label={`View photo details: ${featured.title}`}
              className="interactive-surface relative flex h-full min-h-[320px] sm:min-h-[420px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-gold/50 bg-card shadow-sm hover:border-gold hover:shadow-sacred focus-visible:outline-2 focus-visible:outline-ring"
            >
              <img
                src={featured.thumbnailUrl}
                alt={featured.caption || featured.title}
                loading="lazy"
                decoding="async"
                width={featured.width || 800}
                height={featured.height || 600}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

              {/* Badges */}
              <div className="absolute left-4 top-4 right-4 flex items-center justify-between gap-2 sm:left-6 sm:top-6 sm:right-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-semibold tracking-wider text-gold-soft backdrop-blur-sm">
                  <Camera className="h-3 w-3 text-gold" />
                  Featured Wikimedia Media
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-cream/90 px-2.5 py-0.5 text-[10px] font-bold text-ink shadow-sm">
                  {featured.license}
                </div>
              </div>

              {/* Caption Content */}
              <div className="relative p-5 text-cream sm:p-7">
                <div className="flex items-center gap-2 text-xs text-gold-soft">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <span>Dariyapur, Kanti</span>
                  {featured.date && (
                    <>
                      <span>•</span>
                      <span>{featured.date}</span>
                    </>
                  )}
                </div>

                <h3 className="mt-1.5 font-display text-xl font-bold leading-snug sm:text-2xl lg:text-3xl text-cream">
                  {featured.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-cream/80 sm:text-sm">
                  {featured.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gold-soft">
                  <span>Click to explore metadata &amp; licensing</span>
                  <Maximize2 className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Supporting Image Cards */}
        {supporting.map((file, idx) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (idx % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedFile(file)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedFile(file);
                }
              }}
              aria-label={`View photo details: ${file.title}`}
              className="interactive-surface relative flex aspect-[4/3] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:border-gold/60 hover:shadow-sacred focus-visible:outline-2 focus-visible:outline-ring"
            >
              <img
                src={file.thumbnailUrl}
                alt={file.caption || file.title}
                loading="lazy"
                decoding="async"
                width={file.width || 800}
                height={file.height || 600}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

              {/* Badges */}
              <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-medium text-gold-soft backdrop-blur-sm">
                  Wikimedia
                </span>
                <span className="inline-flex items-center rounded-full bg-cream/90 px-2 py-0.5 text-[10px] font-bold text-ink shadow-sm">
                  {file.license}
                </span>
              </div>

              {/* Title & Info */}
              <div className="relative p-3.5 text-cream sm:p-4">
                <h4 className="font-display text-sm font-semibold leading-snug line-clamp-1 sm:text-base text-cream">
                  {file.title}
                </h4>
                <div className="mt-1 flex items-center justify-between text-[11px] text-cream/75">
                  <span className="truncate">{file.date || "Wikimedia Commons"}</span>
                  <span className="flex items-center gap-1 font-medium text-gold-soft group-hover:underline">
                    Details <Maximize2 className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Details Modal */}
      <WikimediaImageModal file={selectedFile} onClose={() => setSelectedFile(null)} />
    </div>
  );
}
