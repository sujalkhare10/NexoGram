import { useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const trendingTopics = [
  { id: 1, category: 'Technology', topic: 'React 19', posts: '12.4K posts' },
  { id: 2, category: 'Programming', topic: 'NexoGram', posts: '8.2K posts' },
  { id: 3, category: 'Trending', topic: 'Tailwind CSS', posts: '5.7K posts' },
  { id: 4, category: 'Technology', topic: 'AI & Machine Learning', posts: '24.1K posts' },
  { id: 5, category: 'Design', topic: 'UI/UX Trends', posts: '3.9K posts' },
]

export default function RightSidebar({ suggestedUsers = [], onFollow, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch?.(searchQuery.trim())
    }
  }

  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[350px] shrink-0 py-3 pr-6 pl-6">
      {/* Search Bar */}
      <div className="sticky top-0 pt-1 pb-3 bg-white dark:bg-gray-950 z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search NexoGram"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-transparent focus:border-violet-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
        <h2 className="font-bold text-xl px-4 pt-4 pb-3 text-gray-900 dark:text-gray-100">
          What&apos;s happening
        </h2>
        <div className="flex flex-col">
          {trendingTopics.map((trend) => (
            <Link
              key={trend.id}
              to={`/explore?q=${encodeURIComponent(trend.topic)}`}
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">{trend.category}</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                {trend.topic}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{trend.posts}</p>
            </Link>
          ))}
        </div>
        <Link
          to="/explore"
          className="block px-4 py-3 text-violet-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors duration-200"
        >
          Show more
        </Link>
      </div>

      {/* Who to Follow */}
      {suggestedUsers.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
          <h2 className="font-bold text-xl px-4 pt-4 pb-3 text-gray-900 dark:text-gray-100">
            Who to follow
          </h2>
          <div className="flex flex-col">
            {suggestedUsers.map((suggestedUser) => (
              <div
                key={suggestedUser.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Link to={`/profile/${suggestedUser.username}`} className="shrink-0">
                  <img
                    src={suggestedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(suggestedUser.display_name || suggestedUser.username)}&background=8b5cf6&color=fff`}
                    alt={suggestedUser.display_name || suggestedUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
                <Link to={`/profile/${suggestedUser.username}`} className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                    {suggestedUser.display_name || suggestedUser.username}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    @{suggestedUser.username}
                  </span>
                </Link>
                <button
                  onClick={() => onFollow?.(suggestedUser.id)}
                  className="shrink-0 px-4 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-bold rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
          <Link
            to="/explore?tab=people"
            className="block px-4 py-3 text-violet-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors duration-200"
          >
            Show more
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="px-4 py-3">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">About NexoGram</a>
          <span>&copy; 2026</span>
        </div>
      </footer>
    </aside>
  )
}
