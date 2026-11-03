export default function FeedTabs({ activeTab, onChange }) {
  const tabs = [
    { id: 'for-you', label: 'For You' },
    { id: 'following', label: 'Following' },
  ]

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm sticky top-14 z-20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-3.5 text-center text-sm font-semibold transition-colors relative hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer ${
            activeTab === tab.id
              ? 'text-gray-900 dark:text-gray-100 font-bold'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <span>{tab.label}</span>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-violet-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}

