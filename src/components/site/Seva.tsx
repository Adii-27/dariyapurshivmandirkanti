import { motion } from "framer-motion";
import { HandHeart, BookOpenText, Bird, Users, Sparkles, Heart } from "lucide-react";
import { Section, SectionHeading } from "./Section";

const sevas = [
  {
    icon: HandHeart,
    hi: "ज़रूरतमंदों की सहायता",
    en: "Help the Needy",
    desc: "Reach out to those in need with food, clothing and care.",
  },
  {
    icon: BookOpenText,
    hi: "शिक्षा का समर्थन",
    en: "Support Education",
    desc: "Empower young minds — a book given is a future shaped.",
  },
  {
    icon: Bird,
    hi: "पशु-पक्षियों की सेवा",
    en: "Feed Animals & Birds",
    desc: "Compassion to every living being is worship in motion.",
  },
  {
    icon: Users,
    hi: "बुज़ुर्गों का सम्मान",
    en: "Respect Your Elders",
    desc: "Their blessings are the foundation of every household.",
  },
  {
    icon: Sparkles,
    hi: "स्वच्छता बनाए रखें",
    en: "Maintain Cleanliness",
    desc: "A clean temple and clean surroundings honour the divine.",
  },
  {
    icon: Heart,
    hi: "सद्भाव और दया",
    en: "Harmony & Kindness",
    desc: "Let kindness be the language of every interaction.",
  },
];

export function Seva() {
  return (
    <Section id="seva" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream via-gold-soft/30 to-cream" />
      <SectionHeading
        eyebrow="Seva Evam Prerna"
        title="Acts of Service, Acts of Faith"
        hindi="सेवा एवं प्रेरणा"
      />

      <motion.blockquote
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="font-hindi mx-auto mt-8 max-w-2xl text-center text-2xl leading-snug text-gradient-saffron sm:text-3xl"
      >
        “दूसरों की सहायता करना सबसे बड़ा पुण्य है।”
      </motion.blockquote>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sevas.map((s, i) => (
          <motion.div
            key={s.en}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="group interactive-surface relative overflow-hidden rounded-3xl border border-gold/40 bg-card/85 p-6 backdrop-blur hover:border-gold/60 hover:shadow-sacred sm:p-7"
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-saffron/10 transition-transform duration-500 ease-out group-hover:scale-125" />
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl gradient-saffron text-cream shadow-sacred">
              <s.icon className="h-6 w-6" />
            </div>
            <h4 className="relative mt-5 font-display text-xl font-semibold text-ink">{s.en}</h4>
            <p className="font-hindi relative mt-1 text-base text-saffron-deep">{s.hi}</p>
            <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
