import React, { useState } from 'react'
import { Heart, ChevronRight, SearchX, Star } from 'lucide-react'
import { getStockPhoto, getLogoUrl } from '../utils/schoolImage.js'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'distance', label: 'Distance' },
  { value: 'tuition-low', label: 'Tuition: Low to High' },
  { value: 'tuition-high', label: 'Tuition: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
]

function StarRating({ rating }) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.3
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < full ? 'text-yellow-400 fill-yellow-400' : i === full && hasHalf ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

function CoverageBar({ coveragePercent, tefaAmount, minOutOfPocket, maxOutOfPocket }) {
  const clampedPercent = Math.min(100, coveragePercent)
  const hasRange = minOutOfPocket !== maxOutOfPocket && minOutOfPocket > 0

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-charcoal-light">Coverage Breakdown</span>
        <span className={`text-xs font-bold ${clampedPercent >= 100 ? 'text-green-600' : 'text-burnt'}`}>
          {clampedPercent}% covered
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className={`h-full rounded-full transition-all ${clampedPercent >= 100 ? 'bg-green-500' : 'bg-burnt'}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-charcoal-light">
          Voucher: ${tefaAmount.toLocaleString()}
        </span>
        {maxOutOfPocket > 0 ? (
          <span className="text-[10px] font-semibold text-amber-600">
            {hasRange
              ? `Your cost: $${minOutOfPocket.toLocaleString()} – $${maxOutOfPocket.toLocaleString()}/yr`
              : `Your cost: $${maxOutOfPocket.toLocaleString()}/yr`}
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-green-600">
            Fully covered
          </span>
        )}
      </div>
    </div>
  )
}

function SchoolLogo({ school, size = 'sm' }) {
  const [failed, setFailed] = useState(false)
  const logoUrl = getLogoUrl(school)
  if (!logoUrl || failed) return null

  const cls = size === 'sm'
    ? 'w-8 h-8 rounded-lg bg-white shadow-md border border-white/80 p-0.5'
    : 'w-12 h-12 rounded-xl bg-white shadow-lg border border-white/80 p-1'

  return (
    <img
      src={logoUrl}
      alt={`${school.name} logo`}
      className={`${cls} object-contain`}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        // Hide generic Google globe fallback (always 16px wide at natural size)
        if (e.target.naturalWidth <= 16) setFailed(true)
      }}
    />
  )
}

function SchoolCard({ school, isSaved, tefaAmount, onToggleSave, onSelect, onHover }) {
  const tuitionVals = school.tuitionByGrade
    ? Object.values(school.tuitionByGrade).filter(v => typeof v === 'number' && v > 0)
    : []
  const minTuition = tuitionVals.length > 0 ? Math.min(...tuitionVals) : 0
  const maxTuition = tuitionVals.length > 0 ? Math.max(...tuitionVals) : 0
  const minOutOfPocket = minTuition > tefaAmount ? minTuition - tefaAmount : 0
  const maxOutOfPocket = maxTuition > tefaAmount ? maxTuition - tefaAmount : 0
  const coveragePercent = maxTuition > 0 ? Math.min(100, Math.round((tefaAmount / maxTuition) * 100)) : 100

  const highlights = [
    ...(school.apCourses ? ['AP Courses'] : []),
    ...(school.ibProgram ? ['IB Program'] : []),
    ...(school.dualEnrollment ? ['Dual Enrollment'] : []),
    ...((school.athletics ?? []).slice(0, 2)),
    ...((school.fineArts ?? []).slice(0, 1)),
  ].slice(0, 3)

  const heroImg = getStockPhoto(school)

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
      onMouseEnter={() => onHover(school.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(school)}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto relative overflow-hidden flex-shrink-0">
          <img
            src={heroImg}
            alt={school.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' }}
          />
          {/* Dark gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Coverage badge */}
          <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2.5 py-1 rounded-lg ${
            coveragePercent >= 100 ? 'bg-green-600' : coveragePercent >= 75 ? 'bg-burnt' : 'bg-amber-600'
          }`}>
            {coveragePercent}% Covered
          </div>

          {/* School logo badge */}
          <div className="absolute bottom-2 right-2">
            <SchoolLogo school={school} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-charcoal truncate">{school.name}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {(school.type ?? []).map(t => (
                  <span key={t} className="text-[10px] font-semibold bg-cream-dark text-burnt px-2 py-0.5 rounded-md">{t}</span>
                ))}
                <span className="text-[10px] text-charcoal-light">{school.gradesLabel}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave() }}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-cream transition-colors"
            >
              <Heart className="w-5 h-5" fill={isSaved ? '#C05621' : 'none'} stroke="#C05621" />
            </button>
          </div>

          {/* Tuition */}
          <div className="mt-2">
            <span className="font-bold text-charcoal">{school.tuitionDisplay}</span>
          </div>

          {/* Coverage Breakdown Bar */}
          <CoverageBar
            coveragePercent={coveragePercent}
            tefaAmount={tefaAmount}
            minOutOfPocket={minOutOfPocket}
            maxOutOfPocket={maxOutOfPocket}
          />

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-charcoal-light">
            {school.distanceFromSearch != null && (
              <span>{school.distanceFromSearch.toFixed(1)} mi away</span>
            )}
            {school.enrollment > 0 && <span>{school.enrollment} students</span>}
            {school.studentTeacherRatio && <span>{school.studentTeacherRatio} ratio</span>}
          </div>

          {/* Rating */}
          {school.rating > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <StarRating rating={school.rating} />
              <span className="text-xs font-semibold text-charcoal">{school.rating}</span>
              <span className="text-[11px] text-charcoal-light">({school.reviewCount} reviews)</span>
            </div>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {highlights.map(h => (
                <span key={h} className="text-[10px] text-charcoal-light bg-gray-100 px-2 py-0.5 rounded-md">{h}</span>
              ))}
            </div>
          )}

          {/* View button */}
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(school) }}
            className="mt-3 text-sm font-semibold text-burnt hover:text-burnt-dark transition-colors flex items-center gap-1"
          >
            View School
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SchoolCardList({ schools, savedSchools, tefaAmount, sortBy, onSortChange, onToggleSave, onSelectSchool, onHoverSchool }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-charcoal">
          <span className="font-bold">{schools.length}</span> school{schools.length !== 1 ? 's' : ''} match your search
        </p>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-burnt/20"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {schools.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <SearchX className="w-10 h-10 text-charcoal-light mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-charcoal mb-2">No schools match your filters</h3>
            <p className="text-sm text-charcoal-light max-w-md mx-auto">
              Try expanding your search radius, adjusting your grade selection, or removing some filters to see more results.
            </p>
          </div>
        ) : (
          schools.map(school => (
            <SchoolCard
              key={school.id}
              school={school}
              isSaved={savedSchools.includes(school.id)}
              tefaAmount={tefaAmount}
              onToggleSave={() => onToggleSave(school.id)}
              onSelect={() => onSelectSchool(school)}
              onHover={onHoverSchool}
            />
          ))
        )}
      </div>
    </div>
  )
}
