import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { TEMPLE_LOGO } from "@/lib/media";
import {
  latestChangedAt,
  UPDATES_SEEN_EVENT,
  UPDATES_SEEN_STORAGE_KEY,
} from "@/lib/updates-notifications";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/sangeet", label: "Sangeet" },
  { href: "/#seva", label: "Seva" },
  { href: "/#visit", label: "Visitor Information" },
  { href: "/#location", label: "Location" },
  { href: "/#contact", label: "Contact Us" },
];

export function Navbar({ updateChanges = [] }: { updateChanges?: string[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [unseenUpdates, setUnseenUpdates] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href="/#home" className="interactive-surface flex min-w-0 items-center gap-3 rounded-xl">
          <img
            src={TEMPLE_LOGO}
            alt="Dariyapur Shiv Mandir Kanti logo"
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-gold/60 shadow-glow"
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-base font-semibold text-ink sm:text-lg">
              Dariyapur Shiv Mandir
            </div>
            <div className="font-hindi truncate text-xs text-saffron-deep sm:text-[13px]">
              दरियापुर शिव मंदिर काँटी
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative rounded-sm whitespace-nowrap text-xs font-medium text-ink/75 transition-colors duration-300 hover:text-saffron-deep xl:text-sm
                         after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-saffron-deep
                         after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/#updates"
            onClick={markUpdatesSeen}
            className="interactive-surface hidden min-h-11 items-center rounded-full gradient-saffron px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sacred md:inline-flex"
          >
            Updates
            {unseenUpdates > 0 && (
              <span className="ml-2 rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold tabular-nums text-saffron-deep">
                {unseenUpdates}
              </span>
            )}
          </a>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="interactive-surface grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-card/80 shadow-sm lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="mx-4 mt-3 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-border bg-card/95 p-3 shadow-sacred backdrop-blur-xl sm:mx-6 lg:hidden"
          >
            <ul className="flex flex-col">
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
              <li className="mt-2 border-t border-border pt-3">
                <a
                  onClick={() => {
                    markUpdatesSeen();
                    setOpen(false);
                  }}
                  href="/#updates"
                  className="interactive-surface flex min-h-11 items-center justify-center rounded-full gradient-saffron px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sacred"
                >
                  Updates
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
