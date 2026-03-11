/**
 * HomePage.jsx — Ecran 1 : Page d'accueil.
 *
 * Affiche la liste des etablissements de la fondation sous forme de cartes.
 * Chaque carte montre :
 *  - Le nom et l'icone de l'etablissement
 *  - Sa description
 *  - Le nombre de secteurs
 *  - Le nombre total de places disponibles (calcule en dedupliquant les creneaux)
 *
 * En bas de la grille, une carte en bordure pointillee permet aux referents
 * cadres de proposer un nouvel etablissement via Microsoft Forms.
 *
 * @param {Object} props.data                    - Donnees completes du planning
 * @param {Function} props.onSelectEtablissement - Callback quand un etablissement est choisi
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

  return (
    <div className="animate-fadeIn">
      {/* Introduction du site */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Calendrier des disponibilités de stage
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {organization?.description ||
            'Consultez les disponibilités de stage dans nos établissements et inscrivez-vous en ligne.'}
        </p>
      </div>

      {/* Carte Modules Metiers */}
      {data.modulesMetiers && (
        <button
          onClick={onGoToModules}
          className="w-full bg-gradient-to-r from-cb-blue to-cb-blue/80 rounded-xl p-5 mb-8
                     text-left text-white hover:shadow-lg transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-cb-blue focus:ring-offset-2
                     cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold">Modules métiers</h3>
              <p className="text-white/80 text-sm mt-1">
                Découvrez les modules métiers disponibles et inscrivez-vous pour une semaine de découverte
              </p>
            </div>
            <svg className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      )}

      {/* Titre de la grille */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Choisissez un établissement
      </h3>

      {/* Grille des cartes etablissements (responsive : 1/2/3 colonnes) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {etablissements.map((etab) => {
          // Calculer le total de places disponibles en dedupliquant les creneaux
          // (un meme creneau peut couvrir plusieurs semaines → eviter de compter double)
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
              {/* Icone et nom de l'etablissement */}
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

              {/* Resume : nombre de secteurs + places disponibles avec badge couleur */}
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

        {/* Carte "Ajouter un etablissement" pour les referents cadres.
            Bordure pointillee + InfoBulle explicative.
            Redirige vers le formulaire Microsoft Forms (formsUrlNouvelEtablissement). */}
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

      {/* Horodatage de la derniere mise a jour (generee par le Flux 3 Power Automate) */}
      <p className="text-center text-sm text-gray-400 mt-8">
        Dernière mise à jour : {updateDate}
      </p>
    </div>
  )
}
