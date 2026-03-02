# Clair-Bois Calendrier — Contexte Projet

Toujours communiquer en français avec l'utilisateur.

## Qui est le client
Miles, informaticien IT à la Fondation Clair-Bois à Genève (Suisse). Sa mandante est Madame Karavia, coordinatrice des entrées de stagiaires.

## Contexte métier
La Fondation Clair-Bois accompagne des personnes en situation de handicap dans leur réorientation professionnelle. Ce site est un calendrier interactif anonyme permettant aux **référents externes** (écoles spécialisées, assurances, AI) de consulter les disponibilités de stage dans les différents établissements de la fondation.

### Les acteurs
- **Référents cadres** : responsables de secteur dans chaque établissement. Définissent les capacités d'accueil.
- **Référents externes** : personnes anonymes (sans compte Microsoft) qui consultent le calendrier pour trouver une place.
- **Madame Karavia** : coordinatrice générale des entrées.

### Structure organisationnelle
Fondation > Établissements > Secteurs > Semaines de disponibilité. Le système est 100% dynamique, piloté par `public/planning.json`.

## Stack technique
- React + Vite
- Tailwind CSS v4 (plugin @tailwindcss/vite)
- Déploiement GitHub Pages (base: `/clair-bois-calendrier/`)
- Pas de backend, pas de base de données
- Le site lit `planning.json` au démarrage
- Responsive mobile-first, tout en français

## Architecture des composants
```
src/
├── App.jsx              # Router principal, chargement du JSON
├── main.jsx             # Point d'entrée React
├── index.css            # Tailwind + thème personnalisé
├── components/
│   ├── Header.jsx       # Header avec logo et nom fondation
│   ├── Breadcrumb.jsx   # Fil d'Ariane cliquable
│   ├── HomePage.jsx     # Écran 1 : choix établissement
│   ├── EtablissementPage.jsx  # Écran 2 : choix secteur
│   ├── SecteurCalendar.jsx    # Écran 3 : vue mois calendrier
│   └── WeekDetail.jsx   # Écran 4 : détail semaine + inscription
└── utils/
    └── helpers.js        # Fonctions utilitaires (couleurs, dates, etc.)
```

## Couleurs du code de disponibilité
- **Vert** (`cb-green`) : >50% des places disponibles
- **Orange** (`cb-orange`) : 1-50% des places disponibles
- **Rouge** (`cb-red`) : complet (0 places)
- **Gris** (`cb-gray`) : pas de données / fermé

## Données
Tout vient du fichier `public/planning.json`. Aucune donnée en dur dans le code React.
Le lien d'inscription redirige vers le Microsoft Forms (placeholder : `google.ch` pour l'instant).

## Fonctionnalités Phase 2 (NE PAS DÉVELOPPER)
- Formulaire d'inscription intégré (remplacement de Microsoft Forms)
- Écran d'accueil enrichi avec présentation de chaque établissement
- Panel référent cadre pour gérer les disponibilités directement sur le site
- Système de conditions (vérification doublon stagiaire, etc.)
- Notifications par email

## Principes de code
- Composants React bien découpés
- Code commenté en français
- Noms de variables explicites
- Le JSON est chargé UNE SEULE FOIS au démarrage
- Animations/transitions fluides
- 100% dynamique : ajouter un établissement/secteur dans le JSON = apparition automatique
