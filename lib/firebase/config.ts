import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

let appInstance: any = null;
let authInstance: any = null;
let dbInstance: any = null;
let rtdbInstance: any = null;

const isClient = typeof window !== "undefined";

// Server-side initialization
if (!isClient) {
  const serverConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL || "",
  };
  
  if (serverConfig.apiKey) {
    try {
      appInstance = getApps().length === 0 ? initializeApp(serverConfig) : getApps()[0];
      authInstance = getAuth(appInstance);
      dbInstance = getFirestore(appInstance);
      rtdbInstance = getDatabase(appInstance);
    } catch (err) {
      console.error("Failed to initialize Firebase on server:", err);
    }
  }
}

// Client-side initialization
export function setFirebaseConfig(config: any) {
  if (!appInstance && isClient && config?.apiKey) {
    try {
      appInstance = getApps().length === 0 ? initializeApp(config) : getApps()[0];
      authInstance = getAuth(appInstance);
      dbInstance = getFirestore(appInstance);
      rtdbInstance = getDatabase(appInstance);
    } catch (err) {
      console.error("Failed to initialize Firebase on client:", err);
    }
  }
}

// Export a dynamic getter object to bypass static bundling restrictions
export const firebase = {
  get app() { return appInstance; },
  get auth() { return authInstance; },
  get db() { return dbInstance; },
  get rtdb() { return rtdbInstance; }
};
