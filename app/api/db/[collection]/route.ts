import { NextResponse } from "next/server";
import { firestoreAdd } from "@/lib/firebase/firestore-server";

interface RouteParams {
  params: Promise<{ collection: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { collection } = await params;
    const data = await request.json();
    const docId = await firestoreAdd(collection, data);
    return NextResponse.json(docId);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
