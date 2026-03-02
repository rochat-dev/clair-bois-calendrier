import Breadcrumb from './Breadcrumb'
import {
  formatDate,
  getStatusColor,
  getStatusLabel,
  buildFormsUrl,
} from '../utils/helpers'

/** Écran 4 : Détail d'une semaine avec possibilité d'inscription */
export default function WeekDetail({
  etablissement,
  secteur,
  week,
  formsUrl,
  onBackToCalendar,
  onBackToEtablissement,
  onBackToHome,
}) {
  const available = week.totalSlots - week.usedSlots
  const percentage = week.totalSlots > 0 ? (available / week.totalSlots) * 100 : 0

  const inscriptionUrl = buildFormsUrl(
    formsUrl,
    etablissement.name,
    secteur.name,
    week.weekNumber
  )

  const breadcrumbItems = [
    { label: 'Accueil', onClick: onBackToHome },
    { label: etablissement.name, onClick: onBackToEtablissement },
    { label: secteur.name, onClick: onBackToCalendar },
    { label: `Semaine ${week.weekNumber}` },
  ]

  return (
    <div className="animate-fadeIn">
      <Breadcrumb items={breadcrumbItems} />

      {/* Bouton retour */}
      <button
        onClick={onBackToCalendar}
        className="flex items-center gap-2 text-cb-blue hover:text-cb-blue/80
                   transition-colors mb-6 cursor-pointer"
        aria-label="Retour au calendrier"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour au calendrier
      </button>

      {/* Carte détail semaine */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-lg mx-auto">
        {/* En-tête avec statut */}
        <div className={`px-6 py-4 ${getStatusColor(week.status)}`}>
          <h2 className="text-xl font-bold">
            Semaine {week.weekNumber}
          </h2>
          <p className="text-sm opacity-90">
            {formatDate(week.startDate)} — {formatDate(week.endDate)}
          </p>
        </div>

        <div className="p-6">
          {/* Statut */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Disponibilité</span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(week.status)}`}
              >
                {getStatusLabel(week.status)}
              </span>
            </div>
          </div>

          {/* Places */}
          <div className="mb-6">
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">{available}</span>
              <span className="text-gray-500">
                / {week.totalSlots} place{week.totalSlots > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              place{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''}
            </p>

            {/* Barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  week.status === 'available'
                    ? 'bg-cb-green'
                    : week.status === 'almost_full'
                      ? 'bg-cb-orange'
                      : 'bg-cb-red'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{week.usedSlots} occupée{week.usedSlots > 1 ? 's' : ''}</span>
              <span>{available} libre{available > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Infos secteur */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Établissement :</span> {etablissement.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Secteur :</span> {secteur.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">{secteur.description}</p>
          </div>

          {/* Bouton inscription */}
          {available > 0 ? (
            <a
              href={inscriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-cb-green hover:bg-cb-green/90 text-white text-center
                         font-semibold py-3 px-6 rounded-lg transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-cb-green focus:ring-offset-2"
            >
              S'inscrire pour cette semaine
            </a>
          ) : (
            <div
              className="block w-full bg-gray-300 text-gray-500 text-center
                          font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
            >
              Complet — Aucune place disponible
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
