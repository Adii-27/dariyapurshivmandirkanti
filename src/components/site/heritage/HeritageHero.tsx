import { motion } from "framer-motion";
import { Camera, Landmark, Sparkles, MapPin } from "lucide-react";
import { HERO_IMAGE } from "@/lib/media";

export function HeritageHero() {
  return (
    <section id="heritage-hero" className="relative isolate overflow-hidden pt-24">
      {/* Background with authentic temple banner */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMAGE}
          alt="Authentic view of Dariyapur Shiv Mandir Kanti at sunset"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/65 to-cream" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/35 to-transparent" />
      </div>

      <div className="mx-auto min-w-0 max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pt-20">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          {/* Left Column: Heading & Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-cream"
          >
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold/40 bg-ink/40 px-4 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-soft sm:text-xs">
                HERITAGE
              </span>
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.5rem,11vw,4.25rem)] font-semibold leading-[1.04] tracking-tight text-cream sm:text-6xl">
              Preserving the Story of{" "}
              <span className="text-gradient-gold">Dariyapur Shiv Mandir</span>
            </h1>

            <p className="font-hindi mt-3 text-xl font-medium text-gold-soft sm:text-2xl">
              दरियापुर शिव मंदिर काँटी — धरोहर और संस्कृति
            </p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
              Documenting the temple's divine presence, cultural heritage and timeless beauty through
              Wikimedia Commons.
            </p>

            {/* Quick Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#wikimedia-collection"
                className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-full gradient-saffron px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sacred hover:shadow-glow"
              >
                <Camera className="h-4 w-4" />
                View Commons Collection
              </a>
              <a
                href="#about-temple"
                className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/50 bg-ink/30 px-6 py-2.5 text-sm font-semibold text-cream shadow-sm backdrop-blur-md hover:bg-ink/50 hover:shadow-glow"
              >
                <Landmark className="h-4 w-4" />
                About Temple
              </a>
            </div>

            {/* Verified Fact Ribbon */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-cream/20 pt-6 text-xs uppercase tracking-[0.18em] text-cream/75">
              <div>
                <span className="block text-[10px] text-cream/60">Established</span>
                <span className="text-sm font-semibold normal-case tracking-normal text-gold-soft">
                  1962
                </span>
              </div>
              <div className="h-8 w-px bg-cream/20" />
              <div>
                <span className="block text-[10px] text-cream/60">Dedication</span>
                <span className="text-sm font-semibold normal-case tracking-normal text-gold-soft">
                  Lord Shiva
                </span>
              </div>
              <div className="h-8 w-px bg-cream/20" />
              <div>
                <span className="block text-[10px] text-cream/60">Archive</span>
                <span className="text-sm font-semibold normal-case tracking-normal text-gold-soft">
                  Wikimedia Commons
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-card/90 p-2 shadow-sacred backdrop-blur-md sm:p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={HERO_IMAGE}
                  alt="Dariyapur Shiv Mandir Kanti heritage facade"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-cream">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-ink/60 px-2.5 py-1 text-[11px] font-medium text-gold-soft backdrop-blur">
                    <Sparkles className="h-3 w-3 text-gold" />
                    Cultural Preservation
                  </div>
                  <h2 className="mt-2 font-display text-lg font-semibold leading-snug sm:text-xl">
                    Dariyapur Shiv Mandir Kanti
                  </h2>
                  <p className="mt-0.5 text-xs text-cream/80">
                    Documented for Free Knowledge &amp; Digital Heritage
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 text-ink sm:gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-gold-soft/40 p-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-saffron-deep" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Location
                    </span>
                    <span className="truncate text-xs font-semibold text-ink">
                      Kanti, Muzaffarpur
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-gold-soft/40 p-2.5">
                  <Camera className="h-4 w-4 shrink-0 text-saffron-deep" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Repository
                    </span>
                    <span className="truncate text-xs font-semibold text-ink">
                      Wikimedia Commons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
