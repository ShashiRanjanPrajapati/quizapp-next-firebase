"use client";

import { useCallback, useState } from "react";
import { Info, ChevronLeft, ChevronRight, HelpCircle, LogOut, X, AlertTriangle } from "lucide-react";
import { TimerBar } from "@/components/molecules/TimerBar";
import { useQuizStore } from "@/store/quizStore";
import { cn } from "@/lib/utils";

interface QuizPlayerProps {
  onComplete: () => void;
  onQuit?: () => void;
  quizTitle?: string;
}

const optionLabels = ["A", "B", "C", "D", "E", "F"];

export function QuizPlayer({ onComplete, onQuit, quizTitle }: QuizPlayerProps) {
  const {
    currentQuiz,
    currentQuestionIndex,
    answers,
    quizStatus,
    answerQuestion,
    nextQuestion,
  } = useQuizStore();

  const [revealed, setRevealed] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  const answeredCount = answers.filter((a) => a !== -1).length;
  const canQuit = answeredCount >= 5;

  const handleExpire = useCallback(() => {
    if (!revealed) {
      setRevealed(true);
      setTimeout(() => {
        setRevealed(false);
        const isLast =
          currentQuiz !== null &&
          currentQuestionIndex + 1 >= currentQuiz.questions.length;
        nextQuestion();
        if (isLast) onComplete();
      }, 1500);
    }
  }, [revealed, nextQuestion, currentQuiz, currentQuestionIndex, onComplete]);

  if (!currentQuiz || quizStatus === "idle") return null;

  const question = currentQuiz.questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex + 1 >= currentQuiz.questions.length;

  const handleSelect = (index: number) => {
    if (revealed) return;
    answerQuestion(index);
    setRevealed(true);
  };

  const handleNext = () => {
    setRevealed(false);
    nextQuestion();
    if (isLastQuestion) onComplete();
  };

  const getOptionState = (
    index: number
  ): "default" | "selected" | "correct" | "incorrect" => {
    if (!revealed) return selectedAnswer === index ? "selected" : "default";
    if (index === question.correctAnswer) return "correct";
    if (selectedAnswer === index && index !== question.correctAnswer)
      return "incorrect";
    return "default";
  };

  const getNavState = (index: number): "current" | "answered" | "unanswered" => {
    if (index === currentQuestionIndex) return "current";
    if (answers[index] !== -1) return "answered";
    return "unanswered";
  };

  const navColors: Record<string, string> = {
    current: "bg-primary text-primary-foreground ring-2 ring-primary/40",
    answered: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30",
    unanswered: "bg-muted text-muted-foreground hover:bg-muted/80",
  };

  const optionStateStyles: Record<string, string> = {
    default:
      "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted cursor-pointer",
    selected:
      "border-primary bg-primary/10 text-foreground cursor-pointer",
    correct:
      "border-emerald-500 bg-emerald-500/10 text-emerald-300",
    incorrect:
      "border-destructive bg-destructive/10 text-destructive",
  };

  const optionLabelStyles: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    selected: "bg-primary text-primary-foreground",
    correct: "bg-emerald-500 text-white",
    incorrect: "bg-destructive text-white",
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Quiz title bar */}
      <div className="mb-4 rounded-2xl border border-border bg-card px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-foreground">
            {quizTitle ?? currentQuiz.title}
          </h1>
          {canQuit && (
            <button
              type="button"
              onClick={() => setShowQuitDialog(true)}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold px-3 py-1.5 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="size-3.5" /> Quit Exam
            </button>
          )}
        </div>
        <TimerBar
          key={`${currentQuestionIndex}-${question.timeLimit}`}
          initialTime={question.timeLimit}
          onExpire={handleExpire}
          isActive={!revealed}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* ─── LEFT: Question + Options ─── */}
        <div className="lg:col-span-2 space-y-3">
          {/* Question card */}
          <div className="rounded-2xl border border-primary/40 bg-card p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
              Question {currentQuestionIndex + 1}
            </p>
            <p className="text-sm font-medium leading-relaxed text-foreground md:text-base">
              {question.text}
            </p>
          </div>

          {/* Answer options */}
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const state = getOptionState(index);
              return (
                <button
                  key={index}
                  type="button"
                  disabled={revealed}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                    optionStateStyles[state]
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      optionLabelStyles[state]
                    )}
                  >
                    {optionLabels[index]}
                  </span>
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && question.explanation && (
            <div className="rounded-xl border border-border bg-muted p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                <Info className="size-3.5 text-primary" /> Explanation
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Prev / Next */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              disabled
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground disabled:opacity-30"
            >
              <ChevronLeft className="size-4" /> Prev
            </button>
            <span className="text-xs text-muted-foreground">
              {currentQuestionIndex + 1} / {currentQuiz.questions.length}
            </span>
            <button
              onClick={handleNext}
              disabled={!revealed}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLastQuestion ? "Finish" : "Next"} <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* ─── RIGHT: Navigation grid ─── */}
        <div className="space-y-4">
          {/* Question numbers */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}
              </p>
              <HelpCircle className="size-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {currentQuiz.questions.map((_, index) => {
                const navState = getNavState(index);
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={index > currentQuestionIndex}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg text-xs font-bold transition-all",
                      navColors[navState],
                      index > currentQuestionIndex
                        ? "cursor-not-allowed"
                        : "cursor-default"
                    )}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Legend
            </p>
            {[
              { color: "bg-primary", label: "Current" },
              { color: "bg-emerald-500/30 ring-1 ring-emerald-500/50", label: "Answered" },
              { color: "bg-muted", label: "Not visited" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className={cn("size-5 rounded flex-shrink-0", color)} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-bold text-primary">
                {Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quit Confirmation Dialog */}
      {showQuitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-destructive/10 p-2 text-destructive flex-shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Quit Exam</h3>
                <p className="mt-2 text-sm text-muted-foreground font-medium">
                  Are you sure you want to quit the exam? Any progress made on this attempt will be reset.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowQuitDialog(false)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQuitDialog(false);
                  if (onQuit) onQuit();
                }}
                className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-all cursor-pointer"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
