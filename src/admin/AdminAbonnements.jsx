import { useEffect, useState } from 'react'
import { admin } from '../services/api'
import './AdminPages.css'

const EMPTY = { nom: '', prix_mensuel: '', prix_annuel: '', fonctionnalites: '', populaire: false, couleur: '', cta_texte: '', ordre: 0, actif: true }

export default function AdminAbonnements() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null) // null | 'create' | 'edit'
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = () => {
    setLoading(true)
    admin.abonnements().then(setList).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setModal('edit') }
  const openEdit = (a) => {
    setForm({ ...a, fonctionnalites: (a.fonctionnalites || []).join('\n'), populaire: !!a.populaire, actif: !!a.actif })
    setEditId(a.id); setError(''); setModal('edit')
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        fonctionnalites: form.fonctionnalites ? form.fonctionnalites.split('\n').map(s => s.trim()).filter(Boolean) : [],
        prix_mensuel: Number(form.prix_mensuel),
        prix_annuel: form.prix_annuel ? Number(form.prix_annuel) : null,
        ordre: Number(form.ordre),
      }
      if (editId) await admin.updateAbonnement(editId, payload)
      else        await admin.createAbonnement(payload)
      setModal(null); load()
    } catch (e) {
      setError(e.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Désactiver cet abonnement ?')) return
    await admin.deleteAbonnement(id)
    load()
  }

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Abonnements</h1>
        <p className="adm-page-sub">Gérer les plans tarifaires</p>
      </div>

      <div className="adm-section">
        <div className="adm-section-head">
          <h2 className="adm-section-title">Plans ({list.length})</h2>
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter
          </button>
        </div>

        <div className="adm-table-wrap">
          {loading ? <div className="adm-empty">Chargement…</div> : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Nom</th><th>Prix/mois</th><th>Prix/an</th><th>Ordre</th><th>Populaire</th><th>Statut</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={7} className="adm-empty">Aucun abonnement.</td></tr>}
                {list.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: a.couleur || '#e91e8c', flexShrink: 0, boxShadow: `0 0 6px ${a.couleur || '#e91e8c'}80` }} />
                        <strong style={{ color: '#2d1a24' }}>{a.nom}</strong>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 700, color: '#e91e8c' }}>{a.prix_mensuel} Dh</span></td>
                    <td><span style={{ fontWeight: 600, color: '#9c27b0' }}>{a.prix_annuel ? `${a.prix_annuel} Dh` : '—'}</span></td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#fce4f0', color: '#e91e8c', fontSize: '.75rem', fontWeight: 700 }}>{a.ordre}</span>
                    </td>
                    <td>{a.populaire ? <span className="adm-badge adm-badge-pink">⭐ Populaire</span> : <span style={{color:'#ccc'}}>—</span>}</td>
                    <td>
                      <span className={`adm-badge ${a.actif ? 'adm-badge-green' : 'adm-badge-red'}`}>
                        {a.actif ? '● Actif' : '● Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(a)}>Modifier</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(a.id)}>Désactiver</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal === 'edit' && (
        <div className="adm-modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="adm-modal">
            <div className="adm-modal-head">
              <h3 className="adm-modal-title">{editId ? 'Modifier' : 'Créer'} un abonnement</h3>
              <button className="adm-modal-close" onClick={() => setModal(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="adm-modal-body">
              {error && <div className="adm-alert adm-alert-error">{error}</div>}
              <div className="adm-form-grid">
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Nom *</label>
                  <input className="adm-input" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Ex: Essentiel" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Prix mensuel (Dh) *</label>
                  <input className="adm-input" type="number" value={form.prix_mensuel} onChange={e => set('prix_mensuel', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Prix annuel (Dh)</label>
                  <input className="adm-input" type="number" value={form.prix_annuel} onChange={e => set('prix_annuel', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Couleur (ex: #e91e8c)</label>
                  <input className="adm-input" value={form.couleur} onChange={e => set('couleur', e.target.value)} placeholder="#e91e8c" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Texte CTA</label>
                  <input className="adm-input" value={form.cta_texte} onChange={e => set('cta_texte', e.target.value)} placeholder="Choisir ce plan" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Ordre d'affichage</label>
                  <input className="adm-input" type="number" value={form.ordre} onChange={e => set('ordre', e.target.value)} />
                </div>
                <div className="adm-field" style={{ justifyContent: 'flex-end' }}>
                  <label className="adm-toggle">
                    <input type="checkbox" checked={form.populaire} onChange={e => set('populaire', e.target.checked)} />
                    <span className="adm-toggle-track"><span className="adm-toggle-thumb" /></span>
                    Populaire
                  </label>
                  <label className="adm-toggle" style={{ marginTop: 8 }}>
                    <input type="checkbox" checked={form.actif} onChange={e => set('actif', e.target.checked)} />
                    <span className="adm-toggle-track"><span className="adm-toggle-thumb" /></span>
                    Actif
                  </label>
                </div>
                <div className="adm-field adm-field-full">
                  <label className="adm-label">Fonctionnalités (une par ligne)</label>
                  <textarea className="adm-textarea" rows={5} value={form.fonctionnalites} onChange={e => set('fonctionnalites', e.target.value)} placeholder="Accès illimité aux cours&#10;Vestiaires&#10;Coaching personnalisé" />
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-ghost" onClick={() => setModal(null)}>Annuler</button>
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
