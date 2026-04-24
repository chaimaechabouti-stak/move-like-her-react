import { useEffect, useState } from 'react'
import { admin } from '../services/api'
import './AdminPages.css'

const STATUT_COLOR = { nouveau: 'adm-badge-orange', lu: 'adm-badge-blue', traite: 'adm-badge-green' }
const STATUT_LABEL = { nouveau: 'Nouveau', lu: 'Lu', traite: 'Traité' }

export default function AdminContacts() {
  const [list, setList]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(null)

  const load = () => {
    setLoading(true)
    admin.contacts()
      .then(res => setList(Array.isArray(res) ? res : res.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = list.filter(c =>
    !search ||
    (c.nom ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.sujet ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const updateStatut = async (id, statut) => {
    setUpdating(id)
    try {
      await admin.updateContact(id, { statut })
      setList(l => l.map(c => c.id === id ? { ...c, statut } : c))
      if (selected?.id === id) setSelected(s => ({ ...s, statut }))
    } finally {
      setUpdating(null)
    }
  }

  const deleteContact = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return
    await admin.deleteContact(id)
    setList(l => l.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const nouveaux = list.filter(c => c.statut === 'nouveau').length

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Messages de contact</h1>
          <p className="adm-page-sub">{list.length} message{list.length > 1 ? 's' : ''} au total
            {nouveaux > 0 && <span className="adm-badge adm-badge-orange" style={{marginLeft:8}}>{nouveaux} nouveau{nouveaux > 1 ? 'x' : ''}</span>}
          </p>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="adm-search"
            placeholder="Rechercher par nom, email ou sujet…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>

        {/* Table */}
        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-loading"><span className="adm-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="adm-empty">Aucun message trouvé.</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Expéditeur</th>
                  <th>Sujet</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr
                    key={c.id}
                    className={selected?.id === c.id ? 'adm-row-active' : ''}
                    style={{ cursor: 'pointer', fontWeight: c.statut === 'nouveau' ? 700 : 400 }}
                    onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.nom}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.sujet || '—'}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td>
                      <span className={`adm-badge ${STATUT_COLOR[c.statut] ?? 'adm-badge-gray'}`}>
                        {STATUT_LABEL[c.statut] ?? c.statut}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="adm-actions">
                        <select
                          className="adm-select-sm"
                          value={c.statut ?? 'nouveau'}
                          disabled={updating === c.id}
                          onChange={e => updateStatut(c.id, e.target.value)}
                        >
                          {Object.entries(STATUT_LABEL).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                        <button className="adm-btn-icon adm-btn-danger" onClick={() => deleteContact(c.id)} title="Supprimer">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Détail message */}
        {selected && (
          <div className="adm-detail-panel">
            <div className="adm-detail-header">
              <div className="adm-detail-avatar">
                {(selected.nom?.[0] ?? 'M').toUpperCase()}
              </div>
              <div>
                <div className="adm-detail-name">{selected.nom}</div>
                <a href={`mailto:${selected.email}`} className="adm-detail-email">{selected.email}</a>
                {selected.telephone && <div className="adm-detail-phone">{selected.telephone}</div>}
              </div>
              <button className="adm-detail-close" onClick={() => setSelected(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="adm-detail-meta">
              <span className={`adm-badge ${STATUT_COLOR[selected.statut] ?? 'adm-badge-gray'}`}>
                {STATUT_LABEL[selected.statut] ?? selected.statut}
              </span>
              {selected.sujet && <span className="adm-detail-sujet">{selected.sujet}</span>}
              <span className="adm-detail-date">
                {selected.created_at ? new Date(selected.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
              </span>
            </div>

            <div className="adm-detail-message">{selected.message}</div>

            <a href={`mailto:${selected.email}?subject=Re: ${selected.sujet ?? 'Votre message'}`} className="adm-detail-reply">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/>
              </svg>
              Répondre par email
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
