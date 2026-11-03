import { Link } from 'react-router-dom'
import { Hexagon, Home } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-violet-100 dark:bg-violet-950/50 rounded-3xl mx-auto flex items-center justify-center mb-6">
          <Hexagon className="w-10 h-10 text-violet-600 dark:text-violet-400 fill-violet-600/20" />
        </div>

        <h1 className="text-6xl font-black text-violet-600 mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
        </p>

        <Link to="/home">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2">
            <Home className="w-5 h-5" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

