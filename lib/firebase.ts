import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if all required environment variables are present
const missingVars = Object.entries(requiredEnvVars).filter(([_, value]) => !value)

export const isFirebaseConfigured = missingVars.length === 0

let app: any = null
let db: any = null
let auth: any = null

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: requiredEnvVars.apiKey!,
      authDomain: requiredEnvVars.authDomain!,
      projectId: requiredEnvVars.projectId!,
      storageBucket: requiredEnvVars.storageBucket!,
      messagingSenderId: requiredEnvVars.messagingSenderId!,
      appId: requiredEnvVars.appId!,
    }

    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
} else {
  console.log("Running in demo mode - Firebase environment variables not configured")
}

export { db, auth }
