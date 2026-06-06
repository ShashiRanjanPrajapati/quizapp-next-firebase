import { NextResponse } from "next/server";
import { getPublicQuizzes, createQuiz } from "@/lib/firebase/firestore-server";
import type { Difficulty } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const difficulty = (searchParams.get("difficulty") as Difficulty) || undefined;

  try {
    const quizzes = await getPublicQuizzes(category, difficulty);
    return NextResponse.json(quizzes);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const quiz = await request.json();
    // We can extract custom header from middleware if needed (e.g. x-user-id)
    const userId = request.headers.get("x-user-id");
    if (userId) {
      quiz.createdBy = userId;
    }
    const quizId = await createQuiz(quiz);
    return NextResponse.json(quizId);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
