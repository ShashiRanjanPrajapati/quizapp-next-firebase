import { NextResponse } from "next/server";
import { getQuizById } from "@/lib/firebase/firestore-server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const quiz = await getQuizById(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
