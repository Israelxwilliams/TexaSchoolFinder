import React, { useState } from 'react'
import { Star, Heart, Navigation, X, DollarSign, Check, CircleCheck } from 'lucide-react'

function StarRating({ rating, size = 'sm' }) {
  const s = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${s} ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
        active ? 'border-burnt text-burnt' : 'border-transparent text-charcoal-light hover:text-charcoal hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-cream rounded-xl p-3 text-center">
      <p className="font-bold text-charcoal text-lg">{value}</p>
      <p className="text-[11px] text-charcoal-light mt-0.5">{label}</p>
    </div>
  )
}

function CoverageBreakdown({ maxTuition, tefaAmount, isIEP, onToggleIEP }) {
  const outOfPocket = Math.max(0, maxTuition - tefaAmount)
  const monthlyOOP = outOfPocket > 0 ? Math.round(outOfPocket / 12) : 0
  const coveragePercent = Math.min(100, Math.round((tefaAmount / maxTuition) * 100))
  const voucherPortion = Math.min(tefaAmount, maxTuition)

  return (
    <div className="mx-6 mt-4 bg-cream-dark border border-burnt/20 rounded-2xl p-5">
      <h4 className="font-bold text-charcoal text-sm mb-3 flex items-center gap-2">
        <DollarSign className="w-4.5 h-4.5 text-burnt" />
        Coverage Breakdown
      </h4>

      {/* Visual bar chart */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-charcoal-light">Annual Tuition</span>
          <span className="text-sm font-bold text-charcoal">${maxTuition.toLocaleString()}</span>
        </div>
        <div className="w-full h-6 bg-gray-200 rounded-lg overflow-hidden flex">
          <div
            className="h-full bg-green-500 flex items-center justify-center"
            style={{ width: `${coveragePercent}%` }}
          >
            {coveragePercent >= 30 && (
              <span className="text-[10px] font-bold text-white">Voucher: ${voucherPortion.toLocaleString()}</span>
            )}
          </div>
          {outOfPocket > 0 && (
            <div
              className="h-full bg-amber-400 flex items-center justify-center"
              style={{ width: `${100 - coveragePercent}%` }}
            >
              {(100 - coveragePercent) >= 20 && (
                <span className="text-[10px] font-bold text-charcoal">Family: ${outOfPocket.toLocaleString()}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
            <span className="text-[10px] text-charcoal-light">Voucher Portion ({coveragePercent}%)</span>
          </div>
          {outOfPocket > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span className="text-[10px] text-charcoal-light">Family Responsibility ({100 - coveragePercent}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-light">Your TEFA Award</span>
          <span className="font-bold text-green-600">-${tefaAmount.toLocaleString()}</span>
        </div>
        <div className="border-t border-burnt/20 pt-2 flex justify-between text-sm">
          <span className="font-semibold text-charcoal">Your Out-of-Pocket</span>
          <div className="text-right">
            <span className={`font-bold text-lg ${outOfPocket === 0 ? 'text-green-600' : 'text-burnt'}`}>
              {outOfPocket === 0 ? 'Fully Covered' : `$${outOfPocket.toLocaleString()}/yr`}
            </span>
            {monthlyOOP > 0 && (
              <span className="block text-xs text-charcoal-light">(~${monthlyOOP}/mo)</span>
            )}
          </div>
        </div>
        <div className="mt-2 bg-white/70 rounded-lg px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-charcoal-light">
            Your TEFA award covers <span className="font-bold text-burnt">{coveragePercent}%</span> of tuition
          </span>
          <button
            onClick={onToggleIEP}
            className="flex items-center gap-2 text-xs font-semibold text-burnt hover:underline"
          >
            <span className={`relative w-8 h-4 rounded-full transition-colors ${isIEP ? 'bg-burnt' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${isIEP ? 'left-4' : 'left-0.5'}`} />
            </span>
            My child has an IEP
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SchoolProfileModal({ school, tefaAmount, isIEP, onToggleIEP, isSaved, onToggleSave, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({ parentName: '', email: '', phone: '', childGrade: '', childName: '', tefaStatus: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const maxTuition = Math.max(...Object.values(school.tuitionByGrade))

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const tabs = ['overview', 'academics', 'athletics', 'admissions', 'tefa', 'reviews', 'gallery']

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl h-full bg-white overflow-y-auto custom-scrollbar shadow-2xl animate-slide-left">
        {/* Hero Image */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={school.photos[0]}
            alt={school.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-charcoal hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">{school.name}</h2>
            <p className="text-white/80 text-sm mt-1">{school.tagline}</p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Check className="w-3 h-3" /> TEFA Accepted
            </span>
            {school.accreditation.map(a => (
              <span key={a} className="bg-sky-light text-sky-accent text-xs font-semibold px-2.5 py-1 rounded-lg">{a}</span>
            ))}
            {school.type.map(t => (
              <span key={t} className="bg-cream-dark text-burnt text-xs font-semibold px-2.5 py-1 rounded-lg">{t}</span>
            ))}
            <span className="bg-gray-100 text-charcoal-light text-xs font-semibold px-2.5 py-1 rounded-lg">{school.gradesLabel}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <StarRating rating={school.rating} size="md" />
            <span className="font-bold text-charcoal">{school.rating}</span>
            <span className="text-sm text-charcoal-light">{school.reviewCount} parent reviews</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onToggleSave}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                isSaved ? 'bg-burnt text-white border-burnt' : 'bg-white text-charcoal border-gray-200 hover:border-burnt hover:text-burnt'
              }`}
            >
              <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${school.lat},${school.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-charcoal hover:border-burnt hover:text-burnt transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Directions
            </a>
          </div>
        </div>

        {/* Coverage Breakdown */}
        <CoverageBreakdown
          maxTuition={maxTuition}
          tefaAmount={tefaAmount}
          isIEP={isIEP}
          onToggleIEP={onToggleIEP}
        />

        {/* Tabs */}
        <div className="px-6 mt-4 border-b border-gray-100 overflow-x-auto">
          <div className="flex">
            {tabs.map(tab => (
              <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabButton>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-5">
          {activeTab === 'overview' && (
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">About {school.name}</h3>
              <p className="text-sm text-charcoal-light leading-relaxed mb-5">{school.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatBox label="Founded" value={school.founded} />
                <StatBox label="Enrollment" value={school.enrollment} />
                <StatBox label="Student:Teacher" value={school.studentTeacherRatio} />
                <StatBox label="Avg Class Size" value={school.avgClassSize} />
                {school.avgSAT && <StatBox label="Avg SAT" value={school.avgSAT} />}
                {school.avgACT && <StatBox label="Avg ACT" value={school.avgACT} />}
                {school.collegeAcceptanceRate && <StatBox label="College Accept" value={`${school.collegeAcceptanceRate}%`} />}
                <StatBox label="Setting" value={school.setting} />
                <StatBox label="Campus" value={school.campusSize} />
              </div>
              <div className="mt-4 text-sm text-charcoal-light">
                <p><strong>Address:</strong> {school.address}</p>
                <p><strong>Phone:</strong> {school.phone}</p>
                <p><strong>Email:</strong> {school.email}</p>
              </div>
            </div>
          )}

          {activeTab === 'academics' && (
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">Academics</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-charcoal mb-2">Curriculum</h4>
                  <div className="flex flex-wrap gap-2">
                    {school.curriculumType.map(c => (
                      <span key={c} className="bg-cream-dark text-burnt text-xs font-semibold px-3 py-1.5 rounded-lg">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl flex items-center gap-2 ${school.apCourses ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    {school.apCourses ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-400" />}
                    <p className="text-sm font-semibold">AP Courses</p>
                  </div>
                  <div className={`p-3 rounded-xl flex items-center gap-2 ${school.ibProgram ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    {school.ibProgram ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-400" />}
                    <p className="text-sm font-semibold">IB Program</p>
                  </div>
                  <div className={`p-3 rounded-xl flex items-center gap-2 ${school.dualEnrollment ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    {school.dualEnrollment ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-400" />}
                    <p className="text-sm font-semibold">Dual Enrollment</p>
                  </div>
                </div>
                {school.languagesOffered.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-charcoal mb-2">Languages Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {school.languagesOffered.map(l => (
                        <span key={l} className="bg-gray-100 text-charcoal text-xs font-semibold px-3 py-1.5 rounded-lg">{l}</span>
                      ))}
                    </div>
                  </div>
                )}
                {school.avgSAT && (
                  <div>
                    <h4 className="font-semibold text-sm text-charcoal mb-2">Test Scores</h4>
                    <div className="flex gap-6">
                      {school.avgSAT && <p className="text-sm text-charcoal-light">Avg SAT: <strong className="text-charcoal">{school.avgSAT}</strong></p>}
                      {school.avgACT && <p className="text-sm text-charcoal-light">Avg ACT: <strong className="text-charcoal">{school.avgACT}</strong></p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'athletics' && (
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">Athletics & Activities</h3>
              <div className="space-y-4">
                {school.athletics.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-charcoal mb-2">Athletic Teams</h4>
                    <div className="flex flex-wrap gap-2">
                      {school.athletics.map(a => (
                        <span key={a} className="bg-burnt/10 text-burnt text-xs font-semibold px-3 py-1.5 rounded-lg">{a}</span>
                      ))}
                    </div>
                    {school.uilParticipant && (
                      <p className="text-xs text-charcoal-light mt-2 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-green-600" /> UIL (University Interscholastic League) Participant
                      </p>
                    )}
                  </div>
                )}
                {school.fineArts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-charcoal mb-2">Fine Arts</h4>
                    <div className="flex flex-wrap gap-2">
                      {school.fineArts.map(a => (
                        <span key={a} className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                {school.clubs.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-charcoal mb-2">Clubs & Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {school.clubs.map(c => (
                        <span key={c} className="bg-sky-light text-sky-accent text-xs font-semibold px-3 py-1.5 rounded-lg">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'admissions' && (
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">Admissions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-charcoal mb-2">Requirements</h4>
                  <ul className="space-y-1.5">
                    {school.admissionsRequirements.map(req => (
                      <li key={req} className="flex items-start gap-2 text-sm text-charcoal-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-burnt mt-1.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`p-3 rounded-xl flex items-center gap-2 ${school.entranceExamRequired ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
                  {school.entranceExamRequired
                    ? <><svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-sm font-semibold">Entrance exam required</p></>
                    : <><Check className="w-4 h-4 text-green-600 flex-shrink-0" /><p className="text-sm font-semibold">No entrance exam required</p></>
                  }
                </div>
                {school.currentOpenings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-charcoal mb-2">Current Openings</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {school.currentOpenings.map(g => (
                        <span key={g} className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                          Grade {g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {school.waitlistGrades.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-charcoal mb-2">Waitlist Grades</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {school.waitlistGrades.map(g => (
                        <span key={g} className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                          Grade {g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tefa' && (
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">TEFA & Tuition</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-charcoal mb-2">Tuition by Grade Level</h4>
                  <div className="bg-cream rounded-xl overflow-hidden">
                    {Object.entries(school.tuitionByGrade).map(([grade, tuition]) => {
                      const gradePercent = Math.min(100, Math.round((tefaAmount / tuition) * 100))
                      return (
                        <div key={grade} className="px-4 py-3 border-b border-white/50 last:border-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-charcoal">{grade}</span>
                            <div className="text-right">
                              <span className="text-sm font-bold text-charcoal">${tuition.toLocaleString()}/yr</span>
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${gradePercent >= 100 ? 'bg-green-500' : 'bg-burnt'}`}
                              style={{ width: `${gradePercent}%` }}
                            />
                          </div>
                          <div className="text-right mt-0.5">
                            {tuition <= tefaAmount ? (
                              <span className="text-[10px] text-green-600 font-semibold">Fully covered by TEFA</span>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-semibold">+${(tuition - tefaAmount).toLocaleString()} out of pocket</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-sm text-green-700 mb-1">TEFA Eligibility Confirmed</h4>
                  <p className="text-xs text-green-600">This school is an approved TEFA participating institution. Verify at educationfreedom.texas.gov</p>
                </div>
                {school.financialAidAvailable && (
                  <div className="bg-sky-light border border-sky-accent/20 rounded-xl p-4">
                    <h4 className="font-semibold text-sm text-sky-accent mb-1">Financial Aid Available</h4>
                    <p className="text-xs text-charcoal-light">This school offers additional financial aid. Contact admissions for details.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">Parent Reviews</h3>
              <div className="space-y-4">
                {school.reviews.map((review, i) => (
                  <div key={i} className="bg-cream rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-burnt/10 rounded-full flex items-center justify-center text-burnt font-bold text-sm">
                        {review.author[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{review.author}</p>
                        <p className="text-[10px] text-charcoal-light">{review.date}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-sm text-charcoal-light leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal mb-3">Photo Gallery</h3>
              <div className="grid grid-cols-2 gap-3">
                {school.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`${school.name} photo ${i + 1}`}
                    className="w-full h-40 object-cover rounded-xl"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Inquiry Form */}
        <div className="px-6 pb-8 mt-4 border-t border-gray-100 pt-6">
          <h3 className="font-display text-xl font-bold text-charcoal mb-1">
            Interested in {school.name}?
          </h3>
          <p className="text-sm text-charcoal-light mb-4">
            Let the admissions team know you are exploring enrollment. This is an inquiry only, not an enrollment commitment.
          </p>

          {formSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <CircleCheck className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <h4 className="font-bold text-green-700 mb-1">Your inquiry has been sent!</h4>
              <p className="text-sm text-green-600">
                The admissions team at {school.name} will reach out within 2 to 3 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Parent Name"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData(p => ({ ...p, parentName: e.target.value }))}
                  className="px-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="px-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="px-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt"
                />
                <select
                  value={formData.childGrade}
                  onChange={(e) => setFormData(p => ({ ...p, childGrade: e.target.value }))}
                  className="px-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt"
                >
                  <option value="">Child's Grade Level</option>
                  {['PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Child's Name"
                  value={formData.childName}
                  onChange={(e) => setFormData(p => ({ ...p, childName: e.target.value }))}
                  className="px-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt"
                />
                <select
                  value={formData.tefaStatus}
                  onChange={(e) => setFormData(p => ({ ...p, tefaStatus: e.target.value }))}
                  className="px-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt"
                >
                  <option value="">Are you a TEFA applicant?</option>
                  <option value="yes">Yes, I have been awarded</option>
                  <option value="applied">Applied, awaiting lottery</option>
                  <option value="no">No, not yet applied</option>
                </select>
              </div>
              <textarea
                placeholder="Message (optional)"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-burnt text-white font-semibold rounded-xl hover:bg-burnt-dark transition-colors shadow-sm"
              >
                Send Inquiry
              </button>
              <p className="text-[10px] text-charcoal-light text-center">
                By submitting, you agree that your contact info will be shared with the admissions office at {school.name}. This does not constitute enrollment.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
