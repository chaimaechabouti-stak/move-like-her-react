import { useEffect, useState } from 'react'
import { admin } from '../services/api'
import './AdminPages.css'

const STATUT_COLOR = { nouveau: 'adm-badge-orange', contacte: 'adm-badge-blue', inscrit: 'adm-badge-green', annule: 'adm-badge-gray' }
const STATUT_LABEL = { nouveau: 'Nouveau', contacte: 'Contacté', inscrit: 'Inscrit', annule: 'Annulé' }

export default function AdminDemandes() {
  const [list, setList]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(null)

  const load = () => {
    setLoading(true)
    admin.demandes()
      .then(res => setList(Array.isArray(res) ? res : res.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = list.filter(d =>
    !search ||
    (d.prenom ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (d.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (d.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (d.ville ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const updateStatut = async (id, statut) => {
    setUpdating(id)
    try {
      await admin.updateDemande(id, { statut })
      setList(l => l.map(d => d.id === id ? { ...d, statut } : d))
      if (selected?.id === id) setSelected(s => ({ ...s, statut }))
    } finally {
      setUpdating(null)
    }
  }

  const deleteDemande = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return
    await admin.deleteDemande(id)
    setList(l => l.filter(d => d.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const nouveaux = list.filter(d => d.statut === 'nouveau').length

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Demandes d'inscription</h1>
          <p className="adm-page-sub">{list.length} demande{list.length > 1 ? 's' : ''} au total
            {nouveaux > 0 && <span className="adm-badge adm-badge-orange" style={{marginLeft:8}}>{nouveaux} nouvelle{nouveaux > 1 ? 's' : ''}</span>}
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
            placeholder="Rechercher par nom, email ou ville…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>

        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-loading"><span className="adm-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="adm-empty">Aucune demande trouvée.</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Ville</th>
                  <th>Formule</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr
                    key={d.id}
                    className={selected?.id === d.id ? 'adm-row-active' : ''}
                    style={{ cursor: 'pointer', fontWeight: d.statut === 'nouveau' ? 700 : 400 }}
                    onClick={() => setSelected(selected?.id === d.id ? null : d)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{d.prenom} {d.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.email}</div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{d.ville || '—'}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{d.formule || '—'}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {d.created_at ? new Date(d.created_at).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td>
                      <span className={`adm-badge ${STATUT_COLOR[d.statut] ?? 'adm-badge-orange'}`}>
                        {STATUT_LABEL[d.statut] ?? d.statut}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="adm-actions">
                        <select
                          className="adm-select-sm"
                          value={d.statut ?? 'nouveau'}
                          disabled={updating === d.id}
                          onChange={e => updateStatut(d.id, e.target.value)}
                        >
                          {Object.entries(STATUT_LABEL).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                        <button className="adm-btn-icon adm-btn-danger" onClick={() => deleteDemande(d.id)} title="Supprimer">
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

        {selected && (
          <div className="adm-detail-panel">
            <div className="adm-detail-header">
              <div className="adm-detail-avatar">
                {(selected.prenom?.[0] ?? 'M').toUpperCase()}
              </div>
              <div>
                <div className="adm-detail-name">{selected.prenom} {selected.name}</div>
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
              <span className={`adm-badge ${STATUT_COLOR[selected.statut] ?? 'adm-badge-orange'}`}>
                {STATUT_LABEL[selected.statut] ?? selected.statut}
              </span>
              {selected.ville && <span className="adm-detail-sujet">{selected.ville}</span>}
              <span className="adm-detail-date">
                {selected.created_at ? new Date(selected.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Formule choisie', val: selected.formule },
                { label: 'Ville', val: selected.ville },
                { label: 'Téléphone', val: selected.telephone },
              ].filter(r => r.val).map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-soft)', borderRadius: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' }}>{r.val}</span>
                </div>
              ))}
            </div>

            <a href={`mailto:${selected.email}?subject=Votre demande d'inscription - Move Like Her`} className="adm-detail-reply">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/>
              </svg>
              Contacter par email
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
