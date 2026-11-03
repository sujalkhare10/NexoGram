import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Compass, Bell, Mail, Bookmark, User, Settings, LogOut, Feather, Hexagon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/messages', label: 'Messages', icon: Mail },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ onCreatePost, unreadNotifications = 0 }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const profileLink = profile?.username ? `/profile/${profile.username}` : '/profile'

  return (
    <aside className="fixed left-0 top-0 h-screen z-40 hidden lg:flex flex-col justify-between border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 xl:w-[280px] lg:w-[72px]">
      {/* Logo */}
      <div className="flex flex-col">
        <NavLink to="/home" className="flex items-center gap-3 p-4 xl:px-6 lg:justify-center xl:justify-start">
          <Hexagon className="w-8 h-8 text-violet-500 fill-violet-500/20 shrink-0" />
          <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent hidden xl:block">
            NexoGram
          </span>
        </NavLink>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 mt-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const linkTo = label === 'Profile' ? profileLink : to
            return (
              <NavLink
                key={label}
                to={linkTo}
                end={to === '/home'}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-full transition-colors duration-200 lg:justify-center xl:justify-start group ${
                    isActive
                      ? 'font-bold text-violet-600 dark:text-violet-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="w-6 h-6 shrink-0" />
                  {label === 'Notifications' && unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-violet-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </div>
                <span className="text-lg hidden xl:block">{label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Create Post Button */}
        <div className="px-3 mt-4">
          <button
            onClick={onCreatePost}
            className="w-full flex items-center justify-center gap-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-full p-3 xl:py-3 transition-colors duration-200 shadow-lg shadow-violet-500/25 cursor-pointer"
          >
            <Feather className="w-6 h-6 shrink-0 xl:hidden" />
            <span className="hidden xl:block text-lg">Create Post</span>
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-3 mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 lg:justify-center xl:justify-start cursor-pointer"
        >
          <img
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || 'User')}&background=8b5cf6&color=fff`}
            alt={profile?.display_name || 'User'}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="hidden xl:flex flex-col items-start flex-1 min-w-0">
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-full">
              {profile?.display_name || 'User'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-full">
              @{profile?.username || 'username'}
            </span>
          </div>
          <LogOut className="w-5 h-5 text-gray-500 hidden xl:block shrink-0" />
        </button>
      </div>
    </aside>
  )
}
