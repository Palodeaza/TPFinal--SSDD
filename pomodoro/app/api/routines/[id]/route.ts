// app/api/routines/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/database";

async function getIdFromContext(context: any) {
  // context.params may be a Promise in newer Next versions
  const params = context?.params instanceof Promise ? await context.params : context?.params;
  return params?.id;
}
/*
export async function GET(_: Request, context: any) {
  const id = await getIdFromContext(context);
  const item = await db.getById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}
*/
/*export async function PUT(req: Request, context: any) {
  try {
    const id = await getIdFromContext(context);
    const updates = await req.json();
    const updated = await db.update(String(id), updates);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Error updating" }, { status: 500 });
  }
}
*/
export async function DELETE(_: Request, context: any) {
  const id = await getIdFromContext(context);
  const ok = await db.delete(String(id));
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
