import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  schools: defineTable({
    // Identity
    schoolId: v.string(),
    name: v.string(),
    type: v.array(v.string()),
    description: v.string(),
    tagline: v.string(),

    // Location
    address: v.string(),
    city: v.string(),
    county: v.string(),
    lat: v.number(),
    lng: v.number(),

    // TEFA & Tuition
    acceptsTEFA: v.boolean(),
    tuitionByGrade: v.any(),
    tuitionDisplay: v.string(),
    financialAidAvailable: v.boolean(),

    // Enrollment & Stats
    grades: v.array(v.string()),
    gradesLabel: v.string(),
    enrollment: v.number(),
    studentTeacherRatio: v.string(),
    avgClassSize: v.number(),
    avgGraduatingClassSize: v.optional(v.number()),
    founded: v.number(),

    // Academics
    accreditation: v.array(v.string()),
    curriculumType: v.array(v.string()),
    ibProgram: v.boolean(),
    apCourses: v.boolean(),
    dualEnrollment: v.boolean(),
    avgSAT: v.optional(v.number()),
    avgACT: v.optional(v.number()),
    collegeAcceptanceRate: v.optional(v.number()),
    languagesOffered: v.array(v.string()),

    // Extracurriculars
    athletics: v.array(v.string()),
    uilParticipant: v.boolean(),
    fineArts: v.array(v.string()),
    clubs: v.array(v.string()),

    // Services
    specialEdSupport: v.boolean(),
    counselingServices: v.boolean(),
    transportationProvided: v.boolean(),
    lunchProgram: v.boolean(),
    beforeAfterCare: v.boolean(),
    boardingOption: v.boolean(),

    // Profile
    setting: v.string(),
    campusSize: v.string(),
    rating: v.number(),
    reviewCount: v.number(),

    // Content
    reviews: v.array(v.any()),
    photos: v.array(v.string()),
    website: v.string(),
    phone: v.string(),
    email: v.string(),

    // Admissions
    admissionsRequirements: v.array(v.string()),
    entranceExamRequired: v.boolean(),
    currentOpenings: v.array(v.string()),
    waitlistGrades: v.array(v.string()),
  }).index("by_schoolId", ["schoolId"])
    .index("by_city", ["city"])
    .index("by_rating", ["rating"]),
});
