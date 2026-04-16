import React, { useState } from 'react'
import { MapPin, ChevronDown, Search } from 'lucide-react'

const GRADE_OPTIONS = ['PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

const CITY_SUGGESTIONS = [
  'Houston, TX', 'Dallas, TX', 'San Antonio, TX', 'Austin, TX', 'Fort Worth, TX',
  'Plano, TX', 'Frisco, TX', 'McKinney, TX', 'Sugar Land, TX', 'The Woodlands, TX',
  'Katy, TX', 'Round Rock, TX', 'Georgetown, TX', 'Waco, TX', 'El Paso, TX',
  'Lubbock, TX', 'Corpus Christi, TX', 'Tyler, TX', 'Amarillo, TX', 'San Marcos, TX',
]

export default function HeroSearch({ searchQuery, gradeLevel, onSearch, onGradeChange }) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showGradeDropdown, setShowGradeDropdown] = useState(false)

  const filteredSuggestions = inputValue.trim().length > 0
    ? CITY_SUGGESTIONS.filter(c => c.toLowerCase().includes(inputValue.toLowerCase()))
    : CITY_SUGGESTIONS

  const handleSubmit = (e) => {
    e?.preventDefault()
    setShowSuggestions(false)
    onSearch(inputValue)
  }

  const handleSuggestionClick = (city) => {
    setInputValue(city)
    setShowSuggestions(false)
    onSearch(city.split(',')[0])
  }

  const toggleGrade = (grade) => {
    if (gradeLevel.includes(grade)) {
      onGradeChange(gradeLevel.filter(g => g !== grade))
    } else {
      onGradeChange([...gradeLevel, grade])
    }
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-5">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-charcoal text-center mb-1 tracking-tight">
          Calculate Your Student Voucher Coverage
        </h1>
        <p className="text-charcoal-light text-center mb-4 text-sm">
          Search Texas private schools participating in the TEFA program and see what your voucher covers.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto">
          {/* Location Input */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Enter city, ZIP code, or school name..."
              className="w-full pl-10 pr-4 py-3 bg-cream border border-gray-200 rounded-xl text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-burnt/30 focus:border-burnt transition-all"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto">
                {filteredSuggestions.map(city => (
                  <button
                    key={city}
                    type="button"
                    onMouseDown={() => handleSuggestionClick(city)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-cream transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grade Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowGradeDropdown(prev => !prev)}
              className="w-full sm:w-44 py-3 px-4 bg-cream border border-gray-200 rounded-xl text-sm text-left hover:border-burnt/30 transition-colors flex items-center justify-between"
            >
              <span className={gradeLevel.length > 0 ? 'text-charcoal' : 'text-gray-400'}>
                {gradeLevel.length > 0 ? `${gradeLevel.length} grade${gradeLevel.length > 1 ? 's' : ''}` : 'Grade level'}
              </span>
              <ChevronDown className="w-4 h-4 text-charcoal-light" />
            </button>
            {showGradeDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-3 w-64">
                <div className="flex flex-wrap gap-1.5">
                  {GRADE_OPTIONS.map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => toggleGrade(grade)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        gradeLevel.includes(grade)
                          ? 'bg-burnt text-white'
                          : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowGradeDropdown(false)}
                  className="mt-2 w-full text-center text-xs text-burnt font-semibold"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="py-3 px-8 bg-burnt text-white font-semibold rounded-xl hover:bg-burnt-dark transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>

        {/* TEFA Status Banner */}
        <div className="mt-4 max-w-3xl mx-auto bg-sky-light/60 border border-sky-accent/20 rounded-xl px-4 py-2.5 text-center">
          <p className="text-xs text-charcoal">
            <span className="font-semibold">Application window is now closed.</span>{' '}
            Lottery results expected in early April. You have until{' '}
            <span className="font-bold text-burnt">June 1, 2026</span> to select your school.
          </p>
        </div>
      </div>
    </div>
  )
}
