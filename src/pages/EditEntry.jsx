import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries'
import { updateEntry } from '../services/entries'

export default function EditEntry() {
  const { id } = useParams()
  const { entries, loading: entriesLoading, refetch } = useEntries()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)

  useEffect(() => {
    const found = entries.find(e => e.id === id)
    if (found) {
      setForm({
        ...found,
        tags: found.tags ? found.tags.join(', ') : ''
      })
    }
  }, [entries, id])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim()) return setError('Title and description required.')
    
    setLoading(true)
    try {
      const tagsArray = typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags
      const data = {
        title: form.title,
        description: form.description,
        tags: tagsArray,
        source: form.source || '',
        timeSpent: form.timeSpent ? Number(form.timeSpent) : 0,
        needsRevision: form.needsRevision,
        date: form.date
      }
      await updateEntry(id, data)
      await refetch()
      navigate(`/entry/${id}`)
    } catch {
      setError('Failed to update entry.')
    }
    setLoading(false)
  }

  if (entriesLoading || !form) return <div className="spinner-container"><div className="spinner" /></div>

  return (
    <div className="container-sm">
      <div className="mb-6">
        <h1 className="page-title">Edit Entry</h1>
      </div>

      <div className="glass-card">
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Time Spent (mins)</label>
              <input type="number" name="timeSpent" value={form.timeSpent} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Source (Optional)</label>
            <input name="source" value={form.source} onChange={handleChange} />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input type="checkbox" name="needsRevision" checked={form.needsRevision} onChange={handleChange} style={{ width: 'auto', margin: 0 }} id="rev" />
            <label htmlFor="rev" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Mark for Revision Later</label>
          </div>

          <div className="flex-between mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, marginRight: '1rem' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
