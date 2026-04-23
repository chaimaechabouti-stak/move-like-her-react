import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { coachMe } from '../services/api'
import './DashboardCoach.css'

const JOURS_ORDER = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

const JOUR_COLORS = {
  Lundi:    { bg: '#fce4f0', color: '#e91e8c', border: '#f48fb1' },
  Mardi:    { bg: '#f3e5f5', color: '#9c27b0', border: '#ce93d8' },
  Mercredi: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  Jeudi:    { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' },
  Vendredi: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
  Samedi:   { bg: '#fce4f0', color: '#c2185b', border: '#f48fb1' },
}

export default function DashboardCoach() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    coachMe.mesSeances()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => { await logout(); navigate('/') }

  const initiales = `${user?.prenom?.[0] ?? ''}${user?.name?.[0] ?? ''}`.toUpperCase() || 'C'

  // Grouper les séances par jour
  const parJour = JOURS_ORDER.reduce((acc, j) => {
    const s = (data?.seances || []).filter(s => s.jour === j)
    if (s.length) acc[j] = s
    return acc
  }, {})

  const totalSeances = data?.seances?.length ?? 0
  const cours = [...new Set((data?.seances || []).map(s => s.cours?.nom).filter(Boolean))]

  return (
    <div className="dco-page">
      {/* ── Hero ── */}
      <div className="dco-hero">
        <div className="dco-hero-bg" />
        <div className="dco-hero-overlay" />
        <div className="dco-orb dco-orb-1" />
        <div className="dco-orb dco-orb-2" />

        <div className="container dco-hero-inner">
          <div className="dco-avatar-wrap">
            {data?.coach?.photo_url
              ? <img src={data.coach.photo_url} alt="" className="dco-avatar-img" />
              : <div className="dco-avatar">{initiales}</div>
            }
            <span className="dco-online-dot" title="En ligne" />
          </div>

          <div className="dco-hero-text">
            <p className="dco-greeting">Bonjour,</p>
            <h1 className="dco-name">{user?.prenom} {user?.name} 💪</h1>
            <p className="dco-specialite">{data?.coach?.specialite ?? 'Coach Move Like Her'}</p>
            <div className="dco-hero-tags">
              {data?.coach?.salle && (
                <span className="dco-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21V8l9-6 9 6v13"/></svg>
                  {data.coach.salle.nom}
                </span>
              )}
              <span className="dco-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {data?.coach?.experience_annees ?? 0} ans d'expérience
              </span>
            </div>
          </div>

          <button className="dco-logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="container dco-body">

        {/* ── KPI ── */}
        <div className="dco-kpis">
          <div className="dco-kpi">
            <div className="dco-kpi-icon" style={{'--c':'#e91e8c'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div>
              <span className="dco-kpi-val">{totalSeances}</span>
              <span className="dco-kpi-lbl">Séances / semaine</span>
            </div>
          </div>
          <div className="dco-kpi">
            <div className="dco-kpi-icon" style={{'--c':'#9c27b0'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            </div>
            <div>
              <span className="dco-kpi-val">{cours.length}</span>
              <span className="dco-kpi-lbl">Cours dispensés</span>
            </div>
          </div>
          <div className="dco-kpi">
            <div className="dco-kpi-icon" style={{'--c':'#d81b60'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div>
              <span className="dco-kpi-val">{totalSeances * 20}</span>
              <span className="dco-kpi-lbl">Places disponibles</span>
            </div>
          </div>
          <div className="dco-kpi">
            <div className="dco-kpi-icon" style={{'--c':'#f06292'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <span className="dco-kpi-val">{Object.keys(parJour).length}</span>
              <span className="dco-kpi-lbl">Jours actifs</span>
            </div>
          </div>
        </div>

        {/* ── Planning ── */}
        <section className="dco-section">
          <div className="dco-section-head">
            <h2 className="dco-section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Mon planning hebdomadaire
            </h2>
          </div>

          {loading ? (
            <div className="dco-skeleton-grid">
              {Array(3).fill(0).map((_, i) => <div key={i} className="dco-skeleton" />)}
            </div>
          ) : totalSeances === 0 ? (
            <div className="dco-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p>Aucune séance planifiée pour le moment.</p>
              <span>L'administrateur vous assignera des séances prochainement.</span>
            </div>
          ) : (
            <div className="dco-planning-grid">
              {Object.entries(parJour).map(([jour, seances]) => {
                const style = JOUR_COLORS[jour] || JOUR_COLORS.Lundi
                return (
                  <div key={jour} className="dco-jour-card">
                    <div className="dco-jour-head" style={{ background: style.bg, borderColor: style.border }}>
                      <span className="dco-jour-label" style={{ color: style.color }}>{jour}</span>
                      <span className="dco-jour-count" style={{ background: style.color }}>{seances.length} séance{seances.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="dco-seances-list">
                      {seances.map(s => (
                        <div key={s.id} className="dco-seance-item">
                          <div className="dco-seance-time">
                            <span className="dco-time-start">{s.heure_debut?.slice(0,5)}</span>
                            <span className="dco-time-sep">→</span>
                            <span className="dco-time-end">{s.heure_fin?.slice(0,5)}</span>
                          </div>
                          <div className="dco-seance-info">
                            <span className="dco-seance-nom">{s.cours?.nom ?? '—'}</span>
                            <div className="dco-seance-meta">
                              {s.salle && (
                                <span className="dco-seance-salle">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21V8l9-6 9 6v13"/></svg>
                                  {s.salle.nom}
                                </span>
                              )}
                              <span className="dco-seance-places">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                {s.places_max} places
                              </span>
                            </div>
                          </div>
                          <div className="dco-seance-dot" style={{ background: s.cours?.couleur || '#e91e8c' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Profil & Bio ── */}
        {data?.coach && (
          <div className="dco-bottom-grid">
            <section className="dco-section">
              <div className="dco-section-head">
                <h2 className="dco-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
                  Mon profil
                </h2>
              </div>
              <div className="dco-profile-rows">
                {[
                  { label: 'Prénom', val: user?.prenom },
                  { label: 'Nom', val: user?.name },
                  { label: 'Email', val: user?.email },
                  { label: 'Spécialité', val: data.coach.specialite },
                  { label: 'Salle', val: data.coach.salle?.nom },
                  { label: 'Expérience', val: `${data.coach.experience_annees} ans` },
                ].map((r, i) => (
                  <div key={i} className="dco-profile-row">
                    <span className="dco-profile-lbl">{r.label}</span>
                    <span className="dco-profile-val">{r.val ?? '—'}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="dco-section">
              <div className="dco-section-head">
                <h2 className="dco-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                  Cours dispensés
                </h2>
              </div>
              <div className="dco-cours-list">
                {cours.length === 0
                  ? <p className="dco-no-data">Aucun cours assigné.</p>
                  : cours.map((c, i) => (
                    <div key={i} className="dco-cours-chip">
                      <span className="dco-cours-dot" />
                      {c}
                    </div>
                  ))
                }
              </div>
              {data.coach.bio && (
                <div className="dco-bio">
                  <p className="dco-bio-label">Bio</p>
                  <p className="dco-bio-text">{data.coach.bio}</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Accès rapides */}
        <section className="dco-section">
          <div className="dco-section-head">
            <h2 className="dco-section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Accès rapides
            </h2>
          </div>
          <div className="dco-quick-grid">
            {[
              { to: '/cours-collectifs', label: 'Voir le planning', sub: 'Tous les cours', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, color: '#e91e8c' },
              { to: '/salles', label: 'Nos clubs', sub: 'Trouver une salle', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21V8l9-6 9 6v13"/><path d="M9 21v-6h6v6"/></svg>, color: '#9c27b0' },
              { to: '/coaching', label: 'Coaching', sub: 'Voir les coaches', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, color: '#d81b60' },
              { to: '/contact', label: 'Contact', sub: 'Nous écrire', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, color: '#f06292' },
            ].map((item, i) => (
              <Link key={i} to={item.to} className="dco-quick-card">
                <div className="dco-quick-icon" style={{'--c': item.color}}>{item.icon}</div>
                <div>
                  <p className="dco-quick-label">{item.label}</p>
                  <p className="dco-quick-sub">{item.sub}</p>
                </div>
                <svg className="dco-quick-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
