"use client";

import { useCallback, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut as firebaseSignOut,
} from "@/lib/firebase/auth";
import { getUserProfile, createUserProfile } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const {
    firebaseUser,
    userProfile,
    loading,
    setFirebaseUser,
    setUserProfile,
    setLoading,
    reset,
  } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.log("User profile not found. Auto-creating user profile...");
          try {
            await createUserProfile(user.uid, {
              displayName: user.displayName ?? "Anonymous",
              email: user.email ?? "",
              photoURL: user.photoURL ?? undefined,
            });
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
          } catch (createErr) {
            console.error("Failed to auto-create user profile:", createErr);
            setUserProfile(null);
          }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setFirebaseUser, setUserProfile, setLoading]);

  const signInWithGoogleHandler = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const signInWithEmailHandler = useCallback(
    async (email: string, password: string) => {
      await signInWithEmail(email, password);
    },
    []
  );

  const registerHandler = useCallback(
    async (email: string, password: string, displayName: string) => {
      await registerWithEmail(email, password, displayName);
    },
    []
  );

  const signOutHandler = useCallback(async () => {
    await firebaseSignOut();
    reset();
  }, [reset]);

  return {
    user: firebaseUser,
    userProfile,
    loading,
    signInWithGoogle: signInWithGoogleHandler,
    signInWithEmail: signInWithEmailHandler,
    register: registerHandler,
    signOut: signOutHandler,
  };
}
