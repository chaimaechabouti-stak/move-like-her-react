import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { auth as authApi, abonnements as aboApi } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import './Profil.css'

export default function Profil() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    prenom:    user?.prenom    ?? '',
    name:      user?.name      ?? '',
    email:     user?.email     ?? '',
    telephone: user?.telephone ?? '',
  })
  const [pwd, setPwd] = useState({ current: '', nouveau: '', confirm: '' })
  const [saving, setSaving]       = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)
  const [toast, setToast]         = useState(null)
  const [inscription, setInscription] = useState(null)
  const [showPwd, setShowPwd]     = useState({ current: false, nouveau: false, confirm: false })

  useEffect(() => {
    aboApi.monAbonnement().then(setInscription).catch(() => {})
  }, [])

  function showToast(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleSaveInfo(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await authApi.updateProfil({ prenom: form.prenom, name: form.name, email: form.email, telephone: form.telephone })
      showToast('Profil mis à jour !', true)
    } catch {
      showToast('Erreur lors de la mise à jour.', false)
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePwd(e) {
    e.preventDefault()
    if (pwd.nouveau !== pwd.confirm) { showToast('Les mots de passe ne correspondent pas.', false); return }
    if (pwd.nouveau.length < 8) { showToast('Minimum 8 caractères.', false); return }
    setSavingPwd(true)
    try {
      await authApi.updateProfil({
        current_password:      pwd.current,
        password:              pwd.nouveau,
        password_confirmation: pwd.confirm,
      })
      setPwd({ current: '', nouveau: '', confirm: '' })
      showToast('Mot de passe modifié !', true)
    } catch (e) {
      showToast(e?.message ?? 'Mot de passe actuel incorrect.', false)
    } finally {
      setSavingPwd(false)
    }
  }

  const initials = `${user?.prenom?.[0] ?? ''}${user?.name?.[0] ?? ''}`.toUpperCase()

  const dateFin = inscription?.date_fin ? new Date(inscription.date_fin) : null
  const joursRaw = dateFin ? Math.ceil((dateFin - new Date()) / (1000 * 60 * 60 * 24)) : null
  const jours = joursRaw !== null ? Math.max(0, joursRaw) : null
  const expired = dateFin && joursRaw !== null && joursRaw <= 0

  return (
    <main className="profil-page">

      {toast && (
        <div className={`profil-toast ${toast.ok ? 'profil-toast--ok' : 'profil-toast--err'}`}>
          {toast.ok
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* ── HERO ── */}
      <div className="profil-hero">
        <div className="profil-hero-bg" />
        <div className="profil-hero-overlay" />
        <div className="container profil-hero-content">
          <div className="profil-avatar-wrap">
            <div className="profil-avatar">{initials}</div>
            <div className="profil-avatar-ring" />
          </div>
          <div className="profil-hero-info">
            <div className="profil-hero-meta">
              <span className="profil-hero-tag">Membre Move Like Her</span>
            </div>
            <h1 className="profil-hero-name">{user?.prenom} {user?.name}</h1>
            <p className="profil-hero-email">{user?.email}</p>
            {inscription && !expired && (
              <div className="profil-hero-abo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span>{inscription.abonnement?.nom}</span>
                {jours !== null && <span className="profil-hero-days">{jours}j restants</span>}
              </div>
            )}
          </div>
          <button className="profil-back-btn" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Dashboard
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="container profil-body">

        {/* Abonnement actif (si présent) */}
        {inscription && (
          <div className={`profil-abo-banner ${expired ? 'expired' : jours !== null && jours <= 7 ? 'warn' : 'active'}`}>
            <div className="profil-abo-icon">
              {expired
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              }
            </div>
            <div className="profil-abo-text">
              <strong>{inscription.abonnement?.nom ?? 'Abonnement'}</strong>
              <span>
                {expired
                  ? 'Ton abonnement a expiré'
                  : dateFin
                    ? `Expire le ${dateFin.toLocaleDateString('fr-FR')} · ${jours}j restants`
                    : 'Abonnement actif'
                }
              </span>
            </div>
            <Link to="/abonnements" className="profil-abo-btn">
              {expired ? 'Renouveler' : 'Gérer'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        )}

        {/* Infos personnelles */}
        <div className="profil-card">
          <div className="profil-card-head">
            <div className="profil-card-head-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
            </div>
            <div>
              <h2>Informations personnelles</h2>
              <p>Modifie ton nom, email et téléphone</p>
            </div>
          </div>
          <form className="profil-form" onSubmit={handleSaveInfo}>
            <div className="profil-form-row">
              <div className="profil-field">
                <label>Prénom</label>
                <input value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} placeholder="Prénom" required />
              </div>
              <div className="profil-field">
                <label>Nom</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nom" required />
              </div>
            </div>
            <div className="profil-form-row">
              <div className="profil-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" required />
              </div>
              <div className="profil-field">
                <label>Téléphone</label>
                <input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} placeholder="+212 6XX XX XX XX" />
              </div>
            </div>
            <button className="profil-save-btn" type="submit" disabled={saving}>
              {saving
                ? <><span className="profil-spinner" />Enregistrement…</>
                : <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Enregistrer les modifications
                  </>
              }
            </button>
          </form>
        </div>

        {/* Mot de passe */}
        <div className="profil-card">
          <div className="profil-card-head">
            <div className="profil-card-head-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div>
              <h2>Changer le mot de passe</h2>
              <p>Minimum 8 caractères</p>
            </div>
          </div>
          <form className="profil-form" onSubmit={handleSavePwd}>
            <div className="profil-field profil-field--pwd">
              <label>Mot de passe actuel</label>
              <div className="profil-pwd-wrap">
                <input type={showPwd.current ? 'text' : 'password'} value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" required />
                <button type="button" className="profil-pwd-eye" onClick={() => setShowPwd(s => ({ ...s, current: !s.current }))}>
                  {showPwd.current
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            <div className="profil-form-row">
              <div className="profil-field profil-field--pwd">
                <label>Nouveau mot de passe</label>
                <div className="profil-pwd-wrap">
                  <input type={showPwd.nouveau ? 'text' : 'password'} value={pwd.nouveau} onChange={e => setPwd(p => ({ ...p, nouveau: e.target.value }))} placeholder="••••••••" required />
                  <button type="button" className="profil-pwd-eye" onClick={() => setShowPwd(s => ({ ...s, nouveau: !s.nouveau }))}>
                    {showPwd.nouveau
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
              <div className="profil-field profil-field--pwd">
                <label>Confirmer le mot de passe</label>
                <div className="profil-pwd-wrap">
                  <input type={showPwd.confirm ? 'text' : 'password'} value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" required />
                  <button type="button" className="profil-pwd-eye" onClick={() => setShowPwd(s => ({ ...s, confirm: !s.confirm }))}>
                    {showPwd.confirm
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
            </div>
            <button className="profil-save-btn profil-save-btn--sec" type="submit" disabled={savingPwd}>
              {savingPwd
                ? <><span className="profil-spinner" />Modification…</>
                : <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Changer le mot de passe
                  </>
              }
            </button>
          </form>
        </div>

        {/* Zone danger */}
        <div className="profil-card profil-card--danger">
          <div className="profil-card-head">
            <div className="profil-card-head-icon profil-card-head-icon--red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <h2>Zone sensible</h2>
              <p>Actions irréversibles sur ton compte</p>
            </div>
          </div>
          <p className="profil-danger-desc">
            Si tu souhaites supprimer ton compte ou exporter tes données, contacte notre équipe.
          </p>
          <a href="mailto:support@movelikeher.ma" className="profil-danger-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Contacter le support
          </a>
        </div>

      </div>
    </main>
  )
}
