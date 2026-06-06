"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeaderboardEntries, getUserProfile } from "@/lib/firebase/firestore";
import type { Difficulty, LeaderboardEntry } from "@/types";

interface UseLeaderboardOptions {
  category?: string;
  difficulty?: Difficulty;
  limit?: number;
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const { category, difficulty, limit = 10 } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboard", category, difficulty, limit],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const results = await getLeaderboardEntries(limit, category, difficulty);

      const entries = await Promise.all(
        results.map(async (result) => {
          const profile = await getUserProfile(result.userId);
          return {
            id: result.id,
            userId: result.userId,
            displayName: profile?.displayName ?? "Anonymous",
            photoURL: profile?.photoURL,
            score: result.score,
            quizId: result.quizId,
            category: category ?? "",
            difficulty: difficulty ?? "medium",
            completedAt: result.completedAt,
          } satisfies LeaderboardEntry;
        })
      );

      return entries;
    },
  });

  return {
    entries: data ?? [],
    isLoading,
    error: error as Error | null,
  };
}
