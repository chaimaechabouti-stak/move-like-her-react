import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { courses, plans, espacesData } from '../data/courses'
import { Reveal, FadeIn, FadeLeft, FadeRight, ZoomIn, BlurIn, Counter } from '../hooks/Reveal'
import './Home.css'
import './Abonnements.css'

/* SlideUp reste local — variante avec duration 600 spécifique à Home */
const SlideUp = ({ children, delay = 0, className = '' }) =>
  <Reveal variant="up" delay={delay} duration={600} className={className}>{children}</Reveal>

/* ─────────────────────────────────────────────── */

const sallesData = [
  {
    city: 'Casablanca',
    address: 'Bd Mohammed V, Centre',
    hours: '6h – 22h',
    membres: 1200,
    surface: '1 400 m²',
    parking: true,
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&fit=crop',
  },
  {
    city: 'Rabat',
    address: 'Agdal, Ave Fal Ould Oumeir',
    hours: '6h – 22h',
    membres: 980,
    surface: '1 200 m²',
    parking: true,
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80&fit=crop',
  },
  {
    city: 'Marrakech',
    address: 'Gueliz, Ave Mohammed VI',
    hours: '7h – 21h',
    membres: 840,
    surface: '1 100 m²',
    parking: false,
    img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80&fit=crop',
  },
  {
    city: 'Tanger',
    address: 'Ave Med Tazi',
    hours: '6h30 – 22h',
    membres: 720,
    surface: '1 000 m²',
    parking: true,
    img: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=900&q=80&fit=crop',
  },
  {
    city: 'Fès',
    address: 'Route de Sefrou',
    hours: '7h – 21h',
    membres: 610,
    surface: '950 m²',
    parking: true,
    img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=900&q=80&fit=crop',
  },
  {
    city: 'Agadir',
    address: 'Quartier Talborjt',
    hours: '7h – 21h30',
    membres: 530,
    surface: '900 m²',
    parking: false,
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&fit=crop',
  },
]

const features = [
  { icon: '🏋️', title: 'Équipements Premium', desc: 'Machines dernière génération, poids libres, zones cardio et cross-training entièrement dédiées.' },
  { icon: '🧘', title: 'Studio de Cours', desc: 'Salle climatisée avec son surround. Ambiance garantie pour chaque cours collectif.' },
  { icon: '🚿', title: 'Vestiaires Luxe', desc: 'Casiers sécurisés, douches chaudes, produits de soin. Un vrai moment de bien-être.' },
  { icon: '💪', title: 'Coaches Certifiées', desc: 'Des encadrantes passionnées, formées et diplômées. Toujours là pour te guider.' },
  { icon: '📱', title: 'App Move Like Her', desc: 'Réserve, suis tes progrès, accède à ton planning depuis ton téléphone.' },
  { icon: '🛡️', title: '100% Féminin', desc: 'Un espace sécurisé, bienveillant, sans regard masculin. Tu es chez toi.' },
]

const testimonials = [
  { name: 'Fatima Z.', city: 'Casablanca', text: 'En 3 mois avec Move Like Her j\'ai perdu 8 kg et retrouvé une vraie confiance en moi. Cet endroit m\'a changée.', avatar: 'F', rating: 5 },
  { name: 'Amina M.', city: 'Rabat', text: 'L\'ambiance est incroyable. On se sent vraiment en famille. Les coaches sont au top, j\'adore venir chaque matin.', avatar: 'A', rating: 5 },
  { name: 'Sara K.', city: 'Marrakech', text: 'Jamais je n\'aurais pensé aimer autant le sport. Move Like Her m\'a prouvé que la force, ça se construit avec joie.', avatar: 'S', rating: 5 },
  { name: 'Nadia R.', city: 'Tanger', text: 'Le meilleur investissement de ma vie. Les équipements sont top, les coaches sont bienveillantes. Je recommande à 1000%.', avatar: 'N', rating: 5 },
  { name: 'Kenza B.', city: 'Fès', text: 'Je cherchais un espace où me sentir en sécurité et motivée. Move Like Her c\'est exactement ça. Mes résultats parlent d\'eux-mêmes !', avatar: 'K', rating: 5 },
  { name: 'Samira H.', city: 'Agadir', text: 'Les cours de Cardio Boxe ont transformé mon rapport au sport. Je viens 5 fois par semaine et je n\'en peux plus de m\'arrêter !', avatar: 'S', rating: 5 },
  { name: 'Loubna T.', city: 'Casablanca', text: 'La qualité des équipements est impressionnante. Et les coaches sont vraiment à l\'écoute. Une salle comme nulle part ailleurs au Maroc.', avatar: 'L', rating: 5 },
  { name: 'Rim A.', city: 'Rabat', text: 'Depuis que j\'ai rejoint Move Like Her, mon énergie a décuplé. La communauté est tellement bienveillante, on se pousse les unes les autres.', avatar: 'R', rating: 5 },
]

