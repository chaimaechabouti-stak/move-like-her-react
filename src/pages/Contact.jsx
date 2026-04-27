import { useState } from 'react'
import { Link } from 'react-router-dom'
import { contact as contactApi } from '../services/api'
import './Contact.css'

const SUJETS = [
  'Informations abonnements',
  'Réservation cours collectifs',
  'Coaching personnalisé',
  'Partenariat',
  'Réclamation',
  'Autre',
]

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState(null) // null | 'loading' | 'success' | 'error'

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setStatus('loading')
    try {
      await contactApi.envoyer(form)
      setStatus('success')
      setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' })
    } catch (err) {
      setStatus('error')
      if (err.errors) {
        const flat = {}
        Object.entries(err.errors).forEach(([k, msgs]) => { flat[k] = msgs[0] })
        setErrors(flat)
      }
    }
  }

  return (
    <div className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content container">
          <span className="sv-tag">Move Like Her · Contact</span>
          <h1 className="page-title">Écris-nous</h1>
          <div className="sv-hero-stats">
            <div><strong>24h</strong><span>temps de réponse</span></div>
            <div><strong>6</strong><span>clubs disponibles</span></div>
            <div><strong>100%</strong><span>à votre écoute</span></div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="contact-body">
        <div className="container contact-grid">

          {/* Infos */}
          <div className="contact-infos">
            <h2 className="contact-infos-title">On est là pour toi</h2>
            <p className="contact-infos-sub">
              Nos équipes en club et notre support en ligne sont disponibles pour répondre à toutes tes questions.
            </p>

            <div className="contact-info-list">
              {[
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.63 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.8a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
                  label: 'Téléphone',
                  val: '+212 0559320244',
                  sub: 'Lun–Sam · 9h–19h',
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                  label: 'E-mail',
                  val: 'Salles@movelikeher.ma',
                  sub: 'Réponse sous 24h',
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
                  label: 'Nos clubs',
                  val: '6 villes au Maroc',
                  sub: 'Casablanca, Rabat, Marrakech…',
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: 'Horaires',
                  val: '6h – 22h',
                  sub: 'Ouvert 7j/7',
                },
              ].map((item, i) => (
                <div key={i} className="contact-info-item">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <p className="contact-info-label">{item.label}</p>
                    <p className="contact-info-val">{item.val}</p>
                    <p className="contact-info-sub">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Réseaux */}
            <div className="contact-socials">
              <p className="contact-socials-title">Suis-nous</p>
              <div className="contact-socials-row">
                {['Instagram', 'Facebook', 'TikTok', 'YouTube'].map(r => (
                  <a key={r} href="#" className="contact-social-btn" aria-label={r}>{r[0]}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="contact-form-wrap">
            {status === 'success' ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3>Message envoyé !</h3>
                <p>Merci pour ton message. Notre équipe te répondra dans les plus brefs délais.</p>
                <button className="contact-submit-btn" onClick={() => setStatus(null)}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <h3 className="contact-form-title">Envoie-nous un message</h3>

                {status === 'error' && !Object.keys(errors).length && (
                  <div className="contact-alert" role="alert">
                    Une erreur est survenue. Réessaie ou contacte-nous par téléphone.
                  </div>
                )}

                <div className="contact-fields-row">
                  <div className="contact-field">
                    <label className="contact-label" htmlFor="c-nom">Nom complet *</label>
                    <input id="c-nom" type="text" className={`contact-input${errors.nom ? ' error' : ''}`}
                      placeholder="Votre Nom Complet"
                      value={form.nom} onChange={e => set('nom', e.target.value)}
                    />
                    {errors.nom && <p className="contact-error">{errors.nom}</p>}
                  </div>
                  <div className="contact-field">
                    <label className="contact-label" htmlFor="c-email">E-mail *</label>
                    <input id="c-email" type="email" className={`contact-input${errors.email ? ' error' : ''}`}
                      placeholder="Votre@email.com"
                      value={form.email} onChange={e => set('email', e.target.value)}
                    />
                    {errors.email && <p className="contact-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="contact-fields-row">
                  <div className="contact-field">
                    <label className="contact-label" htmlFor="c-tel">Téléphone</label>
                    <input id="c-tel" type="tel" className="contact-input"
                      placeholder="+212 6XX XX XX XX"
                      value={form.telephone} onChange={e => set('telephone', e.target.value)}
                    />
                  </div>
                  <div className="contact-field">
                    <label className="contact-label" htmlFor="c-sujet">Sujet</label>
                    <select id="c-sujet" className="contact-input"
                      value={form.sujet} onChange={e => set('sujet', e.target.value)}
                    >
                      <option value="">-- Choisir un sujet --</option>
                      {SUJETS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-label" htmlFor="c-message">Message *</label>
                  <textarea id="c-message"
                    className={`contact-input contact-textarea${errors.message ? ' error' : ''}`}
                    placeholder="Décris ta demande en quelques mots…"
                    rows={5}
                    value={form.message} onChange={e => set('message', e.target.value)}
                  />
                  {errors.message && <p className="contact-error">{errors.message}</p>}
                </div>

                <button type="submit" className="contact-submit-btn" disabled={status === 'loading'}>
                  {status === 'loading'
                    ? <span className="auth-spinner" aria-hidden="true" />
                    : <>
                        Envoyer le message
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
