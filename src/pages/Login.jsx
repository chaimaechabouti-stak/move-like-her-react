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
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-overlay" />
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card">
        {/* Logo / titre */}
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
          <h1 className="auth-title">Bon retour !</h1>
          <p className="auth-subtitle">Connecte-toi pour accéder à ton espace membre.</p>
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

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Adresse e-mail</label>
            <div className={`auth-input-wrap ${errors.email ? 'error' : ''}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="email" type="email" autoComplete="email"
                className="auth-input" placeholder="ton@email.com"
                value={form.email} onChange={e => set('email', e.target.value)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && <p id="email-error" className="auth-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="password">Mot de passe</label>
              <span className="auth-forgot">Mot de passe oublié ?</span>
            </div>
            <div className={`auth-input-wrap ${errors.password ? 'error' : ''}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password" type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                className="auth-input" placeholder="••••••••"
                value={form.password} onChange={e => set('password', e.target.value)}
                aria-describedby={errors.password ? 'pwd-error' : undefined}
              />
              <button type="button" className="auth-toggle-pwd" onClick={() => setShowPwd(s => !s)} aria-label={showPwd ? 'Masquer' : 'Afficher'}>
                {showPwd
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {errors.password && <p id="pwd-error" className="auth-error">{errors.password}</p>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? <span className="auth-spinner" aria-hidden="true" />
              : <>
                  Se connecter
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
            }
          </button>
        </form>

        <p className="auth-switch">
          Pas encore membre ?{' '}
          <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
