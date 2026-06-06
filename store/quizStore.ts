import { create } from "zustand";
import type { Quiz, QuizStatus } from "@/types";

interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  timeRemaining: number;
  quizStatus: QuizStatus;
  timeTaken: number;
  startQuiz: (quiz: Quiz) => void;
  answerQuestion: (optionIndex: number) => void;
  nextQuestion: () => void;
  tickTimer: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
}

const initialState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: [] as number[],
  score: 0,
  timeRemaining: 0,
  quizStatus: "idle" as QuizStatus,
  timeTaken: 0,
};

export const useQuizStore = create<QuizState>((set, get) => ({
  ...initialState,

  startQuiz: (quiz) => {
    const firstQuestion = quiz.questions[0];
    set({
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      answers: new Array(quiz.questions.length).fill(-1),
      score: 0,
      timeRemaining: firstQuestion?.timeLimit ?? 30,
      quizStatus: "active",
      timeTaken: 0,
    });
  },

  answerQuestion: (optionIndex) => {
    const { currentQuiz, currentQuestionIndex, answers } = get();
    if (!currentQuiz || get().quizStatus !== "active") return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;

    const question = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = optionIndex === question.correctAnswer;
    const newScore = isCorrect ? get().score + 1 : get().score;

    set({ answers: newAnswers, score: newScore });
  },

  nextQuestion: () => {
    const { currentQuiz, currentQuestionIndex } = get();
    if (!currentQuiz) return;

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= currentQuiz.questions.length) {
      get().endQuiz();
      return;
    }

    const nextQuestion = currentQuiz.questions[nextIndex];
    set({
      currentQuestionIndex: nextIndex,
      timeRemaining: nextQuestion.timeLimit,
    });
  },

  tickTimer: () => {
    const { timeRemaining, quizStatus } = get();
    if (quizStatus !== "active") return;

    if (timeRemaining <= 1) {
      set({ timeRemaining: 0 });
      get().nextQuestion();
      return;
    }

    set({
      timeRemaining: timeRemaining - 1,
      timeTaken: get().timeTaken + 1,
    });
  },

  endQuiz: () => {
    set({ quizStatus: "finished" });
  },

  resetQuiz: () => {
    set(initialState);
  },
}));
