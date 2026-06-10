export default function CtaBand() {
  return (
    <section className="cta-band">
      <div className="wrap">
        <span className="eyebrow" style={{ color: 'rgba(242,235,223,0.7)' }}>
          Prêt à vous lancer ?
        </span>
        <h2>
          Confiez-nous votre bien,{' '}
          <em>récoltez les fruits</em>
        </h2>
        <p>
          Obtenez votre estimation personnalisée en 2 minutes.
          Notre équipe vous contacte sous 24 h pour un audit gratuit
          de votre logement.
        </p>
        <a href="#simulateur" className="btn">
          Simuler mes revenus gratuitement
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ width: 15, height: 15 }}>
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        {/* TODO: Replace with real phone number */}
        <span className="cta-tel">
          Ou appelez-nous directement : <b>+33 5 XX XX XX XX</b>
        </span>
      </div>
    </section>
  )
}
