export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
          <Icon size={32} className="text-primary-500" />
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  )
}
