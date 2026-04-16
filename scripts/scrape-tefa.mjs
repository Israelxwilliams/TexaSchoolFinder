/**
 * TEFA School Scraper
 * Fetches live school data from the official Texas Education Freedom Accounts
 * school finder and replaces all records in Convex.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const TEFA_DATA_URL = "https://finder.educationfreedom.texas.gov/data/tx/vendors.json";
const CONVEX_URL = "https://zany-caterpillar-279.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

// Map grade numbers to readable labels
function buildGradeList(minGrade, maxGrade) {
  const GRADE_MAP = {
    "-1": "PreK",
    "0": "K",
    "1": "1", "2": "2", "3": "3", "4": "4",
    "5": "5", "6": "6", "7": "7", "8": "8",
    "9": "9", "10": "10", "11": "11", "12": "12",
  };
  if (minGrade == null || maxGrade == null) return [];
  const grades = [];
  for (let g = minGrade; g <= maxGrade; g++) {
    const label = GRADE_MAP[String(g)];
    if (label) grades.push(label);
  }
  return grades;
}

// Build tuition display string
function buildTuitionDisplay(min, max) {
  if (!min && !max) return "Contact for tuition";
  if (min === max || !max) return `$${(min || max).toLocaleString()}/yr`;
  return `$${min.toLocaleString()} - $${max.toLocaleString()}/yr`;
}

// Build tuitionByGrade object from min/max (TEFA data doesn't have per-grade breakdowns)
function buildTuitionByGrade(min, max, grades) {
  const tuition = max || min || 0;
  if (!tuition || grades.length === 0) return { General: tuition };
  const obj = {};
  for (const g of grades) obj[g] = tuition;
  return obj;
}

// Detect amenity-based booleans
function hasAmenity(amenities = [], keyword) {
  return amenities.some(a => a.toLowerCase().includes(keyword.toLowerCase()));
}

// Strip null/undefined values recursively
function stripNulls(obj) {
  if (Array.isArray(obj)) return obj.map(stripNulls).filter(v => v !== null && v !== undefined);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => [k, stripNulls(v)])
    );
  }
  return obj;
}

// Map a raw TEFA vendor record to our Convex schema
function mapSchool(raw) {
  const fin = raw.schoolAttributes?.financial || {};
  const feat = raw.schoolAttributes?.features || {};
  const acad = raw.schoolAttributes?.academics || {};

  const minTuition = fin.minAnnualTuition || null;
  const maxTuition = fin.maxAnnualTuition || null;
  const grades = buildGradeList(raw.minGrade, raw.maxGrade);
  const amenities = feat.amenities || [];
  const supportResources = feat.supportResources || [];

  // Derive setting from region
  const region = raw.address?.region || "";
  let setting = "Suburban";
  if (region.toLowerCase().includes("area") || ["Houston", "Dallas", "San Antonio", "Austin", "Fort Worth", "El Paso"].some(c => region.includes(c))) {
    setting = "Urban";
  }

  // Derive student:teacher ratio string
  const str = acad.studentTeacherRatio
    ? `${Math.round(acad.studentTeacherRatio)}:1`
    : null;

  return {
    id: raw.id,
    name: raw.name,
    type: raw.type ? [raw.type] : ["Private School"],
    description: raw.description || "",
    tagline: "",

    // Location
    address: [raw.address?.street, raw.address?.city, raw.address?.state, raw.address?.zipcode]
      .filter(Boolean).join(", "),
    city: raw.address?.city || "",
    county: raw.address?.county || "",
    region: raw.address?.region || "",
    state: raw.address?.state || "TX",
    zipcode: raw.address?.zipcode || "",
    lat: raw.location?.lat || null,
    lng: raw.location?.lng || null,

    // TEFA & Tuition
    acceptsTEFA: raw.costOptions === "EFA-Eligible",
    costOptions: raw.costOptions || "",
    tuitionByGrade: buildTuitionByGrade(minTuition, maxTuition, grades),
    tuitionDisplay: buildTuitionDisplay(minTuition, maxTuition),
    minAnnualTuition: minTuition || null,
    maxAnnualTuition: maxTuition || null,
    financialAidAvailable: (fin.financialAccessibility || []).length > 0,
    financialAccessibility: fin.financialAccessibility || [],

    // Grades
    grades,
    gradesLabel: raw.displayGradeRange || "",
    displayGradeRange: raw.displayGradeRange || "",
    isPreK: raw.isPreK || false,
    isElementary: raw.isElementary || false,
    isMiddle: raw.isMiddle || false,
    isHigh: raw.isHigh || false,
    minGrade: raw.minGrade,
    maxGrade: raw.maxGrade,

    // Academics
    accreditation: [],
    curriculumType: feat.academicFocusAreas || [],
    academicFocusAreas: feat.academicFocusAreas || [],
    curricularClassification: raw.curricularClassification || null,
    ibProgram: false,
    apCourses: false,
    dualEnrollment: false,
    languagesOffered: [],
    studentGrowth: acad.studentGrowth || null,
    attendanceRate: acad.attendanceRate || null,
    graduationRate: acad.graduationRate || null,
    retentionRate: acad.retentionRate || null,
    studentTeacherRatio: str,
    notableAchievements: acad.notableAchievements || [],

    // Services
    specialEdSupport: hasAmenity(supportResources, "special") || hasAmenity(amenities, "special"),
    counselingServices: hasAmenity(supportResources, "counseling"),
    transportationProvided: hasAmenity(amenities, "transport") || hasAmenity(amenities, "bus"),
    lunchProgram: hasAmenity(amenities, "meal") || hasAmenity(amenities, "lunch"),
    beforeAfterCare: (feat.extracurricularOfferings || []).some(e => e.toLowerCase().includes("after school")),
    boardingOption: false,
    supportResources: supportResources,
    cultureAndValues: feat.cultureAndValues || [],
    amenities,
    extracurricularOfferings: feat.extracurricularOfferings || [],

    // Athletics & activities
    athletics: [],
    uilParticipant: false,
    fineArts: [],
    clubs: [],

    // Profile
    serviceType: raw.serviceType || ["local"],
    setting,
    campusSize: "Unknown",
    enrollment: 0,
    avgClassSize: 0,
    founded: 0,
    rating: 0,
    reviewCount: 0,

    // Contact
    website: raw.contact?.website || "",
    phone: raw.contact?.phone || "",
    email: raw.contact?.email || "",

    // Content
    reviews: [],
    photos: [],

    // Admissions
    admissionsRequirements: [],
    entranceExamRequired: false,
    currentOpenings: [],
    waitlistGrades: [],
  };
}

async function run() {
  // 1. Fetch TEFA data
  console.log(`Fetching school data from TEFA...`);
  const cacheBuster = Math.floor(Date.now() / 86400000);
  const res = await fetch(`${TEFA_DATA_URL}?_=${cacheBuster}`);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  const raw = await res.json();

  // 2. Filter to schools only
  const schools = raw.filter(v => v.vendorType === "Schools" && !v.deleted_at);
  console.log(`Found ${schools.length} schools (${raw.length} total vendors)`);

  // 3. Clear existing Convex data
  console.log("Clearing existing Convex records...");
  const result = await client.mutation(api.schools.clearAll, {});
  console.log(`  Deleted ${result.deleted} existing records`);

  // 4. Insert scraped schools
  console.log("Inserting scraped schools...");
  let success = 0;
  let failed = 0;
  for (const rawSchool of schools) {
    try {
      const mapped = stripNulls(mapSchool(rawSchool));
      await client.mutation(api.schools.upsert, { school: mapped });
      console.log(`  ✔ ${rawSchool.name} (${rawSchool.address?.city || "?"}) — ${mapped.acceptsTEFA ? "EFA-Eligible" : "Not EFA"}`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${rawSchool.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! ${success} inserted, ${failed} failed.`);
}

run().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
