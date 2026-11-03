import { User } from 'lucide-react'

const sizes = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
}

export default function Avatar({ src, alt, size = 'md', className = '' }) {
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <User className="w-1/2 h-1/2" />
        </div>
      )}
    </div>
  )
}
