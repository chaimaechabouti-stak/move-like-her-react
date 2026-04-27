import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { demandes as demandesApi } from '../services/api'
import SallesMap from '../components/SallesMap'
import { salles as sallesData } from '../data/courses'
import './SalleVille.css'

const toSlug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const VILLES = {
  casablanca: {
    nom: 'Casablanca', slug: 'casablanca',
    adresse: 'Bd Mohammed V, Centre — Casablanca',
    horaires: 'Lun–Sam : 6h–22h · Dim : 8h–18h',
    telephone: '+212 522 48 30 10',
    email: 'casablanca@movelikeher.ma',
    lat: 33.5892, lng: -7.6114,
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&fit=crop',
    membres: 1200, surface: '1 400 m²', coaches: 8, cours: 20,
    description: 'Notre salle phare en plein cœur de Casablanca. Un espace premium de 1 400 m² entièrement dédié aux femmes, avec des équipements haut de gamme et une équipe de coaches certifiées.',
    galerie: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80&fit=crop',
    ],
  },
  rabat: {
    nom: 'Rabat', slug: 'rabat',
    adresse: 'Agdal, Ave Fal Ould Oumeir — Rabat',
    horaires: 'Lun–Sam : 6h–22h · Dim : 8h–18h',
    telephone: '+212 537 77 12 45',
    email: 'rabat@movelikeher.ma',
    lat: 33.9909, lng: -6.8516,
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80&fit=crop',
    membres: 980, surface: '1 200 m²', coaches: 6, cours: 16,
    description: 'Au cœur d\'Agdal, notre salle Rabat offre un cadre moderne et bienveillant. Rejoins une communauté de femmes actives dans la capitale.',
    galerie: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&fit=crop',
    ],
  },
  marrakech: {
    nom: 'Marrakech', slug: 'marrakech',
    adresse: 'Gueliz, Ave Mohammed VI — Marrakech',
    horaires: 'Lun–Sam : 7h–21h · Dim : 9h–17h',
    telephone: '+212 524 43 80 22',
    email: 'marrakech@movelikeher.ma',
    lat: 31.6340, lng: -8.0089,
    img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80&fit=crop',
    membres: 840, surface: '1 100 m²', coaches: 5, cours: 14,
    description: 'Dans le quartier branché de Gueliz, notre salle Marrakech allie modernité et chaleur. Un espace pensé pour ton épanouissement.',
    galerie: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80&fit=crop',
    ],
  },
  tanger: {
    nom: 'Tanger', slug: 'tanger',
    adresse: 'Ave Med Tazi — Tanger',
    horaires: 'Lun–Sam : 6h30–22h · Dim : 8h–18h',
    telephone: '+212 539 32 15 67',
    email: 'tanger@movelikeher.ma',
    lat: 35.7595, lng: -5.8340,
    img: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=1200&q=80&fit=crop',
    membres: 720, surface: '1 000 m²', coaches: 5, cours: 12,
    description: 'Vue sur le détroit, notre salle Tanger t\'accueille dans un cadre exceptionnel. Profite d\'équipements modernes et d\'une ambiance unique.',
    galerie: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80&fit=crop',
    ],
  },
  fes: {
    nom: 'Fès', slug: 'fes',
    adresse: 'Route de Sefrou — Fès',
    horaires: 'Lun–Sam : 7h–21h · Dim : 9h–17h',
    telephone: '+212 535 65 44 88',
    email: 'fes@movelikeher.ma',
    lat: 33.9906, lng: -5.0131,
    img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=1200&q=80&fit=crop',
    membres: 610, surface: '950 m²', coaches: 4, cours: 10,
    description: 'Dans la ville millénaire, notre salle Fès apporte modernité et bien-être. Un havre de paix pour les femmes qui souhaitent prendre soin d\'elles.',
    galerie: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&fit=crop',
    ],
  },
  agadir: {
    nom: 'Agadir', slug: 'agadir',
    adresse: 'Quartier Talborjt — Agadir',
    horaires: 'Lun–Sam : 7h–21h30 · Dim : 9h–17h',
    telephone: '+212 528 82 30 55',
    email: 'agadir@movelikeher.ma',
    lat: 30.4278, lng: -9.5981,
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80&fit=crop',
    membres: 530, surface: '900 m²', coaches: 4, cours: 10,
    description: 'Face à l\'Atlantique, notre salle Agadir est l\'endroit idéal pour te dépasser. Rejoins notre communauté dynamique dans la perle du Souss.',
    galerie: [
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&q=80&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&fit=crop',
    ],
  },
}



