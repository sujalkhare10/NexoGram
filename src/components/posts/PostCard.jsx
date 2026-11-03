import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, MessageCircle, Repeat2, Bookmark, MoreHorizontal, Trash2, Share, Check } from 'lucide-react'
import Avatar from '../ui/Avatar'
import DropdownMenu from '../ui/DropdownMenu'
import ConfirmDialog from '../ui/ConfirmDialog'
import { formatTimestamp } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function PostCard({
  post,
  currentUserId,
  onLike,
  onBookmark,
  onDelete,
}) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const hasUserLiked = Boolean(
    post?.likes?.some((like) => like.user_id === currentUserId) || post?.has_liked
  )
  const hasUserBookmarked = Boolean(
    post?.bookmarks?.some((b) => b.user_id === currentUserId) || post?.has_bookmarked
  )

  const [isLiked, setIsLiked] = useState(hasUserLiked)
  const [likeCount, setLikeCount] = useState(
    post?.likes?.length ?? post?.like_count ?? 0
  )
  const [isBookmarked, setIsBookmarked] = useState(hasUserBookmarked)
  const [isReposted, setIsReposted] = useState(false)

  if (!post) return null

  const profile = post.profiles || {}
  const isAuthor = currentUserId && (post.user_id === currentUserId || profile.id === currentUserId)
  const commentCount = post.comments?.length ?? post.comment_count ?? 0

  const handleCardClick = (e) => {
    // If the click came from an interactive element, do not navigate
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('[role="menuitem"]')) {
      return
    }
    navigate(`/post/${post.id}`)
  }

  const handleToggleLike = async (e) => {
    e.stopPropagation()
    if (!currentUserId) {
      toast.error('Please log in to like posts')
      return
    }

    const previousLiked = isLiked
    const previousCount = likeCount

    setIsLiked(!previousLiked)
    setLikeCount(previousLiked ? Math.max(0, previousCount - 1) : previousCount + 1)

    try {
      if (onLike) {
        await onLike(post.id, !previousLiked)
      }
    } catch (err) {
      setIsLiked(previousLiked)
      setLikeCount(previousCount)
      toast.error('Failed to update like')
    }
  }

  const handleToggleBookmark = async (e) => {
    e.stopPropagation()
    if (!currentUserId) {
      toast.error('Please log in to bookmark posts')
      return
    }

    const previousBookmarked = isBookmarked
    setIsBookmarked(!previousBookmarked)

    try {
      if (onBookmark) {
        await onBookmark(post.id, !previousBookmarked)
        toast.success(!previousBookmarked ? 'Added to Bookmarks' : 'Removed from Bookmarks')
      }
    } catch (err) {
      setIsBookmarked(previousBookmarked)
      toast.error('Failed to update bookmark')
    }
  }

  const handleRepost = (e) => {
    e.stopPropagation()
    setIsReposted(!isReposted)
    toast.success(!isReposted ? 'Post reposted to your profile' : 'Repost undone')
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/post/${post.id}`
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleDeletePost = async () => {
    setIsDeleting(true)
    try {
      if (onDelete) {
        await onDelete(post.id)
        toast.success('Post deleted successfully')
      }
    } catch (err) {
      toast.error('Failed to delete post')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const menuItems = [
    {
      label: isCopied ? 'Link Copied!' : 'Copy Link',
      icon: isCopied ? Check : Share,
      onClick: handleShare,
    },
  ]

  if (isAuthor) {
    menuItems.push({
      label: 'Delete Post',
      icon: Trash2,
      danger: true,
      onClick: () => setShowDeleteConfirm(true),
    })
  }

  return (
    <>
      <article
        onClick={handleCardClick}
        className="p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors duration-150 cursor-pointer"
      >
        <div className="flex gap-3">
          {/* Avatar */}
          <Link
            to={profile.username ? `/profile/${profile.username}` : '#'}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          >
            <Avatar src={profile.avatar_url} alt={profile.display_name} size="md" />
          </Link>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header info */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                <Link
                  to={profile.username ? `/profile/${profile.username}` : '#'}
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold text-gray-900 dark:text-gray-100 hover:underline truncate"
                >
                  {profile.display_name || 'Anonymous'}
                </Link>
                <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
                  @{profile.username || 'user'}
                </span>
                <span className="text-gray-400 dark:text-gray-600 text-xs">·</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm shrink-0">
                  {formatTimestamp(post.created_at)}
                </span>
              </div>

              {/* More options menu */}
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu
                  trigger={
                    <button
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      title="More options"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  }
                  items={menuItems}
                />
              </div>
            </div>

            {/* Post text */}
            <p className="mt-1.5 text-gray-900 dark:text-gray-100 text-[15px] leading-relaxed whitespace-pre-line break-words">
              {post.content}
            </p>

            {/* Optional post image */}
            {post.image_url && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-96 bg-gray-100 dark:bg-gray-900">
                <img
                  src={post.image_url}
                  alt="Post attachment"
                  className="w-full h-full object-cover max-h-96"
                  loading="lazy"
                />
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between mt-3 text-gray-500 dark:text-gray-400 max-w-md pt-1">
              {/* Comment */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/post/${post.id}`)
                }}
                className="flex items-center gap-1.5 text-xs hover:text-sky-500 transition-colors group"
                title="Reply"
              >
                <div className="p-2 rounded-full group-hover:bg-sky-500/10 transition-colors">
                  <MessageCircle size={17} />
                </div>
                <span>{commentCount > 0 ? commentCount : ''}</span>
              </button>

              {/* Repost */}
              <button
                onClick={handleRepost}
                className={`flex items-center gap-1.5 text-xs transition-colors group ${
                  isReposted ? 'text-emerald-500' : 'hover:text-emerald-500'
                }`}
                title="Repost"
              >
                <div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                  <Repeat2 size={18} />
                </div>
                <span>{isReposted ? '1' : ''}</span>
              </button>

              {/* Like */}
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 text-xs transition-colors group ${
                  isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                }`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <div className="p-2 rounded-full group-hover:bg-rose-500/10 transition-colors">
                  <Heart
                    size={17}
                    className={isLiked ? 'fill-rose-500 stroke-rose-500' : ''}
                  />
                </div>
                <span>{likeCount > 0 ? likeCount : ''}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={handleToggleBookmark}
                className={`flex items-center gap-1.5 text-xs transition-colors group ${
                  isBookmarked ? 'text-violet-500' : 'hover:text-violet-500'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              >
                <div className="p-2 rounded-full group-hover:bg-violet-500/10 transition-colors">
                  <Bookmark
                    size={17}
                    className={isBookmarked ? 'fill-violet-500 stroke-violet-500' : ''}
                  />
                </div>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs hover:text-violet-500 transition-colors group"
                title="Share"
              >
                <div className="p-2 rounded-full group-hover:bg-violet-500/10 transition-colors">
                  <Share size={17} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePost}
        title="Delete Post?"
        message="This cannot be undone and will be removed from your profile, the timeline of any accounts that follow you, and search results."
        confirmText="Delete"
        loading={isDeleting}
      />
    </>
  )
}
