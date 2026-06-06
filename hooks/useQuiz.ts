"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuizById } from "@/lib/firebase/firestore";

export function useQuiz(quizId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizById(quizId),
    enabled: !!quizId,
  });

  return {
    quiz: data ?? null,
    isLoading,
    error: error as Error | null,
  };
}
