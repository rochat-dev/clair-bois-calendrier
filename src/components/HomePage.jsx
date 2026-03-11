/**
 * HomePage.jsx — Ecran 1 : Page d'accueil.
 *
 * Affiche deux parcours principaux :
 *  1. Modules metiers — semaine type de decouverte (max 3 modules)
 *  2. Stages — choix "deja inscrit" (formulaire court) ou "nouvelle inscription" (formulaire complet)
 *
 * @param {Object} props.data            - Donnees completes du planning
 * @param {Function} props.onGoToModules - Callback pour aller aux modules metiers
 */
import { useState } from 'react'

/** URL temporaire pour le formulaire "deja inscrit" (a remplacer par le vrai formulaire) */
const FORMS_URL_DEJA_INSCRIT = 'https://google.ch'

export default function HomePage({ data, onGoToModules }) {
  const [showStageChoix, setShowStageChoix] = useState(false)
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
          onClick={() => setShowStageChoix(true)}
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
            <h3 className="text-xl font-bold mb-2">Demande de stage</h3>
            <p className="text-white/80 text-sm flex-1">
              Remplissez le formulaire d'inscription pour faire une demande de stage dans l'un de nos établissements.
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
              <span className="text-sm text-white/70">Formulaire en ligne</span>
              <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Modal choix stage : deja inscrit ou nouvelle inscription */}
      {showStageChoix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowStageChoix(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fadeIn" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Demande de stage</h3>
            <p className="text-gray-600 text-sm mb-6">
              Avez-vous déjà effectué un stage ou un module métier à la Fondation Clair-Bois ?
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Deja inscrit */}
              <a
                href={FORMS_URL_DEJA_INSCRIT}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200
                           hover:border-cb-blue hover:bg-cb-blue-light transition-all duration-200
                           cursor-pointer group no-underline text-center"
              >
                <div className="w-12 h-12 rounded-full bg-cb-blue-light flex items-center justify-center group-hover:bg-cb-blue/20 transition-colors">
                  <svg className="w-6 h-6 text-cb-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-cb-blue transition-colors">Oui, déjà inscrit</p>
                  <p className="text-xs text-gray-500 mt-1">Formulaire simplifié</p>
                </div>
              </a>

              {/* Nouvelle inscription */}
              <a
                href={data.formsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200
                           hover:border-cb-green hover:bg-cb-green-light transition-all duration-200
                           cursor-pointer group no-underline text-center"
              >
                <div className="w-12 h-12 rounded-full bg-cb-green-light flex items-center justify-center group-hover:bg-cb-green/20 transition-colors">
                  <svg className="w-6 h-6 text-cb-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-cb-green transition-colors">Non, première fois</p>
                  <p className="text-xs text-gray-500 mt-1">Formulaire complet</p>
                </div>
              </a>
            </div>

            <button
              onClick={() => setShowStageChoix(false)}
              className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Mention Fondation */}
      <p className="text-center text-sm text-gray-400 mt-8">
        Fondation Clair-Bois — Genève
      </p>
    </div>
  )
}
