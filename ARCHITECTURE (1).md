# Architecture — SOCADL Front-end

## 1. Contexte

SOCADL est une plateforme web de type **salle de contrôle** pour la supervision en temps réel du réseau de distribution d'électricité de l'opérateur SOCADL au Cameroun. Elle permet de :

- surveiller l'état des postes de distribution électrique
- suivre la qualité de service selon les normes réglementaires de l'ARSEL (régulateur)
- gérer les interventions techniques et le parc matériel
- configurer les alertes réseau

Ce dépôt contient **uniquement le front-end**. Le backend (API, temps réel, authentification) est un service séparé consommé via HTTP/WebSocket.

## 2. Stack technique

| Domaine | Choix |
|---|---|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| UI | React 19 + shadcn/ui (Radix + Tailwind) |
| Styles | Tailwind CSS |
| Cartographie | Leaflet + react-leaflet (chargé en dynamique, `ssr: false`) |
| Graphiques | Recharts |
| Data fetching client | SWR (polling / cache / revalidation) |
| Data fetching serveur | `fetch()` natif dans les Server Components |
| Icônes | lucide-react |

## 3. Principes d'architecture

### 3.1 Server Components par défaut
Les pages sont des **Server Components** par défaut. On ne passe en `"use client"` que pour ce qui a besoin d'interactivité, d'état local ou d'API navigateur (filtres, jauges animées, carte Leaflet, formulaires).

### 3.2 Couche BFF (Backend-for-Frontend)
Le front n'appelle jamais directement l'API externe depuis le navigateur. Tous les appels transitent par les **Route Handlers** de `app/api/*`, qui :
- cachent l'URL et les clés du backend réel (variables serveur, jamais `NEXT_PUBLIC_*` pour les secrets)
- appliquent le contrôle d'accès par rôle avant de relayer la requête
- normalisent la forme des données pour le front

### 3.3 Temps réel
Deux mécanismes possibles selon la donnée :
- **Polling SWR** (`refreshInterval`) pour les données qui tolèrent quelques secondes de latence (KPIs, tableaux)
- **WebSocket/SSE** pour le statut des postes sur la carte et le fil d'événements, quand le backend l'expose

### 3.4 Accès par rôle
Trois rôles : **Administrateur**, **Technicien**, **Lecture ARSEL** (lecture seule). Le contrôle d'accès se fait à deux niveaux :
1. `middleware.ts` : redirige/bloque avant même le rendu de la page (protection au niveau des routes)
2. Affichage conditionnel dans `components/layout/sidebar.tsx` : les rubriques visibles dépendent du rôle connecté

## 4. Structure des dossiers

```
app/
  (auth)/            routes publiques : login, register, mot de passe oublié...
  (dashboard)/        routes protégées, layout avec sidebar (240px)
  api/                Route Handlers = couche BFF
components/
  ui/                 composants shadcn/ui génériques
  layout/             sidebar, header, auth-layout...
  dashboard/          composants métier (jauges, cartes KPI, carte réseau...)
hooks/                hooks réutilisables (use-mobile, use-sites, use-kpis...)
lib/                  client API, types, contexte auth, utilitaires
middleware.ts         protection des routes par rôle
```

## 5. Design system

- **Fond** : crème `hsl(36 33% 96%)` — jamais de blanc pur ni de gris froid
- **Cartes** : blanc chaud `hsl(40 44% 99%)`, bordures fines 1px
- **Accent** : orange chaleureux `hsl(24 85% 50%)` pour les actions principales
- **Typographie** : Inter pour le texte courant, **JetBrains Mono + `tabular-nums`** obligatoire pour toute valeur numérique (KPIs, jauges, tableaux, horodatages)
- **Statuts** : jamais uniquement par la couleur — toujours icône + texte + couleur
- **Flat design** : pas d'ombres portées ni de dégradés ; hiérarchie via fonds de cartes, bordures, typographie

## 6. Modules fonctionnels

| Route | Description |
|---|---|
| `/` | Tableau de bord — KPIs, carte interactive, flux d'événements |
| `/sites`, `/sites/[id]` | Liste des postes + fiche diagnostic détaillée (jauges SVG) |
| `/maintenance` | Planification des interventions préventives/correctives |
| `/fiches-interventions` | Suivi de résolution des pannes |
| `/inventaire` | Parc matériel, usure calculée dynamiquement |
| `/statistiques-zones` | Analyse comparative entre districts |
| `/tableau-performance` | Suivi des objectifs annuels |
| `/rapports` | Indicateurs IEEE 1366 (SAIDI, SAIFI, CAIDI), export PDF/CSV |
| `/alertes` | Seuils et canaux de notification |
| `/configuration-systeme` | Paramètres globaux du réseau |
| `/parametres` | Gestion des utilisateurs et des accès |

## 7. État actuel

Le projet est au stade **maquette/intégration statique** : les pages utilisent des données simulées (`lib/mock-data.ts`) le temps de finaliser l'UI. Le passage aux vraies données se fera en remplaçant les imports de mock par des hooks SWR appelant `lib/api-client.ts`, sans modifier les composants visuels.
