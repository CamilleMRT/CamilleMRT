import Logo from './Logo'
import RevealWrapper from './RevealWrapper'

const PILIERS = [
  {
    title: 'Gestion sans faille',
    body: 'Annonces optimisées sur toutes les plateformes, tarification dynamique, ménage professionnel et linge hôtelier — nous prenons tout en charge pour maximiser votre taux d\'occupation.',
  },
  {
    title: 'Revenus garantis',
    body: 'Notre stratégie de prix en temps réel ajuste vos tarifs chaque nuit selon la demande locale. Résultat : jusqu\'à 40 % de revenus supplémentaires par rapport à une gestion classique.',
  },
  {
    title: 'Tranquillité totale',
    body: 'Un interlocuteur dédié, disponible 7 j/7. Check-in autonome ou accueil personnalisé, assistance voyageurs 24 h/24, et reporting mensuel détaillé pour suivre vos performances.',
  },
]

export default function Piliers() {
  return (
    <section id="piliers">
      <div className="wrap">
        <RevealWrapper className="piliers-head">
          <span className="eyebrow">Pourquoi nous choisir</span>
          <h2>
            La conciergerie qui fait{' '}
            <em className="display-italic">vraiment</em> la différence
          </h2>
        </RevealWrapper>

        <div className="grid-3">
          {PILIERS.map((pilier, i) => (
            <RevealWrapper key={i} className="pilier" style={{ transitionDelay: `${i * 0.12}s` } as React.CSSProperties}>
              <Logo className="mark" />
              <h3>{pilier.title}</h3>
              <p>{pilier.body}</p>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
