import { useState, useEffect } from 'react'
import { salles } from '../data/courses'
import './MapModal.css'

function mapUrl(s) {
  const delta = 0.012
  const bbox = `${s.lng - delta},${s.lat - delta},${s.lng + delta},${s.lat + delta}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${s.lat},${s.lng}`
}

function osmLink(s) {
  return `https://www.openstreetmap.org/?mlat=${s.lat}&mlon=${s.lng}#map=15/${s.lat}/${s.lng}`
}

export default function MapModal({ onClose }) {
  const [active, setActive] = useState(salles[0])

  /* Fermer avec Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="mm-backdrop" onClick={onClose}>
      <div className="mm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="mm-header">
          <div className="mm-header-left">
            <div className="mm-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div>
              <h2 className="mm-title">Nos salles</h2>
              <p className="mm-sub">{salles.length} clubs au Maroc — 100% féminin</p>
            </div>
          </div>
          <button className="mm-close" onClick={onClose} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="mm-body">

          {/* Liste salles */}
          <div className="mm-list">
            {salles.map(s => (
              <button
                key={s.id}
                className={`mm-item ${active.id === s.id ? 'active' : ''}`}
                onClick={() => setActive(s)}
              >
                <div className="mm-item-num">{s.id}</div>
                <div className="mm-item-info">
                  <span className="mm-item-city">{s.city}</span>
                  <span className="mm-item-addr">{s.address}</span>
                  <span className="mm-item-hours">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {s.hours}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Carte */}
          <div className="mm-map-wrap">
            <div className="mm-map-badge">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              {active.city} — {active.name}
            </div>
            <iframe
              key={active.id}
              title={`Carte ${active.city}`}
              src={mapUrl(active)}
              className="mm-iframe"
              loading="lazy"
              allowFullScreen
            />
            <a
              href={osmLink(active)}
              target="_blank"
              rel="noopener noreferrer"
              className="mm-open-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Ouvrir dans Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
