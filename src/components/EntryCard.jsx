import { useNavigate } from 'react-router-dom'

export default function EntryCard({ entry, onDelete, onMarkReviewed }) {
  const navigate = useNavigate()

  const dateStr = entry.date || (entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')

  return (
    <div className="glass-card mb-4">
      <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <h3 className="section-title" style={{ marginBottom: '0.25rem', cursor: 'pointer' }} onClick={() => navigate(`/entry/${entry.id}`)}>
            {entry.title}
          </h3>
          <p className="form-label" style={{ margin: 0 }}>{dateStr} {entry.timeSpent ? `• ${entry.timeSpent} mins` : ''}</p>
        </div>
        {entry.needsRevision && (
          <span className="tag tag-revision">Needs Revision</span>
        )}
      </div>
      
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {entry.description}
      </p>

      {entry.tags && entry.tags.length > 0 && (
        <div className="tags-list">
          {entry.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="flex-between mt-4">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate(`/entry/${entry.id}`)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>View</button>
          <button onClick={() => navigate(`/edit/${entry.id}`)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Edit</button>
          {onMarkReviewed && (
            <button onClick={onMarkReviewed} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Mark as Reviewed</button>
          )}
        </div>
        {onDelete && (
          <button onClick={() => onDelete(entry.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Delete</button>
        )}
      </div>
    </div>
  )
}
