export const WIKIMEDIA_USER = "Dariyapurshivmandirkanti";
export const WIKIMEDIA_USER_URL = `https://commons.wikimedia.org/wiki/User:${WIKIMEDIA_USER}`;
export const WIKIMEDIA_CONTRIBUTIONS_URL = `https://commons.wikimedia.org/wiki/Special:Contributions/${WIKIMEDIA_USER}`;
export const WIKIMEDIA_API_ENDPOINT = "https://commons.wikimedia.org/w/api.php";

export type WikimediaCoordinates = {
  latitude: number;
  longitude: number;
  formatted: string;
  mapUrl: string;
};

export type TechnicalMetadata = {
  cameraMake?: string;
  cameraModel?: string;
  iso?: string;
  aperture?: string;
  exposureTime?: string;
  focalLength?: string;
  dateTimeOriginal?: string;
  software?: string;
};

export type WikimediaFile = {
  id: string;
  pageId: number;
  title: string;
  rawTitle: string;
  caption: string;
  description: string;
  thumbnailUrl: string;
  thumbWidth: number;
  thumbHeight: number;
  originalUrl: string;
  pageUrl: string;
  shortUrl?: string;
  mediaViewerUrl: string;
  date?: string;
  uploadDate: string;
  source: string;
  author: string;
  location?: string;
  coordinates?: WikimediaCoordinates;
  width: number;
  height: number;
  fileSize: number;
  fileSizeFormatted: string;
  mimeType: string;
  license: string;
  licenseName: string;
  licenseUrl?: string;
  categories: string[];
  technicalMetadata?: TechnicalMetadata;
};

type RawExtMetadataField = {
  value?: string | number;
  source?: string;
  hidden?: string;
};

type RawExtMetadata = Record<string, RawExtMetadataField | undefined>;

type RawExifItem = {
  name: string;
  value: unknown;
};

type RawImageInfo = {
  timestamp?: string;
  user?: string;
  size?: number;
  width?: number;
  height?: number;
  thumburl?: string;
  thumbwidth?: number;
  thumbheight?: number;
  url?: string;
  descriptionurl?: string;
  descriptionshorturl?: string;
  mime?: string;
  sha1?: string;
  metadata?: RawExifItem[];
  extmetadata?: RawExtMetadata;
};

type RawPage = {
  pageid?: number;
  ns?: number;
  title?: string;
  imageinfo?: RawImageInfo[];
};

type RawWikimediaResponse = {
  batchcomplete?: string;
  query?: {
    pages?: Record<string, RawPage>;
  };
  error?: {
    code: string;
    info: string;
  };
};

/**
 * Safely strips HTML tags and normalizes whitespace without using dangerous DOM injection.
 */
