import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Section, SectionHeading } from "./Section";

const STREET_VIEW_URL = "https://maps.app.goo.gl/vGTVsEXAFpj2MoNJ6";
const STREET_VIEW_EMBED =
  "https://www.google.com/maps/embed?pb=!4v1781246400000!6m8!1m7!1sLlVHTk5CHQ3BMBso2Fd39Q!2m2!1d26.1581116!2d85.3053131!3f254.31!4f0!5f0.7820865974627469";

export function VirtualDarshan() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);
  const cleanupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
      if (cleanupTimerRef.current) window.clearTimeout(cleanupTimerRef.current);
    };
  }, []);

  const handleStartDarshan = () => {
    if (isTransitioning || isOpen) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsOpen(true);
      return;
    }

    setIsTransitioning(true);

    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    if (cleanupTimerRef.current) window.clearTimeout(cleanupTimerRef.current);

    transitionTimerRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 1250);

    cleanupTimerRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 1550);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsTransitioning(false);
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
      if (cleanupTimerRef.current) window.clearTimeout(cleanupTimerRef.current);
    }
  };

  return (
    <Section id="darshan">
      <SectionHeading
        eyebrow="Virtual Darshan"
        title="Step Inside, Anywhere in the World"
        hindi="आभासी दर्शन"
      >
        Open the interactive Street View to look around the temple entrance and grounds from your
        phone, tablet or desktop.
      </SectionHeading>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "360° View",
            d: "Pan around the temple in full panoramic detail.",
            k: "Drag to rotate",
          },
          {
            t: "Zoom & Explore",
            d: "Look closer at the shikhara, garden and entrance.",
            k: "Scroll to zoom",
          },
          {
            t: "Anywhere, Anytime",
            d: "Take darshan from your phone, tablet or desktop.",
            k: "Fully responsive",
          },
        ].map((card) => (
          <div
            key={card.t}
            className="interactive-surface rounded-2xl border border-border bg-card/70 p-5 backdrop-blur hover:border-gold/50 hover:shadow-sm"
          >
            <div className="font-display text-lg font-semibold text-ink">{card.t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{card.d}</p>
            <p className="mt-3 text-[11px] uppercase tracking-widest text-saffron-deep">{card.k}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <motion.button
          type="button"
          disabled={isTransitioning}
          onClick={handleStartDarshan}
          whileHover={isTransitioning ? {} : { scale: 1.04 }}
          whileTap={isTransitioning ? {} : { scale: 0.98 }}
          className="inline-flex min-h-12 items-center gap-2 rounded-full gradient-saffron px-8 py-4 text-base font-semibold text-primary-foreground shadow-sacred transition-opacity duration-300 disabled:opacity-85"
        >
          <Sparkles className="h-5 w-5" />
          {isTransitioning ? "Opening Virtual Darshan…" : "View Virtual Darshan"}
        </motion.button>
        <p className="mt-3 text-xs text-muted-foreground">
          Opens a responsive interactive temple view.
        </p>
      </div>

      {/* Cinematic Dimensional Portal Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="virtual-darshan-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink pointer-events-auto"
            aria-live="polite"
            role="status"
          >
            {/* 1. Deep Atmospheric Sacred Vignette */}
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.08 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,24,11,0.75)_0%,rgba(20,10,4,0.95)_60%,rgba(8,3,1,0.99)_100%)] pointer-events-none"
            />

            {/* 2. Soft Expanding Divine Saffron / Gold Light Aura */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.3, 1.4, 2.2], opacity: [0, 0.85, 0.2] }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.14_85/0.45)_0%,oklch(0.74_0.18_55/0.25)_45%,transparent_70%)] blur-2xl pointer-events-none"
            />

            {/* 3. Concentric Golden Aura Ring 1 */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.6], opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="absolute h-72 w-72 rounded-full border border-gold/40 shadow-[0_0_60px_oklch(0.74_0.18_55/0.35)] pointer-events-none"
            />

            {/* 4. Concentric Saffron Aura Ring 2 */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 2.0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute h-80 w-80 rounded-full border border-saffron/30 shadow-[0_0_80px_oklch(0.82_0.14_85/0.25)] pointer-events-none"
            />

            {/* 5. Center Sacred Light & Divine Focus */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: [0, 1, 1, 0.8], scale: [0.88, 1, 1.04], y: 0 }}
              transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center px-6 text-center"
            >
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-saffron/20 to-gold/30 ring-1 ring-gold/40 shadow-glow">
                <Sparkles className="h-8 w-8 text-gold-soft animate-pulse" />
              </div>
              <div className="font-hindi text-xl font-medium tracking-wide text-gold-soft sm:text-2xl">
                ॐ नमः शिवाय
              </div>
              <div className="mt-2 font-display text-sm font-semibold tracking-widest uppercase text-cream/90 sm:text-base">
                Entering Virtual Darshan
              </div>
              <div className="mt-1 font-hindi text-xs tracking-wider text-gold-soft/70">
                दरियापुर शिव मंदिर काँटी
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="h-[88dvh] w-[calc(100%-1.5rem)] max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-2xl border-gold/40 bg-ink p-0 text-cream shadow-glow sm:w-[calc(100%-3rem)]">
          <DialogDescription className="sr-only">
            Interactive Google Street View of Dariyapur Shiv Mandir Kanti.
          </DialogDescription>
          <div className="flex items-center justify-between gap-4 border-b border-cream/10 bg-ink px-4 py-3 pr-14 sm:px-5">
            <DialogTitle asChild>
              <a
                href={STREET_VIEW_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 min-w-0 items-center gap-2 rounded-md font-display text-base font-semibold text-cream transition-colors duration-300 hover:text-gold-soft sm:text-lg"
              >
                <span className="truncate">Interactive Temple View</span>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </DialogTitle>
            <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-cream/55 sm:block">
              Drag to look around
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-0 flex-1 overflow-hidden bg-black will-change-transform"
          >
            <iframe
              src={STREET_VIEW_EMBED}
              title="Interactive Temple View"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </motion.div>
        </DialogContent>
      </Dialog>

      <div className="mt-8 text-center">
        <a
          href={STREET_VIEW_URL}
          target="_blank"
          rel="noreferrer"
          className="interactive-surface inline-flex min-h-11 items-center gap-1.5 rounded-md text-xs font-semibold uppercase tracking-widest text-saffron-deep hover:text-ember"
        >
          Open Street View in Google Maps
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Section>
  );
}
