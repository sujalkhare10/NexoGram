import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  isFirebaseConfigured,
  increment,
  updateDoc
} from '../lib/firebase'
import { mockDb } from '../lib/mockStore'
import { notificationService } from './notificationService'

export const commentService = {
  // Get comments for a post
  async getPostComments(postId) {
    if (!postId) return []

    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'comments'),
          where('post_id', '==', postId),
          orderBy('created_at', 'asc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch (err) {
        console.warn('Querying comments with in-memory sort fallback:', err?.message || err)
        try {
          const fallbackQ = query(collection(db, 'comments'), where('post_id', '==', postId))
          const snapshot = await getDocs(fallbackQ)
          return snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        } catch (fallbackErr) {
          console.warn('Comments fallback failed:', fallbackErr)
        }
      }
    }

    // Mock fallback
    return mockDb.getComments()
      .filter(c => c.post_id === postId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  },

  // Create a comment
  async createComment(postId, userId, content, authorProfile = null) {
    if (!content?.trim()) throw new Error('Comment content cannot be empty')

    const newCommentId = `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const now = new Date().toISOString()

    const commentData = {
      id: newCommentId,
      post_id: postId,
      user_id: userId,
      content: content.trim(),
      created_at: now,
      profiles: authorProfile ? {
        id: authorProfile.id || userId,
        username: authorProfile.username || 'user',
        display_name: authorProfile.display_name || 'User',
        avatar_url: authorProfile.avatar_url || '',
      } : {
        id: userId,
        username: 'user',
        display_name: 'User',
        avatar_url: '',
      }
    }

    if (isFirebaseConfigured && db) {
      try {
        // Save comment
        await setDoc(doc(db, 'comments', newCommentId), commentData)
        
        // Increment comment count on post
        const postRef = doc(db, 'posts', postId)
        await updateDoc(postRef, { comment_count: increment(1) }).catch(() => {})

        // Get post to find recipient for notification
        const postSnap = await getDoc(postRef)
        if (postSnap.exists()) {
          const postAuthorId = postSnap.data().user_id
          if (postAuthorId && postAuthorId !== userId) {
            await notificationService.createNotification({
              recipientId: postAuthorId,
              actorId: userId,
              actorProfile,
              type: 'comment',
              postId,
              commentId: newCommentId,
            }).catch(() => {})
          }
        }

        return commentData
      } catch (err) {
        console.warn('Firestore createComment error, using fallback:', err)
      }
    }

    // Mock fallback
    const comments = mockDb.getComments()
    comments.push(commentData)
    mockDb.setComments(comments)

    // Increment post comment_count
    const posts = mockDb.getPosts()
    const postIndex = posts.findIndex(p => p.id === postId)
    if (postIndex >= 0) {
      posts[postIndex].comment_count = (posts[postIndex].comment_count || 0) + 1
      mockDb.setPosts(posts)

      const postAuthorId = posts[postIndex].user_id
      if (postAuthorId && postAuthorId !== userId) {
        await notificationService.createNotification({
          recipientId: postAuthorId,
          actorId: userId,
          actorProfile,
          type: 'comment',
          postId,
          commentId: newCommentId,
        })
      }
    }

    return commentData
  },

  // Delete a comment
  async deleteComment(commentId, postId = null) {
    if (!commentId) throw new Error('Comment ID is required')

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'comments', commentId))
        if (postId) {
          const postRef = doc(db, 'posts', postId)
          await updateDoc(postRef, { comment_count: increment(-1) }).catch(() => {})
        }
        return true
      } catch (err) {
        console.warn('Firestore deleteComment error:', err)
      }
    }

    // Mock fallback
    const comments = mockDb.getComments()
    const targetComment = comments.find(c => c.id === commentId)
    const effectivePostId = postId || targetComment?.post_id

    mockDb.setComments(comments.filter(c => c.id !== commentId))

    if (effectivePostId) {
      const posts = mockDb.getPosts()
      const postIndex = posts.findIndex(p => p.id === effectivePostId)
      if (postIndex >= 0 && (posts[postIndex].comment_count || 0) > 0) {
        posts[postIndex].comment_count = posts[postIndex].comment_count - 1
        mockDb.setPosts(posts)
      }
    }

    return true
  },
}