export function stripHtml(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Formats byte size into human readable string (KB / MB).
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`;
}

/**
 * Converts decimal degrees to Degree-Minute-Second string.
 */
function toDms(coordinate: number, posSymbol: string, negSymbol: string): string {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
  const direction = coordinate >= 0 ? posSymbol : negSymbol;
  return `${degrees}° ${String(minutes).padStart(2, "0")}′ ${String(seconds).padStart(4, "0")}″ ${direction}`;
}

export function formatCoordinates(lat: number, lng: number): WikimediaCoordinates {
  const formatted = `${toDms(lat, "N", "S")}, ${toDms(lng, "E", "W")}`;
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  return {
    latitude: lat,
    longitude: lng,
    formatted,
    mapUrl,
  };
}

/**
 * Formats ISO date or EXIF date into a clean display date.
 */
export function formatDisplayDate(dateStr: string | undefined | null): string | undefined {
  if (!dateStr) return undefined;
  const clean = dateStr.trim();
  if (!clean) return undefined;

  // Handle EXIF format: "YYYY:MM:DD HH:MM:SS" or "YYYY:MM:DD"
  if (/^\d{4}:\d{2}:\d{2}/.test(clean)) {
    const parts = clean.split(/[ :]/);
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(parseInt(year, 10), month, day);
    if (!isNaN(date.getTime())) {
      const formatted = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (parts.length >= 6) {
        const hours = parts[3].padStart(2, "0");
        const minutes = parts[4].padStart(2, "0");
        return `${formatted}, ${hours}:${minutes}`;
      }
      return formatted;
    }
  }

  // Handle standard ISO: "YYYY-MM-DD" or full ISO timestamp
  const date = new Date(clean);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return clean;
}

/**
 * Normalizes rational numbers from EXIF into clean readable strings.
 */
function parseFraction(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parts = value.split("/");
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (den !== 0 && !isNaN(num) && !isNaN(den)) return num / den;
    }
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return null;
}

function formatExposureTime(value: unknown): string | undefined {
  if (!value) return undefined;
  const str = String(value).trim();
  if (str.includes("/")) {
    const parts = str.split("/");
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (num > 0 && den > 0) {
      if (num === 1) return `${str} sec`;
      const ratio = den / num;
      if (Math.abs(ratio - Math.round(ratio)) < 0.05) {
        return `1/${Math.round(ratio)} sec`;
      }
      return `${(num / den).toFixed(3)} sec`;
    }
  }
  const frac = parseFraction(value);
  if (frac !== null) {
    if (frac < 1 && frac > 0) {
      return `1/${Math.round(1 / frac)} sec`;
    }
    return `${frac} sec`;
  }
  return str;
}

function formatAperture(value: unknown): string | undefined {
  if (!value) return undefined;
  const frac = parseFraction(value);
  if (frac !== null && frac > 0) {
    const formatted = frac < 10 ? frac.toFixed(2).replace(/\.?0+$/, "") : frac.toFixed(1);
    return `f/${formatted}`;
  }
  const str = String(value).trim();
  return str.startsWith("f/") ? str : `f/${str}`;
}

function formatFocalLength(value: unknown): string | undefined {
  if (!value) return undefined;
  const frac = parseFraction(value);
  if (frac !== null && frac > 0) {
    return `${frac < 100 ? frac.toFixed(2).replace(/\.?0+$/, "") : Math.round(frac)} mm`;
  }
  const str = String(value).trim();
  return str.endsWith("mm") ? str : `${str} mm`;
}

export function parseExifMetadata(metadata: RawExifItem[] | undefined): TechnicalMetadata | undefined {
  if (!metadata || !Array.isArray(metadata)) return undefined;

  const map = new Map<string, unknown>();
  for (const item of metadata) {
    if (item && item.name && item.value !== undefined && item.value !== null) {
      map.set(item.name, item.value);
    }
  }

  const cameraMake = map.get("Make") ? String(map.get("Make")).trim() : undefined;
  const cameraModel = map.get("Model") ? String(map.get("Model")).trim() : undefined;
  const isoRaw = map.get("ISOSpeedRatings");
  const iso = isoRaw !== undefined && isoRaw !== null ? String(isoRaw).trim() : undefined;
  const aperture = formatAperture(map.get("FNumber") ?? map.get("ApertureValue"));
  const exposureTime = formatExposureTime(map.get("ExposureTime") ?? map.get("ShutterSpeedValue"));
  const focalLength = formatFocalLength(map.get("FocalLength"));
  const rawDateTime = map.get("DateTimeOriginal") ?? map.get("DateTime");
  const dateTimeOriginal = rawDateTime ? formatDisplayDate(String(rawDateTime)) : undefined;
  const software = map.get("Software") ? String(map.get("Software")).trim() : undefined;

  const hasAnyField = Boolean(
    cameraMake || cameraModel || iso || aperture || exposureTime || focalLength || dateTimeOriginal,
  );

  if (!hasAnyField) return undefined;

  return {
    cameraMake,
    cameraModel,
    iso,
    aperture,
    exposureTime,
    focalLength,
    dateTimeOriginal,
    software,
  };
}

/**
 * Normalizes clean title from file title.
 */
function cleanTitle(rawTitle: string): string {
  return rawTitle.replace(/^File:/i, "").replace(/\.[^/.]+$/, "").replace(/_/g, " ").trim();
}

/**
 * Converts a raw Wikimedia page entry into our normalized type-safe WikimediaFile model.
 */
export function normalizeWikimediaFile(page: RawPage): WikimediaFile | null {
  if (!page || !page.imageinfo || !page.imageinfo[0]) return null;
  const info = page.imageinfo[0];

  const rawTitle = page.title || "File:Dariyapur Shiv Mandir Kanti.jpg";
  const title = cleanTitle(rawTitle);
  const ext = info.extmetadata || {};

  // Extract clean text description
  const rawDesc = ext.ImageDescription?.value ? String(ext.ImageDescription.value) : "";
  const description = stripHtml(rawDesc) || title;
  const caption = description.length > 180 ? `${description.slice(0, 177)}…` : description;

  // Extract Author and Source
  const rawArtist = ext.Artist?.value ? String(ext.Artist.value) : "";
  const author = stripHtml(rawArtist) || info.user || WIKIMEDIA_USER;
  const rawCredit = ext.Credit?.value ? String(ext.Credit.value) : "";
  const source = stripHtml(rawCredit) || "Own work";

  // Extract Dates
  const rawDateOriginal = ext.DateTimeOriginal?.value ? String(ext.DateTimeOriginal.value) : undefined;
  const rawDateTime = ext.DateTime?.value ? String(ext.DateTime.value) : undefined;
  const date = formatDisplayDate(rawDateOriginal ?? rawDateTime);
  const uploadDate = formatDisplayDate(info.timestamp) || "Unknown upload date";

  // Coordinates
  let coordinates: WikimediaCoordinates | undefined = undefined;
  const latStr = ext.GPSLatitude?.value ? String(ext.GPSLatitude.value) : undefined;
  const lngStr = ext.GPSLongitude?.value ? String(ext.GPSLongitude.value) : undefined;
  if (latStr && lngStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) {
      coordinates = formatCoordinates(lat, lng);
    }
  }

  // Location context
  const location = "Dariyapur, Kanti, Muzaffarpur, Bihar, India";

  // Licensing
  const licenseShort = ext.LicenseShortName?.value ? stripHtml(String(ext.LicenseShortName.value)) : "CC BY-SA 4.0";
  const licenseName = ext.UsageTerms?.value
    ? stripHtml(String(ext.UsageTerms.value))
    : "Creative Commons Attribution-ShareAlike 4.0 International";
  const licenseUrl = ext.LicenseUrl?.value
    ? String(ext.LicenseUrl.value).trim()
    : "https://creativecommons.org/licenses/by-sa/4.0";

  // Dimensions & URLs
  const width = info.width || 800;
  const height = info.height || 600;
  const originalUrl = info.url || "";
  const thumbnailUrl = info.thumburl || originalUrl;
  const thumbWidth = info.thumbwidth || Math.min(width, 800);
  const thumbHeight = info.thumbheight || Math.round((height / width) * thumbWidth);
  const pageUrl = info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(rawTitle)}`;
  const shortUrl = info.descriptionshorturl;
  const mediaViewerUrl = `${pageUrl}#/media/${encodeURIComponent(rawTitle)}`;
  const fileSize = info.size || 0;
  const fileSizeFormatted = formatFileSize(fileSize);
  const mimeType = info.mime || "image/jpeg";

  // Categories
  const categoriesRaw = ext.Categories?.value ? String(ext.Categories.value) : "";
  const categories = categoriesRaw
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0 && !c.includes("missing SDC"));

  // Technical EXIF
  const technicalMetadata = parseExifMetadata(info.metadata);

  return {
    id: String(page.pageid || info.sha1 || rawTitle),
    pageId: page.pageid || 0,
    title,
    rawTitle,
    caption,
    description,
    thumbnailUrl,
    thumbWidth,
    thumbHeight,
    originalUrl,
    pageUrl,
    shortUrl,
    mediaViewerUrl,
    date,
    uploadDate,
    source,
    author,
    location,
    coordinates,
    width,
    height,
    fileSize,
    fileSizeFormatted,
    mimeType,
    license: licenseShort,
    licenseName,
    licenseUrl,
    categories,
    technicalMetadata,
  };
}

