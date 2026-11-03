import { useState, useRef, useEffect } from 'react'

export default function DropdownMenu({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden py-1">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); item.onClick(); setIsOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 ${
                item.danger ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
