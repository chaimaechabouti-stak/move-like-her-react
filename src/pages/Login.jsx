import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      navigate(res.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length) {
        const flat = {}
        Object.entries(err.errors).forEach(([k, msgs]) => { flat[k] = msgs[0] })
        setErrors(flat)
      } else {
        setErrors({ general: err.message || 'Identifiants incorrects.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">

      {/* ── Panneau gauche — image + branding ── */}
      <div className="auth-panel-left">
        <div className="auth-panel-img" style={{ backgroundImage: 'url(/images/gym4.png)' }} />
        <div className="auth-panel-overlay" />
        <div className="auth-panel-content">
          <Link to="/" className="auth-brand">
            <div className="auth-brand-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <polygon points="20,4 36,34 4,34" fill="none" stroke="#e91e8c" strokeWidth="2.5"/>
                <polygon points="20,12 30,28 10,28" fill="#e91e8c" opacity="0.85"/>
              </svg>
            </div>
            <div>
              <span className="auth-brand-name">MOVE LIKE HER</span>
              <span className="auth-brand-tagline">Salle de sport · 100% féminin</span>
            </div>
          </Link>
          <div className="auth-panel-quote">
            <p>"Chaque séance te rapproche<br/>de la meilleure version de toi."</p>
            <div className="auth-panel-stats">
              <div><strong>5 000+</strong><span>membres actives</span></div>
              <div><strong>6</strong><span>villes au Maroc</span></div>
              <div><strong>15+</strong><span>cours collectifs</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="auth-panel-right">
        <div className="auth-form-wrap">

          <div className="auth-top-nav">
            <Link to="/" className="auth-back-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Retour au site
            </Link>
            <span className="auth-top-switch">
              Pas encore membre ? <Link to="/register">S'inscrire</Link>
            </span>
          </div>

          <div className="auth-form-header">
            <h1>Bon retour</h1>
            <p>Connecte-toi pour accéder à ton espace membre.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div className="auth-alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errors.general}
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Adresse e-mail</label>
              <div className={`auth-input-wrap ${errors.email ? 'has-error' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input id="email" type="email" autoComplete="email"
                  placeholder="ton@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              {errors.email && <span className="auth-err-msg">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password">Mot de passe</label>
                <span className="auth-forgot">Mot de passe oublié ?</span>
              </div>
              <div className={`auth-input-wrap ${errors.password ? 'has-error' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input id="password" type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password" placeholder="••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(s => !s)}>
                  {showPwd
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <span className="auth-err-msg">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : <>Se connecter <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>

          <p className="auth-bottom-switch">
            Pas encore membre ? <Link to="/register">Créer un compte gratuitement</Link>
          </p>
        </div>
      </div>

    </div>
  )
}
