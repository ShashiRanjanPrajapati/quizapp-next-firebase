"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, PlusCircle, Home } from "lucide-react";
import { Navbar } from "@/components/organisms/Navbar";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    displayName: string;
    photoURL?: string;
  } | null;
  onSignOut?: () => void;
}

const sidebarLinks = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.LEADERBOARD, label: "Leaderboard", icon: Trophy },
  { href: ROUTES.QUIZ_CREATE, label: "Create Quiz", icon: PlusCircle },
  { href: ROUTES.HOME, label: "Home", icon: Home },
];

export function DashboardLayout({
  children,
  user,
  onSignOut,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} onSignOut={onSignOut} />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-22 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
