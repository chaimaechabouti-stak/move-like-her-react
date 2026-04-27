import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { admin } from '../services/api'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import './AdminPages.css'
import './AdminDashboard.css'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
)

/* ── Compteur animé ── */
function CountUp({ to, duration = 1400, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const num = Number(String(to).replace(/\s/g, '').replace(',', '.'))
    if (!num || isNaN(num)) { setVal(to); return }
    let start = 0
    const step = num / (duration / 16)
    const run = () => {
      start = Math.min(start + step, num)
      setVal(Math.floor(start))
      if (start < num) ref.current = requestAnimationFrame(run)
    }
    ref.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(ref.current)
  }, [to, duration])
  return <>{prefix}{typeof val === 'number' ? val.toLocaleString('fr-MA') : val}{suffix}</>
}

/* ── Mini barchart CSS ── */
function MiniBar({ data = [], color = '#e91e8c', label = '' }) {
  const max = Math.max(...data, 1)
  return (
    <div className="adm-minibar">
      <p className="adm-minibar-label">{label}</p>
      <div className="adm-minibar-bars">
        {data.map((v, i) => (
          <div key={i} className="adm-minibar-col">
            <div className="adm-minibar-fill"
              style={{ '--h': `${Math.round((v / max) * 100)}%`, '--c': color, '--i': i }} />
          </div>
        ))}
      </div>
      <div className="adm-minibar-axis">
        {['L','M','M','J','V','S','D'].map((d,i) => <span key={i}>{d}</span>)}
      </div>
    </div>
  )
}

/* ── Donut chart CSS ── */
function Donut({ pct = 0, color = '#e91e8c', size = 84, stroke = 9 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const [drawn, setDrawn] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setDrawn(pct), 120)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="adm-donut">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#fce4f0" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - (drawn / 100) * circ}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)' }}
      />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: size * .2 + 'px', fontWeight: 800, fill: '#2d1a24', fontFamily: 'inherit' }}>
        {Math.round(drawn)}%
      </text>
    </svg>
  )
}

/* ── Hook visible ── */
function useVisible(threshold = 0.12) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, v]
}

