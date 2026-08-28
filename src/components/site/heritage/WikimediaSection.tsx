import { motion } from "framer-motion";
import { ExternalLink, Globe, Sparkles } from "lucide-react";
import { Section } from "@/components/site/Section";
import {
  WIKIMEDIA_CONTRIBUTIONS_URL,
  type WikimediaFile,
} from "@/lib/wikimedia/commons";
import { useLanguage } from "@/lib/i18n";
import { WikimediaGallery } from "./WikimediaGallery";
import {
  WikimediaEmpty,
  WikimediaError,
  WikimediaSkeleton,
} from "./WikimediaStateViews";

export function WikimediaSection({
  files,
  isLoading,
  isError,
  refetch,
}: {
  files: WikimediaFile[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Section id="wikimedia-collection" className="bg-background">
      {/* Wikimedia Commons Section Header */}
      <div className="mx-auto max-w-4xl text-center">
        {/* Official Wikimedia Logo Display */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-gold/40 bg-card/80 px-4 py-2 shadow-sm backdrop-blur">
            <img
              src="/wikimedia-commons-logo.svg"
              alt="Official Wikimedia Commons Logo"
              className="h-7 w-7 object-contain"
            />
            <div className="text-left leading-tight">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t.heritage.mediaRepoLabel}
              </span>
              <span className="font-display text-sm font-semibold text-ink">
                Wikimedia Commons
              </span>
            </div>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl lg:text-5xl"
        >
          {t.location.templeName}
        </motion.h2>

        <p className="font-hindi mt-2 text-lg text-saffron-deep sm:text-xl">
          {t.heritage.wikimediaHindi}
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.heritage.wikimediaSubtitle}
        </p>

        {/* Primary CTA */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={WIKIMEDIA_CONTRIBUTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explore verified collection on Wikimedia Commons (opens in a new tab)"
            className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-full gradient-saffron px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sacred hover:shadow-glow focus-visible:ring-gold"
          >
            <Globe className="h-4 w-4" />
            {t.heritage.exploreCommonsBtn}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Shared for Free Knowledge Notice */}
      <div className="mx-auto mt-10 max-w-3xl">
        <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold-soft/30 p-4 text-xs text-ink sm:p-5 sm:text-sm">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-saffron-deep ring-1 ring-gold/40">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-display text-xs font-bold uppercase tracking-wider text-saffron-deep">
              {t.heritage.sharedFreeKnowledgeBadge}
            </span>
            <p className="mt-0.5 text-xs text-ink/80 sm:text-sm">
              {t.heritage.sharedFreeKnowledgeDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Collection State */}
      <div className="mt-12">
        {isLoading ? (
          <WikimediaSkeleton />
        ) : isError ? (
          <WikimediaError onRetry={() => refetch()} />
        ) : files.length === 0 ? (
          <WikimediaEmpty />
        ) : (
          <WikimediaGallery files={files} />
        )}
      </div>

      {/* Collection Footer Navigation Banner */}
      {!isLoading && !isError && files.length > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-border/80 bg-card/60 p-4 shadow-sm backdrop-blur">
            <span className="text-xs text-muted-foreground">
              {t.heritage.showingCount.replace("{count}", String(files.length))}
            </span>
            <a
              href={WIKIMEDIA_CONTRIBUTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-surface inline-flex min-h-11 items-center gap-1.5 rounded-full border border-gold/60 bg-gold-soft/50 px-4 py-2 text-xs font-semibold text-saffron-deep hover:bg-gold-soft"
            >
              {t.heritage.exploreContributorArchive}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </Section>
  );
}
