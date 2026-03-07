import { useState } from 'react'
import Breadcrumb from './Breadcrumb'
import InfoBulle from './InfoBulle'
import {
  getCalendarDays,
  groupByWeeks,
  getMonthName,
  getISOWeekNumber,
  getStatusColor,
  getStatusBgLight,
  aggregateWeekCreneaux,
} from '../utils/helpers'

/** Écran 3 : Calendrier mensuel d'un secteur */
export default function SecteurCalendar({
  etablissement,
  secteur,
  formsUrlNouveauSecteur,
  onSelectWeek,
  onBackToEtablissement,
  onBackToHome,
}) {
  // Initialiser au mois courant
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())

  const breadcrumbItems = [
    { label: 'Accueil', onClick: onBackToHome },
    { label: etablissement.name, onClick: onBackToEtablissement },
    { label: secteur.name },
  ]

  // Navigation entre les mois
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Créer un index des semaines agrégé (gère les créneaux chevauchants)
  const weekIndex = aggregateWeekCreneaux(secteur.weeks)

  // Générer les jours et semaines du calendrier
  const calendarDays = getCalendarDays(currentMonth, currentYear)
  const calendarWeeks = groupByWeeks(calendarDays)

  // Jours de la semaine (lundi à dimanche)
  const joursSemaine = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className="animate-fadeIn">
      <Breadcrumb items={breadcrumbItems} />

      {/* Bouton retour */}
      <button
        onClick={onBackToEtablissement}
        className="flex items-center gap-2 text-cb-blue hover:text-cb-blue/80
                   transition-colors mb-6 cursor-pointer"
        aria-label="Retour à l'établissement"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour
      </button>

      {/* Titre */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{secteur.name}</h2>
        <p className="text-gray-500">{secteur.description}</p>
      </div>

      {/* Navigation du mois */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Mois précédent"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {getMonthName(currentMonth, currentYear)}
          </h3>

          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Mois suivant"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grille calendrier */}
        <div className="p-2 md:p-4">
          {/* En-têtes jours */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-xs font-medium text-gray-400 text-center py-1">Sem.</div>
            {joursSemaine.map((jour) => (
              <div key={jour} className="text-xs font-medium text-gray-400 text-center py-1">
                {jour}
              </div>
            ))}
          </div>

          {/* Semaines */}
          {calendarWeeks.map((week, weekIdx) => {
            // Trouver le premier jour réel de la semaine pour déterminer le numéro
            const firstRealDay = week.find((d) => d !== null)
            if (!firstRealDay) return null

            const weekNum = getISOWeekNumber(firstRealDay)
            const weekYear = firstRealDay.getMonth() === 0 && weekNum > 50
              ? firstRealDay.getFullYear() - 1
              : firstRealDay.getMonth() === 11 && weekNum === 1
                ? firstRealDay.getFullYear() + 1
                : firstRealDay.getFullYear()

            const weekData = weekIndex[`${weekYear}-${weekNum}`]
            const hasData = !!weekData

            // Padder la semaine à 7 jours
            const paddedWeek = [...week]
            while (paddedWeek.length < 7) paddedWeek.push(null)

            return (
              <div
                key={weekIdx}
                className={`grid grid-cols-8 gap-1 mb-1 rounded-lg transition-all duration-200 ${
                  hasData
                    ? 'cursor-pointer hover:scale-[1.02] hover:shadow-sm'
                    : ''
                }`}
                onClick={() => hasData && onSelectWeek(weekData)}
                role={hasData ? 'button' : undefined}
                tabIndex={hasData ? 0 : undefined}
                onKeyDown={(e) => {
                  if (hasData && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onSelectWeek(weekData)
                  }
                }}
                aria-label={
                  hasData
                    ? `Semaine ${weekNum}${weekData.creneaux.length > 1 ? ` (${weekData.creneaux.length} créneaux)` : ''} — ${weekData.totalSlots - weekData.usedSlots} places disponibles`
                    : undefined
                }
              >
                {/* Numéro de semaine */}
                <div
                  className={`text-xs text-center py-2 rounded-l-lg font-medium ${
                    hasData ? getStatusColor(weekData.status) : 'text-gray-300'
                  }`}
                >
                  S{weekNum}{hasData && weekData.creneaux.length > 1 ? ` (${weekData.creneaux.length})` : ''}
                </div>

                {/* Jours */}
                {paddedWeek.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`text-sm text-center py-2 ${
                      dayIdx === 6 ? 'rounded-r-lg' : ''
                    } ${
                      day === null
                        ? ''
                        : hasData
                          ? getStatusBgLight(weekData.status) + ' border'
                          : 'text-gray-400'
                    } ${
                      day && day.toDateString() === new Date().toDateString()
                        ? 'font-bold ring-2 ring-cb-blue rounded'
                        : ''
                    }`}
                  >
                    {day ? day.getDate() : ''}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-4 px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cb-green" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cb-orange" />
            <span>Presque complet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cb-red" />
            <span>Complet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cb-gray" />
            <span>Pas de données</span>
          </div>
        </div>
      </div>

      {/* Ajouter un créneau (référent cadre) */}
      {formsUrlNouveauSecteur && (
        <div className="mt-4 text-center">
          <a
            href={`${formsUrlNouveauSecteur}&rb1c6311a61044eb184fa3270fd065e32=${encodeURIComponent(etablissement.name)}&r69f254172ecd4baa9c92b2ef2d86f48c=${encodeURIComponent(secteur.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cb-blue
                       transition-colors group py-2 px-4 rounded-lg hover:bg-cb-blue/5"
          >
            <span className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300
                             group-hover:border-cb-blue flex items-center justify-center
                             transition-colors shrink-0">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <span>Ajouter un créneau pour {secteur.name}</span>
            <InfoBulle>
              <p className="font-semibold mb-1">Espace référent cadre</p>
              <p>Vous êtes <strong>responsable de ce secteur</strong> ? Proposez un nouveau créneau de stage. Un <strong>code d'accès</strong> vous sera demandé.</p>
            </InfoBulle>
          </a>
        </div>
      )}
    </div>
  )
}
