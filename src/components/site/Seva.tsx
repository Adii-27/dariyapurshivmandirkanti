import { motion } from "framer-motion";
import { HandHeart, BookOpenText, Bird, Users, Sparkles, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

export function Seva() {
  const { t } = useLanguage();

  const sevas = [
    {
      icon: HandHeart,
      title: t.seva.cards.needyTitle,
      hindi: t.seva.cards.needyHindi,
      desc: t.seva.cards.needyDesc,
    },
    {
      icon: BookOpenText,
      title: t.seva.cards.educationTitle,
      hindi: t.seva.cards.educationHindi,
      desc: t.seva.cards.educationDesc,
    },
    {
      icon: Bird,
      title: t.seva.cards.animalsTitle,
      hindi: t.seva.cards.animalsHindi,
      desc: t.seva.cards.animalsDesc,
    },
    {
      icon: Users,
      title: t.seva.cards.eldersTitle,
      hindi: t.seva.cards.eldersHindi,
      desc: t.seva.cards.eldersDesc,
    },
    {
      icon: Sparkles,
      title: t.seva.cards.cleanlinessTitle,
      hindi: t.seva.cards.cleanlinessHindi,
      desc: t.seva.cards.cleanlinessDesc,
    },
    {
      icon: Heart,
      title: t.seva.cards.harmonyTitle,
      hindi: t.seva.cards.harmonyHindi,
      desc: t.seva.cards.harmonyDesc,
    },
  ];

  return (
    <Section id="seva" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream via-gold-soft/30 to-cream" />
      <SectionHeading
        eyebrow={t.seva.eyebrow}
        title={t.seva.title}
        hindi={t.seva.hindi}
      />

      <motion.blockquote
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="font-hindi mx-auto mt-8 max-w-2xl text-center text-2xl leading-snug text-gradient-saffron sm:text-3xl"
      >
        {t.seva.quote}
      </motion.blockquote>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sevas.map((s, i) => (
          <motion.div
            key={i}
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
            <h4 className="relative mt-5 font-display text-xl font-semibold text-ink">{s.title}</h4>
            <p className="font-hindi relative mt-1 text-base text-saffron-deep">{s.hindi}</p>
            <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
