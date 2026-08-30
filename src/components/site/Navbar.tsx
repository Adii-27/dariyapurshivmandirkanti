import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { TEMPLE_LOGO } from "@/lib/media";
import {
  latestChangedAt,
  UPDATES_SEEN_EVENT,
  UPDATES_SEEN_STORAGE_KEY,
} from "@/lib/updates-notifications";
import { INSTALL_AVAILABLE_EVENT, REQUEST_INSTALL_EVENT } from "@/lib/push";
import { useLanguage } from "@/lib/i18n";
import { LanguageSelector } from "./LanguageSelector";

export function Navbar({ updateChanges = [] }: { updateChanges?: string[] }) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [unseenUpdates, setUnseenUpdates] = useState(0);
  const [canInstall, setCanInstall] = useState(false);

  const links = [
    { href: "/#home", label: t.nav.home },
    { href: "/#about", label: t.nav.about },
    { href: "/heritage", label: t.nav.heritage },
    { href: "/#gallery", label: t.nav.gallery },
    { href: "/sangeet", label: t.nav.sangeet },
    { href: "/#seva", label: t.nav.seva },
    { href: "/#visit", label: t.nav.visitorInfo },
    { href: "/#location", label: t.nav.location },
    { href: "/faq", label: t.nav.faq },
    { href: "/#contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const markInstallAvailable = () => setCanInstall(true);
    window.addEventListener(INSTALL_AVAILABLE_EVENT, markInstallAvailable);
    return () => window.removeEventListener(INSTALL_AVAILABLE_EVENT, markInstallAvailable);
  }, []);

  useEffect(() => {
    let isScrolled = window.scrollY > 30;
    setScrolled(isScrolled);
    const onScroll = () => {
      const next = window.scrollY > 30;
      if (next !== isScrolled) {
        isScrolled = next;
        setScrolled(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const latest = latestChangedAt(updateChanges);
    if (!latest) {
      setUnseenUpdates(0);
      return;
    }

    const refresh = () => {
      let seenAt = 0;
      try {
        seenAt = Number(window.localStorage.getItem(UPDATES_SEEN_STORAGE_KEY)) || 0;
      } catch {
        seenAt = 0;
      }
      setUnseenUpdates(updateChanges.filter((value) => new Date(value).getTime() > seenAt).length);
    };

    refresh();
    const onSeen = () => setUnseenUpdates(0);
    window.addEventListener(UPDATES_SEEN_EVENT, onSeen);
    return () => window.removeEventListener(UPDATES_SEEN_EVENT, onSeen);
  }, [updateChanges]);

  const markUpdatesSeen = () => {
    const latest = latestChangedAt(updateChanges);
    if (!latest) return;
    try {
      window.localStorage.setItem(UPDATES_SEEN_STORAGE_KEY, String(latest));
    } catch {
      // Keep the current session state when local storage is unavailable.
    }
    setUnseenUpdates(0);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding,backdrop-filter] duration-300 ease-out ${
        scrolled
          ? "bg-cream/85 backdrop-blur-xl border-b border-border/60 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2.5 sm:gap-3 px-3.5 sm:px-6 lg:px-8">
        <a
          href="/#home"
          className="interactive-surface flex shrink-0 items-center gap-2.5 sm:gap-3 rounded-xl"
        >
          <img
            src={TEMPLE_LOGO}
            alt="Dariyapur Shiv Mandir Kanti logo"
            className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full object-cover ring-1 ring-gold/60 shadow-glow"
          />
          <div className="shrink-0 leading-tight">
            <div className="whitespace-nowrap font-display text-[14px] sm:text-base md:text-lg font-semibold text-ink">
              Dariyapur Shiv Mandir
            </div>
            <div className="font-hindi whitespace-nowrap text-[11px] sm:text-xs md:text-[13px] text-saffron-deep">
              दरियापुर शिव मंदिर काँटी
            </div>
          </div>
        </a>

        <nav className="hidden xl:flex items-center gap-2 xl:gap-3 2xl:gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative rounded-sm whitespace-nowrap text-xs xl:text-[12.5px] 2xl:text-sm font-medium text-ink/75 transition-colors duration-300 hover:text-saffron-deep
                         after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-saffron-deep
                         after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSelector variant="desktop" />
          <a
            href="/#updates"
            onClick={markUpdatesSeen}
            className="interactive-surface hidden min-h-11 items-center rounded-full gradient-saffron px-4 xl:px-5 py-2 text-xs xl:text-sm font-semibold text-primary-foreground shadow-sacred 2xl:inline-flex"
          >
            {t.nav.updates}
            {unseenUpdates > 0 && (
              <span className="ml-1.5 xl:ml-2 rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold tabular-nums text-saffron-deep">
                {unseenUpdates}
              </span>
            )}
          </a>
          <button
            aria-label={`${open ? t.footer.closeMenu : t.footer.openMenu}${
              unseenUpdates > 0
                ? `, ${unseenUpdates} unread update${unseenUpdates === 1 ? "" : "s"}`
                : ""
            }`}
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="interactive-surface relative grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-full border border-border bg-card/80 shadow-sm xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {unseenUpdates > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-cream bg-rose-600 px-1 text-[10px] font-bold leading-none tabular-nums text-white shadow-sm"
              >
                {unseenUpdates}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 mt-3 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-border bg-card/95 p-3 shadow-sacred backdrop-blur-xl sm:mx-6 xl:hidden"
          >
            <ul className="flex flex-col">
              <li className="mb-2">
                <LanguageSelector variant="mobile" />
              </li>
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    onClick={() => setOpen(false)}
                    href={l.href}
                    className="interactive-surface block min-h-11 rounded-lg px-4 py-3 text-sm font-medium text-ink hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {canInstall && (
                <li className="mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      window.dispatchEvent(new Event(REQUEST_INSTALL_EVENT));
                    }}
                    className="interactive-surface flex min-h-11 w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-saffron-deep hover:bg-gold-soft"
                  >
                    <Download className="h-4 w-4" />
                    📲 {t.nav.installApp}
                  </button>
                </li>
              )}
              <li className="mt-2 border-t border-border pt-3">
                <a
                  onClick={() => {
                    markUpdatesSeen();
                    setOpen(false);
                  }}
                  href="/#updates"
                  className="interactive-surface flex min-h-11 items-center justify-center rounded-full gradient-saffron px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sacred"
                >
                  {t.nav.updates}
                  {unseenUpdates > 0 && (
                    <span className="ml-2 rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold tabular-nums text-saffron-deep">
                      {unseenUpdates}
                    </span>
                  )}
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
