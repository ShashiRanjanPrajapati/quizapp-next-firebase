"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";
import {
  QuizCreator,
  type QuizFormData,
} from "@/components/organisms/QuizCreator";
import { useAuth } from "@/hooks/useAuth";
import { createQuiz } from "@/lib/firebase/firestore";
import { ROUTES } from "@/constants/routes";
import type { Question } from "@/types";

export default function CreateQuizPage() {
  const router = useRouter();
  const { user, userProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: QuizFormData) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const questions: Question[] = data.questions.map((q, index) => ({
        id: `q-${index + 1}`,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        timeLimit: q.timeLimit,
      }));

      const quizId = await createQuiz({
        title: data.title,
        category: data.category,
        difficulty: data.difficulty,
        questions,
        createdBy: user.uid,
        isPublic: data.isPublic,
      });

      router.push(ROUTES.quiz(quizId));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
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
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Create a Quiz</h1>
            <p className="mt-1 text-muted-foreground">
              Build your own quiz and share it with the community
            </p>
          </div>
          {error && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <QuizCreator onSubmit={handleSubmit} loading={loading} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
