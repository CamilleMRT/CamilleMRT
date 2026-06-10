import RevealWrapper from './RevealWrapper'

// TODO: Replace with real testimonials and verified stats
const STATS = [
  { num: '+40 %', lbl: 'de revenus vs location longue durée' },
  { num: '4,9 ★', lbl: 'Note moyenne voyageurs' },
  { num: '120+', lbl: 'Logements gérés sur Bordeaux' },
]

export default function Proof() {
  return (
    <section id="proof" className="proof-sec">
      <div className="wrap">
        <div className="proof-grid">
          <RevealWrapper>
            <div className="stars" aria-label="5 étoiles">★★★★★</div>
            {/* TODO: Replace with a real owner testimonial */}
            <blockquote>
              &ldquo;Depuis que Late Checkout gère mon appartement, je ne me
              soucie plus de rien. Mes revenus ont augmenté de 38 % et les
              voyageurs laissent systématiquement des avis 5 étoiles.&rdquo;
            </blockquote>
            <div className="quote-author">
              Sophie M.
              <span>Propriétaire, Bordeaux Chartrons</span>
            </div>
          </RevealWrapper>

          <RevealWrapper className="stats">
            {STATS.map((stat, i) => (
              <div key={i} className="stat">
                <div className="num">{stat.num}</div>
                <div className="lbl">{stat.lbl}</div>
              </div>
            ))}
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}
