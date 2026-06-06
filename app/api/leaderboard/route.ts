import { NextResponse } from "next/server";
import { getLeaderboardEntries } from "@/lib/firebase/firestore-server";
import type { Difficulty } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const max = Number(searchParams.get("max")) || 10;
  const category = searchParams.get("category") || undefined;
  const difficulty = (searchParams.get("difficulty") as Difficulty) || undefined;

  try {
    const entries = await getLeaderboardEntries(max, category, difficulty);
    return NextResponse.json(entries);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
