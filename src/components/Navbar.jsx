import React from 'react'

export default function Navbar({ savedCount, tefaAmount, isIEP, onToggleIEP, onShowTEFAInfo, onShowSaved }) {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-burnt rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
            </svg>
          </div>
          <span className="font-display text-xl text-charcoal tracking-tight">TexaSchoolFinder</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* How TEFA Works */}
          <button
            onClick={onShowTEFAInfo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-charcoal-light hover:text-burnt transition-colors rounded-lg hover:bg-burnt/5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How TEFA Works
          </button>

          {/* TEFA Budget Chip */}
          <div className="flex items-center gap-2 bg-cream-dark border border-burnt/20 rounded-full px-3 py-1.5">
            <span className="text-xs font-medium text-charcoal-light">My TEFA</span>
            <span className="font-bold text-burnt text-sm">${tefaAmount.toLocaleString()}</span>
            <button
              onClick={onToggleIEP}
              className={`relative w-9 h-5 rounded-full transition-colors ${isIEP ? 'bg-burnt' : 'bg-gray-300'}`}
              title={isIEP ? 'IEP mode: $30,000 award' : 'Standard: $10,474 award'}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isIEP ? 'left-4.5' : 'left-0.5'}`} />
            </button>
            <span className="text-[10px] text-charcoal-light font-medium">IEP</span>
          </div>

          {/* Saved Schools */}
          <button
            onClick={onShowSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-charcoal-light hover:text-burnt transition-colors rounded-lg hover:bg-burnt/5"
          >
            <svg className="w-5 h-5" fill={savedCount > 0 ? '#C05621' : 'none'} stroke="#C05621" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-burnt text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
