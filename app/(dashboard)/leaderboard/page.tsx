"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Leaderboard } from "@/components/organisms/Leaderboard";
import { useAuth } from "@/hooks/useAuth";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { CATEGORIES } from "@/constants/categories";
import { DIFFICULTY_LEVELS } from "@/constants/difficulty";
import type { Difficulty } from "@/types";

export default function LeaderboardPage() {
  const { user, userProfile, signOut } = useAuth();
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");

  const { entries, isLoading } = useLeaderboard({
    category: category || undefined,
    difficulty: difficulty || undefined,
  });

  return (
    <DashboardLayout
      user={
        user
          ? {
              displayName:
                userProfile?.displayName ?? user.displayName ?? "User",
              photoURL: userProfile?.photoURL ?? user.photoURL ?? undefined,
            }
          : null
      }
      onSignOut={signOut}
    >
      <div className="space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            className="flex h-9 rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            className="flex h-9 rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty | "")}
          >
            <option value="">All Difficulties</option>
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <Leaderboard
          entries={entries}
          currentUserId={user?.uid}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
