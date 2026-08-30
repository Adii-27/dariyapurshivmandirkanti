import { motion } from "framer-motion";
import { Eye, Images, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ResponsiveHeroImage } from "./ResponsiveHeroImage";
import { StatusCard } from "./StatusCard";

export function Hero() {
  const { t, language } = useLanguage();

  return (
    <section id="home" className="relative isolate overflow-hidden pt-24">
      {/* Background banner */}
      <div className="absolute inset-0 -z-10">
        <ResponsiveHeroImage
          alt="Authentic sunset view of Dariyapur Shiv Mandir Kanti"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/50 to-cream" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
      </div>

      <div className="mx-auto grid min-w-0 max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-8 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-cream"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold/40 bg-ink/30 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
            <span
              lang="sa"
              className="min-w-0 break-words text-[11px] font-medium uppercase tracking-[0.16em] text-gold-soft sm:text-xs sm:tracking-[0.2em]"
            >
              {t.hero.chant}
            </span>
          </div>

          <h1 className="mt-6 break-words font-display text-[clamp(2rem,11vw,4.5rem)] font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
            {language === "hi" ? (
              <>
                दरियापुर <span className="text-gradient-gold">शिव मंदिर</span> काँटी
              </>
            ) : language === "mr" ? (
              <>
                दरियापूर <span className="text-gradient-gold">शिव मंदिर</span> काँटी
              </>
            ) : language === "gu" ? (
              <>
                દરિયાપુર <span className="text-gradient-gold">શિવ મંદિર</span> કાંટી
              </>
            ) : language === "kn" ? (
              <>
                ದರಿಯಾಪುರ <span className="text-gradient-gold">ಶಿವ ಮಂದಿರ</span> ಕಾಂಟಿ
              </>
            ) : language === "te" ? (
              <>
                దరియాపూర్ <span className="text-gradient-gold">శివ మందిరం</span> కాంటి
              </>
            ) : language === "ta" ? (
              <>
                தரியாபூர் <span className="text-gradient-gold">சிவ ஆலயம்</span> காண்டி
              </>
            ) : (
              <>
                Dariyapur <span className="text-gradient-gold">Shiv Mandir</span> Kanti
              </>
            )}
          </h1>
          <p className="font-hindi mt-3 break-words text-xl font-medium text-gold-soft sm:text-2xl md:text-3xl">
            {t.hero.titleHindi}
          </p>

          <p className="mt-6 max-w-xl break-words text-sm leading-relaxed text-cream/85 sm:text-base md:text-lg">
            {t.hero.description}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-2.5 min-[430px]:flex-row min-[430px]:flex-wrap min-[430px]:items-center">
            <motion.a
              href="#darshan"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full gradient-saffron px-5 py-3 text-xs font-semibold text-primary-foreground shadow-sacred transition-shadow duration-300 hover:shadow-glow focus-visible:ring-gold focus-visible:ring-offset-ink sm:px-6 sm:py-3.5 sm:text-sm"
            >
              <Eye className="h-4 w-4 shrink-0" />
              <span className="break-words">{t.hero.virtualDarshanBtn}</span>
            </motion.a>
            <motion.a
              href="#gallery"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold/50 bg-ink/30 px-5 py-3 text-xs font-semibold text-cream shadow-sm backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-ink/50 hover:shadow-glow focus-visible:ring-gold focus-visible:ring-offset-ink sm:px-6 sm:py-3.5 sm:text-sm"
            >
              <Images className="h-4 w-4 shrink-0" />
              <span className="break-words">{t.hero.galleryBtn}</span>
            </motion.a>
            <motion.a
              href="https://maps.app.goo.gl/AwKW2occqHKrJVA9A"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold/50 bg-ink/30 px-5 py-3 text-xs font-semibold text-cream shadow-sm backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-ink/50 hover:shadow-glow focus-visible:ring-gold focus-visible:ring-offset-ink sm:px-6 sm:py-3.5 sm:text-sm"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="break-words">{t.hero.directionsBtn}</span>
            </motion.a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em] text-cream/70 sm:gap-6 sm:tracking-[0.18em]">
            <div className="min-w-0">
              <div className="text-[10px]">{t.hero.daily}</div>
              <div className="break-words text-xs normal-case tracking-normal text-gold-soft sm:text-sm">
                {t.hero.hours}
              </div>
            </div>
            <div className="h-8 w-px shrink-0 bg-cream/30" />
            <div className="min-w-0">
              <div className="text-[10px]">{t.hero.established}</div>
              <div className="text-xs normal-case tracking-normal text-gold-soft sm:text-sm">
                {t.hero.estYear}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="lg:self-end lg:justify-self-end"
        >
          <StatusCard />
        </motion.div>
      </div>
    </section>
  );
}
