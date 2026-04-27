import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const residents = await db.resident.findMany({
      include: {
        user: true,
        barangay: true,
        medicalHistory: true,
        familyHistory: true,
        personalSocialHistory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const staffUsers = await db.user.findMany({
      where: {
        role: {
          in: ["STAFF", "DOCTOR", "BHW", "NURSE", "MIDWIFE"],
        },
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        createdAt: true,
        barangay: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalResidents = residents.length;
    const totalStaff = staffUsers.length;
    const totalVerifiedResidents = residents.filter(
      (resident) => resident.user?.isVerified
    ).length;

    return NextResponse.json({
      stats: {
        totalResidents,
        totalStaff,
        totalVerifiedResidents,
      },
      residents,
      staffUsers,
    });
  } catch (error) {
    console.error("ADMIN_DASHBOARD_ERROR", error);
    return NextResponse.json(
      { error: "Failed to load admin dashboard." },
      { status: 500 }
    );
  }
}