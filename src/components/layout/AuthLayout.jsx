import { Hexagon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-8">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-400/10 dark:bg-violet-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-400/10 dark:bg-fuchsia-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 p-8">
          {/* Branding */}
          <Link to="/" className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-violet-500/10 dark:bg-violet-500/20 rounded-2xl flex items-center justify-center">
              <Hexagon className="w-8 h-8 text-violet-500 fill-violet-500/20" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              NexoGram
            </h1>
          </Link>

          {/* Content */}
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          &copy; 2026 NexoGram. All rights reserved.
        </p>
      </div>
    </div>
  )
}
