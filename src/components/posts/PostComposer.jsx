import { useState, useRef } from 'react'
import { Image, X, Sparkles } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

const MAX_CHARS = 280

export default function PostComposer({
  currentUser,
  onPost,
  placeholder = "What's happening?",
  onSuccess,
}) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  const charCount = content.length
  const charsRemaining = MAX_CHARS - charCount
  const isOverLimit = charCount > MAX_CHARS
  const isEmpty = content.trim().length === 0

  const handleTextareaChange = (e) => {
    setContent(e.target.value)
    // Auto-adjust height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(64, textareaRef.current.scrollHeight)}px`
    }
  }

  const handleAddSampleImage = () => {
    // Helpful preset image suggestions if user doesn't have an upload server
    const sampleImages = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    ]
    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)]
    setImageUrl(randomImg)
    setShowImageInput(true)
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (isEmpty || isOverLimit || loading) return

    setLoading(true)
    try {
      if (onPost) {
        await onPost(content.trim(), imageUrl.trim() || null)
      }
      setContent('')
      setImageUrl('')
      setShowImageInput(false)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      toast.success('Your post was sent!')
      onSuccess?.()
    } catch (err) {
      console.error('Error creating post:', err)
      toast.error(err.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex gap-3">
        <div className="shrink-0 pt-1">
          <Avatar
            src={currentUser?.avatar_url}
            alt={currentUser?.display_name || 'User'}
            size="md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={2}
            value={content}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            className="w-full bg-transparent resize-none border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 text-lg leading-relaxed min-h-[64px]"
          />

          {/* Image preview */}
          {imageUrl && (
            <div className="relative mt-2 mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-72 bg-gray-100 dark:bg-gray-900 group">
              <img
                src={imageUrl}
                alt="Upload preview"
                className="w-full h-full object-cover max-h-72"
                onError={() => {
                  toast.error('Could not load image from this URL')
                  setImageUrl('')
                }}
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Image URL input row */}
          {showImageInput && !imageUrl && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <Image size={18} className="text-gray-400 shrink-0" />
              <input
                type="url"
                placeholder="Paste image URL (e.g. https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-transparent text-sm border-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleAddSampleImage}
                className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline shrink-0 flex items-center gap-1"
                title="Use demo image"
              >
                <Sparkles size={12} />
                Sample
              </button>
              <button
                type="button"
                onClick={() => setShowImageInput(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Bottom Toolbar & Counter */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-850 mt-1">
            <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="p-2 hover:bg-violet-500/10 rounded-full transition-colors"
                title="Attach image URL"
              >
                <Image size={19} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Character Counter Progress Circle */}
              {charCount > 0 && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-medium ${
                      charsRemaining < 0
                        ? 'text-red-500 font-bold'
                        : charsRemaining <= 20
                        ? 'text-amber-500 font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {charsRemaining}
                  </span>
                  <div className="w-5 h-5 relative flex items-center justify-center">
                    <svg className="w-5 h-5 -rotate-90">
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-200 dark:text-gray-800 fill-none"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={2 * Math.PI * 8}
                        strokeDashoffset={
                          2 * Math.PI * 8 * (1 - Math.min(1, charCount / MAX_CHARS))
                        }
                        className={`fill-none transition-all duration-150 ${
                          charsRemaining < 0
                            ? 'text-red-500'
                            : charsRemaining <= 20
                            ? 'text-amber-500'
                            : 'text-violet-600'
                        }`}
                      />
                    </svg>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={isEmpty || isOverLimit || loading}
                loading={loading}
                className="px-5 py-2 font-bold"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
