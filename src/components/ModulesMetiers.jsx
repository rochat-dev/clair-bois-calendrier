/**
 * ModulesMetiers.jsx — Vue "Semaine type" des modules metiers.
 *
 * Flow : 1) Choisir une semaine → 2) Selectionner 1 a 3 modules sur la grille
 *        → 3) S'inscrire (Forms) → 4) Revenir pour une autre semaine
 *
 * @param {Object} props.modulesMetiers - Donnees modules depuis planning.json
 * @param {string} props.formsUrl       - URL de base du formulaire d'inscription
 * @param {Function} props.onBack       - Retour a la page d'accueil
 */
import { useState } from 'react'
import { formatDate } from '../utils/helpers'

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
const JOURS_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
const HEURES = Array.from({ length: 10 }, (_, i) => i + 7) // 7h à 16h

function getModuleStyle(mod) {
  const startH = parseInt(mod.heureDebut.split(':')[0])
  const endH = parseInt(mod.heureFin.split(':')[0])
  const top = (startH - 7) * 60
  const height = (endH - startH) * 60
  return { top, height }
}

function groupByJour(modules) {
  const grouped = {}
  JOURS.forEach(j => { grouped[j] = [] })
  modules.forEach(mod => {
    if (grouped[mod.jour]) grouped[mod.jour].push(mod)
  })
  return grouped
}

