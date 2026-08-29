import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

const STREET_VIEW_URL = "https://maps.app.goo.gl/vGTVsEXAFpj2MoNJ6";

const VirtualDarshanModal = lazy(() => import("./VirtualDarshanModal"));

export function VirtualDarshan() {
  const { t } = useLanguage();
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
        eyebrow={t.virtualDarshan.eyebrow}
        title={t.virtualDarshan.title}
        hindi={t.virtualDarshan.hindi}
      >
        {t.virtualDarshan.subtitle}
      </SectionHeading>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            t: t.virtualDarshan.card1Title,
            d: t.virtualDarshan.card1Desc,
            k: t.virtualDarshan.card1Key,
          },
          {
            t: t.virtualDarshan.card2Title,
            d: t.virtualDarshan.card2Desc,
            k: t.virtualDarshan.card2Key,
          },
          {
            t: t.virtualDarshan.card3Title,
            d: t.virtualDarshan.card3Desc,
            k: t.virtualDarshan.card3Key,
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
          {isTransitioning ? t.virtualDarshan.openingBtn : t.virtualDarshan.viewBtn}
        </motion.button>
        <p className="mt-3 text-xs text-muted-foreground">
          {t.virtualDarshan.responsiveNote}
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
              <div
                lang="sa"
                className="font-hindi text-xl font-medium tracking-wide text-gold-soft sm:text-2xl"
              >
                {t.hero.chant}
              </div>
              <div className="mt-2 font-display text-sm font-semibold tracking-widest uppercase text-cream/90 sm:text-base">
                {t.virtualDarshan.enteringTitle}
              </div>
              <div className="mt-1 font-hindi text-xs tracking-wider text-gold-soft/70">
                {t.virtualDarshan.enteringSubtitle}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {(isOpen || isTransitioning) && (
        <Suspense fallback={null}>
          <VirtualDarshanModal
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            dialogTitle={t.virtualDarshan.dialogTitle}
            dragToLook={t.virtualDarshan.dragToLook}
          />
        </Suspense>
      )}

      <div className="mt-8 text-center">
        <a
          href={STREET_VIEW_URL}
          target="_blank"
          rel="noreferrer"
          className="interactive-surface inline-flex min-h-11 items-center gap-1.5 rounded-md text-xs font-semibold uppercase tracking-widest text-saffron-deep hover:text-ember"
        >
          {t.virtualDarshan.openMapsLink}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Section>
  );
}