export default function SalleVille() {
  const { ville } = useParams()
  const slug  = toSlug(ville || '')
  const salle = VILLES[slug]

  const salleLeaflet = sallesData.find(s => toSlug(s.city) === slug)
  const salleId      = salleLeaflet?.id ?? null

  const [activeImg,  setActiveImg]  = useState(0)
  const [selectedId, setSelectedId] = useState(salleId)
  const [form,       setForm]       = useState({ prenom: '', name: '', email: '', telephone: '', formule: 'decouverte' })
  const [sent,       setSent]       = useState(false)
  const [sending,    setSending]    = useState(false)

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

      {/* ══ HERO ══ */}
      <div className="sv-hero" style={{ backgroundImage: `url(${salle.img})` }}>
        <div className="sv-hero-overlay" />
        <div className="sv-hero-content container">
          <Link to="/salles" className="sv-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Toutes nos salles
          </Link>
          <span className="sv-tag">Move Like Her · {salle.nom}</span>
          <h1 className="sv-title">Salle de sport<br /><span>{salle.nom}</span></h1>
          <div className="sv-hero-stats">
            <div><strong>{salle.membres}+</strong><span>membres</span></div>
            <div><strong>{salle.surface}</strong><span>surface</span></div>
            <div><strong>{salle.coaches}</strong><span>coaches</span></div>
            <div><strong>{salle.cours}+</strong><span>cours / semaine</span></div>
          </div>
        </div>
      </div>

      {/* ══ SECTION CARTE + INFOS ══ */}
      <section className="sv-map-section">
        <div className="container sv-map-layout">

          {/* Liste salles (sidebar gauche) */}
          <div className="sv-salles-list">
            <h3 className="sv-list-title">Nos clubs</h3>
            {sallesData.map(s => (
              <button
                key={s.id}
                className={`sv-list-item ${selectedId === s.id ? 'active' : ''}`}
                onClick={() => setSelectedId(s.id)}
              >
                <div className="sv-list-num">{s.id}</div>
                <div className="sv-list-info">
                  <span className="sv-list-city">{s.city}</span>
                  <span className="sv-list-addr">{s.address}</span>
                  <span className="sv-list-hours">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {s.hours}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Carte Leaflet */}
          <div className="sv-map-leaflet">
            <SallesMap
              salles={sallesData}
              selectedId={selectedId}
              onSelect={s => setSelectedId(s.id)}
            />
          </div>
        </div>
      </section>

      {/* ══ SECTION PRINCIPALE ══ */}
      <div className="container sv-main-grid">

        {/* ── Colonne gauche ── */}
        <div className="sv-left">

          {/* Description */}
          <div className="sv-card">
            <p className="sv-description">{salle.description}</p>
            <div className="sv-badge-row">
              <span className="sv-badge">Sans engagement</span>
              <span className="sv-badge">1 semaine offerte</span>
              <span className="sv-badge">Ouvert 7j/7</span>
              <span className="sv-badge">100% féminin</span>
            </div>
          </div>

          {/* Infos pratiques */}
          <div className="sv-card">
            <h2 className="sv-card-title">Informations pratiques</h2>
            <div className="sv-info-list">
              {[
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>, label: 'Adresse', val: salle.adresse },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: 'Horaires', val: salle.horaires },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.63 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.8a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>, label: 'Téléphone', val: salle.telephone },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', val: salle.email },
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

          {/* Services */}
          

          {/* Galerie */}
          <div className="sv-card">
            <h2 className="sv-card-title">Galerie photos</h2>
            <div className="sv-galerie">
              <div className="sv-galerie-main">
                <img src={salle.galerie[activeImg]} alt={`${salle.nom} - photo ${activeImg + 1}`} />
              </div>
              <div className="sv-galerie-thumbs">
                {salle.galerie.map((img, i) => (
                  <button key={i} className={`sv-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Colonne droite — Formulaire ── */}
        <div className="sv-right">
          <div className="sv-form-card">
            {sent ? (
              <div className="sv-success">
                <div className="sv-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3>Demande envoyée !</h3>
                <p>Notre équipe de <strong>{salle.nom}</strong> te contacte sous 24h.</p>
                <a href={`tel:${salle.telephone}`} className="sv-call-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.63 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.8a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  {salle.telephone}
                </a>
                <button className="sv-btn-ghost" onClick={() => setSent(false)}>Nouvelle demande</button>
              </div>
            ) : (
              <>
                <div className="sv-form-header">
                  <div className="sv-form-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <div>
                    <h2>S'inscrire à {salle.nom}</h2>
                    <p>Notre équipe te contacte sous 24h</p>
                  </div>
                </div>

                <form className="sv-form" onSubmit={handleSubmit} noValidate>
                  <div className="sv-row">
                    <div className="sv-field">
                      <label>Prénom *</label>
                      <input type="text" placeholder="Fatima" required
                        value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} />
                    </div>
                    <div className="sv-field">
                      <label>Nom *</label>
                      <input type="text" placeholder="Alaoui" required
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                  </div>

                  <div className="sv-field">
                    <label>Email *</label>
                    <input type="email" placeholder="ton@email.com" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>

                  <div className="sv-field">
                    <label>Téléphone</label>
                    <input type="tel" placeholder="+212 6XX XX XX XX"
                      value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} />
                  </div>

                  <div className="sv-field">
                    <label>Formule souhaitée</label>
                    <select value={form.formule} onChange={e => setForm(f => ({ ...f, formule: e.target.value }))}>
                      <option value="decouverte">🎁 Découverte — 1 semaine offerte</option>
                      <option value="mensuel">📅 Mensuel — à partir de 500 Dh</option>
                      <option value="trimestriel">📆 Trimestriel — à partir de 1 300 Dh</option>
                      <option value="annuel">⭐ Annuel — à partir de 4 500 Dh</option>
                      <option value="coaching">💪 Coaching personnalisé</option>
                    </select>
                  </div>

                  <button type="submit" className="sv-submit" disabled={sending}>
                    {sending
                      ? <span className="sv-spinner" />
                      : <>Envoyer ma demande <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                    }
                  </button>
                </form>

                <div className="sv-form-footer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Données protégées · Jamais partagées
                </div>

                {/* Appel direct */}
                <div className="sv-direct-call">
                  <div className="sv-direct-call-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.63 3.4 2 2 0 013.6 1.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.8a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  </div>
                  <div>
                    <p>Préfères-tu appeler ?</p>
                    <a href={`tel:${salle.telephone}`}>{salle.telephone}</a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
