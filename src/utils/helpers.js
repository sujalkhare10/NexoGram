import { differenceInMinutes, differenceInHours, differenceInDays, format } from 'date-fns'

/**
 * Formats a timestamp into a compact relative time string.
 * < 1 minute: "just now"
 * < 1 hour: "Xm"
 * < 24 hours: "Xh"
 * < 7 days: "Xd"
 * Otherwise: "MMM d" (e.g. "Nov 3")
 */
export function formatTimestamp(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()

  const minutesAgo = differenceInMinutes(now, date)
  if (minutesAgo < 1) return 'just now'

  const hoursAgo = differenceInHours(now, date)
  if (hoursAgo < 1) return `${minutesAgo}m`

  const daysAgo = differenceInDays(now, date)
  if (daysAgo < 1) return `${hoursAgo}h`

  if (daysAgo < 7) return `${daysAgo}d`

  return format(date, 'MMM d')
}

/**
 * Formats a date into a full readable string.
 * e.g. "3:45 PM · Nov 3, 2026"
 */
export function formatFullDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  const time = format(date, 'h:mm a')
  const day = format(date, 'MMM d, yyyy')

  return `${time} · ${day}`
}

/**
 * Formats a date into a "Joined" string.
 * e.g. "Joined November 2026"
 */
export function formatJoinDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  return `Joined ${format(date, 'MMMM yyyy')}`
}

/**
 * Truncates text to a maximum length with an ellipsis.
 */
export function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Generates an avatar URL using the ui-avatars.com API.
 */
export function generateAvatarUrl(name) {
  const encodedName = encodeURIComponent(name || 'User')
  return `https://ui-avatars.com/api/?name=${encodedName}&background=6366f1&color=fff`
}

/**
 * Joins class names, filtering out falsy values.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
