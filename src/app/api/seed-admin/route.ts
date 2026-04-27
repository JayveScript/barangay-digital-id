import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    let barangay = await db.barangay.findFirst({
      where: { name: "Barangay Health Main Office" },
    });

    if (!barangay) {
      barangay = await db.barangay.create({
        data: {
          name: "Barangay Health Main Office",
          municipality: "Main Municipality",
          province: "Main Province",
        },
      });
    }

    const existing = await db.user.findFirst({
      where: {
        OR: [
          { username: "admin" },
          { email: "admin@barangay.com" },
        ],
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Admin already exists.",
        credentials: {
          username: "admin",
          password: "admin12345",
        },
      });
    }

    const passwordHash = await hash("admin12345", 10);

    const admin = await db.user.create({
      data: {
        username: "admin",
        email: "admin@barangay.com",
        password: passwordHash,
        role: Role.BARANGAY_ADMIN,
        isVerified: true,
        barangayId: barangay.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully.",
      credentials: {
        username: "admin",
        password: "admin12345",
      },
      adminId: admin.id,
    });
  } catch (error) {
    console.error("SEED_ADMIN_ERROR", error);
    return NextResponse.json(
      { error: "Failed to create admin." },
      { status: 500 }
    );
  }
}