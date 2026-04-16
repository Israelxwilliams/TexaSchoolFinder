import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  schools: defineTable({
    // Identity
    schoolId: v.string(),
    name: v.string(),
    type: v.array(v.string()),
    description: v.optional(v.string()),
    tagline: v.optional(v.string()),

    // Location
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    county: v.optional(v.string()),
    region: v.optional(v.string()),
    state: v.optional(v.string()),
    zipcode: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),

    // TEFA & Tuition
    acceptsTEFA: v.optional(v.boolean()),
    costOptions: v.optional(v.string()),
    tuitionByGrade: v.optional(v.any()),
    tuitionDisplay: v.optional(v.string()),
    minAnnualTuition: v.optional(v.number()),
    maxAnnualTuition: v.optional(v.number()),
    financialAidAvailable: v.optional(v.boolean()),
    financialAccessibility: v.optional(v.array(v.string())),

    // Grades & Enrollment
    grades: v.optional(v.array(v.string())),
    gradesLabel: v.optional(v.string()),
    displayGradeRange: v.optional(v.string()),
    isPreK: v.optional(v.boolean()),
    isElementary: v.optional(v.boolean()),
    isMiddle: v.optional(v.boolean()),
    isHigh: v.optional(v.boolean()),
    minGrade: v.optional(v.number()),
    maxGrade: v.optional(v.number()),
    enrollment: v.optional(v.number()),
    studentTeacherRatio: v.optional(v.string()),
    avgClassSize: v.optional(v.number()),
    avgGraduatingClassSize: v.optional(v.number()),
    founded: v.optional(v.number()),

    // Academics
    accreditation: v.optional(v.array(v.string())),
    curriculumType: v.optional(v.array(v.string())),
    curricularClassification: v.optional(v.string()),
    academicFocusAreas: v.optional(v.array(v.string())),
    ibProgram: v.optional(v.boolean()),
    apCourses: v.optional(v.boolean()),
    dualEnrollment: v.optional(v.boolean()),
    avgSAT: v.optional(v.number()),
    avgACT: v.optional(v.number()),
    collegeAcceptanceRate: v.optional(v.number()),
    graduationRate: v.optional(v.number()),
    attendanceRate: v.optional(v.number()),
    studentGrowth: v.optional(v.number()),
    retentionRate: v.optional(v.number()),
    notableAchievements: v.optional(v.array(v.string())),
    languagesOffered: v.optional(v.array(v.string())),

    // Extracurriculars
    athletics: v.optional(v.array(v.string())),
    uilParticipant: v.optional(v.boolean()),
    fineArts: v.optional(v.array(v.string())),
    clubs: v.optional(v.array(v.string())),
    extracurricularOfferings: v.optional(v.array(v.string())),

    // Services & Amenities
    specialEdSupport: v.optional(v.boolean()),
    counselingServices: v.optional(v.boolean()),
    transportationProvided: v.optional(v.boolean()),
    lunchProgram: v.optional(v.boolean()),
    beforeAfterCare: v.optional(v.boolean()),
    boardingOption: v.optional(v.boolean()),
    supportResources: v.optional(v.array(v.string())),
    cultureAndValues: v.optional(v.array(v.string())),
    amenities: v.optional(v.array(v.string())),

    // Profile
    serviceType: v.optional(v.array(v.string())),
    setting: v.optional(v.string()),
    campusSize: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),

    // Content
    reviews: v.optional(v.array(v.any())),
    photos: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),

    // Admissions
    admissionsRequirements: v.optional(v.array(v.string())),
    entranceExamRequired: v.optional(v.boolean()),
    currentOpenings: v.optional(v.array(v.string())),
    waitlistGrades: v.optional(v.array(v.string())),
  })
    .index("by_schoolId", ["schoolId"])
    .index("by_city", ["city"])
    .index("by_rating", ["rating"]),
});
