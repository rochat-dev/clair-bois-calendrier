import InfoBulle from './InfoBulle'

/** Écran 1 : Page d'accueil avec choix de l'établissement */
export default function HomePage({ data, onSelectEtablissement }) {
  const { organization, etablissements, lastUpdated, formsUrlNouvelEtablissement } = data

  // Formater la date de dernière mise à jour
  const updateDate = new Date(lastUpdated).toLocaleDateString('fr-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="animate-fadeIn">
      {/* Introduction */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Calendrier des disponibilités de stage
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {organization?.description ||
            'Consultez les disponibilités de stage dans nos établissements et inscrivez-vous en ligne.'}
        </p>
      </div>

      {/* Liste des établissements */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Choisissez un établissement
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {etablissements.map((etab) => {
          // Calculer le nombre total de places disponibles
          const totalPlaces = etab.secteurs.reduce(
            (sum, s) => sum + s.weeks.reduce((wSum, w) => wSum + Math.max(0, w.totalSlots - w.usedSlots), 0),
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
              {/* Icône et nom */}
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

              {/* Résumé */}
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

        {/* Carte "+" pour ajouter un établissement (référent cadre) */}
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

      {/* Timestamp mise à jour */}
      <p className="text-center text-sm text-gray-400 mt-8">
        Dernière mise à jour : {updateDate}
      </p>
    </div>
  )
}
