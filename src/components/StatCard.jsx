export default function StatCard({ label, value }) {
  return (
    <div className="card">
      <p className="form-label">{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1' }}>
        {value}
      </p>
    </div>
  )
}
