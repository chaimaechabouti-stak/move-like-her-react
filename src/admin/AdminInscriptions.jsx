import { useEffect, useState } from 'react'
import { admin } from '../services/api'
import './AdminPages.css'

const STATUT_COLOR = { active: 'adm-badge-green', annulee: 'adm-badge-red', expiree: 'adm-badge-gray', en_attente: 'adm-badge-orange' }
const STATUT_LABEL = { active: 'Active', annulee: 'Annulée', expiree: 'Expirée', en_attente: 'En attente' }

export default function AdminInscriptions() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [statut, setStatut]   = useState('')
  const [page, setPage]       = useState(1)
  const [meta, setMeta]       = useState(null)

  const load = (p = 1, s = search, st = statut) => {
    setLoading(true)
    admin.inscriptions({ page: p, search: s, statut: st })
      .then(res => { setList(res.data); setMeta(res); setPage(p) })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSearch = (e) => { setSearch(e.target.value); load(1, e.target.value, statut) }
  const handleStatut = (e) => { setStatut(e.target.value); load(1, search, e.target.value) }

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Inscriptions</h1>
        <p className="adm-page-sub">Suivi des abonnements souscrits</p>
      </div>

      <div className="adm-section">
        <div className="adm-section-head">
          <h2 className="adm-section-title">Inscriptions ({meta?.total ?? list.length})</h2>
          <div className="adm-section-actions">
            <select className="adm-filter-select" value={statut} onChange={handleStatut}>
              <option value="">Tous statuts</option>
              <option value="active">Actives</option>
              <option value="en_attente">En attente</option>
              <option value="annulee">Annulées</option>
              <option value="expiree">Expirées</option>
            </select>
            <div className="adm-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Rechercher membre…" value={search} onChange={handleSearch} />
            </div>
          </div>
        </div>

        <div className="adm-table-wrap">
          {loading ? <div className="adm-empty">Chargement…</div> : (
            <table className="adm-table">
              <thead>
                <tr><th>Membre</th><th>Abonnement</th><th>Salle</th><th>Fréquence</th><th>Montant</th><th>Début</th><th>Fin</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={8}><div className="adm-empty">Aucune inscription.</div></td></tr>}
                {list.map(i => (
                  <tr key={i.id}>
                    <td>
                      <div>
                        <strong style={{ color: '#f0e6ec' }}>{i.user?.prenom} {i.user?.name}</strong>
                        <div style={{ fontSize: '.72rem', color: '#9a7a8a' }}>{i.user?.email}</div>
                      </div>
                    </td>
                    <td>{i.abonnement?.nom ?? '—'}</td>
                    <td>{i.salle?.nom ?? '—'}</td>
                    <td><span className="adm-badge adm-badge-purple">{i.frequence}</span></td>
                    <td><strong style={{ color: '#e91e8c' }}>{i.montant_paye} Dh</strong></td>
                    <td>{new Date(i.date_debut).toLocaleDateString('fr-FR')}</td>
                    <td>{new Date(i.date_fin).toLocaleDateString('fr-FR')}</td>
                    <td><span className={`adm-badge ${STATUT_COLOR[i.statut] ?? 'adm-badge-gray'}`}>{STATUT_LABEL[i.statut] ?? i.statut}</span></td>
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
    </div>
  )
}
