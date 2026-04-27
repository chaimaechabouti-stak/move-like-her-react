import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { demandes } from '../services/api'
import './Logo.css'
import './Footer.css'

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.12 8.12 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
  </svg>
)

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'error' | 'success'
  const [msg, setMsg] = useState('')

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('error'); setMsg('Saisis ton adresse e-mail.'); return
    }
    if (!isValidEmail(email)) {
      setStatus('error'); setMsg('Adresse e-mail invalide.'); return
    }
    try {
      await demandes.envoyer({ email, source: 'newsletter' })
      setStatus('success')
      setMsg('Merci ! Tu es bien inscrite.')
      setEmail('')
      setTimeout(() => { setStatus(null); setMsg('') }, 4000)
    } catch {
      setStatus('error')
      setMsg('Une erreur est survenue, réessaie.')
    }
  }

  return (
    <div className="fv2-newsletter">
      <p>Newsletter</p>
      <form className="fv2-nl-form" onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus(null); setMsg('') }}
          placeholder="Ton e-mail"
          className={`fv2-nl-input${status ? ` ${status}` : ''}`}
          aria-label="Adresse e-mail pour la newsletter"
          aria-describedby="nl-feedback"
        />
        <button
          type="submit"
          className="fv2-nl-btn"
          aria-label="S'inscrire à la newsletter"
          disabled={status === 'success'}
        >
          {status === 'success'
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
        </button>
      </form>
      {msg && (
        <p id="nl-feedback" className={`fv2-nl-feedback ${status}`} role="status" aria-live="polite">
          {status === 'error'
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          }
          {msg}
        </p>
      )}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="footer-v2">

      {/* Décoration haut */}
      <div className="fv2-top-deco">
        <div className="fv2-deco-orb fv2-deco-orb-1" />
        <div className="fv2-deco-orb fv2-deco-orb-2" />
        <div className="fv2-deco-line" />
      </div>


      {/* Corps principal */}
      <div className="container fv2-body">
        <div className="fv2-grid">

          {/* Colonne brand */}
          <div className="fv2-brand">
            <Link to="/" className="fv2-logo-link">
              <Logo size={42} withText={true} />
            </Link>
            <p className="fv2-desc">
              La première salle de sport 100% féminine au Maroc. Un espace sécurisé, bienveillant et premium pensé uniquement pour les femmes.
            </p>

            {/* Réseaux sociaux */}
            <div className="fv2-socials">
              <a href="#" className="fv2-social" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" className="fv2-social" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="fv2-social" aria-label="TikTok"><TikTokIcon /></a>
              <a href="#" className="fv2-social" aria-label="YouTube"><YoutubeIcon /></a>
            </div>

            {/* App stores */}
            <div className="fv2-apps">
              <div className="fv2-app-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" className="fv2-app-icon">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.78M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <span className="fv2-app-sub">Disponible sur</span>
                  <span className="fv2-app-name">App Store</span>
                </div>
              </div>
              <div className="fv2-app-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" className="fv2-app-icon">
                  <path d="M3.18 23.71c.26.15.56.22.87.2a1.6 1.6 0 0 0 .8-.23L17.4 16.6l-3.09-3.1-11.13 10.21zM.5 1.41A1.57 1.57 0 0 0 .17 2.4v19.22a1.56 1.56 0 0 0 .33.97l.09.09 10.77-10.77v-.25L.59 1.32.5 1.41zM22.42 10.42l-3.1-1.77-3.43 3.43 3.43 3.43 3.13-1.79a1.59 1.59 0 0 0 0-3.3zM3.18.3L14.31 10.5l-3.09 3.08L.98.45A1.6 1.6 0 0 1 3.18.3z"/>
                </svg>
                <div>
                  <span className="fv2-app-sub">Disponible sur</span>
                  <span className="fv2-app-name">Google Play</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="fv2-col">
            <h4 className="fv2-col-title">Navigation</h4>
            <ul className="fv2-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/concept">Notre Concept</Link></li>
              <li><Link to="/cours-collectifs">Cours Collectifs</Link></li>
              <li><Link to="/salles">Nos Salles</Link></li>
              <li><Link to="/coaching">Coaching</Link></li>
              <li><Link to="/abonnements">Abonnements</Link></li>
            </ul>
          </div>

          {/* Nos salles */}
          <div className="fv2-col">
            <h4 className="fv2-col-title">Nos Clubs</h4>
            <ul className="fv2-links">
              {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'].map(city => (
                <li key={city}>
                  <Link to="/salles">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="fv2-link-pin">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="fv2-col">
            <h4 className="fv2-col-title">Contact</h4>
            <ul className="fv2-contact-list">
              <li>
                <div className="fv2-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                </div>
                <span>Maroc — 6 villes</span>
              </li>
              <li>
                <div className="fv2-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span>+212 0559320244</span>
              </li>
              <li>
                <div className="fv2-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <span>Salles@movelikeher.ma</span>
              </li>
              <li>
                <div className="fv2-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <span>Ouvert 7j/7 · 6h–22h</span>
              </li>
            </ul>

            {/* Newsletter */}
            <Newsletter />
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="fv2-bottom">
        <div className="container fv2-bottom-inner">
          <p className="fv2-copy">© 2026 Move Like Her — Tous droits réservés.</p>
          <div className="fv2-bottom-links">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">CGU</a>
          </div>
          <p className="fv2-made">Fait avec ♥ pour les femmes du Maroc</p>
        </div>
      </div>
    </footer>
  )
}
