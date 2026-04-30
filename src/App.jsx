import React, { useState, useMemo, useCallback } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import Navbar from './components/Navbar.jsx'
import HeroSearch from './components/HeroSearch.jsx'
import FilterSidebar from './components/FilterSidebar.jsx'
import SchoolCardList from './components/SchoolCardList.jsx'
import SchoolMap from './components/SchoolMap.jsx'
import SchoolProfileModal from './components/SchoolProfileModal.jsx'
import TEFAInfoModal from './components/TEFAInfoModal.jsx'
import SavedSchoolsDrawer from './components/SavedSchoolsDrawer.jsx'
import CompareSchools from './components/CompareSchools.jsx'
import AuthModal from './components/AuthModal.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { useFavorites } from './hooks/useFavorites.js'

const DEFAULT_CENTER = { lat: 31.9686, lng: -99.9018 } // Center of Texas
const TEFA_STANDARD = 10474
const TEFA_IEP = 30000

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 3959 // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const CITY_COORDS = {
  'Houston': { lat: 29.7604, lng: -95.3698 },
  'Dallas': { lat: 32.7767, lng: -96.7970 },
  'San Antonio': { lat: 29.4241, lng: -98.4936 },
  'Austin': { lat: 30.2672, lng: -97.7431 },
  'Fort Worth': { lat: 32.7555, lng: -97.3308 },
  'Plano': { lat: 33.0198, lng: -96.6989 },
  'Frisco': { lat: 33.1507, lng: -96.8236 },
  'McKinney': { lat: 33.1972, lng: -96.6397 },
  'Sugar Land': { lat: 29.6197, lng: -95.6349 },
  'The Woodlands': { lat: 30.1658, lng: -95.4613 },
  'Katy': { lat: 29.7858, lng: -95.8245 },
  'Round Rock': { lat: 30.5083, lng: -97.6789 },
  'Georgetown': { lat: 30.6333, lng: -97.6781 },
  'San Marcos': { lat: 29.8833, lng: -97.9414 },
  'Waco': { lat: 31.5493, lng: -97.1467 },
  'Lubbock': { lat: 33.5779, lng: -101.8552 },
  'Amarillo': { lat: 35.2220, lng: -101.8313 },
  'El Paso': { lat: 31.7619, lng: -106.4850 },
  'Corpus Christi': { lat: 27.8006, lng: -97.3964 },
  'Tyler': { lat: 32.3513, lng: -95.3011 },
}

const initialFilters = {
  searchQuery: '',
  searchLocation: null,
  gradeLevel: [],
  radius: 50,
  tuitionMin: 0,
  tuitionMax: 40000,
  tefaCoversAll: false,
  financialAid: false,
  schoolTypes: [],
  accreditations: [],
  gradesServed: [],
  maxClassSize: 30,
  curriculumTypes: [],
  athletics: [],
  fineArts: [],
  clubs: [],
  uilParticipant: false,
  enrollmentMin: 0,
  enrollmentMax: 2000,
  settings: [],
  specialEdSupport: false,
  transportationProvided: false,
  lunchProgram: false,
  beforeAfterCare: false,
  boardingOption: false,
  counselingServices: false,
  minRating: 0,
  sortBy: 'relevance',
}

