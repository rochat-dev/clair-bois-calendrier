/**
 * Fonctions utilitaires pour le calendrier Clair-Bois
 */

/** Retourne la classe CSS de couleur selon le statut de disponibilité */
export function getStatusColor(status) {
  switch (status) {
    case 'available':
      return 'bg-cb-green text-white'
    case 'almost_full':
      return 'bg-cb-orange text-white'
    case 'full':
      return 'bg-cb-red text-white'
    default:
      return 'bg-cb-gray text-white'
  }
}

/** Retourne la couleur de fond légère pour les cartes */
export function getStatusBgLight(status) {
  switch (status) {
    case 'available':
      return 'bg-cb-green-light border-cb-green'
    case 'almost_full':
      return 'bg-cb-orange-light border-cb-orange'
    case 'full':
      return 'bg-cb-red-light border-cb-red'
    default:
      return 'bg-cb-gray-light border-cb-gray'
  }
}

/** Retourne le label français du statut */
export function getStatusLabel(status) {
  switch (status) {
    case 'available':
      return 'Disponible'
    case 'almost_full':
      return 'Presque complet'
    case 'full':
      return 'Complet'
    default:
      return 'Non défini'
  }
}

/** Calcule le statut automatiquement à partir des places */
export function computeStatus(totalSlots, usedSlots) {
  const available = totalSlots - usedSlots
  if (available <= 0) return 'full'
  if (available / totalSlots > 0.5) return 'available'
  return 'almost_full'
}

/** Formate une date ISO en format lisible français */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('fr-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Formate une date ISO en format court */
export function formatDateShort(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('fr-CH', {
    day: 'numeric',
    month: 'short',
  })
}

/** Retourne le nom du mois en français */
export function getMonthName(month, year) {
  const date = new Date(year, month, 1)
  return date.toLocaleDateString('fr-CH', { month: 'long', year: 'numeric' })
}

/** Compte les semaines disponibles dans un secteur */
export function countAvailableWeeks(secteur) {
  return secteur.weeks.filter((w) => w.status !== 'full').length
}

/** Génère l'URL d'inscription avec paramètres pré-remplis (IDs Forms réels) */
export function buildFormsUrl(baseUrl, etablissement, secteur, startDate) {
  const url = new URL(baseUrl)
  url.searchParams.set('r2876f0c952f44887946296b4c95367a3', etablissement)
  url.searchParams.set('r1faa50a65150406b95d3a62e45550e40', secteur)
  url.searchParams.set('r50efe78018854247bf6e734db7188d70', startDate)
  return url.toString()
}

/** Retourne le numéro ISO de la semaine pour une date donnée */
export function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

/** Retourne la date du lundi d'une semaine ISO */
export function getMondayOfWeek(weekNumber, year) {
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (weekNumber - 1) * 7)
  return monday
}

/** Génère les jours d'un mois pour l'affichage en grille calendrier */
export function getCalendarDays(month, year) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Jour de la semaine du premier jour (lundi = 0)
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days = []

  // Jours vides avant le premier du mois
  for (let i = 0; i < startDow; i++) {
    days.push(null)
  }

  // Jours du mois
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }

  return days
}

/** Regroupe les jours du calendrier en semaines */
export function groupByWeeks(calendarDays) {
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }
  return weeks
}

/** Génère un slug URL-friendly à partir d'un nom */
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Transforme le format plat (Power Automate) en format hiérarchique (composants React).
 * Si le JSON contient déjà `etablissements`, il est retourné tel quel (rétrocompatibilité).
 */
export function transformPlanningData(flat) {
  if (flat.etablissements) return flat

  const { lastUpdated, formsUrl, formsUrlNouvelEtablissement, formsUrlNouveauSecteur, config, creneaux } = flat

  const etabMap = {}
  for (const c of creneaux) {
    if (!etabMap[c.etablissement]) {
      const cfg = config?.[c.etablissement] || {}
      etabMap[c.etablissement] = {
        id: slugify(c.etablissement),
        name: c.etablissement,
        description: cfg.description || '',
        icon: cfg.icon || '',
        secteursMap: {},
      }
    }
    const etab = etabMap[c.etablissement]
    if (!etab.secteursMap[c.secteur]) {
      etab.secteursMap[c.secteur] = {
        id: slugify(c.secteur),
        name: c.secteur,
        description: '',
        weeks: [],
      }
    }

    const date = new Date(c.dateDebut + 'T00:00:00')
    const weekNumber = getISOWeekNumber(date)
    const month = date.getMonth()
    const calYear = date.getFullYear()
    const year =
      month === 0 && weekNumber > 50
        ? calYear - 1
        : month === 11 && weekNumber === 1
          ? calYear + 1
          : calYear

    etab.secteursMap[c.secteur].weeks.push({
      weekNumber,
      year,
      startDate: c.dateDebut,
      endDate: c.dateFin,
      totalSlots: c.placesTotal,
      usedSlots: c.placesUtilisees,
      status: computeStatus(c.placesTotal, c.placesUtilisees),
    })
  }

  const etablissements = Object.values(etabMap).map((etab) => ({
    id: etab.id,
    name: etab.name,
    description: etab.description,
    icon: etab.icon,
    secteurs: Object.values(etab.secteursMap),
  }))

  return {
    lastUpdated,
    formsUrl,
    formsUrlNouvelEtablissement,
    formsUrlNouveauSecteur,
    organization: {
      name: 'Fondation Clair-Bois',
      logo: 'assets/logo-clair-bois.png',
      description: 'Calendrier des disponibilités de stage pour les référents externes',
    },
    etablissements,
  }
}
