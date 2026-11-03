import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Bookmark, Share, MoreHorizontal, Trash2, Check } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import DropdownMenu from '../components/ui/DropdownMenu'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import CommentComposer from '../components/comments/CommentComposer'
import CommentCard from '../components/comments/CommentCard'
import { PostSkeleton } from '../components/ui/LoadingSkeleton'
import { postService } from '../services/postService'
import { commentService } from '../services/commentService'
import { likeService } from '../services/likeService'
import { bookmarkService } from '../services/bookmarkService'
import { useAuth } from '../contexts/AuthContext'
import { formatFullDate } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function PostDetailPage() {
  const { postId } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [fetchedPost, fetchedComments] = await Promise.all([
        postService.getPostById(postId, user?.id),
        commentService.getPostComments(postId),
      ])

      if (!fetchedPost) {
        setPost(null)
        setLoading(false)
        return
      }

      setPost(fetchedPost)
      setComments(fetchedComments || [])
      setIsLiked(Boolean(fetchedPost.has_liked))
      setLikeCount(fetchedPost.like_count || 0)
      setIsBookmarked(Boolean(fetchedPost.has_bookmarked))
    } catch (err) {
      console.error('Error loading post:', err)
      toast.error('Failed to load post')
    } finally {
      setLoading(false)
    }
  }, [postId, user?.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleToggleLike = async () => {
    if (!user) {
      toast.error('Please log in to like')
      return
    }

    const prevLiked = isLiked
    const prevCount = likeCount
    setIsLiked(!prevLiked)
    setLikeCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1)

    try {
      if (!prevLiked) {
        await likeService.likePost(post.id, user.id, profile || user)
      } else {
        await likeService.unlikePost(post.id, user.id)
      }
    } catch (err) {
      setIsLiked(prevLiked)
      setLikeCount(prevCount)
      toast.error('Failed to update like')
    }
  }

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error('Please log in to bookmark')
      return
    }

    const prevBked = isBookmarked
    setIsBookmarked(!prevBked)

    try {
      if (!prevBked) {
        await bookmarkService.bookmarkPost(post.id, user.id)
        toast.success('Added to bookmarks')
      } else {
        await bookmarkService.removeBookmark(post.id, user.id)
        toast.success('Removed from bookmarks')
      }
    } catch (err) {
      setIsBookmarked(prevBked)
      toast.error('Failed to update bookmark')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleDeletePost = async () => {
    if (!user || !post) return
    setDeleting(true)
    try {
      await postService.deletePost(post.id, user.id)
      toast.success('Post deleted')
      navigate('/home')
    } catch (err) {
      toast.error('Failed to delete post')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleAddComment = async (content) => {
    if (!user) {
      toast.error('Please log in to reply')
      return
    }
    const newComment = await commentService.createComment(
      post.id,
      user.id,
      content,
      profile || user
    )
    setComments((prev) => [...prev, newComment])
  }

  const handleDeleteComment = async (commentId) => {
    await commentService.deleteComment(commentId, post?.id)
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    toast.success('Reply deleted')
  }

  if (loading) {
    return <PostSkeleton />
  }

  if (!post) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Post not found</h2>
        <p className="text-gray-500 mb-6">This post may have been deleted or is unavailable.</p>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-2 bg-violet-600 text-white font-bold rounded-full hover:bg-violet-700"
        >
          Return to Feed
        </button>
      </div>
    )
  }

  const author = post.profiles || {}
  const isAuthor = user && (post.user_id === user.id || author.id === user.id)

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
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center gap-6 px-4 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Post
        </h1>
      </div>

      {/* Main Post Card */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        {/* Author Header */}
        <div className="flex items-center justify-between">
          <Link to={`/profile/${author.username || 'user'}`} className="flex items-center gap-3">
            <Avatar src={author.avatar_url} alt={author.display_name} size="lg" />
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100 hover:underline leading-tight">
                {author.display_name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500">
                @{author.username || 'user'}
              </p>
            </div>
          </Link>

          <DropdownMenu
            trigger={
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            }
            items={menuItems}
          />
        </div>

        {/* Content */}
        <p className="mt-4 text-lg sm:text-xl text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line break-words">
          {post.content}
        </p>

        {/* Image */}
        {post.image_url && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
            <img
              src={post.image_url}
              alt="Post media"
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Timestamp */}
        <div className="py-3 mt-3 border-b border-gray-100 dark:border-gray-800/80 text-sm text-gray-500">
          {formatFullDate(post.created_at)}
        </div>

        {/* Interaction Metrics */}
        <div className="flex items-center justify-around py-2 border-b border-gray-100 dark:border-gray-800/80 text-gray-500">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-2 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
              isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-full hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors ${
              isBookmarked ? 'text-violet-500 font-bold' : 'hover:text-violet-500'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-violet-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-500 transition-colors"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reply Composer */}
      <CommentComposer
        currentUser={profile || user}
        onSubmit={handleAddComment}
        placeholder="Post your reply"
      />

      {/* Comments List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {comments.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No replies yet. Be the first to start the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePost}
        title="Delete Post?"
        message="This action cannot be undone. This post will be permanently removed."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  )
}
