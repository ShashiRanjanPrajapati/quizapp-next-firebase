"use client";

import { use, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizLayout } from "@/components/templates/QuizLayout";
import { QuizPlayer } from "@/components/organisms/QuizPlayer";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { useQuiz } from "@/hooks/useQuiz";
import { useAuth } from "@/hooks/useAuth";
import { useQuizStore } from "@/store/quizStore";
import {
  incrementQuizPlayCount,
  saveQuizResult,
} from "@/lib/firebase/firestore";
import { calculateScore } from "@/lib/utils/calculateScore";
import { ROUTES } from "@/constants/routes";
import { AnimatedQuizIllustration } from "@/components/atoms/AnimatedQuizIllustration/AnimatedQuizIllustration";
import { HelpCircle, Clock, Trophy, BookOpen, ChevronRight } from "lucide-react";

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { quiz, isLoading, error } = useQuiz(id);
  const {
    currentQuiz,
    quizStatus,
    answers,
    timeTaken,
    startQuiz,
    endQuiz,
    resetQuiz,
  } = useQuizStore();

  useEffect(() => {
    return () => resetQuiz();
  }, [resetQuiz]);

  const handleStartQuiz = () => {
    if (!quiz) return;
    startQuiz(quiz);
    incrementQuizPlayCount(quiz.id).catch(console.error);
  };

  const handleComplete = useCallback(async () => {
    if (!currentQuiz || !user) {
      endQuiz();
      if (!user) {
        router.push(ROUTES.LOGIN);
      }
      return;
    }

    endQuiz();
    const { score, correctAnswers } = calculateScore(
      currentQuiz.questions,
      answers
    );

    try {
      const resultId = await saveQuizResult({
        userId: user.uid,
        quizId: currentQuiz.id,
        score,
        totalQuestions: currentQuiz.questions.length,
        correctAnswers,
        timeTaken,
        answers,
      });
      router.push(ROUTES.results(resultId));
    } catch (err) {
      console.error("Failed to save result:", err);
    }
  }, [currentQuiz, user, answers, timeTaken, endQuiz, router]);

  if (isLoading) {
    return (
      <QuizLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </QuizLayout>
    );
  }

  if (error || !quiz) {
    return (
      <QuizLayout>
        <div className="text-center">
          <p className="text-destructive">Quiz not found</p>
          <Button className="mt-4" onClick={() => router.push(ROUTES.HOME)}>
            Go Home
          </Button>
        </div>
      </QuizLayout>
    );
  }

  if (quizStatus === "idle") {
    const averageTime = quiz.questions.length
      ? Math.round(quiz.questions.reduce((sum, q) => sum + q.timeLimit, 0) / quiz.questions.length)
      : 30;

    const difficultyPills: Record<string, string> = {
      easy: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      hard: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    };

    return (
      <QuizLayout title={quiz.title}>
        <div className="relative mx-auto max-w-4xl w-full mt-4 md:mt-8">
          {/* Drifting Background Glow Blobs */}
          <div className="absolute -top-16 -left-16 size-72 rounded-full bg-primary/15 blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-16 -right-16 size-72 rounded-full bg-violet-500/15 blur-[120px] pointer-events-none animate-pulse" />

          {/* Premium Glassmorphic Container */}
          <div className="relative z-10 overflow-hidden rounded-3xl border border-white/5 bg-card/65 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Animated SVG Illustration */}
              <div className="md:col-span-5 flex justify-center">
                <AnimatedQuizIllustration
                  category={quiz.category}
                  className="w-full max-w-[280px] md:max-w-none"
                />
              </div>

              {/* Right Column: Quiz Info & Controls */}
              <div className="md:col-span-7 flex flex-col justify-center text-left">
                {/* Badges Row */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/20 tracking-wide uppercase">
                    {quiz.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide uppercase ${difficultyPills[quiz.difficulty] || difficultyPills.medium}`}>
                    {quiz.difficulty}
                  </span>
                  {quiz.playCount > 0 && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-white/5">
                      {quiz.playCount} plays
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {quiz.title}
                </h1>

                {/* Description */}
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {quiz.description ||
                    "Test your knowledge and beat the clock in this engaging quiz. Challenge yourself to get a perfect score!"}
                </p>

                {/* Divider */}
                <div className="border-t border-white/5 my-6" />

                {/* Info List */}
                <div className="space-y-3.5 mb-8">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="size-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {quiz.questions.length} Questions
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Multiple-choice formatting with variable score weights.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {averageTime}s Time Limit
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Average response time window per question to answer correctly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Trophy className="size-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Leaderboard Sync
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Saves score metrics to compare rankings against other players.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={handleStartQuiz}
                  className="group relative overflow-hidden rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] w-full md:w-fit cursor-pointer flex items-center justify-center gap-2"
                >
                  {/* Sweep shimmer sheen light effect */}
                  <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-[150%] transition-transform duration-1000 ease-out group-hover:translate-x-[250%] pointer-events-none" />
                  
                  <span>Start Quiz</span>
                  <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </QuizLayout>
    );
  }

  const handleQuit = () => {
    resetQuiz();
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <QuizLayout>
      <QuizPlayer
        onComplete={handleComplete}
        onQuit={handleQuit}
        quizTitle={quiz.title}
      />
    </QuizLayout>
  );
}
