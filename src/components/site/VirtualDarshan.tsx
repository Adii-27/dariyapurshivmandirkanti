import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Section, SectionHeading } from "./Section";

const STREET_VIEW_URL = "https://maps.app.goo.gl/vGTVsEXAFpj2MoNJ6";
const STREET_VIEW_EMBED =
  "https://www.google.com/maps/embed?pb=!4v1781246400000!6m8!1m7!1sLlVHTk5CHQ3BMBso2Fd39Q!2m2!1d26.1581116!2d85.3053131!3f254.31!4f0!5f0.7820865974627469";

export function VirtualDarshan() {
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

      <Dialog>
        <div className="mt-12 text-center">
          <DialogTrigger asChild>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-12 items-center gap-2 rounded-full gradient-saffron px-8 py-4 text-base font-semibold text-primary-foreground shadow-sacred"
            >
              <Sparkles className="h-5 w-5" />
              View Virtual Darshan
            </motion.button>
          </DialogTrigger>
          <p className="mt-3 text-xs text-muted-foreground">
            Opens a responsive interactive temple view.
          </p>
        </div>

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
