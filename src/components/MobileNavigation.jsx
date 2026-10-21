import { useState } from 'react'
import { BookOpenCheck, ChevronDown, LayoutDashboard, LogOut, Menu, TrendingUp, X } from 'lucide-react'

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Question Tracker', icon: BookOpenCheck },
  { label: 'Progress', icon: TrendingUp },
]

function MobileNavigation({ activeSection, onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)

  const navigate = (section) => {
    onNavigate(section)
    setIsOpen(false)
  }

  return (
    <header className="mobile-header">
      <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); navigate('Dashboard') }}>
        <span className="brand-mark"><BookOpenCheck size={19} strokeWidth={2.2} /></span>
        <span>Prep<span className="brand-accent">Track</span></span>
      </a>
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="mobile-menu-toggle"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
        <span>{activeSection}</span>
        <ChevronDown className={isOpen ? 'chevron-up' : ''} size={15} />
      </button>
      <button aria-label="Sign out" className="mobile-logout" onClick={onLogout} type="button"><LogOut size={17} /></button>
      {isOpen && (
        <nav aria-label="Mobile navigation" className="mobile-menu">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              aria-current={activeSection === label ? 'page' : undefined}
              className={`mobile-nav-item ${activeSection === label ? 'mobile-nav-active' : ''}`}
              key={label}
              onClick={() => navigate(label)}
              type="button"
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}

export default MobileNavigation
