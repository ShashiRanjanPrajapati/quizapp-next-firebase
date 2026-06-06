"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/templates/PublicLayout";
import { ResultsSummary } from "@/components/organisms/ResultsSummary";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { getResultById, getQuizById } from "@/lib/firebase/firestore";
import { ROUTES } from "@/constants/routes";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, userProfile, signOut } = useAuth();

  const { data: result, isLoading: resultLoading } = useQuery({
    queryKey: ["result", id],
    queryFn: () => getResultById(id),
    enabled: !!id,
  });

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", result?.quizId],
    queryFn: () => getQuizById(result!.quizId),
    enabled: !!result?.quizId,
  });

  const isLoading = resultLoading || quizLoading;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `Quiz Result — ${quiz?.title ?? "QuizMaster"}`,
        text: `I scored ${result?.score}% on ${quiz?.title ?? "a quiz"}!`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (!result || !quiz) {
    return (
      <PublicLayout>
        <div className="py-20 text-center">
          <p className="text-destructive">Result not found</p>
          <Link href={ROUTES.HOME}>
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout
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
      <div className="px-4 py-12">
        <ResultsSummary
          result={result}
          questions={quiz.questions}
          quizTitle={quiz.title}
          onPlayAgain={() => router.push(ROUTES.quiz(quiz.id))}
          onShare={handleShare}
        />
        <div className="mt-8 text-center">
          <Link
            href={ROUTES.LEADERBOARD}
            className="text-sm font-medium text-primary hover:underline"
          >
            View Leaderboard →
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
