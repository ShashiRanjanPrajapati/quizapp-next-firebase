import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebase } from "./config";
import { createUserProfile } from "./firestore";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<FirebaseUser | void> {
  if (!firebase.auth) throw new Error("Firebase Auth is not initialized yet.");
  try {
    const result = await signInWithPopup(firebase.auth, googleProvider);
    return result.user;
  } catch (err: any) {
    if (err.code === "auth/popup-blocked" || err.code === "auth/cancelled-popup-request") {
      console.log("Popup blocked or cancelled request. Falling back to redirect...");
      await signInWithRedirect(firebase.auth, googleProvider);
      return;
    }
    throw err;
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  if (!firebase.auth) throw new Error("Firebase Auth is not initialized yet.");
  const result = await signInWithEmailAndPassword(firebase.auth, email, password);
  return result.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> {
  if (!firebase.auth) throw new Error("Firebase Auth is not initialized yet.");
  const result = await createUserWithEmailAndPassword(firebase.auth, email, password);
  await updateProfile(result.user, { displayName });
  await createUserProfile(result.user.uid, {
    displayName,
    email: result.user.email ?? "",
  });
  return result.user;
}

export async function signOut(): Promise<void> {
  if (!firebase.auth) throw new Error("Firebase Auth is not initialized yet.");
  await firebaseSignOut(firebase.auth);
}
