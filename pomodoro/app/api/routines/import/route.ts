import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const parsed = JSON.parse(text);

    let arr = Array.isArray(parsed.routines) ? parsed.routines : parsed;
    if (!Array.isArray(arr)) {
      return NextResponse.json(
        { error: "Invalid payload: expected array" },
        { status: 400 }
      );
    }

    const normalized = arr.map((r: any) => ({
      id: r.id ?? crypto.randomUUID(),
      name: String(r.name ?? "Sin nombre"),
      workDuration: Number(r.workDuration ?? 25),
      breakDuration: Number(r.breakDuration ?? 5),
      cycles: Number(r.cycles ?? 1),
      image: r.image ?? "",
      category: r.category ?? "",
      description: r.description ?? "",
      createdAt: r.createdAt ?? new Date().toISOString(),
    }));

    
    const addedCount = await db.addMany(normalized);

    return NextResponse.json({ success: true, added: addedCount });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error importing file" }, { status: 500 });
  }
}
