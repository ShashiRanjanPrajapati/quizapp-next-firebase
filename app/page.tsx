"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/templates/PublicLayout";
import { CategoryGrid } from "@/components/organisms/CategoryGrid";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { getPublicQuizzes } from "@/lib/firebase/firestore";
import { CATEGORIES } from "@/constants/categories";
import { DIFFICULTY_LABELS } from "@/constants/difficulty";
import { ROUTES } from "@/constants/routes";

export default function HomePage() {
  const { user, userProfile, signOut } = useAuth();

  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["publicQuizzes"],
    queryFn: () => getPublicQuizzes(),
  });

  const quizCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.id] = quizzes.filter((q) => q.category === cat.id).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const featuredQuizzes = quizzes.slice(0, 6);

  return (
    <PublicLayout
      user={
        user
          ? {
              displayName: userProfile?.displayName ?? user.displayName ?? "User",
              photoURL: userProfile?.photoURL ?? user.photoURL ?? undefined,
            }
          : null
      }
      onSignOut={signOut}
    >
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground leading-tight">
            Test Your Knowledge,{" "}
            <span className="text-primary">Beat the Clock</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Play quizzes across science, history, tech, and more. Compete on the
            leaderboard and create your own quizzes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={ROUTES.DASHBOARD}>
              <button className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 duration-200 shadow-lg shadow-primary/25">
                Start Playing
              </button>
            </Link>
            <Link href={ROUTES.QUIZ_CREATE}>
              <button className="rounded-xl border border-border bg-card px-8 py-3 text-sm font-bold text-foreground hover:border-primary/50 hover:bg-muted transition-all duration-200">
                Create a Quiz
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 className="mb-5 text-lg font-bold text-foreground">Categories</h2>
        <CategoryGrid categories={CATEGORIES} quizCounts={quizCounts} />
      </section>

      {/* Featured Quizzes */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">Featured quizzes</h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : featuredQuizzes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border py-10 text-center text-muted-foreground">
            No quizzes yet. Be the first to create one!
          </p>
        ) : (
          <div className="space-y-3">
            {featuredQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={ROUTES.quiz(quiz.id)}
                className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/40 hover:bg-muted duration-200"
              >
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{quiz.title}</p>
                  <div className="mt-1.5 flex gap-2">
                    <Badge variant="category" className="text-[10px]">{quiz.category}</Badge>
                    <Badge variant="warning" className="text-[10px]">{DIFFICULTY_LABELS[quiz.difficulty]}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-muted-foreground">{quiz.questions.length} q</span>
                  <span className="block text-xs font-semibold text-foreground/70 mt-0.5">{quiz.playCount} plays</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
