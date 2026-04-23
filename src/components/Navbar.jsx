import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import MapModal from './MapModal'
import { useAuth } from '../context/AuthContext'
import './Logo.css'
import './Navbar.css'

const links = [
  { to: '/abonnements',      label: 'Abonnements' },
  { to: '/concept',          label: 'Concept' },
  { to: '/cours-collectifs', label: 'Cours Collectifs' },
  { to: '/coaching',         label: 'Coaching' },
  { to: '/salles',           label: 'Nos Salles' },
  
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    navigate('/')
  }

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  /* Scroll listener — hide on scroll down, show on scroll up */
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y > lastY && y > 80) {
        navRef.current?.classList.add('nav-hidden')
      } else {
        navRef.current?.classList.remove('nav-hidden')
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Fermer le menu au clic en dehors */
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  /* Bloquer le scroll du body quand le menu est ouvert */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* Fermer le menu au changement de route */
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 0)
    return () => clearTimeout(t)
  }, [pathname])

  const darkPages = ['/', '/concept', '/cours-collectifs', '/salles', '/coaching', '/abonnements', '/contact', '/dashboard']
  const isAlwaysDark = darkPages.includes(pathname)

  return (
    <>
    {mapOpen && <MapModal onClose={() => setMapOpen(false)} />}
    <nav
      ref={navRef}
      className={`navbar ${scrolled || isAlwaysDark ? 'scrolled' : ''}`}
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="nav-container">

        {/* Logo */}
        <Link to="/" className="nav-logo-link" aria-label="Move Like Her — Accueil">
          <Logo size={38} withText={true} />
        </Link>

        {/* Links */}
        <ul className={`nav-links ${open ? 'open' : ''}`} role="list">
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={pathname === l.to ? 'active' : ''}
                aria-current={pathname === l.to ? 'page' : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="nav-right">
          <button className="nav-location" aria-label="Trouver une salle" onClick={() => setMapOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            Trouver ma salle
          </button>
          {user ? (
            <div className="nav-user-dropdown" ref={dropdownRef}>
              <button
                className="nav-cta nav-user-btn"
                onClick={() => setDropdownOpen(s => !s)}
                aria-expanded={dropdownOpen}
              >
                <span className="nav-user-avatar">
                  {`${user.prenom?.[0] ?? ''}${user.name?.[0] ?? ''}`.toUpperCase() || 'M'}
                </span>
                {user.prenom ?? user.name}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:12,height:12,marginLeft:2,transition:'transform .2s',transform: dropdownOpen ? 'rotate(180deg)' : 'none'}}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="nav-dropdown-menu">
                  <div className="nav-dropdown-header">
                    <span className="nav-dropdown-name">{user.prenom} {user.name}</span>
                    <span className="nav-dropdown-email">{user.email}</span>
                  </div>
                  <div className="nav-dropdown-items">
                    {user.role === 'admin' ? (
                      <Link to="/admin" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>
                        Administration
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
                        Mon espace
                      </Link>
                    )}
                    <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-cta">
              Se connecter
            </Link>
          )}
        </div>

        <button
          className={`burger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-controls="nav-mobile-menu"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </nav>
    </>
  )
}
