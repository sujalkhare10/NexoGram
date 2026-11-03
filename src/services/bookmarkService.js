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
  isFirebaseConfigured 
} from '../lib/firebase'
import { mockDb } from '../lib/mockStore'

const PAGE_SIZE = 20

export const bookmarkService = {
  // Bookmark a post
  async bookmarkPost(postId, userId) {
    if (!postId || !userId) return null
    const bookmarkId = `${postId}_${userId}`

    if (isFirebaseConfigured && db) {
      try {
        const bookmarkRef = doc(db, 'bookmarks', bookmarkId)
        const snap = await getDoc(bookmarkRef)
        if (snap.exists()) return snap.data()

        const bookmarkData = {
          id: bookmarkId,
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        }
        await setDoc(bookmarkRef, bookmarkData)
        return bookmarkData
      } catch (err) {
        console.warn('Firestore bookmark error, using fallback:', err)
      }
    }

    // Mock fallback
    const bookmarks = mockDb.getBookmarks()
    const existing = bookmarks.find(b => b.post_id === postId && b.user_id === userId)
    if (existing) return existing

    const newBookmark = {
      id: bookmarkId,
      post_id: postId,
      user_id: userId,
      created_at: new Date().toISOString()
    }
    bookmarks.push(newBookmark)
    mockDb.setBookmarks(bookmarks)
    return newBookmark
  },

  // Remove bookmark
  async removeBookmark(postId, userId) {
    if (!postId || !userId) return
    const bookmarkId = `${postId}_${userId}`

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'bookmarks', bookmarkId))
        return
      } catch (err) {
        console.warn('Firestore removeBookmark error:', err)
      }
    }

    // Mock fallback
    const bookmarks = mockDb.getBookmarks()
    mockDb.setBookmarks(bookmarks.filter(b => !(b.post_id === postId && b.user_id === userId)))
  },

  // Check if post is bookmarked
  async hasBookmarked(postId, userId) {
    if (!postId || !userId) return false
    const bookmarkId = `${postId}_${userId}`

    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'bookmarks', bookmarkId))
        return snap.exists()
      } catch (err) {
        console.warn('Firestore hasBookmarked error:', err)
      }
    }

    // Mock fallback
    return mockDb.getBookmarks().some(b => b.post_id === postId && b.user_id === userId)
  },

  // Get user's bookmarked posts
  async getBookmarkedPosts(userId, page = 0) {
    if (!userId) return { posts: [], count: 0, hasMore: false }

    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'bookmarks'),
          where('user_id', '==', userId),
          orderBy('created_at', 'desc')
        )
        const snapshot = await getDocs(q)
        const postIds = snapshot.docs.map(d => d.data().post_id)

        if (postIds.length === 0) {
          return { posts: [], count: 0, hasMore: false }
        }

        // Fetch each post
        const postDocs = await Promise.all(
          postIds.map(pid => getDoc(doc(db, 'posts', pid)))
        )
        const posts = postDocs
          .filter(snap => snap.exists())
          .map(snap => ({
            id: snap.id,
            ...snap.data(),
            has_bookmarked: true,
            bookmarks: [{ user_id: userId }]
          }))

        const start = page * PAGE_SIZE
        const pagedPosts = posts.slice(start, start + PAGE_SIZE)

        return {
          posts: pagedPosts,
          count: posts.length,
          hasMore: posts.length > start + PAGE_SIZE
        }
      } catch (err) {
        console.warn('Querying bookmarks with in-memory sort fallback:', err?.message || err)
        try {
          const fallbackQ = query(collection(db, 'bookmarks'), where('user_id', '==', userId))
          const snapshot = await getDocs(fallbackQ)
          const bookmarksList = snapshot.docs
            .map(d => d.data())
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          const postIds = bookmarksList.map(d => d.post_id)
          if (postIds.length === 0) return { posts: [], count: 0, hasMore: false }
          const postDocs = await Promise.all(postIds.map(pid => getDoc(doc(db, 'posts', pid))))
          const posts = postDocs
            .filter(snap => snap.exists())
            .map(snap => ({
              id: snap.id,
              ...snap.data(),
              has_bookmarked: true,
              bookmarks: [{ user_id: userId }]
            }))
          const start = page * PAGE_SIZE
          return {
            posts: posts.slice(start, start + PAGE_SIZE),
            count: posts.length,
            hasMore: posts.length > start + PAGE_SIZE
          }
        } catch (fallbackErr) {
          console.warn('Bookmarks fallback failed:', fallbackErr)
        }
      }
    }

    // Mock fallback
    const userBookmarks = mockDb.getBookmarks()
      .filter(b => b.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const bookmarkedIds = new Set(userBookmarks.map(b => b.post_id))
    const posts = mockDb.getPosts()
      .filter(p => bookmarkedIds.has(p.id))
      .map(p => ({
        ...p,
        has_bookmarked: true,
        bookmarks: [{ user_id: userId }]
      }))

    const start = page * PAGE_SIZE
    const paged = posts.slice(start, start + PAGE_SIZE)

    return {
      posts: paged,
      count: posts.length,
      hasMore: posts.length > start + PAGE_SIZE
    }
  },
}
