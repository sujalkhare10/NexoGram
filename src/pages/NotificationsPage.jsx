import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Heart, MessageCircle, UserPlus, CheckCheck } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { notificationService } from '../services/notificationService'
import { useAuth } from '../contexts/AuthContext'
import { formatTimestamp } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const loadNotifications = async () => {
      setLoading(true)
      try {
        const list = await notificationService.getNotifications(user.id)
        setNotifications(list || [])
      } catch (err) {
        console.error('Error loading notifications:', err)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [user?.id])

  const handleMarkAllRead = async () => {
    if (!user?.id) return
    try {
      await notificationService.markAllAsRead(user.id)
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      toast.success('All marked as read')
    } catch (err) {
      toast.error('Failed to mark all as read')
    }
  }

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await notificationService.markAsRead(notif.id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      )
    }
  }

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.is_read
    return true
  })

  const getIconForType = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-sky-500 fill-sky-500" />
      case 'follow':
        return <UserPlus className="w-5 h-5 text-violet-500" />
      default:
        return <Bell className="w-5 h-5 text-violet-500" />
    }
  }

  const getActionText = (type) => {
    switch (type) {
      case 'like':
        return 'liked your post'
      case 'comment':
        return 'replied to your post'
      case 'follow':
        return 'started following you'
      default:
        return 'interacted with your profile'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Notifications
        </h1>

        {notifications.some((n) => !n.is_read) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs gap-1.5 text-violet-600 dark:text-violet-400"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-colors relative ${
            activeTab === 'all'
              ? 'text-gray-900 dark:text-gray-100 font-bold'
              : 'text-gray-500'
          }`}
        >
          All
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-violet-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-colors relative ${
            activeTab === 'unread'
              ? 'text-gray-900 dark:text-gray-100 font-bold'
              : 'text-gray-500'
          }`}
        >
          Unread
          {activeTab === 'unread' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-violet-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={activeTab === 'unread' ? 'No unread notifications' : 'Nothing to see here — yet'}
          description="From likes to follows and replies, all activities related to your posts will appear here."
        />
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((notif) => {
            const actor = notif.actor || {}
            const targetLink = notif.post_id
              ? `/post/${notif.post_id}`
              : `/profile/${actor.username || 'user'}`

            return (
              <Link
                key={notif.id}
                to={targetLink}
                onClick={() => handleNotificationClick(notif)}
                className={`flex gap-3 p-4 hover:bg-gray-50/70 dark:hover:bg-gray-900/40 transition-colors ${
                  !notif.is_read ? 'bg-violet-50/40 dark:bg-violet-950/20' : ''
                }`}
              >
                <div className="pt-1 shrink-0">{getIconForType(notif.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar src={actor.avatar_url} alt={actor.display_name} size="sm" />
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate hover:underline">
                      {actor.display_name || 'Someone'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      @{actor.username || 'user'}
                    </span>
                    <span className="text-gray-400 text-xs">·</span>
                    <span className="text-gray-500 text-xs shrink-0">
                      {formatTimestamp(notif.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {getActionText(notif.type)}
                  </p>

                  {notif.post?.content && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 italic bg-gray-100/50 dark:bg-gray-800/40 p-2 rounded-lg">
                      &quot;{notif.post.content}&quot;
                    </p>
                  )}
                </div>

                {!notif.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-600 mt-2 shrink-0" />
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

