import React, { useState } from 'react'
import { MapPin, DollarSign, BookOpen, Trophy, Building2, Star, ChevronDown, Info } from 'lucide-react'

const SCHOOL_TYPES = ['Catholic', 'Christian/Evangelical', 'Jewish', 'Secular Independent', 'Montessori', 'STEM-focused', 'Classical/Liberal Arts', 'Online/Hybrid']
const ACCREDITATIONS = ['TEPSAC', 'SACS', 'AdvancED', 'TCSA']
const GRADE_GROUPS = ['PreK-5', '6-8', '9-12']
const CURRICULUM_TYPES = ['IB', 'AP Courses', 'Dual Enrollment', 'STEM', 'Classical', 'Reggio Emilia', 'Charlotte Mason']
const ATHLETICS = ['Football', 'Basketball', 'Baseball', 'Softball', 'Soccer', 'Volleyball', 'Track & Field', 'Cross Country', 'Swimming', 'Tennis', 'Golf', 'Lacrosse', 'Wrestling', 'Cheerleading', 'Dance Team', 'Esports']
const FINE_ARTS = ['Band', 'Orchestra', 'Choir', 'Theater', 'Visual Arts', 'Film', 'Dance']
const CLUBS = ['Robotics', 'Debate', 'Model UN', 'Student Government', 'National Honor Society', 'STEM Club', 'Coding Club', 'Beta Club']
const SETTINGS = ['Urban', 'Suburban', 'Rural']

function FilterSection({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 py-3">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-semibold text-sm text-charcoal flex items-center gap-2">
          <Icon className="w-4 h-4 text-charcoal-light" /> {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-charcoal-light transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  )
}

function CheckboxGroup({ options, selected, onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val))
    } else {
      onChange([...selected, val])
    }
  }
  return (
    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="w-3.5 h-3.5 rounded border-gray-300 text-burnt focus:ring-burnt/30 accent-[#C05621]"
          />
          <span className="text-xs text-charcoal-light group-hover:text-charcoal transition-colors">{opt}</span>
        </label>
      ))}
    </div>
  )
}

