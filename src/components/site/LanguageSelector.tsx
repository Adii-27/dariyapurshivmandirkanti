import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n";

export function LanguageSelector({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setOpen(false);
    buttonRef.current?.focus();
  };

  if (variant === "mobile") {
    return (
      <div className="rounded-xl border border-border/80 bg-secondary/30 p-2">
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Globe className="h-3.5 w-3.5 text-saffron-deep" aria-hidden="true" />
          <span>{t.languageSelector.label}</span>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`interactive-surface flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
              language === "en"
                ? "border border-saffron-deep/40 bg-card text-saffron-deep shadow-sm ring-1 ring-saffron-deep/20"
                : "border border-transparent text-ink/70 hover:bg-card/60 hover:text-ink"
            }`}
            aria-pressed={language === "en"}
          >
            {language === "en" && <Check className="h-3.5 w-3.5 text-saffron-deep stroke-[2.5]" />}
            <span>English</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            lang="hi"
            className={`interactive-surface flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
              language === "hi"
                ? "border border-saffron-deep/40 bg-card text-saffron-deep shadow-sm ring-1 ring-saffron-deep/20"
                : "border border-transparent text-ink/70 hover:bg-card/60 hover:text-ink"
            }`}
            aria-pressed={language === "hi"}
          >
            {language === "hi" && <Check className="h-3.5 w-3.5 text-saffron-deep stroke-[2.5]" />}
            <span className="font-hindi">हिन्दी</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.languageSelector.label}: ${language === "en" ? "English" : "हिन्दी"}`}
        className="interactive-surface inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border/80 bg-card/85 px-3.5 py-1.5 text-xs font-semibold text-ink/85 shadow-sm backdrop-blur hover:border-gold/60 hover:text-saffron-deep focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Globe className="h-3.5 w-3.5 text-saffron-deep" aria-hidden="true" />
        <span>{language === "en" ? "EN" : "हिन्दी"}</span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            role="listbox"
            aria-label={t.languageSelector.label}
            className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-gold/40 bg-card/95 p-1.5 shadow-sacred backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/50">
              {t.languageSelector.label}
            </div>
            <button
              type="button"
              role="option"
              aria-selected={language === "en"}
              onClick={() => selectLanguage("en")}
              className={`interactive-surface flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                language === "en"
                  ? "bg-saffron/10 text-saffron-deep"
                  : "text-ink/80 hover:bg-secondary/70 hover:text-ink"
              }`}
            >
              <span>English</span>
              {language === "en" && (
                <Check className="h-3.5 w-3.5 text-saffron-deep stroke-[2.5]" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              role="option"
              aria-selected={language === "hi"}
              onClick={() => selectLanguage("hi")}
              lang="hi"
              className={`interactive-surface flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                language === "hi"
                  ? "bg-saffron/10 text-saffron-deep"
                  : "text-ink/80 hover:bg-secondary/70 hover:text-ink"
              }`}
            >
              <span className="font-hindi">हिन्दी</span>
              {language === "hi" && (
                <Check className="h-3.5 w-3.5 text-saffron-deep stroke-[2.5]" aria-hidden="true" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
