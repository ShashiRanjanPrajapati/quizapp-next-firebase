import { firebase } from "./config";
import type { Difficulty, Quiz, QuizResult, User } from "@/types";

const isClient = typeof window !== "undefined";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (isClient) {
    try {
      const auth = firebase.auth;
      const token = await auth?.getIdToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Failed to get auth token for request:", err);
    }
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API request failed with status ${res.status}: ${errorText}`);
  }

  return res.json();
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  return fetchWithAuth(`/api/quiz/${quizId}`);
}

export async function getPublicQuizzes(
  category?: string,
  difficulty?: Difficulty
): Promise<Quiz[]> {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (difficulty) params.append("difficulty", difficulty);
  return fetchWithAuth(`/api/quizzes?${params.toString()}`);
}

export async function createQuiz(
  quiz: Omit<Quiz, "id" | "createdAt" | "playCount">
): Promise<string> {
  return fetchWithAuth("/api/quizzes", {
    method: "POST",
    body: JSON.stringify(quiz),
  });
}

export async function incrementQuizPlayCount(quizId: string): Promise<void> {
  return fetchWithAuth(`/api/quiz/${quizId}/play`, {
    method: "POST",
  });
}

export async function saveQuizResult(
  result: Omit<QuizResult, "id" | "completedAt">
): Promise<string> {
  return fetchWithAuth("/api/results", {
    method: "POST",
    body: JSON.stringify(result),
  });
}

export async function getResultById(
  resultId: string
): Promise<QuizResult | null> {
  return fetchWithAuth(`/api/results/${resultId}`);
}

export async function getUserResults(
  userId: string,
  max = 10
): Promise<QuizResult[]> {
  return fetchWithAuth(`/api/users/${userId}/results?max=${max}`);
}

export async function getUserProfile(userId: string): Promise<User | null> {
  return fetchWithAuth(`/api/users/${userId}/profile`);
}

export async function createUserProfile(
  userId: string,
  profile: { displayName: string; email: string; photoURL?: string }
): Promise<void> {
  return fetchWithAuth(`/api/users/${userId}/profile`, {
    method: "POST",
    body: JSON.stringify(profile),
  });
}

export async function getLeaderboardEntries(
  max = 10,
  category?: string,
  difficulty?: Difficulty
): Promise<QuizResult[]> {
  const params = new URLSearchParams();
  params.append("max", String(max));
  if (category) params.append("category", category);
  if (difficulty) params.append("difficulty", difficulty);
  return fetchWithAuth(`/api/leaderboard?${params.toString()}`);
}

export async function firestoreAdd(
  collectionName: string,
  data: any
): Promise<string> {
  return fetchWithAuth(`/api/db/${collectionName}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function firestoreUpdate(
  collectionName: string,
  id: string,
  data: Partial<any>
): Promise<void> {
  return fetchWithAuth(`/api/db/${collectionName}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function firestoreRemove(
  collectionName: string,
  id: string
): Promise<void> {
  return fetchWithAuth(`/api/db/${collectionName}/${id}`, {
    method: "DELETE",
  });
}
