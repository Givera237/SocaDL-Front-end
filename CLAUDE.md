# CLAUDE.md

Ce fichier donne à Claude le contexte nécessaire pour travailler efficacement sur ce dépôt.

## Projet

**SOCADL** — front-end d'une plateforme de supervision temps réel du réseau de distribution électrique (type "salle de contrôle") pour l'opérateur SOCADL au Cameroun, avec suivi de la conformité ARSEL. Voir `ARCHITECTURE.md` pour le détail complet.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS + shadcn/ui (Radix)
- Recharts (graphiques), Leaflet/react-leaflet (carte réseau)
- SWR pour le data fetching client

## Commandes utiles

```bash
npm run dev      # démarre le serveur de dev (localhost:3000)
npm run build    # build de production
npm run lint     # ESLint
```

## Conventions à respecter impérativement

### Design system
- Ne jamais utiliser de blanc pur (`#fff`) ni de gris froid. Fond crème `hsl(36 33% 96%)`, cartes `hsl(40 44% 99%)`, accent orange `hsl(24 85% 50%)`.
- Toute valeur numérique (KPI, jauge, tableau, horodatage) doit utiliser la police mono (`font-mono`) avec `tabular-nums`.
- Un statut (fonctionnel / batterie / panne) doit toujours combiner icône + texte + couleur — jamais la couleur seule.
- Flat design : pas de `box-shadow` lourd, pas de dégradés. La hiérarchie visuelle vient des fonds de carte, bordures 1px et typographie.

### Architecture
- Les pages (`app/**/page.tsx`) sont des **Server Components** par défaut. N'ajouter `"use client"` que si le composant a besoin d'état, d'effets, ou d'une API navigateur (Leaflet, formulaires, filtres interactifs).
- Aucun appel direct du navigateur vers l'API backend externe. Tout appel passe par un Route Handler dans `app/api/*`.
- Les composants métier réutilisables (jauges, cartes KPI, badges de statut) vivent dans `components/dashboard/`. Les composants shadcn génériques restent inchangés dans `components/ui/`.
- Les types partagés (Site, Alerte, Intervention, Kpi...) sont centralisés dans `lib/types.ts` — ne pas dupliquer d'interfaces locales pour ces entités.
- Leaflet doit toujours être importé en dynamique avec `ssr: false` (a besoin de `window`).

### Data
- Le projet est actuellement en phase de maquette statique : les données viennent de `lib/mock-data.ts`.
- Quand une vraie API sera branchée, la bascule doit se faire uniquement dans les hooks (`hooks/use-*.ts`) ou dans `lib/api-client.ts` — **ne jamais coupler un composant visuel directement à la source de données**.

### Rôles et accès
- Trois rôles : `admin`, `technicien`, `lecture_arsel`. Le rôle `lecture_arsel` est **lecture seule partout**, ne jamais lui exposer d'action de modification (même désactivée visuellement — la logique métier doit aussi bloquer côté serveur).
- Le contrôle d'accès par rôle passe par `middleware.ts` (blocage avant rendu) et par l'affichage conditionnel dans `components/layout/sidebar.tsx`.

## Ce qu'il ne faut pas faire

- Ne pas introduire de nouvelle librairie de composants UI en plus de shadcn/ui sans demande explicite.
- Ne pas remonter la logique métier (calcul d'usure, seuils d'alerte, agrégation SAIDI/SAIFI/CAIDI) dans les composants de présentation — elle doit rester dans `lib/`.
- Ne pas casser la convention de nommage des routes existante (kebab-case, en français, alignée sur le cahier des charges — ex. `fiches-interventions`, `statistiques-zones`).
