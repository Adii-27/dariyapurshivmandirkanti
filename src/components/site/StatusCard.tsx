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
    <div className="relative w-full max-w-sm rounded-3xl border border-gold/40 bg-card/85 p-5 backdrop-blur-xl shadow-sacred sm:p-6">
      <div className="absolute -top-3 left-5 rounded-full gradient-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink/80 sm:left-6">
        {t.statusCard.liveStatus}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className="relative grid h-4 w-4 shrink-0 place-items-center">
          <span
            className={`absolute inset-0 rounded-full ${isOpen ? "bg-emerald-500" : "bg-rose-500"} animate-pulse-glow`}
          />
          <span
            className={`relative h-2 w-2 rounded-full ${isOpen ? "bg-emerald-600" : "bg-rose-600"}`}
          />
        </span>
        <span
          className={`break-words font-display text-xl font-semibold leading-tight sm:text-2xl ${
            isOpen ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="mt-1 break-words text-xs text-muted-foreground sm:text-sm">{statusNext}</p>

      <div className="my-4 divider-om sm:my-5" />

      <div className="space-y-1.5 text-xs sm:text-sm">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="font-display text-sm font-semibold text-ink sm:text-base">
            {t.statusCard.templeHours}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground sm:text-xs">
            {t.statusCard.hoursValue}
          </span>
        </div>
        {dayLabels.map((d, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 transition ${
              today !== null && i === today
                ? isOpen
                  ? "bg-emerald-500/10 text-emerald-700 font-semibold"
                  : "bg-rose-500/10 text-rose-700 font-semibold"
                : "text-ink/70"
            }`}
          >
            <span className="min-w-0 break-words">{d}</span>
            <span className="shrink-0 text-right tabular-nums text-[11px] sm:text-xs">
              {t.statusCard.hoursValue}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg bg-secondary/70 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground sm:text-[11.5px]">
        {t.statusCard.timingsNote}
      </p>
    </div>
  );
}
