import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import MobileHeader from './MobileHeader'
import RightSidebar from './RightSidebar'
import CreatePostModal from '../posts/CreatePostModal'
import { profileService } from '../../services/profileService'
import { postService } from '../../services/postService'
import { notificationService } from '../../services/notificationService'
import { followService } from '../../services/followService'
import toast from 'react-hot-toast'

export default function MainLayout({ children }) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchSuggestedUsers = async () => {
      try {
        const users = await profileService.getSuggestedUsers(user.id)
        setSuggestedUsers(users || [])
      } catch (err) {
        console.error('Failed to fetch suggested users:', err)
      }
    }

    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount(user.id)
        setUnreadNotifications(count || 0)
      } catch (err) {
        console.error('Failed to fetch unread notifications:', err)
      }
    }

    fetchSuggestedUsers()
    fetchUnreadCount()

    // Poll unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [user])

  const handleCreatePost = () => {
    setShowCreatePostModal(true)
  }

  const handleModalPost = async (content, imageUrl) => {
    if (!user) {
      toast.error('Please log in to post')
      return
    }
    await postService.createPost({
      userId: user.id,
      content,
      imageUrl,
      authorProfile: profile || user,
    })
    setShowCreatePostModal(false)
    // Dispatch a custom event so feeds can refresh immediately
    window.dispatchEvent(new CustomEvent('nexogram_new_post'))
  }

  const handleFollow = async (targetUserId) => {
    if (!user) {
      toast.error('Please log in to follow users')
      return
    }
    try {
      await followService.followUser(user.id, targetUserId, profile)
      setSuggestedUsers((prev) => prev.filter((u) => u.id !== targetUserId))
      toast.success('Followed successfully!')
    } catch (err) {
      console.error('Failed to follow user:', err)
      toast.error(err.message || 'Failed to follow user')
    }
  }

  const handleSearch = (query) => {
    navigate(`/explore?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar - lg+ */}
      <Sidebar
        onCreatePost={handleCreatePost}
        unreadNotifications={unreadNotifications}
      />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content Area */}
      <div className="flex justify-center">
        {/* Spacer for fixed sidebar */}
        <div className="hidden lg:block xl:w-[280px] lg:w-[72px] shrink-0" />

        {/* Center Column */}
        <main className="w-full max-w-[600px] min-h-screen border-x border-gray-200 dark:border-gray-800 pt-14 md:pt-0 pb-16 md:pb-0">
          {children}
        </main>

        {/* Right Sidebar - xl+ */}
        <RightSidebar
          suggestedUsers={suggestedUsers}
          onFollow={handleFollow}
          onSearch={handleSearch}
        />
      </div>

      {/* Mobile Nav */}
      <MobileNav
        onCreatePost={handleCreatePost}
        unreadNotifications={unreadNotifications}
      />

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          currentUser={profile || user}
          onPost={handleModalPost}
        />
      )}
    </div>
  )
}
