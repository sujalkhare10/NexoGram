import { NavLink } from 'react-router-dom'
import { Home, Compass, Bell, User, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function MobileNav({ onCreatePost, unreadNotifications = 0 }) {
  const { profile } = useAuth()

  const profileLink = profile?.username ? `/profile/${profile.username}` : '/profile'

  const navItems = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '#create', label: 'Create', icon: null, isCreate: true },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: profileLink, label: 'Profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          if (item.isCreate) {
            return (
              <button
                key={item.label}
                onClick={onCreatePost}
                className="flex items-center justify-center -mt-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-violet-500 hover:bg-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 transition-colors duration-200">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </button>
            )
          }

          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/home'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 transition-colors duration-200 ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.label === 'Notifications' && unreadNotifications > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
