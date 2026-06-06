import type { Question } from "@/types";

export function calculateScore(
  questions: Question[],
  answers: number[]
): { score: number; correctAnswers: number } {
  let correctAnswers = 0;

  questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });

  const score =
    questions.length > 0
      ? Math.round((correctAnswers / questions.length) * 100)
      : 0;

  return { score, correctAnswers };
}
