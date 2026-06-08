"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeaderboardEntries } from "@/lib/firebase/firestore";
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
    queryFn: () => getLeaderboardEntries(limit, category, difficulty),
  });

  return {
    entries: data ?? [],
    isLoading,
    error: error as Error | null,
  };
}
