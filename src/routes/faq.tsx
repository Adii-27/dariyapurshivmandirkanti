import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  CircleHelp,
  ExternalLink,
  HandHeart,
  Headset,
  Landmark,
  LayoutGrid,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Search,
  X,
} from "lucide-react";
import { getCmsContent } from "@/lib/api/cms.functions";
import type { CmsContent } from "@/lib/sanity/types";
import { DEFAULT_FAQS, FAQ_CATEGORIES, type TempleFaq } from "@/lib/faq";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { useLanguage } from "@/lib/i18n";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { ResponsiveHeroImage } from "@/components/site/ResponsiveHeroImage";

const CMS_STALE_TIME_MS = 5 * 60_000;
const ALL_CATEGORIES = ["All", ...FAQ_CATEGORIES] as const;
const MAPS_URL = "https://maps.app.goo.gl/AwKW2occqHKrJVA9A";

const CATEGORY_ICONS = {
  All: LayoutGrid,
  Temple: Landmark,
  "Timings & Aarti": Bell,
  Location: MapPin,
  Seva: HandHeart,
  Festivals: CalendarDays,
  General: CircleHelp,
} satisfies Record<(typeof ALL_CATEGORIES)[number], LucideIcon>;

async function fetchLatestCmsContent(): Promise<CmsContent> {
  const content = await getCmsContent();
  if (!content) throw new Error("CMS content is temporarily unavailable");
  return content;
}

export const Route = createFileRoute("/faq")({
  loader: () => getCmsContent(),
  head: ({ loaderData }) =>
    createSeoHead(SEO_PAGES.faq, {
      faqs: loaderData?.faqs && loaderData.faqs.length > 0 ? loaderData.faqs : DEFAULT_FAQS,
    }),
  component: FaqPage,
});

function FaqPage() {
  const initialCms = Route.useLoaderData();
  const { data: refreshedCms } = useQuery({
    queryKey: ["cms-content"],
    queryFn: fetchLatestCmsContent,
    initialData: initialCms ?? undefined,
    staleTime: CMS_STALE_TIME_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });

  const rawFaqs = refreshedCms?.faqs ?? initialCms?.faqs ?? [];
  const faqs = rawFaqs.length > 0 ? rawFaqs : DEFAULT_FAQS;

  return <FaqContent faqs={faqs} />;
}

