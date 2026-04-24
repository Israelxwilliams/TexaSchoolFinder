/**
 * Fetch the best available photo from each school's website.
 * Preference order: exterior → interior → people → anything else (logo/graphic).
 * Scores images by alt text + src URL keywords. Re-run safe — clears old photos first.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = "https://zany-caterpillar-279.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

const TIMEOUT_MS = 7000;
const CONCURRENCY = 10;

// Keyword sets for each priority tier (matched against alt text + src URL)
const TIERS = [
  {
    score: 40,
    label: "exterior",
    re: /campus|exterior|outside|building|aerial|front.of|entrance|facade|grounds|facility/i,
  },
  {
    score: 30,
    label: "interior",
    re: /classroom|library|gymnasium|gym|cafeteria|hallway|interior|lab|chapel|auditorium|stage|studio/i,
  },
  {
    score: 20,
    label: "people",
    re: /student|teacher|staff|faculty|graduate|graduation|class|kids|children|learning|instruction|activity|choir|band|sport|athlete/i,
  },
  {
    score: 5,
    label: "generic",
    re: /./, // matches anything — last resort
  },
];

// Things we never want
const SKIP_RE = /logo|icon|favicon|banner|header|footer|nav|menu|button|arrow|bg-|background|placeholder|spinner|loader|pixel|1x1|blank|spacer|ad[_-]/i;

// Skip tiny images (icons, spacers) based on dimension hints in src or explicit attributes
function looksSmall(src, width, height) {
  if (width && height && (width < 200 || height < 150)) return true;
  if (/[_-](16|24|32|48|64|96|icon|thumb)[_.-]/i.test(src)) return true;
  return false;
}

// Resolve a potentially relative URL against the page base
function resolveUrl(src, base) {
  if (!src) return null;
  if (src.startsWith("data:")) return null; // skip data URIs
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("http")) return src;
  try {
    return new URL(src, base).href;
  } catch {
    return null;
  }
}

// Score a single image candidate
function scoreImage(src, alt) {
  const text = `${alt || ""} ${src}`.toLowerCase();
  if (SKIP_RE.test(text)) return -1;
  for (const tier of TIERS) {
    if (tier.re.test(text)) return tier.score;
  }
  return 1;
}

async function fetchBestPhoto(website) {
  if (!website) return { url: null, label: null };
  const base = website.startsWith("http") ? website : `https://${website}`;

  let html;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(base, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SchoolFinder/1.0)" },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return { url: null, label: null };
    html = await res.text();
  } catch {
    return { url: null, label: null };
  }

  // --- Collect all <img> candidates ---
  const candidates = [];

  // All <img> tags: extract src, alt, width, height
  const imgRe = /<img\s([^>]+)>/gi;
  let m;
  while ((m = imgRe.exec(html)) !== null) {
    const attrs = m[1];
    const src = (attrs.match(/\bsrc=["']([^"']+)["']/i) || [])[1];
    const alt = (attrs.match(/\balt=["']([^"']*)["']/i) || [])[1] || "";
    const width = parseInt((attrs.match(/\bwidth=["']?(\d+)/i) || [])[1]) || 0;
    const height = parseInt((attrs.match(/\bheight=["']?(\d+)/i) || [])[1]) || 0;
    const resolved = resolveUrl(src, base);
    if (!resolved) continue;
    if (looksSmall(resolved, width || null, height || null)) continue;
    const score = scoreImage(resolved, alt);
    if (score >= 0) candidates.push({ url: resolved, alt, score });
  }

  // CSS background-image in style attributes (often used for hero sections)
  const bgRe = /background(?:-image)?\s*:\s*url\(['"]?([^'")\s]+)['"]?\)/gi;
  while ((m = bgRe.exec(html)) !== null) {
    const resolved = resolveUrl(m[1], base);
    if (!resolved) continue;
    const score = scoreImage(resolved, "");
    if (score >= 0) candidates.push({ url: resolved, alt: "", score });
  }

  // og:image as a scored candidate (not automatic winner anymore)
  const ogRe =
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i.exec(html) ||
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i.exec(html);
  if (ogRe?.[1]) {
    const resolved = resolveUrl(ogRe[1], base);
    if (resolved) {
      // og:image gets a modest base score; keyword matching may boost it
      const score = Math.max(10, scoreImage(resolved, "og:image"));
      candidates.push({ url: resolved, alt: "og:image", score });
    }
  }

  if (candidates.length === 0) return { url: null, label: null };

  // Pick highest score; tie-break by order (earlier in page = more prominent)
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  const tier = TIERS.find(t => best.score >= t.score) || TIERS[TIERS.length - 1];
  return { url: best.url, label: tier.label };
}

async function processBatch(items, fn, concurrency) {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}

async function run() {
  console.log("Fetching all schools from Convex...");
  const schools = await client.query(api.schools.getAll, {});
  console.log(`Found ${schools.length} schools\n`);

  // Re-fetch ALL schools (overwrite previous og:image results with smarter picks)
  const toFetch = schools.filter(s => s.website);
  console.log(`${toFetch.length} schools have websites — re-fetching all for better photos\n`);

  const counts = { exterior: 0, interior: 0, people: 0, generic: 0, none: 0 };

  await processBatch(toFetch, async (school) => {
    const { url, label } = await fetchBestPhoto(school.website);
    if (url) {
      try {
        await client.mutation(api.schools.upsert, {
          school: { ...school, id: school.schoolId, photos: [url] },
        });
        console.log(`  ✔ [${label}] ${school.name}`);
        counts[label] = (counts[label] || 0) + 1;
      } catch (err) {
        console.error(`  ✗ ${school.name} (save failed): ${err.message}`);
        counts.none++;
      }
    } else {
      console.log(`  — ${school.name}: no image found`);
      counts.none++;
    }
  }, CONCURRENCY);

  console.log(`
Done!
  Exterior shots : ${counts.exterior}
  Interior shots : ${counts.interior}
  People photos  : ${counts.people}
  Generic/other  : ${counts.generic}
  No image       : ${counts.none}
`);
}

run().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