export default function ModulesMetiers({ modulesMetiers, formsUrl, onBack }) {
  const { modules, semaines, maxSelection, formsUrlModules } = modulesMetiers
  const [selected, setSelected] = useState([])
  const [selectedSemaine, setSelectedSemaine] = useState(null)

  const modulesByJour = groupByJour(modules)

  const toggleModule = (mod) => {
    const key = `${mod.nom}-${mod.site}`
    const isSelected = selected.some(s => `${s.nom}-${s.site}` === key)
    if (isSelected) {
      setSelected(selected.filter(s => `${s.nom}-${s.site}` !== key))
    } else if (selected.length < maxSelection) {
      setSelected([...selected, mod])
    }
  }

  const isModuleSelected = (mod) =>
    selected.some(s => `${s.nom}-${s.site}` === `${mod.nom}-${mod.site}`)

  const buildInscriptionUrl = () => {
    const base = formsUrlModules || formsUrl
    const modulesStr = selected.map(m => `${m.nom} (${m.site})`).join(', ')
    return `${base}?rc347ff44177743a8b9561f6d6f9eed2c=${encodeURIComponent(modulesStr)}&reee4e33cc677406885a947061d7d9cde=${selectedSemaine.dateDebut}&r77ae6366339446f39c90be5aa93b3a71=${selectedSemaine.dateFin}`
  }

  const resetForNewWeek = () => {
    setSelected([])
    setSelectedSemaine(null)
  }

  // Pas encore de semaine choisie → etape 1
  if (!selectedSemaine) {
    return (
      <div className="animate-fadeIn">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-cb-blue hover:text-cb-blue/80 mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Modules métiers
          </h2>
          <p className="text-gray-600 text-sm">
            Choisissez d'abord votre semaine de découverte, puis sélectionnez vos modules.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {semaines.map((sem) => (
            <button
              key={sem.semaine}
              onClick={() => setSelectedSemaine(sem)}
              className="bg-white rounded-xl border-2 border-gray-200 p-5 text-left
                         hover:border-cb-blue hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <p className="font-bold text-gray-900 group-hover:text-cb-blue transition-colors">
                Semaine {sem.semaine}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(sem.dateDebut)} — {formatDate(sem.dateFin)}
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-cb-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Choisir cette semaine
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Semaine choisie → etape 2 : grille modules
  return (
    <div className="animate-fadeIn">
      {/* Navigation retour */}
      <button
        onClick={resetForNewWeek}
        className="flex items-center gap-1.5 text-sm text-cb-blue hover:text-cb-blue/80 mb-4 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Changer de semaine
      </button>

      {/* En-tete avec semaine selectionnee */}
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Semaine {selectedSemaine.semaine}
        </h2>
        <p className="text-gray-600 text-sm">
          {formatDate(selectedSemaine.dateDebut)} au {formatDate(selectedSemaine.dateFin)} — Sélectionnez 1 à {maxSelection} modules
        </p>
      </div>

      {/* Barre de selection + bouton inscription */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700">
              {selected.length === 0
                ? 'Cliquez sur un module pour le sélectionner'
                : `${selected.length}/${maxSelection} module${selected.length > 1 ? 's' : ''} sélectionné${selected.length > 1 ? 's' : ''}`}
            </p>
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selected.map((m) => (
                  <span
                    key={`${m.nom}-${m.site}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: m.couleur }}
                  >
                    {m.nom} ({m.site})
                    <button
                      onClick={() => toggleModule(m)}
                      className="ml-0.5 hover:opacity-70 cursor-pointer"
                      aria-label={`Retirer ${m.nom}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Bouton inscription visible des 1 module selectionne */}
          {selected.length > 0 && (
            <a
              href={buildInscriptionUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cb-green text-white rounded-lg font-medium
                         hover:bg-cb-green/90 transition-colors whitespace-nowrap no-underline"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              S'inscrire
            </a>
          )}
        </div>
      </div>

      {/* Grille semaine type */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* En-tete jours */}
            <div className="grid grid-cols-[70px_repeat(5,1fr)] border-b border-gray-200">
              <div className="p-3 bg-gray-50 text-xs font-medium text-gray-500 text-center">
                Horaire
              </div>
              {JOURS_LABELS.map((jour) => (
                <div key={jour} className="p-3 bg-gray-50 text-sm font-semibold text-gray-700 text-center border-l border-gray-200">
                  {jour}
                </div>
              ))}
            </div>

            {/* Corps */}
            <div className="grid grid-cols-[70px_repeat(5,1fr)]">
              <div className="relative">
                {HEURES.map((h) => (
                  <div key={h} className="h-[60px] border-b border-gray-100 flex items-start justify-center pt-1">
                    <span className="text-xs text-gray-400">{`${h}:00`}</span>
                  </div>
                ))}
              </div>

              {JOURS.map((jour) => (
                <div key={jour} className="relative border-l border-gray-200" style={{ height: HEURES.length * 60 }}>
                  {HEURES.map((h) => (
                    <div key={h} className="absolute w-full border-b border-gray-100" style={{ top: (h - 7) * 60 + 60, height: 0 }} />
                  ))}

                  {modulesByJour[jour].map((mod) => {
                    const { top, height } = getModuleStyle(mod)
                    const isSel = isModuleSelected(mod)
                    const available = mod.placesTotal - mod.placesUtilisees
                    const canSelect = isSel || selected.length < maxSelection

                    return (
                      <button
                        key={`${mod.nom}-${mod.site}`}
                        onClick={() => canSelect && toggleModule(mod)}
                        className={`absolute left-1 right-1 rounded-lg p-2 text-left transition-all duration-200
                          ${canSelect ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md' : 'cursor-not-allowed opacity-50'}
                          ${isSel ? 'ring-3 ring-cb-blue ring-offset-1 shadow-lg scale-[1.02]' : ''}
                        `}
                        style={{
                          top: top + 1,
                          height: height - 2,
                          backgroundColor: isSel ? mod.couleur : mod.couleur + 'cc',
                          color: 'white',
                        }}
                        title={`${mod.nom} — ${mod.site} (${available} place${available > 1 ? 's' : ''} disponible${available > 1 ? 's' : ''})`}
                      >
                        <div className="flex flex-col justify-between h-full overflow-hidden">
                          <div>
                            <p className="font-bold text-sm leading-tight drop-shadow-sm">{mod.nom}</p>
                            <p className="text-xs opacity-90 drop-shadow-sm">{mod.site}</p>
                          </div>
                          <p className="text-xs opacity-80 mt-1">{available}/{mod.placesTotal} pl.</p>
                        </div>
                        {isSel && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-cb-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legende */}
      <div className="mt-3 flex flex-wrap gap-3 justify-center">
        {modules.filter((m, i, arr) => arr.findIndex(a => a.nom === m.nom) === i).map((mod) => (
          <div key={mod.nom} className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: mod.couleur }} />
            {mod.nom}
          </div>
        ))}
      </div>

      {/* Encart autre semaine (visible des qu'il y a une selection) */}
      {selected.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Après inscription, vous pourrez revenir choisir d'autres modules pour une autre semaine.
          </p>
        </div>
      )}
    </div>
  )
}
