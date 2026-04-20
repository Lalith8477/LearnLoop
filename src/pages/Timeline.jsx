import { useState, useMemo } from 'react'
import { useEntries } from '../hooks/useEntries'
import { deleteEntry } from '../services/entries'
import EntryCard from '../components/EntryCard'

export default function Timeline() {
  const { entries, loading, refetch } = useEntries()
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const allTags = useMemo(() => {
    const tags = new Set()
    entries.forEach(e => (e.tags || []).forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [entries])

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const mSearch = e.title.toLowerCase().includes(search.toLowerCase()) || (e.description || '').toLowerCase().includes(search.toLowerCase())
      const mTag = tagFilter ? (e.tags || []).includes(tagFilter) : true
      return mSearch && mTag
    })
  }, [entries, search, tagFilter])

  async function handleDelete(id) {
    if (!window.confirm('Delete this entry?')) return
    try {
      await deleteEntry(id)
      await refetch()
    } catch {
      alert('Failed to delete')
    }
  }

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>

  return (
    <div className="container-sm">
      <div className="mb-6">
        <h1 className="page-title">Learning Log</h1>
        <p className="page-subtitle">Your chronological learning history</p>
      </div>

      <div className="form-row mb-6">
        <input type="text" placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          <option value="">All Tags</option>
          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        {filtered.length === 0 ? (
          <p className="text-center form-label mt-4">No entries found.</p>
        ) : (
          filtered.map(e => <EntryCard key={e.id} entry={e} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  )
}
