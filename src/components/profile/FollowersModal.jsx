import Modal from '../ui/Modal'
import Avatar from '../ui/Avatar'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'

export default function FollowersModal({ isOpen, onClose, title = 'Users', users = [], loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="-mx-4 -my-2 max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading {title.toLowerCase()}...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No {title.toLowerCase()} yet</p>
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
            >
              <Link
                to={`/profile/${u.username}`}
                onClick={onClose}
                className="flex items-center gap-3 min-w-0 flex-1"
              >
                <Avatar src={u.avatar_url} alt={u.display_name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate hover:underline">
                    {u.display_name || u.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    @{u.username}
                  </p>
                  {u.bio && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5">
                      {u.bio}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}

