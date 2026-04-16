import React from 'react'
import { X, Check, Minus, Star } from 'lucide-react'

function CoverageCell({ tuition, tefaAmount }) {
  const outOfPocket = Math.max(0, tuition - tefaAmount)
  const percent = Math.min(100, Math.round((tefaAmount / tuition) * 100))
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${percent >= 100 ? 'bg-green-500' : 'bg-burnt'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${percent >= 100 ? 'text-green-600' : 'text-burnt'}`}>
          {percent}%
        </span>
      </div>
      {outOfPocket > 0 ? (
        <p className="text-xs text-amber-600 font-medium">${outOfPocket.toLocaleString()}/yr family cost</p>
      ) : (
        <p className="text-xs text-green-600 font-medium">Fully covered</p>
      )}
    </div>
  )
}

function BoolCell({ value }) {
  return value
    ? <Check className="w-4 h-4 text-green-600" />
    : <Minus className="w-4 h-4 text-gray-300" />
}

export default function CompareSchools({ schools, tefaAmount, onClose, onSelectSchool }) {
  if (schools.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto shadow-2xl custom-scrollbar">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl font-bold text-charcoal">Compare Schools</h2>
          <button onClick={onClose} className="text-charcoal-light hover:text-charcoal p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-charcoal-light text-xs uppercase tracking-wider w-40">Metric</th>
                  {schools.map(school => (
                    <th key={school.id} className="text-left py-3 px-4 min-w-[180px]">
                      <button
                        onClick={() => { onSelectSchool(school); onClose() }}
                        className="font-bold text-charcoal hover:text-burnt transition-colors text-left"
                      >
                        {school.name}
                      </button>
                      <p className="text-[10px] text-charcoal-light font-normal mt-0.5">{school.city}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Tuition */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Annual Tuition</td>
                  {schools.map(s => {
                    const max = Math.max(...Object.values(s.tuitionByGrade))
                    return <td key={s.id} className="py-3 px-4 font-bold text-charcoal">${max.toLocaleString()}/yr</td>
                  })}
                </tr>

                {/* TEFA Coverage */}
                <tr className="hover:bg-cream/50 bg-cream-dark/40">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Voucher Coverage</td>
                  {schools.map(s => {
                    const max = Math.max(...Object.values(s.tuitionByGrade))
                    return (
                      <td key={s.id} className="py-3 px-4">
                        <CoverageCell tuition={max} tefaAmount={tefaAmount} />
                      </td>
                    )
                  })}
                </tr>

                {/* Out of Pocket */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Monthly Out-of-Pocket</td>
                  {schools.map(s => {
                    const max = Math.max(...Object.values(s.tuitionByGrade))
                    const oop = Math.max(0, max - tefaAmount)
                    const monthly = oop > 0 ? Math.round(oop / 12) : 0
                    return (
                      <td key={s.id} className="py-3 px-4 font-bold text-charcoal">
                        {monthly === 0 ? <span className="text-green-600">$0</span> : `$${monthly}/mo`}
                      </td>
                    )
                  })}
                </tr>

                {/* Rating */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Rating</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-charcoal">{s.rating}</span>
                        <span className="text-[10px] text-charcoal-light">({s.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Enrollment */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Enrollment</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4 text-charcoal">{s.enrollment} students</td>
                  ))}
                </tr>

                {/* Student:Teacher */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Student:Teacher Ratio</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4 text-charcoal">{s.studentTeacherRatio}</td>
                  ))}
                </tr>

                {/* Class Size */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Avg Class Size</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4 text-charcoal">{s.avgClassSize}</td>
                  ))}
                </tr>

                {/* Grades */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Grades</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4 text-charcoal">{s.gradesLabel}</td>
                  ))}
                </tr>

                {/* AP Courses */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">AP Courses</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4"><BoolCell value={s.apCourses} /></td>
                  ))}
                </tr>

                {/* IB Program */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">IB Program</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4"><BoolCell value={s.ibProgram} /></td>
                  ))}
                </tr>

                {/* Financial Aid */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Financial Aid</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4"><BoolCell value={s.financialAidAvailable} /></td>
                  ))}
                </tr>

                {/* Transportation */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Transportation</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4"><BoolCell value={s.transportationProvided} /></td>
                  ))}
                </tr>

                {/* Special Ed */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Special Ed / IEP</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4"><BoolCell value={s.specialEdSupport} /></td>
                  ))}
                </tr>

                {/* Setting */}
                <tr className="hover:bg-cream/50">
                  <td className="py-3 px-4 font-medium text-charcoal-light">Setting</td>
                  {schools.map(s => (
                    <td key={s.id} className="py-3 px-4 text-charcoal">{s.setting}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
