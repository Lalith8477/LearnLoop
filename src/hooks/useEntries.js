import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getEntries } from '../services/entries'

export function useEntries() {
  const { currentUser } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const data = await getEntries(currentUser.uid)
      setEntries(data)
    } catch (err) {
      console.error('Error fetching entries:', err)
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  return { entries, loading, refetch: fetchEntries }
}
