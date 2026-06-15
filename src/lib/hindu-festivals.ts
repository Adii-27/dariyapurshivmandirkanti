import { getUpcomingFestivals, Observer } from "@ishubhamx/panchangam-js";
import type { FestivalUpdate } from "@/lib/updates";

const TEMPLE_LOCATION = new Observer(26.37, 85.27, 55);
const INDIA_TIMEZONE_OFFSET_MINUTES = 330;

export function generateHinduFestivals(referenceDate = new Date()): FestivalUpdate[] {
  const startYear = referenceDate.getFullYear();
  const start = new Date(`${startYear}-01-01T00:00:00+05:30`);
  const end = new Date(`${startYear + 1}-12-31T23:59:59+05:30`);
  const days = Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1;

  const generated = getUpcomingFestivals({
    date: start,
    observer: TEMPLE_LOCATION,
    days,
    timezoneOffset: INDIA_TIMEZONE_OFFSET_MINUTES,
    categories: ["major", "solar"],
    calendarType: "purnimanta",
  });

  const unique = new Map<string, FestivalUpdate>();
  generated.forEach((festival) => {
    const date = festival.date.toISOString();
    const key = `${festival.name}:${date}`;
    if (unique.has(key)) return;

    unique.set(key, {
      id: key.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: festival.name,
      hindi: "",
      date,
      endDate: festival.endDate?.toISOString(),
      description:
        festival.description ||
        festival.observances?.join(" ") ||
        "A sacred Hindu festival observed with prayer and devotion.",
      countdownEnabled: true,
      featured: festival.category === "major",
    });
  });

  return [...unique.values()].sort(
    (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
  );
}
