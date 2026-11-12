# CLAUDE.md

Ce fichier donne à Claude le contexte nécessaire pour travailler efficacement sur ce dépôt.
Il décrit l'**état réel** du code (branche `feat/call-api`), pas l'état cible.

## Projet

**SOCADL** — front-end d'une plateforme de supervision temps réel du réseau de distribution électrique (type "salle de contrôle") pour l'opérateur SOCADL au Cameroun, avec suivi de la conformité ARSEL.
Ce dépôt contient **uniquement le front-end**. Le backend (NestJS, API REST + WebSocket) est un service séparé.
Voir `ARCHITECTURE (1).md` pour le détail fonctionnel (à renommer en `ARCHITECTURE.md`).

### État actuel (nov. 2026)
**L'intégration API/temps réel est en cours, ce n'est plus une maquette statique.**
Les mocks ont été supprimés (commit `29fbca7`) au profit d'appels réels :
- REST via `lib/api-client.ts` → `services/index.ts`
- Télémétrie live via Socket.IO (`lib/socket.ts`, hook `hooks/use-live-telemetry.ts`)
- Le tableau de bord fusionne une base de sites codée en dur (`MOCK_SITES_BASE` dans
  `app/(dashboard)/page.tsx`) avec les mesures WebSocket, en attendant `GET /dashboard/summary`.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 3 + shadcn/ui (Radix) — **seules 4 dépendances Radix sont installées**
  (`dropdown-menu`, `label`, `select`, `switch`) malgré ~50 fichiers dans `components/ui/`
  hérités du template. Ne pas importer un composant `ui/` dont la dépendance Radix
  correspondante n'est pas dans `package.json` sans l'installer d'abord.
- Recharts (graphiques), Leaflet/react-leaflet (carte réseau), lucide-react (icônes)
- `socket.io-client` pour le temps réel. `swr` est installé mais **non utilisé** à ce jour.
- `nextjs-toploader` pour l'indicateur de navigation.

## Commandes utiles

```bash
npm run dev      # démarre le serveur de dev (localhost:3000)
npm run build    # build de production
npm run lint     # ESLint
```

Configuration : variables dans `.env.local` (voir `.env.local.example`).
**Incohérence connue à harmoniser** : `.env.local.example` pointe `http://localhost:8000/api/v1`,
`lib/api-client.ts` retombe sur `http://localhost:3001`, et l'URL WebSocket est codée en dur
(`https://socadel-back-end.onrender.com` dans `lib/socket.ts`) — à externaliser en variable d'env.

## Arborescence

```
app/
  (auth)/            routes publiques : login, register, forgot/reset-password, oauth-consent
  (dashboard)/       routes protégées : page.tsx (dashboard), sites/, sites/[id],
                     maintenance, interventions, inventaire, statistiques-zones,
                     tableau-performance, rapports, alertes, configuration-systeme, parametres
  api/               Route Handlers (auth, kpis, sites) — STUBS, renvoient "Not implemented yet"
  layout.tsx, globals.css, not-found.tsx
components/
  ui/                 composants shadcn/ui génériques (ne pas les modifier)
  layout/             sidebar, header, auth-layout, mobile-nav, page-loader, ...
  dashboard/          composants métier : kpi-card, site-map (+ leaflet-map-inner),
                      status-badge, circular-gauge, min-max-card, trend-chart,
                      activity-feed, period-filter, zone-selector
hooks/
  use-live-telemetry.ts   seul hook fonctionnel (voir Temps réel)
  use-sites.ts, use-kpis.ts, use-mobile.ts, use-realtime-status.ts, use-size.ts
                          → fichiers VIDES (0 octet), placeholders à implémenter ou supprimer
lib/
  api-client.ts       client fetch REST (GET/POST/PUT/DELETE, dépaquète `{ data }`)
  socket.ts           singleton Socket.IO
  mock-data.ts        données de démonstration (ActivityEvent[], TrendPoint[]) pour le dashboard
  types.ts, auth-context.tsx, query-client.ts, grid-utils.ts, app-params.ts,
  auth-return-to.ts, export-utils.ts, utils.ts
                      → types.ts, auth-context.tsx, query-client.ts, grid-utils.ts sont VIDES ;
                          les types réels vivent dans `services/index.ts`
  types.ts            vide — les types partagés (SiteRow, Equipment, AlertRule, ZoneStats...)
                      sont définis dans `services/index.ts` (voir Conventions)
middleware.ts         TODO — actuellement no-op (voir Rôles et accès)
services/index.ts     types métier + couche d'appels API (`api.getSites()`, ...)
```

## Flux de données réel

### REST
`lib/api-client.ts` construit l'URL depuis `NEXT_PUBLIC_API_BASE_URL` (défaut `http://localhost:3001`),
envoie en `cache: "no-store"`, et dépaquète l'enveloppe NestJS `{ success, data }` → retourne `data`.
`services/index.ts` expose les appels métier (`api.getDashboardSummary`, `getSites`, `getEquipment`,
`getAlertRules`, `getZoneStats`, `getEvolutionData`, `getPerformance`, `getInterventions`,
`getUsers`, `getSystemConfig`, …). **Ne pas appeler `fetch` directement depuis un composant** :
passer par `lib/api-client.ts` et, si besoin, un hook dans `hooks/`.

⚠️ L'objectif documenté (« aucun appel navigateur direct, tout passe par `app/api/*` ») n'est
**pas encore appliqué** : le navigateur appelle le backend directement, et `app/api/kpis`,
`app/api/sites` sont des stubs. Ne pas supposer qu'une couche BFF existe.

