import React from 'react'
import { GraduationCap, Info, Heart, GitCompare, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({
  savedCount, tefaAmount, isIEP, onToggleIEP, onShowTEFAInfo,
  onShowSaved, onShowCompare, compareCount,
  onShowAuth, showFavoritesOnly, onToggleFavoritesOnly,
}) {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-burnt rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold text-charcoal tracking-tight">TexaSchoolFinder</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* How TEFA Works */}
          <button
            onClick={onShowTEFAInfo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-charcoal-light hover:text-burnt transition-colors rounded-lg hover:bg-burnt/5"
          >
            <Info className="w-4 h-4" />
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

          {/* Compare Schools */}
          {compareCount > 0 && (
            <button
              onClick={onShowCompare}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-charcoal-light hover:text-burnt transition-colors rounded-lg hover:bg-burnt/5"
            >
              <GitCompare className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Compare</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            </button>
          )}

          {/* Saved Schools */}
          <button
            onClick={onShowSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-charcoal-light hover:text-burnt transition-colors rounded-lg hover:bg-burnt/5"
          >
            <Heart className="w-4.5 h-4.5" fill={savedCount > 0 ? '#C05621' : 'none'} stroke="#C05621" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-burnt text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* My Favorites filter (only shown when logged in) */}
          {user && (
            <button
              onClick={onToggleFavoritesOnly}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border transition-colors ${
                showFavoritesOnly
                  ? 'bg-burnt text-white border-burnt'
                  : 'border-gray-200 text-charcoal-light hover:text-burnt hover:border-burnt'
              }`}
            >
              <Heart className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} />
              <span>My Favorites</span>
            </button>
          )}

          {/* Auth button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-charcoal-light bg-cream-dark border border-gray-200 rounded-full px-3 py-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[100px] truncate">{user.email}</span>
              </span>
              <button
                onClick={signOut}
                title="Sign out"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-charcoal-light hover:text-burnt transition-colors rounded-lg hover:bg-burnt/5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onShowAuth}
              className="flex items-center gap-1.5 px-4 py-2 bg-burnt text-white text-sm font-semibold rounded-xl hover:bg-burnt-dark transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
