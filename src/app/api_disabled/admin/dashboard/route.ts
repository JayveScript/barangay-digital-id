import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { error: "Admin dashboard is disabled in public deployment." },
    { status: 403 }
  );
}