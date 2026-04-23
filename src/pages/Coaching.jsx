import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { coaches as coachesApi } from '../services/api'
import { SkeletonGrid } from '../components/Skeleton'
import './Coaching.css'

const coachingTypes = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
        <path d="M16 11l1.5 4.5L12 14l-5.5 1.5L8 11" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Coaching Personnalisé',
    desc: 'Un programme d\'entraînement créé sur mesure selon tes objectifs, ton niveau et ton emploi du temps. 1-on-1 avec ta coach.',
    price: 'À partir de 300 Dh / séance',
    features: ['Bilan initial complet', 'Programme personnalisé', 'Suivi des progrès', 'Ajustements continus'],
    color: '#e91e8c',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
        <path d="M12 8v4l3 3" strokeLinecap="round"/>
        <path d="M8 13s1-2 4-2 4 2 4 2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Coaching Nutrition',
    desc: 'Un plan nutritionnel adapté à ta vie et tes objectifs. Apprends à manger bien pour performer et te sentir bien.',
    price: 'À partir de 500 Dh / mois',
    features: ['Bilan alimentaire', 'Plan nutrition sur mesure', 'Recettes adaptées', 'Suivi hebdomadaire'],
    color: '#f06292',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Coaching Mental & Mindset',
    desc: 'La transformation physique commence dans la tête. Travaille ta motivation, ta discipline et ta relation à ton corps.',
    price: 'À partir de 400 Dh / séance',
    features: ['Définition des objectifs', 'Techniques de motivation', 'Gestion du stress', 'Mindset positif'],
    color: '#c2185b',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <path d="M12 18h.01M8 6h8M8 10h8M8 14h4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Coaching Online',
    desc: 'Accède à ton coach où que tu sois. Programmes vidéo, suivi par app, visios hebdomadaires.',
    price: 'À partir de 600 Dh / mois',
    features: ['Programme vidéo', 'Suivi app mobile', 'Visios hebdo', 'Disponible 7j/7'],
    color: '#f48fb1',
  },
]

const steps = [
  {
    n: '01', title: 'Bilan initial', desc: 'On évalue ton niveau, tes objectifs et tes contraintes. Tout part de toi.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round"/></svg>,
  },
  {
    n: '02', title: 'Programme personnalisé', desc: 'Ta coach conçoit un plan adapté à ta vie, pas à une vie idéale.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    n: '03', title: 'Séances & suivi', desc: 'Tu t\'entraînes, ta coach t\'encadre, te motive et adapte en temps réel.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    n: '04', title: 'Résultats & célébration', desc: 'On mesure les progrès, on ajuste et surtout — on célèbre chaque victoire.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round"/></svg>,
  },
]

const team = [
  {
    name: 'Yasmine',
    role: 'Coach Yoga & Bien-être',
    exp: '5 ans',
    courses: 'Yoga · Étirements · Méditation',
    quote: 'Le yoga transforme le corps, mais surtout l\'esprit.',
    certif: 'Diplômée BPJEPS',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&fit=crop&crop=face',
    color: '#f48fb1',
  },
  {
    name: 'Sara',
    role: 'Coach HIIT & Cardio',
    exp: '7 ans',
    courses: 'HIIT · Cardio Boxe · Full Body',
    quote: 'Chaque séance est une victoire sur hier.',
    certif: 'Certifiée CrossFit L2',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80&fit=crop&crop=face',
    color: '#e91e8c',
  },
  {
    name: 'Nadia',
    role: 'Coach Cross Training',
    exp: '6 ans',
    courses: 'Cross Training · CAF · Step',
    quote: 'La force ne se donne pas, elle se construit.',
    certif: 'Diplômée STAPS',
    img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80&fit=crop&crop=face',
    color: '#c2185b',
  },
  {
    name: 'Layla',
    role: 'Coach Nutrition & Coaching',
    exp: '4 ans',
    courses: 'Nutrition · Coaching perso · Bik\'in',
    quote: 'Prendre soin de toi, c\'est un acte de courage.',
    certif: 'Nutritionniste certifiée',
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80&fit=crop&crop=face',
    color: '#f06292',
  },
]

const testimonials = [
  { name: 'Fatima Z.', city: 'Casablanca', text: 'En 3 mois avec Sara, j\'ai perdu 8 kg et surtout j\'ai retrouvé confiance en moi. Move Like Her a changé ma vie.', stars: 5 },
  { name: 'Amina M.', city: 'Rabat', text: 'Le coaching nutrition avec Layla m\'a transformée. Je mange mieux, j\'ai plus d\'énergie et je n\'ai plus la culpabilité.', stars: 5 },
  { name: 'Khadija R.', city: 'Marrakech', text: 'Je n\'avais jamais fait de sport de ma vie. Yasmine m\'a guidée avec tellement de patience. Je ne peux plus m\'arrêter !', stars: 5 },
]

