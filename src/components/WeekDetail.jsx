import Breadcrumb from './Breadcrumb'
import {
  formatDate,
  getStatusColor,
  getStatusLabel,
  buildFormsUrl,
  computeStatus,
} from '../utils/helpers'

/** Affiche la barre de progression + places pour un créneau */
function ProgressBar({ totalSlots, usedSlots, status }) {
  const available = totalSlots - usedSlots
  const percentage = totalSlots > 0 ? (available / totalSlots) * 100 : 0

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-bold text-gray-900">{available}</span>
        <span className="text-gray-500">
          / {totalSlots} place{totalSlots > 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        place{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''}
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${
            status === 'available'
              ? 'bg-cb-green'
              : status === 'almost_full'
                ? 'bg-cb-orange'
                : 'bg-cb-red'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{usedSlots} occupée{usedSlots > 1 ? 's' : ''}</span>
        <span>{available} libre{available > 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

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
  // Rétrocompatibilité : si pas de creneaux, traiter week comme un créneau unique
  const creneaux = week.creneaux || [week]
  const isMulti = creneaux.length > 1

  const available = week.totalSlots - week.usedSlots

  // URL inscription pour créneau unique (rétrocompatibilité)
  const inscriptionUrl = !isMulti
    ? buildFormsUrl(formsUrl, etablissement.name, secteur.name, creneaux[0].startDate)
    : null

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
        {/* En-tête avec statut agrégé */}
        <div className={`px-6 py-4 ${getStatusColor(week.status)}`}>
          <h2 className="text-xl font-bold">
            Semaine {week.weekNumber}
          </h2>
          {isMulti ? (
            <p className="text-sm opacity-90">{creneaux.length} créneaux cette semaine</p>
          ) : (
            <p className="text-sm opacity-90">
              {formatDate(creneaux[0].startDate)} — {formatDate(creneaux[0].endDate)}
            </p>
          )}
        </div>

        <div className="p-6">
          {/* Statut agrégé */}
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

          {/* Résumé global */}
          <div className="mb-6">
            <ProgressBar
              totalSlots={week.totalSlots}
              usedSlots={week.usedSlots}
              status={week.status}
            />
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

          {/* Créneau unique : affichage identique à l'ancien */}
          {!isMulti && (
            <>
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
            </>
          )}

          {/* Plusieurs créneaux : liste détaillée */}
          {isMulti && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
                Détail des créneaux
              </h3>
              {creneaux.map((c, i) => {
                const cAvailable = c.totalSlots - c.usedSlots
                const cStatus = computeStatus(c.totalSlots, c.usedSlots)
                const cUrl = buildFormsUrl(formsUrl, etablissement.name, secteur.name, c.startDate)

                return (
                  <div key={`${c.startDate}-${c.endDate}`} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(c.startDate)} — {formatDate(c.endDate)}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(cStatus)}`}
                      >
                        {getStatusLabel(cStatus)}
                      </span>
                    </div>

                    <ProgressBar totalSlots={c.totalSlots} usedSlots={c.usedSlots} status={cStatus} />

                    <div className="mt-3">
                      {cAvailable > 0 ? (
                        <a
                          href={cUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-cb-green hover:bg-cb-green/90 text-white text-center
                                     font-semibold py-2 px-4 rounded-lg transition-colors duration-200
                                     focus:outline-none focus:ring-2 focus:ring-cb-green focus:ring-offset-2 text-sm"
                        >
                          S'inscrire
                        </a>
                      ) : (
                        <div
                          className="block w-full bg-gray-300 text-gray-500 text-center
                                      font-semibold py-2 px-4 rounded-lg cursor-not-allowed text-sm"
                        >
                          Complet
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
