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

## Liens Forms dans le JSON (tous placeholder `google.ch` pour l'instant)
- `formsUrl` : formulaire d'inscription stagiaire (référent externe → Microsoft Forms existant, 43 questions)
- `formsUrlNouvelEtablissement` : formulaire pour proposer un nouvel établissement (référent cadre). Inclut les secteurs et les dispos initiales.
- `formsUrlNouveauSecteur` : formulaire pour proposer un nouveau secteur dans un établissement existant (référent cadre, reçoit `?etablissement=...`). Inclut les dispos initiales.

### Flux Power Automate prévu (derrière les Forms)
1. Le référent cadre remplit un Forms (nouvel établissement ou nouveau secteur, avec ses dispos)
2. Power Automate récupère les réponses, valide le référent (code d'accès / email autorisé)
3. Power Automate met à jour le `planning.json` (ou une source de données qui alimente le JSON)
4. Le site affiche automatiquement les nouvelles données au prochain chargement

### Décision architecturale : garder Microsoft Forms
Le formulaire d'inscription stagiaire (43 questions, données sensibles : AVS, curatelle, AI) reste sur Microsoft Forms car :
- Données sensibles incompatibles avec un site statique GitHub Pages
- Power Automate déjà branché sur le Forms existant
- Le calendrier est la vraie valeur ajoutée, pas le formulaire

## Fonctionnalités Phase 2 (NE PAS DÉVELOPPER)
- Formulaire d'inscription intégré (remplacement de Microsoft Forms, nécessite backend Azure)
- Écran d'accueil enrichi avec présentation de chaque établissement
- Panel référent cadre pour gérer les disponibilités directement sur le site (sans Forms)
- Système de conditions (vérification doublon stagiaire, etc.)
- Notifications par email

## Principes de code
- Composants React bien découpés
- Code commenté en français
- Noms de variables explicites
- Le JSON est chargé UNE SEULE FOIS au démarrage
- Animations/transitions fluides
- 100% dynamique : ajouter un établissement/secteur dans le JSON = apparition automatique
