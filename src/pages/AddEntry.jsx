import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addEntry } from '../services/entries'

export default function AddEntry() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [form, setForm] = useState({
    title: '', description: '', tags: '', source: '', timeSpent: '', needsRevision: false, date: new Date().toISOString().split('T')[0]
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim()) return setError('Title and description are required.')
    
    setLoading(true)
    try {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      const data = {
        ...form,
        tags: tagsArray,
        timeSpent: form.timeSpent ? Number(form.timeSpent) : 0
      }
      await addEntry(currentUser.uid, data)
      navigate('/timeline')
    } catch {
      setError('Failed to save entry.')
    }
    setLoading(false)
  }

  return (
    <div className="container-sm">
      <div className="mb-6">
        <h1 className="page-title">Capture Insight</h1>
        <p className="page-subtitle">What did you learn today?</p>
      </div>

      <div className="glass-card">
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="What did you learn?" />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Time Spent (mins)</label>
              <input type="number" name="timeSpent" value={form.timeSpent} onChange={handleChange} placeholder="e.g. 45" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Summarize your key takeaways..." />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="React, Frontend, API" />
          </div>

          <div className="form-group">
            <label className="form-label">Source (Optional)</label>
            <input name="source" value={form.source} onChange={handleChange} placeholder="Link to article, video, or book title" />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input type="checkbox" name="needsRevision" checked={form.needsRevision} onChange={handleChange} style={{ width: 'auto', margin: 0 }} id="rev" />
            <label htmlFor="rev" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Mark for Revision Later</label>
          </div>

          <div className="flex-between mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, marginRight: '1rem' }}>
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
