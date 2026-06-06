import { NextResponse } from "next/server";
import { firestoreUpdate, firestoreRemove } from "@/lib/firebase/firestore-server";

interface RouteParams {
  params: Promise<{ collection: string; id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { collection, id } = await params;
    const data = await request.json();
    await firestoreUpdate(collection, id, data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { collection, id } = await params;
    await firestoreRemove(collection, id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
