import { Calendar, MapPin, Link as LinkIcon, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { formatJoinDate } from '../../utils/helpers'

export default function ProfileHeader({
  profile,
  isOwnProfile,
  isFollowing,
  counts = { postsCount: 0, followersCount: 0, followingCount: 0 },
  onEditProfile,
  onFollowToggle,
  onOpenFollowers,
  onOpenFollowing,
  followLoading = false,
}) {
  if (!profile) return null

  return (
    <div>
      {/* Top Bar with back arrow & title */}
      <div className="sticky top-0 z-30 flex items-center gap-6 px-4 py-2 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <Link
          to="/"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-bold text-lg leading-tight text-gray-900 dark:text-gray-100">
            {profile.display_name || profile.username}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {counts.postsCount || profile.posts_count || 0} posts
          </p>
        </div>
      </div>

      {/* Banner */}
      <div className="h-36 sm:h-48 bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Profile info container */}
      <div className="px-4 pb-4">
        {/* Avatar & Action Button row */}
        <div className="flex justify-between items-end relative -mt-14 sm:-mt-16 mb-4">
          <div className="p-1 bg-white dark:bg-gray-950 rounded-full inline-block">
            <Avatar
              src={profile.avatar_url}
              alt={profile.display_name}
              size="2xl"
              className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white dark:border-gray-950 shadow-md"
            />
          </div>

          <div>
            {isOwnProfile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onEditProfile}
                className="font-bold rounded-full px-5 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Edit profile
              </Button>
            ) : (
              <Button
                variant={isFollowing ? 'outline' : 'primary'}
                size="sm"
                onClick={onFollowToggle}
                loading={followLoading}
                className={`font-bold rounded-full px-6 transition-all ${
                  isFollowing
                    ? 'hover:border-red-500 hover:text-red-500 hover:bg-red-50/20'
                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>

        {/* Name and Handle */}
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 leading-tight">
            {profile.display_name || 'User'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{profile.username}
          </p>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-3 text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Meta (Location, Website, Joined date) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-violet-500" />
              <a
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 dark:text-violet-400 hover:underline truncate max-w-[200px]"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{formatJoinDate(profile.created_at)}</span>
          </div>
        </div>

        {/* Following & Followers counts */}
        <div className="flex items-center gap-5 mt-4 text-sm">
          <button
            onClick={onOpenFollowing}
            className="hover:underline flex items-center gap-1 cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {counts.followingCount ?? profile.following_count ?? 0}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Following</span>
          </button>

          <button
            onClick={onOpenFollowers}
            className="hover:underline flex items-center gap-1 cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {counts.followersCount ?? profile.followers_count ?? 0}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Followers</span>
          </button>
        </div>
      </div>
    </div>
  )
}

