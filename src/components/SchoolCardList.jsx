import React from 'react'

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
        <svg key={i} className={`w-3.5 h-3.5 ${i < full ? 'text-yellow-400' : i === full && hasHalf ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function SchoolCard({ school, isSaved, tefaAmount, onToggleSave, onSelect, onHover }) {
  const minTuition = Math.min(...Object.values(school.tuitionByGrade))
  const maxTuition = Math.max(...Object.values(school.tuitionByGrade))
  const tefaCovers = maxTuition <= tefaAmount
  const outOfPocket = maxTuition > tefaAmount ? maxTuition - tefaAmount : 0
  const coveragePercent = Math.min(100, Math.round((tefaAmount / maxTuition) * 100))

  const highlights = [
    ...(school.apCourses ? ['AP Courses'] : []),
    ...(school.ibProgram ? ['IB Program'] : []),
    ...(school.dualEnrollment ? ['Dual Enrollment'] : []),
    ...school.athletics.slice(0, 2),
    ...school.fineArts.slice(0, 1),
  ].slice(0, 3)

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
            src={school.photos[0]}
            alt={school.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800' }}
          />
          <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            &#10003; TEFA
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-lg text-charcoal truncate">{school.name}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {school.type.map(t => (
                  <span key={t} className="text-[10px] font-semibold bg-cream-dark text-burnt px-2 py-0.5 rounded-md">{t}</span>
                ))}
                <span className="text-[10px] text-charcoal-light">{school.gradesLabel}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave() }}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-cream transition-colors"
            >
              <svg className="w-5 h-5" fill={isSaved ? '#C05621' : 'none'} stroke="#C05621" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Tuition & TEFA */}
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-charcoal">{school.tuitionDisplay}</span>
              {tefaCovers ? (
                <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  TEFA covers full tuition
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  +${outOfPocket.toLocaleString()}/yr out of pocket
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-charcoal-light">
            {school.distanceFromSearch !== null && (
              <span>{school.distanceFromSearch.toFixed(1)} mi away</span>
            )}
            <span>{school.enrollment} students</span>
            <span>{school.studentTeacherRatio} ratio</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <StarRating rating={school.rating} />
            <span className="text-xs font-semibold text-charcoal">{school.rating}</span>
            <span className="text-[11px] text-charcoal-light">({school.reviewCount} reviews)</span>
          </div>

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
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
            <div className="text-4xl mb-4">&#128270;</div>
            <h3 className="font-display text-xl text-charcoal mb-2">No schools match your filters</h3>
            <p className="text-sm text-charcoal-light max-w-md mx-auto">
              Try expanding your search radius, adjusting your grade selection, or removing some filters. There are great options waiting for you!
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
