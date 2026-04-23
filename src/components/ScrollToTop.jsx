import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './ScrollToTop.css'

/* Reset scroll au changement de page */
export function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* Bouton flottant retour en haut */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`stt-btn ${visible ? 'stt-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Retour en haut"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
