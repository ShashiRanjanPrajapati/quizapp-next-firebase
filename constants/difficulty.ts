import type { Difficulty } from "@/types";

export const DIFFICULTY_LEVELS: {
  value: Difficulty;
  label: string;
  color: string;
}[] = [
  { value: "easy", label: "Easy", color: "bg-emerald-500" },
  { value: "medium", label: "Medium", color: "bg-amber-500" },
  { value: "hard", label: "Hard", color: "bg-rose-500" },
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
