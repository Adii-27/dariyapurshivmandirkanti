import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import type { FestivalUpdate } from "@/lib/updates";
import { Section, SectionHeading } from "./Section";

const INDIA_TIME_ZONE = "Asia/Kolkata";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function useCountdown(target?: Date) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!target || now === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ready: false };
  }

  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    ready: true,
  };
}

function formatFestivalDate(value: string) {
  const date = new Date(value);
  const indiaTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: INDIA_TIME_ZONE,
  }).format(date);
  const hasMeaningfulTime = indiaTime !== "00:00" && indiaTime !== "24:00";

  return date.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(hasMeaningfulTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: INDIA_TIME_ZONE,
  });
}

function festivalDateKey(value: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: INDIA_TIME_ZONE,
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function calendarDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function FestivalDateRange({ festival }: { festival: FestivalUpdate }) {
  return (
    <>
      {formatFestivalDate(festival.date)}
      {festival.endDate && <> - {formatFestivalDate(festival.endDate)}</>}
    </>
  );
}

function Countdown({ festival, compact = false }: { festival: FestivalUpdate; compact?: boolean }) {
  const countdown = useCountdown(new Date(festival.date));

  return (
    <div
      className={`grid min-w-0 grid-cols-4 ${compact ? "gap-2" : "gap-1.5 sm:gap-3"}`}
      aria-live="polite"
    >
      {[
        { label: "Days", value: countdown.days },
        { label: "Hours", value: countdown.hours },
        { label: "Minutes", value: countdown.minutes },
        { label: "Seconds", value: countdown.seconds },
      ].map((unit) => (
        <div
          key={unit.label}
          className={
            compact
              ? "min-w-0 rounded-lg bg-secondary/60 px-1 py-2 text-center"
              : "min-w-0 rounded-xl border border-gold/40 bg-card/90 px-1 py-3 text-center shadow-sm backdrop-blur sm:rounded-2xl sm:p-4"
          }
        >
          <div
            className={
              compact
                ? "font-display text-lg font-semibold tabular-nums text-ink"
                : "font-display text-[clamp(1.65rem,8vw,3rem)] font-bold leading-none tabular-nums text-gradient-saffron"
            }
          >
            {countdown.ready ? String(unit.value).padStart(2, "0") : "00"}
          </div>
          <div className="mt-1 truncate text-[8px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Festivals({ festivals = [] }: { festivals?: FestivalUpdate[] }) {
  const [selectedFestival, setSelectedFestival] = useState<FestivalUpdate | null>(null);
  const upcoming = useMemo(() => {
    const now = Date.now();
    return festivals
      .filter((festival) => new Date(festival.endDate ?? festival.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [festivals]);
  const next =
    upcoming.find((festival) => new Date(festival.date).getTime() > Date.now()) ?? upcoming[0];

  useEffect(() => {
    if (!selectedFestival) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedFestival(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedFestival]);

  return (
    <Section id="festivals">
      <SectionHeading
        eyebrow="UPCOMING FESTIVALS"
        title="Upcoming Festivals & Celebrations"
        hindi="आगामी पर्व एवं उत्सव"
      >
        Mark your calendar for celebrations that bring the temple and the community fully alive.
      </SectionHeading>

      {next ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 overflow-hidden rounded-3xl border border-gold/50 bg-gradient-to-br from-saffron/20 via-card to-gold-soft/30 p-5 shadow-sacred sm:mt-14 sm:p-10 lg:p-12"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-ink/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> Next Festival
              </div>
              <h3 className="mt-5 font-display text-4xl font-semibold text-ink sm:text-5xl">
                {next.name}
              </h3>
              <p className="mt-4 inline-flex items-start gap-2 text-sm font-medium text-ink/70">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <FestivalDateRange festival={next} />
                </span>
              </p>
            </div>
            <Countdown festival={next} />
          </div>
        </motion.div>
      ) : (
        <FestivalEmptyState className="mt-14" />
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <UpcomingFestivalSlider festivals={upcoming} />
        <FestivalCalendar festivals={festivals} onSelect={setSelectedFestival} />
      </div>

      <FestivalModal festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
    </Section>
  );
}

function UpcomingFestivalSlider({ festivals }: { festivals: FestivalUpdate[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (
      paused ||
      festivals.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const interval = window.setInterval(
      () => setIndex((current) => (current + 1) % festivals.length),
      3000,
    );
    return () => window.clearInterval(interval);
  }, [festivals.length, paused]);

  useEffect(() => {
    if (index >= festivals.length) setIndex(0);
  }, [festivals.length, index]);

  const festival = festivals[index];

  return (
    <div
      className="interactive-surface overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-gold/50 hover:shadow-sacred sm:p-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest text-saffron-deep">
        Upcoming Festivals
      </div>
      {festival ? (
        <div className="relative mt-4 min-h-[24rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.article
              key={festival.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {festival.bannerImage && (
                <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-secondary/30">
                  <img
                    src={festival.bannerImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="font-display text-2xl font-semibold text-ink">{festival.name}</h3>
              <p className="mt-3 inline-flex items-start gap-2 text-sm text-muted-foreground">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                <span>
                  <FestivalDateRange festival={festival} />
                </span>
              </p>
              {festival.description && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {festival.description}
                </p>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      ) : (
        <FestivalEmptyState className="mt-4" />
      )}
    </div>
  );
}

function FestivalCalendar({
  festivals,
  onSelect,
}: {
  festivals: FestivalUpdate[];
  onSelect: (festival: FestivalUpdate) => void;
}) {
  const today = new Date();
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) =>
    index < firstWeekday ? null : index - firstWeekday + 1,
  );
  while (cells.length % 7 !== 0) cells.push(null);

  const festivalsByDate = useMemo(() => {
    const map = new Map<string, FestivalUpdate[]>();
    festivals.forEach((festival) => {
      const key = festivalDateKey(festival.date);
      map.set(key, [...(map.get(key) ?? []), festival]);
    });
    return map;
  }, [festivals]);

  const todayKey = festivalDateKey(new Date().toISOString());

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
          aria-label="Previous month"
          className="interactive-surface grid h-11 w-11 place-items-center rounded-full border border-border text-ink hover:border-gold hover:text-saffron-deep"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-display text-xl font-semibold text-ink">
          {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </h3>
        <button
          type="button"
          onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
          aria-label="Next month"
          className="interactive-surface grid h-11 w-11 place-items-center rounded-full border border-border text-ink hover:border-gold hover:text-saffron-deep"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${monthIndex}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-7 gap-1"
        >
          {cells.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="aspect-square" />;
            const key = calendarDateKey(year, monthIndex, day);
            const dayFestivals = festivalsByDate.get(key) ?? [];
            const highlighted = dayFestivals.length > 0;
            const isToday = key === todayKey;

            return (
              <button
                key={key}
                type="button"
                disabled={!highlighted}
                onClick={() => highlighted && onSelect(dayFestivals[0])}
                aria-label={
                  highlighted
                    ? `${day}: ${dayFestivals.map((festival) => festival.name).join(", ")}`
                    : String(day)
                }
                className={`relative aspect-square min-h-9 rounded-lg text-xs font-medium transition-[transform,background-color,box-shadow] duration-300 sm:min-h-10 sm:rounded-xl sm:text-sm ${
                  highlighted
                    ? "cursor-pointer bg-gold-soft text-saffron-deep ring-1 ring-gold/60 hover:scale-[1.03] hover:shadow-sm active:scale-95"
                    : "cursor-default text-ink/70"
                } ${isToday ? "ring-2 ring-saffron-deep ring-offset-2 ring-offset-card" : ""}`}
              >
                {day}
                {highlighted && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-saffron-deep" />
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FestivalModal({
  festival,
  onClose,
}: {
  festival: FestivalUpdate | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {festival && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/75 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={festival.name}
        >
          <motion.article
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="modal-scroll relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gold/40 bg-card shadow-sacred"
          >
            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label="Close festival"
              className="interactive-surface absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink/70 text-cream backdrop-blur hover:bg-ink/85 sm:right-4 sm:top-4"
            >
              <X className="h-5 w-5" />
            </button>
            {festival.bannerImage && (
              <img
                src={festival.bannerImage}
                alt=""
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="max-h-[45dvh] w-full object-contain"
              />
            )}
            <div className="p-5 sm:p-8">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-saffron-deep">
                Festival Celebration
              </div>
              <h3 className="mt-3 pr-10 font-display text-3xl font-semibold text-ink">
                {festival.name}
              </h3>
              <p className="mt-3 inline-flex items-start gap-2 text-sm text-muted-foreground">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                <span>
                  <FestivalDateRange festival={festival} />
                </span>
              </p>
              {festival.description && (
                <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {festival.description}
                </p>
              )}
              {new Date(festival.date).getTime() > Date.now() && (
                <div className="mt-6">
                  <Countdown festival={festival} compact />
                </div>
              )}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FestivalEmptyState({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-gold/50 bg-card/70 p-8 text-center ${className}`}
      role="status"
    >
      <p className="font-display text-xl font-semibold text-ink">
        No upcoming festivals are available yet.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Festival dates will appear here when they are added to the temple calendar.
      </p>
    </div>
  );
}