### Temps réel (Socket.IO)
- `lib/socket.ts` : singleton `getSocket()`, transports `websocket` + `polling`, `withCredentials`.
- `hooks/use-live-telemetry.ts` : écoute `telemetry_update` (tension, fréquence, courant, THD,
  température, charge) et `status_update` (online/offline), indexés par `siteId`.
  Le payload backend est en snake_case (`voltage_kv`, `frequency_hz`, `current_ka`, `thd_pct`,
  `temperature_c`, `load_pct`, `device_id`) — le hook normalise vers camelCase et convertit
  `voltage_kv → tensionV` (×1000).
- **IDs de sites critiques** : les ids (`ESP32-5CD57CA99B2`, `douala`, …) doivent rester
  synchronisés avec le registre de sites backend et le `DEVICE_ID` de chaque ESP32, sinon la
  télémétrie live ne se raccroche à aucun marqueur de la carte.

## Conventions à respecter impérativement

### Design system
- Ne jamais utiliser de blanc pur (`#fff`) ni de gris froid. Fond crème `hsl(36 33% 96%)`,
  cartes `hsl(40 44% 99%)`, accent orange `hsl(24 85% 50%)` (définis dans `tailwind.config.ts`).
- Toute valeur numérique (KPI, jauge, tableau, horodatage) doit utiliser la police mono
  (`font-mono`) avec `tabular-nums` (Inter + JetBrains Mono).
- Un statut (fonctionnel / batterie / panne) doit toujours combiner icône + texte + couleur —
  jamais la couleur seule.
- Flat design : pas de `box-shadow` lourd, pas de dégradés. La hiérarchie visuelle vient des
  fonds de carte, bordures 1px et typographie.

### Architecture
- Les pages (`app/**/page.tsx`) sont des **Server Components** par défaut. N'ajouter `"use client"`
  que si le composant a besoin d'état, d'effets, ou d'une API navigateur (Leaflet, formulaires,
  filtres interactifs).
- Les composants métier réutilisables vivent dans `components/dashboard/`. Les composants
  shadcn génériques restent inchangés dans `components/ui/`.
- Leaflet doit toujours être importé en dynamique avec `ssr: false` (a besoin de `window`) —
  voir `components/dashboard/site-map.tsx` / `leaflet-map-inner.tsx`.
- Ne pas remonter la logique métier (calcul d'usure, seuils d'alerte, agrégation
  SAIDI/SAIFI/CAIDI) dans les composants de présentation — elle doit rester dans `lib/`.

### Types et données
- Les types partagés sont définis dans `services/index.ts` (`SiteRow`, `Equipment`,
  `InterventionTicket`, `AlertRule`, `ZoneStats`, `User`, …). C'est là qu'ils vivent
  aujourd'hui — `lib/types.ts` est vide. Ne pas dupliquer d'interfaces locales pour ces entités.
- Ne jamais coupler un composant visuel directement à la source de données : passer par
  `services/index.ts` / `lib/api-client.ts` ou un hook `hooks/use-*.ts`.
- **Gestion de la latence :** Le projet utilise `app/(dashboard)/loading.tsx` avec `PageLoader`
  pour gérer le chargement global des pages. Le composant `Skeleton` (`components/ui/skeleton.tsx`)
  est disponible pour des placeholders plus fins (KPI, graphiques) lors des requêtes côté client.

### Rôles et accès — ⚠️ non implémentés
- Les rôles réels du code sont `Administrateur`, `Technicien`, `Lecture ARSEL`
  (libellés affichés, cf. `components/layout/sidebar.tsx`) — pas les slugs `admin` / `technicien` /
  `lecture_arsel`.
- Le rôle `Lecture ARSEL` doit être **lecture seule partout** : ne jamais lui exposer d'action
  de modification (même désactivée visuellement — la logique métier doit aussi bloquer côté serveur).
- ⚠️ **Aucune protection n'est active** : `middleware.ts` est un TODO (matcher vide, no-op),
  `lib/auth-context.tsx` est vide, et `app/api/*` sont des stubs. Ne pas considérer l'accès
  par rôle comme sécurisé tant que ce n'est pas câblé.

## Ce qu'il ne faut pas faire

- Ne pas introduire de nouvelle librairie de composants UI en plus de shadcn/ui sans demande explicite.
- Ne pas casser la convention de nommage des routes existante (kebab-case, en français, alignée
  sur le cahier des charges — ex. `statistiques-zones`, `configuration-systeme`, `tableau-performance`).
- Ne pas ajouter de `console.log` de debug dans le code temps réel — `lib/socket.ts` et
  `hooks/use-live-telemetry.ts` en contiennent encore, à nettoyer.
- Ne pas laisser d'URL backend codée en dur : utiliser `NEXT_PUBLIC_API_BASE_URL` (et une
  variable dédiée pour le WebSocket).
- Ne pas importer un composant de `components/ui/` dont la dépendance Radix n'est pas installée.

## Points de vigilance / dette connue

1. Fichiers vides à implémenter ou supprimer : `hooks/use-sites.ts`, `use-kpis.ts`, `use-mobile.ts`,
   `use-realtime-status.ts`, `use-size.ts`, `lib/types.ts`, `lib/auth-context.tsx`,
   `lib/query-client.ts`, `lib/grid-utils.ts`.
2. `middleware.ts` + `app/api/*` : protection par rôle et couche BFF à construire.
3. Variables d'environnement incohérentes (ports 8000 vs 3001 vs URL Render codée en dur).
4. `swr` installé mais inutilisé — les hooks « métier » sont vides ; le scraping de données
   se fait via `fetch` direct + WebSocket.
5. Renommer `ARCHITECTURE (1).md` en `ARCHITECTURE.md` (espace et parenthèses gênent les liens).
