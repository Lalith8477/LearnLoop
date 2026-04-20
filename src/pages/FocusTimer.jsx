import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FocusTimer() {
  const [duration, setDuration] = useState(60) // Default to 60 mins as requested
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const [isActive, setIsActive] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      navigate(`/add?timeSpent=${duration}`)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, navigate, duration])

  function toggle() { setIsActive(!isActive) }
  function reset() { setIsActive(false); setTimeLeft(duration * 60) }
  
  function handleDurationChange(mins) {
    if (mins < 1) mins = 1
    if (mins > 300) mins = 300
    setDuration(mins)
    setTimeLeft(mins * 60)
    setIsActive(false)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const total = duration * 60
  const progress = ((total - timeLeft) / total) * 100
  const radius = 130
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="container-sm text-center">
      <div className="mb-6">
        <h1 className="page-title">Focus Mode</h1>
        <p className="page-subtitle">Deep work session. When the timer ends, you'll log your insight.</p>
      </div>

      <div className="glass-card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label className="form-label" style={{ margin: 0 }}>Set Timer (mins):</label>
          <input 
            type="number" 
            value={duration} 
            onChange={(e) => handleDurationChange(Number(e.target.value))} 
            disabled={isActive}
            min="1"
            max="300"
            style={{ width: '100px', textAlign: 'center', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }} width="300" height="300">
            <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle cx="150" cy="150" r="130" fill="none" stroke="var(--primary)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="timer-display" style={{ margin: 0, fontSize: '4.5rem' }}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '3.5rem' }}>
          <button onClick={toggle} className="btn btn-primary" style={{ width: '160px', fontSize: '1rem' }}>
            {isActive ? 'Pause' : 'Start Focus'}
          </button>
          <button onClick={reset} className="btn btn-outline" style={{ width: '160px', fontSize: '1rem' }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
