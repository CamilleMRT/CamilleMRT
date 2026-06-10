import RevealWrapper from './RevealWrapper'

const SERVICES = [
  {
    num: '01',
    title: 'Audit & mise en ligne',
    body: 'Analyse de votre bien, optimisation de l\'annonce et publication sur Airbnb, Booking, Vrbo et plus.',
  },
  {
    num: '02',
    title: 'Tarification dynamique',
    body: 'Algorithme de prix en temps réel qui ajuste vos tarifs chaque nuit selon la demande locale.',
  },
  {
    num: '03',
    title: 'Accueil & check-in',
    body: 'Remise de clés, boîte à clés connectée ou accueil personnalisé selon votre préférence.',
  },
  {
    num: '04',
    title: 'Ménage professionnel',
    body: 'Équipe dédiée, linge hôtelier, produits d\'accueil premium. Le logement est toujours impeccable.',
  },
  {
    num: '05',
    title: 'Assistance voyageurs',
    body: 'Support 24 h/24 pour vos voyageurs, gestion des avis et résolution rapide des incidents.',
  },
  {
    num: '06',
    title: 'Maintenance & SAV',
    body: 'Réseau d\'artisans locaux mobilisable rapidement pour toute intervention dans le logement.',
  },
  {
    num: '07',
    title: 'Reporting mensuel',
    body: 'Tableau de bord en ligne + rapport mensuel détaillé : nuits vendues, revenus, taux d\'occupation.',
  },
  {
    num: '08',
    title: 'Conformité réglementaire',
    body: 'Déclaration en mairie, numéro d\'enregistrement, assurance spécifique locations courte durée.',
  },
]

export default function Services() {
  return (
    <section id="services" className="serv-sec">
      <div className="wrap">
        <div className="serv-grid">
          <RevealWrapper className="serv-head">
            <span className="eyebrow">Nos services</span>
            <h2>
              Tout ce qu&apos;il faut pour{' '}
              <em className="display-italic">louer sereinement</em>
            </h2>
            <p className="lead">
              De la mise en ligne à la gestion quotidienne, nous couvrons
              chaque aspect de votre location courte durée.
            </p>
          </RevealWrapper>

          <RevealWrapper className="serv-list">
            {SERVICES.map((srv) => (
              <div key={srv.num} className="serv-item">
                <span className="serv-num">{srv.num}</span>
                <div>
                  <h3>{srv.title}</h3>
                  <p>{srv.body}</p>
                </div>
              </div>
            ))}
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}
