export function PostSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex gap-12 pt-2">
            <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 -mt-16 border-4 border-white dark:border-gray-900" />
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  )
}

export function FeedSkeleton({ count = 5 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  )
}

export function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
  )
}
