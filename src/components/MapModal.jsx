import { useState, useEffect } from 'react'
import { salles } from '../data/courses'
import SallesMap from './SallesMap'
import './MapModal.css'

export default function MapModal({ onClose }) {
  const [active, setActive] = useState(salles[0])

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

          {/* Carte Leaflet */}
          <div className="mm-map-wrap">
            <SallesMap
              salles={salles}
              selectedId={active.id}
              onSelect={s => setActive(s)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
