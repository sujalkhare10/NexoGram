import { useState, useEffect, useCallback } from 'react'
import FeedHeader from '../components/feed/FeedHeader'
import FeedTabs from '../components/feed/FeedTabs'
import PostComposer from '../components/posts/PostComposer'
import PostList from '../components/feed/PostList'
import { postService } from '../services/postService'
import { likeService } from '../services/likeService'
import { bookmarkService } from '../services/bookmarkService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function HomePage() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('for-you')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [error, setError] = useState(null)

  const fetchFeed = useCallback(async (tab, pageNum = 0, append = false) => {
    if (pageNum === 0) setLoading(true)
    else setLoadingMore(true)
    setError(null)

    try {
      let result
      if (tab === 'following') {
        result = await postService.getFollowingFeedPosts(user?.id, pageNum)
      } else {
        result = await postService.getFeedPosts(pageNum, user?.id)
      }

      setPosts((prev) => (append ? [...prev, ...(result.posts || [])] : result.posts || []))
      setHasMore(Boolean(result.hasMore))
      setPage(pageNum)
    } catch (err) {
      console.error('Error fetching feed:', err)
      setError('Could not load posts. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchFeed(activeTab, 0, false)
  }, [activeTab, fetchFeed])

  // Listen for modal post submissions
  useEffect(() => {
    const handleNewPost = () => {
      fetchFeed(activeTab, 0, false)
    }
    window.addEventListener('nexogram_new_post', handleNewPost)
    return () => window.removeEventListener('nexogram_new_post', handleNewPost)
  }, [activeTab, fetchFeed])

  const handlePostCreated = async (content, imageUrl) => {
    if (!user) {
      toast.error('Please log in to post')
      return
    }
    const newPost = await postService.createPost({
      userId: user.id,
      content,
      imageUrl,
      authorProfile: profile || user,
    })
    // Insert new post immediately at the top
    setPosts((prev) => [newPost, ...prev])
  }

  const handleLike = async (postId, shouldLike) => {
    if (!user) return
    if (shouldLike) {
      await likeService.likePost(postId, user.id, profile || user)
    } else {
      await likeService.unlikePost(postId, user.id)
    }
  }

  const handleBookmark = async (postId, shouldBookmark) => {
    if (!user) return
    if (shouldBookmark) {
      await bookmarkService.bookmarkPost(postId, user.id)
    } else {
      await bookmarkService.removeBookmark(postId, user.id)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!user) return
    await postService.deletePost(postId, user.id)
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchFeed(activeTab, page + 1, true)
    }
  }

  return (
    <div>
      <FeedHeader title="Home" />
      <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Post Composer */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <PostComposer
          currentUser={profile || user}
          onPost={handlePostCreated}
          placeholder="What's happening?"
        />
      </div>

      {/* Post List */}
      <PostList
        posts={posts}
        loading={loading}
        error={error}
        currentUserId={user?.id}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onDelete={handleDeletePost}
        onRetry={() => fetchFeed(activeTab, 0, false)}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
        emptyTitle={activeTab === 'following' ? 'No posts from people you follow' : 'No posts yet'}
        emptyDescription={
          activeTab === 'following'
            ? 'Follow more accounts to see what they are posting here!'
            : 'Be the first to share an update with the NexoGram community!'
        }
      />
    </div>
  )
}

