import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { toast } from "sonner";
import {
  INSTALL_AVAILABLE_EVENT,
  isStandalonePwa,
  PROMPT_OPEN_EVENT,
  REQUEST_INSTALL_EVENT,
} from "@/lib/push";

type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const COOLDOWN_KEY = "temple-install-invite-next";
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

function hasCooldown() {
  try {
    return (Number(window.localStorage.getItem(COOLDOWN_KEY)) || 0) > Date.now();
  } catch {
    return false;
  }
}

function setCooldown() {
  try {
    window.localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
  } catch {
    // The invitation remains functional when local storage is unavailable.
  }
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredInstallPrompt | null>(null);
  const [visible, setVisible] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!import.meta.env.PROD || isStandalonePwa()) return;
    let interactionTimer: number | undefined;
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const prompt = event as DeferredInstallPrompt;
      setDeferredPrompt(prompt);
      window.dispatchEvent(new Event(INSTALL_AVAILABLE_EVENT));
    };
    const open = () => {
      if (!hasCooldown()) {
        window.dispatchEvent(new CustomEvent(PROMPT_OPEN_EVENT, { detail: "install" }));
        setVisible(true);
      }
    };
    const onMeaningfulInteraction = () => {
      if (!hasCooldown()) {
        interactionTimer = window.setTimeout(open, 2_000);
      }
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("temple:meaningful-interaction", onMeaningfulInteraction, {
      once: true,
    });
    window.addEventListener(REQUEST_INSTALL_EVENT, open);
    const closeForAnotherPrompt = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== "install") setVisible(false);
    };
    window.addEventListener(PROMPT_OPEN_EVENT, closeForAnotherPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("temple:meaningful-interaction", onMeaningfulInteraction);
      window.removeEventListener(REQUEST_INSTALL_EVENT, open);
      window.removeEventListener(PROMPT_OPEN_EVENT, closeForAnotherPrompt);
      if (interactionTimer) window.clearTimeout(interactionTimer);
    };
  }, []);

  const close = () => {
    setCooldown();
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    setWorking(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted")
        toast.success("Dariyapur Shiv Mandir has been added to your device.");
      setCooldown();
      setVisible(false);
      setDeferredPrompt(null);
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
                🛕 Keep Dariyapur With You
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Quick access to timings, directions, festivals and temple updates.
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
              {working ? "Opening..." : "Install App"}
            </button>
            <button
              type="button"
              onClick={close}
              disabled={working}
              className="interactive-surface min-h-10 rounded-xl border border-border bg-cream px-4 text-sm font-semibold text-ink hover:bg-secondary disabled:opacity-60"
            >
              Maybe Later
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
