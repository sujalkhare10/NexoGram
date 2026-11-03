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
  limit, 
  getDocs, 
  isFirebaseConfigured,
  increment,
  updateDoc
} from '../lib/firebase'
import { mockDb } from '../lib/mockStore'

const POST_PAGE_SIZE = 20

export const postService = {
  // Fetch posts for "For You" feed (all posts, newest first)
  async getFeedPosts(page = 0, currentUserId = null) {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'posts'),
          orderBy('created_at', 'desc'),
          limit(POST_PAGE_SIZE * (page + 1))
        )
        const snapshot = await getDocs(q)
        const allPosts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        
        // Paginate in memory or slice
        const start = page * POST_PAGE_SIZE
        const posts = allPosts.slice(start, start + POST_PAGE_SIZE)

        // Enrich with user like & bookmark states if logged in
        if (currentUserId && posts.length > 0) {
          await this._enrichPostsWithUserInteractions(posts, currentUserId)
        }

        return { 
          posts, 
          count: allPosts.length, 
          hasMore: allPosts.length > (page + 1) * POST_PAGE_SIZE 
        }
      } catch (err) {
        console.warn('Error fetching feed from Firestore, using fallback:', err)
      }
    }

    // Mock fallback
    const allPosts = [...mockDb.getPosts()].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
    const from = page * POST_PAGE_SIZE
    const posts = allPosts.slice(from, from + POST_PAGE_SIZE)

    if (currentUserId && posts.length > 0) {
      await this._enrichPostsWithUserInteractions(posts, currentUserId)
    }

    return {
      posts,
      count: allPosts.length,
      hasMore: allPosts.length > from + POST_PAGE_SIZE
    }
  },

  // Fetch posts from followed users
  async getFollowingFeedPosts(userId, page = 0) {
    if (!userId) return { posts: [], count: 0, hasMore: false }

    if (isFirebaseConfigured && db) {
      try {
        // First get followed user IDs
        const followsQuery = query(
          collection(db, 'follows'),
          where('follower_id', '==', userId)
        )
        const followsSnap = await getDocs(followsQuery)
        const followingIds = followsSnap.docs.map(d => d.data().following_id)

        if (followingIds.length === 0) {
          return { posts: [], count: 0, hasMore: false }
        }

        // Firestore supports 'in' query with up to 30 elements
        const chunks = followingIds.slice(0, 30)
        const postsQuery = query(
          collection(db, 'posts'),
          where('user_id', 'in', chunks),
          orderBy('created_at', 'desc'),
          limit(POST_PAGE_SIZE * (page + 1))
        )
        const snapshot = await getDocs(postsQuery)
        const allPosts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))

        const start = page * POST_PAGE_SIZE
        const posts = allPosts.slice(start, start + POST_PAGE_SIZE)

        await this._enrichPostsWithUserInteractions(posts, userId)

        return {
          posts,
          count: allPosts.length,
          hasMore: allPosts.length > (page + 1) * POST_PAGE_SIZE
        }
      } catch (err) {
        console.warn('Querying following feed with in-memory sort fallback:', err?.message || err)
        try {
          const followsQuery = query(collection(db, 'follows'), where('follower_id', '==', userId))
          const followsSnap = await getDocs(followsQuery)
          const followingIds = followsSnap.docs.map(d => d.data().following_id)
          if (followingIds.length === 0) return { posts: [], count: 0, hasMore: false }
          const chunks = followingIds.slice(0, 30)
          const fallbackQ = query(collection(db, 'posts'), where('user_id', 'in', chunks))
          const snapshot = await getDocs(fallbackQ)
          const allPosts = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          const start = page * POST_PAGE_SIZE
          const posts = allPosts.slice(start, start + POST_PAGE_SIZE)
          await this._enrichPostsWithUserInteractions(posts, userId)
          return {
            posts,
            count: allPosts.length,
            hasMore: allPosts.length > (page + 1) * POST_PAGE_SIZE
          }
        } catch (fallbackErr) {
          console.warn('Following feed fallback failed:', fallbackErr)
        }
      }
    }

    // Mock fallback
    const follows = mockDb.getFollows().filter(f => f.follower_id === userId)
    const followingIds = new Set(follows.map(f => f.following_id))

    if (followingIds.size === 0) {
      return { posts: [], count: 0, hasMore: false }
    }

    const allPosts = mockDb.getPosts()
      .filter(p => followingIds.has(p.user_id))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const from = page * POST_PAGE_SIZE
    const posts = allPosts.slice(from, from + POST_PAGE_SIZE)

    await this._enrichPostsWithUserInteractions(posts, userId)

    return {
      posts,
      count: allPosts.length,
      hasMore: allPosts.length > from + POST_PAGE_SIZE
    }
  },

  // Fetch posts by a specific user
  async getUserPosts(userId, currentUserId = null) {
    if (!userId) return []

    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'posts'),
          where('user_id', '==', userId),
          orderBy('created_at', 'desc')
        )
        const snapshot = await getDocs(q)
        const posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        if (currentUserId) {
          await this._enrichPostsWithUserInteractions(posts, currentUserId)
        }
        return posts
      } catch (err) {
        console.warn('Querying user posts with in-memory sort fallback:', err?.message || err)
        try {
          const fallbackQ = query(collection(db, 'posts'), where('user_id', '==', userId))
          const snapshot = await getDocs(fallbackQ)
          const posts = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          if (currentUserId) {
            await this._enrichPostsWithUserInteractions(posts, currentUserId)
          }
          return posts
        } catch (fallbackErr) {
          console.warn('User posts fallback failed:', fallbackErr)
        }
      }
    }

    // Mock fallback
    const posts = mockDb.getPosts()
      .filter(p => p.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    if (currentUserId) {
      await this._enrichPostsWithUserInteractions(posts, currentUserId)
    }
    return posts
  },

  // Fetch a single post by ID
  async getPostById(postId, currentUserId = null) {
    if (!postId) return null

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'posts', postId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) return null
        const post = { id: docSnap.id, ...docSnap.data() }
        if (currentUserId) {
          await this._enrichPostsWithUserInteractions([post], currentUserId)
        }
        return post
      } catch (err) {
        console.warn('Firestore getPostById error:', err)
      }
    }

    // Mock fallback
    const post = mockDb.getPosts().find(p => p.id === postId)
    if (!post) return null
    const cloned = { ...post }
    if (currentUserId) {
      await this._enrichPostsWithUserInteractions([cloned], currentUserId)
    }
    return cloned
  },

  // Create a new post
  async createPost({ userId, content, imageUrl = null, authorProfile = null }) {
    if (!content?.trim()) throw new Error('Post content cannot be empty')
    if (content.length > 280) throw new Error('Post exceeds 280 characters limit')

    const newPostId = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const now = new Date().toISOString()

    const postData = {
      id: newPostId,
      user_id: userId,
      content: content.trim(),
      image_url: imageUrl || null,
      created_at: now,
      updated_at: now,
      like_count: 0,
      comment_count: 0,
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
        const postRef = doc(db, 'posts', newPostId)
        await setDoc(postRef, postData)
        // Increment user's posts_count
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, { posts_count: increment(1) }).catch(() => {})
        return postData
      } catch (err) {
        console.warn('Error saving post to Firestore, saving to local fallback:', err)
      }
    }

    // Mock fallback
    const posts = mockDb.getPosts()
    posts.unshift(postData)
    mockDb.setPosts(posts)

    // Update user post count
    const users = mockDb.getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex >= 0) {
      users[userIndex].posts_count = (users[userIndex].posts_count || 0) + 1
      mockDb.setUsers(users)
    }

    return postData
  },

  // Delete a post
  async deletePost(postId, userId) {
    if (!postId) throw new Error('Post ID is required')

    if (isFirebaseConfigured && db) {
      try {
        const postRef = doc(db, 'posts', postId)
        const postSnap = await getDoc(postRef)
        if (postSnap.exists() && postSnap.data().user_id === userId) {
          await deleteDoc(postRef)
          // Decrement user posts_count
          const userRef = doc(db, 'users', userId)
          await updateDoc(userRef, { posts_count: increment(-1) }).catch(() => {})
          return true
        }
      } catch (err) {
        console.warn('Firestore delete error:', err)
      }
    }

    // Mock fallback
    const posts = mockDb.getPosts()
    const filtered = posts.filter(p => !(p.id === postId && p.user_id === userId))
    mockDb.setPosts(filtered)

    const users = mockDb.getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex >= 0 && (users[userIndex].posts_count || 0) > 0) {
      users[userIndex].posts_count = users[userIndex].posts_count - 1
      mockDb.setUsers(users)
    }
    return true
  },

  // Search posts by content
  async searchPosts(searchQuery, currentUserId = null) {
    if (!searchQuery?.trim()) return []
    const term = searchQuery.toLowerCase().trim()

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'posts'), limit(60))
        const snapshot = await getDocs(q)
        const matches = []
        snapshot.forEach(docSnap => {
          const data = { id: docSnap.id, ...docSnap.data() }
          if ((data.content || '').toLowerCase().includes(term)) {
            matches.push(data)
          }
        })
        if (currentUserId) {
          await this._enrichPostsWithUserInteractions(matches, currentUserId)
        }
        return matches
      } catch (err) {
        console.warn('Firestore search posts error:', err)
      }
    }

    // Mock fallback
    const posts = mockDb.getPosts()
      .filter(p => (p.content || '').toLowerCase().includes(term))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    if (currentUserId) {
      await this._enrichPostsWithUserInteractions(posts, currentUserId)
    }
    return posts
  },

  // Enrich posts with user interaction info (has_liked, has_bookmarked)
  async _enrichPostsWithUserInteractions(posts, userId) {
    if (!userId || !posts || posts.length === 0) return

    if (isFirebaseConfigured && db) {
      try {
        const [likesSnap, bookmarksSnap] = await Promise.all([
          getDocs(query(collection(db, 'likes'), where('user_id', '==', userId))),
          getDocs(query(collection(db, 'bookmarks'), where('user_id', '==', userId)))
        ])
        const likedPostIds = new Set(likesSnap.docs.map(d => d.data().post_id))
        const bookmarkedPostIds = new Set(bookmarksSnap.docs.map(d => d.data().post_id))

        posts.forEach(p => {
          p.has_liked = likedPostIds.has(p.id)
          p.has_bookmarked = bookmarkedPostIds.has(p.id)
          p.likes = likedPostIds.has(p.id) ? [{ user_id: userId }] : []
          p.bookmarks = bookmarkedPostIds.has(p.id) ? [{ user_id: userId }] : []
        })
        return
      } catch (err) {
        console.warn('Error enriching posts with interactions:', err)
      }
    }

    // Mock fallback
    const userLikes = new Set(
      mockDb.getLikes().filter(l => l.user_id === userId).map(l => l.post_id)
    )
    const userBookmarks = new Set(
      mockDb.getBookmarks().filter(b => b.user_id === userId).map(b => b.post_id)
    )

    posts.forEach(p => {
      p.has_liked = userLikes.has(p.id)
      p.has_bookmarked = userBookmarks.has(p.id)
      p.likes = userLikes.has(p.id) ? [{ user_id: userId }] : []
      p.bookmarks = userBookmarks.has(p.id) ? [{ user_id: userId }] : []
    })
  }
}
