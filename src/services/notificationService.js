import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  isFirebaseConfigured 
} from '../lib/firebase'
import { mockDb } from '../lib/mockStore'

export const notificationService = {
  // Get notifications for a user
  async getNotifications(userId) {
    if (!userId) return []

    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('recipient_id', '==', userId),
          orderBy('created_at', 'desc'),
          limit(50)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch (err) {
        console.warn('Querying notifications with in-memory sort fallback:', err?.message || err)
        try {
          const fallbackQ = query(
            collection(db, 'notifications'),
            where('recipient_id', '==', userId),
            limit(50)
          )
          const snapshot = await getDocs(fallbackQ)
          return snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        } catch (fallbackErr) {
          console.warn('Notifications fallback failed:', fallbackErr)
        }
      }
    }

    // Mock fallback
    return mockDb.getNotifications()
      .filter(n => n.recipient_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  // Get unread count
  async getUnreadCount(userId) {
    if (!userId) return 0

    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('recipient_id', '==', userId),
          where('is_read', '==', false)
        )
        const snapshot = await getDocs(q)
        return snapshot.size
      } catch (err) {
        console.warn('Firestore getUnreadCount error:', err)
      }
    }

    // Mock fallback
    return mockDb.getNotifications().filter(n => n.recipient_id === userId && !n.is_read).length
  },

  // Create a notification
  async createNotification({ recipientId, actorId, actorProfile = null, type, postId = null, commentId = null }) {
    if (!recipientId || !actorId || recipientId === actorId) return null

    const notificationId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const notifData = {
      id: notificationId,
      recipient_id: recipientId,
      actor_id: actorId,
      actor: actorProfile ? {
        id: actorProfile.id || actorId,
        username: actorProfile.username || 'user',
        display_name: actorProfile.display_name || 'User',
        avatar_url: actorProfile.avatar_url || '',
      } : {
        id: actorId,
        username: 'user',
        display_name: 'User',
        avatar_url: '',
      },
      type, // 'like', 'comment', 'follow'
      post_id: postId,
      comment_id: commentId,
      is_read: false,
      created_at: new Date().toISOString()
    }

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'notifications', notificationId), notifData)
        return notifData
      } catch (err) {
        console.warn('Firestore createNotification error:', err)
      }
    }

    // Mock fallback
    const notifs = mockDb.getNotifications()
    notifs.unshift(notifData)
    mockDb.setNotifications(notifs)
    return notifData
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    if (!notificationId) return

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'notifications', notificationId), { is_read: true })
        return
      } catch (err) {
        console.warn('Firestore markAsRead error:', err)
      }
    }

    // Mock fallback
    const notifs = mockDb.getNotifications()
    const index = notifs.findIndex(n => n.id === notificationId)
    if (index >= 0) {
      notifs[index].is_read = true
      mockDb.setNotifications(notifs)
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    if (!userId) return

    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('recipient_id', '==', userId),
          where('is_read', '==', false)
        )
        const snapshot = await getDocs(q)
        const updates = snapshot.docs.map(d => updateDoc(d.ref, { is_read: true }))
        await Promise.all(updates)
        return
      } catch (err) {
        console.warn('Firestore markAllAsRead error:', err)
      }
    }

    // Mock fallback
    const notifs = mockDb.getNotifications().map(n => {
      if (n.recipient_id === userId) {
        return { ...n, is_read: true }
      }
      return n
    })
    mockDb.setNotifications(notifs)
  },
}
