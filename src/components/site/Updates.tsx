import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CalendarDays, Users, X } from "lucide-react";
import {
  latestChangedAt,
  UPDATES_SEEN_EVENT,
  UPDATES_SEEN_STORAGE_KEY,
} from "@/lib/updates-notifications";
import type { TempleUpdate, TempleUpdateCategory } from "@/lib/updates";
import { Section, SectionHeading } from "./Section";

const categoryIcons = {
  "Community Post": Users,
  "Festival Announcement": CalendarDays,
  "Temple Notice": Bell,
} satisfies Record<TempleUpdateCategory, typeof Users>;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function UpdateDateRange({ update }: { update: TempleUpdate }) {
  if (!update.startDate && !update.endDate) return null;

  return (
    <p className="mt-3 text-xs font-medium text-muted-foreground">
      {update.startDate && <>Starts {formatDate(update.startDate)}</>}
      {update.startDate && update.endDate && " | "}
      {update.endDate && <>Ends {formatDate(update.endDate)}</>}
    </p>
  );
}

export function Updates({ updates = [] }: { updates?: TempleUpdate[] }) {
  const [selectedUpdate, setSelectedUpdate] = useState<TempleUpdate | null>(null);
  const featured = useMemo(
    () => updates.filter((update) => update.featured).sort(byNewest)[0],
    [updates],
  );
  const recent = useMemo(
    () => updates.filter((update) => update.id !== featured?.id).sort(byNewest),
    [featured?.id, updates],
  );

  useEffect(() => {
    const latest = latestChangedAt(updates.map((update) => update.changedAt));
    const section = document.getElementById("updates");
    if (!latest || !section) return;

    const markSeen = () => {
      try {
        window.localStorage.setItem(UPDATES_SEEN_STORAGE_KEY, String(latest));
      } catch {
        // Notification state remains session-only when local storage is unavailable.
      }
      window.dispatchEvent(new CustomEvent(UPDATES_SEEN_EVENT, { detail: latest }));
    };

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        markSeen();
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [updates]);

  useEffect(() => {
    if (!selectedUpdate) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedUpdate(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedUpdate]);

  return (
    <Section id="updates" className="bg-secondary/30">
      <SectionHeading
        eyebrow="Temple Updates"
        title="Community News & Notices"
        hindi="मंदिर समाचार एवं सूचनाएँ"
      >
        Official community posts, festival notices, event announcements and important updates will
        be published here.
      </SectionHeading>

      {featured && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65 }}
          className="interactive-surface mt-12 overflow-hidden rounded-3xl border border-gold/50 bg-card shadow-sacred hover:border-gold/70"
        >
          <div className={`grid ${featured.image ? "md:grid-cols-[1.05fr_1fr]" : ""}`}>
            {featured.image && (
              <img
                src={featured.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="max-h-96 w-full object-contain md:h-full md:min-h-80"
              />
            )}
            <div className="p-7 sm:p-9">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-saffron-deep">
                Featured Update · {featured.category}
              </div>
              <h3 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {formatDate(featured.publishedAt)}
              </p>
              <UpdateDateRange update={featured} />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featured.summary}
              </p>
            </div>
          </div>
        </motion.article>
      )}

      {recent.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display text-2xl font-semibold text-ink">Recent Updates</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((update, index) => {
              const Icon = categoryIcons[update.category];
              return (
                <motion.article
                  key={update.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
                  whileHover={{ scale: 1.015, y: -3 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedUpdate(update)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedUpdate(update);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open update: ${update.title}`}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-gold/50 hover:shadow-sacred focus-visible:ring-offset-2"
                >
                  {update.image && (
                    <img
                      src={update.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="max-h-64 w-full object-contain"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-saffron-deep">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {update.category}
                      </div>
                      <time
                        dateTime={update.publishedAt}
                        className="shrink-0 text-[11px] text-muted-foreground"
                      >
                        {formatDate(update.publishedAt)}
                      </time>
                    </div>
                    <h4 className="mt-4 font-display text-xl font-semibold text-ink">
                      {update.title}
                    </h4>
                    <UpdateDateRange update={update} />
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                      {update.summary}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      )}

      {updates.length === 0 && (
        <div
          className="mx-auto mt-12 max-w-2xl rounded-2xl border border-dashed border-gold/50 bg-card/70 p-8 text-center"
          role="status"
        >
          <p className="font-display text-xl font-semibold text-ink">
            No updates have been published yet.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Please check back for official temple announcements, festival updates and community
            news.
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-ink/75 p-4 backdrop-blur-sm"
            onClick={() => setSelectedUpdate(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedUpdate.title}
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
                onClick={() => setSelectedUpdate(null)}
                aria-label="Close update"
                className="interactive-surface absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink/70 text-cream backdrop-blur hover:bg-ink/85 sm:right-4 sm:top-4"
              >
                <X className="h-5 w-5" />
              </button>
              {selectedUpdate.image && (
                <img
                  src={selectedUpdate.image}
                  alt=""
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="max-h-[50dvh] w-full object-contain"
                />
              )}
              <div className="p-5 sm:p-8">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-saffron-deep">
                  {selectedUpdate.category}
                </div>
                <h3 className="mt-3 pr-10 font-display text-3xl font-semibold text-ink">
                  {selectedUpdate.title}
                </h3>
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  {formatDate(selectedUpdate.publishedAt)}
                </p>
                <UpdateDateRange update={selectedUpdate} />
                <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {selectedUpdate.content || selectedUpdate.summary}
                </p>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

function byNewest(left: TempleUpdate, right: TempleUpdate) {
  return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
}
