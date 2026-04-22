/**
 * Fetch og:image from each school's website and store in Convex.
 * Run this after scrape-tefa.mjs to populate the photo gallery.
 * Safe to re-run — skips schools that already have photos.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = "https://zany-caterpillar-279.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

const TIMEOUT_MS = 5000;
const CONCURRENCY = 15;

async function fetchOgImage(website) {
  if (!website) return null;
  const url = website.startsWith("http") ? website : `https://${website}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SchoolFinder/1.0)" },
      redirect: "follow",
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const html = await res.text();

    // og:image (both attribute orderings)
    const og =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (og?.[1]) return og[1];

    // twitter:image fallback
    const tw =
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (tw?.[1]) return tw[1];

    return null;
  } catch {
    return null;
  }
}

async function processBatch(items, fn, concurrency) {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}

async function run() {
  console.log("Fetching all schools from Convex...");
  const schools = await client.query(api.schools.getAll, {});
  console.log(`Found ${schools.length} schools`);

  const toFetch = schools.filter(s => s.website && (!s.photos || s.photos.length === 0));
  const alreadyHave = schools.length - toFetch.length;
  console.log(`${toFetch.length} need photos, ${alreadyHave} already have photos\n`);

  let found = 0;
  let missing = 0;

  await processBatch(toFetch, async (school) => {
    const photo = await fetchOgImage(school.website);
    if (photo) {
      try {
        await client.mutation(api.schools.upsert, {
          school: { ...school, id: school.schoolId, photos: [photo] },
        });
        console.log(`  ✔ ${school.name}`);
        found++;
      } catch (err) {
        console.error(`  ✗ ${school.name} (save failed): ${err.message}`);
        missing++;
      }
    } else {
      console.log(`  — ${school.name}: no image`);
      missing++;
    }
  }, CONCURRENCY);

  console.log(`\nDone! ${found} photos saved, ${missing} schools without photos.`);
}

run().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
