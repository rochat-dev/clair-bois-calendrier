# Clair-Bois Calendrier — Contexte Projet

Toujours communiquer en français avec l'utilisateur.

## Qui est le client
Miles, informaticien IT à la Fondation Clair-Bois à Genève (Suisse). Sa mandante est Madame Karavia, coordinatrice des entrées de stagiaires. **Deadline projet : ~30 mars 2026.**

## Contexte métier
La Fondation Clair-Bois accompagne des personnes en situation de handicap dans leur réorientation professionnelle. Ce site est un calendrier interactif anonyme permettant aux **référents externes** (écoles spécialisées, assurances, AI) de consulter les disponibilités de stage dans les différents établissements de la fondation.

### Les acteurs
- **Référents cadres** : responsables de secteur dans chaque établissement. Définissent les capacités d'accueil via le formulaire "Gestion des créneaux".
- **Référents externes** : personnes anonymes (sans compte Microsoft) qui consultent le calendrier pour trouver une place.
- **Madame Karavia** : coordinatrice générale des entrées.

### Structure organisationnelle
Fondation > Établissements > Secteurs > Créneaux de disponibilité (peuvent se chevaucher). Le système est 100% dynamique, piloté par `public/planning.json`.

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
├── App.jsx              # Router principal, chargement du JSON, passage des props
├── main.jsx             # Point d'entrée React
├── index.css            # Tailwind + thème personnalisé
├── components/
│   ├── Header.jsx       # Header avec logo et nom fondation
│   ├── Breadcrumb.jsx   # Fil d'Ariane cliquable
│   ├── InfoBulle.jsx    # Tooltip hover/clic pour expliquer les actions référent cadre
│   ├── HomePage.jsx     # Écran 1 : choix établissement (+carte "ajouter établissement")
│   ├── EtablissementPage.jsx  # Écran 2 : choix secteur (+carte "ajouter secteur")
│   ├── SecteurCalendar.jsx    # Écran 3 : calendrier mensuel (+bouton "ajouter créneau")
│   └── WeekDetail.jsx   # Écran 4 : détail semaine + inscription (multi-créneaux supporté)
└── utils/
    └── helpers.js        # Fonctions utilitaires (couleurs, dates, agrégation, etc.)
