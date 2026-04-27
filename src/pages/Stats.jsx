import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reservations as resApi, abonnements as aboApi } from '../services/api'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import './Stats.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler)

const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const CALORIES_PAR_COURS = {
  'yoga': 200, 'hiit': 550, 'cardio boxe': 480, 'full body': 400,
  'cross training': 500, 'abdos': 320, 'step': 380, 'étirements': 150,
  "bik'in": 450, 'run': 520, 'caf': 310,
}

function getCalories(nom) {
  const key = (nom || '').toLowerCase()
  for (const [k, v] of Object.entries(CALORIES_PAR_COURS)) {
    if (key.includes(k)) return v
  }
  return 350
}

export default function Stats() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [inscription, setInscription] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user) return
    Promise.all([
      resApi.mesReservations().catch(() => []),
      aboApi.monAbonnement().catch(() => null),
    ]).then(([res, abo]) => {
      setReservations(Array.isArray(res) ? res : (res.data ?? []))
      setInscription(abo)
      setLoaded(true)
    })
  }, [user])

  if (!loaded) return <div className="stats-loading"><span className="stats-spinner" /></div>

  /* ── Calculs ── */
  const totalSeances   = reservations.length
  const totalCalories  = reservations.reduce((s, r) => s + getCalories(r.cours?.nom || r.cours?.title), 0)
  const totalHeures    = reservations.reduce((s, r) => s + (parseInt(r.cours?.duree) || 45), 0)
  const joursActif     = inscription?.date_debut
    ? Math.ceil((new Date() - new Date(inscription.date_debut)) / (1000 * 60 * 60 * 24))
    : 0

  /* Séances par mois (6 derniers mois) */
  const now = new Date()
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { label: MOIS[d.getMonth()], month: d.getMonth(), year: d.getFullYear() }
  })
  const seancesMois = last6.map(({ month, year }) =>
    reservations.filter(r => {
      const d = new Date(r.created_at || r.date_reservation || Date.now())
      return d.getMonth() === month && d.getFullYear() === year
    }).length
  )

  /* Répartition par catégorie */
  const catCounts = {}
  reservations.forEach(r => {
    const nom = (r.cours?.nom || r.cours?.title || 'Autre')
    catCounts[nom] = (catCounts[nom] || 0) + 1
  })
  const catLabels = Object.keys(catCounts).slice(0, 6)
  const catData   = catLabels.map(k => catCounts[k])

  /* Calories par mois */
  const caloriesMois = last6.map(({ month, year }) =>
    reservations.filter(r => {
      const d = new Date(r.created_at || r.date_reservation || Date.now())
      return d.getMonth() === month && d.getFullYear() === year
    }).reduce((s, r) => s + getCalories(r.cours?.nom || r.cours?.title), 0)
  )

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: {} } },
    scales: {
      x: { grid: { color: 'rgba(233,30,140,0.07)' }, ticks: { color: '#9a7a8a', font: { size: 11 } } },
      y: { grid: { color: 'rgba(233,30,140,0.07)' }, ticks: { color: '#9a7a8a', font: { size: 11 } }, beginAtZero: true },
    }
  }

  return (
    <main className="stats-page">

      {/* Hero */}
      <section className="stats-hero">
        <div className="stats-hero-bg" />
        <div className="stats-hero-overlay" />
        <div className="container stats-hero-content">
          <div>
            <span className="tag">Mes statistiques</span>
            <h1 className="stats-hero-title">Suis ta <span className="pink-text">progression</span></h1>
            <p className="stats-hero-desc">Visualise tes efforts, tes calories et tes séances en un coup d'œil.</p>
          </div>
          <Link to="/dashboard" className="stats-back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Dashboard
          </Link>
        </div>
      </section>

      <div className="container stats-body">

        {/* KPIs */}
        <div className="stats-kpis">
          {[
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M12 4v16" strokeLinecap="round"/></svg>,
              label: 'Séances totales', val: totalSeances, suffix: '', color: '#e91e8c'
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2c0 0-6 4.5-6 9a6 6 0 0012 0c0-4.5-6-9-6-9z"/><path d="M12 12c0 0-2.5 1.5-2.5 3a2.5 2.5 0 005 0c0-1.5-2.5-3-2.5-3z" fill="currentColor" stroke="none" opacity=".5"/></svg>,
              label: 'Calories brûlées', val: totalCalories.toLocaleString(), suffix: ' kcal', color: '#ff5722', raw: true
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
              label: 'Minutes d\'effort', val: totalHeures, suffix: ' min', color: '#9c27b0'
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
              label: 'Jours membre', val: joursActif, suffix: 'j', color: '#00bcd4'
            },
          ].map((k, i) => (
            <div key={i} className="stats-kpi" style={{ '--kc': k.color }}>
              <div className="stats-kpi-icon">{k.icon}</div>
              <div className="stats-kpi-body">
                <span className="stats-kpi-val">{k.val}{k.suffix}</span>
                <span className="stats-kpi-label">{k.label}</span>
              </div>
              <div className="stats-kpi-glow" />
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="stats-charts">

          {/* Séances par mois */}
          <div className="stats-chart-card">
            <div className="stats-chart-head">
              <h3>Séances par mois</h3>
              <span className="stats-chart-badge">{totalSeances} total</span>
            </div>
            <div className="stats-chart-wrap">
              <Line
                data={{
                  labels: last6.map(d => d.label),
                  datasets: [{
                    data: seancesMois,
                    borderColor: '#e91e8c',
                    backgroundColor: 'rgba(233,30,140,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#e91e8c',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                  }]
                }}
                options={chartDefaults}
              />
            </div>
          </div>

          {/* Calories par mois */}
          <div className="stats-chart-card">
            <div className="stats-chart-head">
              <h3>Calories brûlées / mois</h3>
              <span className="stats-chart-badge">{totalCalories.toLocaleString()} kcal</span>
            </div>
            <div className="stats-chart-wrap">
              <Bar
                data={{
                  labels: last6.map(d => d.label),
                  datasets: [{
                    data: caloriesMois,
                    backgroundColor: 'rgba(233,30,140,0.7)',
                    borderRadius: 8,
                    hoverBackgroundColor: '#e91e8c',
                  }]
                }}
                options={chartDefaults}
              />
            </div>
          </div>

          {/* Répartition cours */}
          <div className="stats-chart-card stats-chart-card--small">
            <div className="stats-chart-head">
              <h3>Cours favoris</h3>
            </div>
            {catLabels.length > 0 ? (
              <>
                <div className="stats-chart-wrap stats-chart-wrap--donut">
                  <Doughnut
                    data={{
                      labels: catLabels,
                      datasets: [{
                        data: catData,
                        backgroundColor: ['#e91e8c','#c2185b','#9c27b0','#673ab7','#f06292','#d81b60'],
                        borderWidth: 0,
                        hoverOffset: 6,
                      }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#9a7a8a', font: { size: 11 }, padding: 12, usePointStyle: true } } }, cutout: '65%' }}
                  />
                </div>
              </>
            ) : (
              <div className="stats-empty">
                <span>🎯</span>
                <p>Réserve des cours pour voir tes statistiques ici !</p>
                <Link to="/cours-collectifs" className="stats-cta-btn">Voir les cours</Link>
              </div>
            )}
          </div>

          {/* Motivation card */}
          <div className="stats-chart-card stats-chart-card--motivation">
            <div className="stats-moti-bg" />
            <div className="stats-moti-content">
              <div className="stats-moti-emoji">
                {totalSeances >= 20 ? '🏆' : totalSeances >= 10 ? '🌟' : totalSeances >= 5 ? '💪' : '🚀'}
              </div>
              <h3>
                {totalSeances >= 20 ? 'Championne !' : totalSeances >= 10 ? 'Super forme !' : totalSeances >= 5 ? 'Continue !' : 'Lance-toi !'}
              </h3>
              <p>
                {totalSeances >= 20
                  ? `Incroyable ! ${totalSeances} séances au compteur. Tu es une vraie warrior.`
                  : totalSeances >= 10
                  ? `${totalSeances} séances déjà ! Tu es sur la bonne voie. Keep going !`
                  : totalSeances >= 5
                  ? `${totalSeances} séances — belle progression ! Chaque séance compte.`
                  : 'Commence ton aventure Move Like Her. Le premier pas est le plus important !'}
              </p>
              <div className="stats-moti-progress">
                <div className="stats-moti-bar" style={{ width: `${Math.min(100, (totalSeances / 20) * 100)}%` }} />
              </div>
              <span className="stats-moti-hint">{totalSeances}/20 séances pour le statut Champion</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
