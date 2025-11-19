// app/api/routines/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET() {
  try {
    const routines = await db.getAll();
    return NextResponse.json(routines);
  } catch (e) {
    return NextResponse.json({ error: "Error reading routines" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // basic validation
    if (!body.name || !body.workDuration || !body.breakDuration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const routine = await db.create({
      id: body.id ?? String(Date.now()),
      name: String(body.name),
      workDuration: Number(body.workDuration),
      breakDuration: Number(body.breakDuration),
      cycles: Number(body.cycles) || 1,
      image: body.image ?? "",
      category: body.category ?? "",
      description: body.description ?? "",
    });

    return NextResponse.json(routine, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error creating routine" }, { status: 500 });
  }
}
