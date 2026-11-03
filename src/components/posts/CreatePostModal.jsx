import Modal from '../ui/Modal'
import PostComposer from './PostComposer'

export default function CreatePostModal({ isOpen, onClose, currentUser, onPost }) {
  const handleSuccess = () => {
    onClose?.()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose NexoGram" size="md">
      <div className="-m-4">
        <PostComposer
          currentUser={currentUser}
          onPost={onPost}
          placeholder="What's happening?"
          onSuccess={handleSuccess}
        />
      </div>
    </Modal>
  )
}
