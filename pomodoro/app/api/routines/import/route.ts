// app/api/routines/import/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const parsed = JSON.parse(text);

    let arr = parsed;
    if (parsed && parsed.routines && Array.isArray(parsed.routines)) arr = parsed.routines;
    if (!Array.isArray(arr)) {
      return NextResponse.json({ error: "Invalid payload: expected array" }, { status: 400 });
    }

    // Basic validation and normalization: ensure id, name, durations
    const normalized = arr.map((r: any) => ({
      id: r.id ?? String(Date.now() + Math.floor(Math.random() * 10000)),
      name: String(r.name ?? "Sin nombre"),
      workDuration: Number(r.workDuration ?? 25),
      breakDuration: Number(r.breakDuration ?? 5),
      cycles: Number(r.cycles ?? 1),
      image: r.image ?? "",
      category: r.category ?? "",
      description: r.description ?? "",
      createdAt: r.createdAt ?? new Date().toISOString(),
    }));

    await db.overwrite(normalized);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error importing file" }, { status: 500 });
  }
}
