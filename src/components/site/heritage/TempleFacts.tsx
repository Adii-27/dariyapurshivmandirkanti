import { motion } from "framer-motion";
import { Calendar, Clock, Landmark, MapPin, Sparkles } from "lucide-react";
import { Section } from "@/components/site/Section";
import { useLanguage } from "@/lib/i18n";

export function TempleFacts() {
  const { t } = useLanguage();

  const facts = [
    {
      icon: Calendar,
      label: t.heritage.estLabel.toUpperCase(),
      value: t.heritage.estValue,
      detail: t.heritage.factEstDetail,
    },
    {
      icon: MapPin,
      label: t.heritage.locationLabel.toUpperCase(),
      value: t.contact.addressValue,
      detail: t.heritage.factLocDetail,
    },
    {
      icon: Landmark,
      label: t.heritage.dedicationLabel.toUpperCase(),
      value: t.heritage.dedicationValue,
      detail: t.heritage.factDedDetail,
    },
    {
      icon: Clock,
      label: t.about.timingsLabel.toUpperCase(),
      value: t.about.timingsValue,
      detail: t.heritage.factHoursDetail,
    },
  ];

  return (
    <Section id="about-temple" className="bg-secondary/30">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="h-px w-6 bg-saffron-deep/60" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-deep sm:text-xs">
            {t.heritage.identityEyebrow}
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
          {t.heritage.identityTitle}
        </motion.h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.heritage.identitySubtitle}
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
              {t.heritage.narrativeBadge}
            </div>
            <p className="mt-3 text-base leading-[1.85] text-ink/90 sm:text-lg sm:leading-relaxed">
              {t.heritage.narrativeText}
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
