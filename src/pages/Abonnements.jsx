import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { abonnements as abosApi, stripe as stripeApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useInView } from '../hooks/useInView'
import './Abonnements.css'

/* ── Plan card with scroll reveal ── */
function PlanCard({ plan: p, index: i, annual, planIcon, onPay, paying }) {
  const [ref, inView] = useInView(0.1)
  const variants = ['plan-reveal--left', 'plan-reveal--up', 'plan-reveal--right']

  return (
    <div
      ref={ref}
      className={`plan-reveal ${variants[i]} ${inView ? 'plan-reveal--visible' : ''} ${p.highlight ? 'plan-col--highlight' : ''}`}
      style={{ transitionDelay: `${i * 120}ms` }}
    >
      <div className={`plan-card-full ${p.highlight ? 'highlight' : ''}`}>
        {p.highlight && (
          <div className="plan-ribbon">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Populaire
          </div>
        )}
        {p.highlight && <div className="plan-glow" />}

        <div className="plan-icon-wrap">{planIcon}</div>
        <div className="plan-name-full">{p.name}</div>

        <div className="plan-price-full">
          <span className="price-big">{annual ? (p.priceAnn ? Math.round(p.priceAnn / 12) : Math.round(p.price * 0.8)) : p.price}</span>
          <div className="price-info">
            <span className="price-dh">Dh</span>
            <span className="price-mo">/ mois</span>
          </div>
        </div>
        {annual && <div className="plan-annual-note">Facturé annuellement</div>}

        <div className="plan-divider" />

        <ul className="plan-features-full">
          {p.features.map(f => (
            <li key={f}>
              <span className="feat-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          className={`plan-btn ${p.highlight ? 'plan-btn--primary' : 'plan-btn--ghost'}`}
          onClick={() => onPay(p, annual)}
          disabled={paying === p.id}
        >
          {paying === p.id ? (
            <>
              <span className="plan-btn-spinner" />
              Redirection…
            </>
          ) : (
            <>
              {p.cta}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

const faqs = [
  { q: 'Y a-t-il un engagement ?', r: 'Non ! Toutes nos formules sont sans engagement. Tu peux résilier à tout moment, sans frais.' },
  { q: 'Puis-je accéder à plusieurs salles ?', r: 'Avec les offres Premium et Elite, tu accèdes à toutes nos salles partout au Maroc.' },
  { q: 'Les cours collectifs sont-ils inclus ?', r: 'Oui ! Dès l\'offre Découverte, tu bénéficies de 2 cours collectifs par semaine.' },
  { q: 'Comment s\'inscrire ?', r: 'Remplis le formulaire ci-dessous, notre équipe te contacte sous 24h pour finaliser ton inscription.' },
  { q: 'Puis-je changer de formule ?', r: 'Oui, à tout moment. Tu peux upgrader ou downgrader ta formule depuis l\'application ou en salle.' },
]

const planIcons = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" strokeLinecap="round"/></svg>,
]

const avantages = [
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 22V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><path d="M2 22h20"/><path d="M10 22V16h4v6"/><path d="M10 10h4"/></svg>, title: 'Vestiaires & douches', desc: 'Des espaces propres, sécurisés et confortables pour ton bien-être.' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01M8 6h8M8 10h8M8 14h4" strokeLinecap="round"/></svg>, title: 'Application Move Like Her', desc: 'Suis tes progrès, réserve tes cours et gère ton abonnement.' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>, title: 'Espace 100% féminin', desc: 'Un environnement sûr, bienveillant et sans regard masculin.' },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>, title: 'Bilan fitness offert', desc: 'Un bilan corporel à l\'inscription pour définir tes objectifs.' },
]

/* Adapter API → format attendu par PlanCard */
function toCard(a) {
  return {
    id:        a.id,
    name:      a.nom,
    price:     a.prix_mensuel,
    priceAnn:  a.prix_annuel,
    features:  Array.isArray(a.fonctionnalites) ? a.fonctionnalites : [],
    highlight: !!a.populaire,
    cta:       a.cta_texte || "Je m'inscris",
    couleur:   a.couleur,
  }
}

export default function Abonnements() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [plans, setPlans] = useState([])
  const [paying, setPaying] = useState(null)
  const [payError, setPayError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    abosApi.list().then(data => {
      const arr = Array.isArray(data) ? data : (data.data ?? [])
      setPlans(arr.filter(a => a.actif !== false).map(toCard))
    }).catch(() => {})
  }, [])

  const handlePay = async (plan, isAnnual) => {
    if (!user) { navigate('/login?redirect=/abonnements'); return }
    setPaying(plan.id)
    setPayError('')
    try {
      const { url } = await stripeApi.createCheckout({
        abonnement_id: plan.id,
        frequence:     isAnnual ? 'annuel' : 'mensuel',
      })
      window.location.href = url
    } catch (e) {
      setPayError(e.message || 'Erreur lors du paiement.')
      setPaying(null)
    }
  }

  return (
    <main className="page-abos">

      {/* ── HERO ── */}
      <section className="abos-hero">
        <div className="abos-hero-bg" />
        <div className="abos-hero-overlay" />
        <div className="abos-hero-orb abos-hero-orb-1" />
        <div className="abos-hero-orb abos-hero-orb-2" />
        <div className="container abos-hero-content">
          <span className="tag">Tarifs</span>
          <h1 className="abos-hero-title">Des formules <span className="pink-text">pour toutes</span></h1>
          <p className="abos-hero-desc">Sans engagement, sans surprise. Choisis la formule qui te correspond et commence dès aujourd'hui.</p>
          <div className="abos-toggle-wrap">
            <span className={!annual ? 'abos-toggle-label active' : 'abos-toggle-label'}>Mensuel</span>
            <button className={`abos-toggle-btn ${annual ? 'on' : ''}`} onClick={() => setAnnual(!annual)}>
              <span className="abos-toggle-knob" />
            </button>
            <span className={annual ? 'abos-toggle-label active' : 'abos-toggle-label'}>
              Annuel <span className="abos-saving">−20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="plans-full">
        <div className="container">
          {payError && (
            <div className="abos-pay-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {payError}
            </div>
          )}
          <div className="plans-grid-full">
            {plans.map((p, i) => (
              <PlanCard key={p.id} plan={p} index={i} annual={annual} planIcon={planIcons[i]} onPay={handlePay} paying={paying} />
            ))}
          </div>

          <div className="plans-guarantee">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: 'Sans engagement' },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: 'Résiliable à tout moment' },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: '5000+ membres actives' },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, label: '100% féminin' },
            ].map(g => (
              <div key={g.label} className="guarantee-item">
                <span className="guarantee-icon">{g.icon}</span>
                <span>{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="avantages-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Inclus partout</span>
            <h2 className="section-title">Dans toutes les <span className="pink-text">formules</span></h2>
          </div>
          <div className="avantages-grid">
            {avantages.map(a => (
              <div key={a.title} className="avantage-card">
                <div className="av-icon">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-layout">
            <div className="faq-left">
              <span className="tag">FAQ</span>
              <h2 className="section-title">Questions <span className="pink-text">fréquentes</span></h2>
              <p className="faq-sub">Tu as d'autres questions ? Notre équipe est disponible 7j/7.</p>
              <Link to="#inscription" className="btn-primary faq-cta">Nous contacter</Link>
            </div>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div key={f.q} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="faq-question">
                    <span>{f.q}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="faq-chevron">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  {openFaq === i && <p className="faq-answer">{f.r}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE ── */}
      

    </main>
  )
}
