import { useEffect, useRef, type MutableRefObject } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

const LOADING_NOTICE_DELAY_MS = 3000;
const SLOW_LOAD_NOTICE_DELAY_MS = 5000;
const RESTORED_NOTICE_DURATION_MS = 4000;

const NETWORK_TOAST_IDS = {
  loading: "network-loading-content",
  slow: "network-slow-connection",
  offline: "network-offline",
  restored: "network-restored",
} as const;

type NetworkNotice = "loading" | "slow" | "offline" | "restored";

type NetworkInformation = EventTarget & {
  effectiveType?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
};

function getNetworkConnection() {
  const nav = window.navigator as NavigatorWithConnection;
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

function isSlowConnection(connection: NetworkInformation | undefined) {
  return connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
}

function dismissNetworkToast(notice: NetworkNotice) {
  toast.dismiss(NETWORK_TOAST_IDS[notice]);
}

export function NetworkStatusNotifier() {
  const { t } = useLanguage();
  const activeNoticeRef = useRef<NetworkNotice | null>(null);
  const pageLoadedRef = useRef(false);
  const loadingTimerRef = useRef<number | null>(null);
  const slowLoadTimerRef = useRef<number | null>(null);
  const restoredDismissTimerRef = useRef<number | null>(null);

  const noticeContent: Record<
    NetworkNotice,
    { title: string; description: string; icon: string; duration: number }
  > = {
    loading: {
      title: t.network.loadingTitle,
      description: t.network.loadingDesc,
      icon: "⏳",
      duration: Infinity,
    },
    slow: {
      title: t.network.slowTitle,
      description: t.network.slowDesc,
      icon: "⚠️",
      duration: Infinity,
    },
    offline: {
      title: t.network.offlineTitle,
      description: t.network.offlineDesc,
      icon: "📡",
      duration: Infinity,
    },
    restored: {
      title: t.network.restoredTitle,
      description: t.network.restoredDesc,
      icon: "✅",
      duration: RESTORED_NOTICE_DURATION_MS,
    },
  };

  const showNetworkToast = (notice: NetworkNotice) => {
    const content = noticeContent[notice];

    toast(content.title, {
      id: NETWORK_TOAST_IDS[notice],
      description: content.description,
      icon: <span aria-hidden="true">{content.icon}</span>,
      duration: content.duration,
      className:
        "border-gold/40 bg-card/95 text-ink shadow-sacred backdrop-blur supports-[backdrop-filter]:bg-card/90",
      descriptionClassName: "text-muted-foreground leading-relaxed",
    });
  };

  useEffect(() => {
    const clearTimer = (timerRef: MutableRefObject<number | null>) => {
      if (timerRef.current === null) return;
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    const clearLoadTimers = () => {
      clearTimer(loadingTimerRef);
      clearTimer(slowLoadTimerRef);
    };

    const showNotice = (notice: NetworkNotice) => {
      if (activeNoticeRef.current === notice) return;

      if (activeNoticeRef.current) {
        dismissNetworkToast(activeNoticeRef.current);
      }

      activeNoticeRef.current = notice;
      showNetworkToast(notice);
    };

    const clearActiveNotice = () => {
      if (!activeNoticeRef.current) return;
      dismissNetworkToast(activeNoticeRef.current);
      activeNoticeRef.current = null;
    };

    const finishInitialLoad = () => {
      pageLoadedRef.current = true;
      clearLoadTimers();

      if (
        activeNoticeRef.current === "loading" ||
        (activeNoticeRef.current === "slow" && !isSlowConnection(getNetworkConnection()))
      ) {
        clearActiveNotice();
      }
    };

    const handleConnectionChange = () => {
      if (!window.navigator.onLine) {
        return;
      }

      if (isSlowConnection(getNetworkConnection())) {
        if (!pageLoadedRef.current || activeNoticeRef.current === null) {
          showNotice("slow");
        }
        return;
      }

      if (activeNoticeRef.current === "slow") {
        clearActiveNotice();
      }
    };

    const handleOffline = () => {
      clearTimer(restoredDismissTimerRef);
      showNotice("offline");
    };

    const handleOnline = () => {
      clearLoadTimers();
      showNotice("restored");
      clearTimer(restoredDismissTimerRef);
      restoredDismissTimerRef.current = window.setTimeout(() => {
        if (activeNoticeRef.current === "restored") {
          clearActiveNotice();
          handleConnectionChange();
        }
      }, RESTORED_NOTICE_DURATION_MS);
      handleConnectionChange();
    };

    if (document.readyState === "complete") {
      pageLoadedRef.current = true;
    } else {
      loadingTimerRef.current = window.setTimeout(() => {
        if (!pageLoadedRef.current && window.navigator.onLine) {
          showNotice("loading");
        }
      }, LOADING_NOTICE_DELAY_MS);

      slowLoadTimerRef.current = window.setTimeout(() => {
        if (!pageLoadedRef.current && window.navigator.onLine) {
          showNotice("slow");
        }
      }, SLOW_LOAD_NOTICE_DELAY_MS);

      window.addEventListener("load", finishInitialLoad, { once: true });
    }

    if (!window.navigator.onLine) {
      handleOffline();
    } else if (isSlowConnection(getNetworkConnection())) {
      showNotice("slow");
    }

    const connection = getNetworkConnection();
    connection?.addEventListener?.("change", handleConnectionChange);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      clearLoadTimers();
      clearTimer(restoredDismissTimerRef);
      window.removeEventListener("load", finishInitialLoad);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      connection?.removeEventListener?.("change", handleConnectionChange);
    };
  }, [t]);

  return null;
}
