import Breadcrumb from './Breadcrumb'
import InfoBulle from './InfoBulle'
import { countAvailableWeeks, getStatusColor } from '../utils/helpers'

/** Écran 2 : Page d'un établissement avec choix du secteur */
export default function EtablissementPage({
  etablissement,
  formsUrlNouveauSecteur,
  onSelectSecteur,
  onBack,
}) {
  const breadcrumbItems = [
    { label: 'Accueil', onClick: onBack },
    { label: etablissement.name },
  ]

  return (
    <div className="animate-fadeIn">
      <Breadcrumb items={breadcrumbItems} onNavigate={onBack} />

      {/* Bouton retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-cb-blue hover:text-cb-blue/80
                   transition-colors mb-6 cursor-pointer"
        aria-label="Retour à l'accueil"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour
      </button>

      {/* Titre établissement */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl" role="img" aria-hidden="true">
          {etablissement.icon}
        </span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{etablissement.name}</h2>
          <p className="text-gray-500">{etablissement.description}</p>
        </div>
      </div>

      {/* Liste des secteurs */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Choisissez un secteur de stage
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {etablissement.secteurs.map((secteur) => {
          const availableWeeks = countAvailableWeeks(secteur)
          const totalWeeks = secteur.weeks.length

          // Déterminer le statut global du secteur
          let globalStatus = 'full'
          if (availableWeeks > totalWeeks / 2) globalStatus = 'available'
          else if (availableWeeks > 0) globalStatus = 'almost_full'

          return (
            <button
              key={secteur.id}
              onClick={() => onSelectSecteur(secteur)}
              className="bg-white rounded-xl border border-gray-200 p-5 text-left
                         hover:border-cb-blue hover:shadow-md transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-cb-blue focus:ring-offset-2
                         cursor-pointer group"
              aria-label={`Voir le calendrier de ${secteur.name}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 group-hover:text-cb-blue transition-colors">
                  {secteur.name}
                </h4>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(globalStatus)}`}
                >
                  {availableWeeks}/{totalWeeks} sem.
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-3">{secteur.description}</p>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    globalStatus === 'available'
                      ? 'bg-cb-green'
                      : globalStatus === 'almost_full'
                        ? 'bg-cb-orange'
                        : 'bg-cb-red'
                  }`}
                  style={{
                    width: `${totalWeeks > 0 ? (availableWeeks / totalWeeks) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {availableWeeks} semaine{availableWeeks > 1 ? 's' : ''} disponible{availableWeeks > 1 ? 's' : ''}
              </p>
            </button>
          )
        })}

        {/* Carte "+" pour ajouter un secteur (référent cadre) */}
        <a
          href={`${formsUrlNouveauSecteur}?etablissement=${encodeURIComponent(etablissement.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border-2 border-dashed border-gray-300 p-5 text-center
                     hover:border-cb-blue hover:bg-cb-blue-light transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-cb-blue focus:ring-offset-2
                     cursor-pointer group flex flex-col items-center justify-center gap-3 min-h-[120px]"
          aria-label="Proposer un nouveau secteur"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-cb-blue/10 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-cb-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-500 group-hover:text-cb-blue transition-colors text-sm inline-flex items-center gap-1.5">
              Ajouter un secteur
              <InfoBulle>
                <p className="font-semibold mb-1">Espace réservé aux responsables</p>
                <p>Vous êtes <strong>responsable de secteur</strong> dans cet établissement ? Vous pouvez proposer un nouveau secteur de stage. Un <strong>code d'accès</strong> vous sera demandé pour valider votre demande.</p>
              </InfoBulle>
            </p>
            <p className="text-xs text-gray-400 mt-1">Espace référent cadre</p>
          </div>
        </a>
      </div>
    </div>
  )
}
