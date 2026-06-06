import type { Timestamp } from "firebase/firestore";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  timeLimit: number;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: Difficulty;
  questions: Question[];
  createdBy: string;
  isPublic: boolean;
  createdAt: Timestamp;
  playCount: number;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalScore: number;
  quizzesPlayed: number;
  quizzesCreated: number;
  createdAt: Timestamp;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: number[];
  completedAt: Timestamp;
}

export interface LiveRoom {
  id: string;
  quizId: string;
  hostId: string;
  participants: Record<
    string,
    { name: string; score: number; status: string }
  >;
  currentQuestion: number;
  status: "waiting" | "active" | "finished";
  startedAt: number;
}

export type QuizStatus = "idle" | "active" | "paused" | "finished";

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  score: number;
  quizId: string;
  category: string;
  difficulty: Difficulty;
  completedAt: Timestamp;
}
