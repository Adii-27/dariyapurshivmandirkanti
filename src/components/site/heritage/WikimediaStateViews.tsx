import { ExternalLink, ImageOff, RefreshCw } from "lucide-react";
import { WIKIMEDIA_CONTRIBUTIONS_URL } from "@/lib/wikimedia/commons";
import { useLanguage } from "@/lib/i18n";

export function WikimediaSkeleton() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Featured placeholder */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 aspect-[4/3] sm:aspect-[16/10] rounded-3xl border border-border/70 bg-card/60 p-4 shadow-sm animate-pulse">
          <div className="h-full w-full rounded-2xl bg-muted/60" />
        </div>
        {/* Supporting placeholders */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl border border-border/60 bg-card/50 p-3 shadow-sm animate-pulse"
          >
            <div className="h-full w-full rounded-xl bg-muted/50" />
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground animate-pulse">
          {t.heritage.loadingPhotos}
        </p>
      </div>
    </div>
  );
}

export function WikimediaError({ onRetry }: { onRetry?: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-border/80 bg-card/90 p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-700 ring-1 ring-rose-200">
        <ImageOff className="h-6 w-6" />
      </div>

      <h3 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl">
        {t.heritage.errorTitle}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {t.heritage.errorDesc}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-ink shadow-sm hover:border-gold"
          >
            <RefreshCw className="h-4 w-4" />
            {t.heritage.retryBtn}
          </button>
        )}
        <a
          href={WIKIMEDIA_CONTRIBUTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Explore verified collection on Wikimedia Commons (opens in new tab)"
          className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-full gradient-saffron px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sacred hover:shadow-glow"
        >
          {t.heritage.exploreCommonsBtn}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export function WikimediaEmpty() {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-border/80 bg-card/90 p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-soft/50 text-saffron-deep ring-1 ring-gold/40">
        <ImageOff className="h-6 w-6" />
      </div>

      <h3 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl">
        {t.heritage.emptyTitle}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {t.heritage.emptyDesc}
      </p>

      <div className="mt-6">
        <a
          href={WIKIMEDIA_CONTRIBUTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Explore verified collection on Wikimedia Commons (opens in new tab)"
          className="interactive-surface inline-flex min-h-11 items-center gap-2 rounded-full gradient-saffron px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sacred hover:shadow-glow"
        >
          {t.heritage.exploreCommonsBtn}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
