import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  isFirebaseConfigured,
  increment,
  updateDoc
} from '../lib/firebase'
import { mockDb } from '../lib/mockStore'
import { notificationService } from './notificationService'

export const likeService = {
  // Like a post
  async likePost(postId, userId, actorProfile = null) {
    if (!postId || !userId) return null
    const likeId = `${postId}_${userId}`

    if (isFirebaseConfigured && db) {
      try {
        const likeRef = doc(db, 'likes', likeId)
        const likeSnap = await getDoc(likeRef)
        
        // Already liked
        if (likeSnap.exists()) return likeSnap.data()

        const likeData = {
          id: likeId,
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        }

        await setDoc(likeRef, likeData)

        // Increment like_count on post
        const postRef = doc(db, 'posts', postId)
        await updateDoc(postRef, { like_count: increment(1) }).catch(() => {})

        // Notify post owner
        const postSnap = await getDoc(postRef)
        if (postSnap.exists()) {
          const postAuthorId = postSnap.data().user_id
          if (postAuthorId && postAuthorId !== userId) {
            await notificationService.createNotification({
              recipientId: postAuthorId,
              actorId: userId,
              actorProfile,
              type: 'like',
              postId,
            }).catch(() => {})
          }
        }

        return likeData
      } catch (err) {
        console.warn('Firestore like error, using fallback:', err)
      }
    }

    // Mock fallback
    const likes = mockDb.getLikes()
    const existing = likes.find(l => l.post_id === postId && l.user_id === userId)
    if (existing) return existing

    const newLike = {
      id: likeId,
      post_id: postId,
      user_id: userId,
      created_at: new Date().toISOString()
    }
    likes.push(newLike)
    mockDb.setLikes(likes)

    const posts = mockDb.getPosts()
    const postIndex = posts.findIndex(p => p.id === postId)
    if (postIndex >= 0) {
      posts[postIndex].like_count = (posts[postIndex].like_count || 0) + 1
      mockDb.setPosts(posts)

      const postAuthorId = posts[postIndex].user_id
      if (postAuthorId && postAuthorId !== userId) {
        await notificationService.createNotification({
          recipientId: postAuthorId,
          actorId: userId,
          actorProfile,
          type: 'like',
          postId,
        })
      }
    }

    return newLike
  },

  // Unlike a post
  async unlikePost(postId, userId) {
    if (!postId || !userId) return
    const likeId = `${postId}_${userId}`

    if (isFirebaseConfigured && db) {
      try {
        const likeRef = doc(db, 'likes', likeId)
        await deleteDoc(likeRef)

        const postRef = doc(db, 'posts', postId)
        await updateDoc(postRef, { like_count: increment(-1) }).catch(() => {})
        return
      } catch (err) {
        console.warn('Firestore unlike error:', err)
      }
    }

    // Mock fallback
    const likes = mockDb.getLikes()
    mockDb.setLikes(likes.filter(l => !(l.post_id === postId && l.user_id === userId)))

    const posts = mockDb.getPosts()
    const postIndex = posts.findIndex(p => p.id === postId)
    if (postIndex >= 0 && (posts[postIndex].like_count || 0) > 0) {
      posts[postIndex].like_count = posts[postIndex].like_count - 1
      mockDb.setPosts(posts)
    }
  },

  // Check if user has liked a post
  async hasLiked(postId, userId) {
    if (!postId || !userId) return false
    const likeId = `${postId}_${userId}`

    if (isFirebaseConfigured && db) {
      try {
        const likeRef = doc(db, 'likes', likeId)
        const snap = await getDoc(likeRef)
        return snap.exists()
      } catch (err) {
        console.warn('Firestore hasLiked error:', err)
      }
    }

    // Mock fallback
    return mockDb.getLikes().some(l => l.post_id === postId && l.user_id === userId)
  },

  // Get like count for a post
  async getLikeCount(postId) {
    if (!postId) return 0

    if (isFirebaseConfigured && db) {
      try {
        const postRef = doc(db, 'posts', postId)
        const snap = await getDoc(postRef)
        if (snap.exists()) {
          return snap.data().like_count || 0
        }
      } catch (err) {
        console.warn('Firestore getLikeCount error:', err)
      }
    }

    // Mock fallback
    const post = mockDb.getPosts().find(p => p.id === postId)
    return post?.like_count || 0
  },
}
