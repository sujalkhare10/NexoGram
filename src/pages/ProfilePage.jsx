import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProfileHeader from '../components/profile/ProfileHeader'
import EditProfileModal from '../components/profile/EditProfileModal'
import FollowersModal from '../components/profile/FollowersModal'
import PostList from '../components/feed/PostList'
import Tabs from '../components/ui/Tabs'
import { ProfileSkeleton } from '../components/ui/LoadingSkeleton'
import { profileService } from '../services/profileService'
import { postService } from '../services/postService'
import { followService } from '../services/followService'
import { likeService } from '../services/likeService'
import { bookmarkService } from '../services/bookmarkService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { username } = useParams()
  const { user, profile: currentUserProfile, updateUserProfile } = useAuth()
  const navigate = useNavigate()

  // Profile data
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({ postsCount: 0, followersCount: 0, followingCount: 0 })
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  // Modals
  const [showEditModal, setShowEditModal] = useState(false)
  const [followersModal, setFollowersModal] = useState({ isOpen: false, title: 'Followers', users: [], loading: false })

  // Tabs: 'posts', 'replies', 'likes'
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(false)

  const isOwnProfile = Boolean(
    user && profile && (user.id === profile.id || currentUserProfile?.username === profile.username)
  )

  const loadProfile = useCallback(async () => {
    setLoading(true)
    try {
      let targetProfile = null

      if (!username) {
        // Viewing own profile via /profile
        if (currentUserProfile) {
          targetProfile = currentUserProfile
        } else if (user?.id) {
          targetProfile = await profileService.getProfileById(user.id)
        }
      } else {
        targetProfile = await profileService.getProfileByUsername(username)
      }

      if (!targetProfile) {
        setProfile(null)
        setLoading(false)
        return
      }

      setProfile(targetProfile)

      // Fetch counts and follow status
      const [stats, followingStatus] = await Promise.all([
        profileService.getProfileCounts(targetProfile.id),
        user?.id && user.id !== targetProfile.id
          ? followService.isFollowing(user.id, targetProfile.id)
          : false,
      ])

      setCounts(stats)
      setIsFollowing(followingStatus)
    } catch (err) {
      console.error('Error loading profile:', err)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [username, user, currentUserProfile])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // Load posts for tab
  useEffect(() => {
    if (!profile?.id) return

    const loadTabPosts = async () => {
      setPostsLoading(true)
      try {
        if (activeTab === 'posts') {
          const userPosts = await postService.getUserPosts(profile.id, user?.id)
          setPosts(userPosts || [])
        } else if (activeTab === 'likes') {
          // In Firestore, fetch all posts and filter where has_liked
          const allPosts = await postService.getFeedPosts(0, profile.id)
          const likedPosts = (allPosts.posts || []).filter((p) => p.has_liked)
          setPosts(likedPosts)
        } else {
          // Replies
          const allPosts = await postService.getUserPosts(profile.id, user?.id)
          setPosts(allPosts || [])
        }
      } catch (err) {
        console.error('Error fetching tab posts:', err)
      } finally {
        setPostsLoading(false)
      }
    }

    loadTabPosts()
  }, [activeTab, profile?.id, user?.id])

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error('Please log in to follow')
      return
    }

    setFollowLoading(true)
    const nextState = !isFollowing
    setIsFollowing(nextState)
    setCounts((prev) => ({
      ...prev,
      followersCount: nextState
        ? prev.followersCount + 1
        : Math.max(0, prev.followersCount - 1),
    }))

    try {
      if (nextState) {
        await followService.followUser(user.id, profile.id, currentUserProfile || user)
        toast.success(`Following @${profile.username}`)
      } else {
        await followService.unfollowUser(user.id, profile.id)
        toast.success(`Unfollowed @${profile.username}`)
      }
    } catch (err) {
      console.error(err)
      setIsFollowing(!nextState)
      toast.error('Failed to update follow status')
    } finally {
      setFollowLoading(false)
    }
  }

  const handleSaveProfile = async (updates) => {
    const updated = await updateUserProfile(updates)
    setProfile(updated)
    // If username changed, redirect to new URL
    if (updated.username !== username) {
      navigate(`/profile/${updated.username}`, { replace: true })
    }
  }

  const handleOpenFollowers = async () => {
    setFollowersModal({ isOpen: true, title: 'Followers', users: [], loading: true })
    try {
      const followers = await followService.getFollowers(profile.id)
      setFollowersModal({ isOpen: true, title: 'Followers', users: followers || [], loading: false })
    } catch (err) {
      console.error(err)
      toast.error('Failed to load followers')
      setFollowersModal((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleOpenFollowing = async () => {
    setFollowersModal({ isOpen: true, title: 'Following', users: [], loading: true })
    try {
      const following = await followService.getFollowing(profile.id)
      setFollowersModal({ isOpen: true, title: 'Following', users: following || [], loading: false })
    } catch (err) {
      console.error(err)
      toast.error('Failed to load following list')
      setFollowersModal((prev) => ({ ...prev, loading: false }))
    }
  }

  const profileTabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'replies', label: 'Replies' },
    { id: 'likes', label: 'Likes' },
  ]

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">This account doesn&apos;t exist</h2>
        <p className="text-gray-500 mb-6">Try searching for another user on NexoGram.</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-6 py-2 bg-violet-600 text-white font-bold rounded-full hover:bg-violet-700"
        >
          Explore users
        </button>
      </div>
    )
  }

  return (
    <div>
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        counts={counts}
        onEditProfile={() => setShowEditModal(true)}
        onFollowToggle={handleFollowToggle}
        onOpenFollowers={handleOpenFollowers}
        onOpenFollowing={handleOpenFollowing}
        followLoading={followLoading}
      />

      <Tabs
        tabs={profileTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <PostList
        posts={posts}
        loading={postsLoading}
        currentUserId={user?.id}
        onLike={async (pid, liked) => {
          if (liked) await likeService.likePost(pid, user.id, currentUserProfile || user)
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
        emptyTitle={
          activeTab === 'posts'
            ? `@${profile.username} haven't posted yet`
            : activeTab === 'likes'
            ? 'No liked posts'
            : 'No replies'
        }
        emptyDescription="When posts are shared, they will appear right here."
      />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />
      )}

      {/* Followers / Following Modal */}
      <FollowersModal
        isOpen={followersModal.isOpen}
        onClose={() => setFollowersModal((prev) => ({ ...prev, isOpen: false }))}
        title={followersModal.title}
        users={followersModal.users}
        loading={followersModal.loading}
      />
    </div>
  )
}
