/**
 * App.jsx — Composant racine de l'application Calendrier Clair-Bois.
 *
 * Responsabilites :
 *  1. Charger le fichier planning.json au demarrage (une seule fois)
 *  2. Transformer les donnees brutes (format Power Automate) en structure hierarchique
 *  3. Gerer la navigation entre les 4 ecrans via un systeme d'etat simple
 *
 * Navigation (sans React Router, geree par useState) :
 *  - "home"          → HomePage           : choix de l'etablissement
 *  - "etablissement" → EtablissementPage  : choix du secteur
 *  - "secteur"       → SecteurCalendar    : calendrier mensuel
 *  - "week"          → WeekDetail         : detail d'une semaine + inscription
 */
import { useState, useEffect } from 'react'
import { transformPlanningData } from './utils/helpers'
import Header from './components/Header'
import HomePage from './components/HomePage'
import EtablissementPage from './components/EtablissementPage'
import SecteurCalendar from './components/SecteurCalendar'
import WeekDetail from './components/WeekDetail'
import ModulesMetiers from './components/ModulesMetiers'
import StagesPage from './components/StagesPage'

function App() {
  /* --- Etat du chargement des donnees --- */
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* --- Etat de la navigation entre ecrans --- */
  const [currentView, setCurrentView] = useState('home')
  const [selectedEtablissement, setSelectedEtablissement] = useState(null)
  const [selectedSecteur, setSelectedSecteur] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)

  /**
   * Chargement initial de planning.json.
   * Le fichier est genere automatiquement par le Flux 3 Power Automate
   * et pousse sur GitHub. Le cache est desactive pour toujours obtenir
   * la version la plus recente.
   */
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'planning.json', { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des données')
        return res.json()
      })
      .then((json) => {
        // Transforme le format plat (Power Automate) en hierarchie etablissements > secteurs > semaines
        setData(transformPlanningData(json))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  /* --- Fonctions de navigation --- */

  /** Retour a la page d'accueil (reinitialise toutes les selections) */
  const goToHome = () => {
    setCurrentView('home')
    setSelectedEtablissement(null)
    setSelectedSecteur(null)
    setSelectedWeek(null)
  }

  /** Selection d'un etablissement → affiche ses secteurs */
  const goToEtablissement = (etab) => {
    setSelectedEtablissement(etab)
    setSelectedSecteur(null)
    setSelectedWeek(null)
    setCurrentView('etablissement')
  }

  /** Selection d'un secteur → affiche le calendrier mensuel */
  const goToSecteur = (secteur) => {
    setSelectedSecteur(secteur)
    setSelectedWeek(null)
    setCurrentView('secteur')
  }

  /** Selection d'une semaine → affiche le detail avec bouton d'inscription */
  const goToWeek = (week) => {
    setSelectedWeek(week)
    setCurrentView('week')
  }

  /** Retour au niveau etablissement (depuis le calendrier) */
  const goBackToEtablissement = () => {
    setSelectedSecteur(null)
    setSelectedWeek(null)
    setCurrentView('etablissement')
  }

  /** Retour au calendrier (depuis le detail semaine) */
  const goBackToSecteur = () => {
    setSelectedWeek(null)
    setCurrentView('secteur')
  }

  /** Navigation vers les modules metiers */
  const goToModules = () => {
    setCurrentView('modules')
    setSelectedEtablissement(null)
    setSelectedSecteur(null)
    setSelectedWeek(null)
  }

  /** Navigation vers les stages */
  const goToStages = () => {
    setCurrentView('stages')
    setSelectedEtablissement(null)
    setSelectedSecteur(null)
    setSelectedWeek(null)
  }

  /* --- Ecran de chargement (spinner) --- */
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

  /* --- Ecran d'erreur (si planning.json inaccessible) --- */
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

  /* --- Page "En travaux" --- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header organization={data.organization} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
          <div className="text-8xl mb-6">🏗️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Site en travaux</h2>
          <p className="text-gray-500 text-center max-w-md mb-2">
            Nous préparons de nouvelles fonctionnalités pour améliorer votre expérience d'inscription.
          </p>
          <p className="text-gray-400 text-sm">Revenez bientôt !</p>
          <div className="mt-8 flex gap-3">
            <div className="w-3 h-3 rounded-full bg-cb-blue animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-cb-green animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 rounded-full bg-cb-blue animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </main>
    </div>
  )

}

export default App
