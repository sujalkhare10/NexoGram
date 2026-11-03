import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  isFirebaseConfigured,
  increment,
  updateDoc
} from '../lib/firebase'
import { mockDb } from '../lib/mockStore'
import { notificationService } from './notificationService'

export const followService = {
  // Follow a user
  async followUser(followerId, followingId, followerProfile = null) {
    if (!followerId || !followingId) return null
    if (followerId === followingId) throw new Error('Cannot follow yourself')

    const followId = `${followerId}_${followingId}`

    if (isFirebaseConfigured && db) {
      try {
        const followRef = doc(db, 'follows', followId)
        const snap = await getDoc(followRef)
        if (snap.exists()) return snap.data()

        const followData = {
          id: followId,
          follower_id: followerId,
          following_id: followingId,
          created_at: new Date().toISOString()
        }

        await setDoc(followRef, followData)

        // Update counts
        await updateDoc(doc(db, 'users', followerId), {
          following_count: increment(1)
        }).catch(() => {})

        await updateDoc(doc(db, 'users', followingId), {
          followers_count: increment(1)
        }).catch(() => {})

        // Send follow notification
        await notificationService.createNotification({
          recipientId: followingId,
          actorId: followerId,
          actorProfile: followerProfile,
          type: 'follow',
        }).catch(() => {})

        return followData
      } catch (err) {
        console.warn('Firestore follow error, using fallback:', err)
      }
    }

    // Mock fallback
    const follows = mockDb.getFollows()
    const existing = follows.find(f => f.follower_id === followerId && f.following_id === followingId)
    if (existing) return existing

    const newFollow = {
      id: followId,
      follower_id: followerId,
      following_id: followingId,
      created_at: new Date().toISOString()
    }
    follows.push(newFollow)
    mockDb.setFollows(follows)

    // Update user counts
    const users = mockDb.getUsers()
    const followerIndex = users.findIndex(u => u.id === followerId)
    if (followerIndex >= 0) {
      users[followerIndex].following_count = (users[followerIndex].following_count || 0) + 1
    }
    const followingIndex = users.findIndex(u => u.id === followingId)
    if (followingIndex >= 0) {
      users[followingIndex].followers_count = (users[followingIndex].followers_count || 0) + 1
    }
    mockDb.setUsers(users)

    // Trigger notification
    await notificationService.createNotification({
      recipientId: followingId,
      actorId: followerId,
      actorProfile: followerProfile,
      type: 'follow',
    })

    return newFollow
  },

  // Unfollow a user
  async unfollowUser(followerId, followingId) {
    if (!followerId || !followingId) return
    const followId = `${followerId}_${followingId}`

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'follows', followId))

        await updateDoc(doc(db, 'users', followerId), {
          following_count: increment(-1)
        }).catch(() => {})

        await updateDoc(doc(db, 'users', followingId), {
          followers_count: increment(-1)
        }).catch(() => {})

        return
      } catch (err) {
        console.warn('Firestore unfollow error:', err)
      }
    }

    // Mock fallback
    const follows = mockDb.getFollows()
    mockDb.setFollows(follows.filter(f => !(f.follower_id === followerId && f.following_id === followingId)))

    const users = mockDb.getUsers()
    const followerIndex = users.findIndex(u => u.id === followerId)
    if (followerIndex >= 0 && (users[followerIndex].following_count || 0) > 0) {
      users[followerIndex].following_count = users[followerIndex].following_count - 1
    }
    const followingIndex = users.findIndex(u => u.id === followingId)
    if (followingIndex >= 0 && (users[followingIndex].followers_count || 0) > 0) {
      users[followingIndex].followers_count = users[followingIndex].followers_count - 1
    }
    mockDb.setUsers(users)
  },

  // Check if user A follows user B
  async isFollowing(followerId, followingId) {
    if (!followerId || !followingId) return false
    const followId = `${followerId}_${followingId}`

    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'follows', followId))
        return snap.exists()
      } catch (err) {
        console.warn('Firestore isFollowing error:', err)
      }
    }

    // Mock fallback
    return mockDb.getFollows().some(f => f.follower_id === followerId && f.following_id === followingId)
  },

  // Get followers of a user
  async getFollowers(userId) {
    if (!userId) return []

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'follows'), where('following_id', '==', userId))
        const snap = await getDocs(q)
        const followerIds = snap.docs.map(d => d.data().follower_id)
        if (followerIds.length === 0) return []

        const userDocs = await Promise.all(followerIds.map(id => getDoc(doc(db, 'users', id))))
        return userDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }))
      } catch (err) {
        console.warn('Firestore getFollowers error:', err)
      }
    }

    // Mock fallback
    const follows = mockDb.getFollows().filter(f => f.following_id === userId)
    const followerIds = new Set(follows.map(f => f.follower_id))
    return mockDb.getUsers().filter(u => followerIds.has(u.id))
  },

  // Get users that a user is following
  async getFollowing(userId) {
    if (!userId) return []

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'follows'), where('follower_id', '==', userId))
        const snap = await getDocs(q)
        const followingIds = snap.docs.map(d => d.data().following_id)
        if (followingIds.length === 0) return []

        const userDocs = await Promise.all(followingIds.map(id => getDoc(doc(db, 'users', id))))
        return userDocs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }))
      } catch (err) {
        console.warn('Firestore getFollowing error:', err)
      }
    }

    // Mock fallback
    const follows = mockDb.getFollows().filter(f => f.follower_id === userId)
    const followingIds = new Set(follows.map(f => f.following_id))
    return mockDb.getUsers().filter(u => followingIds.has(u.id))
  },
}
