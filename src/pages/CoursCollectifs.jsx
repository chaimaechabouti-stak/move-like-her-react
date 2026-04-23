import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cours as coursApi, abonnements as abosApi, reservations as resApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { SkeletonGrid } from '../components/Skeleton'
import './CoursCollectifs.css'

const filters = [
  { label: 'Tous', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Cardio', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { label: 'Renforcement', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M12 4v16" strokeLinecap="round"/></svg> },
  { label: 'Bien-être', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { label: 'Danse & Rythme', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
]

const categoryMap = {
  hiit: 'Cardio', 'cardio-boxe': 'Cardio', 'cardio-training': 'Cardio', run: 'Cardio', bikin: 'Cardio',
  'cross-training': 'Renforcement', 'full-body': 'Renforcement', abdos: 'Renforcement', caf: 'Renforcement',
  yoga: 'Bien-être', etirements: 'Bien-être',
  step: 'Danse & Rythme',
}

const schedule = [
  { day: 'Lundi',    slots: [{ time: '7h00', course: 'Yoga', color: '#f48fb1' }, { time: '12h00', course: 'HIIT', color: '#e91e8c' }, { time: '18h30', course: 'CAF', color: '#f06292' }] },
  { day: 'Mardi',    slots: [{ time: '8h00', course: 'Cardio Boxe', color: '#c2185b' }, { time: '12h30', course: 'Full Body', color: '#e91e8c' }, { time: '19h00', course: 'Étirements', color: '#f48fb1' }] },
  { day: 'Mercredi', slots: [{ time: '7h30', course: 'Step', color: '#c2185b' }, { time: '12h00', course: 'Cross Training', color: '#d81b60' }, { time: '18h00', course: 'Yoga', color: '#f48fb1' }] },
  { day: 'Jeudi',    slots: [{ time: '7h00', course: 'HIIT', color: '#e91e8c' }, { time: '12h30', course: 'Abdos', color: '#d81b60' }, { time: '19h00', course: 'Bik\'in', color: '#f48fb1' }] },
  { day: 'Vendredi', slots: [{ time: '8h00', course: 'Full Body', color: '#e91e8c' }, { time: '12h00', course: 'Cardio Training', color: '#c2185b' }, { time: '18h30', course: 'Étirements', color: '#f48fb1' }] },
  { day: 'Samedi',   slots: [{ time: '9h00', course: 'Run', color: '#e91e8c' }, { time: '10h30', course: 'CAF', color: '#f06292' }, { time: '12h00', course: 'Yoga', color: '#f48fb1' }] },
]

export default function CoursCollectifs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('Tous')
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState([])
  const [loadingCours, setLoadingCours] = useState(true)
  const [hasAbonnement, setHasAbonnement] = useState(false)
  const [reserving, setReserving] = useState(null)
  const [reserved, setReserved] = useState(new Set())
  const [toast, setToast] = useState(null)

  useEffect(() => {
    coursApi.list().then(data => {
      const arr = Array.isArray(data) ? data : (data.data ?? [])
      setCourses(arr.filter(c => c.actif !== false).map(c => ({
        ...c,
        title:    c.nom      || c.title    || '',
        desc:     c.description || c.desc  || '',
        duration: c.duree    || c.duration || '',
        level:    c.niveau   || c.level    || '',
        color:    c.couleur  || c.color    || '#e91e8c',
        img:      c.image_url || c.img     || '',
      })))
    }).catch(() => {}).finally(() => setLoadingCours(false))
  }, [])

  useEffect(() => {
    if (!user) return
    abosApi.monAbonnement().then(data => {
      setHasAbonnement(data?.statut === 'active')
    }).catch(() => {})
    resApi.mesReservations().then(data => {
      const arr = Array.isArray(data) ? data : (data.data ?? [])
      setReserved(new Set(arr.map(r => r.cours_id)))
    }).catch(() => {})
  }, [user])

  function showToast(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleReserver(c) {
    if (!user) { navigate('/login'); return }
    if (!hasAbonnement) { navigate('/abonnements'); return }
    if (reserved.has(c.id)) { showToast('Déjà réservé !', true); return }
    setReserving(c.id)
    try {
      await resApi.reserver(c.id)
      setReserved(prev => new Set([...prev, c.id]))
      showToast(`${c.title || c.nom} réservé !`, true)
    } catch (e) {
      if (e.status === 409) { setReserved(prev => new Set([...prev, c.id])); showToast('Déjà réservé.', true) }
      else if (e.status === 403) { navigate('/abonnements') }
      else showToast('Erreur, réessaie.', false)
    } finally {
      setReserving(null)
    }
  }

  const filtered = courses
    .filter(c => active === 'Tous' || categoryMap[c.slug] === active || categoryMap[c.id] === active)
    .filter(c => !search || (c.title || c.nom || '').toLowerCase().includes(search.toLowerCase()) || (c.description || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="page-cours">

      {toast && (
        <div className={`ccv2-toast ${toast.ok ? 'ccv2-toast--ok' : 'ccv2-toast--err'}`}>
          {toast.msg}
        </div>
      )}

      {/* ── HERO ── */}
      <section className="cours-hero">
        <div className="cours-hero-bg" />
        <div className="cours-hero-overlay" />
        <div className="cours-hero-orb cours-hero-orb-1" />
        <div className="cours-hero-orb cours-hero-orb-2" />
        <div className="container cours-hero-content">
          <span className="tag">Cours collectifs</span>
          <h1 className="cours-hero-title">Bouge en <span className="pink-text">communauté</span></h1>
          <p className="cours-hero-desc">15 types de cours, des coaches passionnées, une ambiance unique. Pour toutes les envies, tous les niveaux.</p>
          <div className="cours-hero-pills">
            {['HIIT', 'Yoga', 'Cardio Boxe', 'Bik\'in', 'Cross Training'].map(p => (
              <span key={p} className="cours-hero-pill">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURS ── */}
      <section className="cours-body">
        <div className="container">

          {/* Filtres */}
          <div className="cours-filters">
            {filters.map(f => (
              <button
                key={f.label}
                className={`cours-filter-btn ${active === f.label ? 'active' : ''}`}
                onClick={() => setActive(f.label)}
              >
                <span className="cfb-icon">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="cours-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>
            <input
              className="cours-search-input"
              type="text"
              placeholder="Rechercher un cours…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="cours-search-clear" onClick={() => setSearch('')}>×</button>
            )}
          </div>

          {/* Grille de cartes */}
          <div className="courses-grid-v2">
            {loadingCours
              ? <SkeletonGrid count={6} height={340} />
              : filtered.map(c => (
              <div key={c.id} className="course-card-v2">
                <div className="ccv2-img-wrap">
                  <div className="ccv2-img" style={{ backgroundImage: `url(${c.img || c.image_url})` }} />
                  <div className="ccv2-img-overlay" style={{ background: `linear-gradient(to top, ${c.color}e0 0%, ${c.color}60 40%, transparent 70%)` }} />
                  <div className="ccv2-badges">
                    <span className="ccv2-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {c.duration}
                    </span>
                    <span className="ccv2-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round"/></svg>
                      {c.calories} cal
                    </span>
                  </div>
                  <div className="ccv2-level">{c.level}</div>
                </div>
                <div className="ccv2-body">
                  <div className="ccv2-accent" style={{ background: c.color }} />
                  <h3 className="ccv2-name">{c.title}</h3>
                  <p className="ccv2-desc">{c.desc}</p>
                  <button
                    className={`ccv2-btn ${reserved.has(c.id) ? 'ccv2-btn--done' : ''}`}
                    style={{ color: reserved.has(c.id) ? '#fff' : c.color, borderColor: `${c.color}40`, background: reserved.has(c.id) ? c.color : 'transparent' }}
                    onClick={() => handleReserver(c)}
                    disabled={reserving === c.id}
                  >
                    {reserving === c.id ? 'En cours…' : reserved.has(c.id) ? 'Réservé ✓' : 'Réserver'}
                    {!reserved.has(c.id) && reserving !== c.id && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANNING ── */}
      <section className="planning-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Horaires</span>
            <h2 className="section-title">Planning de la <span className="pink-text">semaine</span></h2>
            <p className="section-subtitle">Horaires indicatifs — varie selon les salles. Consulte l'app pour ton planning exact.</p>
          </div>
          <div className="planning-grid">
            {schedule.map(d => (
              <div key={d.day} className="planning-day">
                <div className="day-header">{d.day}</div>
                <div className="day-slots">
                  {d.slots.map(s => (
                    <div key={s.time + s.course} className="slot" style={{ borderLeftColor: s.color }}>
                      <span className="slot-time">{s.time}</span>
                      <span className="slot-name">{s.course}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </main>
  )
}
