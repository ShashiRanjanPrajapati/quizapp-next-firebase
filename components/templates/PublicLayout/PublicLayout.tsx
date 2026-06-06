"use client";

import { Navbar } from "@/components/organisms/Navbar";

interface PublicLayoutProps {
  children: React.ReactNode;
  user?: {
    displayName: string;
    photoURL?: string;
  } | null;
  onSignOut?: () => void;
}

export function PublicLayout({ children, user, onSignOut }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} onSignOut={onSignOut} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} QuizApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
