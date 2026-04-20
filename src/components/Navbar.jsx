import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch {
      console.error('Logout failed')
    }
  }

  if (!currentUser) return null

  const linkClass = (path) => `nav-item ${location.pathname === path ? 'active' : ''}`

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="nav-brand">
          <span>🧠</span> LearnLoop
        </Link>
        <div className="nav-links">
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <Link to="/timeline" className={linkClass('/timeline')}>Timeline</Link>
          <Link to="/revision" className={linkClass('/revision')}>Revision</Link>
          <Link to="/add" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>+ Log Learning</Link>
          <button onClick={handleLogout} className="nav-item">Logout</button>
        </div>
      </div>
    </nav>
  )
}
