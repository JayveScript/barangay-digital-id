import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body.password;

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const admin = await prisma.user.findFirst({
      where: { role: "BARANGAY_ADMIN" },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}