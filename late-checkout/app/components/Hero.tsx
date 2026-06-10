export default function Hero() {
  return (
    <section className="hero" id="top">
      {/* Gradient background — replace with next/image when a real photo is available */}
      <div className="hero-media" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

      <div className="wrap hero-inner">
        <span className="eyebrow" style={{ color: 'var(--sienna-light)' }}>
          Conciergerie Bordeaux
        </span>

        <h1 className="hero-wordmark">
          Late<br />Checkout
        </h1>

        <p className="hero-bench">
          Votre bien loué{' '}
          <em>sans effort</em>,<br />
          vos revenus <em>maximisés</em>.
        </p>

        <p className="hero-sub">
          Nous gérons intégralement votre location courte durée — de la
          mise en ligne à l&apos;accueil des voyageurs — pour que vous
          profitiez de vos revenus sans vous soucier des détails.
        </p>

        <div className="hero-cta">
          <a href="#simulateur" className="btn btn-primary">
            Estimer mes revenus
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#formules" className="btn btn-outline">
            Voir les formules
          </a>
        </div>
      </div>

      <span className="hero-credit" aria-hidden="true">
        Bordeaux, Gironde
      </span>
    </section>
  )
}
