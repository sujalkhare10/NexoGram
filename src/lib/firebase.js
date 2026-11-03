import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth'
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp,
  increment,
  onSnapshot
} from 'firebase/firestore'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD_KF6JYk_wuEOLFWp2-AMEYs5_ynkB__0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nexogram-101205.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nexogram-101205',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'nexogram-101205.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '625550992637',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:625550992637:web:2a055fb09e33a558cbca94',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-FE2678J3BD',
}

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'your_firebase_api_key'
)

let app = null
let auth = null
let db = null
let analytics = null

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
    
    // Initialize analytics in browser if supported
    if (typeof window !== 'undefined') {
      isSupported().then((yes) => {
        if (yes) analytics = getAnalytics(app)
      }).catch(() => {})
    }

    console.log('⚡ Firebase & Firestore connected successfully with project:', firebaseConfig.projectId)
  } catch (error) {
    console.warn('Firebase initialization error, running in local fallback mode:', error)
  }
} else {
  console.info('ℹ️ Firebase credentials not detected. NexoGram is running in demo/offline-ready mode.')
}

export { 
  app, 
  auth, 
  db,
  analytics,
  // Auth exports
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut,
  onAuthStateChanged,
  firebaseUpdateProfile,
  // Firestore exports
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp,
  increment,
  onSnapshot
}
