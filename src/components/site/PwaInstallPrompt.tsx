import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { toast } from "sonner";
import {
  INSTALL_AVAILABLE_EVENT,
  isStandalonePwa,
  PROMPT_OPEN_EVENT,
  REQUEST_INSTALL_EVENT,
} from "@/lib/push";
import { useLanguage } from "@/lib/i18n";

type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const INSTALL_HANDLED_KEY = "temple-install-onboarding-handled";
const INSTALL_DELAY_MS = 36_000; // Exactly 36 seconds for new visitors

function isInstallHandled() {
  try {
    return window.localStorage.getItem(INSTALL_HANDLED_KEY) === "true";
  } catch {
    return false;
  }
}

function markInstallHandled() {
  try {
    window.localStorage.setItem(INSTALL_HANDLED_KEY, "true");
  } catch {
    // Keep running normally if storage is blocked
  }
}

export function PwaInstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredInstallPrompt | null>(null);
  const deferredPromptRef = useRef<DeferredInstallPrompt | null>(null);
  const [visible, setVisible] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (isStandalonePwa()) return;

    let timer: number | undefined;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const prompt = event as DeferredInstallPrompt;
      deferredPromptRef.current = prompt;
      setDeferredPrompt(prompt);
      window.dispatchEvent(new Event(INSTALL_AVAILABLE_EVENT));

      // If not already handled/dismissed, schedule the 36-second one-shot timer
      if (!isInstallHandled() && !timer) {
        timer = window.setTimeout(() => {
          if (!isInstallHandled() && deferredPromptRef.current) {
            window.dispatchEvent(new CustomEvent(PROMPT_OPEN_EVENT, { detail: "install" }));
            setVisible(true);
          }
        }, INSTALL_DELAY_MS);
      }
    };

    // Explicit manual request (e.g. user taps "Install App" in navigation menu)
    const onManualRequest = () => {
      if (deferredPromptRef.current) {
        window.dispatchEvent(new CustomEvent(PROMPT_OPEN_EVENT, { detail: "install" }));
        setVisible(true);
      }
    };

    const onAppInstalled = () => {
      markInstallHandled();
      setVisible(false);
      setDeferredPrompt(null);
      deferredPromptRef.current = null;
    };

    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener(REQUEST_INSTALL_EVENT, onManualRequest);

    const closeForAnotherPrompt = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== "install") {
        setVisible(false);
      }
    };
    window.addEventListener(PROMPT_OPEN_EVENT, closeForAnotherPrompt);

    return () => {
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener(REQUEST_INSTALL_EVENT, onManualRequest);
      window.removeEventListener(PROMPT_OPEN_EVENT, closeForAnotherPrompt);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const close = () => {
    markInstallHandled();
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    setWorking(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        toast.success(t.pwa.installedToast);
      }
      markInstallHandled();
      setVisible(false);
      setDeferredPrompt(null);
      deferredPromptRef.current = null;
    } finally {
      setWorking(false);
    }
  };

  if (!deferredPrompt) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Install app invitation"
          className="fixed inset-x-3 bottom-3 z-[59] mx-auto max-w-md rounded-2xl border border-gold/55 bg-card p-4 shadow-sacred sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[25rem]"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Dismiss install invitation"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 pr-7">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-soft text-saffron-deep">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {t.pwa.promptTitle}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t.pwa.promptDesc}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void install()}
              disabled={working}
              className="interactive-surface min-h-10 rounded-xl gradient-saffron px-4 text-sm font-semibold text-primary-foreground shadow-sacred disabled:opacity-60"
            >
              {working ? t.pwa.openingBtn : t.pwa.installBtn}
            </button>
            <button
              type="button"
              onClick={close}
              disabled={working}
              className="interactive-surface min-h-10 rounded-xl border border-border bg-cream px-4 text-sm font-semibold text-ink hover:bg-secondary disabled:opacity-60"
            >
              {t.pwa.maybeLaterBtn}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
