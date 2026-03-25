import type { FirebaseApp, FirebaseOptions } from "firebase/app"
import { getApp, getApps, initializeApp } from "firebase/app"
import type { Database } from "firebase/database"
import { getDatabase } from "firebase/database"
import type { Firestore } from "firebase/firestore"
import { getFirestore } from "firebase/firestore"

const DEFAULT_FIREBASE_RTDB_URL =
  "https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app"

const resolvedDatabaseURL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  process.env.NEXT_PUBLIC_FIREBASE_RTDB_URL ||
  DEFAULT_FIREBASE_RTDB_URL

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: resolvedDatabaseURL,
}

let cachedApp: FirebaseApp | null = null

function getOrCreateFirebaseApp(): FirebaseApp {
  if (cachedApp) {
    return cachedApp
  }

  cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  return cachedApp
}

export function getFirebaseDatabase(): Database {
  return getDatabase(getOrCreateFirebaseApp(), resolvedDatabaseURL)
}

export function getFirebaseFirestore(): Firestore {
  return getFirestore(getOrCreateFirebaseApp())
}
