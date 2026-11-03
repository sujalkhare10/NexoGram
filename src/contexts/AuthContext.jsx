import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  firebaseSignOut, 
  onAuthStateChanged,
  firebaseUpdateProfile,
  isFirebaseConfigured
} from '../lib/firebase'
import { profileService } from '../services/profileService'
import { mockDb } from '../lib/mockStore'
import { generateAvatarUrl } from '../utils/helpers'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  // Initialize user synchronously if in mock mode and saved in storage
  const [user, setUser] = useState(() => {
    if (!isFirebaseConfigured) {
      return mockDb.getCurrentUser()
    }
    return null
  })
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null
    try {
      const data = await profileService.getProfileById(userId)
      if (data) {
        setProfile(data)
        return data
      }
      return null
    } catch (err) {
      console.error('Error fetching profile:', err)
      return null
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      return await fetchProfile(user.id)
    }
    return null
  }, [user, fetchProfile])

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const formattedUser = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            }
            setUser(formattedUser)
            await fetchProfile(firebaseUser.uid)
          } else {
            setUser(null)
            setProfile(null)
          }
        } catch (err) {
          console.error('Auth state change error:', err)
        } finally {
          setLoading(false)
        }
      })

      return () => unsubscribe()
    } else {
      // Mock mode session check
      try {
        const savedUser = mockDb.getCurrentUser()
        if (savedUser?.id) {
          setUser(savedUser)
          fetchProfile(savedUser.id)
            .then((p) => {
              if (p) setProfile(p)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      } catch (err) {
        console.error('Session load error:', err)
        setLoading(false)
      }
    }
  }, [fetchProfile])

  // Sign up
  const signUp = async (email, password, { display_name, username }) => {
    const cleanUsername = username.toLowerCase().trim()
    const cleanDisplayName = display_name.trim()

    // 1. Check if username is already taken
    const isAvailable = await profileService.isUsernameAvailable(cleanUsername)
    if (!isAvailable) {
      throw new Error(`Username @${cleanUsername} is already taken. Please pick another.`)
    }

    if (isFirebaseConfigured && auth) {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      await firebaseUpdateProfile(firebaseUser, {
        displayName: cleanDisplayName,
        photoURL: generateAvatarUrl(cleanDisplayName),
      })

      // Create profile document in Firestore
      const newProfile = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        username: cleanUsername,
        display_name: cleanDisplayName,
        email,
        avatar_url: generateAvatarUrl(cleanDisplayName),
        bio: '',
        location: '',
        website: '',
        created_at: new Date().toISOString(),
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      }

      await profileService.createProfile(firebaseUser.uid, newProfile)

      const formattedUser = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: cleanDisplayName,
      }

      setUser(formattedUser)
      setProfile(newProfile)
      return { user: formattedUser, profile: newProfile }
    } else {
      // Mock sign up
      const newUserId = `user-${Date.now()}`
      const newProfile = {
        id: newUserId,
        uid: newUserId,
        username: cleanUsername,
        display_name: cleanDisplayName,
        email,
        avatar_url: generateAvatarUrl(cleanDisplayName),
        bio: '',
        location: '',
        website: '',
        created_at: new Date().toISOString(),
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      }

      await profileService.createProfile(newUserId, newProfile)

      const formattedUser = {
        id: newUserId,
        uid: newUserId,
        email,
        displayName: cleanDisplayName,
      }

      mockDb.setCurrentUser(formattedUser)
      setUser(formattedUser)
      setProfile(newProfile)
      return { user: formattedUser, profile: newProfile }
    }
  }

  // Sign in
  const signIn = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      const formattedUser = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      }
      setUser(formattedUser)
      const userProfile = await fetchProfile(firebaseUser.uid)
      return { user: formattedUser, profile: userProfile }
    } else {
      // Mock sign in
      const users = mockDb.getUsers()
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (!found) {
        throw new Error('No account found with this email. You can sign up or use Demo Login!')
      }

      const formattedUser = {
        id: found.id,
        uid: found.id,
        email: found.email,
        displayName: found.display_name,
      }

      mockDb.setCurrentUser(formattedUser)
      setUser(formattedUser)
      setProfile(found)
      return { user: formattedUser, profile: found }
    }
  }

  // Sign out
  const signOut = async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth)
    } else {
      mockDb.setCurrentUser(null)
    }
    setUser(null)
    setProfile(null)
  }

  // Quick switch to demo account
  const loginAsDemoUser = async (demoUserId = 'demo-user-1') => {
    const users = mockDb.getUsers()
    const target = users.find(u => u.id === demoUserId) || users[0]
    if (target) {
      const formattedUser = {
        id: target.id,
        uid: target.id,
        email: target.email,
        displayName: target.display_name,
      }
      mockDb.setCurrentUser(formattedUser)
      setUser(formattedUser)
      setProfile(target)
      return target
    }
  }

  // Update profile
  const updateUserProfile = async (updates) => {
    if (!user?.id) throw new Error('Not authenticated')
    const updated = await profileService.updateProfile(user.id, updates)
    setProfile(updated)
    return updated
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    loginAsDemoUser,
    refreshProfile,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
