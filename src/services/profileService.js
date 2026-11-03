import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  limit, 
  getDocs, 
  isFirebaseConfigured 
} from '../lib/firebase'
import { mockDb } from '../lib/mockStore'

export const profileService = {
  // Get profile by username
  async getProfileByUsername(username) {
    if (!username) return null
    const cleanUsername = username.toLowerCase().trim()

    if (isFirebaseConfigured && db) {
      const q = query(
        collection(db, 'users'), 
        where('username', '==', cleanUsername), 
        limit(1)
      )
      const snapshot = await getDocs(q)
      if (snapshot.empty) return null
      const docData = snapshot.docs[0].data()
      return { id: snapshot.docs[0].id, ...docData }
    }

    // Mock fallback
    const users = mockDb.getUsers()
    return users.find(u => u.username.toLowerCase() === cleanUsername) || null
  },

  // Get profile by ID
  async getProfileById(id) {
    if (!id) return null

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) return null
      return { id: docSnap.id, ...docSnap.data() }
    }

    // Mock fallback
    const users = mockDb.getUsers()
    return users.find(u => u.id === id) || null
  },

  // Create or set profile
  async createProfile(id, profileData) {
    const dataToSave = {
      id,
      ...profileData,
      created_at: profileData.created_at || new Date().toISOString(),
      followers_count: profileData.followers_count || 0,
      following_count: profileData.following_count || 0,
      posts_count: profileData.posts_count || 0,
    }

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'users', id)
      await setDoc(docRef, dataToSave, { merge: true })
      return dataToSave
    }

    // Mock fallback
    const users = mockDb.getUsers()
    const index = users.findIndex(u => u.id === id)
    if (index >= 0) {
      users[index] = { ...users[index], ...dataToSave }
    } else {
      users.push(dataToSave)
    }
    mockDb.setUsers(users)
    return dataToSave
  },

  // Update profile
  async updateProfile(id, updates) {
    if (!id) throw new Error('User ID is required to update profile')

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'users', id)
      await updateDoc(docRef, updates)
      const updatedSnap = await getDoc(docRef)
      return { id: updatedSnap.id, ...updatedSnap.data() }
    }

    // Mock fallback
    const users = mockDb.getUsers()
    const index = users.findIndex(u => u.id === id)
    if (index >= 0) {
      users[index] = { ...users[index], ...updates }
      mockDb.setUsers(users)
      return users[index]
    }
    return null
  },

  // Check if username is available
  async isUsernameAvailable(username, currentUserId = null) {
    if (!username) return false
    const cleanUsername = username.toLowerCase().trim()

    if (isFirebaseConfigured && db) {
      const q = query(
        collection(db, 'users'), 
        where('username', '==', cleanUsername), 
        limit(1)
      )
      const snapshot = await getDocs(q)
      if (snapshot.empty) return true
      const existingUser = snapshot.docs[0]
      return currentUserId && existingUser.id === currentUserId
    }

    // Mock fallback
    const users = mockDb.getUsers()
    const existing = users.find(u => u.username.toLowerCase() === cleanUsername)
    if (!existing) return true
    return currentUserId && existing.id === currentUserId
  },

  // Search profiles by display name or username
  async searchProfiles(searchQuery) {
    if (!searchQuery?.trim()) return []
    const term = searchQuery.toLowerCase().trim()

    if (isFirebaseConfigured && db) {
      // In Firestore, we query users collection and filter case-insensitively
      const q = query(collection(db, 'users'), limit(50))
      const snapshot = await getDocs(q)
      const results = []
      snapshot.forEach(docSnap => {
        const u = { id: docSnap.id, ...docSnap.data() }
        const username = (u.username || '').toLowerCase()
        const displayName = (u.display_name || '').toLowerCase()
        if (username.includes(term) || displayName.includes(term)) {
          results.push(u)
        }
      })
      return results.slice(0, 20)
    }

    // Mock fallback
    const users = mockDb.getUsers()
    return users.filter(u => 
      (u.username || '').toLowerCase().includes(term) || 
      (u.display_name || '').toLowerCase().includes(term)
    ).slice(0, 20)
  },

  // Get suggested users (excluding current user and already followed users)
  async getSuggestedUsers(currentUserId, limitCount = 5) {
    if (isFirebaseConfigured && db) {
      try {
        // Get followed IDs first
        const followsQuery = query(
          collection(db, 'follows'),
          where('follower_id', '==', currentUserId || '')
        )
        const followsSnap = await getDocs(followsQuery)
        const followedIds = new Set(followsSnap.docs.map(d => d.data().following_id))
        if (currentUserId) followedIds.add(currentUserId)

        const usersQuery = query(collection(db, 'users'), limit(20))
        const usersSnap = await getDocs(usersQuery)
        const suggested = []

        usersSnap.forEach(docSnap => {
          if (!followedIds.has(docSnap.id) && suggested.length < limitCount) {
            suggested.push({ id: docSnap.id, ...docSnap.data() })
          }
        })
        return suggested
      } catch (err) {
        console.warn('Error fetching suggested users from Firestore:', err)
      }
    }

    // Mock fallback
    const users = mockDb.getUsers()
    const follows = mockDb.getFollows()
    const followedIds = new Set(
      follows.filter(f => f.follower_id === currentUserId).map(f => f.following_id)
    )
    if (currentUserId) followedIds.add(currentUserId)

    return users.filter(u => !followedIds.has(u.id)).slice(0, limitCount)
  },

  // Get counts for profile stats
  async getProfileCounts(userId) {
    if (!userId) return { postsCount: 0, followersCount: 0, followingCount: 0 }

    if (isFirebaseConfigured && db) {
      try {
        const [postsSnap, followersSnap, followingSnap] = await Promise.all([
          getDocs(query(collection(db, 'posts'), where('user_id', '==', userId))),
          getDocs(query(collection(db, 'follows'), where('following_id', '==', userId))),
          getDocs(query(collection(db, 'follows'), where('follower_id', '==', userId)))
        ])
        return {
          postsCount: postsSnap.size,
          followersCount: followersSnap.size,
          followingCount: followingSnap.size
        }
      } catch (err) {
        console.warn('Error fetching profile counts:', err)
      }
    }

    // Mock fallback
    const posts = mockDb.getPosts().filter(p => p.user_id === userId)
    const follows = mockDb.getFollows()
    const followers = follows.filter(f => f.following_id === userId)
    const following = follows.filter(f => f.follower_id === userId)

    return {
      postsCount: posts.length,
      followersCount: followers.length,
      followingCount: following.length
    }
  }
}
