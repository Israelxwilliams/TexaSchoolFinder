import { createClient } from '@supabase/supabase-js'

// Trim trailing slashes so auth URLs don't get double-slashed
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '')
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

const isConfigured = supabaseUrl && supabaseUrl !== 'your-supabase-project-url' &&
  supabaseAnonKey && supabaseAnonKey !== 'your-supabase-anon-key'

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const supabaseReady = isConfigured