function FaqContent({ faqs }: { faqs: TempleFaq[] }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof ALL_CATEGORIES)[number]>("All");
  const [expandedId, setExpandedId] = useState<string | undefined>("faq-location-1");

  const categoryLabels: Record<(typeof ALL_CATEGORIES)[number], string> = {
    All: t.faq.categories.all,
    Temple: t.faq.categories.temple,
    "Timings & Aarti": t.faq.categories.timings,
    Location: t.faq.categories.location,
    Seva: t.faq.categories.seva,
    Festivals: t.faq.categories.festivals,
    General: t.faq.categories.general,
  };

  const filteredFaqs = useMemo(() => {
    const searchTerm = search.trim().toLocaleLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory = category === "All" || faq.category === category;
      const matchesSearch =
        !searchTerm ||
        [faq.question, faq.answer, faq.category].some((value) =>
          value.toLocaleLowerCase().includes(searchTerm),
        );

      return matchesCategory && matchesSearch;
    });
  }, [category, faqs, search]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className="overflow-hidden pt-20 sm:pt-24">
        {/* Hero Banner with Temple Background and Divine Ornament */}
        <section className="relative isolate overflow-hidden">
          <ResponsiveHeroImage
            alt="Dariyapur Shiv Mandir Kanti"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/70 to-ink/85" />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl text-center text-cream"
            >
              {/* Divine Trishul & Sacred Tag */}
              <div className="mx-auto mb-4 flex items-center justify-center gap-3 text-gold">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/70 sm:w-16" />
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 text-gold drop-shadow-md"
                  aria-hidden="true"
                >
                  <path d="M11 2a1 1 0 0 1 2 0v5.18c2.18-.32 4.14-1.63 5.4-3.5a1 1 0 0 1 1.66 1.12C18.42 7.23 16 8.7 13 8.97V11h3a1 1 0 0 1 0 2h-3v8a1 1 0 0 1-2 0v-8H8a1 1 0 0 1 0-2h3V8.97C8 8.7 5.58 7.23 3.94 4.8a1 1 0 0 1 1.66-1.12C6.86 5.55 8.82 6.86 11 7.18V2z" />
                </svg>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/70 sm:w-16" />
              </div>

              <h1 className="font-display text-4xl font-bold tracking-tight text-cream sm:text-5xl lg:text-6xl">
                {t.faq.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-cream/90 sm:text-lg">
                {t.faq.subtitle}
              </p>
              <p className="mt-1 font-display text-xl font-bold text-gold-soft sm:text-2xl">
                {t.faq.templeName}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Container */}
        <Section className="pb-16 pt-8 sm:pb-24 sm:pt-12">
          <div className="mx-auto max-w-4xl">
            {/* Search Input Box */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto"
            >
              <label htmlFor="faq-search" className="sr-only">
                {t.faq.searchPlaceholder}
              </label>
              <div className="relative flex items-center rounded-2xl border border-gold/40 bg-card px-4 shadow-sm transition focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/30">
                <Search
                  className="h-5 w-5 shrink-0 text-saffron-deep"
                  aria-hidden="true"
                />
                <input
                  id="faq-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t.faq.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent py-4 pl-3 pr-2 text-sm text-ink outline-none placeholder:text-muted-foreground sm:text-base"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="interactive-surface grid h-8 w-8 shrink-0 place-items-center rounded-full text-saffron-deep hover:bg-saffron/10 focus-visible:ring-saffron"
                    aria-label={t.faq.clearSearchAria}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* "Browse by Category" Divider */}
            <div className="my-8 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-gold/40" />
              <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                {t.faq.browseByCategory}
              </h2>
              <span className="h-px flex-1 bg-gold/40" />
            </div>

            {/* Category Filter Cards */}
            <div
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7 sm:gap-3"
              role="tablist"
              aria-label="Browse FAQ by category"
            >
              {ALL_CATEGORIES.map((item) => {
                const isSelected = category === item;
                const CategoryIcon = CATEGORY_ICONS[item];
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setCategory(item)}
                    className={`interactive-surface group relative flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 ${
                      isSelected
                        ? "gradient-saffron text-primary-foreground shadow-sacred border-transparent font-semibold"
                        : "border border-border bg-card text-ink shadow-sm hover:-translate-y-0.5 hover:border-gold/70 hover:bg-gold-soft/25 hover:shadow-md"
                    }`}
                  >
                    <CategoryIcon
                      className={`h-5 w-5 mb-1.5 transition-colors ${
                        isSelected ? "text-primary-foreground" : "text-saffron-deep group-hover:scale-110"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold leading-tight">{categoryLabels[item]}</span>
                  </button>
                );
              })}
            </div>

            {/* FAQ Accordion List */}
            {filteredFaqs.length > 0 ? (
              <motion.div
                key={`${category}-${search}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 space-y-3.5"
              >
                {filteredFaqs.map((faq) => {
                  const isOpen = expandedId === faq.id;
                  const isLocationFaq =
                    faq.category === "Location" ||
                    faq.id.includes("location") ||
                    faq.question.toLowerCase().includes("where") ||
                    faq.question.toLowerCase().includes("reach");

                  return (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={{ scale: 0.995 }}
                      className={`group overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
                        isOpen
                          ? "border-saffron/60 shadow-sacred ring-1 ring-saffron/20"
                          : "border-border shadow-sm hover:border-gold/70 hover:shadow-sacred"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(isOpen ? undefined : faq.id)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${faq.id}`}
                        id={`faq-question-${faq.id}`}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left font-display text-base font-semibold leading-snug text-ink transition-colors hover:text-saffron-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 sm:px-6 sm:py-5 sm:text-lg"
                      >
                        <span className="min-w-0 pr-2">{faq.question}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all duration-300 sm:h-8 sm:w-8 ${
                            isOpen
                              ? "gradient-saffron text-primary-foreground shadow-sacred"
                              : "border border-gold/50 bg-saffron/10 text-saffron-deep group-hover:gradient-saffron group-hover:text-primary-foreground"
                          }`}
                          aria-hidden="true"
                        >
                          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-answer-${faq.id}`}
                            role="region"
                            aria-labelledby={`faq-question-${faq.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transition: {
                                height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                                opacity: { duration: 0.25, delay: 0.08, ease: "easeOut" },
                              },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: {
                                height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                                opacity: { duration: 0.18, ease: "easeIn" },
                              },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:text-base">
                              <p className="whitespace-pre-wrap">{faq.answer}</p>
                              {isLocationFaq && (
                                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                                  <a
                                    href={MAPS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="interactive-surface inline-flex items-center gap-1.5 rounded-lg gradient-saffron px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sacred hover:shadow-glow"
                                  >
                                    <MapPin className="h-3.5 w-3.5 text-gold-soft" aria-hidden="true" />
                                    <span>{t.faq.viewGoogleMaps}</span>
                                    <ExternalLink className="h-3 w-3 opacity-80" aria-hidden="true" />
                                  </a>
                                  <a
                                    href="/#location"
                                    className="interactive-surface inline-flex items-center gap-1.5 rounded-lg border border-gold/50 bg-cream/90 px-3.5 py-2 text-xs font-semibold text-saffron-deep hover:bg-gold-soft/30"
                                  >
                                    <Navigation className="h-3.5 w-3.5 text-saffron-deep" aria-hidden="true" />
                                    <span>{t.faq.detailedDirections}</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* Dedicated Empty Search State */
              <div
                className="mt-8 rounded-3xl border border-dashed border-gold/50 bg-card/70 p-8 text-center shadow-sm sm:p-12"
                role="status"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-saffron/10 text-saffron-deep">
                  <Search className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">
                  {t.faq.noMatchTitle}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                  {search
                    ? t.faq.noMatchDesc.replace("{search}", search)
                    : t.faq.noCategoryDesc}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="interactive-surface inline-flex min-h-10 items-center justify-center rounded-xl gradient-saffron px-5 text-xs font-semibold text-primary-foreground shadow-sacred hover:shadow-glow"
                  >
                    {t.faq.clearSearchBtn}
                  </button>
                  <a
                    href="/contact"
                    className="interactive-surface inline-flex min-h-10 items-center justify-center rounded-xl border border-gold/50 bg-card px-5 text-xs font-semibold text-saffron-deep hover:bg-gold-soft/30"
                  >
                    {t.faq.contactBtn}
                  </a>
                </div>
              </div>
            )}

            {/* "Still have a question?" Bottom Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-gold-soft/40 via-card to-saffron/10 p-6 shadow-sacred sm:p-8"
            >
              <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                <div className="flex w-full items-center gap-4 text-left sm:w-auto">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-saffron/15 text-saffron-deep sm:h-14 sm:w-14">
                    <Headset className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                      {t.faq.stillHaveQuestion}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">
                      {t.faq.weAreHereToHelp}
                    </p>
                  </div>
                </div>
                <a
                  href="/contact"
                  className="interactive-surface inline-flex min-h-11 w-full items-center justify-center rounded-xl gradient-saffron px-7 text-sm font-semibold text-primary-foreground shadow-sacred hover:shadow-glow sm:w-auto"
                >
                  {t.faq.contactBtn}
                </a>
              </div>
            </motion.div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
