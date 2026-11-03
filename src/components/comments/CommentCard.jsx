import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import Avatar from '../ui/Avatar'
import ConfirmDialog from '../ui/ConfirmDialog'
import { formatTimestamp } from '../../utils/helpers'

export default function CommentCard({ comment, currentUserId, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!comment) return null

  const profile = comment.profiles || {}
  const isAuthor = currentUserId && (comment.user_id === currentUserId || profile.id === currentUserId)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete?.(comment.id)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="flex gap-3 p-4 border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
      <Link to={`/profile/${profile.username || 'user'}`} className="shrink-0">
        <Avatar
          src={profile.avatar_url}
          alt={profile.display_name}
          size="md"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap text-sm">
            <Link
              to={`/profile/${profile.username || 'user'}`}
              className="font-bold hover:underline text-gray-900 dark:text-gray-100 truncate"
            >
              {profile.display_name || 'User'}
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              @{profile.username || 'user'}
            </span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {formatTimestamp(comment.created_at)}
            </span>
          </div>

          {isAuthor && (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors cursor-pointer"
              title="Delete reply"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line break-words leading-relaxed">
          {comment.content}
        </p>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Reply?"
        message="This will delete your reply permanently. This action cannot be undone."
        confirmText="Delete"
        loading={isDeleting}
      />
    </div>
  )
}