function ToggleCheckbox({ label, checked, onChange, info }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-xs text-charcoal-light group-hover:text-charcoal transition-colors flex items-center gap-1">
        {label}
        {info && (
          <span title={info}>
            <Info className="w-3 h-3 text-gray-400" />
          </span>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded border-gray-300 text-burnt focus:ring-burnt/30 accent-[#C05621]"
      />
    </label>
  )
}

export default function FilterSidebar({ filters, updateFilter, resetFilters }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-charcoal text-sm">Filters</h3>
        <button onClick={resetFilters} className="text-xs text-burnt hover:underline font-medium">Reset all</button>
      </div>

      {/* TEFA Badge */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-xs font-semibold text-green-700">Accepts TEFA Funding</span>
      </div>

      {/* Location */}
      <FilterSection title="Location & Distance" icon={MapPin} defaultOpen={true}>
        <div>
          <label className="text-[11px] text-charcoal-light font-medium">Search radius: {filters.radius} miles</label>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={filters.radius}
            onChange={(e) => updateFilter('radius', Number(e.target.value))}
            className="w-full mt-1"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>5 mi</span>
            <span>100 mi</span>
          </div>
        </div>
      </FilterSection>

      {/* Tuition */}
      <FilterSection title="Tuition & TEFA Coverage" icon={DollarSign} defaultOpen={true}>
        <div>
          <label className="text-[11px] text-charcoal-light font-medium">
            Tuition range: ${filters.tuitionMin.toLocaleString()} to {filters.tuitionMax >= 40000 ? '$40,000+' : `$${filters.tuitionMax.toLocaleString()}`}
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="range"
              min={0}
              max={40000}
              step={1000}
              value={filters.tuitionMin}
              onChange={(e) => {
                const val = Number(e.target.value)
                if (val <= filters.tuitionMax) updateFilter('tuitionMin', val)
              }}
              className="w-full"
            />
          </div>
          <input
            type="range"
            min={0}
            max={40000}
            step={1000}
            value={filters.tuitionMax}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (val >= filters.tuitionMin) updateFilter('tuitionMax', val)
            }}
            className="w-full"
          />
        </div>
        <ToggleCheckbox
          label="TEFA covers full tuition"
          checked={filters.tefaCoversAll}
          onChange={(val) => updateFilter('tefaCoversAll', val)}
          info="Shows only schools where tuition is within your TEFA award amount"
        />
        <ToggleCheckbox
          label="Financial aid available"
          checked={filters.financialAid}
          onChange={(val) => updateFilter('financialAid', val)}
        />
      </FilterSection>

      {/* Academics */}
      <FilterSection title="Academics" icon={BookOpen}>
        <div>
          <p className="text-[11px] text-charcoal-light font-medium mb-1.5">School type</p>
          <CheckboxGroup
            options={SCHOOL_TYPES}
            selected={filters.schoolTypes}
            onChange={(val) => updateFilter('schoolTypes', val)}
          />
        </div>
        <div>
          <p className="text-[11px] text-charcoal-light font-medium mb-1.5">Accreditation</p>
          <CheckboxGroup
            options={ACCREDITATIONS}
            selected={filters.accreditations}
            onChange={(val) => updateFilter('accreditations', val)}
          />
        </div>
        <div>
          <p className="text-[11px] text-charcoal-light font-medium mb-1.5">Grades served</p>
          <div className="flex flex-wrap gap-1.5">
            {GRADE_GROUPS.map(g => (
              <button
                key={g}
                onClick={() => {
                  const cur = filters.gradesServed
                  updateFilter('gradesServed', cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g])
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  filters.gradesServed.includes(g) ? 'bg-burnt text-white' : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] text-charcoal-light font-medium">Max class size: {filters.maxClassSize} students</label>
          <input
            type="range"
            min={8}
            max={30}
            value={filters.maxClassSize}
            onChange={(e) => updateFilter('maxClassSize', Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>
        <div>
          <p className="text-[11px] text-charcoal-light font-medium mb-1.5">Curriculum</p>
          <CheckboxGroup
            options={CURRICULUM_TYPES}
            selected={filters.curriculumTypes}
            onChange={(val) => updateFilter('curriculumTypes', val)}
          />
        </div>
      </FilterSection>

      {/* Athletics */}
      <FilterSection title="Athletics & Activities" icon={Trophy}>
        <div>
          <p className="text-[11px] text-charcoal-light font-medium mb-1.5">Athletics</p>
          <CheckboxGroup
            options={ATHLETICS}
            selected={filters.athletics}
            onChange={(val) => updateFilter('athletics', val)}
          />
        </div>
        <div>
          <p className="text-[11px] text-charcoal-light font-medium mb-1.5">Fine arts</p>
          <CheckboxGroup
            options={FINE_ARTS}
            selected={filters.fineArts}
            onChange={(val) => updateFilter('fineArts', val)}
          />
        </div>
        <div>
          <p className="text-[11px] text-charcoal-light font-medium mb-1.5">Clubs</p>
          <CheckboxGroup
            options={CLUBS}
            selected={filters.clubs}
            onChange={(val) => updateFilter('clubs', val)}
          />
        </div>
        <ToggleCheckbox
          label="UIL participant"
          checked={filters.uilParticipant}
          onChange={(val) => updateFilter('uilParticipant', val)}
        />
      </FilterSection>

      {/* School Profile */}
      <FilterSection title="School Profile" icon={Building2}>
        <div>
          <label className="text-[11px] text-charcoal-light font-medium">
            Enrollment: {filters.enrollmentMin} to {filters.enrollmentMax >= 2000 ? '2,000+' : filters.enrollmentMax}
          </label>
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={filters.enrollmentMax}
            onChange={(e) => updateFilter('enrollmentMax', Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>
        <div>
          <p className="text-[11px] text-charcoal-light font-medium mb-1.5">Setting</p>
          <div className="flex gap-1.5">
            {SETTINGS.map(s => (
              <button
                key={s}
                onClick={() => {
                  const cur = filters.settings
                  updateFilter('settings', cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s])
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  filters.settings.includes(s) ? 'bg-burnt text-white' : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <ToggleCheckbox label="Special education / IEP support" checked={filters.specialEdSupport} onChange={(val) => updateFilter('specialEdSupport', val)} />
        <ToggleCheckbox label="Transportation provided" checked={filters.transportationProvided} onChange={(val) => updateFilter('transportationProvided', val)} />
        <ToggleCheckbox label="Lunch program" checked={filters.lunchProgram} onChange={(val) => updateFilter('lunchProgram', val)} />
        <ToggleCheckbox label="Before/after school care" checked={filters.beforeAfterCare} onChange={(val) => updateFilter('beforeAfterCare', val)} />
        <ToggleCheckbox label="Boarding option" checked={filters.boardingOption} onChange={(val) => updateFilter('boardingOption', val)} />
        <ToggleCheckbox label="Counseling services" checked={filters.counselingServices} onChange={(val) => updateFilter('counselingServices', val)} />
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Ratings" icon={Star}>
        <div className="flex gap-1.5">
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <button
              key={r}
              onClick={() => updateFilter('minRating', filters.minRating === r ? 0 : r)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                filters.minRating === r ? 'bg-burnt text-white' : 'bg-gray-100 text-charcoal hover:bg-gray-200'
              }`}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
