/**
 * Logo Move Like Her — Marque géométrique pro
 * Concept : lettre "M" stylisée avec un trait diagonal rose
 * + typographie custom
 */
export default function Logo({ size = 40, withText = true, className = '' }) {
  const h = size
  const w = size

  return (
    <div
      className={`mlh-logo-wrap ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none' }}
    >
      {/* ── Icône ── */}
      <svg
        width={w}
        height={h}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mlh-logo-icon"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mlhG" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f72585" />
            <stop offset="100%" stopColor="#c2185b" />
          </linearGradient>
          <linearGradient id="mlhGLight" x1="0" y1="0" x2="44" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff6bb5" />
            <stop offset="100%" stopColor="#f72585" />
          </linearGradient>
        </defs>

        {/* Fond carré arrondi sombre */}
        <rect width="44" height="44" rx="12" fill="#1a0a14" />

        {/*
          Forme principale : deux triangles imbriqués formant un "M" géométrique
          épuré — inspiré des logos de fitness haut de gamme
        */}

        {/* Triangle gauche — plein rose */}
        <path
          d="M8 34 L16 12 L22 26 Z"
          fill="url(#mlhG)"
        />

        {/* Triangle droit — rose clair */}
        <path
          d="M22 26 L28 12 L36 34 Z"
          fill="url(#mlhGLight)"
          opacity="0.9"
        />

        {/* Trait central blanc — accent féminin, lie les deux triangles */}
        <line
          x1="22" y1="13"
          x2="22" y2="34"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Ligne de base — ancrage */}
        <line
          x1="8" y1="34"
          x2="36" y2="34"
          stroke="url(#mlhGLight)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* ── Texte ── */}
      {withText && (
        <div className="mlh-logo-text">
          <div className="mlh-logo-name">
            <span className="mlh-move">MOVE</span>
            <span className="mlh-like"> LIKE </span>
            <span className="mlh-her">HER</span>
          </div>
          <div className="mlh-logo-tagline">Salle de sport · 100% Féminin</div>
        </div>
      )}
    </div>
  )
}
