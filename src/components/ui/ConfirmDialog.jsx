import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmText}</Button>
        </div>
      </div>
    </Modal>
  )
}
