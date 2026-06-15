import { useEffect, useState } from "react";

const HOURS = { open: 7, close: 20 }; // 7am - 8pm

export function useTempleStatus() {
  const [state, setState] = useState({
    isOpen: false,
    label: "—",
    next: "",
    now: new Date(),
  });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours() + now.getMinutes() / 60;
      const isOpen = h >= HOURS.open && h < HOURS.close;
      const label = isOpen ? "OPEN NOW" : "CLOSED NOW";
      let next = "";
      if (isOpen) {
        const close = new Date(now);
        close.setHours(HOURS.close, 0, 0, 0);
        const mins = Math.round((+close - +now) / 60000);
        next = `Closes in ${Math.floor(mins / 60)}h ${mins % 60}m`;
      } else {
        const open = new Date(now);
        if (h >= HOURS.close) open.setDate(open.getDate() + 1);
        open.setHours(HOURS.open, 0, 0, 0);
        const mins = Math.round((+open - +now) / 60000);
        next = `Opens in ${Math.floor(mins / 60)}h ${mins % 60}m`;
      }
      setState({ isOpen, label, next, now });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return state;
}

export function StatusCard() {
  const { isOpen, label, next, now } = useTempleStatus();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = now.getDay();

  return (
    <div className="relative w-full max-w-sm rounded-3xl border border-gold/40 bg-card/85 p-6 backdrop-blur-xl shadow-sacred">
      <div className="absolute -top-3 left-6 rounded-full gradient-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink/80">
        Live Status
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
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{next}</p>

      <div className="my-5 divider-om" />

      <div className="space-y-1.5 text-sm">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-display text-base font-semibold text-ink">Temple Hours</span>
          <span className="text-xs text-muted-foreground">7:00 AM – 8:00 PM</span>
        </div>
        {days.map((d, i) => (
          <div
            key={d}
            className={`flex items-center justify-between rounded-md px-2.5 py-1.5 transition ${
              i === today ? "bg-saffron/10 text-saffron-deep font-semibold" : "text-ink/70"
            }`}
          >
            <span>{d}</span>
            <span className="tabular-nums">7:00 AM – 8:00 PM</span>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg bg-secondary/70 px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground">
        Temple timings may vary on special occasions and festivals.
      </p>
    </div>
  );
}
