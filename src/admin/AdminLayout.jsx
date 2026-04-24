import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import './AdminLayout.css'

const NAV = [
  {
    to: '/admin', end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/>
        <rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>
      </svg>
    ),
    label: 'Dashboard',
  },
  {
    to: '/admin/abonnements',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
        <line x1="6" y1="15" x2="10" y2="15"/>
      </svg>
    ),
    label: 'Abonnements',
  },
  {
    to: '/admin/coaches',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
        <path d="M19 8v6M16 11h6"/>
      </svg>
    ),
    label: 'Coaches',
  },
  {
    to: '/admin/salles',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V8l9-6 9 6v13"/><path d="M9 21v-6h6v6"/>
        <path d="M9 9h.01M15 9h.01"/>
      </svg>
    ),
    label: 'Salles',
  },
  {
    to: '/admin/cours',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    label: 'Cours',
  },
  {
    to: '/admin/utilisateurs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
        <circle cx="17" cy="7" r="3"/><path d="M21 21v-2a3 3 0 00-2-2.83"/>
      </svg>
    ),
    label: 'Utilisateurs',
  },
  {
    to: '/admin/inscriptions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="2"/>
        <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
    label: 'Inscriptions',
  },
  {
    to: '/admin/contacts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Messages',
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* Ajoute une classe sur le body pour que la navbar s'étende sur toute la largeur */
  useEffect(() => {
    document.body.classList.add('admin-page')
    return () => document.body.classList.remove('admin-page')
  }, [])

  const handleLogout = async () => { await logout(); navigate('/') }
  const initiales = `${user?.prenom?.[0] ?? ''}${user?.name?.[0] ?? ''}`.toUpperCase() || 'A'

  return (
    <>
      <Navbar />

      <div className="adm-wrapper">
        {sidebarOpen && <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />}

        <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Mini hero */}
          <div className="adm-sidebar-hero">
            <div className="adm-sidebar-avatar">{initiales}</div>
            <div className="adm-sidebar-info">
              <span className="adm-sidebar-name">{user?.prenom} {user?.name}</span>
              <span className="adm-sidebar-email">{user?.email}</span>
              <span className="adm-sidebar-role">Administrateur</span>
            </div>
          </div>

          <div className="adm-sidebar-sep">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/>
            </svg>
            Espace Admin
          </div>

          <nav className="adm-nav">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `adm-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                <span className="adm-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <button className="adm-sidebar-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
          </button>
        </aside>

        <main className="adm-content">
          <Outlet />
        </main>

        <button className="adm-burger" onClick={() => setSidebarOpen(s => !s)} aria-label="Menu admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </>
  )
}
