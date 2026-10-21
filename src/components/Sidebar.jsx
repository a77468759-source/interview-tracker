import { BookOpenCheck, LayoutDashboard, LogOut, TrendingUp } from 'lucide-react'

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Question Tracker', icon: BookOpenCheck },
  { label: 'Progress', icon: TrendingUp },
]

function Sidebar({ activeSection, onNavigate, onLogout, user }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); onNavigate('Dashboard') }}>
        <span className="brand-mark"><BookOpenCheck size={19} strokeWidth={2.2} /></span>
        <span>Prep<span className="brand-accent">Track</span></span>
      </a>
      <div className="sidebar-label">WORKSPACE</div>
      <nav aria-label="Main navigation" className="sidebar-nav">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            aria-current={activeSection === label ? 'page' : undefined}
            className={`nav-item ${activeSection === label ? 'nav-item-active' : ''}`}
            key={label}
            onClick={() => onNavigate(label)}
            type="button"
          >
            <Icon size={18} strokeWidth={1.9} />
            <span>{label}</span>
            {label === 'Question Tracker' && <span className="nav-indicator" aria-hidden="true">•</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-quote">
          <div className="quote-icon"><span>✳</span></div>
          <p>“Success is the sum of small efforts, repeated day in and day out.”</p>
          <span className="quote-credit">— Robert Collier</span>
        </div>
        <div className="profile-card">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="profile-details"><strong>{user.name}</strong><span>Demo profile</span></div>
          <button aria-label="Sign out" className="profile-logout" onClick={onLogout} title="Sign out" type="button"><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
