"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Brain } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    displayName: string;
    photoURL?: string;
  } | null;
  onSignOut?: () => void;
}

const navLinks = [
  { href: ROUTES.HOME, label: "Home" },
  { href: ROUTES.DASHBOARD, label: "Dashboard" },
  { href: ROUTES.LEADERBOARD, label: "Leaderboard" },
  { href: ROUTES.QUIZ_CREATE, label: "Create Quiz" },
];

export function Navbar({ user, onSignOut }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg shadow-primary/20">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-primary-foreground">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary-foreground/20">
            <Brain className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-wide">QuizApp</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop user actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-xs font-medium text-primary-foreground/80">{user.displayName}</span>
              <Avatar photoURL={user.photoURL} name={user.displayName} size="sm" />
              <button
                onClick={onSignOut}
                className="text-xs font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href={ROUTES.LOGIN}>
                <button className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <button className="rounded-lg bg-primary-foreground/20 px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="text-primary-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={cn("bg-primary/95 md:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={onSignOut}
              className="mt-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10"
            >
              Sign Out
            </button>
          ) : (
            <div className="mt-2 flex gap-2">
              <Link href={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} className="flex-1">
                <button className="w-full rounded-lg border border-primary-foreground/30 py-2 text-sm font-medium text-primary-foreground">
                  Sign In
                </button>
              </Link>
              <Link href={ROUTES.REGISTER} onClick={() => setMobileOpen(false)} className="flex-1">
                <button className="w-full rounded-lg bg-primary-foreground/20 py-2 text-sm font-semibold text-primary-foreground">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
