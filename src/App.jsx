import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import MainLayout from './components/layout/MainLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import NotificationsPage from './pages/NotificationsPage'
import BookmarksPage from './pages/BookmarksPage'
import ProfilePage from './pages/ProfilePage'
import PostDetailPage from './pages/PostDetailPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import EmptyState from './components/ui/EmptyState'
import { Mail } from 'lucide-react'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public only route (e.g. login, signup)
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/home" replace />
  }

  return children
}

// Messages Placeholder UI
function MessagesPlaceholder() {
  return (
    <div className="p-4 sm:p-6">
      <div className="sticky top-0 z-30 px-4 py-3 -mx-4 -mt-4 mb-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold">Messages</h1>
      </div>
      <EmptyState
        icon={Mail}
        title="Direct Messages Coming Soon"
        description="Private end-to-end conversations between NexoGram users are currently under development. Stay tuned for real-time messaging!"
      />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  return (
    <Routes>
      {/* Root path: landing page if logged out, redirect to /home if logged in */}
      <Route
        path="/"
        element={
          loading ? (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : user ? (
            <Navigate to="/home" replace />
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Direct landing page access */}
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Core social routes wrapped in MainLayout */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <MainLayout>
            <ExplorePage />
          </MainLayout>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookmarksPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:username"
        element={
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/post/:postId"
        element={
          <MainLayout>
            <PostDetailPage />
          </MainLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <MainLayout>
            <SettingsPage />
          </MainLayout>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MessagesPlaceholder />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
