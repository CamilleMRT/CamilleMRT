import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          {/* Brand col */}
          <div>
            <div className="foot-brand">
              <Logo className="mark" />
              Late Checkout
            </div>
            <p className="foot-tag">
              Conciergerie spécialisée en location courte durée à Bordeaux
              et sa métropole.
            </p>
          </div>

          {/* Contact col */}
          <div className="foot-col">
            <h4>Contact</h4>
            {/* TODO: Replace with real contact info */}
            <a href="mailto:bonjour@latecheckout.fr">bonjour@latecheckout.fr</a>
            <a href="tel:+33500000000">+33 5 XX XX XX XX</a>
            <a href="#top">Bordeaux, Gironde</a>
          </div>

          {/* Navigation col */}
          <div className="foot-col">
            <h4>Navigation</h4>
            <a href="#piliers">Pourquoi nous</a>
            <a href="#experience">L&apos;expérience</a>
            <a href="#formules">Formules</a>
            <a href="#simulateur">Simulateur</a>
          </div>

          {/* Social col */}
          <div className="foot-col">
            <h4>Suivez-nous</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://airbnb.fr" target="_blank" rel="noopener noreferrer">
              Airbnb
            </a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {year} Late Checkout. Tous droits réservés.</span>
          <span>
            <a href="#top" style={{ color: 'inherit', marginRight: 16 }}>Mentions légales</a>
            <a href="#top" style={{ color: 'inherit' }}>Politique de confidentialité</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
