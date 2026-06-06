export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  LEADERBOARD: "/leaderboard",
  QUIZ_CREATE: "/quiz/create",
  quiz: (id: string) => `/quiz/${id}`,
  results: (id: string) => `/results/${id}`,
} as const;
