# Clair-Bois Calendrier

Calendrier interactif des disponibilités de stage de la **Fondation Clair-Bois** (Genève, Suisse).

## Description

Ce site web permet aux référents externes (écoles spécialisées, assurances, AI) de consulter les disponibilités de stage dans les différents établissements et secteurs de la Fondation Clair-Bois, qui accompagne des personnes en situation de handicap dans leur réorientation professionnelle.

## Fonctionnalités

- Vue par établissement et par secteur
- Calendrier mensuel avec code couleur (vert/orange/rouge/gris)
- Vue détaillée par semaine
- Lien d'inscription vers Microsoft Forms
- 100% dynamique : piloté par un fichier `planning.json`
- Responsive mobile-first
- Accessible (WCAG AA)

## Stack technique

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- Hébergé sur [GitHub Pages](https://pages.github.com/)

## Installation

```bash
npm install
npm run dev
```

## Déploiement

```bash
npm run build
```

Le dossier `dist/` peut être déployé sur GitHub Pages.

## Mise à jour des données

Modifiez le fichier `public/planning.json` pour mettre à jour les disponibilités. Le site se met à jour automatiquement au prochain chargement.

## Licence

Projet interne — Fondation Clair-Bois, Genève.
