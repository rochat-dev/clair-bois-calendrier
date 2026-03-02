/** Fil d'Ariane cliquable pour la navigation */
export default function Breadcrumb({ items, onNavigate }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && <span className="mx-1">/</span>}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="hover:text-cb-blue hover:underline transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
