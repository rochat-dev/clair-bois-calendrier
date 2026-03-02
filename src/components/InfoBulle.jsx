import { useState, useRef, useEffect } from 'react'

/**
 * Infobulle discrète qui s'affiche au survol (desktop) ou au clic (mobile).
 * Utilisée pour expliquer les actions réservées aux référents cadres.
 */
export default function InfoBulle({ children }) {
  const [visible, setVisible] = useState(false)
  const bulleRef = useRef(null)

  // Fermer au clic en dehors
  useEffect(() => {
    if (!visible) return
    const handleClickOutside = (e) => {
      if (bulleRef.current && !bulleRef.current.contains(e.target)) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [visible])

  return (
    <span className="relative inline-flex" ref={bulleRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setVisible(!visible)
        }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="w-5 h-5 rounded-full bg-gray-200 hover:bg-cb-blue/20 text-gray-400
                   hover:text-cb-blue flex items-center justify-center text-xs font-bold
                   transition-colors cursor-pointer focus:outline-none focus:ring-2
                   focus:ring-cb-blue focus:ring-offset-1"
        aria-label="Plus d'informations"
      >
        ?
      </button>

      {visible && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                      w-64 p-3 bg-gray-900 text-white text-xs leading-relaxed
                      rounded-lg shadow-lg animate-fadeIn"
          role="tooltip"
        >
          {children}
          {/* Flèche */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                          border-l-[6px] border-l-transparent
                          border-r-[6px] border-r-transparent
                          border-t-[6px] border-t-gray-900" />
        </div>
      )}
    </span>
  )
}
