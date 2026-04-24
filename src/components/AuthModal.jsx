import React, { useState } from 'react'
import { X, GraduationCap, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabaseReady } from '../lib/supabase'

export default function AuthModal({ onClose, onSuccess }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(email, password)
        setSignUpSuccess(true)
      } else {
        await signIn(email, password)
        onSuccess?.()
        onClose()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-charcoal hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-burnt rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold text-charcoal">TexaSchoolFinder</span>
        </div>

        {!supabaseReady ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal mb-2">Auth not configured</h3>
            <p className="text-sm text-charcoal-light mb-4">
              Add your <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> to <code className="bg-gray-100 px-1 rounded">.env.local</code> to enable sign-in.
            </p>
            <button onClick={onClose} className="w-full py-3 bg-burnt text-white font-semibold rounded-xl hover:bg-burnt-dark transition-colors">
              Close
            </button>
          </div>
        ) : signUpSuccess ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal mb-2">Check your email</h3>
            <p className="text-sm text-charcoal-light mb-6">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
            </p>
            <button
              onClick={() => { setSignUpSuccess(false); setMode('signin') }}
              className="w-full py-3 bg-burnt text-white font-semibold rounded-xl hover:bg-burnt-dark transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-1">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-charcoal-light mb-6">
              {mode === 'signin'
                ? 'Sign in to access your saved schools.'
                : 'Save your favorite schools and come back anytime.'}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt"
              />
              <input
                type="password"
                placeholder="Password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burnt/20 focus:border-burnt"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-burnt text-white font-semibold rounded-xl hover:bg-burnt-dark transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-charcoal-light mt-5">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
                className="text-burnt font-semibold hover:underline"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
