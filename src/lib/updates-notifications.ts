export const UPDATES_SEEN_STORAGE_KEY = "dsmk-updates-seen-at";
export const UPDATES_SEEN_EVENT = "dsmk-updates-seen";

export function latestChangedAt(changes: string[]) {
  return changes.reduce((latest, value) => {
    const timestamp = new Date(value).getTime();
    return Number.isFinite(timestamp) && timestamp > latest ? timestamp : latest;
  }, 0);
}
