import { motion } from "framer-motion";
import { Images, MapPin, Eye } from "lucide-react";
import { HERO_IMAGE } from "@/lib/media";
import { StatusCard } from "./StatusCard";

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-24">
      {/* Background banner */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMAGE}
          alt="Authentic sunset view of Dariyapur Shiv Mandir Kanti"
          loading="eager"
          fetchPriority="high"
          decoding="async"
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
            <span className="min-w-0 break-words text-[11px] font-medium uppercase tracking-[0.16em] text-gold-soft sm:text-xs sm:tracking-[0.2em]">
              ॐ नमः शिवाय
            </span>
          </div>

          <h1 className="mt-6 break-words font-display text-[clamp(2.75rem,14vw,4.5rem)] font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
            Dariyapur <span className="text-gradient-gold">Shiv Mandir</span> Kanti
          </h1>
          <p className="font-hindi mt-3 text-2xl font-medium text-gold-soft sm:text-3xl">
            दरियापुर शिव मंदिर काँटी
          </p>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
            A sacred centre of Lord Shiva — where faith, devotion and centuries of community
            tradition meet. Step into a space of inner peace, ritual and timeless heritage.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 min-[430px]:flex-row min-[430px]:flex-wrap min-[430px]:items-center">
            <motion.a
              href="#darshan"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full gradient-saffron px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-sacred transition-shadow duration-300 hover:shadow-glow focus-visible:ring-gold focus-visible:ring-offset-ink"
            >
              <Eye className="h-4 w-4" />
              Virtual Darshan
            </motion.a>
            <motion.a
              href="#gallery"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/50 bg-ink/30 px-7 py-3.5 text-sm font-semibold text-cream shadow-sm backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-ink/50 hover:shadow-glow focus-visible:ring-gold focus-visible:ring-offset-ink"
            >
              <Images className="h-4 w-4" />
              Temple Gallery
            </motion.a>
            <motion.a
              href="https://maps.app.goo.gl/AwKW2occqHKrJVA9A"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/50 bg-ink/30 px-7 py-3.5 text-sm font-semibold text-cream shadow-sm backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-ink/50 hover:shadow-glow focus-visible:ring-gold focus-visible:ring-offset-ink"
            >
              <MapPin className="h-4 w-4" />
              Get Directions
            </motion.a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-[0.18em] text-cream/70">
            <div>
              <div className="text-[10px]">Daily</div>
              <div className="text-sm normal-case tracking-normal text-gold-soft">
                7:00 AM – 8:00 PM
              </div>
            </div>
            <div className="h-8 w-px bg-cream/30" />
            <div>
              <div className="text-[10px]">Est.</div>
              <div className="text-sm normal-case tracking-normal text-gold-soft">1962</div>
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
