"use client";

import React from "react";
import { setFirebaseConfig } from "@/lib/firebase/config";

interface FirebaseProviderProps {
  config: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    databaseURL: string;
  };
  children: React.ReactNode;
}

export function FirebaseProvider({ config, children }: FirebaseProviderProps) {
  // Initialize the Firebase client instances with config received from the server
  setFirebaseConfig(config);

  return <>{children}</>;
}
