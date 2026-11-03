import { useState, useEffect } from 'react'
import PostList from '../components/feed/PostList'
import { bookmarkService } from '../services/bookmarkService'
import { likeService } from '../services/likeService'
import { postService } from '../services/postService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function BookmarksPage() {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const loadBookmarks = async () => {
      setLoading(true)
      try {
        const res = await bookmarkService.getBookmarkedPosts(user.id)
        setPosts(res.posts || [])
      } catch (err) {
        console.error('Error fetching bookmarks:', err)
        toast.error('Failed to load bookmarks')
      } finally {
        setLoading(false)
      }
    }

    loadBookmarks()
  }, [user?.id])

  const handleBookmarkToggle = async (postId, shouldBookmark) => {
    if (!user?.id) return
    if (!shouldBookmark) {
      await bookmarkService.removeBookmark(postId, user.id)
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    }
  }

  const handleLike = async (postId, shouldLike) => {
    if (!user?.id) return
    if (shouldLike) {
      await likeService.likePost(postId, user.id, profile || user)
    } else {
      await likeService.unlikePost(postId, user.id)
    }
  }

  const handleDelete = async (postId) => {
    if (!user?.id) return
    await postService.deletePost(postId, user.id)
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Bookmarks
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          @{profile?.username || 'user'}
        </p>
      </div>

      <PostList
        posts={posts}
        loading={loading}
        currentUserId={user?.id}
        onLike={handleLike}
        onBookmark={handleBookmarkToggle}
        onDelete={handleDelete}
        emptyTitle="Save posts for later"
        emptyDescription="Don't let the good ones slip away! Bookmark posts to easily find them again in the future."
      />
    </div>
  )
}
