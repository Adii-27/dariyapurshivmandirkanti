import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(path.join(root, "site.config.json"), "utf8"));
const siteUrl = config.url.replace(/\/+$/, "");
const paths = [
  "/",
  "/about",
  "/gallery",
  "/sangeet",
  "/seva",
  "/visitor-information",
  "/location",
  "/contact",
];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((pathname) => `  <url><loc>${new URL(pathname, `${siteUrl}/`)}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${new URL("/sitemap.xml", `${siteUrl}/`)}`,
  "",
].join("\n");

await Promise.all([
  writeFile(path.join(root, "public", "sitemap.xml"), sitemap),
  writeFile(path.join(root, "public", "robots.txt"), robots),
]);
