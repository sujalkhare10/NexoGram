import PostCard from '../posts/PostCard'
import { FeedSkeleton } from '../ui/LoadingSkeleton'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'
import { MessageSquare, RefreshCw } from 'lucide-react'

export default function PostList({
  posts = [],
  loading = false,
  error = null,
  currentUserId,
  onLike,
  onBookmark,
  onDelete,
  onRetry,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  emptyTitle = 'No posts yet',
  emptyDescription = 'Be the first to share an update with the NexoGram community!',
}) {
  if (loading && posts.length === 0) {
    return <FeedSkeleton count={4} />
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-medium mb-3">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Try again
        </Button>
      </div>
    )
  }

  if (!loading && posts.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onLike={onLike}
          onBookmark={onBookmark}
          onDelete={onDelete}
        />
      ))}

      {hasMore && (
        <div className="p-4 flex justify-center border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            loading={loadingMore}
            disabled={loadingMore}
            className="w-full max-w-xs"
          >
            Load more posts
          </Button>
        </div>
      )}
    </div>
  )
}

