import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, loginAsDemoUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Welcome back to NexoGram!')
      navigate('/home')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to sign in. Please check your credentials.')
      toast.error(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = async (userId) => {
    try {
      await loginAsDemoUser(userId)
      toast.success('Signed in as demo user!')
      navigate('/home')
    } catch (err) {
      console.error(err)
      toast.error('Failed to start demo session')
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign in to NexoGram
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your details to access your feed
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-500/20"
          >
            Sign In
          </Button>
        </form>

        {/* Quick Demo Login */}
        <div className="pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            <span className="flex-shrink mx-3 text-xs uppercase tracking-wider text-gray-400">
              Quick One-Click Test
            </span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('demo-user-1')}
              className="text-xs font-medium"
            >
              Demo: Alex
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('demo-user-2')}
              className="text-xs font-medium"
            >
              Demo: Sarah
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
