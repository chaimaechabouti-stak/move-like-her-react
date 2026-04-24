import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    prenom: '', name: '', email: '',
    telephone: '', password: '', password_confirmation: '', cgu: false,
  })
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
    if (!form.cgu) { setErrors({ cgu: 'Accepte les CGU pour continuer.' }); return }
    setLoading(true)
    try {
      await register({
        name: form.name, prenom: form.prenom, email: form.email,
        telephone: form.telephone, password: form.password,
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
    <div className="auth-split">

      {/* ── Panneau gauche ── */}
      <div className="auth-panel-left">
        <div className="auth-panel-img" style={{ backgroundImage: 'url(/images/gym2.png)' }} />
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
            <p>"Rejoins une communauté<br/>de femmes qui se dépassent."</p>
            <div className="auth-panel-perks">
              {[
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>, text: '1 semaine d\'essai offerte' },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>, text: 'Accès à tous les cours collectifs' },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>, text: 'Coaches certifiées & bienveillantes' },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>, text: 'Espace 100% réservé aux femmes' },
              ].map((p, i) => (
                <div key={i} className="auth-perk">
                  <span className="auth-perk-icon">{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Panneau droit ── */}
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
              Déjà membre ? <Link to="/login">Se connecter</Link>
            </span>
          </div>

          <div className="auth-form-header">
            <h1>Rejoins le mouvement</h1>
            <p>Crée ton compte et commence dès aujourd'hui.</p>
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

            <div className="auth-row">
              <div className="auth-field">
                <label htmlFor="prenom">Prénom *</label>
                <div className={`auth-input-wrap ${errors.prenom ? 'has-error' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
                  <input id="prenom" type="text" autoComplete="given-name" placeholder="Fatima"
                    value={form.prenom} onChange={e => set('prenom', e.target.value)} />
                </div>
                {errors.prenom && <span className="auth-err-msg">{errors.prenom}</span>}
              </div>
              <div className="auth-field">
                <label htmlFor="name">Nom *</label>
                <div className={`auth-input-wrap ${errors.name ? 'has-error' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
                  <input id="name" type="text" autoComplete="family-name" placeholder="Alaoui"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                {errors.name && <span className="auth-err-msg">{errors.name}</span>}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="email">Adresse e-mail *</label>
              <div className={`auth-input-wrap ${errors.email ? 'has-error' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input id="email" type="email" autoComplete="email" placeholder="ton@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              {errors.email && <span className="auth-err-msg">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="telephone">Téléphone <span className="auth-optional">(optionnel)</span></label>
              <div className={`auth-input-wrap ${errors.telephone ? 'has-error' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.63 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.8a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <input id="telephone" type="tel" autoComplete="tel" placeholder="+212 6XX XX XX XX"
                  value={form.telephone} onChange={e => set('telephone', e.target.value)} />
              </div>
              {errors.telephone && <span className="auth-err-msg">{errors.telephone}</span>}
            </div>

            <div className="auth-row">
              <div className="auth-field">
                <label htmlFor="password">Mot de passe *</label>
                <div className={`auth-input-wrap ${errors.password ? 'has-error' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <input id="password" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Min. 8 caractères"
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
              <div className="auth-field">
                <label htmlFor="confirm">Confirmer *</label>
                <div className={`auth-input-wrap ${errors.password_confirmation ? 'has-error' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  <input id="confirm" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Répète ton mot de passe"
                    value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)} />
                </div>
                {errors.password_confirmation && <span className="auth-err-msg">{errors.password_confirmation}</span>}
              </div>
            </div>

            <label className="auth-cgu">
              <input type="checkbox" checked={form.cgu} onChange={e => set('cgu', e.target.checked)} />
              <span>J'accepte les <Link to="/mentions-legales">CGU</Link> et la <Link to="/mentions-legales">politique de confidentialité</Link> de Move Like Her.</span>
            </label>
            {errors.cgu && <span className="auth-err-msg">{errors.cgu}</span>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : <>Créer mon compte <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>

          <p className="auth-bottom-switch">
            Déjà membre ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>

    </div>
  )
}
