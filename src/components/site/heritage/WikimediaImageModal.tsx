import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Camera,
  ChevronDown,
  ExternalLink,
  FileText,
  Info,
  Layers,
  MapPin,
  Maximize2,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import type { WikimediaFile } from "@/lib/wikimedia/commons";

export function WikimediaImageModal({
  file,
  onClose,
}: {
  file: WikimediaFile | null;
  onClose: () => void;
}) {
  const [showTechnical, setShowTechnical] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!file) return;

    // Lock body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [file, onClose]);

  if (!file) return null;

  const tech = file.technicalMetadata;
  const hasTech = Boolean(
    tech &&
      (tech.cameraMake ||
        tech.cameraModel ||
        tech.iso ||
        tech.aperture ||
        tech.exposureTime ||
        tech.focalLength ||
        tech.dateTimeOriginal),
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-gold/40 bg-card shadow-sacred"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/80 bg-cream/80 px-5 py-3.5 backdrop-blur sm:px-6">
            <div className="flex items-center gap-2.5">
              <img
                src="/wikimedia-commons-logo.svg"
                alt=""
                className="h-5 w-5 object-contain"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-saffron-deep">
                Wikimedia Commons Media
              </span>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close image details"
              className="interactive-surface grid h-11 w-11 place-items-center rounded-full bg-secondary/60 text-ink/80 hover:bg-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="modal-scroll flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
              {/* Left Column: Image Preview & Direct Actions */}
              <div className="space-y-4">
                <div className="relative flex aspect-auto max-h-[60vh] min-h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-ink/95 shadow-inner">
                  <img
                    src={file.thumbnailUrl}
                    alt={file.caption || file.title}
                    loading="eager"
                    decoding="async"
                    className="max-h-[58vh] w-auto max-w-full object-contain"
                  />
                  <div className="absolute bottom-3 right-3">
                    <a
                      href={file.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive-surface inline-flex items-center gap-1.5 rounded-lg bg-ink/75 px-3 py-1.5 text-xs font-medium text-cream shadow-sm backdrop-blur hover:bg-ink"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      Original on Commons
                    </a>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <a
                    href={file.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-surface inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl gradient-saffron px-4 py-2.5 text-center text-xs font-semibold text-primary-foreground shadow-sacred hover:shadow-glow"
                  >
                    View on Wikimedia Commons
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>

                  <a
                    href={file.mediaViewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-center text-xs font-semibold text-ink hover:border-gold hover:bg-secondary"
                  >
                    Open Media Viewer
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>

                  <a
                    href={file.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-center text-xs font-semibold text-ink hover:border-gold hover:bg-secondary"
                  >
                    View Original on Wikimedia Commons
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Right Column: Structured Metadata */}
              <div className="space-y-5">
                {/* Title & Description */}
                <div>
                  <h3
                    id="modal-title"
                    className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl"
                  >
                    {file.title}
                  </h3>
                  {file.description && file.description !== file.title && (
                    <p className="mt-2.5 text-sm leading-relaxed text-ink/80">
                      {file.description}
                    </p>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="grid gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4 text-xs">
                  {file.date && (
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                      <div>
                        <span className="font-semibold text-ink">Date: </span>
                        <span className="text-muted-foreground">{file.date}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                    <div>
                      <span className="font-semibold text-ink">Author: </span>
                      <span className="text-muted-foreground">{file.author}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                    <div>
                      <span className="font-semibold text-ink">Source: </span>
                      <span className="text-muted-foreground">{file.source}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                    <div>
                      <span className="font-semibold text-ink">Location: </span>
                      <span className="text-muted-foreground">{file.location}</span>
                    </div>
                  </div>

                  {file.coordinates && (
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                      <div>
                        <span className="font-semibold text-ink">Camera Coordinates: </span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {file.coordinates.formatted}
                        </span>{" "}
                        <a
                          href={file.coordinates.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 font-semibold text-saffron-deep underline underline-offset-2 hover:text-ember"
                        >
                          View Map ↗
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Layers className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                    <div>
                      <span className="font-semibold text-ink">File Specs: </span>
                      <span className="text-muted-foreground">
                        {file.width.toLocaleString()} × {file.height.toLocaleString()} px ·{" "}
                        {file.fileSizeFormatted} · {file.mimeType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* License Information */}
                <div className="rounded-2xl border border-gold/40 bg-gold-soft/30 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-saffron-deep" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-saffron-deep">
                        Licensing
                      </div>
                      <p className="mt-1 text-xs font-semibold text-ink">
                        {file.licenseName} ({file.license})
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        This file is licensed under the Creative Commons license above as published on Wikimedia Commons.
                      </p>
                      {file.licenseUrl && (
                        <div className="mt-2">
                          <a
                            href={file.licenseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-deep hover:underline"
                          >
                            View License Terms
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical EXIF Metadata (Collapsible) */}
                {hasTech && tech && (
                  <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowTechnical((prev) => !prev)}
                      aria-expanded={showTechnical}
                      className="interactive-surface flex min-h-11 w-full items-center justify-between px-4 py-3 text-left text-xs font-semibold text-ink hover:bg-secondary/40"
                    >
                      <span className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-saffron-deep" />
                        Technical Metadata (EXIF)
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                          showTechnical ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showTechnical && (
                      <div className="border-t border-border/60 bg-secondary/20 p-4 text-xs space-y-2">
                        {tech.cameraMake && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Camera Make:</span>
                            <span className="font-semibold text-ink">{tech.cameraMake}</span>
                          </div>
                        )}
                        {tech.cameraModel && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Camera Model:</span>
                            <span className="font-semibold text-ink">{tech.cameraModel}</span>
                          </div>
                        )}
                        {tech.iso && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ISO Speed:</span>
                            <span className="font-semibold text-ink">{tech.iso}</span>
                          </div>
                        )}
                        {tech.aperture && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Aperture:</span>
                            <span className="font-semibold text-ink">{tech.aperture}</span>
                          </div>
                        )}
                        {tech.exposureTime && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Exposure Time:</span>
                            <span className="font-semibold text-ink">{tech.exposureTime}</span>
                          </div>
                        )}
                        {tech.focalLength && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Focal Length:</span>
                            <span className="font-semibold text-ink">{tech.focalLength}</span>
                          </div>
                        )}
                        {tech.dateTimeOriginal && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Capture Time:</span>
                            <span className="font-semibold text-ink">{tech.dateTimeOriginal}</span>
                          </div>
                        )}
                        {tech.software && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Software:</span>
                            <span className="font-semibold text-ink">{tech.software}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
