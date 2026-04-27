import logoImg from '../assets/logo.jpg'

export default function Logo({ size = 40, withText = true, className = '' }) {
  return (
    <div
      className={`mlh-logo-wrap ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}
    >
      {/* ── Icône ── */}
      <img
        src={logoImg}
        alt="Move Like Her"
        width={size}
        height={size}
        className="mlh-logo-icon"
        style={{ borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
        aria-hidden="true"
      />

      {/* ── Texte ── */}
      {withText && (
        <div className="mlh-logo-text">
          <div className="mlh-logo-name">
            <span className="mlh-move">MOVE</span>
            <span className="mlh-like"> LIKE </span>
            <span className="mlh-her">HER</span>
          </div>
          <div className="mlh-logo-tagline">Salle de sport &nbsp;·&nbsp; 100% Féminin</div>
        </div>
      )}
    </div>
  )
}
