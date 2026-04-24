import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { demandes as demandesApi } from '../services/api'
import './SalleVille.css'

const toSlug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const VILLES = {
  casablanca: {
    nom: 'Casablanca',
    adresse: 'Bd Mohammed V, Centre — Casablanca',
    horaires: 'Lun–Sam : 6h–22h · Dim : 8h–18h',
    telephone: '+212 522 XX XX XX',
    lat: 33.5892, lng: -7.6114,
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&fit=crop',
    membres: 1200, surface: '1 400 m²',
  },
  rabat: {
    nom: 'Rabat',
    adresse: 'Agdal, Ave Fal Ould Oumeir — Rabat',
    horaires: 'Lun–Sam : 6h–22h · Dim : 8h–18h',
    telephone: '+212 537 XX XX XX',
    lat: 33.9909, lng: -6.8516,
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80&fit=crop',
    membres: 980, surface: '1 200 m²',
  },
  marrakech: {
    nom: 'Marrakech',
    adresse: 'Gueliz, Ave Mohammed VI — Marrakech',
    horaires: 'Lun–Sam : 7h–21h · Dim : 9h–17h',
    telephone: '+212 524 XX XX XX',
    lat: 31.6340, lng: -8.0089,
    img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80&fit=crop',
    membres: 840, surface: '1 100 m²',
  },
  tanger: {
    nom: 'Tanger',
    adresse: 'Ave Med Tazi — Tanger',
    horaires: 'Lun–Sam : 6h30–22h · Dim : 8h–18h',
    telephone: '+212 539 XX XX XX',
    lat: 35.7595, lng: -5.8340,
    img: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=1200&q=80&fit=crop',
    membres: 720, surface: '1 000 m²',
  },
  fes: {
    nom: 'Fès',
    adresse: 'Route de Sefrou — Fès',
    horaires: 'Lun–Sam : 7h–21h · Dim : 9h–17h',
    telephone: '+212 535 XX XX XX',
    lat: 33.9906, lng: -5.0131,
    img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=1200&q=80&fit=crop',
    membres: 610, surface: '950 m²',
  },
  agadir: {
    nom: 'Agadir',
    adresse: 'Quartier Talborjt — Agadir',
    horaires: 'Lun–Sam : 7h–21h30 · Dim : 9h–17h',
    telephone: '+212 528 XX XX XX',
    lat: 30.4278, lng: -9.5981,
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80&fit=crop',
    membres: 530, surface: '900 m²',
  },
}

function mapUrl(lat, lng) {
  const delta = 0.012
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
}

export default function SalleVille() {
  const { ville } = useParams()
  const slug = toSlug(ville || '')
  const salle = VILLES[slug]

  const [form, setForm] = useState({ prenom: '', name: '', email: '', telephone: '', formule: 'decouverte' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  if (!salle) {
    return (
      <div className="sv-notfound">
        <h1>Ville introuvable</h1>
        <Link to="/salles">Voir toutes nos salles</Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await demandesApi.envoyer({ ...form, ville: salle.nom })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="sv-page">

      {/* Hero */}
      <div className="sv-hero" style={{ backgroundImage: `url(${salle.img})` }}>
        <div className="sv-hero-overlay" />
        <div className="sv-hero-content container">
          <Link to="/salles" className="sv-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Toutes nos salles
          </Link>
          <span className="sv-tag">Move Like Her · {salle.nom}</span>
          <h1 className="sv-title">Salle de sport à<br /><span>{salle.nom}</span></h1>
          <div className="sv-hero-stats">
            <div><strong>{salle.membres}+</strong><span>membres</span></div>
            <div><strong>{salle.surface}</strong><span>de surface</span></div>
            <div><strong>100%</strong><span>féminin</span></div>
          </div>
        </div>
      </div>

      <div className="container sv-body">
        <div className="sv-grid">

          {/* Colonne gauche — infos + carte */}
          <div className="sv-left">

            {/* Infos */}
            <div className="sv-card">
              <h2 className="sv-card-title">Informations pratiques</h2>
              <div className="sv-info-list">
                {[
                  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>, label: 'Adresse', val: salle.adresse },
                  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: 'Horaires', val: salle.horaires },
                  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.63 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.8a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>, label: 'Téléphone', val: salle.telephone },
                ].map((r, i) => (
                  <div key={i} className="sv-info-item">
                    <div className="sv-info-icon">{r.icon}</div>
                    <div>
                      <p className="sv-info-label">{r.label}</p>
                      <p className="sv-info-val">{r.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte */}
            <div className="sv-card sv-map-card">
              <h2 className="sv-card-title">Localisation</h2>
              <div className="sv-map-wrap">
                <iframe
                  title={`Carte ${salle.nom}`}
                  src={mapUrl(salle.lat, salle.lng)}
                  className="sv-map"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${salle.lat}&mlon=${salle.lng}#map=15/${salle.lat}/${salle.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="sv-map-open"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Ouvrir dans Maps
              </a>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="sv-right">
            <div className="sv-card sv-form-card">
              {sent ? (
                <div className="sv-success">
                  <div className="sv-success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3>Demande envoyée !</h3>
                  <p>Notre équipe de <strong>{salle.nom}</strong> te contacte sous 24h pour finaliser ton inscription.</p>
                  <button className="sv-submit" onClick={() => setSent(false)}>Nouvelle demande</button>
                </div>
              ) : (
                <>
                  <h2 className="sv-card-title">S'inscrire à {salle.nom}</h2>
                  <p className="sv-form-sub">Remplis ce formulaire, notre équipe te contacte sous 24h.</p>
                  <form className="sv-form" onSubmit={handleSubmit}>
                    <div className="sv-row">
                      <div className="sv-field">
                        <label>Prénom *</label>
                        <input type="text" placeholder="Fatima" required value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} />
                      </div>
                      <div className="sv-field">
                        <label>Nom *</label>
                        <input type="text" placeholder="Alaoui" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                    </div>
                    <div className="sv-row">
                      <div className="sv-field">
                        <label>Email *</label>
                        <input type="email" placeholder="ton@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                      <div className="sv-field">
                        <label>Téléphone</label>
                        <input type="tel" placeholder="+212 6XX XX XX XX" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="sv-field">
                      <label>Formule souhaitée</label>
                      <select value={form.formule} onChange={e => setForm(f => ({ ...f, formule: e.target.value }))}>
                        <option value="decouverte">Découverte (1 semaine offerte)</option>
                        <option value="mensuel">Mensuel — à partir de 500 Dh</option>
                        <option value="trimestriel">Trimestriel — à partir de 1 300 Dh</option>
                        <option value="annuel">Annuel — à partir de 4 500 Dh</option>
                        <option value="coaching">Coaching personnalisé</option>
                      </select>
                    </div>
                    <button type="submit" className="sv-submit" disabled={sending}>
                      {sending ? <span className="sv-spinner" /> : <>
                        Envoyer ma demande
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
