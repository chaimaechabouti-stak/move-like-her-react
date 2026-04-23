import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { abonnements as abonnementApi, reservations as resApi } from '../services/api'
import './Dashboard.css'

/* Compteur animé */
function CountUp({ end, duration = 1200, suffix = '' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!end || isNaN(end)) { setVal(end); return }
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setVal(end); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration])
  return <>{val}{suffix}</>
}

/* Hook intersection observer pour les animations d'entrée */
function useVisible(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [inscription, setInscription] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [mounted, setMounted] = useState(false)

  const [reservations, setReservations] = useState([])
  const [cancelingId, setCancelingId]   = useState(null)

  const [statsRef, statsVisible]   = useVisible()
  const [aboRef,   aboVisible]     = useVisible()
  const [resRef,   resVisible]     = useVisible()
  const [quickRef, quickVisible]   = useVisible()
  const [profRef,  profVisible]    = useVisible()

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user) return
    abonnementApi.monAbonnement()
      .then(setInscription)
      .catch(() => setInscription(null))
      .finally(() => setLoadingData(false))
    resApi.mesReservations()
      .then(data => setReservations(Array.isArray(data) ? data : (data.data ?? [])))
      .catch(() => {})
  }, [user])

  async function handleCancelReservation(coursId) {
    setCancelingId(coursId)
    try {
      await resApi.annuler(coursId)
      setReservations(prev => prev.filter(r => r.cours_id !== coursId))
    } catch {
      // silently ignore
    } finally {
      setCancelingId(null)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const handleLogout = async () => { await logout(); navigate('/') }
  if (loading || !user) return null

  const initiales = `${user.prenom?.[0] ?? ''}${user.name?.[0] ?? ''}`.toUpperCase() || 'M'

  const dateFin   = inscription?.date_fin   ? new Date(inscription.date_fin)   : null
  const dateDebut = inscription?.date_debut ? new Date(inscription.date_debut) : null

  const jours = dateFin
    ? Math.max(0, Math.ceil((dateFin - new Date()) / (1000 * 60 * 60 * 24)))
    : 0

  const progressPct = dateFin && dateDebut && dateFin > dateDebut
    ? Math.min(100, Math.max(0, Math.round(((new Date() - dateDebut) / (dateFin - dateDebut)) * 100)))
    : 0

  const statutAbo = inscription ? (jours <= 7 ? 'warn' : 'active') : 'none'

  /* Notifications intelligentes */
  const notifications = [
    inscription && jours <= 7 && jours > 0 && {
      id: 'exp-soon', type: 'warn',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
      title: 'Abonnement bientôt expiré',
      msg: `Ton abonnement expire dans ${jours} jour${jours > 1 ? 's' : ''}. Renouvelle-le pour continuer.`,
      action: { label: 'Renouveler', to: '/abonnements' }
    },
    inscription && jours === 0 && {
      id: 'exp-today', type: 'error',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
      title: 'Abonnement expiré',
      msg: 'Ton abonnement a expiré. Souscris un nouvel abonnement pour accéder aux cours.',
      action: { label: 'S\'abonner', to: '/abonnements' }
    },
    !inscription && {
      id: 'no-abo', type: 'info',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      title: 'Pas encore abonnée',
      msg: 'Rejoins Move Like Her et accède à tous nos cours collectifs et coachs.',
      action: { label: 'Voir les formules', to: '/abonnements' }
    },
    reservations.length > 0 && {
      id: 'has-res', type: 'success',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
      title: `${reservations.length} cours réservé${reservations.length > 1 ? 's' : ''}`,
      msg: 'Tes prochaines séances sont confirmées. Bonne séance !',
      action: null
    },
  ].filter(Boolean)

  return (
    <div className={`dash-page ${mounted ? 'is-mounted' : ''}`}>

      {/* ── NOTIFICATIONS ── */}
      {notifications.length > 0 && (
        <div className="dash-notifs container">
          {notifications.map(n => (
            <div key={n.id} className={`dash-notif dash-notif--${n.type}`}>
              <div className="dash-notif-icon">{n.icon}</div>
              <div className="dash-notif-body">
                <span className="dash-notif-title">{n.title}</span>
                <span className="dash-notif-msg">{n.msg}</span>
              </div>
              {n.action && (
                <Link to={n.action.to} className="dash-notif-btn">{n.action.label}</Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <div className="dash-hero">
        {/* Particles */}
        <div className="dash-particles">
          {Array(12).fill(0).map((_, i) => <span key={i} className="dash-particle" style={{ '--i': i }} />)}
        </div>
        <div className="dash-hero-glow" />
        <div className="dash-hero-grid" />

        <div className="container dash-hero-inner">
          {/* Avatar */}
          <div className="dash-avatar-wrap">
            <div className="dash-avatar-ring" />
            <div className="dash-avatar">{initiales}</div>
            <span className={`dash-online ${statutAbo === 'active' ? 'is-on' : ''}`} />
          </div>

          {/* Text */}
          <div className="dash-hero-text">
            <span className="dash-hero-eyebrow">
              <span className="dash-eyebrow-dot" />
              Espace membre
            </span>
            <h1 className="dash-hero-name">
              Bonjour, <em>{user.prenom ?? user.name}</em> 👋
            </h1>
            <p className="dash-hero-sub">{user.email}</p>
            <div className="dash-hero-chips">
              <span className="dash-chip dash-chip-role">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Membre
              </span>
              {inscription && (
                <span className={`dash-chip ${jours <= 7 ? 'dash-chip-warn' : 'dash-chip-abo'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {inscription.abonnement?.nom}
                  {jours <= 7 && <span className="dash-chip-badge">{jours}j</span>}
                </span>
              )}
            </div>
          </div>

          <button className="dash-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="container dash-body">

        {/* ── KPI STATS ── */}
        {!loadingData && inscription && (
          <div ref={statsRef} className={`dash-kpis ${statsVisible ? 'anim-in' : ''}`}>
            {[
              { label: 'Jours restants',    val: jours,    suffix: 'j',  color: '#e91e8c', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
              { label: 'Mois d\'abonnement', val: inscription.frequence === 'annuel' ? 12 : 1, suffix: 'mo', color: '#9c27b0', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> },
              { label: 'Club actuel',        val: inscription.salle?.ville?.nom ?? '—', suffix: '', color: '#d81b60', num: false, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21V8l9-6 9 6v13"/><path d="M9 21v-6h6v6"/></svg> },
              { label: 'Tarif',              val: inscription.montant_paye, suffix: ' Dh', color: '#f06292', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
            ].map((s, i) => (
              <div key={i} className="dash-kpi" style={{ '--c': s.color, '--delay': `${i * 80}ms` }}>
                <div className="dash-kpi-shine" />
                <div className="dash-kpi-icon">{s.icon}</div>
                <div className="dash-kpi-body">
                  <span className="dash-kpi-val">
                    {s.num === false
                      ? s.val
                      : statsVisible ? <CountUp end={Number(s.val)} /> : 0
                    }
                    {s.num !== false && s.suffix}
                  </span>
                  <span className="dash-kpi-lbl">{s.label}</span>
                </div>
                <div className="dash-kpi-bar" />
              </div>
            ))}
          </div>
        )}

        {/* ── ABONNEMENT ── */}
        <section ref={aboRef} className={`dash-card ${aboVisible ? 'anim-in' : ''}`} style={{ '--delay': '100ms' }}>
          <div className="dash-card-head">
            <h2 className="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Mon abonnement
            </h2>
          </div>

          {loadingData ? (
            <div className="dash-abo-skeleton">
              <div className="dash-sk-line dash-sk-w60" />
              <div className="dash-sk-line dash-sk-w40" />
              <div className="dash-sk-bar" />
            </div>
          ) : inscription ? (
            <div className="dash-abo-body">
              {/* Plan header */}
              <div className="dash-plan-header">
                <div className="dash-plan-left">
                  <div className="dash-plan-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div>
                    <h3 className="dash-plan-name">{inscription.abonnement?.nom ?? 'Abonnement'}</h3>
                    <p className="dash-plan-sub">
                      {inscription.frequence === 'annuel' ? 'Forfait annuel' : 'Forfait mensuel'} · {inscription.salle?.nom ?? 'Tous les clubs'}
                    </p>
                  </div>
                </div>
                <div className="dash-plan-right">
                  <span className={`dash-plan-badge ${jours === 0 ? 'is-exp' : jours <= 7 ? 'is-warn' : 'is-ok'}`}>
                    <span className="dash-badge-dot" />
                    {jours === 0 ? 'Expiré' : jours <= 7 ? `Expire dans ${jours}j` : 'Actif'}
                  </span>
                  <span className="dash-plan-price">{inscription.montant_paye} <small>Dh</small></span>
                </div>
              </div>

              {/* Progress */}
              <div className="dash-prog-wrap">
                <div className="dash-prog-meta">
                  <span className="dash-prog-date">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {dateDebut ? dateDebut.toLocaleDateString('fr-FR') : '—'}
                  </span>
                  <div className="dash-prog-center">
                    <span className="dash-prog-pct">{progressPct}%</span>
                    <span className="dash-prog-hint">utilisé</span>
                  </div>
                  <span className="dash-prog-date">
                    {dateFin ? dateFin.toLocaleDateString('fr-FR') : '—'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </span>
                </div>
                <div className="dash-prog-track">
                  <div className="dash-prog-fill" style={{ width: aboVisible ? `${progressPct}%` : '0%' }}>
                    <span className="dash-prog-tip" />
                  </div>
                </div>
                <p className="dash-prog-days">
                  <strong>{jours}</strong> jour{jours !== 1 ? 's' : ''} restant{jours !== 1 ? 's' : ''} sur votre abonnement
                </p>
              </div>

              {/* Features */}
              {inscription.abonnement?.fonctionnalites?.length > 0 && (
                <div className="dash-features">
                  <p className="dash-features-label">Ce qui est inclus</p>
                  <div className="dash-features-grid">
                    {inscription.abonnement.fonctionnalites.map((f, i) => (
                      <div key={i} className="dash-feat" style={{ '--fi': i }}>
                        <span className="dash-feat-check">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link to="/abonnements" className="dash-upgrade-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Changer d'abonnement
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="dash-upgrade-arrow"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          ) : (
            <div className="dash-no-abo">
              <div className="dash-no-abo-visual">
                <div className="dash-no-abo-ring" />
                <div className="dash-no-abo-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
              </div>
              <h3>Aucun abonnement actif</h3>
              <p>Rejoignez notre communauté et accédez à tous nos cours collectifs, coaching personnalisé et bien plus encore.</p>
              <Link to="/abonnements" className="dash-cta-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Choisir un abonnement
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          )}
        </section>

        {/* ── MES COURS RÉSERVÉS ── */}
        <section ref={resRef} className={`dash-card ${resVisible ? 'anim-in' : ''}`} style={{ '--delay': '150ms' }}>
          <div className="dash-card-head">
            <h2 className="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Mes cours réservés
            </h2>
            <span className="dash-res-count">{reservations.length} cours</span>
          </div>

          {reservations.length === 0 ? (
            <div className="dash-no-res">
              <div className="dash-no-res-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <p>Aucun cours réservé pour l'instant.</p>
              <Link to="/cours-collectifs" className="dash-res-link">
                Voir les cours disponibles
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          ) : (
            <div className="dash-res-list">
              {reservations.map((r, i) => {
                const c = r.cours || {}
                return (
                  <div key={r.id} className="dash-res-item" style={{ '--ri': i }}>
                    <div className="dash-res-color" style={{ background: c.couleur || '#e91e8c' }} />
                    {c.image_url && (
                      <div className="dash-res-img" style={{ backgroundImage: `url(${c.image_url})` }} />
                    )}
                    <div className="dash-res-info">
                      <span className="dash-res-name">{c.nom || '—'}</span>
                      <div className="dash-res-meta">
                        {c.duree && (
                          <span className="dash-res-pill">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            {c.duree}
                          </span>
                        )}
                        {c.niveau && (
                          <span className="dash-res-pill">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            {c.niveau}
                          </span>
                        )}
                        {inscription?.salle?.ville?.nom && (
                          <span className="dash-res-pill dash-res-pill--city">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                            {inscription.salle.ville.nom}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="dash-res-cancel"
                      onClick={() => handleCancelReservation(r.cours_id)}
                      disabled={cancelingId === r.cours_id}
                      title="Annuler la réservation"
                    >
                      {cancelingId === r.cours_id
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dash-res-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      }
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── ACCÈS RAPIDES ── */}
        <section ref={quickRef} className={`dash-card ${quickVisible ? 'anim-in' : ''}`} style={{ '--delay': '200ms' }}>
          <div className="dash-card-head">
            <h2 className="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Accès rapides
            </h2>
          </div>
          <div className="dash-quick-grid">
            {[
              { to: '/cours-collectifs', c: '#e91e8c', label: 'Planning cours',  sub: 'Voir le programme', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
              { to: '/salles',           c: '#9c27b0', label: 'Nos clubs',        sub: 'Trouver une salle', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
              { to: '/stats',            c: '#00bcd4', label: 'Mes statistiques', sub: 'Voir ma progression', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
              { to: '/abonnements',      c: '#f06292', label: 'Abonnements',      sub: 'Gérer mon plan',    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
            ].map((item, i) => (
              <Link key={i} to={item.to} className="dash-quick-card" style={{ '--c': item.c, '--qi': i }}>
                <div className="dash-quick-shine" />
                <div className="dash-quick-icon">{item.icon}</div>
                <div className="dash-quick-text">
                  <p className="dash-quick-label">{item.label}</p>
                  <p className="dash-quick-sub">{item.sub}</p>
                </div>
                <div className="dash-quick-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── PROFIL ── */}
        <section ref={profRef} className={`dash-card ${profVisible ? 'anim-in' : ''}`} style={{ '--delay': '250ms' }}>
          <div className="dash-card-head">
            <h2 className="dash-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
              Mon profil
            </h2>
            <Link to="/profil" className="dash-edit-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Modifier
            </Link>
          </div>
          <div className="dash-profile-list">
            {[
              { label: 'Prénom',        val: user.prenom ?? '—',    color: '#e91e8c', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg> },
              { label: 'Nom',           val: user.name,             color: '#9c27b0', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg> },
              { label: 'E-mail',        val: user.email,            color: '#d81b60', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
              { label: 'Téléphone',     val: user.telephone ?? '—', color: '#f06292', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.1 2.18 2 2 0 012.1 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg> },
              { label: 'Membre depuis', val: user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : '—', color: '#ab47bc', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
            ].map((row, i) => (
              <div key={i} className="dash-prof-row" style={{ '--pi': i, '--c': row.color }}>
                <div className="dash-prof-icon">{row.icon}</div>
                <div className="dash-prof-info">
                  <span className="dash-prof-lbl">{row.label}</span>
                  <span className="dash-prof-val">{row.val}</span>
                </div>
                <div className="dash-prof-line" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
