import RevealWrapper from './RevealWrapper'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const FORMULES = [
  {
    name: 'Sérénité',
    who: 'Pour les propriétaires qui veulent une gestion 100 % déléguée.',
    price: '20 %',
    priceNote: 'des revenus TTC',
    featured: false,
    feats: [
      { text: 'Mise en ligne multi-plateformes', on: true },
      { text: 'Tarification dynamique', on: true },
      { text: 'Accueil & check-in', on: true },
      { text: 'Ménage & linge hôtelier', on: true },
      { text: 'Assistance voyageurs 24h/24', on: true },
      { text: 'Reporting mensuel', on: true },
      { text: 'Maintenance & SAV', on: true },
      { text: 'Shooting photo professionnel', on: false },
    ],
    cta: 'Choisir Sérénité',
    ctaClass: 'btn btn-ghost',
  },
  {
    name: 'Essentiel',
    who: 'Notre formule la plus populaire, idéale pour démarrer.',
    price: '15 %',
    priceNote: 'des revenus TTC',
    featured: true,
    badge: 'Le plus choisi',
    feats: [
      { text: 'Mise en ligne multi-plateformes', on: true },
      { text: 'Tarification dynamique', on: true },
      { text: 'Accueil & check-in', on: true },
      { text: 'Ménage & linge hôtelier', on: true },
      { text: 'Assistance voyageurs 24h/24', on: true },
      { text: 'Reporting mensuel', on: true },
      { text: 'Maintenance & SAV', on: false },
      { text: 'Shooting photo professionnel', on: false },
    ],
    cta: 'Choisir Essentiel',
    ctaClass: 'btn btn-primary',
  },
  {
    name: 'Prestige',
    who: 'Pour un positionnement haut de gamme et une visibilité maximale.',
    price: '25 %',
    priceNote: 'des revenus TTC',
    featured: false,
    feats: [
      { text: 'Mise en ligne multi-plateformes', on: true },
      { text: 'Tarification dynamique', on: true },
      { text: 'Accueil & check-in', on: true },
      { text: 'Ménage & linge hôtelier', on: true },
      { text: 'Assistance voyageurs 24h/24', on: true },
      { text: 'Reporting mensuel', on: true },
      { text: 'Maintenance & SAV', on: true },
      { text: 'Shooting photo professionnel', on: true },
    ],
    cta: 'Choisir Prestige',
    ctaClass: 'btn btn-ghost',
  },
]

export default function Formules() {
  return (
    <section id="formules">
      <div className="wrap">
        <RevealWrapper className="form-head">
          <span className="eyebrow">Nos formules</span>
          <h2>
            Des offres <em className="display-italic">transparentes</em>,{' '}
            sans frais cachés
          </h2>
          <p>
            Choisissez la formule adaptée à vos besoins. Notre commission
            s&apos;applique uniquement sur les revenus générés — pas de frais
            si votre logement ne se loue pas.
          </p>
        </RevealWrapper>

        <div className="grid-form">
          {FORMULES.map((formule) => (
            <RevealWrapper key={formule.name} className={`card-form${formule.featured ? ' feat' : ''}`}>
              {formule.badge && (
                <span className="badge">{formule.badge}</span>
              )}
              <h3>{formule.name}</h3>
              <p className="who">{formule.who}</p>
              <div className="price">
                {formule.price}
                <small> {formule.priceNote}</small>
              </div>
              <ul className="feats">
                {formule.feats.map((feat, i) => (
                  <li key={i} className={feat.on ? '' : 'off'}>
                    {feat.on ? <CheckIcon /> : <XIcon />}
                    {feat.text}
                  </li>
                ))}
              </ul>
              <a href="#simulateur" className={formule.ctaClass}>
                {formule.cta}
              </a>
            </RevealWrapper>
          ))}
        </div>

        <p className="form-note">
          Engagement sans durée minimale. Résiliation avec 30 jours de préavis.{' '}
          <a href="#simulateur" className="link-arrow">
            Estimer mes revenus
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ width: 14, height: 14 }}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </p>
      </div>
    </section>
  )
}
