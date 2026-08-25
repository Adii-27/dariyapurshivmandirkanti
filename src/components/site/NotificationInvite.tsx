import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, X } from "lucide-react";
import { toast } from "sonner";
import { base64UrlToUint8Array, canUseWebPush, PROMPT_OPEN_EVENT } from "@/lib/push";

const COOLDOWN_KEY = "temple-notification-invite-next";
const INTERACTION_EVENT = "temple:meaningful-interaction";
const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

function eligible() {
  try {
    return (Number(window.localStorage.getItem(COOLDOWN_KEY)) || 0) <= Date.now();
  } catch {
    return true;
  }
}

function defer() {
  try {
    window.localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
  } catch {
    // A blocked local-storage write should not prevent normal browsing.
  }
}

export function NotificationInvite() {
  const [visible, setVisible] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!canUseWebPush() || Notification.permission !== "default" || !eligible()) return;
    let interacted = false;
    let timer: number | undefined;
    const showWhenEligible = () => {
      if (!interacted || document.hidden) return;
      timer = window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent(PROMPT_OPEN_EVENT, { detail: "notifications" }));
        setVisible(true);
      }, 30_000);
    };
    const markInteraction = () => {
      interacted = true;
      window.dispatchEvent(new Event(INTERACTION_EVENT));
      showWhenEligible();
    };
    window.addEventListener("pointerdown", markInteraction, { once: true, passive: true });
    const closeForAnotherPrompt = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== "notifications") setVisible(false);
    };
    window.addEventListener(PROMPT_OPEN_EVENT, closeForAnotherPrompt);
    return () => {
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener(PROMPT_OPEN_EVENT, closeForAnotherPrompt);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const close = (cooldown = true) => {
    if (cooldown) defer();
    setVisible(false);
  };

  const enable = async () => {
    setWorking(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        defer();
        setVisible(false);
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY),
        });
      }
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!response.ok) throw new Error("Subscription could not be saved");
      defer();
      setVisible(false);
      toast.success("🕉️ You're now connected");
    } catch {
      toast.error("Notifications could not be enabled. Please try again later.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Notification invitation"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-2xl border border-gold/55 bg-card p-4 shadow-sacred sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[25rem]"
        >
          <button
            type="button"
            onClick={() => close()}
            aria-label="Dismiss notification invitation"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 pr-7">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-soft text-saffron-deep">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                🔔 Stay Connected With the Mandir
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Receive festival reminders, important temple notices and new temple updates.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void enable()}
              disabled={working}
              className="interactive-surface inline-flex min-h-10 items-center justify-center gap-2 rounded-xl gradient-saffron px-4 text-sm font-semibold text-primary-foreground shadow-sacred disabled:opacity-60"
            >
              {working ? "Connecting..." : "Enable Notifications"}
              {!working && <Check className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => close()}
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
