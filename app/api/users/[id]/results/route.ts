import { NextResponse } from "next/server";
import { getUserResults } from "@/lib/firebase/firestore-server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const max = Number(searchParams.get("max")) || 10;

  try {
    const { id } = await params;
    const results = await getUserResults(id, max);
    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
