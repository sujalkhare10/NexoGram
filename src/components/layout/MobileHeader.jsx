import { Link } from 'react-router-dom'
import { Hexagon, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function MobileHeader() {
  const { profile } = useAuth()

  const profileLink = profile?.username ? `/profile/${profile.username}` : '/profile'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* User Avatar */}
        <Link to={profileLink} className="shrink-0">
          <img
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || 'User')}&background=8b5cf6&color=fff`}
            alt={profile?.display_name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <Hexagon className="w-7 h-7 text-violet-500 fill-violet-500/20" />
          <span className="text-lg font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            NexoGram
          </span>
        </Link>

        {/* Settings */}
        <Link to="/settings" className="shrink-0 p-1 text-gray-600 dark:text-gray-400 hover:text-violet-500 transition-colors duration-200">
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </header>
  )
}
