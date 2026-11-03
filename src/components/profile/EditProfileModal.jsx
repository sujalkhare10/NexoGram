import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import toast from 'react-hot-toast'

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
]

export default function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [location, setLocation] = useState(profile?.location || '')
  const [website, setWebsite] = useState(profile?.website || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty')
      return
    }

    setSaving(true)
    try {
      await onSave({
        display_name: displayName.trim(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        avatar_url: avatarUrl.trim(),
      })
      toast.success('Profile updated successfully!')
      onClose()
    } catch (err) {
      console.error('Failed to update profile:', err)
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Preview & Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <Avatar src={avatarUrl} alt={displayName} size="xl" className="ring-2 ring-violet-500/30" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Select a preset avatar or paste an image URL:
              </p>
              <div className="flex gap-2 mb-2">
                {SAMPLE_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                      avatarUrl === url ? 'border-violet-500 ring-2 ring-violet-400' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Display Name */}
        <Input
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your full name"
          maxLength={50}
          required
        />

        {/* Bio */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <span className="text-xs text-gray-400">{160 - bio.length}</span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the world about yourself..."
            maxLength={160}
            rows={3}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 resize-none"
          />
        </div>

        {/* Location */}
        <Input
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. San Francisco, CA"
          maxLength={50}
        />

        {/* Website */}
        <Input
          label="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yourwebsite.com"
          maxLength={100}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={saving}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 font-bold"
          >
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}

