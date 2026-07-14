# Carnet d'enquête · v1

Application web personnelle (mono-utilisatrice) : suivi d'un protocole digestif
progressif, avec journal quotidien, rappels `.ics`, notifications push, bilan
hebdomadaire et analyse verrouillée.

**Ce n'est pas une app de régime.** Aucun comptage de calories, aucun suivi de
poids, aucun langage punitif. Voir les [garde-fous](#garde-fous).

Le principe qui gouverne toute l'architecture : **une seule variable change à la
fois.** L'escalier, les durées, la stratification par cycle et le verrouillage
de l'analyse n'existent que pour protéger ce principe.

---

## Deux horloges indépendantes

C'est le point d'architecture le plus important, et il est **testé** :

- **Horloge A — le protocole** (`protocolDay`) avance selon la progression, en
  ne comptant que les jours **non pausés**. Démarre le 14 juillet 2026 ; les
  dates de phases sont **calculées**, jamais codées en dur.
- **Horloge B — le cycle** (`cycleDay`) tourne en parallèle, sur le calendrier,
  **indépendamment des pauses**. Elle ne pilote rien : elle stratifie l'analyse
  et alimente les recommandations tactiques.

> Quand un jour est mis en pause, **l'horloge A s'arrête, l'horloge B continue.**
> C'est la garantie centrale, couverte par `lib/domain/protocol.test.ts`.

```bash
npm test        # 33 tests : cycle, découplage pause/cycle, escalier, phases, décision
```

---

## Démarrer

```bash
npm install          # génère aussi le client Prisma (postinstall)
npm run dev          # http://localhost:3000
npm run build && npm start
```

L'app fonctionne **sans base de données** : le stockage local (`localStorage`)
est la source de vérité (offline-first). La base et le push sont des couches
optionnelles.

---

## Variables d'environnement

Copier `.env.example` en `.env` (ou configurer dans Vercel). Résumé :

| Variable | Rôle | Requis |
|---|---|---|
| `DATABASE_URL` | Postgres (Vercel/Supabase), sync + push | Non (local-first sinon) |
| `APP_SECRET` | Protège l'endpoint de sync | Recommandé si DB |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Signature Web Push | Pour le push |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Clé publique côté client | Pour le push |
| `VAPID_SUBJECT` | `mailto:` de contact VAPID | Pour le push |
| `CRON_SECRET` | Protège `/api/cron/notify` | Pour le push |

### Base de données (optionnelle)

```bash
# Après avoir renseigné DATABASE_URL :
npx prisma db push      # crée les tables
```

Le schéma (`prisma/schema.prisma`) **expose proprement** phases de cycle et
phases de protocole pour qu'un moteur de recettes (v2) s'y branche sans refonte.
Aucune fonctionnalité v2 (recettes, moteur de repas, lexique FODMAP) n'est
modélisée ni stubée ici.

### Configuration VAPID (Web Push)

```bash
npx web-push generate-vapid-keys
```

Reporter la clé publique dans **`VAPID_PUBLIC_KEY` et
`NEXT_PUBLIC_VAPID_PUBLIC_KEY`**, la privée dans `VAPID_PRIVATE_KEY`. Puis, dans
l'app : **Réglages → Activer les notifications**.

### Configuration du cron externe

Vercel Hobby ne permet pas plusieurs crons/jour : on utilise **cron-job.org**.
Créer trois tâches (heure locale) appelant :

```
GET https://<domaine>/api/cron/notify?slot=morning&secret=<CRON_SECRET>   # 07:30
GET https://<domaine>/api/cron/notify?slot=snack&secret=<CRON_SECRET>     # 16:00
GET https://<domaine>/api/cron/notify?slot=evening&secret=<CRON_SECRET>   # 21:00
```

Le contenu est **calculé côté serveur** (palier/phase, jour de cycle, journal de
la veille) et ne mentionne que les habitudes débloquées. Si le push échoue
3 jours d'affilée, un bandeau invite à se rabattre sur le `.ics`.

> **Le push est un confort. Le rappel `.ics` ne doit jamais tomber.**

### Import du `.ics`

Dans **Réglages → Calendrier .ics**, télécharger :

1. **Les 3 rappels quotidiens** (07 h 30 · 16 h · 21 h) — événements récurrents
   avec alarme d'affichage. C'est **iOS qui gère l'alarme** : zéro dépendance
   réseau.
2. **Le protocole complet** — jalons (fins de paliers, débuts de phases, fenêtre
   de confirmation). *Projection* : les dates se décalent selon la progression
   réelle.

Ouvrir chaque fichier sur l'iPhone → « Ajouter tous les événements » dans le
calendrier.

---

## Écrans

1. **Aujourd'hui** — palier/phase, cadran du cycle, habitudes cochables, score
   du jour, journal du soir, bouton « Mes règles ont commencé ».
2. **Escalier** — les 4 paliers en marches, acquis/en cours/verrouillés,
   progression 5/7, division du palier après 2 échecs.
3. **Bilan** — hebdomadaire : X/7 par habitude, 4 courbes de symptômes avec le
   jour de cycle en regard, recommandations tactiques.
4. **Analyse** — 🔒 verrouillée pendant une phase. Tableau stratifié, `n`
   visible, cases `n < 4` grisées, lignes lutéales mises en évidence, export.
5. **Réglages** — dates, `.ics`, push, les trois boutons (Pause / Copier la
   synthèse / Réinitialiser), critère de décision figé, critères d'arrêt.

<a id="garde-fous"></a>

## Garde-fous (non négociables)

- **5 jours sur 7**, jamais 7/7, affiché explicitement.
- Aucune série cassable, aucun compteur qui retombe à zéro.
- Aucun rouge sur une journée manquée — une journée vide est simplement grise.
- Un palier raté **se rejoue**, il ne se rattrape pas.
- Aucun comptage de calories, aucun suivi de poids.
- Jamais de langage de restriction en phase lutéale.
- Aucune notification de reproche.

**Critères d'arrêt** (écran dédié) : sang dans les selles · perte de poids
inexpliquée · douleur abdominale sévère · fièvre · vomissements répétés →
consulter un médecin. Ce protocole ne remplace ni le suivi diététique, ni un
bilan gastro-entérologique.

---

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · PWA installable
(`manifest`, service worker, `display: standalone`) · Prisma (Postgres) ·
`web-push` · Vitest. Mobile-first, cible iPhone. Mode clair/sombre.

## Périmètre

**Dans la v1 :** escalier · journal · `.ics` · push · bilan · recommandations
tactiques · analyse verrouillée · export.

**Pas dans la v1 (v2 après usage réel) :** bibliothèque de recettes · moteur de
suggestion de repas · créateur de recettes · lexique FODMAP. Le modèle de
données leur laisse la place, sans les construire.

---

*Ce projet encode les recommandations d'une diététicienne-nutritionniste
(bilan du 10/07/2026) et la recherche sur le SII, les FODMAP (Monash University)
et le cycle menstruel.*
