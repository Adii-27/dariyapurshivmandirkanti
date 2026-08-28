import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Camera,
  ChevronDown,
  ExternalLink,
  Layers,
  MapPin,
  Maximize2,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import type { WikimediaFile } from "@/lib/wikimedia/commons";
import { useLanguage } from "@/lib/i18n";

export function WikimediaImageModal({
  file,
  onClose,
}: {
  file: WikimediaFile | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [showTechnical, setShowTechnical] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!file) return;

    previousFocusRef.current = (document.activeElement as HTMLElement) || null;

    // Reset technical accordion on new file
    setShowTechnical(false);

    // Lock body scroll with scrollbar compensation to prevent horizontal page jump
    const previousOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousPaddingRight = document.body.style.paddingRight;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    // Focus close button smoothly
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 40);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (
            document.activeElement === last ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [file, onClose]);

  const tech = file?.technicalMetadata;
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
      {file && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop (solid translucent on mobile, light blur on desktop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/80 sm:backdrop-blur-sm"
          />

          {/* Modal Window (lightweight GPU-accelerated transition) */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-gold/40 bg-card shadow-sacred transform-gpu"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-border/80 bg-cream/90 px-4 py-3 sm:px-6 sm:py-3.5">
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
                className="interactive-surface grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-secondary/60 text-ink/80 hover:bg-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="modal-scroll flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
                {/* Left Column: Image Preview & Direct Actions */}
                <div className="space-y-4">
                  <div
                    className="relative flex max-h-[56vh] min-h-[220px] sm:min-h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-ink/95 shadow-inner"
                    style={{
                      aspectRatio:
                        file.width && file.height ? `${file.width} / ${file.height}` : undefined,
                    }}
                  >
                    <img
                      src={file.thumbnailUrl}
                      alt={file.caption || file.title}
                      loading="eager"
                      decoding="async"
                      width={file.width || 800}
                      height={file.height || 600}
                      className="max-h-[54vh] w-auto max-w-full object-contain"
                    />
                    <div className="absolute bottom-3 right-3">
                      <a
                        href={file.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactive-surface inline-flex items-center gap-1.5 rounded-lg bg-ink/80 px-2.5 py-1.5 text-xs font-medium text-cream shadow-sm backdrop-blur-sm hover:bg-ink"
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
                      {t.heritage.exploreCommonsBtn}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>

                    <a
                      href={file.mediaViewerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-center text-xs font-semibold text-ink hover:border-gold hover:bg-secondary"
                    >
                      {t.heritage.openMediaViewer}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Right Column: Structured Metadata */}
                <div className="space-y-5">
                  <div>
                    <h3
                      id="modal-title"
                      className="font-display text-xl font-bold leading-snug text-ink sm:text-2xl"
                    >
                      {file.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {file.description}
                    </p>
                  </div>

                  {/* Fact Badges List */}
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {file.date && (
                      <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/40 p-3">
                        <Calendar className="h-4 w-4 shrink-0 text-saffron-deep" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {t.heritage.capturedDateLabel}
                          </div>
                          <div className="truncate text-xs font-semibold text-ink">
                            {file.date}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/40 p-3">
                      <User className="h-4 w-4 shrink-0 text-saffron-deep" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {t.heritage.contributorLabel}
                        </div>
                        <div className="truncate text-xs font-semibold text-ink">
                          {file.author}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/40 p-3">
                      <MapPin className="h-4 w-4 shrink-0 text-saffron-deep" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {t.heritage.locationLabel}
                        </div>
                        <div className="truncate text-xs font-semibold text-ink">
                          {t.heritage.locationValue}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/40 p-3">
                      <Layers className="h-4 w-4 shrink-0 text-saffron-deep" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {t.heritage.dimensionsLabel}
                        </div>
                        <div className="truncate text-xs font-semibold text-ink">
                          {file.width && file.height
                            ? `${file.width} × ${file.height} px`
                            : "Original"}
                          {file.fileSizeFormatted ? ` • ${file.fileSizeFormatted}` : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GPS Coordinates (if available) */}
                  {file.coordinates && (
                    <div className="flex items-center justify-between rounded-xl border border-gold/40 bg-gold-soft/20 p-3 text-xs">
                      <div className="flex items-center gap-2 text-ink">
                        <MapPin className="h-4 w-4 shrink-0 text-saffron-deep" />
                        <div>
                          <span className="font-semibold">GPS: </span>
                          <span className="font-mono text-[11px]">
                            {file.coordinates.formatted}
                          </span>
                        </div>
                      </div>
                      <a
                        href={file.coordinates.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-saffron-deep underline-offset-4 hover:underline"
                      >
                        Map ↗
                      </a>
                    </div>
                  )}

                  {/* Licensing Panel */}
                  <div className="rounded-2xl border border-gold/40 bg-card p-4 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-saffron-deep" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-saffron-deep">
                          {t.heritage.licensingTitle}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-ink">
                          {file.licenseName} ({file.license})
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          {t.heritage.licensingDesc}
                        </p>
                        {file.licenseUrl && (
                          <a
                            href={file.licenseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-saffron-deep underline-offset-4 hover:underline"
                          >
                            {t.heritage.readLicenseTerms}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Technical EXIF Metadata */}
                  {hasTech && tech && (
                    <div className="rounded-2xl border border-border bg-secondary/30">
                      <button
                        type="button"
                        onClick={() => setShowTechnical(!showTechnical)}
                        className="interactive-surface flex w-full items-center justify-between p-3.5 text-left text-xs font-semibold text-ink hover:bg-secondary/60 rounded-2xl"
                      >
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-saffron-deep" />
                          <span>{t.heritage.technicalExifLabel}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                            showTechnical ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showTechnical && (
                        <div className="border-t border-border/60 p-3.5">
                          <dl className="grid grid-cols-2 gap-2 text-xs">
                            {tech.cameraMake && (
                              <div>
                                <dt className="text-[10px] uppercase text-muted-foreground">
                                  Camera Make
                                </dt>
                                <dd className="font-semibold text-ink">{tech.cameraMake}</dd>
                              </div>
                            )}
                            {tech.cameraModel && (
                              <div>
                                <dt className="text-[10px] uppercase text-muted-foreground">
                                  Model
                                </dt>
                                <dd className="font-semibold text-ink">{tech.cameraModel}</dd>
                              </div>
                            )}
                            {tech.aperture && (
                              <div>
                                <dt className="text-[10px] uppercase text-muted-foreground">
                                  Aperture
                                </dt>
                                <dd className="font-semibold text-ink">{tech.aperture}</dd>
                              </div>
                            )}
                            {tech.exposureTime && (
                              <div>
                                <dt className="text-[10px] uppercase text-muted-foreground">
                                  Exposure
                                </dt>
                                <dd className="font-semibold text-ink">{tech.exposureTime}</dd>
                              </div>
                            )}
                            {tech.iso && (
                              <div>
                                <dt className="text-[10px] uppercase text-muted-foreground">ISO</dt>
                                <dd className="font-semibold text-ink">{tech.iso}</dd>
                              </div>
                            )}
                            {tech.focalLength && (
                              <div>
                                <dt className="text-[10px] uppercase text-muted-foreground">
                                  Focal Length
                                </dt>
                                <dd className="font-semibold text-ink">{tech.focalLength}</dd>
                              </div>
                            )}
                            {tech.software && (
                              <div className="col-span-2">
                                <dt className="text-[10px] uppercase text-muted-foreground">
                                  Software / Device OS
                                </dt>
                                <dd className="font-semibold text-ink truncate">{tech.software}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
