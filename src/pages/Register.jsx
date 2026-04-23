import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    prenom: '', name: '', email: '',
    telephone: '', password: '', password_confirmation: '',
    cgu: false,
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!form.cgu) {
      setErrors({ cgu: 'Accepte les CGU pour continuer.' })
      return
    }

    setLoading(true)
    try {
      await register({
        name:                  form.name,
        prenom:                form.prenom,
        email:                 form.email,
        telephone:             form.telephone,
        password:              form.password,
        password_confirmation: form.password_confirmation,
      })
      navigate('/dashboard')
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length) {
        const flat = {}
        Object.entries(err.errors).forEach(([k, msgs]) => { flat[k] = msgs[0] })
        setErrors(flat)
      } else {
        setErrors({ general: err.message || 'Une erreur est survenue.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-overlay" />
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo-link">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <polygon points="20,4 36,34 4,34" fill="none" stroke="#e91e8c" strokeWidth="2.5"/>
                <polygon points="20,12 30,28 10,28" fill="#e91e8c" opacity="0.7"/>
              </svg>
            </div>
            <span className="auth-logo-text">Move Like Her</span>
          </Link>
          <h1 className="auth-title">Rejoins le mouvement</h1>
          <p className="auth-subtitle">Crée ton compte et commence dès aujourd'hui.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="auth-alert" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {errors.general}
            </div>
          )}

          {/* Prénom / Nom */}
          <div className="auth-fields-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="prenom">Prénom</label>
              <div className={`auth-input-wrap ${errors.prenom ? 'error' : ''}`}>
                <input id="prenom" type="text" autoComplete="given-name"
                  className="auth-input" placeholder="Fatima"
                  value={form.prenom} onChange={e => set('prenom', e.target.value)}
                  style={{ paddingLeft: '0.9rem' }}
                />
              </div>
              {errors.prenom && <p className="auth-error">{errors.prenom}</p>}
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">Nom</label>
              <div className={`auth-input-wrap ${errors.name ? 'error' : ''}`}>
                <input id="name" type="text" autoComplete="family-name"
                  className="auth-input" placeholder="Alaoui"
                  value={form.name} onChange={e => set('name', e.target.value)}
                  style={{ paddingLeft: '0.9rem' }}
                />
              </div>
              {errors.name && <p className="auth-error">{errors.name}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Adresse e-mail</label>
            <div className={`auth-input-wrap ${errors.email ? 'error' : ''}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input id="email" type="email" autoComplete="email"
                className="auth-input" placeholder="ton@email.com"
                value={form.email} onChange={e => set('email', e.target.value)}
              />
            </div>
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="telephone">Téléphone <span style={{opacity:0.4}}>(optionnel)</span></label>
            <div className={`auth-input-wrap ${errors.telephone ? 'error' : ''}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.63 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.8a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <input id="telephone" type="tel" autoComplete="tel"
                className="auth-input" placeholder="+212 6XX XX XX XX"
                value={form.telephone} onChange={e => set('telephone', e.target.value)}
              />
            </div>
            {errors.telephone && <p className="auth-error">{errors.telephone}</p>}
          </div>

          {/* Mot de passe */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Mot de passe</label>
            <div className={`auth-input-wrap ${errors.password ? 'error' : ''}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input id="password" type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                className="auth-input" placeholder="Min. 8 caractères"
                value={form.password} onChange={e => set('password', e.target.value)}
              />
              <button type="button" className="auth-toggle-pwd" onClick={() => setShowPwd(s => !s)} aria-label={showPwd ? 'Masquer' : 'Afficher'}>
                {showPwd
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          {/* Confirmation */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="confirm">Confirmer le mot de passe</label>
            <div className={`auth-input-wrap ${errors.password_confirmation ? 'error' : ''}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <input id="confirm" type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                className="auth-input" placeholder="Répète ton mot de passe"
                value={form.password_confirmation}
                onChange={e => set('password_confirmation', e.target.value)}
              />
            </div>
            {errors.password_confirmation && <p className="auth-error">{errors.password_confirmation}</p>}
          </div>

          {/* CGU */}
          <div className="auth-field">
            <label className="auth-checkbox-wrap">
              <input type="checkbox" checked={form.cgu} onChange={e => set('cgu', e.target.checked)} />
              <span>
                J'accepte les <Link to="/mentions-legales">CGU</Link> et la{' '}
                <Link to="/mentions-legales">politique de confidentialité</Link> de Move Like Her.
              </span>
            </label>
            {errors.cgu && <p className="auth-error">{errors.cgu}</p>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? <span className="auth-spinner" aria-hidden="true" />
              : <>
                  Créer mon compte
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
            }
          </button>
        </form>

        <p className="auth-switch">
          Déjà membre ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