export default function App() {
  const schoolsFromDB = useQuery(api.schools.getAll)
  // Filter out Islamic schools from the live Convex data
  const schools = (schoolsFromDB ?? [])
    .filter(s => !(s.type ?? []).includes('Islamic'))
    .map(s => ({ ...s, id: s.schoolId }))

  const { user } = useAuth()
  const { favoriteIds, toggleFavorite } = useFavorites(user)

  const [filters, setFilters] = useState(initialFilters)
  const [activeFilters, setActiveFilters] = useState(initialFilters)
  const [savedSchools, setSavedSchools] = useState([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isIEP, setIsIEP] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [showTEFAInfo, setShowTEFAInfo] = useState(false)
  const [showSavedDrawer, setShowSavedDrawer] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [hoveredSchoolId, setHoveredSchoolId] = useState(null)
  const [showMobileMap, setShowMobileMap] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingFavoriteSchoolId, setPendingFavoriteSchoolId] = useState(null)

  const tefaAmount = isIEP ? TEFA_IEP : TEFA_STANDARD

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    setActiveFilters(initialFilters)
  }, [])

  const toggleSave = useCallback((schoolId) => {
    setSavedSchools(prev =>
      prev.includes(schoolId) ? prev.filter(id => id !== schoolId) : [...prev, schoolId]
    )
  }, [])

  // Heart click: persist to Supabase if logged in, else prompt auth
  const handleFavoriteClick = useCallback(async (schoolId) => {
    if (!user) {
      setPendingFavoriteSchoolId(schoolId)
      setShowAuthModal(true)
      return
    }
    toggleFavorite(schoolId)
    toggleSave(schoolId) // keep local drawer in sync
  }, [user, toggleFavorite, toggleSave])

  const handleSearch = useCallback(async (query) => {
    const trimmed = query.trim()
    const normalized = trimmed.toLowerCase()
    let searchLocation = null

    if (/^\d{5}$/.test(trimmed)) {
      // ZIP code — geocode via Nominatim
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${trimmed}&country=US&format=json&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        if (data.length > 0) {
          searchLocation = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
        }
      } catch (_) {
        searchLocation = DEFAULT_CENTER
      }
    } else {
      const cityMatch = Object.entries(CITY_COORDS).find(([city]) =>
        city.toLowerCase() === normalized || normalized.includes(city.toLowerCase())
      )
      if (cityMatch) {
        searchLocation = cityMatch[1]
      }
      // If no city match and not a ZIP, treat as school name — no location filter
    }

    setFilters(prev => ({ ...prev, searchQuery: trimmed, searchLocation }))
    setActiveFilters(prev => ({ ...filters, searchQuery: trimmed, searchLocation }))
  }, [filters])

  const filteredSchools = useMemo(() => {
    const f = activeFilters
    let result = schools.map(school => {
      const tuitionVals = school.tuitionByGrade
        ? Object.values(school.tuitionByGrade).filter(v => typeof v === 'number' && v >= 0)
        : []
      const minTuition = tuitionVals.length > 0 ? Math.min(...tuitionVals) : 0
      const maxTuition = tuitionVals.length > 0 ? Math.max(...tuitionVals) : 0
      let distance = null
      if (f.searchLocation && school.lat && school.lng) {
        distance = haversineDistance(
          f.searchLocation.lat,
          f.searchLocation.lng,
          school.lat,
          school.lng
        )
      }
      return { ...school, distanceFromSearch: distance, minTuition, maxTuition }
    })

    // School name / city text search (when no location resolved)
    if (f.searchQuery && !f.searchLocation) {
      const q = f.searchQuery.toLowerCase()
      result = result.filter(s =>
        (s.name ?? '').toLowerCase().includes(q) ||
        (s.city ?? '').toLowerCase().includes(q)
      )
    }

    // Distance filter
    if (f.searchLocation) {
      result = result.filter(s => s.distanceFromSearch !== null && s.distanceFromSearch <= f.radius)
    }

    // Tuition filter
    result = result.filter(s => s.minTuition >= f.tuitionMin && s.minTuition <= f.tuitionMax)

    // TEFA covers all
    if (f.tefaCoversAll) {
      result = result.filter(s => s.maxTuition <= tefaAmount)
    }

    // Financial aid
    if (f.financialAid) {
      result = result.filter(s => s.financialAidAvailable)
    }

    // School types
    if (f.schoolTypes.length > 0) {
      result = result.filter(s => (s.type ?? []).some(t => f.schoolTypes.includes(t)))
    }

    // Accreditations
    if (f.accreditations.length > 0) {
      result = result.filter(s => (s.accreditation ?? []).some(a => f.accreditations.includes(a)))
    }

    // Grades served
    if (f.gradesServed.length > 0) {
      result = result.filter(s => {
        const grades = s.grades ?? []
        const hasElem = grades.some(g => ['PreK', 'K', '1', '2', '3', '4', '5'].includes(g))
        const hasMiddle = grades.some(g => ['6', '7', '8'].includes(g))
        const hasHigh = grades.some(g => ['9', '10', '11', '12'].includes(g))
        return (
          (f.gradesServed.includes('PreK-5') && hasElem) ||
          (f.gradesServed.includes('6-8') && hasMiddle) ||
          (f.gradesServed.includes('9-12') && hasHigh)
        )
      })
    }

    // Grade level (specific grades)
    if (f.gradeLevel.length > 0) {
      result = result.filter(s =>
        f.gradeLevel.some(g => (s.grades ?? []).includes(g))
      )
    }

    // Max class size
    if (f.maxClassSize < 30) {
      result = result.filter(s => s.avgClassSize <= f.maxClassSize)
    }

    // Curriculum types
    if (f.curriculumTypes.length > 0) {
      result = result.filter(s =>
        f.curriculumTypes.some(c => (s.curriculumType ?? []).includes(c))
      )
    }

    // Athletics
    if (f.athletics.length > 0) {
      result = result.filter(s =>
        f.athletics.every(a => (s.athletics ?? []).includes(a))
      )
    }

    // Fine arts
    if (f.fineArts.length > 0) {
      result = result.filter(s =>
        f.fineArts.every(a => (s.fineArts ?? []).includes(a))
      )
    }

    // Clubs
    if (f.clubs.length > 0) {
      result = result.filter(s =>
        f.clubs.every(c => (s.clubs ?? []).includes(c))
      )
    }

    // UIL
    if (f.uilParticipant) {
      result = result.filter(s => s.uilParticipant)
    }

    // Enrollment
    result = result.filter(s => s.enrollment >= f.enrollmentMin && s.enrollment <= f.enrollmentMax)

    // Settings
    if (f.settings.length > 0) {
      result = result.filter(s => f.settings.includes(s.setting))
    }

    // Special ed
    if (f.specialEdSupport) {
      result = result.filter(s => s.specialEdSupport)
    }

    // Transportation
    if (f.transportationProvided) {
      result = result.filter(s => s.transportationProvided)
    }

    // Lunch
    if (f.lunchProgram) {
      result = result.filter(s => s.lunchProgram)
    }

    // Before/after care
    if (f.beforeAfterCare) {
      result = result.filter(s => s.beforeAfterCare)
    }

    // Boarding
    if (f.boardingOption) {
      result = result.filter(s => s.boardingOption)
    }

    // Counseling
    if (f.counselingServices) {
      result = result.filter(s => s.counselingServices)
    }

    // Min rating
    if (f.minRating > 0) {
      result = result.filter(s => s.rating >= f.minRating)
    }

    // My Favorites only
    if (showFavoritesOnly && user) {
      result = result.filter(s => favoriteIds.includes(s.id))
    }

    // Sort
    switch (f.sortBy) {
      case 'distance':
        result.sort((a, b) => (a.distanceFromSearch ?? 999) - (b.distanceFromSearch ?? 999))
        break
      case 'tuition-low':
        result.sort((a, b) => a.minTuition - b.minTuition)
        break
      case 'tuition-high':
        result.sort((a, b) => b.minTuition - a.minTuition)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => b.founded - a.founded)
        break
      default:
        if (f.searchLocation) {
          result.sort((a, b) => {
            const distDiff = (a.distanceFromSearch ?? 999) - (b.distanceFromSearch ?? 999)
            if (Math.abs(distDiff) > 10) return distDiff
            return b.rating - a.rating
          })
        } else {
          result.sort((a, b) => b.rating - a.rating)
        }
    }

    return result
  }, [activeFilters, tefaAmount, schools, showFavoritesOnly, user, favoriteIds])

  const savedSchoolObjects = useMemo(() =>
    schools.filter(s => savedSchools.includes(s.id)),
    [savedSchools, schools]
  )

  const mapCenter = activeFilters.searchLocation || DEFAULT_CENTER
  const mapZoom = activeFilters.searchLocation ? 10 : 6

  return (
    <div className="min-h-screen bg-cream">
      <Navbar
        savedCount={favoriteIds.length}
        tefaAmount={tefaAmount}
        isIEP={isIEP}
        onToggleIEP={() => setIsIEP(prev => !prev)}
        onShowTEFAInfo={() => setShowTEFAInfo(true)}
        onShowSaved={() => setShowSavedDrawer(true)}
        onShowCompare={() => setShowCompare(true)}
        compareCount={savedSchools.length}
        onShowAuth={() => setShowAuthModal(true)}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(prev => !prev)}
      />

      <HeroSearch
        searchQuery={filters.searchQuery}
        gradeLevel={filters.gradeLevel}
        onSearch={handleSearch}
        onGradeChange={(grades) => updateFilter('gradeLevel', grades)}
      />

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-4 pb-8">
        {/* Mobile controls */}
        <div className="flex gap-2 mb-4 lg:hidden">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 py-2.5 px-4 bg-white border border-gray-200 rounded-xl font-semibold text-sm text-charcoal hover:bg-gray-50 transition-colors"
          >
            Filters
          </button>
          <button
            onClick={() => setShowMobileMap(prev => !prev)}
            className="flex-1 py-2.5 px-4 bg-burnt text-white rounded-xl font-semibold text-sm hover:bg-burnt-dark transition-colors"
          >
            {showMobileMap ? 'View List' : 'View Map'}
          </button>
        </div>

        <div className="flex gap-4">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-2xl overflow-y-auto custom-scrollbar animate-slide-up">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="text-charcoal-light hover:text-charcoal text-2xl">&times;</button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    updateFilter={updateFilter}
                    resetFilters={resetFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* School Cards - Center */}
          <div className={`flex-1 min-w-0 ${showMobileMap ? 'hidden lg:block' : ''}`}>
            <SchoolCardList
              schools={filteredSchools}
              savedSchools={favoriteIds}
              tefaAmount={tefaAmount}
              sortBy={filters.sortBy}
              onSortChange={(val) => updateFilter('sortBy', val)}
              onToggleSave={handleFavoriteClick}
              onSelectSchool={setSelectedSchool}
              onHoverSchool={setHoveredSchoolId}
            />
          </div>

          {/* Map - Right */}
          <div className={`${showMobileMap ? 'block' : 'hidden'} lg:block lg:w-[480px] xl:w-[560px] flex-shrink-0`}>
            <div className="sticky top-4 h-[calc(100vh-180px)] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <SchoolMap
                schools={filteredSchools}
                center={mapCenter}
                zoom={mapZoom}
                hoveredSchoolId={hoveredSchoolId}
                radius={activeFilters.searchLocation ? activeFilters.radius : null}
                searchLocation={activeFilters.searchLocation}
                onSelectSchool={setSelectedSchool}
                onHoverSchool={setHoveredSchoolId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedSchool && (
        <SchoolProfileModal
          school={selectedSchool}
          tefaAmount={tefaAmount}
          isIEP={isIEP}
          onToggleIEP={() => setIsIEP(prev => !prev)}
          isSaved={favoriteIds.includes(selectedSchool.id)}
          onToggleSave={() => handleFavoriteClick(selectedSchool.id)}
          onClose={() => setSelectedSchool(null)}
        />
      )}

      {showTEFAInfo && (
        <TEFAInfoModal onClose={() => setShowTEFAInfo(false)} />
      )}

      {showSavedDrawer && (
        <SavedSchoolsDrawer
          schools={schools.filter(s => favoriteIds.includes(s.id))}
          tefaAmount={tefaAmount}
          onSelectSchool={(s) => { setSelectedSchool(s); setShowSavedDrawer(false) }}
          onToggleSave={handleFavoriteClick}
          onClose={() => setShowSavedDrawer(false)}
        />
      )}

      {showCompare && savedSchools.length > 0 && (
        <CompareSchools
          schools={savedSchoolObjects}
          tefaAmount={tefaAmount}
          onClose={() => setShowCompare(false)}
          onSelectSchool={setSelectedSchool}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => { setShowAuthModal(false); setPendingFavoriteSchoolId(null) }}
          onSuccess={() => {
            if (pendingFavoriteSchoolId) {
              toggleFavorite(pendingFavoriteSchoolId)
              toggleSave(pendingFavoriteSchoolId)
              setPendingFavoriteSchoolId(null)
            }
          }}
        />
      )}
    </div>
  )
}
