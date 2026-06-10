import RevealWrapper from './RevealWrapper'

const CHIPS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Intérieur soigné',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M23 7l-7 5 7 5V7z" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Photos professionnelles',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Check-in autonome 24h/24',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Linge hôtelier',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Tarification dynamique',
  },
]

export default function Experience() {
  return (
    <section id="experience" className="exp">
      <div className="wrap">
        <div className="exp-grid">
          <RevealWrapper>
            <span className="eyebrow">L&apos;expérience Late Checkout</span>
            <h2>
              Un séjour{' '}
              <em>mémorable</em>{' '}
              à chaque fois
            </h2>
            <p>
              Nous transformons votre bien en un logement hôtelier de qualité.
              Chaque détail est pensé pour ravir vos voyageurs et obtenir
              des avis 5 étoiles systématiquement.
            </p>

            <div className="exp-chips">
              {CHIPS.map((chip, i) => (
                <span key={i} className="chip">
                  {chip.icon}
                  {chip.label}
                </span>
              ))}
            </div>
          </RevealWrapper>

          <RevealWrapper className="exp-frame">
            <figure className="frame tint-sienna">
              <div className="ph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <figcaption>Appartement Chartrons</figcaption>
            </figure>

            <figure className="frame">
              <div className="ph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <figcaption>Villa Bassin d&apos;Arcachon</figcaption>
            </figure>
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}
