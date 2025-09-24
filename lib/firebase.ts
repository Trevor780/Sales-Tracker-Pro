import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const checkFirebaseConfig = () => {
  const hasConfig = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )

  if (typeof window !== "undefined") {
    console.log("[v0] Firebase config check:", {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      configured: hasConfig,
    })
  }

  return hasConfig
}

export const isFirebaseConfigured = checkFirebaseConfig()

let app: any = null
let db: any = null
let auth: any = null

const initializeFirebase = () => {
  if (typeof window === "undefined") return false

  const isConfigured = checkFirebaseConfig()

  if (isConfigured && !app) {
    try {
      app = initializeApp(firebaseConfig)
      db = getFirestore(app)
      auth = getAuth(app)
      console.log("[v0] Firebase initialized successfully")
      return true
    } catch (error) {
      console.error("Firebase initialization error:", error)
      return false
    }
  } else if (!isConfigured) {
    console.log("[v0] Running in demo mode - Firebase environment variables not configured")
  }

  return isConfigured
}

export const getFirebaseAuth = () => {
  if (!auth) {
    initializeFirebase()
  }
  return auth
}

export const getFirebaseDb = () => {
  if (!db) {
    initializeFirebase()
  }
  return db
}

export { db, auth }
