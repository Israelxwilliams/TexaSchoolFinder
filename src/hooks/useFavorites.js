import { useState, useEffect, useCallback } from 'react'
import { supabase, supabaseReady } from '../lib/supabase'

export function useFavorites(user) {
  const [favoriteIds, setFavoriteIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !supabaseReady) {
      setFavoriteIds([])
      return
    }
    setLoading(true)
    supabase
      .from('favorites')
      .select('school_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          setFavoriteIds(data.map(r => r.school_id))
        }
        setLoading(false)
      })
  }, [user])

  const toggleFavorite = useCallback(async (schoolId) => {
    if (!user || !supabaseReady) return false

    const isFavorited = favoriteIds.includes(schoolId)

    setFavoriteIds(prev =>
      isFavorited ? prev.filter(id => id !== schoolId) : [...prev, schoolId]
    )

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('school_id', schoolId)
      if (error) {
        setFavoriteIds(prev => [...prev, schoolId])
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, school_id: schoolId })
      if (error) {
        setFavoriteIds(prev => prev.filter(id => id !== schoolId))
      }
    }

    return true
  }, [user, favoriteIds])

  return { favoriteIds, toggleFavorite, loading }
}
