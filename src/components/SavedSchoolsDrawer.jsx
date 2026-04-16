import React from 'react'
import { X, Heart, Bookmark } from 'lucide-react'

export default function SavedSchoolsDrawer({ schools, tefaAmount, onSelectSchool, onToggleSave, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-display text-xl font-bold text-charcoal">Saved Schools ({schools.length})</h3>
          <button onClick={onClose} className="text-charcoal-light hover:text-charcoal p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {schools.length === 0 ? (
          <div className="p-12 text-center">
            <Bookmark className="w-10 h-10 text-charcoal-light mx-auto mb-3" />
            <h4 className="font-display text-lg font-bold text-charcoal mb-2">No saved schools yet</h4>
            <p className="text-sm text-charcoal-light">
              Click the heart icon on any school to save it here for easy comparison.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {schools.map(school => {
              const maxTuition = Math.max(...Object.values(school.tuitionByGrade))
              const outOfPocket = Math.max(0, maxTuition - tefaAmount)
              const coveragePercent = Math.min(100, Math.round((tefaAmount / maxTuition) * 100))
              return (
                <div
                  key={school.id}
                  className="bg-cream rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => onSelectSchool(school)}
                >
                  <div className="flex gap-3">
                    <img
                      src={school.photos[0]}
                      alt={school.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800' }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-sm font-bold text-charcoal truncate">{school.name}</h4>
                      <p className="text-[11px] text-charcoal-light mt-0.5">{school.city} &middot; {school.gradesLabel}</p>
                      <p className="text-xs font-bold text-charcoal mt-1">{school.tuitionDisplay}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${coveragePercent >= 100 ? 'bg-green-500' : 'bg-burnt'}`}
                            style={{ width: `${coveragePercent}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${coveragePercent >= 100 ? 'text-green-600' : 'text-burnt'}`}>
                          {coveragePercent}%
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleSave(school.id) }}
                      className="flex-shrink-0 text-burnt hover:text-burnt-dark"
                      title="Remove from saved"
                    >
                      <Heart className="w-5 h-5" fill="#C05621" stroke="#C05621" />
                    </button>
                  </div>
                </div>
              )
            })}
            <div className="mt-4 text-center">
              <p className="text-xs text-charcoal-light">
                You have until <strong className="text-burnt">June 1, 2026</strong> to make your school selection.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
