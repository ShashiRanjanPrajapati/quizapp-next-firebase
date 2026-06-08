import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

let app: any = null;
let auth: any = null;
let db: any = null;
let rtdb: any = null;

const isClient = typeof window !== "undefined";

// Server-side initialization: initialize immediately using local process.env variables (if present)
if (!isClient) {
  const serverConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "",
  };
  
  if (serverConfig.apiKey) {
    try {
      app = getApps().length === 0 ? initializeApp(serverConfig) : getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
      rtdb = getDatabase(app);
    } catch (err) {
      console.error("Failed to initialize Firebase on server:", err);
    }
  }
}

// Client-side initialization: called dynamically by the FirebaseProvider
export function setFirebaseConfig(config: any) {
  if (!app && isClient && config?.apiKey) {
    try {
      app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
      rtdb = getDatabase(app);
    } catch (err) {
      console.error("Failed to initialize Firebase on client:", err);
    }
  }
}

export { app, auth, db, rtdb };
