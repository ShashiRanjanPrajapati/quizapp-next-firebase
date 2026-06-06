import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./config";
import type { User } from "@/types";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user);
  return result.user;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  await createUserProfile(result.user, displayName);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

async function createUserProfile(
  firebaseUser: FirebaseUser,
  displayName: string
): Promise<void> {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userData: Omit<User, "createdAt"> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    uid: firebaseUser.uid,
    displayName,
    email: firebaseUser.email ?? "",
    photoURL: firebaseUser.photoURL ?? undefined,
    totalScore: 0,
    quizzesPlayed: 0,
    quizzesCreated: 0,
    createdAt: serverTimestamp(),
  };
  await setDoc(userRef, userData);
}

async function ensureUserProfile(firebaseUser: FirebaseUser): Promise<void> {
  const userRef = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await createUserProfile(
      firebaseUser,
      firebaseUser.displayName ?? "Anonymous"
    );
  }
}
