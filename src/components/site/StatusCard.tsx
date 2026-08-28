import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

const HOURS = { open: 7, close: 20 }; // 7am - 8pm
const INDIA_TIME_ZONE = "Asia/Kolkata";
const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
} as const;
const INDIA_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: INDIA_TIME_ZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function getIndiaTime(now = new Date()) {
  const parts = Object.fromEntries(
    INDIA_TIME_FORMATTER.formatToParts(now).map(({ type, value }) => [type, value]),
  );

  return {
    today: WEEKDAY_INDEX[parts.weekday as keyof typeof WEEKDAY_INDEX],
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

export function useTempleStatus() {
  const [state, setState] = useState({
    isOpen: false,
    remainingHours: 0,
    remainingMinutes: 0,
    today: null as number | null,
  });

  useEffect(() => {
    const tick = () => {
      const { today, hour, minute, second } = getIndiaTime();
      const openMinute = HOURS.open * 60;
      const closeMinute = HOURS.close * 60;
      const currentMinute = hour * 60 + minute;
      const currentSecond = currentMinute * 60 + second;
      const isOpen = currentMinute >= openMinute && currentMinute < closeMinute;

      let remainingHours = 0;
      let remainingMinutes = 0;
      if (isOpen) {
        const mins = Math.round((closeMinute * 60 - currentSecond) / 60);
        remainingHours = Math.floor(mins / 60);
        remainingMinutes = mins % 60;
      } else {
        const nextOpenSecond =
          currentMinute < openMinute ? openMinute * 60 : (24 * 60 + openMinute) * 60;
        const mins = Math.round((nextOpenSecond - currentSecond) / 60);
        remainingHours = Math.floor(mins / 60);
        remainingMinutes = mins % 60;
      }
      setState({ isOpen, remainingHours, remainingMinutes, today });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return state;
}

export function StatusCard() {
  const { t } = useLanguage();
  const { isOpen, remainingHours, remainingMinutes, today } = useTempleStatus();

  const dayLabels = [
    t.statusCard.days.sun,
    t.statusCard.days.mon,
    t.statusCard.days.tue,
    t.statusCard.days.wed,
    t.statusCard.days.thu,
    t.statusCard.days.fri,
    t.statusCard.days.sat,
  ];

  const statusLabel = isOpen ? t.statusCard.openNow : t.statusCard.closedNow;
  const statusNext = isOpen
    ? t.statusCard.closesIn(remainingHours, remainingMinutes)
    : t.statusCard.opensIn(remainingHours, remainingMinutes);

  return (
    <div className="relative w-full max-w-sm rounded-3xl border border-gold/40 bg-card/85 p-6 backdrop-blur-xl shadow-sacred">
      <div className="absolute -top-3 left-6 rounded-full gradient-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink/80">
        {t.statusCard.liveStatus}
      </div>

      <div className="flex items-center gap-3">
        <span className="relative grid h-4 w-4 place-items-center">
          <span
            className={`absolute inset-0 rounded-full ${isOpen ? "bg-emerald-500" : "bg-rose-500"} animate-pulse-glow`}
          />
          <span
            className={`relative h-2 w-2 rounded-full ${isOpen ? "bg-emerald-600" : "bg-rose-600"}`}
          />
        </span>
        <span
          className={`font-display text-2xl font-semibold ${isOpen ? "text-emerald-700" : "text-rose-700"}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{statusNext}</p>

      <div className="my-5 divider-om" />

      <div className="space-y-1.5 text-sm">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-display text-base font-semibold text-ink">
            {t.statusCard.templeHours}
          </span>
          <span className="text-xs text-muted-foreground">{t.statusCard.hoursValue}</span>
        </div>
        {dayLabels.map((d, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-md px-2.5 py-1.5 transition ${
              today !== null && i === today
                ? "bg-saffron/10 text-saffron-deep font-semibold"
                : "text-ink/70"
            }`}
          >
            <span>{d}</span>
            <span className="tabular-nums">{t.statusCard.hoursValue}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg bg-secondary/70 px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground">
        {t.statusCard.timingsNote}
      </p>
    </div>
  );
}
