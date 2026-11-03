import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, TrendingUp } from 'lucide-react'
import PostList from '../components/feed/PostList'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import { postService } from '../services/postService'
import { profileService } from '../services/profileService'
import { likeService } from '../services/likeService'
import { bookmarkService } from '../services/bookmarkService'
import { followService } from '../services/followService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const TRENDING_TOPICS = [
  { tag: '#NexoGram', category: 'Technology · Trending', tweets: '18.4K posts' },
  { tag: '#React19', category: 'Web Development', tweets: '34.2K posts' },
  { tag: '#TailwindCSS', category: 'Design & Code', tweets: '9.8K posts' },
  { tag: '#CloudFirestore', category: 'Databases', tweets: '12.1K posts' },
  { tag: '#OpenSource', category: 'Technology · Trending', tweets: '45.6K posts' },
]

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const tabParam = searchParams.get('tab') || 'posts'

  const { user, profile } = useAuth()
  const [searchTerm, setSearchTerm] = useState(queryParam)
  const [activeTab, setActiveTab] = useState(tabParam)
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSearchTerm(queryParam)
    if (queryParam.trim()) {
      executeSearch(queryParam)
    } else {
      loadPopularPosts()
    }
  }, [queryParam])

  const loadPopularPosts = async () => {
    setLoading(true)
    try {
      const feed = await postService.getFeedPosts(0, user?.id)
      setPosts(feed.posts || [])
      const suggested = await profileService.getSuggestedUsers(user?.id, 6)
      setUsers(suggested || [])
    } catch (err) {
      console.error('Error loading explore data:', err)
    } finally {
      setLoading(false)
    }
  }

  const executeSearch = async (term) => {
    setLoading(true)
    try {
      const [postResults, userResults] = await Promise.all([
        postService.searchPosts(term, user?.id),
        profileService.searchProfiles(term),
      ])
      setPosts(postResults || [])
      setUsers(userResults || [])
    } catch (err) {
      console.error('Search error:', err)
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    if (!searchTerm.trim()) return
    setSearchParams({ q: searchTerm.trim(), tab: activeTab })
    executeSearch(searchTerm.trim())
  }

  const handleTrendClick = (tag) => {
    setSearchTerm(tag)
    setSearchParams({ q: tag, tab: 'posts' })
    executeSearch(tag)
  }

  const handleFollowUser = async (targetUserId) => {
    if (!user) {
      toast.error('Please log in to follow')
      return
    }
    try {
      await followService.followUser(user.id, targetUserId, profile || user)
      toast.success('Followed user!')
      setUsers((prev) => prev.filter((u) => u.id !== targetUserId))
    } catch (err) {
      toast.error(err.message || 'Failed to follow')
    }
  }

  return (
    <div>
      {/* Header & Search Input */}
      <div className="sticky top-0 z-30 p-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, posts, or @usernames"
            className="w-full pl-11 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-violet-500 rounded-full text-sm outline-none transition-colors"
          />
        </form>

        {queryParam && (
          <div className="flex border-t border-gray-100 dark:border-gray-800/80 mt-3 pt-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-2 text-center text-sm font-semibold relative ${
                activeTab === 'posts' ? 'text-violet-600 font-bold' : 'text-gray-500'
              }`}
            >
              Posts ({posts.length})
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-violet-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`flex-1 py-2 text-center text-sm font-semibold relative ${
                activeTab === 'people' ? 'text-violet-600 font-bold' : 'text-gray-500'
              }`}
            >
              People ({users.length})
              {activeTab === 'people' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-violet-600 rounded-full" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Trending Section (if not actively searching) */}
      {!queryParam && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              Trending for you
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TRENDING_TOPICS.map((topic, i) => (
              <button
                key={i}
                onClick={() => handleTrendClick(topic.tag)}
                className="text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors border border-gray-100 dark:border-gray-800/60 cursor-pointer"
              >
                <p className="text-[11px] text-gray-400">{topic.category}</p>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{topic.tag}</p>
                <p className="text-[11px] text-gray-500">{topic.tweets}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results View */}
      {activeTab === 'people' && queryParam ? (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No users found matching &quot;{queryParam}&quot;</div>
          ) : (
            users.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                <Link to={`/profile/${u.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar src={u.avatar_url} alt={u.display_name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate hover:underline">
                      {u.display_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">@{u.username}</p>
                    {u.bio && <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5">{u.bio}</p>}
                  </div>
                </Link>

                {user?.id !== u.id && (
                  <Button
                    size="sm"
                    onClick={() => handleFollowUser(u.id)}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold ml-2 shrink-0"
                  >
                    Follow
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <PostList
          posts={posts}
          loading={loading}
          currentUserId={user?.id}
          onLike={async (pid, liked) => {
            if (liked) await likeService.likePost(pid, user.id, profile || user)
            else await likeService.unlikePost(pid, user.id)
          }}
          onBookmark={async (pid, bked) => {
            if (bked) await bookmarkService.bookmarkPost(pid, user.id)
            else await bookmarkService.removeBookmark(pid, user.id)
          }}
          onDelete={async (pid) => {
            await postService.deletePost(pid, user.id)
            setPosts((prev) => prev.filter((p) => p.id !== pid))
          }}
          emptyTitle={queryParam ? `No posts found for "${queryParam}"` : 'No popular posts'}
          emptyDescription="Try searching for another keyword or topic!"
        />
      )}
    </div>
  )
}

