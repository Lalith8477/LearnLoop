import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEntries } from '../hooks/useEntries'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { currentUser } = useAuth()
  const { entries, loading } = useEntries()
  const navigate = useNavigate()
  
  const [goal, setGoal] = useState(() => Number(localStorage.getItem('learnloop_daily_goal')) || 60)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [tempGoal, setTempGoal] = useState(goal)

  function saveGoal() {
    const newGoal = Number(tempGoal) > 0 ? Number(tempGoal) : 60
    setGoal(newGoal)
    localStorage.setItem('learnloop_daily_goal', newGoal)
    setIsEditingGoal(false)
  }

  const stats = useMemo(() => {
    const total = entries.length
    const timeSpent = entries.reduce((acc, e) => acc + (Number(e.timeSpent) || 0), 0)
    
    // Calculate today's time spent
    const todayStr = new Date().toISOString().split('T')[0]
    const todayTime = entries.filter(e => e.date === todayStr).reduce((acc, e) => acc + (Number(e.timeSpent) || 0), 0)
    
    const tagMap = {}
    entries.forEach(e => {
      (e.tags || []).forEach(t => {
        tagMap[t] = (tagMap[t] || 0) + 1
      })
    })
    const topTags = Object.entries(tagMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    let streak = 0
    if (total > 0) {
      const dates = [...new Set(entries.map(e => e.date).filter(Boolean))].sort((a, b) => new Date(b) - new Date(a))
      let today = new Date().toISOString().split('T')[0]
      let current = new Date(today)
      
      if (!dates.includes(today)) {
        current.setDate(current.getDate() - 1)
        today = current.toISOString().split('T')[0]
      }

      if (dates.includes(today)) {
        streak = 1
        for (let i = 1; i < dates.length; i++) {
          current.setDate(current.getDate() - 1)
          if (dates.includes(current.toISOString().split('T')[0])) streak++
          else break
        }
      }
    }

    return { total, timeSpent, todayTime, topTags, streak }
  }, [entries])

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>

  // Progress Ring Calculation (Goal: dynamic)
  const progressPercent = Math.min((stats.todayTime / goal) * 100, 100)
  const r = 45
  const circ = 2 * Math.PI * r
  const offset = circ - (progressPercent / 100) * circ

  return (
    <div className="container">
      <div className="mb-6 flex-between">
        <div>
          <h1 className="page-title">Intelligence Dashboard</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Welcome back, {currentUser?.displayName || 'Learner'}</p>
        </div>
        
        {/* Daily Goal Ring */}
        <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <p className="form-label" style={{ margin: 0 }}>Daily Goal</p>
              <button onClick={() => setIsEditingGoal(!isEditingGoal)} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}>
                {isEditingGoal ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditingGoal ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input type="number" value={tempGoal} onChange={e => setTempGoal(e.target.value)} style={{ width: '80px', padding: '0.4rem', fontSize: '0.8rem' }} />
                <button onClick={saveGoal} className="btn btn-primary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}>Save</button>
              </div>
            ) : (
              <p style={{ fontWeight: 600 }}>{stats.todayTime} / {goal}m</p>
            )}
          </div>
          <div className="progress-ring" style={{ width: '50px', height: '50px' }}>
            <svg width="50" height="50" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="25" cy="25" r={r} className="progress-ring-circle-bg" style={{ strokeWidth: 4 }} />
              <circle cx="25" cy="25" r={r} className="progress-ring-circle" style={{ strokeWidth: 4, strokeDasharray: circ, strokeDashoffset: offset }} />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid-3 mb-6">
        <div className="glass-card text-center">
          <p className="form-label text-center">Total Learnings</p>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{stats.total}</p>
        </div>
        <div className="glass-card text-center">
          <p className="form-label text-center">Current Streak</p>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{stats.streak} <span style={{ fontSize: '1rem' }}>Days</span></p>
        </div>
        <div className="glass-card text-center">
          <p className="form-label text-center">Total Time Invested</p>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>{stats.timeSpent} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>m</span></p>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <h2 className="section-title">Most Active Topics</h2>
          {stats.topTags.length === 0 ? (
            <p className="form-label text-center mt-4">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.topTags} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'rgba(15,17,21,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} barSize={36}>
                  {/* SVG Gradient Defs injected here or just use fill */}
                </Bar>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card">
          <div className="flex-between mb-4">
            <h2 className="section-title" style={{ margin: 0 }}>Recent Activity</h2>
            <button onClick={() => navigate('/timeline')} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>View All</button>
          </div>
          {entries.length === 0 ? (
            <div className="text-center" style={{ padding: '2rem 0' }}>
              <p className="form-label mb-4">You haven't logged anything yet.</p>
              <button onClick={() => navigate('/add')} className="btn btn-primary">Log First Entry</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {entries.slice(0, 4).map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</p>
                    <p className="form-label" style={{ margin: 0 }}>{e.date}</p>
                  </div>
                  {e.needsRevision && <span className="tag tag-revision">Review</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
