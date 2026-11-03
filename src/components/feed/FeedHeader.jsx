import { Sparkles } from 'lucide-react'

export default function FeedHeader({ title = 'Home' }) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      <button 
        className="p-2 text-gray-500 hover:text-violet-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
        title="Top posts"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  )
}

