import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { salles as sallesApi } from '../services/api'
import { SkeletonGrid } from '../components/Skeleton'
import SallesMap from '../components/SallesMap'
import './Salles.css'

const services = [
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M12 4v16" strokeLinecap="round"/></svg>, title: 'Zone Cardio', desc: 'Tapis, vélos, elliptiques — tout pour brûler des calories.' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, title: 'Zone Musculation', desc: 'Machines et poids libres adaptés à la morphologie féminine.' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Cours collectifs', desc: 'Studio climatisé avec son surround pour chaque séance.' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 22V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><path d="M2 22h20"/><path d="M10 22V16h4v6"/></svg>, title: 'Vestiaires VIP', desc: 'Casiers sécurisés, douches chaudes, produits offerts.' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>, title: 'Espace détente', desc: 'Pour souffler, discuter et savourer l\'après-séance.' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01M8 6h8M8 10h8M8 14h4" strokeLinecap="round"/></svg>, title: 'WiFi & App', desc: 'Connecte-toi à notre app pour réserver et suivre tes cours.' },
]

/* Coordonnées GPS fixes par ville pour la carte */
const GPS = {
  'Casablanca': { lat: 33.5892, lng: -7.6114 },
  'Rabat':      { lat: 33.9909, lng: -6.8516 },
  'Marrakech':  { lat: 31.6340, lng: -8.0089 },
  'Fès':        { lat: 33.9906, lng: -5.0131 },
  'Tanger':     { lat: 35.7595, lng: -5.8340 },
  'Agadir':     { lat: 30.4278, lng: -9.5981 },
}

function toSalle(s) {
  const city = s.ville?.nom || s.city || ''
  return {
    ...s,
    city,
    name:    s.nom    || s.name    || '',
    address: s.adresse || s.address || '',
    hours:   s.horaires || s.hours  || '',
    image:   s.image_url || s.image  || '',
    lat:     GPS[city]?.lat,
    lng:     GPS[city]?.lng,
  }
}

export default function Salles() {
  const [salles, setSalles]     = useState([])
  const [activeCity, setActiveCity] = useState('Toutes')
  const [activeMap, setActiveMap]   = useState(null)
  const [loadingSalles, setLoadingSalles] = useState(true)

  useEffect(() => {
    sallesApi.list().then(data => {
      const arr = Array.isArray(data) ? data : (data.data ?? [])
      const mapped = arr.map(toSalle)
      setSalles(mapped)
      if (mapped.length) setActiveMap(mapped[0])
    }).catch(() => {}).finally(() => setLoadingSalles(false))
  }, [])

  const cities   = ['Toutes', ...new Set(salles.map(s => s.city))]
  const filtered = activeCity === 'Toutes' ? salles : salles.filter(s => s.city === activeCity)

  return (
    <main className="page-salles">

      {/* ── HERO ── */}
      <section className="salles-hero">
        <div className="salles-hero-overlay" />
        <div className="salles-hero-content container">
          <span className="sv-tag">Move Like Her · Nos Salles</span>
          <h1 className="salles-hero-title">Trouve ta salle <span>Move Like Her</span></h1>
          <div className="sv-hero-stats">
            <div><strong>6</strong><span>clubs au Maroc</span></div>
            <div><strong>7j/7</strong><span>ouvert</span></div>
            <div><strong>100%</strong><span>féminin</span></div>
            <div><strong>5000+</strong><span>membres</span></div>
          </div>
        </div>
      </section>

      {/* ── SALLES ── */}
      <section className="salles-body">
        <div className="container">

          {/* Filtres */}
          <div className="salles-filters reveal">
            {cities.map(c => (
              <button
                key={c}
                className={`salles-filter-btn ${activeCity === c ? 'active' : ''}`}
                onClick={() => setActiveCity(c)}
              >
                {c !== 'Toutes' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                )}
                {c}
              </button>
            ))}
          </div>

          {/* Grille */}
          <div className="salles-grid reveal reveal-delay-2">
            {loadingSalles
              ? <SkeletonGrid count={6} height={320} />
              : filtered.map(s => (
              <div key={s.id} className="salle-card">
                <div className="salle-img-wrap">
                  <div className="salle-img" style={{ backgroundImage: `url(${s.image})` }} />
                  <div className="salle-img-overlay" />
                  <div className="salle-city-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    {s.city}
                  </div>
                  <div className="salle-hours-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {s.hours}
                  </div>
                </div>
                <div className="salle-body">
                  <h3 className="salle-name">{s.name}</h3>
                  <p className="salle-address">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    {s.address}
                  </p>
                  <div className="salle-tags">
                    {['Cardio', 'Musculation', 'Cours collectifs', 'Vestiaires'].map(sv => (
                      <span key={sv} className="salle-tag">{sv}</span>
                    ))}
                  </div>
                  <Link to={`/salles/${s.city.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}`} className="salle-btn">
                    Découvrir cette salle
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARTE LEAFLET ── */}
      <section className="salles-map-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Localisation</span>
            <h2 className="section-title">Trouve-nous <span className="pink-text">sur la carte</span></h2>
            <p className="section-subtitle">Clique sur un marqueur pour voir les infos de la salle.</p>
          </div>

          <div className="salles-map-layout">
            {/* Liste cliquable */}
            <div className="salles-map-list">
              {salles.map(s => (
                <button
                  key={s.id}
                  className={`salles-map-item ${activeMap?.id === s.id ? 'active' : ''}`}
                  onClick={() => setActiveMap(s)}
                >
                  <div className="smi-pin">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                  </div>
                  <div className="smi-info">
                    <span className="smi-city">{s.city}</span>
                    <span className="smi-address">{s.address}</span>
                    <span className="smi-hours">{s.hours}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Carte Leaflet interactive */}
            <div className="salles-map-frame-wrap">
              {salles.length > 0 && (
                <SallesMap
                  salles={salles}
                  selectedId={activeMap?.id}
                  onSelect={s => setActiveMap(s)}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Dans chaque salle</span>
            <h2 className="section-title">Un espace <span className="pink-text">pensé pour toi</span></h2>
          </div>
          <div className="services-grid reveal reveal-delay-2">
            {services.map(s => (
              <div key={s.title} className="service-card">
                <div className="serv-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── GALERIE ── */}
      <section className="salles-galerie">
        <div className="container">
          <div className="section-header reveal">
            <span className="tag">Ambiance</span>
            <h2 className="section-title">Nos <span className="pink-text">espaces</span></h2>
            <p className="section-subtitle">Un aperçu de l'univers Move Like Her</p>
          </div>
          <div className="galerie-grid reveal reveal-delay-1">
            {[
              { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop', label: 'Zone Cardio' },
              { src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop', label: 'Cours collectif' },
              { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&fit=crop', label: 'Zone Musculation' },
              { src: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80&fit=crop', label: 'Studio de danse' },
              { src: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80&fit=crop', label: 'Espace détente' },
              { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&fit=crop', label: 'Coaching perso' },
            ].map((p, i) => (
              <div key={i} className={`galerie-item galerie-item-${i}`}>
                <img src={p.src} alt={p.label} loading="lazy" />
                <div className="galerie-overlay">
                  <span>{p.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
