import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { schools } from "../src/data/schools.js";

const client = new ConvexHttpClient("https://zany-caterpillar-279.convex.cloud");

// Convex does not accept null — strip nulls recursively
function stripNulls(obj) {
  if (Array.isArray(obj)) return obj.map(stripNulls);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => [k, stripNulls(v)])
    );
  }
  return obj;
}

async function seed() {
  console.log(`Seeding ${schools.length} schools...`);
  for (const school of schools) {
    const clean = stripNulls(school);
    try {
      await client.mutation(api.schools.upsert, { school: clean });
      console.log(`  ✔ ${school.name}`);
    } catch (err) {
      console.error(`  ✗ ${school.name}:`, err.message);
    }
  }
  console.log("Done!");
}

seed().catch(console.error);
