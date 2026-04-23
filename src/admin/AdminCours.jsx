import { useEffect, useState } from 'react'
import { admin } from '../services/api'
import './AdminPages.css'

const NIVEAUX = ['Tous niveaux', 'Débutant', 'Intermédiaire', 'Avancé']
const EMPTY = { nom: '', description: '', duree: '', niveau: 'Tous niveaux', calories: '', image_url: '', couleur: '#e91e8c', actif: true }

export default function AdminCours() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = (s = search) => {
    setLoading(true)
    admin.cours({ search: s }).then(setList).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true) }
  const openEdit = (c) => {
    setForm({ nom: c.nom, description: c.description || '', duree: c.duree || '', niveau: c.niveau || 'Tous niveaux', calories: c.calories || '', image_url: c.image_url || '', couleur: c.couleur || '#e91e8c', actif: !!c.actif })
    setEditId(c.id); setError(''); setModal(true)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      if (editId) await admin.updateCours(editId, form)
      else        await admin.createCours(form)
      setModal(false); load()
    } catch (e) {
      setError(e.message || 'Erreur.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Désactiver ce cours ?')) return
    await admin.deleteCours(id); load()
  }

  const handleSearch = (e) => { setSearch(e.target.value); load(e.target.value) }

  const NIVEAU_COLOR = { 'Tous niveaux': 'adm-badge-gray', 'Débutant': 'adm-badge-green', 'Intermédiaire': 'adm-badge-purple', 'Avancé': 'adm-badge-pink' }

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Cours collectifs</h1>
        <p className="adm-page-sub">Gérer le catalogue des cours</p>
      </div>

      <div className="adm-section">
        <div className="adm-section-head">
          <h2 className="adm-section-title">Cours ({list.length})</h2>
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
                <tr><th>Nom</th><th>Niveau</th><th>Durée</th><th>Calories</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={6}><div className="adm-empty">Aucun cours.</div></td></tr>}
                {list.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 32, height: 32, borderRadius: 8, background: `${c.couleur || '#e91e8c'}20`, border: `1.5px solid ${c.couleur || '#e91e8c'}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke={c.couleur || '#e91e8c'} strokeWidth="1.7" style={{width:15,height:15}}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        </span>
                        <strong style={{ color: '#2d1a24' }}>{c.nom}</strong>
                      </div>
                    </td>
                    <td><span className={`adm-badge ${NIVEAU_COLOR[c.niveau] ?? 'adm-badge-gray'}`}>{c.niveau}</span></td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.8rem', color: '#6a3a50', fontWeight: 600 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.7" style={{width:13,height:13}}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {c.duree}
                      </span>
                    </td>
                    <td>
                      {c.calories
                        ? <span style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80', borderRadius: 20, padding: '3px 9px', fontSize: '.72rem', fontWeight: 600 }}>{c.calories}</span>
                        : <span style={{color:'#ccc'}}>—</span>}
                    </td>
                    <td><span className={`adm-badge ${c.actif ? 'adm-badge-green' : 'adm-badge-red'}`}>{c.actif ? '● Actif' : '● Inactif'}</span></td>
                    <td>
                      <div className="adm-table-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(c)}>Modifier</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(c.id)}>Désactiver</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="adm-modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="adm-modal">
            <div className="adm-modal-head">
              <h3 className="adm-modal-title">{editId ? 'Modifier' : 'Ajouter'} un cours</h3>
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
                  <label className="adm-label">Niveau *</label>
                  <select className="adm-select" value={form.niveau} onChange={e => set('niveau', e.target.value)}>
                    {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Durée *</label>
                  <input className="adm-input" value={form.duree} onChange={e => set('duree', e.target.value)} placeholder="45 min" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Calories</label>
                  <input className="adm-input" value={form.calories} onChange={e => set('calories', e.target.value)} placeholder="300-400 kcal" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Couleur</label>
                  <input className="adm-input" type="color" value={form.couleur} onChange={e => set('couleur', e.target.value)} style={{ height: 38, padding: '4px 6px', cursor: 'pointer' }} />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">URL Image</label>
                  <input className="adm-input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://…" />
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Description</label>
                  <textarea className="adm-textarea" value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
                {editId && (
                  <div className="adm-field">
                    <label className="adm-toggle">
                      <input type="checkbox" checked={form.actif} onChange={e => set('actif', e.target.checked)} />
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
