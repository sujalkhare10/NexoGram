/**
 * Validates an email address.
 * @returns {string|null} Error message or null if valid.
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email is required'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address'
  }
  return null
}

/**
 * Validates a password (minimum 6 characters).
 * @returns {string|null} Error message or null if valid.
 */
export function validatePassword(password) {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return null
}

/**
 * Validates a username (3-20 chars, alphanumeric and underscores only).
 * @returns {string|null} Error message or null if valid.
 */
export function validateUsername(username) {
  if (!username || !username.trim()) {
    return 'Username is required'
  }
  const trimmed = username.trim()
  if (trimmed.length < 3) {
    return 'Username must be at least 3 characters'
  }
  if (trimmed.length > 20) {
    return 'Username must be 20 characters or less'
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(trimmed)) {
    return 'Username can only contain letters, numbers, and underscores'
  }
  return null
}

/**
 * Validates a display name (1-50 characters).
 * @returns {string|null} Error message or null if valid.
 */
export function validateDisplayName(name) {
  if (!name || !name.trim()) {
    return 'Display name is required'
  }
  const trimmed = name.trim()
  if (trimmed.length > 50) {
    return 'Display name must be 50 characters or less'
  }
  return null
}

/**
 * Validates post content (1-280 characters).
 * @returns {string|null} Error message or null if valid.
 */
export function validatePostContent(content) {
  if (!content || !content.trim()) {
    return 'Post content is required'
  }
  const trimmed = content.trim()
  if (trimmed.length > 280) {
    return 'Post must be 280 characters or less'
  }
  return null
}

/**
 * Validates a bio (max 160 characters).
 * @returns {string|null} Error message or null if valid.
 */
export function validateBio(bio) {
  if (bio && bio.length > 160) {
    return 'Bio must be 160 characters or less'
  }
  return null
}
