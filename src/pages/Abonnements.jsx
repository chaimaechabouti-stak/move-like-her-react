import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { abonnements as abosApi, stripe as stripeApi, demandes } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useInView } from '../hooks/useInView'
import './Abonnements.css'

const PLAN_MEMBERS = [842, 1640, 528]
const VILLES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir']

/* ── Plan card ── */
function PlanCard({ plan: p, index: i, annual, planIcon, onPay, paying }) {
  const [ref, inView] = useInView(0.1)
  const variants = ['plan-reveal--left', 'plan-reveal--up', 'plan-reveal--right']
  const membersCount = PLAN_MEMBERS[i] ?? 300

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

        <div className="plan-members-count">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
            <circle cx="17" cy="7" r="3"/><path d="M21 21v-2a3 3 0 00-2-2.83"/>
          </svg>
          <strong>{membersCount.toLocaleString('fr-MA')}</strong> membres actives
        </div>

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
            <><span className="plan-btn-spinner" />Redirection…</>
          ) : (
            <>{p.cta}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg></>
          )}
        </button>
      </div>
    </div>
  )
}

/* ── Modal paiement ── */
function PayModal({ plan, annual, onClose, onConfirm, paying }) {
  const { user } = useAuth()
  const [step, setStep] = useState(1) // 1=infos, 2=confirmation
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    name:   user?.name   || '',
    email:  user?.email  || '',
    telephone: '',
    ville: '',
  })
  const [error, setError] = useState('')
  const backdropRef = useRef(null)

  const price = annual
    ? (plan.priceAnn ? Math.round(plan.priceAnn / 12) : Math.round(plan.price * 0.8))
    : plan.price

  const totalPrice = annual
    ? (plan.priceAnn || Math.round(plan.price * 0.8 * 12))
    : plan.price

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleStep1 = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.prenom || !form.name || !form.email) {
      setError('Merci de remplir tous les champs obligatoires.')
      return
    }
    try {
      await demandes.envoyer({ ...form, source: 'abonnement', plan: plan.name })
    } catch { /* silencieux */ }
    setStep(2)
  }

  const handlePay = () => {
    onConfirm(plan, annual)
  }

  return (
    <div className="pay-modal-backdrop" ref={backdropRef} onClick={e => e.target === backdropRef.current && onClose()}>
      <div className="pay-modal">

        {/* Header */}
        <div className="pay-modal-header">
          <div className="pay-modal-plan-badge">
            <span className="pay-modal-plan-name">{plan.name}</span>
            <span className="pay-modal-plan-price">
              {price} Dh<span>/mois</span>
              {annual && <span className="pay-modal-annual-tag">Annuel −20%</span>}
            </span>
          </div>
          <button className="pay-modal-close" onClick={onClose} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Étapes */}
        <div className="pay-modal-steps">
          <div className={`pay-modal-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            {step > 1
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <span>1</span>
            }
            Tes informations
          </div>
          <div className="pay-modal-step-line" />
          <div className={`pay-modal-step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            Paiement
          </div>
        </div>

        {/* Étape 1 — Formulaire */}
        {step === 1 && (
          <form className="pay-modal-form" onSubmit={handleStep1} noValidate>
            {error && (
              <div className="pay-modal-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            <div className="pay-modal-row">
              <div className="pay-modal-field">
                <label>Prénom *</label>
                <input placeholder="Fatima" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
              </div>
              <div className="pay-modal-field">
                <label>Nom *</label>
                <input placeholder="Alaoui" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
            </div>
            <div className="pay-modal-field">
              <label>Email *</label>
              <input type="email" placeholder="ton@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="pay-modal-row">
              <div className="pay-modal-field">
                <label>Téléphone</label>
                <input type="tel" placeholder="+212 6XX XX XX XX" value={form.telephone} onChange={e => set('telephone', e.target.value)} />
              </div>
              <div className="pay-modal-field">
                <label>Ville</label>
                <select value={form.ville} onChange={e => set('ville', e.target.value)}>
                  <option value="">Choisir…</option>
                  {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="pay-modal-btn-primary">
              Continuer vers le paiement
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </form>
        )}

        {/* Étape 2 — Confirmation */}
        {step === 2 && (
          <div className="pay-modal-confirm">
            <div className="pay-modal-summary">
              <div className="pay-modal-summary-row">
                <span>Formule</span>
                <strong>{plan.name}</strong>
              </div>
              <div className="pay-modal-summary-row">
                <span>Fréquence</span>
                <strong>{annual ? 'Annuelle' : 'Mensuelle'}</strong>
              </div>
              <div className="pay-modal-summary-row">
                <span>Prix mensuel</span>
                <strong>{price} Dh</strong>
              </div>
              {annual && (
                <div className="pay-modal-summary-row pay-modal-summary-total">
                  <span>Total facturé</span>
                  <strong>{totalPrice} Dh / an</strong>
                </div>
              )}
            </div>

            <div className="pay-modal-secure">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Paiement 100% sécurisé via Stripe
            </div>

            <div className="pay-modal-actions">
              <button className="pay-modal-btn-primary" onClick={handlePay} disabled={paying === plan.id}>
                {paying === plan.id
                  ? <><span className="plan-btn-spinner" />Redirection…</>
                  : <>Payer maintenant <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></>
                }
              </button>
            </div>

            <button className="pay-modal-back" onClick={() => setStep(1)}>
              ← Modifier mes informations
            </button>
          </div>
        )}
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
  const [annual, setAnnual]     = useState(false)
  const [openFaq, setOpenFaq]   = useState(null)
  const [plans, setPlans]       = useState([])
  const [paying, setPaying]     = useState(null)
  const [payError, setPayError] = useState('')
  const [modal, setModal]       = useState(null) // plan sélectionné

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    abosApi.list().then(data => {
      const arr = Array.isArray(data) ? data : (data.data ?? [])
      setPlans(arr.filter(a => a.actif !== false).map(toCard))
    }).catch(() => {})
  }, [])

  // Bloque le scroll quand le modal est ouvert
  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modal])

  const handleOpenModal = (plan, isAnnual) => {
    if (!user) { navigate('/login?redirect=/abonnements'); return }
    setPayError('')
    setModal({ plan, annual: isAnnual })
  }

  const handleConfirmPay = async (plan, isAnnual) => {
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

      {/* Modal paiement */}
      {modal && (
        <PayModal
          plan={modal.plan}
          annual={modal.annual}
          paying={paying}
          onClose={() => setModal(null)}
          onConfirm={handleConfirmPay}
        />
      )}

      {/* ── HERO ── */}
      <section className="abos-hero">
        <div className="abos-hero-overlay" />
        <div className="abos-hero-content container">
          <span className="sv-tag">Move Like Her · Abonnements</span>
          <h1 className="abos-hero-title">Des formules <span>pour toutes</span></h1>
          <div className="sv-hero-stats">
            <div><strong>4</strong><span>formules disponibles</span></div>
            <div><strong>0</strong><span>engagement requis</span></div>
            <div><strong>−20%</strong><span>en annuel</span></div>
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
          <div className="abos-toggle-wrap abos-toggle-center">
            <span className={!annual ? 'abos-toggle-label active' : 'abos-toggle-label'}>Mensuel</span>
            <button className={`abos-toggle-btn ${annual ? 'on' : ''}`} onClick={() => setAnnual(!annual)}>
              <span className="abos-toggle-knob" />
            </button>
            <span className={annual ? 'abos-toggle-label active' : 'abos-toggle-label'}>
              Annuel <span className="abos-saving">−20%</span>
            </span>
          </div>
          <div className="plans-grid-full">
            {plans.map((p, i) => (
              <PlanCard
                key={p.id} plan={p} index={i} annual={annual}
                planIcon={planIcons[i]} onPay={handleOpenModal} paying={paying}
              />
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
              <Link to="/contact" className="btn-primary faq-cta">Nous contacter</Link>
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

    </main>
  )
}
