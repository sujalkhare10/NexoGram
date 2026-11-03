export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-800">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-4 text-sm font-medium text-center relative transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
            activeTab === tab.id
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