/* ── Sparkline SVG ── */
function Sparkline({ data = [], color = '#e91e8c', w = 80, h = 32 }) {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="adm-sparkline">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`}
        fill={color} fillOpacity=".12" stroke="none" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [stats,    setStats]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [contacts, setContacts] = useState([])
  const [demandes, setDemandes] = useState([])
  const [kpiRef,  kpiVis]  = useVisible()
  const [ringRef, ringVis] = useVisible()
  const [barRef,  barVis]  = useVisible()

  useEffect(() => {
    admin.stats().then(setStats).catch(console.error).finally(() => setLoading(false))
    admin.contacts().then(res => {
      const arr = Array.isArray(res) ? res : (res.data ?? [])
      setContacts(arr.slice(0, 5))
    }).catch(() => {})
    admin.demandes().then(res => {
      const arr = Array.isArray(res) ? res : (res.data ?? [])
      setDemandes(arr.slice(0, 5))
    }).catch(() => {})
  }, [])

  const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  /* Données fictives pour les graphiques (simulent une semaine) */
  const sparkMembers     = [42, 47, 45, 52, 58, 61, stats?.users     ?? 0]
  const sparkInscriptions= [8,  11, 9,  14, 13, 16, stats?.inscriptions ?? 0]
  const sparkRevenus     = [1200,1500,1100,1800,1600,2100, stats?.revenus ?? 0]
  const barsInscrip      = [3, 5, 4, 7, 6, 8, 5]

  const MOIS = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc']

  // Données pour le graphique ligne (inscriptions + revenus par mois)
  const inscMoisLabels = stats?.inscriptions_mois?.map(m => `${MOIS[m.mois - 1]} ${m.annee}`) ?? []
  const inscMoisData   = stats?.inscriptions_mois?.map(m => m.total) ?? []
  const revMoisData    = stats?.inscriptions_mois?.map(m => m.revenus) ?? []

  // Données pour le graphique ligne (membres par mois)
  const membresMoisLabels = stats?.membres_mois?.map(m => `${MOIS[m.mois - 1]} ${m.annee}`) ?? []
  const membresMoisData   = stats?.membres_mois?.map(m => m.total) ?? []

  // Données pour le doughnut (répartition abonnements)
  const aboLabels = stats?.repartition_abos?.map(a => a.nom) ?? []
  const aboData   = stats?.repartition_abos?.map(a => a.total) ?? []
  const aboColors = ['#e91e8c', '#9c27b0', '#d81b60', '#f06292', '#ab47bc']

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { color: 'rgba(233,30,140,0.06)' }, ticks: { color: '#9c6b80', font: { size: 11 } } },
      y: { grid: { color: 'rgba(233,30,140,0.06)' }, ticks: { color: '#9c6b80', font: { size: 11 } }, beginAtZero: true },
    },
  }

  const tauxOccup = stats?.users && stats?.inscriptions
    ? Math.min(100, Math.round((stats.inscriptions / stats.users) * 100))
    : 0
  const tauxCoach = stats?.coaches && stats?.salles
    ? Math.min(100, Math.round((stats.coaches / (stats.salles * 3)) * 100))
    : 0

  const KPI_CARDS = stats ? [
    {
      label: 'Membres',
      value: stats.users ?? 0,
      suffix: '',
      trend: '+12%',
      trendUp: true,
      link: '/admin/utilisateurs',
      color: '#e91e8c',
      spark: sparkMembers,
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><circle cx="17" cy="7" r="3"/><path d="M21 21v-2a3 3 0 00-2-2.83"/></svg>,
    },
    {
      label: 'Inscriptions actives',
      value: stats.inscriptions ?? 0,
      suffix: '',
      trend: '+5%',
      trendUp: true,
      link: '/admin/inscriptions',
      color: '#9c27b0',
      spark: sparkInscriptions,
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
    },
    {
      label: 'Coaches actifs',
      value: stats.coaches ?? 0,
      suffix: '',
      trend: null,
      link: '/admin/coaches',
      color: '#d81b60',
      spark: [2,2,3,3,3,stats.coaches,stats.coaches],
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="8" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M19 8v6M16 11h6"/></svg>,
    },
    {
      label: 'Cours actifs',
      value: stats.cours ?? 0,
      suffix: '',
      trend: null,
      link: '/admin/cours',
      color: '#c2185b',
      spark: [4,4,5,5,6,stats.cours,stats.cours],
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    },
    {
      label: 'Salles',
      value: stats.salles ?? 0,
      suffix: '',
      trend: null,
      link: '/admin/salles',
      color: '#f06292',
      spark: [1,1,2,2,stats.salles,stats.salles,stats.salles],
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21V8l9-6 9 6v13"/><path d="M9 21v-6h6v6"/></svg>,
    },
    {
      label: 'Revenus (Dh)',
      value: Number(stats.revenus ?? 0),
      suffix: ' Dh',
      trend: null,
      link: '/admin/inscriptions',
      color: '#ab47bc',
      spark: sparkRevenus,
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="7" width="20" height="14" rx="3"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    },
  ] : []

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Tableau de bord</h1>
          <p className="adm-page-sub">{today.charAt(0).toUpperCase() + today.slice(1)}</p>
        </div>
        <div className="adm-dash-live">
          <span className="adm-live-dot" />
          Données en temps réel
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div
        ref={kpiRef}
        className={`adm-kpi-grid ${kpiVis ? 'is-visible' : ''}`}
      >
        {loading
          ? Array(6).fill(0).map((_, i) => <div key={i} className="adm-kpi-card adm-kpi-skeleton" style={{ '--ki': i }} />)
          : KPI_CARDS.map((c, i) => (
            <Link key={i} to={c.link} className="adm-kpi-card" style={{ '--c': c.color, '--ki': i }}>
              <div className="adm-kpi-shine" />
              <div className="adm-kpi-top">
                <div className="adm-kpi-icon">{c.icon}</div>
                {c.trend && (
                  <span className={`adm-kpi-trend ${c.trendUp ? 'is-up' : 'is-down'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    {c.trend}
                  </span>
                )}
              </div>
              <div className="adm-kpi-val">
                {kpiVis ? <CountUp to={c.value} suffix={c.suffix} duration={1200 + i * 80} /> : '0'}
              </div>
              <div className="adm-kpi-label">{c.label}</div>
              <div className="adm-kpi-spark">
                <Sparkline data={c.spark} color={c.color} />
              </div>
              <div className="adm-kpi-bar" />
            </Link>
          ))
        }
      </div>

      {/* ── DONUT + BARRES ── */}
      <div className="adm-metrics-row">

        {/* Taux & indicateurs */}
        <div ref={ringRef} className={`adm-metric-card adm-rings-card ${ringVis ? 'is-visible' : ''}`}>
          <div className="adm-metric-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <h3>Indicateurs clés</h3>
          </div>
          <div className="adm-rings-grid">
            {[
              { label: "Taux d'abonnement", pct: tauxOccup, color: '#e91e8c', desc: `${stats?.inscriptions ?? 0} actifs / ${stats?.users ?? 0} membres` },
              { label: 'Couverture coaches', pct: tauxCoach, color: '#9c27b0', desc: `${stats?.coaches ?? 0} coaches · ${stats?.salles ?? 0} salles` },
              { label: 'Cours disponibles',  pct: Math.min(100, Math.round(((stats?.cours ?? 0) / 20) * 100)), color: '#d81b60', desc: `${stats?.cours ?? 0} cours actifs` },
            ].map((r, i) => (
              <div key={i} className="adm-ring-item" style={{ '--delay': `${i * 80}ms` }}>
                <div className="adm-ring-donut">
                  <Donut pct={ringVis ? r.pct : 0} color={r.color} />
                </div>
                <p className="adm-ring-label">{r.label}</p>
                <p className="adm-ring-desc">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activité hebdomadaire */}
        <div ref={barRef} className={`adm-metric-card adm-bars-card ${barVis ? 'is-visible' : ''}`}>
          <div className="adm-metric-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            <h3>Inscriptions cette semaine</h3>
          </div>
          <div className="adm-barchart">
            {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map((d, i) => {
              const v = barsInscrip[i] ?? 0
              const max = Math.max(...barsInscrip, 1)
              const h = Math.round((v / max) * 100)
              return (
                <div key={i} className="adm-bar-col">
                  <span className="adm-bar-val">{v}</span>
                  <div className="adm-bar-track">
                    <div
                      className="adm-bar-fill"
                      style={{ '--bh': `${h}%`, '--bc': '#e91e8c', '--bi': i,
                        height: barVis ? `${h}%` : '0%' }}
                    />
                  </div>
                  <span className="adm-bar-day">{d}</span>
                </div>
              )
            })}
          </div>
          {/* Revenu highlight */}
          <div className="adm-revenue-row">
            <div className="adm-rev-item">
              <span className="adm-rev-dot" style={{ background: '#e91e8c' }} />
              <div>
                <span className="adm-rev-val">
                  {loading ? '—' : <CountUp to={Number(stats?.revenus ?? 0)} suffix=" Dh" duration={1600} />}
                </span>
                <span className="adm-rev-lbl">Revenus totaux</span>
              </div>
            </div>
            <div className="adm-rev-divider" />
            <div className="adm-rev-item">
              <span className="adm-rev-dot" style={{ background: '#9c27b0' }} />
              <div>
                <span className="adm-rev-val">
                  {loading ? '—' : <CountUp to={stats?.inscriptions ?? 0} suffix="" duration={1200} />}
                </span>
                <span className="adm-rev-lbl">Inscriptions actives</span>
              </div>
            </div>
            <div className="adm-rev-divider" />
            <div className="adm-rev-item">
              <span className="adm-rev-dot" style={{ background: '#d81b60' }} />
              <div>
                <span className="adm-rev-val">{tauxOccup}%</span>
                <span className="adm-rev-lbl">Taux d'occupation</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── GRAPHIQUES CHART.JS ── */}
      {!loading && stats && (
        <div className="adm-charts-grid">

          {/* Ligne : Inscriptions par mois */}
          <div className="adm-chart-card">
            <div className="adm-metric-head">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <h3>Inscriptions par mois</h3>
            </div>
            <div className="adm-chart-wrap">
              <Line
                data={{
                  labels: inscMoisLabels,
                  datasets: [{
                    label: 'Inscriptions',
                    data: inscMoisData,
                    borderColor: '#e91e8c',
                    backgroundColor: 'rgba(233,30,140,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#e91e8c',
                    pointRadius: 4,
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Barre : Revenus par mois */}
          <div className="adm-chart-card">
            <div className="adm-metric-head">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              <h3>Revenus par mois (Dh)</h3>
            </div>
            <div className="adm-chart-wrap">
              <Bar
                data={{
                  labels: inscMoisLabels,
                  datasets: [{
                    label: 'Revenus (Dh)',
                    data: revMoisData,
                    backgroundColor: 'rgba(156,39,176,0.7)',
                    borderColor: '#9c27b0',
                    borderWidth: 2,
                    borderRadius: 8,
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Ligne : Nouveaux membres */}
          <div className="adm-chart-card">
            <div className="adm-metric-head">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M19 8v6M16 11h6"/></svg>
              <h3>Nouveaux membres par mois</h3>
            </div>
            <div className="adm-chart-wrap">
              <Line
                data={{
                  labels: membresMoisLabels,
                  datasets: [{
                    label: 'Membres',
                    data: membresMoisData,
                    borderColor: '#d81b60',
                    backgroundColor: 'rgba(216,27,96,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#d81b60',
                    pointRadius: 4,
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Doughnut : Répartition abonnements */}
          <div className="adm-chart-card">
            <div className="adm-metric-head">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0110 10"/></svg>
              <h3>Répartition des abonnements</h3>
            </div>
            <div className="adm-chart-wrap adm-chart-wrap--donut">
              {aboData.length > 0 ? (
                <>
                  <Doughnut
                    data={{
                      labels: aboLabels,
                      datasets: [{
                        data: aboData,
                        backgroundColor: aboColors,
                        borderWidth: 2,
                        borderColor: '#fff',
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#2d1a24', font: { size: 12 }, padding: 16 } },
                        tooltip: { mode: 'index' },
                      },
                      cutout: '65%',
                    }}
                  />
                </>
              ) : (
                <div className="adm-chart-empty">Aucune donnée</div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ── ACTIVITÉ RÉCENTE ── */}
      <div className="adm-recent-grid">

        {/* Derniers messages */}
        <div className="adm-recent-card">
          <div className="adm-recent-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.7" style={{width:17,height:17,flexShrink:0}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <h3 className="adm-recent-title">Derniers messages</h3>
            <Link to="/admin/contacts" className="adm-recent-see-all">Voir tout</Link>
          </div>
          <div className="adm-recent-list">
            {contacts.length === 0 && <p className="adm-empty">Aucun message.</p>}
            {contacts.map(c => (
              <div key={c.id} className="adm-recent-item">
                <div className="adm-recent-avatar">{(c.nom?.[0] ?? 'M').toUpperCase()}</div>
                <div className="adm-recent-info">
                  <span className="adm-recent-name">{c.nom}</span>
                  <span className="adm-recent-sub">{c.sujet || c.email}</span>
                </div>
                <div className="adm-recent-right">
                  <span className={`adm-badge ${c.statut === 'nouveau' ? 'adm-badge-orange' : c.statut === 'lu' ? 'adm-badge-blue' : 'adm-badge-green'}`}>
                    {c.statut === 'nouveau' ? 'Nouveau' : c.statut === 'lu' ? 'Lu' : 'Traité'}
                  </span>
                  <span className="adm-recent-date">{c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR', {day:'2-digit',month:'short'}) : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières demandes */}
        <div className="adm-recent-card">
          <div className="adm-recent-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.7" style={{width:17,height:17,flexShrink:0}}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            <h3 className="adm-recent-title">Dernières demandes</h3>
            <Link to="/admin/demandes" className="adm-recent-see-all">Voir tout</Link>
          </div>
          <div className="adm-recent-list">
            {demandes.length === 0 && <p className="adm-empty">Aucune demande.</p>}
            {demandes.map(d => (
              <div key={d.id} className="adm-recent-item">
                <div className="adm-recent-avatar">{(d.prenom?.[0] ?? 'M').toUpperCase()}</div>
                <div className="adm-recent-info">
                  <span className="adm-recent-name">{d.prenom} {d.name}</span>
                  <span className="adm-recent-sub">{d.formule ? `Formule ${d.formule}` : d.email}</span>
                </div>
                <div className="adm-recent-right">
                  <span className={`adm-badge ${d.statut === 'nouveau' ? 'adm-badge-orange' : d.statut === 'inscrit' ? 'adm-badge-green' : d.statut === 'contacte' ? 'adm-badge-blue' : 'adm-badge-gray'}`}>
                    {d.statut === 'nouveau' ? 'Nouveau' : d.statut === 'inscrit' ? 'Inscrit' : d.statut === 'contacte' ? 'Contacté' : 'Annulé'}
                  </span>
                  <span className="adm-recent-date">{d.created_at ? new Date(d.created_at).toLocaleDateString('fr-FR', {day:'2-digit',month:'short'}) : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── DETAIL STATS TABLE ── */}
      <div className="adm-detail-grid">
        {[
          {
            title: 'Répartition membres',
            color: '#e91e8c',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>,
            rows: [
              { label: 'Total membres',     val: stats?.users       ?? 0,  color: '#e91e8c' },
              { label: 'Avec abonnement',   val: stats?.inscriptions ?? 0, color: '#9c27b0' },
              { label: 'Sans abonnement',   val: Math.max(0, (stats?.users ?? 0) - (stats?.inscriptions ?? 0)), color: '#c2185b' },
            ],
            total: stats?.users ?? 0,
          },
          {
            title: 'Infrastructure',
            color: '#9c27b0',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 21V8l9-6 9 6v13"/><path d="M9 21v-6h6v6"/></svg>,
            rows: [
              { label: 'Salles actives',  val: stats?.salles  ?? 0, color: '#d81b60' },
              { label: 'Cours actifs',    val: stats?.cours   ?? 0, color: '#e91e8c' },
              { label: 'Coaches actifs',  val: stats?.coaches ?? 0, color: '#9c27b0' },
            ],
            total: (stats?.salles ?? 0) + (stats?.cours ?? 0) + (stats?.coaches ?? 0),
          },
          {
            title: 'Plans d\'abonnement',
            color: '#d81b60',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
            rows: [
              { label: 'Plans disponibles', val: stats?.abonnements ?? 0, color: '#e91e8c' },
              { label: 'Inscriptions',      val: stats?.inscriptions ?? 0, color: '#9c27b0' },
              { label: 'Revenus générés',   val: `${Number(stats?.revenus ?? 0).toLocaleString('fr-MA')} Dh`, color: '#ab47bc', isText: true },
            ],
            total: null,
          },
        ].map((block, bi) => (
          <div key={bi} className="adm-detail-card" style={{ '--bc': block.color, '--bdi': bi }}>
            <div className="adm-detail-head">
              <div className="adm-detail-icon">{block.icon}</div>
              <h3 className="adm-detail-title">{block.title}</h3>
            </div>
            <div className="adm-detail-rows">
              {block.rows.map((r, ri) => {
                const pct = block.total && !r.isText
                  ? Math.min(100, Math.round((Number(r.val) / block.total) * 100))
                  : null
                return (
                  <div key={ri} className="adm-detail-row">
                    <div className="adm-detail-row-top">
                      <span className="adm-detail-row-label">{r.label}</span>
                      <span className="adm-detail-row-val" style={{ color: r.color }}>
                        {loading ? '—' : r.isText ? r.val : <CountUp to={Number(r.val)} duration={1200 + ri * 100} />}
                      </span>
                    </div>
                    {pct !== null && (
                      <div className="adm-detail-track">
                        <div className="adm-detail-fill"
                          style={{ '--w': `${pct}%`, '--rc': r.color }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {block.total !== null && (
              <div className="adm-detail-footer">
                <span>Total</span>
                <strong style={{ color: block.color }}>
                  {loading ? '—' : <CountUp to={block.total} duration={1400} />}
                </strong>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
