import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!currentUser) return null

  const navs = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Learning Log', path: '/timeline', icon: '🗄️' },
    { name: 'Review Queue', path: '/revision', icon: '🔁' },
    { name: 'Focus Timer', path: '/focus', icon: '⏱️' },
  ]

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="brand">
        <div className="brand-icon">🧠</div>
        <div>LearnLoop</div>
      </Link>

      <nav className="nav-menu">
        {navs.map(n => (
          <Link key={n.path} to={n.path} className={`nav-item ${location.pathname === n.path ? 'active' : ''}`}>
            <span>{n.icon}</span> {n.name}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link to="/add" className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
          ✨ Capture Insight
        </Link>
        <button onClick={() => setShowLogoutConfirm(true)} className="nav-item" style={{ width: '100%', justifyContent: 'flex-start', background: 'transparent' }}>
          <span>🚪</span> Logout
        </button>
      </div>

      {showLogoutConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '320px', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚪</div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>Sign Out</h3>
            <p className="form-label" style={{ marginBottom: '1.5rem', textTransform: 'none' }}>Are you sure you want to log out of your session?</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowLogoutConfirm(false)} className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}>Cancel</button>
              <button onClick={handleLogout} className="btn btn-danger" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}>Log Out</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
