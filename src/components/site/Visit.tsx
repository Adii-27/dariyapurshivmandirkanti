import { Clock, Camera, Footprints, Flower2, Sparkles, Sun } from "lucide-react";
import { Section, SectionHeading } from "./Section";

const items = [
  {
    icon: Clock,
    t: "Temple Timings",
    d: "Open daily from 7:00 AM to 8:00 PM. Hours may extend on festivals.",
  },
  {
    icon: Sun,
    t: "Best Time to Visit",
    d: "Early morning aarti and evening sandhya are the most serene moments.",
  },
  {
    icon: Footprints,
    t: "Visitor Guidelines",
    d: "Remove footwear at entrance. Maintain silence inside the garbhagriha.",
  },
  {
    icon: Flower2,
    t: "Festival Visits",
    d: "Plan an early arrival on Shivratri and Shravan Mondays — expect crowds.",
  },
  {
    icon: Camera,
    t: "Photography",
    d: "Outdoor photography welcomed. Please avoid flash inside the sanctum.",
  },
  {
    icon: Sparkles,
    t: "Temple Etiquette",
    d: "Dress modestly. Walk clockwise during parikrama. Be kind to fellow devotees.",
  },
];

export function Visit() {
  return (
    <Section id="visit" className="bg-secondary/40">
      <SectionHeading
        eyebrow="Visitor Information"
        title="Plan Your Darshan"
        hindi="आगंतुक जानकारी"
      >
        A few simple guidelines to help every devotee experience the temple with reverence and ease.
      </SectionHeading>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <div
            key={i.t}
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
