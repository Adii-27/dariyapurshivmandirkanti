export type StoredPushSubscription = {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
};

export const INSTALL_AVAILABLE_EVENT = "temple:install-available";
export const REQUEST_INSTALL_EVENT = "temple:request-install";
export const PROMPT_OPEN_EVENT = "temple:prompt-open";

export function isStandalonePwa() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function base64UrlToUint8Array(value: string) {
  const padded = `${value}${"=".repeat((4 - (value.length % 4)) % 4)}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const binary = window.atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function canUseWebPush() {
  return (
    import.meta.env.PROD &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    Boolean(import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY)
  );
}