export default function Coaching() {
  const [team, setTeam] = useState([])
  const [loadingTeam, setLoadingTeam] = useState(true)

  useEffect(() => {
    coachesApi.list().then(data => {
      const arr = Array.isArray(data) ? data : (data.data ?? [])
      setTeam(arr.filter(c => c.active !== false).map(c => ({
        id:      c.id,
        name:    c.user?.prenom || c.user?.name || c.name || '',
        role:    c.specialite  || '',
        exp:     c.experience_annees ? `${c.experience_annees} ans` : '',
        courses: Array.isArray(c.cours_dispenses) ? c.cours_dispenses.join(' · ') : (c.cours_dispenses || ''),
        quote:   c.bio || '',
        certif:  Array.isArray(c.certifications) ? c.certifications[0] : (c.certifications || ''),
        img:     c.photo_url || '',
        color:   '#e91e8c',
      })))
    }).catch(() => {}).finally(() => setLoadingTeam(false))
  }, [])

  return (
    <main className="page-coaching">

      {/* ── HERO ── */}
      <section className="coaching-hero">
        <div className="coaching-hero-bg" />
        <div className="coaching-hero-overlay" />
        <div className="coaching-hero-orb coaching-hero-orb-1" />
        <div className="coaching-hero-orb coaching-hero-orb-2" />
        <div className="container coaching-hero-content">
          <span className="tag">Coaching</span>
          <h1 className="coaching-hero-title">
            Ton objectif,<br /><span className="pink-text">notre mission</span>
          </h1>
          <p className="coaching-hero-desc">
            Des coaches certifiées qui t'accompagnent sur mesure.<br />
            Parce que chaque femme est unique et mérite un suivi unique.
          </p>
          <div className="coaching-hero-actions">
            <Link to="/abonnements" className="btn-primary">Démarrer mon coaching</Link>
            <a href="#coaches" className="coaching-hero-ghost">Voir nos coaches ↓</a>
          </div>
        </div>
      </section>

      {/* ── TYPES DE COACHING ── */}
      <section className="coaching-types">
        <div className="container">
          <div className="section-header">
            <span className="tag">Nos programmes</span>
            <h2 className="section-title">Choisir ton <span className="pink-text">accompagnement</span></h2>
          </div>
          <div className="coaching-grid">
            {coachingTypes.map(c => (
              <div key={c.title} className="coaching-card">
                <div className="coa-icon-wrap" style={{ borderColor: `${c.color}33`, background: `${c.color}10` }}>
                  <div className="coa-icon" style={{ color: c.color }}>{c.icon}</div>
                </div>
                <h3 className="coa-title">{c.title}</h3>
                <p className="coa-desc">{c.desc}</p>
                <ul className="coa-features">
                  {c.features.map(f => (
                    <li key={f}>
                      <span className="coa-check" style={{ color: c.color }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="coa-price" style={{ color: c.color, background: `${c.color}12`, borderColor: `${c.color}25` }}>{c.price}</div>
                <a href="#coaches" className="coa-btn" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}cc)` }}>
                  Voir les coaches
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Comment ça marche</span>
            <h2 className="section-title" style={{ color: 'white' }}>Ton parcours <span className="pink-text">en 4 étapes</span></h2>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.n} className="step-card">
                <div className="step-icon">{s.icon}</div>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="step-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COACHES ── */}
      <section className="team-section" id="coaches">
        <div className="container">
          <div className="team-header">
            <div>
              <span className="tag">Notre équipe</span>
              <h2 className="section-title" style={{ color: 'white' }}>Des coaches <span className="pink-text">passionnées</span></h2>
            </div>
            <p className="team-header-sub">Certifiées, expérimentées et surtout — elles t'attendent avec le sourire.</p>
          </div>
          <div className="team-grid-v2">
            {loadingTeam
              ? <SkeletonGrid count={4} height={380} />
              : team.map(m => (
              <div key={m.id || m.name} className="team-card-v2">
                <div className="tcv2-photo-wrap">
                  {m.img
                    ? <img src={m.img} alt={m.name} className="tcv2-photo" />
                    : <div className="tcv2-photo tcv2-photo-placeholder" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}99)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', color:'white', fontWeight:800 }}>{m.name?.[0]}</div>
                  }
                  <div className="tcv2-photo-overlay" style={{ background: `linear-gradient(to top, ${m.color}cc, transparent)` }} />
                  <div className="tcv2-exp-badge">
                    <span>{m.exp}</span>
                    <small>exp.</small>
                  </div>
                </div>
                <div className="tcv2-body">
                  <div className="tcv2-top">
                    <div>
                      <h3 className="tcv2-name">{m.name}</h3>
                      <p className="tcv2-role" style={{ color: m.color }}>{m.role}</p>
                    </div>
                    <span className="tcv2-certif">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <polyline points="9 12 11 14 15 10"/>
                      </svg>
                      {m.certif}
                    </span>
                  </div>
                  <blockquote className="tcv2-quote">"{m.quote}"</blockquote>
                  <div className="tcv2-courses">
                    {(m.courses || '').split(' · ').filter(Boolean).map(c => (
                      <span key={c} className="tcv2-course-pill">{c}</span>
                    ))}
                  </div>
                  <Link
                    to="/abonnements"
                    className="tcv2-book-btn"
                    style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Réserver une séance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="temoignages-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Elles témoignent</span>
            <h2 className="section-title">Des résultats <span className="pink-text">réels</span></h2>
          </div>
          <div className="temoignages-grid">
            {testimonials.map(t => (
              <div key={t.name} className="temo-card">
                <div className="temo-stars">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="#e91e8c" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="temo-text">"{t.text}"</p>
                <div className="temo-author">
                  <span className="temo-name">{t.name}</span>
                  <span className="temo-city">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    {t.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </main>
  )
}
