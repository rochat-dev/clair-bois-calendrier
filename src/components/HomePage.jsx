/**
 * HomePage.jsx — Ecran 1 : Page d'accueil.
 *
 * Affiche deux parcours principaux :
 *  1. Modules metiers — semaine type de decouverte (max 3 modules)
 *  2. Stages — calendrier classique par etablissement/secteur
 *
 * Puis la grille des etablissements pour le parcours stages.
 *
 * @param {Object} props.data                    - Donnees completes du planning
 * @param {Function} props.onSelectEtablissement - Callback quand un etablissement est choisi
 * @param {Function} props.onGoToModules         - Callback pour aller aux modules metiers
 */
import { getUniqueCreneaux } from '../utils/helpers'
import InfoBulle from './InfoBulle'

export default function HomePage({ data, onSelectEtablissement, onGoToModules }) {
  const { organization, etablissements, lastUpdated, formsUrlNouvelEtablissement } = data

  // Formater la date de derniere mise a jour en francais (ex: "7 mars 2026 a 14:30")
  const updateDate = new Date(lastUpdated).toLocaleDateString('fr-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Nombre total de places stages disponibles (tous etablissements confondus)
  const totalPlacesStages = etablissements.reduce(
    (sum, etab) => sum + etab.secteurs.reduce(
      (sSum, s) => sSum + getUniqueCreneaux(s.weeks).reduce((wSum, w) => wSum + Math.max(0, w.totalSlots - w.usedSlots), 0),
      0
    ),
    0
  )

  // Nombre de modules metiers disponibles
  const nbModules = data.modulesMetiers?.modules?.length || 0

  return (
    <div className="animate-fadeIn">
      {/* Introduction du site */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Plateforme d'inscription
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choisissez votre parcours : découvrez nos modules métiers pour une semaine d'immersion, ou inscrivez-vous directement à un stage.
        </p>
      </div>

      {/* Deux cartes principales cote a cote */}
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        {/* Carte Modules Metiers */}
        {data.modulesMetiers && (
          <button
            onClick={onGoToModules}
            className="bg-gradient-to-br from-cb-blue to-cb-blue/80 rounded-xl p-6
                       text-left text-white hover:shadow-lg transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-cb-blue focus:ring-offset-2
                       cursor-pointer group"
          >
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Modules métiers</h3>
              <p className="text-white/80 text-sm flex-1">
                Semaine de découverte : choisissez jusqu'à 3 modules (cuisine, pâtisserie, technique…) et inscrivez-vous pour une semaine d'immersion.
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                <span className="text-sm text-white/70">{nbModules} modules disponibles</span>
                <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        )}

        {/* Carte Stages */}
        <button
          onClick={() => {
            // Scroll vers la section etablissements
            document.getElementById('section-stages')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="bg-gradient-to-br from-cb-green to-cb-green/80 rounded-xl p-6
                     text-left text-white hover:shadow-lg transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-cb-green focus:ring-offset-2
                     cursor-pointer group"
        >
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Stages</h3>
            <p className="text-white/80 text-sm flex-1">
              Consultez le calendrier des disponibilités de stage dans nos établissements et inscrivez-vous en ligne.
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
              <span className="text-sm text-white/70">{totalPlacesStages} place{totalPlacesStages > 1 ? 's' : ''} disponible{totalPlacesStages > 1 ? 's' : ''}</span>
              <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Section Stages — etablissements */}
      <div id="section-stages">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Stages — Choisissez un établissement
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {etablissements.map((etab) => {
            const totalPlaces = etab.secteurs.reduce(
              (sum, s) => sum + getUniqueCreneaux(s.weeks).reduce((wSum, w) => wSum + Math.max(0, w.totalSlots - w.usedSlots), 0),
              0
            )

            return (
              <button
                key={etab.id}
                onClick={() => onSelectEtablissement(etab)}
                className="bg-white rounded-xl border border-gray-200 p-5 text-left
                           hover:border-cb-blue hover:shadow-md transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-cb-blue focus:ring-offset-2
                           cursor-pointer group"
                aria-label={`Voir les disponibilités de ${etab.name}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {etab.icon}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 group-hover:text-cb-blue transition-colors">
                      {etab.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {etab.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {etab.secteurs.length} secteur{etab.secteurs.length > 1 ? 's' : ''}
                  </span>
                  <span
                    className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      totalPlaces > 0
                        ? 'bg-cb-green-light text-cb-green'
                        : 'bg-cb-red-light text-cb-red'
                    }`}
                  >
                    {totalPlaces} place{totalPlaces > 1 ? 's' : ''} disponible{totalPlaces > 1 ? 's' : ''}
                  </span>
                </div>
              </button>
            )
          })}

          {/* Carte "Ajouter un etablissement" */}
          <a
            href={formsUrlNouvelEtablissement}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border-2 border-dashed border-gray-300 p-5 text-center
                       hover:border-cb-blue hover:bg-cb-blue-light transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-cb-blue focus:ring-offset-2
                       cursor-pointer group flex flex-col items-center justify-center gap-3 min-h-[140px]"
            aria-label="Proposer un nouvel établissement"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-cb-blue/10 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-cb-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-500 group-hover:text-cb-blue transition-colors inline-flex items-center gap-1.5">
                Ajouter un établissement
                <InfoBulle>
                  <p className="font-semibold mb-1">Espace réservé aux responsables</p>
                  <p>Cette action est destinée aux <strong>référents cadres</strong> de la Fondation Clair-Bois. Un <strong>code d'accès</strong> vous sera demandé dans le formulaire pour valider votre identité.</p>
                </InfoBulle>
              </p>
              <p className="text-xs text-gray-400 mt-1">Espace référent cadre</p>
            </div>
          </a>
        </div>
      </div>

      {/* Horodatage de la derniere mise a jour */}
      <p className="text-center text-sm text-gray-400 mt-8">
        Dernière mise à jour : {updateDate}
      </p>
    </div>
  )
}
