import { useEffect, useState } from 'react'
import { admin } from '../services/api'
import './AdminPages.css'

const ROLE_COLORS = { admin: 'adm-badge-pink', coach: 'adm-badge-purple', membre: 'adm-badge-gray' }

export default function AdminUtilisateurs() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [role, setRole]       = useState('')
  const [page, setPage]       = useState(1)
  const [meta, setMeta]       = useState(null)
  const [modal, setModal]     = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm]       = useState({ name: '', prenom: '', email: '', telephone: '', role: 'membre' })
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = (p = 1, s = search, r = role) => {
    setLoading(true)
    admin.users({ page: p, search: s, role: r })
      .then(res => { setList(res.data); setMeta(res); setPage(p) })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openEdit = (u) => {
    setEditUser(u)
    setForm({ name: u.name, prenom: u.prenom || '', email: u.email, telephone: u.telephone || '', role: u.role })
    setError(''); setModal(true)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      await admin.updateUser(editUser.id, form)
      setModal(false); load(page)
    } catch (e) {
      setError(e.message || 'Erreur.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await admin.deleteUser(id); load(page)
  }

  const handleSearch = (e) => { setSearch(e.target.value); load(1, e.target.value, role) }
  const handleRole   = (e) => { setRole(e.target.value);  load(1, search, e.target.value) }

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Utilisateurs</h1>
        <p className="adm-page-sub">Gérer les membres et leurs rôles</p>
      </div>

      <div className="adm-section">
        <div className="adm-section-head">
          <h2 className="adm-section-title">Utilisateurs ({meta?.total ?? list.length})</h2>
          <div className="adm-section-actions">
            <select className="adm-filter-select" value={role} onChange={handleRole}>
              <option value="">Tous les rôles</option>
              <option value="membre">Membres</option>
              <option value="coach">Coaches</option>
              <option value="admin">Admins</option>
            </select>
            <div className="adm-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Rechercher…" value={search} onChange={handleSearch} />
            </div>
          </div>
        </div>

        <div className="adm-table-wrap">
          {loading ? <div className="adm-empty">Chargement…</div> : (
            <table className="adm-table">
              <thead>
                <tr><th>Utilisateur</th><th>Rôle</th><th>Abonnement</th><th>Inscrit le</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={7}><div className="adm-empty">Aucun utilisateur.</div></td></tr>}
                {list.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#fce4f0,#f8bbd0)', border: '2px solid #f2c4dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 800, color: '#e91e8c', flexShrink: 0 }}>
                          {(u.prenom?.[0] ?? '') + (u.name?.[0] ?? '')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#2d1a24', fontSize: '.83rem' }}>{u.prenom} {u.name}</div>
                          <div style={{ fontSize: '.7rem', color: '#9c6b80' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`adm-badge ${ROLE_COLORS[u.role] ?? 'adm-badge-gray'}`}>{u.role}</span></td>
                    <td>
                      {u.inscription_active
                        ? <span className="adm-badge adm-badge-green">✓ {u.inscription_active.abonnement?.nom}</span>
                        : <span className="adm-badge adm-badge-gray">Aucun</span>
                      }
                    </td>
                    <td style={{ fontSize: '.8rem', color: '#9c6b80' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div className="adm-table-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(u)}>Modifier</button>
                        {u.role !== 'admin' && (
                          <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(u.id)}>Supprimer</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {meta && meta.last_page > 1 && (
          <div className="adm-pagination">
            <button disabled={page <= 1} onClick={() => load(page - 1)}>← Préc.</button>
            <span>Page {page} / {meta.last_page}</span>
            <button disabled={page >= meta.last_page} onClick={() => load(page + 1)}>Suiv. →</button>
          </div>
        )}
      </div>

      {modal && (
        <div className="adm-modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="adm-modal">
            <div className="adm-modal-head">
              <h3 className="adm-modal-title">Modifier l'utilisateur</h3>
              <button className="adm-modal-close" onClick={() => setModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="adm-modal-body">
              {error && <div className="adm-alert adm-alert-error">{error}</div>}
              <div className="adm-form-grid">
                <div className="adm-field">
                  <label className="adm-label">Prénom</label>
                  <input className="adm-input" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Nom</label>
                  <input className="adm-input" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Email</label>
                  <input className="adm-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Téléphone</label>
                  <input className="adm-input" value={form.telephone} onChange={e => set('telephone', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Rôle</label>
                  <select className="adm-select" value={form.role} onChange={e => set('role', e.target.value)}>
                    <option value="membre">Membre</option>
                    <option value="coach">Coach</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-ghost" onClick={() => setModal(false)}>Annuler</button>
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
