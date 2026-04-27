import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";


const STATIC_BARANGAY = "Barangay 19-B";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      username,
      password,
      role,
    }: {
      fullName?: string;
      username?: string;
      password?: string;
      role?: string;
    } = body;

    if (
      !fullName?.trim() ||
      !username?.trim() ||
      !password?.trim() ||
      !role?.trim()
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const allowedRoles = ["STAFF", "DOCTOR", "BHW", "NURSE", "MIDWIFE"] as const;

    if (!allowedRoles.includes(role as (typeof allowedRoles)[number])) {
      return NextResponse.json(
        { error: "Invalid role selected." },
        { status: 400 }
      );
    }

    if (password.trim().length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { username: username.trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 400 }
      );
    }

    let barangay = await db.barangay.findFirst({
      where: { name: STATIC_BARANGAY },
    });

    if (!barangay) {
      barangay = await db.barangay.create({
        data: {
          name: STATIC_BARANGAY,
          municipality: "Davao City",
        },
      });
    }

    const passwordHash = await hash(password.trim(), 10);

    const user = await db.user.create({
      data: {
        fullName: fullName.trim(),
        username: username.trim(),
        password: passwordHash,
        
        isVerified: true,
        barangayId: barangay.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    console.error("ADMIN_CREATE_USER_ERROR", error);
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    );
  }
}