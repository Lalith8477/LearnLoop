import { useNavigate, useParams } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries'
import { deleteEntry } from '../services/entries'

export default function EntryDetail() {
  const { id } = useParams()
  const { entries, loading, refetch } = useEntries()
  const navigate = useNavigate()

  const entry = entries.find(e => e.id === id)

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>
  if (!entry) return <div className="center-screen text-center"><p className="form-label">Entry not found.</p></div>

  async function handleDelete() {
    if (!window.confirm('Delete this entry permanently?')) return
    try {
      await deleteEntry(id)
      await refetch()
      navigate('/timeline')
    } catch {
      alert('Delete failed.')
    }
  }

  return (
    <div className="container-sm">
      <button onClick={() => navigate(-1)} className="btn btn-outline mb-4" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>← Back</button>

      <div className="glass-card">
        <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{entry.title}</h1>
            <p className="form-label" style={{ margin: 0 }}>{entry.date} {entry.timeSpent ? `• ${entry.timeSpent} mins` : ''}</p>
          </div>
          {entry.needsRevision && <span className="tag tag-revision">Needs Revision</span>}
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <div className="tags-list mb-4">
            {entry.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        {entry.source && (
          <div className="mb-4">
            <span className="form-label" style={{ display: 'inline', marginRight: '0.5rem' }}>Source:</span>
            <a href={entry.source.startsWith('http') ? entry.source : `https://${entry.source}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.875rem' }}>{entry.source}</a>
          </div>
        )}

        <div style={{ padding: '1.25rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{entry.description}</p>
        </div>

        <div className="flex-between">
          <button onClick={() => navigate(`/edit/${id}`)} className="btn btn-primary" style={{ flex: 1, marginRight: '1rem' }}>Edit Entry</button>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  )
}
