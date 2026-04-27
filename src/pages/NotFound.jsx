import { Link } from 'react-router-dom'
import logoImg from '../assets/logo.jpg'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="nf-page">
      <div className="nf-bg" />
      <div className="nf-overlay" />
      <div className="nf-orb nf-orb-1" />
      <div className="nf-orb nf-orb-2" />

      <div className="nf-content">
        <div className="nf-code">
          <span className="nf-4">4</span>
          <span className="nf-0">
            <img src={logoImg} alt="" className="nf-logo-img" aria-hidden="true" />
          </span>
          <span className="nf-4">4</span>
        </div>

        <h1 className="nf-title">Page introuvable</h1>
        <p className="nf-desc">
          Oops ! La page que tu cherches n'existe pas ou a été déplacée.<br />
          Pas de panique — retrouve ton chemin ci-dessous.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Retour à l'accueil
          </Link>
          <Link to="/salles" className="nf-btn-outline">
            Trouver une salle
          </Link>
        </div>

        <div className="nf-links">
          <Link to="/concept">Le Concept</Link>
          <Link to="/cours-collectifs">Cours</Link>
          <Link to="/coaching">Coaching</Link>
          <Link to="/abonnements">Abonnements</Link>
        </div>
      </div>
    </div>
  )
}
