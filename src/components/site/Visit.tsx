import { Clock, Camera, Footprints, Flower2, Sparkles, Sun } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

export function Visit() {
  const { t } = useLanguage();

  const items = [
    {
      icon: Clock,
      t: t.visit.timingsTitle,
      d: t.visit.timingsDesc,
    },
    {
      icon: Sun,
      t: t.visit.bestTimeTitle,
      d: t.visit.bestTimeDesc,
    },
    {
      icon: Footprints,
      t: t.visit.guidelinesTitle,
      d: t.visit.guidelinesDesc,
    },
    {
      icon: Flower2,
      t: t.visit.festivalVisitsTitle,
      d: t.visit.festivalVisitsDesc,
    },
    {
      icon: Camera,
      t: t.visit.photographyTitle,
      d: t.visit.photographyDesc,
    },
    {
      icon: Sparkles,
      t: t.visit.etiquetteTitle,
      d: t.visit.etiquetteDesc,
    },
  ];

  return (
    <Section id="visit" className="bg-secondary/40">
      <SectionHeading
        eyebrow={t.visit.eyebrow}
        title={t.visit.title}
        hindi={t.visit.hindi}
      >
        {t.visit.subtitle}
      </SectionHeading>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i, index) => (
          <div
            key={index}
            className="group interactive-surface rounded-3xl border border-border bg-card/80 p-6 backdrop-blur hover:border-gold/50 hover:shadow-sacred sm:p-7"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-saffron/15 text-saffron-deep transition-colors duration-300 group-hover:gradient-saffron group-hover:text-cream">
              <i.icon className="h-5 w-5" />
            </div>
            <h4 className="mt-5 font-display text-xl font-semibold text-ink">{i.t}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