/* ════════════════════════════════════════
   FEATURES — Scroll-driven sticky layout
   Texte gauche sticky · Images droite défilent
   ════════════════════════════════════════ */
const scrollBlocks = [
  {
    id: 1,
    eyebrow: 'Concepts sportifs',
    title: 'CONCEPTS\nSPORTIFS INNOVANTS',
    titleBold: 'SPORTIFS INNOVANTS',
    desc: 'Découvre nos concepts sportifs innovants et immersifs pour booster ta pratique ! Bik\'in, Cardio Boxe, Cross Training et plus encore, dans nos studios dédiés.',
    checks: [
      'Espaces thématisés et expériences immersives',
      'Des programmes variés et évolutifs',
      'Des séances fun et ludiques adaptées à tous les niveaux',
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop',
    imageFit: 'cover',
  },
  {
    id: 2,
    eyebrow: 'Nos espaces',
    title: 'DES ESPACES\nVASTES ET AGRÉABLES',
    titleBold: 'VASTES ET AGRÉABLES',
    desc: 'Les salles Move Like Her, c\'est plus de 1 300 m² dédiés au bien-être, au fitness et à la musculation. De la place pour s\'entraîner, même aux heures de pointe.',
    checks: [
      'Zones cardio, muscu & cours collectifs séparées',
      'Climatisation et ventilation optimales',
      'Matériel dernière génération renouvelé régulièrement',
    ],
    image: 'https://tse3.mm.bing.net/th/id/OIP.FsI3AfOccoO0UH91ruhgEAHaHa?pid=Api&h=220&P=0',
    imageFit: 'cover',
  },
  {
    id: 3,
    eyebrow: 'Coaches expertes',
    title: 'DES COACHES\nPASSIONNÉES & CERTIFIÉES',
    titleBold: 'PASSIONNÉES & CERTIFIÉES',
    desc: 'Nos encadrantes sont diplômées, bienveillantes et toujours là pour t\'adapter un programme ou te pousser à te dépasser. Ton progrès est leur priorité.',
    checks: [
      'Coaches certifiées et formées en continu',
      'Suivi personnalisé selon tes objectifs',
      'Ambiance bienveillante et motivante garantie',
    ],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80&fit=crop',
    imageFit: 'cover',
  },
  {
    id: 4,
    eyebrow: 'Bien-être & confort',
    title: 'UN CONFORT\n5 ÉTOILES APRÈS CHAQUE SÉANCE',
    titleBold: '5 ÉTOILES APRÈS CHAQUE SÉANCE',
    desc: 'Vestiaires luxueux, casiers sécurisés, douches à pression variable et produits de soin offerts. Parce que prendre soin de soi ne s\'arrête pas à la salle.',
    checks: [
      'Vestiaires VIP réservés aux femmes',
      'Produits de soin bio mis à disposition',
      'Espace détente et lounge après l\'effort',
    ],
    image: 'https://tse3.mm.bing.net/th/id/OIP.R-PH0UbPd8ireVllOUw8MQHaE7?pid=Api&h=220&P=0',
    imageFit: 'cover',
  },
]

function ScrollBlock({ block, index }) {
  const textRef = useRef(null)
  const imgRef  = useRef(null)
  const [textVisible, setTextVisible] = useState(false)
  const [imgVisible,  setImgVisible]  = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTextVisible(true) },
      { threshold: 0.2 }
    )
    if (textRef.current) obs.observe(textRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setImgVisible(true) },
      { threshold: 0.15 }
    )
    if (imgRef.current) obs.observe(imgRef.current)
    return () => obs.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <div className={`sb-row ${isEven ? 'sb-row--normal' : 'sb-row--reverse'}`}>
      {/* TEXT SIDE */}
      <div
        ref={textRef}
        className={`sb-text ${textVisible ? 'sb-text--in' : ''}`}
        style={{ transitionDelay: '0.05s' }}
      >
        <span className="sb-eyebrow">{block.eyebrow}</span>
        <h2 className="sb-title">
          {block.title.split('\n').map((line, i) => (
            <span key={i} className={`sb-title-line ${i === 1 ? 'sb-title-bold' : ''}`}>
              {line}
            </span>
          ))}
        </h2>
        <p className="sb-desc">{block.desc}</p>
        <ul className="sb-checks">
          {block.checks.map((c, i) => (
            <li key={i} className="sb-check-item" style={{ transitionDelay: textVisible ? `${0.3 + i * 0.12}s` : '0s' }}>
              <span className="sb-check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* IMAGE SIDE */}
      <div
        ref={imgRef}
        className={`sb-img-wrap ${imgVisible ? 'sb-img--in' : ''}`}
        style={{ transitionDelay: isEven ? '0.15s' : '0s' }}
      >
        <img
          src={block.image}
          alt={block.eyebrow}
          className="sb-img"
          style={{ objectFit: block.imageFit }}
        />
        <div className="sb-img-overlay" />
        <div className="sb-img-badge">
          <span className="sb-badge-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="sb-badge-label">{block.eyebrow}</span>
        </div>
      </div>
    </div>
  )
}

function FeaturesImmersive() {
  return (
    <section className="features-scroll-section">
      <div className="fs-header container">
        <FadeIn>
          <span className="tag">Nos espaces</span>
          <h2 className="section-title">
            Une salle pensée <span className="pink-text">pour toi</span>
          </h2>
          <p className="section-subtitle">
            Chaque détail a été conçu pour que tu te sentes parfaitement à l'aise, motivée et libre.
          </p>
        </FadeIn>
      </div>
      <div className="fs-blocks">
        {scrollBlocks.map((block, i) => (
          <ScrollBlock key={block.id} block={block} index={i} />
        ))}
      </div>
    </section>
  )
}

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir']

export default function Home() {
  const [activeSalle, setActiveSalle] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [annuel, setAnnuel] = useState(false)
  const [formData, setFormData] = useState({ prenom: '', name: '', email: '', telephone: '', ville: 'Casablanca', formule: 'decouverte' })
  const [formSent, setFormSent] = useState(false)
  const [formSending, setFormSending] = useState(false)

  function handleFormChange(e) {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    setFormSending(true)
    await new Promise(r => setTimeout(r, 1000))
    setFormSent(true)
    setFormSending(false)
  }
  const featuredCourses = courses.slice(0, 3)
  // 3 cours mis en avant sur la homepage

  const filteredCities = searchQuery.length > 0
    ? CITIES.filter(c => c.toLowerCase().startsWith(searchQuery.toLowerCase()))
    : CITIES

  return (
    <main className="home">

      {/* ════════════════════ HERO — Animation CSS ════════════════════ */}
      <section className="hero">

        {/* Animated background */}
        <div className="hero-anim-bg">
          <div className="hero-anim-gradient" />
          <div className="hero-grid-lines" />
        </div>

        {/* Orbs flottants */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Texte géant en fond (style Neoness) */}
        <div className="hero-bg-text" aria-hidden="true">
          <span>MOVE</span>
          <span className="hero-bg-text-2">LIKE HER</span>
        </div>

        {/* Contenu centré */}
        <div className="hero-center container">

          <div className="hero-top-badge animate-badge">
            <span className="badge-dot" />
            <span>+5 000 membres convaincues</span>
          </div>

          <h1 className="hero-title-big">
            <span className="htb-line htb-line-1">WELCOME</span>
            <em className="htb-line htb-line-2">To The Club</em>
          </h1>

          <p className="hero-tagline">
            La 1ère salle de sport 100% féminine au Maroc — Rejoins le mouvement.
          </p>

          {/* ── Barre de recherche villes ── */}
          <div className={`hero-search-wrap ${searchFocus ? 'focused' : ''}`}>
            <div className="hero-search-box">
              <svg className="hero-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher : Casablanca, Rabat..."
                className="hero-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
              />
              <button className="hero-search-locate" title="Ma position">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
                </svg>
              </button>
            </div>
            {/* Dropdown suggestions */}
            {searchFocus && (
              <div className="hero-search-dropdown">
                {filteredCities.map(city => (
                  <Link
                    key={city}
                    to="/salles"
                    className="hero-search-item"
                    onClick={() => { setSearchQuery(city); setSearchFocus(false) }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hero-search-pin">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    {city}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Villes rapides */}
          <div className="hero-city-pills">
            {CITIES.map(city => (
              <Link key={city} to="/salles" className="hero-city-pill">{city}</Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hero-actions">
            <Link to="/abonnements" className="hero-cta-primary">
              <span>Commencer dès 500 Dh</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/salles" className="hero-cta-ghost">
              Trouver ma salle →
            </Link>
          </div>

          {/* Stats bar */}
          <div className="hero-stats-bar">
            {[
              { n: '6', s: '+', label: 'Salles au Maroc' },
              { n: '15', s: '+', label: 'Cours collectifs' },
              { n: '5000', s: '+', label: 'Membres actives' },
              { n: '100', s: '%', label: 'Espace féminin' },
            ].map((st, i) => (
              <div key={i} className="hstat">
                <span className="hstat-value"><Counter target={st.n} suffix={st.s} /></span>
                <span className="hstat-label">{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Défiler</span>
        </div>
      </section>

      {/* ════════════════════ TICKER BAR — OFFRE PROMO ════════════════════ */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="ticker-item ticker-promo">
              <span className="ticker-dot">★</span>
              OFFRE SPÉCIALE &nbsp;·&nbsp; 4 PREMIÈRES SEMAINES À <strong>0 DH</strong> &nbsp;·&nbsp; SANS ENGAGEMENT
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════ FEATURES SCROLL ════════════════════ */}
      <FeaturesImmersive />

      {/* ════════════════════ SALLES SHOWCASE ════════════════════ */}
      <section className="salles-showcase-v2">
        {/* Header */}
        <div className="container">
          <BlurIn>
            <div className="ssv2-header">
              <span className="tag">Nos clubs</span>
              <h2 className="section-title">
                <span className="pink-text">6 salles</span> au Maroc,<br />toujours près de toi
              </h2>
              <p className="section-subtitle">
                Des espaces premium pensés 100% pour les femmes, dans les plus grandes villes du Maroc.
              </p>
            </div>
          </BlurIn>
        </div>

        {/* Grille principale : grande carte + 3 petites */}
        <div className="container">
          <div className="ssv2-grid">

            {/* Grande carte — salle active */}
            <FadeLeft>
              <div
                className="ssv2-main-card"
                style={{ backgroundImage: `url(${sallesData[activeSalle].img})` }}
              >
                <div className="ssv2-main-overlay" />

                {/* Badge ville */}
                <div className="ssv2-city-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  {sallesData[activeSalle].city}
                </div>

                {/* Stats flottants */}
                <div className="ssv2-main-stats">
                  <div className="ssv2-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <div>
                      <p className="ssv2-stat-val">{sallesData[activeSalle].membres}+</p>
                      <p className="ssv2-stat-lab">membres</p>
                    </div>
                  </div>
                  <div className="ssv2-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                    </svg>
                    <div>
                      <p className="ssv2-stat-val">{sallesData[activeSalle].surface}</p>
                      <p className="ssv2-stat-lab">de surface</p>
                    </div>
                  </div>
                  <div className="ssv2-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <div>
                      <p className="ssv2-stat-val">{sallesData[activeSalle].hours}</p>
                      <p className="ssv2-stat-lab">7j/7</p>
                    </div>
                  </div>
                </div>

                {/* Info bas */}
                <div className="ssv2-main-footer">
                  <div className="ssv2-main-addr">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    {sallesData[activeSalle].address}
                  </div>
                  <div className="ssv2-main-chips">
                    <span className="ssv2-chip ssv2-chip-open">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Ouvert maintenant
                    </span>
                    <span className="ssv2-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      100% Féminin
                    </span>
                    {sallesData[activeSalle].parking && (
                      <span className="ssv2-chip">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2"/>
                          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M10 14h4"/>
                        </svg>
                        Parking
                      </span>
                    )}
                  </div>
                  <Link to="/salles" className="ssv2-main-btn">
                    Voir la salle
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </FadeLeft>

            {/* Grille de vignettes à droite */}
            <div className="ssv2-thumbs">
              {sallesData.map((s, i) => (
                <Reveal key={s.city} variant="right" delay={i * 80} duration={600}>
                  <button
                    className={`ssv2-thumb ${activeSalle === i ? 'ssv2-thumb--active' : ''}`}
                    onClick={() => setActiveSalle(i)}
                    style={{ backgroundImage: `url(${s.img})` }}
                  >
                    <div className="ssv2-thumb-overlay" />
                    <div className="ssv2-thumb-body">
                      <div className="ssv2-thumb-top">
                        <span className="ssv2-thumb-city">{s.city}</span>
                        <span className="ssv2-thumb-membres">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                          </svg>
                          {s.membres}+
                        </span>
                      </div>
                      <div className="ssv2-thumb-meta">
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {s.hours}
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                          </svg>
                          {s.surface}
                        </span>
                      </div>
                    </div>
                    {activeSalle === i && <div className="ssv2-thumb-active-bar" />}
                  </button>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Comment ça marche */}
          <FadeIn delay={100}>
            <div className="cmw-section">
              <div className="cmw-header">
                <span className="cmw-tag">Notre approche</span>
                <h3 className="cmw-title">Comment ça marche</h3>
                <p className="cmw-subtitle">Un parcours pensé pour toi, de ton arrivée jusqu'à tes premiers résultats.</p>
              </div>
              <div className="cmw-steps">
                {[
                  {
                    num: '01',
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
                    title: 'Bilan personnalisé',
                    desc: 'Un rendez-vous avec ta coach pour définir tes objectifs et adapter ton programme.',
                  },
                  {
                    num: '02',
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M12 4v16"/></svg>,
                    title: 'Équipements premium',
                    desc: 'Accès illimité à nos machines dernière génération dans un espace 100% féminin.',
                  },
                  {
                    num: '03',
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
                    title: 'Cours collectifs',
                    desc: 'Rejoins nos séances en groupe : yoga, cardio, Zumba et bien plus chaque semaine.',
                  },
                  {
                    num: '04',
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
                    title: 'Suivi de progression',
                    desc: 'Mesure tes résultats en temps réel via notre app et ajuste ton plan avec ta coach.',
                  },
                  {
                    num: '05',
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                    title: 'Communauté & bien-être',
                    desc: 'Vestiaires VIP, espace détente et une communauté bienveillante pour te motiver.',
                  },
                ].map((s, i) => (
                  <div key={i} className="cmw-step">
                    <div className="cmw-step-top">
                      <div className="cmw-step-num">{s.num}</div>
                      <div className="cmw-step-icon">{s.icon}</div>
                    </div>
                    <div className="cmw-step-body">
                      <h4 className="cmw-step-title">{s.title}</h4>
                      <p className="cmw-step-desc">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Espaces d'entraînement */}
          <FadeIn delay={150}>
            <div className="ssv2-espaces-header">
              <span className="ssv2-espaces-title">Nos espaces d'entraînement</span>
              <span className="ssv2-espaces-sub">Découvre les zones disponibles dans chaque club</span>
            </div>
          </FadeIn>
          <div className="ssv2-espaces-grid">
            {espacesData.map((espace, i) => (
              <Reveal key={espace.id} variant="zoom" delay={i * 70} duration={550}>
                <div className="ssv2-espace-card" style={{ backgroundImage: `url(${espace.img})` }}>
                  <div className="ssv2-espace-overlay" />
                  <div className="ssv2-espace-label">{espace.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <FadeIn delay={200}>
            <div className="section-cta">
              <Link to="/salles" className="btn-primary">Voir toutes nos salles →</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════ COURS COLLECTIFS ════════════════════ */}
      <section className="section courses-section">
        <div className="container">

          {/* Header — blur-in */}
          <BlurIn>
            <div className="section-header">
              <span className="tag">Au programme</span>
              <h2 className="section-title">
                Cours collectifs <span className="pink-text">sans limite</span>
              </h2>
              <p className="section-subtitle">
                15 types de cours, 7j/7, pour tous les niveaux. Chaque séance est une nouvelle victoire.
              </p>
            </div>
          </BlurIn>

          {/* Cards — zoom-in staggeré */}
          <div className="courses-grid-pro">
            {featuredCourses.map((c, i) => (
              <ZoomIn key={c.id} delay={i * 80}>
                <Link to="/cours-collectifs" className="course-card-pro">
                  <div className="course-card-bg" style={{ backgroundImage: `url(${c.image})` }} />
                  <div className="course-card-gradient" style={{ background: `linear-gradient(to top, ${c.color}f0 0%, ${c.color}55 40%, transparent 70%)` }} />
                  <div className="course-card-content">
                    <div className="course-card-top">
                      <span className="course-pill">⏱ {c.duration}</span>
                      <span className="course-pill">🔥 {c.calories} cal</span>
                    </div>
                    <div className="course-card-bottom">
                      <span className="course-level">{c.level}</span>
                      <h3>{c.name}</h3>
                      <p>{c.description}</p>
                      <div className="course-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </ZoomIn>
            ))}
          </div>

          <FadeIn delay={150}>
            <div className="section-cta">
              <Link to="/cours-collectifs" className="btn-primary">Voir les 15 cours →</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════ STATS CHIFFRES ════════════════════ */}
      <section className="stats-band">
        <div className="container">
          <div className="stats-band-grid">
            {[
              { n: '6',    s: '',  label: 'Villes au Maroc',   sub: 'Casablanca, Rabat, Marrakech...' },
              { n: '15',   s: '+', label: 'Cours collectifs',  sub: 'HIIT, Yoga, Cardio Boxe...' },
              { n: '5000', s: '+', label: 'Femmes actives',    sub: 'Rejoignent notre communauté' },
              { n: '98',   s: '%', label: 'de satisfaction',   sub: 'Notent Move Like Her 5/5' },
            ].map((s, i) => (
              /* Chaque stat monte avec un délai croissant */
              <Reveal key={i} variant="up" delay={i * 120} duration={650}>
                <div className="stat-band-item">
                  <div className="stat-band-value"><Counter target={s.n} suffix={s.s} /></div>
                  <div className="stat-band-label">{s.label}</div>
                  <div className="stat-band-sub">{s.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ PLANS ════════════════════ */}
      <section className="plans-section-v2">
        {/* Fond décoratif */}
        <div className="psv2-bg" />
        <div className="psv2-grid-lines" />

        <div className="container">
          <BlurIn>
            <div className="psv2-header">
              <span className="tag psv2-tag">Tarifs</span>
              <h2 className="section-title psv2-title">
                Une formule <span className="pink-text">pour chaque femme</span>
              </h2>
              <p className="section-subtitle psv2-sub">
                Sans engagement. Résiliable à tout moment. Commence dès aujourd'hui.
              </p>

              {/* Toggle mensuel / annuel */}
              <div className="psv2-toggle-wrap">
                <span className={`psv2-toggle-label ${!annuel ? 'psv2-toggle-label--active' : ''}`}>Mensuel</span>
                <label className="psv2-toggle">
                  <input type="checkbox" checked={annuel} onChange={e => setAnnuel(e.target.checked)} />
                  <span className="psv2-toggle-slider" />
                </label>
                <span className={`psv2-toggle-label ${annuel ? 'psv2-toggle-label--active' : ''}`}>
                  Annuel
                  <span className="psv2-saving-badge">-20%</span>
                </span>
              </div>
            </div>
          </BlurIn>

          <div className="psv2-grid">
            {plans.map((p, i) => (
              <Reveal key={p.id} variant={['left','up','right'][i]} delay={i * 120} duration={700}>
                <div className={`psv2-card ${p.highlight ? 'psv2-card--highlight' : ''}`}>

                  {/* Ruban "Populaire" */}
                  {p.highlight && (
                    <div className="psv2-ribbon">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      Populaire
                    </div>
                  )}

                  {/* Icône du plan */}
                  <div className="psv2-icon">
                    {i === 0 && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    )}
                    {i === 1 && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    )}
                    {i === 2 && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
                      </svg>
                    )}
                  </div>

                  <div className="psv2-name">{p.name}</div>

                  {/* Prix */}
                  <div className="psv2-price-block">
                    <div className="psv2-price">
                      <span className="psv2-amount">{annuel ? Math.round(p.price * 0.8) : p.price}</span>
                      <div className="psv2-currency">
                        <span>Dh</span>
                        <span>/ mois</span>
                      </div>
                    </div>
                    {annuel && <div className="psv2-annual-note">Facturé {Math.round(p.price * 0.8 * 12)} Dh/an</div>}
                    {p.badge && (
                      <div className="psv2-badge">{p.badge}</div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="psv2-divider" />

                  {/* Features */}
                  <ul className="psv2-features">
                    {p.features.map((f, fi) => (
                      <li key={fi} className="psv2-feature-item">
                        <span className="psv2-check">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to="/abonnements"
                    className={`psv2-cta ${p.highlight ? 'psv2-cta--primary' : 'psv2-cta--ghost'}`}
                  >
                    <span>{p.cta}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>

                  {p.highlight && <div className="psv2-glow" />}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Garanties */}
          <FadeIn delay={200}>
            <div className="psv2-guarantees">
              {[
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: 'Sans engagement' },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.08-6.98"/></svg>, text: 'Résiliation gratuite' },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, text: 'Paiement sécurisé' },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, text: '1er cours offert' },
              ].map((g, i) => (
                <div key={i} className="psv2-guarantee">
                  <div className="psv2-guarantee-icon">{g.icon}</div>
                  <span>{g.text}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════ TESTIMONIALS ════════════════════ */}
      <section className="section testimonials-section">

        <BlurIn>
          <div className="container">
            <div className="section-header">
              <span className="tag">Témoignages</span>
              <h2 className="section-title">
                Elles parlent, <span className="pink-text">elles rayonnent</span>
              </h2>
              <p className="section-subtitle">
                Plus de 5 000 femmes font confiance à Move Like Her au Maroc.
              </p>
            </div>
          </div>
        </BlurIn>

        {/* Rangée 1 — défile vers la gauche */}
        <div className="testi-marquee-wrap">
          <div className="testi-marquee testi-marquee--left">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="testi-scroll-card">
                <div className="testi-scroll-stars">{'★'.repeat(t.rating)}</div>
                <p className="testi-scroll-text">"{t.text}"</p>
                <div className="testi-scroll-author">
                  <div className="testi-scroll-av">{t.avatar}</div>
                  <div>
                    <p className="testi-scroll-name">{t.name}</p>
                    <p className="testi-scroll-city">📍 {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rangée 2 — défile vers la droite (inversée) */}
        <div className="testi-marquee-wrap testi-marquee-wrap--2">
          <div className="testi-marquee testi-marquee--right">
            {[...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials.slice(4), ...testimonials.slice(0, 4)].map((t, i) => (
              <div key={i} className="testi-scroll-card">
                <div className="testi-scroll-stars">{'★'.repeat(t.rating)}</div>
                <p className="testi-scroll-text">"{t.text}"</p>
                <div className="testi-scroll-author">
                  <div className="testi-scroll-av">{t.avatar}</div>
                  <div>
                    <p className="testi-scroll-name">{t.name}</p>
                    <p className="testi-scroll-city">📍 {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </section>

      {/* ── FORMULAIRE INSCRIPTION ── */}
      <section className="form-section" id="inscription">
        <div className="container">
          <div className="form-box">
            <div className="form-box-left">
              <span className="tag">Inscription</span>
              <h2>Je veux rejoindre <span className="pink-text">Move Like Her</span></h2>
              <p>Remplis ce formulaire et notre équipe te contacte sous 24h pour finaliser ton inscription.</p>
              <ul className="form-promises">
                {['Réponse sous 24h garantie', 'Premier cours offert', 'Aucun engagement requis'].map(pr => (
                  <li key={pr}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {pr}
                  </li>
                ))}
              </ul>
            </div>
            {formSent ? (
              <div className="inscri-success">
                <div className="inscri-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3>Demande envoyée !</h3>
                <p>Notre équipe te contacte sous 24h pour finaliser ton inscription. Bienvenue dans la communauté Move Like Her 💪</p>
                <button className="btn-primary" onClick={() => { setFormSent(false); setFormData({ prenom: '', name: '', email: '', telephone: '', ville: 'Casablanca', formule: 'decouverte' }) }}>
                  Nouvelle demande
                </button>
              </div>
            ) : (
              <form className="inscri-form" onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input type="text" name="prenom" value={formData.prenom} onChange={handleFormChange} placeholder="Ton prénom" required />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Ton nom" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="ton@email.com" required />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" name="telephone" value={formData.telephone} onChange={handleFormChange} placeholder="+212 6XX XX XX XX" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ville</label>
                    <select name="ville" value={formData.ville} onChange={handleFormChange}>
                      {['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Formule choisie</label>
                    <select name="formule" value={formData.formule} onChange={handleFormChange}>
                      <option value="decouverte">Découverte — 500 Dh/mois</option>
                      <option value="premium">Premium — 750 Dh/mois</option>
                      <option value="elite">Elite — 1100 Dh/mois</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary form-submit" disabled={formSending}>
                  {formSending ? 'Envoi en cours…' : 'Envoyer ma demande'}
                  {!formSending && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </main>
  )
}