```

## Couleurs du code de disponibilité
- **Vert** (`cb-green`) : >50% des places disponibles
- **Orange** (`cb-orange`) : 1-50% des places disponibles
- **Rouge** (`cb-red`) : complet (0 places)
- **Gris** (`cb-gray`) : pas de données / fermé

## Données

`public/planning.json` est **généré automatiquement** par le Flux 3 Power Automate et poussé sur GitHub via l'API Contents. Le frontend le transforme au chargement.

### Format du JSON (généré par PA — format plat)
```json
{
  "lastUpdated": "2026-03-07T...",
  "formsUrl": "https://forms.office.com/e/3SZvXC6kb5",
  "formsUrlNouvelEtablissement": "https://forms.office.com/...",
  "formsUrlNouveauSecteur": "https://forms.office.com/...",
  "config": { "Blanchisserie Tourbillon": { "description": "...", "icon": "👕" } },
  "creneaux": [
    { "etablissement": "...", "secteur": "...", "dateDebut": "2026-03-02", "dateFin": "2026-03-06", "placesTotal": 3, "placesUtilisees": 1 }
  ]
}
```

### Transformation frontend (helpers.js)
`transformPlanningData()` convertit le format plat en hiérarchique (`etablissements[].secteurs[].weeks[]`) pour les composants React. Rétrocompatible : si le JSON contient déjà `etablissements`, il est retourné tel quel.

### Gestion des créneaux chevauchants
Quand plusieurs créneaux couvrent la même semaine dans un secteur, `aggregateWeekCreneaux()` les regroupe par `year-weekNumber` avec déduplique par `startDate+endDate`. Le calendrier affiche `S13 (2)` et le détail (`WeekDetail`) liste chaque créneau individuellement avec sa propre barre de progression et son bouton d'inscription.

### Liens Forms
- `formsUrl` : formulaire d'inscription stagiaire (réel, 43 questions, IDs Forms réels pour pré-remplissage)
- `formsUrlNouvelEtablissement` : formulaire référent cadre pour proposer un établissement
- `formsUrlNouveauSecteur` : formulaire "Gestion des créneaux" (réel) — utilisé aussi pour ajouter un créneau à un secteur existant

### IDs de pré-remplissage — Formulaire "Gestion des créneaux"
| Champ | ID Forms |
|---|---|
| Établissement | `rb1c6311a61044eb184fa3270fd065e32` |
| Secteur | `r69f254172ecd4baa9c92b2ef2d86f48c` |
| Description | `r43c3849ff3284246a7c68d571f7ca3df` |
| Date de début | `reee4e33cc677406885a947061d7d9cde` |
| Date de fin | `r77ae6366339446f39c90be5aa93b3a71` |
| Nombre de places | `r673220bf96894b43b6cd98c623c6d0fe` |
| Type de créneau | `rd79308a2436b46d7be9921d3eed3ca79` (Stage / Module métier) |
| Nom du module | `rc347ff44177743a8b9561f6d6f9eed2c` |
| Mot de passe | `rce9b9c542c0d455a8c01298b063332fe` |

### Pipeline automatique (opérationnel)
1. Référent externe s'inscrit via le calendrier → Microsoft Forms
2. Flux 1 (PA) crée Stagiaire + Demande dans SharePoint
3. Flux 3 (PA) se déclenche automatiquement → recalcule les places → pousse planning.json sur GitHub
4. GitHub Pages redéploie → le site est à jour

### Boutons "Ajouter" pour référents cadres
Chaque écran offre un bouton discret (bordure pointillée + InfoBulle) permettant aux référents cadres de proposer :
- **HomePage** : "Ajouter un établissement" → `formsUrlNouvelEtablissement`
- **EtablissementPage** : "Ajouter un secteur" → `formsUrlNouveauSecteur` (pré-remplit établissement)
- **SecteurCalendar** : "Ajouter un créneau pour {secteur}" → `formsUrlNouveauSecteur` (pré-remplit établissement + secteur)

### Décision architecturale : garder Microsoft Forms
Le formulaire d'inscription stagiaire (43 questions, données sensibles : AVS, curatelle, AI) reste sur Microsoft Forms car :
- Données sensibles incompatibles avec un site statique GitHub Pages
- Power Automate déjà branché sur le Forms existant
- Le calendrier est la vraie valeur ajoutée, pas le formulaire

## Fonctionnalités Phase 2 (NE PAS DÉVELOPPER — hors scope deadline)
- Formulaire d'inscription intégré (remplacement de Microsoft Forms, nécessite backend Azure)
- Écran d'accueil enrichi avec présentation de chaque établissement
- Panel référent cadre pour gérer les disponibilités directement sur le site (sans Forms)
- Système de conditions (vérification doublon stagiaire, etc.)
- Notifications par email

## Fonctions utilitaires clés (helpers.js)
- `transformPlanningData(flat)` : plat PA → hiérarchique React (rétrocompatible)
- `aggregateWeekCreneaux(weeks)` : agrège les semaines par `year-weekNumber`, déduplique par `startDate+endDate`, calcule totaux et statut
- `buildFormsUrl(baseUrl, etablissement, secteur, startDate)` : URL pré-remplie avec `encodeURIComponent` (IDs Forms réels)
- `computeStatus(totalSlots, usedSlots)` : calcule le statut couleur (>50% = vert, 1-50% = orange, 0 = rouge)
- `getISOWeekNumber(date)` : numéro de semaine ISO
- `getUniqueCreneaux(weeks)` : déduplique les semaines par `startDate+endDate` pour comptage sur EtablissementPage

## Principes de code
- Composants React bien découpés
- Code commenté en français
- Noms de variables explicites
- Le JSON est chargé UNE SEULE FOIS au démarrage
- Animations/transitions fluides
- 100% dynamique : ajouter un créneau dans SharePoint = apparition automatique sur le site
- Rétrocompatibilité : `week.creneaux || [week]` dans WeekDetail

**Projet lié** : `C:\Users\karim\PowerAutomate-Agent` — Backend Power Automate (Flux 1, 2, 3)
