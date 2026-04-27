import { Link } from 'react-router-dom'
import './Concept.css'

const timeline = [
  { year: '2022', title: 'La naissance d\'une idée', desc: 'Chaimae, fondatrice de Move Like Her, rêve d\'une salle où les femmes se sentent vraiment chez elles.' },
  { year: '2023', title: 'Ouverture du 1er club', desc: 'Move Like Her ouvre ses portes à Casablanca. Un succès immédiat. Les femmes y viennent, y restent, y reviennent.' },
  { year: '2024', title: 'Expansion au Maroc', desc: 'Forte de la demande, Move Like Her s\'installe dans 4 nouvelles villes marocaines.' },
  { year: '2026', title: 'Une communauté de 5000+', desc: 'Aujourd\'hui, ce sont plus de 5000 femmes qui font confiance à Move Like Her pour leur bien-être.' },
]

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Bienveillance',
    desc: 'On juge zéro. Que tu sois débutante ou athlète, tu as ta place ici.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Dépassement',
    desc: 'On croit en chaque femme. On la pousse, on la soutient, on célèbre ses victoires.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Féminité & Force',
    desc: 'Être forte ne signifie pas être dure. La féminité ET la puissance, c\'est notre ADN.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="10" strokeLinecap="round"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Inclusivité',
    desc: 'Move Like Her, c\'est pour toutes les femmes. Toutes les tailles, tous les âges, tous les objectifs.',
  },
]

const stats = [
  { value: '5000+', label: 'Femmes actives' },
  { value: '15+',   label: 'Types de cours' },
  { value: '6',     label: 'Salles au Maroc' },
  { value: '100%',  label: 'Féminin' },
]

export default function Concept() {
  return (
    <main className="page-concept">

      {/* ── HERO ── */}
      <section className="concept-hero">
        <div className="concept-hero-overlay" />
        <div className="concept-hero-content container">
          <span className="sv-tag">Move Like Her · Notre Concept</span>
          <h1 className="concept-hero-title">
            Une salle née <span>pour les femmes</span>
          </h1>
          <div className="sv-hero-stats">
            <div><strong>100%</strong><span>féminin</span></div>
            <div><strong>6</strong><span>villes</span></div>
            <div><strong>5 000+</strong><span>membres actives</span></div>
          </div>
        </div>
      </section>

      {/* ── MANIFESTE ── */}
      <section className="manifeste-section">
        <div className="container">
          <div className="manifeste-box">

            {/* Texte gauche */}
            <div className="manifeste-text">
              <span className="tag">Le manifeste</span>
              <h2 className="section-title">
                Move Like Her, c'est<br />
                <span className="pink-text">ta révolution intérieure</span>
              </h2>
              <p>Nous avons créé Move Like Her parce que les femmes méritent un espace qui leur ressemble. Un endroit sans jugement, sans pression, sans regard masculin.</p>
              <p>Ici, la force n'est pas synonyme de dureté. Tu peux être forte et féminine — et c'est justement ce qui te rend extraordinaire.</p>

              {/* Pills de promesses */}
              <div className="manifeste-pills">
                {['Sans jugement', '100% féminin', 'Coaches certifiées', 'Ambiance unique'].map(p => (
                  <span key={p} className="manifeste-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {p}
                  </span>
                ))}
              </div>

              <Link to="/abonnements" className="btn-primary">Rejoindre le mouvement</Link>
            </div>

            {/* Visuel droite */}
            <div className="manifeste-visual">
              {/* Image */}
              <div className="manifeste-img-wrap">
                <img
                  src="/images/gym4.png"
                  alt="Move Like Her"
                  className="manifeste-img"
                />
                <div className="manifeste-img-overlay" />
                {/* Badge flottant */}
                <div className="manifeste-img-badge">
                  <span className="mib-num">5000+</span>
                  <span className="mib-label">femmes nous font confiance</span>
                </div>
              </div>

              {/* Stats grid sous l'image */}
              <div className="manifeste-stats-row">
                {stats.map(s => (
                  <div key={s.label} className="mstat">
                    <span className="mstat-val">{s.value}</span>
                    <span className="mstat-lab">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── VALEURS ── */}
      <section className="values-concept-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Nos valeurs</span>
            <h2 className="section-title">Ce qui nous <span className="pink-text">définit</span></h2>
          </div>
          <div className="values-concept-grid">
            {values.map(v => (
              <div key={v.title} className="val-c-card">
                <div className="val-c-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Notre parcours</span>
            <h2 className="section-title">L'histoire de <span className="pink-text">Move Like Her</span></h2>
          </div>
          <div className="timeline">
            {timeline.map((t, i) => (
              <div key={t.year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="tl-year">{t.year}</div>
                <div className="tl-dot" />
                <div className="tl-content">
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
