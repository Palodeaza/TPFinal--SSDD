import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET() {
  try {
    const data = await db.getAll();
    return new NextResponse(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="routines.json"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Error exporting" }, { status: 500 });
  }
}
