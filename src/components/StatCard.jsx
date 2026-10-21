function StatCard({ label, value, detail, icon: Icon, iconClass }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${iconClass}`}><Icon size={19} strokeWidth={1.9} /></div>
      <div className="stat-copy">
        <span>{label}</span>
        <div className="stat-value">{value}</div>
        <small>{detail}</small>
      </div>
    </article>
  )
}

export default StatCard
