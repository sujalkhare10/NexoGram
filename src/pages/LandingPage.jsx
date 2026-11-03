import { useNavigate } from 'react-router-dom'
import { Hexagon, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LandingPage() {
  const { loginAsDemoUser } = useAuth()
  const navigate = useNavigate()

  const handleDemoLogin = async () => {
    try {
      await loginAsDemoUser('demo-user-1')
      toast.success('Welcome! Logged in as Alex Rivera.')
      navigate('/home')
    } catch {
      toast.error('Failed to log in as demo user')
    }
  }

  const handleThirdPartyMock = (provider) => {
    toast(`Connecting with ${provider}... signing in as demo user`)
    handleDemoLogin()
  }

  const footerLinks = [
    'About',
    'Download the NexoGram app',
    'Help Center',
    'Terms of Service',
    'Privacy Policy',
    'Cookie Policy',
    'Accessibility',
    'Ads info',
    'Blog',
    'Careers',
    'Brand Resources',
    'Advertising',
    'Marketing',
    'NexoGram for Business',
    'Developers',
    'Directory',
    'Settings',
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col justify-between selection:bg-violet-500 selection:text-white">
      {/* Main Split Content (Twitter / X style) */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 py-8 lg:py-12">
        {/* Left: Giant Iconic Logo */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 w-full lg:w-auto">
          <div className="relative group flex items-center justify-center">
            {/* Ambient background glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/20 rounded-full blur-3xl opacity-50 dark:opacity-40" />

            {/* Giant Logo Icon (Twitter / X style) */}
            <div className="relative flex items-center justify-center">
              <Hexagon className="w-28 h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 text-violet-600 dark:text-violet-500 fill-violet-600/10 dark:fill-violet-500/15 stroke-[1.4] transition-transform duration-500 group-hover:scale-[1.02]" />
              
              {/* Inner interconnected aesthetic node */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-500 bg-clip-text text-transparent select-none">
                  N
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Join / Auth Section (Twitter / X style) */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 w-full max-w-lg lg:max-w-xl">
          {/* Mobile small logo */}
          <div className="lg:hidden mb-6">
            <Hexagon className="w-10 h-10 text-violet-600 dark:text-violet-400 fill-violet-600/20" />
          </div>

          {/* Twitter / X Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.08] mb-8 sm:mb-12">
            Happening now
          </h1>

          {/* Subheading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
            Join today.
          </h2>

          {/* Action Buttons Box (Twitter / X width) */}
          <div className="w-full max-w-[340px] space-y-3.5">
            {/* Sign up with Google */}
            <button
              onClick={() => handleThirdPartyMock('Google')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-white text-gray-800 text-sm font-semibold rounded-full border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Sign up with Apple */}
            <button
              onClick={() => handleThirdPartyMock('Apple')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-white text-gray-800 text-sm font-semibold rounded-full border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.62-7.85-11.77-14.4-6.41-10.13-11.49-21.73-15.25-34.79-3.76-13.06-5.64-24.87-5.64-35.43 0-14.4 3.7-26.15 11.1-35.25 7.4-9.1 16.5-13.75 27.3-13.95 5.03 0 10.74 1.34 17.13 4.02 6.39 2.68 10.42 4.07 12.1 4.17 1.35 0 5.46-1.42 12.33-4.26 6.87-2.84 12.37-4.14 16.5-3.9 12.24.6 22.37 5.12 30.38 13.56-10.86 6.53-16.19 15.67-15.99 27.42.2 9.38 3.86 17.26 10.98 23.63 7.12 6.37 15.5 10.02 25.13 10.95-2.28 6.84-5.06 13.92-8.35 21.25zM119.22 31.84c0-7.05 2.6-13.72 7.8-20.01 5.2-6.29 11.63-10.47 19.3-12.54.4 1.48.6 2.92.6 4.33 0 7.05-2.63 13.82-7.89 20.31-5.26 6.49-11.83 10.66-19.71 12.51-.07-1.5-.1-3.03-.1-4.6z" />
              </svg>
              <span>Sign up with Apple</span>
            </button>

            {/* "or" divider */}
            <div className="flex items-center my-3">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
              <span className="flex-shrink mx-3 text-xs uppercase text-gray-500 font-medium">
                or
              </span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
            </div>

            {/* Create account button */}
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full transition-colors text-center text-sm shadow-md shadow-violet-500/25 cursor-pointer"
            >
              Create account
            </button>

            {/* Terms text */}
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal pt-1">
              By signing up, you agree to the{' '}
              <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                Privacy Policy
              </a>
              , including{' '}
              <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                Cookie Use
              </a>
              .
            </p>

            {/* One-Click Quick Demo Exploration Button */}
            <div className="pt-3">
              <button
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-full transition-all text-center text-sm shadow-lg shadow-violet-500/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore with Demo Account</span>
              </button>
            </div>

            {/* Already have an account */}
            <div className="pt-8">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-3.5">
                Already have an account?
              </h3>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 border border-gray-300 dark:border-gray-700 text-violet-600 dark:text-violet-400 font-bold rounded-full hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-center text-sm cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Twitter / X Style Footer */}
      <footer className="w-full py-4 px-6 border-t border-gray-200 dark:border-gray-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-500 dark:text-gray-500">
          {footerLinks.map((link, idx) => (
            <a
              key={idx}
              href="#"
              className="hover:underline transition-colors"
            >
              {link}
            </a>
          ))}
          <span>&copy; 2026 NexoGram Corp.</span>
        </div>
      </footer>
    </div>
  )
}
