import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    { error: "Admin password verification is disabled in public deployment." },
    { status: 403 }
  );
}