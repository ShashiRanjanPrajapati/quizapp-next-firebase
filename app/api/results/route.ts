import { NextResponse } from "next/server";
import { saveQuizResult } from "@/lib/firebase/firestore-server";

export async function POST(request: Request) {
  try {
    const result = await request.json();
    const userId = request.headers.get("x-user-id");
    if (userId) {
      result.userId = userId;
    }
    const resultId = await saveQuizResult(result);
    return NextResponse.json(resultId);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
