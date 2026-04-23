import { useEffect, useState } from 'react'
import { admin, salles as sallesApi } from '../services/api'
import './AdminPages.css'

const EMPTY = { name: '', prenom: '', email: '', password: '', specialite: '', salle_id: '', bio: '', experience_annees: 0, photo_url: '', active: true }

export default function AdminCoaches() {
  const [list, setList]       = useState([])
  const [salles, setSalles]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [page, setPage]       = useState(1)
  const [meta, setMeta]       = useState(null)

  const load = (p = 1, s = search) => {
    setLoading(true)
    admin.coaches({ page: p, search: s })
      .then(res => { setList(res.data); setMeta(res); setPage(p) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(); sallesApi.list().then(setSalles) }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (c) => {
    setForm({
      name: c.user?.name || '', prenom: c.user?.prenom || '',
      email: c.user?.email || '', password: '',
      specialite: c.specialite || '', salle_id: c.salle_id || '',
      bio: c.bio || '', experience_annees: c.experience_annees || 0,
      photo_url: c.photo_url || '', active: !!c.active,
    })
    setEditId(c.id); setError(''); setModal(true)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = { ...form, salle_id: form.salle_id || null }
      if (!payload.password) delete payload.password
      if (editId) await admin.updateCoach(editId, payload)
      else        await admin.createCoach(payload)
      setModal(false); load(page)
    } catch (e) {
      setError(e.message || 'Erreur.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce coach ?')) return
    await admin.deleteCoach(id); load(page)
  }

  const handleSearch = (e) => { setSearch(e.target.value); load(1, e.target.value) }

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Coaches</h1>
        <p className="adm-page-sub">Gérer l'équipe de coachs</p>
      </div>

      <div className="adm-section">
        <div className="adm-section-head">
          <h2 className="adm-section-title">Coaches ({meta?.total ?? list.length})</h2>
          <div className="adm-section-actions">
            <div className="adm-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Rechercher…" value={search} onChange={handleSearch} />
            </div>
            <button className="adm-btn adm-btn-primary" onClick={openCreate}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Ajouter
            </button>
          </div>
        </div>

        <div className="adm-table-wrap">
          {loading ? <div className="adm-empty">Chargement…</div> : (
            <table className="adm-table">
              <thead>
                <tr><th>Coach</th><th>Spécialité</th><th>Salle</th><th>Expérience</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={7}><div className="adm-empty">Aucun coach.</div></td></tr>}
                {list.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {c.photo_url
                          ? <img src={c.photo_url} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f2c4dc' }} />
                          : <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#e91e8c,#c2185b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.78rem', color: '#fff', fontWeight: 800, flexShrink: 0 }}>
                              {(c.user?.prenom?.[0] ?? '') + (c.user?.name?.[0] ?? '')}
                            </div>
                        }
                        <div>
                          <div style={{ fontWeight: 700, color: '#2d1a24', fontSize: '.83rem' }}>{c.user?.prenom} {c.user?.name}</div>
                          <div style={{ fontSize: '.7rem', color: '#9c6b80' }}>{c.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', background: '#f3e5f5', color: '#7b1fa2', border: '1px solid #ce93d8', borderRadius: 20, padding: '3px 10px', fontSize: '.72rem', fontWeight: 600 }}>{c.specialite}</span>
                    </td>
                    <td>
                      {c.salle?.nom
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '.8rem', color: '#2d1a24' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.7" style={{width:13,height:13}}><path d="M3 21V8l9-6 9 6v13"/></svg>
                            {c.salle.nom}
                          </span>
                        : <span style={{color:'#ccc'}}>—</span>}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fce4f0', color: '#e91e8c', border: '1px solid #f2c4dc', borderRadius: 20, padding: '3px 10px', fontSize: '.72rem', fontWeight: 600 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:11,height:11}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        {c.experience_annees} ans
                      </span>
                    </td>
                    <td><span className={`adm-badge ${c.active ? 'adm-badge-green' : 'adm-badge-red'}`}>{c.active ? '● Actif' : '● Inactif'}</span></td>
                    <td>
                      <div className="adm-table-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(c)}>Modifier</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(c.id)}>Supprimer</button>
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
              <h3 className="adm-modal-title">{editId ? 'Modifier' : 'Ajouter'} un coach</h3>
              <button className="adm-modal-close" onClick={() => setModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="adm-modal-body">
              {error && <div className="adm-alert adm-alert-error">{error}</div>}
              <div className="adm-form-grid">
                <div className="adm-field">
                  <label className="adm-label">Prénom *</label>
                  <input className="adm-input" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Nom *</label>
                  <input className="adm-input" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Email *</label>
                  <input className="adm-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                {!editId && (
                  <div className="adm-field adm-field-full">
                    <label className="adm-label">Mot de passe *</label>
                    <input className="adm-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} />
                  </div>
                )}
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Spécialité *</label>
                  <input className="adm-input" value={form.specialite} onChange={e => set('specialite', e.target.value)} placeholder="Ex: Yoga, Pilates…" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Salle</label>
                  <select className="adm-select" value={form.salle_id} onChange={e => set('salle_id', e.target.value)}>
                    <option value="">Aucune</option>
                    {salles.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Expérience (années)</label>
                  <input className="adm-input" type="number" value={form.experience_annees} onChange={e => set('experience_annees', e.target.value)} />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">URL photo</label>
                  <input className="adm-input" value={form.photo_url} onChange={e => set('photo_url', e.target.value)} placeholder="https://…" />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Bio</label>
                  <textarea className="adm-textarea" value={form.bio} onChange={e => set('bio', e.target.value)} />
                </div>
                {editId && (
                  <div className="adm-field">
                    <label className="adm-toggle">
                      <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
                      <span className="adm-toggle-track"><span className="adm-toggle-thumb" /></span>
                      Actif
                    </label>
                  </div>
                )}
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
