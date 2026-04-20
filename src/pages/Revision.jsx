import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries'
import { updateEntry } from '../services/entries'
import EntryCard from '../components/EntryCard'

export default function Revision() {
  const { entries, loading, refetch } = useEntries()
  const navigate = useNavigate()

  const needsRevision = useMemo(() => entries.filter(e => e.needsRevision), [entries])

  async function handleMarkRevised(id) {
    try {
      await updateEntry(id, { needsRevision: false })
      await refetch()
    } catch {
      alert('Failed to update')
    }
  }

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>

  return (
    <div className="container-sm">
      <div className="mb-6">
        <h1 className="page-title">Review Queue</h1>
        <p className="page-subtitle">Topics you've marked for spaced repetition.</p>
      </div>
      <div>
        {needsRevision.length === 0 ? (
          <p className="text-center form-label mt-4">You have caught up with your revisions! 🎉</p>
        ) : (
          needsRevision.map(e => (
            <div key={e.id} style={{ marginBottom: '1rem' }}>
              <EntryCard entry={e} onMarkReviewed={() => handleMarkRevised(e.id)} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
