import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { auth as authApi } from '../services/api'
import { useNavigate } from 'react-router-dom'
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
  const [saving, setSaving]   = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)
  const [toast, setToast]     = useState(null)

  function showToast(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleSaveInfo(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await authApi.updateProfil({
        prenom:    form.prenom,
        name:      form.name,
        email:     form.email,
        telephone: form.telephone,
      })
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

  return (
    <main className="profil-page">
      {toast && (
        <div className={`profil-toast ${toast.ok ? 'profil-toast--ok' : 'profil-toast--err'}`}>
          {toast.msg}
        </div>
      )}

      <div className="profil-hero">
        <div className="profil-hero-bg" />
        <div className="profil-hero-overlay" />
        <div className="container profil-hero-content">
          <div className="profil-avatar">{initials}</div>
          <div>
            <h1 className="profil-hero-name">{user?.prenom} {user?.name}</h1>
            <p className="profil-hero-email">{user?.email}</p>
          </div>
          <button className="profil-back-btn" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Retour
          </button>
        </div>
      </div>

      <div className="container profil-body">

        {/* Infos personnelles */}
        <div className="profil-card">
          <div className="profil-card-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2"/></svg>
            <h2>Informations personnelles</h2>
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
                <input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} placeholder="06 00 00 00 00" />
              </div>
            </div>
            <button className="profil-save-btn" type="submit" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        {/* Mot de passe */}
        <div className="profil-card">
          <div className="profil-card-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <h2>Changer le mot de passe</h2>
          </div>
          <form className="profil-form" onSubmit={handleSavePwd}>
            <div className="profil-field">
              <label>Mot de passe actuel</label>
              <input type="password" value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" required />
            </div>
            <div className="profil-form-row">
              <div className="profil-field">
                <label>Nouveau mot de passe</label>
                <input type="password" value={pwd.nouveau} onChange={e => setPwd(p => ({ ...p, nouveau: e.target.value }))} placeholder="••••••••" required />
              </div>
              <div className="profil-field">
                <label>Confirmer</label>
                <input type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" required />
              </div>
            </div>
            <button className="profil-save-btn" type="submit" disabled={savingPwd}>
              {savingPwd ? 'Modification…' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>

      </div>
    </main>
  )
}
