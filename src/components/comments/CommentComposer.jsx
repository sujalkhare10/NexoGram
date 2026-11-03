import { useState, useRef } from 'react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

export default function CommentComposer({ currentUser, onSubmit, placeholder = 'Post your reply' }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef(null)

  const handleChange = (e) => {
    setContent(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(48, textareaRef.current.scrollHeight)}px`
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    try {
      await onSubmit(content.trim())
      setContent('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      toast.success('Reply posted!')
    } catch (err) {
      console.error('Failed to post reply:', err)
      toast.error(err.message || 'Failed to post reply')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
      <Avatar
        src={currentUser?.avatar_url}
        alt={currentUser?.display_name}
        size="md"
      />

      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          rows={1}
          maxLength={280}
          className="w-full bg-transparent resize-none outline-none text-sm md:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 min-h-[48px] py-1"
        />

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80 mt-1">
          <span className={`text-xs ${content.length > 260 ? 'text-amber-500 font-semibold' : 'text-gray-400'}`}>
            {280 - content.length}
          </span>

          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || submitting}
            loading={submitting}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold"
          >
            Reply
          </Button>
        </div>
      </div>
    </form>
  )
}

