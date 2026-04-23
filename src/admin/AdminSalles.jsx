import { useEffect, useState } from 'react'
import { admin, salles as sallesApi } from '../services/api'
import './AdminPages.css'

const EMPTY = { nom: '', ville_id: '', adresse: '', telephone: '', email: '', description: '', image_url: '', horaires: '', active: true }

export default function AdminSalles() {
  const [list, setList]       = useState([])
  const [villes, setVilles]   = useState([])
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
    admin.salles({ page: p, search: s })
      .then(res => { setList(res.data); setMeta(res); setPage(p) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(); sallesApi.villes().then(setVilles) }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (s) => {
    setForm({ nom: s.nom, ville_id: s.ville_id, adresse: s.adresse || '', telephone: s.telephone || '', email: s.email || '', description: s.description || '', image_url: s.image_url || '', horaires: s.horaires || '', active: !!s.active })
    setEditId(s.id); setError(''); setModal(true)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      if (editId) await admin.updateSalle(editId, form)
      else        await admin.createSalle(form)
      setModal(false); load(page)
    } catch (e) {
      setError(e.message || 'Erreur.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Désactiver cette salle ?')) return
    await admin.deleteSalle(id); load(page)
  }

  const handleSearch = (e) => { setSearch(e.target.value); load(1, e.target.value) }

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Salles</h1>
        <p className="adm-page-sub">Gérer les clubs Move Like Her</p>
      </div>

      <div className="adm-section">
        <div className="adm-section-head">
          <h2 className="adm-section-title">Salles ({meta?.total ?? list.length})</h2>
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
                <tr><th>Salle</th><th>Ville</th><th>Téléphone</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={6}><div className="adm-empty">Aucune salle.</div></td></tr>}
                {list.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#fce4f0,#f8bbd0)', border: '1.5px solid #f2c4dc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.7" style={{width:16,height:16}}><path d="M3 21V8l9-6 9 6v13"/><path d="M9 21v-6h6v6"/></svg>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#2d1a24', fontSize: '.83rem' }}>{s.nom}</div>
                          {s.adresse && <div style={{ fontSize: '.7rem', color: '#9c6b80' }}>{s.adresse}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fdf0f6', color: '#e91e8c', border: '1px solid #f2c4dc', borderRadius: 20, padding: '3px 10px', fontSize: '.75rem', fontWeight: 600 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:11,height:11}}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                        {s.ville?.nom ?? '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '.8rem', color: '#6a3a50' }}>{s.telephone ?? '—'}</td>
                    <td><span className={`adm-badge ${s.active ? 'adm-badge-green' : 'adm-badge-red'}`}>{s.active ? '● Active' : '● Inactive'}</span></td>
                    <td>
                      <div className="adm-table-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(s)}>Modifier</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(s.id)}>Désactiver</button>
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
              <h3 className="adm-modal-title">{editId ? 'Modifier' : 'Ajouter'} une salle</h3>
              <button className="adm-modal-close" onClick={() => setModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="adm-modal-body">
              {error && <div className="adm-alert adm-alert-error">{error}</div>}
              <div className="adm-form-grid">
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Nom *</label>
                  <input className="adm-input" value={form.nom} onChange={e => set('nom', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Ville *</label>
                  <select className="adm-select" value={form.ville_id} onChange={e => set('ville_id', e.target.value)}>
                    <option value="">Sélectionner…</option>
                    {villes.map(v => <option key={v.id} value={v.id}>{v.nom}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Téléphone</label>
                  <input className="adm-input" value={form.telephone} onChange={e => set('telephone', e.target.value)} />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Adresse</label>
                  <input className="adm-input" value={form.adresse} onChange={e => set('adresse', e.target.value)} />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Email</label>
                  <input className="adm-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Horaires</label>
                  <input className="adm-input" value={form.horaires} onChange={e => set('horaires', e.target.value)} placeholder="Lun-Ven 6h-22h, Sam 8h-20h" />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">URL Image</label>
                  <input className="adm-input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://…" />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Description</label>
                  <textarea className="adm-textarea" value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-toggle">
                    <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
                    <span className="adm-toggle-track"><span className="adm-toggle-thumb" /></span>
                    Active
                  </label>
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
