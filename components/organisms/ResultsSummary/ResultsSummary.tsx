"use client";

import { format } from "date-fns";
import { CheckCircle2, Clock, Share2, XCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { formatTime } from "@/lib/utils/formatTime";
import type { Question, QuizResult } from "@/types";
import { useEffect, useState } from "react";

interface ResultsSummaryProps {
  result: QuizResult;
  questions: Question[];
  quizTitle: string;
  onPlayAgain: () => void;
  onShare: () => void;
}

function CircularScore({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (display / 100) * circumference;

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 900;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(progress * score));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const color =
    score >= 70 ? "#34d399" : score >= 40 ? "#f59e0b" : "rgb(var(--destructive))";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-extrabold tabular-nums" style={{ color }}>
          {display}%
        </p>
      </div>
    </div>
  );
}

export function ResultsSummary({
  result,
  questions,
  quizTitle,
  onPlayAgain,
  onShare,
}: ResultsSummaryProps) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Purple header */}
      <div className="rounded-2xl bg-primary px-6 py-5 text-center shadow-lg shadow-primary/20">
        <h1 className="text-xl font-bold text-primary-foreground">Quiz Complete! 🎉</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">{quizTitle}</p>
      </div>

      {/* Score + stats row */}
      <div className="flex flex-wrap items-center justify-center gap-5">
        <CircularScore score={result.score} />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-xs text-muted-foreground">Correct</p>
              <p className="text-lg font-bold text-emerald-400">
                {result.correctAnswers}/{result.totalQuestions}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
            <XCircle className="size-5 shrink-0 text-destructive" />
            <div>
              <p className="text-xs text-muted-foreground">Wrong</p>
              <p className="text-lg font-bold text-destructive">
                {result.totalQuestions - result.correctAnswers}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
            <Clock className="size-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-lg font-bold text-primary">{formatTime(result.timeTaken)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
        >
          <RotateCcw className="size-4" /> Play Again
        </button>
        <button
          onClick={onShare}
          className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground hover:border-primary/40 hover:bg-muted transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="size-4 text-primary" /> Share
        </button>
      </div>

      {/* Answer review */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Answer Review
        </h2>
        <div className="space-y-3">
          {questions.map((question, index) => {
            const userAnswer = result.answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={`rounded-xl border p-4 transition-colors ${
                  isCorrect
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                  )}
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{question.text}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={isCorrect ? "success" : "danger"} className="text-xs">
                        Your answer:{" "}
                        {userAnswer >= 0
                          ? question.options[userAnswer]
                          : "No answer"}
                      </Badge>
                      {!isCorrect && (
                        <Badge variant="success" className="text-xs">
                          Correct: {question.options[question.correctAnswer]}
                        </Badge>
                      )}
                    </div>
                    {question.explanation && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Completed on{" "}
        {result.completedAt
          ? format(result.completedAt.toDate(), "PPp")
          : "—"}
      </p>
    </div>
  );
}
