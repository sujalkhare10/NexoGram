# NexoGram — Modern Social Media Feed Web App

**NexoGram** is a responsive, modern social media web application inspired by Twitter (X), built with **React**, **Vite**, **Tailwind CSS**, and **Google Cloud Firestore**.

---

## 🌟 Key Features

- **Twitter/X Inspired 3-Column Layout:**
  - **Left Sidebar:** Navigation (Home, Explore, Notifications, Messages, Bookmarks, Profile, Settings), Create Post button, and User summary with Logout.
  - **Center Feed:** "For You" and "Following" tabs, live character-counted Post Composer, and dynamic feed with like, reply, repost, and bookmark interactions.
  - **Right Sidebar:** Instant Search bar, What's happening (trending topics), and Suggested users to follow.
  - **Fully Responsive:** Adapts cleanly to 3-column desktop, 2-column tablet, and single-column mobile with sticky top bar and bottom navigation.
- **Authentication & Security:**
  - Real email/password registration with unique `@username` verification.
  - Persistent login sessions with session listeners.
  - Protected routes and public route guards.
  - Password visibility toggle and input validations.
  - Quick 1-click Demo Account login buttons for rapid local testing.
- **User Profiles:**
  - Custom display name, unique `@username`, bio, location, website link, and joined date.
  - Live follower, following, and post counts.
  - Profile tabs: **Posts**, **Replies**, and **Likes**.
  - Interactive **Followers & Following** user modal.
  - Profile editor with custom preset avatars and URL input.
- **Post Composer & Feed:**
  - Up to 280 characters limit with live countdown.
  - Optional image attachment with preview.
  - Timestamps with friendly relative formatting (`just now`, `5m`, `2h`, `Nov 3`).
  - Delete own posts with confirmation modal.
  - Optimistic UI updates for likes and bookmarks.
- **Comments & Post Details:**
  - Dedicated post page (`/post/:postId`) displaying full timestamp and engagement metrics.
  - Add replies with real-time feedback.
  - Delete own replies with confirmation dialog.
- **Explore & Search:**
  - Real-time search for posts by content keywords.
  - Search users by display name or username.
  - Trending topics filter.
- **Notifications System:**
  - Generates notifications when another user likes, comments on, or follows you.
  - Filter by All or Unread.
  - One-click "Mark all as read".
- **Light & Dark Mode:**
  - Smooth theme switcher with deep charcoal dark mode and clean white light mode.
- **Dual-Engine Architecture:**
  - Seamlessly connects to live **Cloud Firestore** when Firebase credentials are configured in `.env`.
  - Built-in fallback store for immediate local development with pre-seeded users and posts.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 with Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Database & Backend:** Google Cloud Firestore
- **Authentication:** Firebase Authentication
- **Routing:** React Router DOM (v7)
- **Notifications:** React Hot Toast
- **Date Formatting:** date-fns

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── comments/     # CommentCard, CommentComposer
│   │   ├── feed/         # FeedHeader, FeedTabs, PostList
│   │   ├── layout/       # Sidebar, MainLayout, RightSidebar, MobileNav, MobileHeader, AuthLayout
│   │   ├── posts/        # PostCard, PostComposer, CreatePostModal
│   │   ├── profile/      # ProfileHeader, EditProfileModal, FollowersModal
│   │   └── ui/           # Avatar, Button, ConfirmDialog, DropdownMenu, EmptyState, Input, Modal, Tabs
│   ├── contexts/         # AuthContext, ThemeContext
│   ├── lib/              # firebase.js, mockStore.js
│   ├── pages/            # LandingPage, LoginPage, SignupPage, HomePage, ExplorePage,
│   │                     # NotificationsPage, BookmarksPage, ProfilePage, PostDetailPage,
│   │                     # SettingsPage, NotFoundPage
│   ├── services/         # postService, commentService, likeService, bookmarkService,
│   │                     # followService, notificationService, profileService
│   ├── utils/            # helpers.js, validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── firestore.rules       # Security rules for Cloud Firestore
├── .env.example          # Environment variable template
├── index.html
├── package.json
└── vite.config.js
```

---

## 🗄️ Firestore Database Schema

The application uses the following Cloud Firestore collections:

### 1. `users` collection (Document ID: `userId` / Auth UID)
- `id`: string (User UID)
- `username`: string (unique lowercase handle)
- `display_name`: string
- `email`: string
- `avatar_url`: string
- `bio`: string
- `location`: string
- `website`: string
- `created_at`: timestamp / ISO string
- `followers_count`: number
- `following_count`: number
- `posts_count`: number

### 2. `posts` collection (Document ID: `postId`)
- `id`: string
- `user_id`: string (Author UID)
- `content`: string (max 280 characters)
- `image_url`: string | null
- `created_at`: ISO string / timestamp
- `updated_at`: ISO string / timestamp
- `like_count`: number
- `comment_count`: number
- `profiles`: `{ id, username, display_name, avatar_url }`

### 3. `comments` collection (Document ID: `commentId`)
- `id`: string
- `post_id`: string
- `user_id`: string
- `content`: string
- `created_at`: ISO string / timestamp
- `profiles`: `{ id, username, display_name, avatar_url }`

### 4. `likes` collection (Document ID: `${postId}_${userId}`)
- `id`: string
- `post_id`: string
- `user_id`: string
- `created_at`: ISO string / timestamp

### 5. `bookmarks` collection (Document ID: `${postId}_${userId}`)
- `id`: string
- `post_id`: string
- `user_id`: string
- `created_at`: ISO string / timestamp

### 6. `follows` collection (Document ID: `${followerId}_${followingId}`)
- `id`: string
- `follower_id`: string
- `following_id`: string
- `created_at`: ISO string / timestamp

### 7. `notifications` collection (Document ID: `notificationId`)
- `id`: string
- `recipient_id`: string
- `actor_id`: string
- `actor`: `{ id, username, display_name, avatar_url }`
- `type`: `'like' | 'comment' | 'follow'`
- `post_id`: string | null
- `comment_id`: string | null
- `is_read`: boolean (default: false)
- `created_at`: ISO string / timestamp

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Configure Firebase (Optional but Recommended)

1. Open [Firebase Console](https://console.firebase.google.com/) and create a project.
2. In **Build > Authentication**, enable **Email/Password** sign-in.
3. In **Build > Firestore Database**, click **Create database** (start in test mode or production mode).
4. In **Project settings > General**, scroll to **Your apps**, click the **Web icon (`</>`)**, and register the app.
5. Copy the configuration credentials into `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

> **Note:** If no keys are provided, NexoGram runs in **Demo Mode**, persisting to local storage with pre-seeded users and posts so you can test all features immediately!

### 3. Deploy Firestore Security Rules

Copy the contents of `firestore.rules` into **Firebase Console > Firestore Database > Rules** and click **Publish**.

### 4. Start the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set Framework Preset to **Vite**.
4. Add the `VITE_FIREBASE_*` environment variables in your Vercel Project Settings.
5. Deploy!
#   N e x o G r a m  
 