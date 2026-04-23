import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { stripe as stripeApi } from '../services/api'
import './PaiementSucces.css'

export default function PaiementSucces() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [visible, setVisible] = useState(false)
  const [abonnement, setAbonnement] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  /* Confirme le paiement côté backend dès l'arrivée sur cette page */
  useEffect(() => {
    if (!sessionId) return
    stripeApi.confirmSession(sessionId)
      .then(data => setAbonnement(data?.abonnement?.nom || null))
      .catch(() => {})
  }, [sessionId])

  return (
    <main className="ps-page">
      <div className={`ps-card ${visible ? 'ps-card--in' : ''}`}>

        {/* Cercle animé */}
        <div className="ps-circle">
          <svg viewBox="0 0 52 52" className="ps-checkmark">
            <circle className="ps-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="ps-checkmark__check" fill="none" d="M14 27l7 7 17-17"/>
          </svg>
        </div>

        <h1 className="ps-title">Paiement réussi !</h1>
        <p className="ps-desc">
          {abonnement
            ? <>Ton abonnement <strong>{abonnement}</strong> est maintenant actif.<br/></>
            : <>Ton abonnement Move Like Her est maintenant actif.<br/></>
          }
          Bienvenue dans la communauté 💪
        </p>

        {sessionId && (
          <p className="ps-ref">Référence : <code>{sessionId.slice(-12)}</code></p>
        )}

        <div className="ps-actions">
          <Link to="/dashboard" className="ps-btn-primary">
            Accéder à mon espace
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/" className="ps-btn-ghost">Retour à l'accueil</Link>
        </div>
      </div>

      {/* Confettis décoratifs */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="ps-confetti" style={{
          '--x': `${Math.random() * 100}%`,
          '--delay': `${i * 0.15}s`,
          '--color': ['#e91e8c','#f48fb1','#c2185b','#f06292'][i % 4],
        }} />
      ))}
    </main>
  )
}