/**
 * Fetches the live collection of photos uploaded by the verified contributor from Wikimedia Commons.
 * Automatically discovers new uploads without hardcoding or code changes.
 */
export async function fetchWikimediaCollection(options: { signal?: AbortSignal } = {}): Promise<WikimediaFile[]> {
  const url = new URL(WIKIMEDIA_API_ENDPOINT);
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "allimages");
  url.searchParams.set("gaiuser", WIKIMEDIA_USER);
  url.searchParams.set("gaisort", "timestamp");
  url.searchParams.set("gaidir", "older");
  url.searchParams.set("gailimit", "50");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set(
    "iiprop",
    "timestamp|user|url|size|dimensions|sha1|mime|metadata|extmetadata",
  );
  url.searchParams.set("iiurlwidth", "800");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Api-User-Agent":
        "DariyapurShivMandirKantiWebsite/1.0 (https://dariyapurshivmandirkantiorg.vercel.app; dariyapurshivmandirkanti@gmail.com)",
    },
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Wikimedia API responded with HTTP status ${response.status}`);
  }

  const data = (await response.json()) as RawWikimediaResponse;
  if (data.error) {
    throw new Error(`Wikimedia API error: ${data.error.info || data.error.code}`);
  }

  const rawPages = data.query?.pages;
  if (!rawPages || typeof rawPages !== "object") {
    return [];
  }

  const files: WikimediaFile[] = [];
  for (const key of Object.keys(rawPages)) {
    const page = rawPages[key];
    try {
      const normalized = normalizeWikimediaFile(page);
      if (normalized && normalized.thumbnailUrl) {
        files.push(normalized);
      }
    } catch {
      // Gracefully continue so one malformed file does not break the collection
    }
  }

  // Sort by upload timestamp descending (newest uploads first)
  files.sort((a, b) => {
    const timeA = new Date(a.uploadDate).getTime() || 0;
    const timeB = new Date(b.uploadDate).getTime() || 0;
    return timeB - timeA;
  });

  return files;
}
