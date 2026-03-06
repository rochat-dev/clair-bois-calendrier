import { useState, useEffect } from 'react'
import { transformPlanningData } from './utils/helpers'
import Header from './components/Header'
import HomePage from './components/HomePage'
import EtablissementPage from './components/EtablissementPage'
import SecteurCalendar from './components/SecteurCalendar'
import WeekDetail from './components/WeekDetail'

/**
 * Composant principal de l'application.
 * Gère le chargement du JSON et la navigation entre les 4 écrans.
 */
function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Navigation : quel écran afficher
  const [currentView, setCurrentView] = useState('home')
  const [selectedEtablissement, setSelectedEtablissement] = useState(null)
  const [selectedSecteur, setSelectedSecteur] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)

  // Charger le planning.json UNE SEULE FOIS au démarrage
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'planning.json', { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des données')
        return res.json()
      })
      .then((json) => {
        setData(transformPlanningData(json))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Fonctions de navigation
  const goToHome = () => {
    setCurrentView('home')
    setSelectedEtablissement(null)
    setSelectedSecteur(null)
    setSelectedWeek(null)
  }

  const goToEtablissement = (etab) => {
    setSelectedEtablissement(etab)
    setSelectedSecteur(null)
    setSelectedWeek(null)
    setCurrentView('etablissement')
  }

  const goToSecteur = (secteur) => {
    setSelectedSecteur(secteur)
    setSelectedWeek(null)
    setCurrentView('secteur')
  }

  const goToWeek = (week) => {
    setSelectedWeek(week)
    setCurrentView('week')
  }

  const goBackToEtablissement = () => {
    setSelectedSecteur(null)
    setSelectedWeek(null)
    setCurrentView('etablissement')
  }

  const goBackToSecteur = () => {
    setSelectedWeek(null)
    setCurrentView('secteur')
  }

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cb-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement du calendrier...</p>
        </div>
      </div>
    )
  }

  // Écran d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md">
          <p className="text-cb-red font-semibold mb-2">Erreur de chargement</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-cb-blue text-white rounded-lg hover:bg-cb-blue/90 transition-colors cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header organization={data.organization} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {currentView === 'home' && (
          <HomePage data={data} onSelectEtablissement={goToEtablissement} />
        )}

        {currentView === 'etablissement' && selectedEtablissement && (
          <EtablissementPage
            etablissement={selectedEtablissement}
            formsUrlNouveauSecteur={data.formsUrlNouveauSecteur}
            onSelectSecteur={goToSecteur}
            onBack={goToHome}
          />
        )}

        {currentView === 'secteur' && selectedEtablissement && selectedSecteur && (
          <SecteurCalendar
            etablissement={selectedEtablissement}
            secteur={selectedSecteur}
            onSelectWeek={goToWeek}
            onBackToEtablissement={goBackToEtablissement}
            onBackToHome={goToHome}
          />
        )}

        {currentView === 'week' && selectedEtablissement && selectedSecteur && selectedWeek && (
          <WeekDetail
            etablissement={selectedEtablissement}
            secteur={selectedSecteur}
            week={selectedWeek}
            formsUrl={data.formsUrl}
            onBackToCalendar={goBackToSecteur}
            onBackToEtablissement={goBackToEtablissement}
            onBackToHome={goToHome}
          />
        )}
      </main>
    </div>
  )
}

export default App
