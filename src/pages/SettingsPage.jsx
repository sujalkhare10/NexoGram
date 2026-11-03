import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, LogOut, User, Cloud } from 'lucide-react'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { isFirebaseConfigured } from '../lib/firebase'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/login')
    } catch (err) {
      toast.error('Failed to sign out')
    } finally {
      setShowSignoutConfirm(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-xs text-gray-500">Manage your NexoGram preferences</p>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Appearance Section */}
        <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Appearance
              </h2>
              <p className="text-xs text-gray-500">
                Customize your display theme
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Dark Mode
              </p>
              <p className="text-xs text-gray-500">
                Currently using {theme === 'dark' ? 'Dark' : 'Light'} theme
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-violet-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Database & Cloud Firestore Section */}
        <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Cloud Firestore Backend
              </h2>
              <p className="text-xs text-gray-500">
                Database & authentication engine
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Database Engine</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Google Cloud Firestore
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Connection Mode</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isFirebaseConfigured
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {isFirebaseConfigured ? 'Live Cloud Firestore Connected' : 'Local Storage Demo Mode'}
              </span>
            </div>

            {isFirebaseConfigured && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Firebase Project ID</span>
                <span className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nexogram-101205'}
                </span>
              </div>
            )}

            <p className="text-xs text-gray-500 pt-1 leading-relaxed">
              {isFirebaseConfigured
                ? 'Your app is directly synchronized with your live Google Firebase project.'
                : 'To link your live Firebase project, paste your Firebase web config keys into your .env file as described in the README.'}
            </p>
          </div>
        </div>

        {/* Account Information Section */}
        {user && (
          <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">
                  Account Details
                </h2>
                <p className="text-xs text-gray-500">
                  Your logged-in profile information
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Display Name</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {profile?.display_name || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Username</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  @{profile?.username || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email Address</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {user.email || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">User UID</span>
                <span className="text-xs font-mono text-gray-500 truncate max-w-[180px]">
                  {user.id}
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowSignoutConfirm(true)}
                className="w-full justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of NexoGram
              </Button>
            </div>
          </div>
        )}

        {/* About App */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-600 pt-4">
          <p className="font-semibold">NexoGram v2.0</p>
          <p className="mt-1">Built with React, Vite, Tailwind CSS & Google Cloud Firestore.</p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showSignoutConfirm}
        onClose={() => setShowSignoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign out of NexoGram?"
        message="You will need to sign back in with your credentials to post or view your bookmarks."
        confirmText="Sign Out"
      />
    </div>
  )
}
