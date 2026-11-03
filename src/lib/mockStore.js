// Local storage-backed mock data store for running NexoGram seamlessly
// when live Firebase credentials are not yet configured in .env

const STORAGE_KEYS = {
  USERS: 'nexogram_users',
  POSTS: 'nexogram_posts',
  COMMENTS: 'nexogram_comments',
  LIKES: 'nexogram_likes',
  BOOKMARKS: 'nexogram_bookmarks',
  FOLLOWS: 'nexogram_follows',
  NOTIFICATIONS: 'nexogram_notifications',
  CURRENT_USER: 'nexogram_current_user',
}

// Initial seed data
const SEED_USERS = [
  {
    id: 'demo-user-1',
    uid: 'demo-user-1',
    username: 'alexrivera',
    display_name: 'Alex Rivera',
    email: 'alex@nexogram.app',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    bio: 'Product Designer & Frontend Engineer. Building the future of connected social apps. 🚀✨',
    location: 'San Francisco, CA',
    website: 'https://alexrivera.design',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    followers_count: 342,
    following_count: 180,
    posts_count: 3,
  },
  {
    id: 'demo-user-2',
    uid: 'demo-user-2',
    username: 'sarahcodes',
    display_name: 'Sarah Chen',
    email: 'sarah@nexogram.app',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    bio: 'Senior Fullstack Dev • Open Source enthusiast • Coffee lover ☕️',
    location: 'Seattle, WA',
    website: 'https://sarahchen.dev',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    followers_count: 890,
    following_count: 215,
    posts_count: 2,
  },
  {
    id: 'demo-user-3',
    uid: 'demo-user-3',
    username: 'davidk',
    display_name: 'David Kim',
    email: 'david@nexogram.app',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    bio: 'AI researcher & Distributed Systems Architect. Talking about LLMs, agents & cloud.',
    location: 'Austin, TX',
    website: 'https://davidkim.ai',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    followers_count: 1250,
    following_count: 94,
    posts_count: 1,
  },
]

const SEED_POSTS = [
  {
    id: 'post-1',
    user_id: 'demo-user-1',
    content: 'Just launched NexoGram! 🚀 A fast, modern social feed built with React, Vite, Tailwind CSS and Cloud Firestore. What do you all think?',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    like_count: 12,
    comment_count: 3,
    profiles: {
      id: 'demo-user-1',
      username: 'alexrivera',
      display_name: 'Alex Rivera',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    },
  },
  {
    id: 'post-2',
    user_id: 'demo-user-2',
    content: 'Loving the real-time responsiveness and clean Twitter-inspired design of this feed. The dark mode contrast is spot on! 🌌',
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    like_count: 24,
    comment_count: 1,
    profiles: {
      id: 'demo-user-2',
      username: 'sarahcodes',
      display_name: 'Sarah Chen',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    },
  },
  {
    id: 'post-3',
    user_id: 'demo-user-3',
    content: 'Modern web architectures combining component-driven UI with Firestore document databases make prototyping rich applications so seamless. Keep building! 💻⚡️',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    like_count: 38,
    comment_count: 2,
    profiles: {
      id: 'demo-user-3',
      username: 'davidk',
      display_name: 'David Kim',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
  },
]

const SEED_COMMENTS = [
  {
    id: 'comment-1',
    post_id: 'post-1',
    user_id: 'demo-user-2',
    content: 'Huge congratulations Alex! The UI looks super clean and snappy.',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    profiles: {
      id: 'demo-user-2',
      username: 'sarahcodes',
      display_name: 'Sarah Chen',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    },
  },
  {
    id: 'comment-2',
    post_id: 'post-1',
    user_id: 'demo-user-3',
    content: 'Great work! Excited to see how the community interacts here.',
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    profiles: {
      id: 'demo-user-3',
      username: 'davidk',
      display_name: 'David Kim',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
  },
]

// Helper functions for storage
function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('Storage write error:', err)
  }
}

// Initialize seed data if not present
export function initMockStore() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStored(STORAGE_KEYS.USERS, SEED_USERS)
  }
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    setStored(STORAGE_KEYS.POSTS, SEED_POSTS)
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    setStored(STORAGE_KEYS.COMMENTS, SEED_COMMENTS)
  }
  if (!localStorage.getItem(STORAGE_KEYS.LIKES)) {
    setStored(STORAGE_KEYS.LIKES, [
      { id: 'post-1_demo-user-2', post_id: 'post-1', user_id: 'demo-user-2' },
      { id: 'post-2_demo-user-1', post_id: 'post-2', user_id: 'demo-user-1' },
    ])
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
    setStored(STORAGE_KEYS.BOOKMARKS, [
      { id: 'post-1_demo-user-1', post_id: 'post-1', user_id: 'demo-user-1' },
    ])
  }
  if (!localStorage.getItem(STORAGE_KEYS.FOLLOWS)) {
    setStored(STORAGE_KEYS.FOLLOWS, [
      { id: 'demo-user-1_demo-user-2', follower_id: 'demo-user-1', following_id: 'demo-user-2' },
      { id: 'demo-user-2_demo-user-1', follower_id: 'demo-user-2', following_id: 'demo-user-1' },
    ])
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStored(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        recipient_id: 'demo-user-1',
        actor_id: 'demo-user-2',
        actor: {
          id: 'demo-user-2',
          username: 'sarahcodes',
          display_name: 'Sarah Chen',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
        },
        type: 'like',
        post_id: 'post-1',
        comment_id: null,
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'notif-2',
        recipient_id: 'demo-user-1',
        actor_id: 'demo-user-3',
        actor: {
          id: 'demo-user-3',
          username: 'davidk',
          display_name: 'David Kim',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
        },
        type: 'follow',
        post_id: null,
        comment_id: null,
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
    ])
  }
}

// Call on load
initMockStore()

export const mockDb = {
  getUsers: () => getStored(STORAGE_KEYS.USERS, SEED_USERS),
  setUsers: (users) => setStored(STORAGE_KEYS.USERS, users),

  getPosts: () => getStored(STORAGE_KEYS.POSTS, SEED_POSTS),
  setPosts: (posts) => setStored(STORAGE_KEYS.POSTS, posts),

  getComments: () => getStored(STORAGE_KEYS.COMMENTS, SEED_COMMENTS),
  setComments: (comments) => setStored(STORAGE_KEYS.COMMENTS, comments),

  getLikes: () => getStored(STORAGE_KEYS.LIKES, []),
  setLikes: (likes) => setStored(STORAGE_KEYS.LIKES, likes),

  getBookmarks: () => getStored(STORAGE_KEYS.BOOKMARKS, []),
  setBookmarks: (bookmarks) => setStored(STORAGE_KEYS.BOOKMARKS, bookmarks),

  getFollows: () => getStored(STORAGE_KEYS.FOLLOWS, []),
  setFollows: (follows) => setStored(STORAGE_KEYS.FOLLOWS, follows),

  getNotifications: () => getStored(STORAGE_KEYS.NOTIFICATIONS, []),
  setNotifications: (notifs) => setStored(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getCurrentUser: () => getStored(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: (u) => setStored(STORAGE_KEYS.CURRENT_USER, u),
}

