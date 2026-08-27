import { motion } from "framer-motion";
import { Calendar, Clock, Landmark, MapPin, Sparkles } from "lucide-react";
import { Section } from "@/components/site/Section";

const facts = [
  {
    icon: Calendar,
    label: "ESTABLISHED",
    value: "1962",
    detail: "Serving devotees for over six decades",
  },
  {
    icon: MapPin,
    label: "LOCATION",
    value: "Dariyapur, Kanti, Muzaffarpur, Bihar, India",
    detail: "Near Paswan Chowk, PIN 843113",
  },
  {
    icon: Landmark,
    label: "DEDICATED TO",
    value: "Lord Shiva",
    detail: "Sacred centre of worship & inner peace",
  },
  {
    icon: Clock,
    label: "TEMPLE HOURS",
    value: "7:00 AM – 8:00 PM",
    detail: "Open daily for darshan & prayers",
  },
];

export function TempleFacts() {
  return (
    <Section id="about-temple" className="bg-secondary/30">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="h-px w-6 bg-saffron-deep/60" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-deep sm:text-xs">
            TEMPLE IDENTITY
          </span>
          <span className="h-px w-6 bg-saffron-deep/60" />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl"
        >
          About the Temple
        </motion.h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Verified historical and spiritual identity of Dariyapur Shiv Mandir Kanti.
        </p>
      </div>

      {/* Fact Cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="interactive-surface flex flex-col justify-between rounded-2xl border border-gold/30 bg-card/85 p-5 shadow-sm backdrop-blur hover:border-gold/60 hover:shadow-sacred"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-soft/60 text-saffron-deep ring-1 ring-gold/40">
                  <f.icon className="h-5 w-5" />
                </div>
                <Sparkles className="h-4 w-4 text-gold/60" />
              </div>

              <div className="mt-4 text-[11px] font-bold uppercase tracking-widest text-saffron-deep">
                {f.label}
              </div>

              <div className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
                {f.value}
              </div>
            </div>

            <div className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              {f.detail}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Temple Description Paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-4xl rounded-3xl border border-gold/40 bg-card/90 p-6 shadow-sm backdrop-blur-md sm:p-8 lg:p-10"
      >
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="hidden sm:grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-soft/60 text-saffron-deep ring-1 ring-gold/40">
            <Landmark className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-saffron-deep">
              Sanctuary of Devotion &amp; Heritage
            </div>
            <p className="mt-3 text-base leading-[1.85] text-ink/90 sm:text-lg sm:leading-relaxed">
              Established in 1962, Dariyapur Shiv Mandir Kanti is a revered sanctuary of peace and devotion in Muzaffarpur, Bihar. This beautiful Hindu temple, dedicated to Lord Shiva, serves as a pillar of faith for the community. Devotees are welcomed to participate in daily prayers and religious ceremonies, experiencing the spiritual tranquility the temple provides. A vibrant hub of activity during Mahashivratri and the Shravan month, it is a place for all to gather and seek blessings. The temple stands as a powerful symbol of devotion and cultural heritage, enriching lives for over six decades.
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
