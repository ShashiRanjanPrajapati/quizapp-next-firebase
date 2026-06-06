import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/firebase/firestore-server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const profile = await getUserProfile(id);
    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
