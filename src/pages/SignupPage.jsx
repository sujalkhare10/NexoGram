import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, AtSign } from 'lucide-react'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleUsernameChange = (e) => {
    // Only allow alphanumeric and underscores, lowercase
    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(clean)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!displayName.trim() || !username.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await signUp(email.trim(), password, {
        display_name: displayName.trim(),
        username: username.trim(),
      })
      toast.success('Account created successfully! Welcome to NexoGram.')
      navigate('/home')
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'Failed to create account')
      toast.error(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join NexoGram and start connecting today
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Alex Rivera"
            icon={User}
            required
            maxLength={50}
          />

          <Input
            label="Username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="alexrivera"
            icon={AtSign}
            required
            maxLength={30}
          />

          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            icon={Lock}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
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
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

