import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    const STATIC_BARANGAY = "Barangay 19-B";
    const STATIC_CITY = "Davao City";

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedCode = String(code).trim();

    const pending = await db.pendingRegistration.findUnique({
      where: { email: normalizedEmail },
    });

    if (!pending) {
      return NextResponse.json(
        { error: "Pending registration not found." },
        { status: 404 }
      );
    }

    if (pending.otpCode !== normalizedCode) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    if (new Date() > pending.otpExpiresAt) {
      return NextResponse.json(
        { error: "Verification code has expired." },
        { status: 400 }
      );
    }

    const existingUserByEmail = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 400 }
      );
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username: pending.username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "This username is already registered." },
        { status: 400 }
      );
    }

    const existingResidentByEmail = await db.resident.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingResidentByEmail) {
      return NextResponse.json(
        { error: "This resident email already exists." },
        { status: 400 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      let barangay = await tx.barangay.findFirst({
        where: { name: STATIC_BARANGAY },
      });

      if (!barangay) {
        barangay = await tx.barangay.create({
          data: {
            name: STATIC_BARANGAY,
            municipality: STATIC_CITY,
          },
        });
      }

      const user = await tx.user.create({
        data: {
          username: pending.username,
          email: normalizedEmail,
          password: pending.passwordHash,
          role: "RESIDENT",
          isVerified: true,
          barangayId: barangay.id,
        },
      });

      const resident = await tx.resident.create({
        data: {
          lastName: pending.lastName,
          firstName: pending.firstName,
          middleName: pending.middleName,
          age: pending.age,
          sex: pending.sex,
          birthDate: pending.birthDate,
          religion: pending.religion,
          completeAddress: pending.completeAddress,
          barangayName: STATIC_BARANGAY,
          city: STATIC_CITY,
          civilStatus: pending.civilStatus,
          contactNumber: pending.contactNumber,
          educationalAttainment: pending.educationalAttainment,
          occupation: pending.occupation,
          accompanyingPerson: pending.accompanyingPerson,
          relationship: pending.relationship,
          spouseMaidenName: pending.spouseMaidenName,
          spouseOccupation: pending.spouseOccupation,
          spouseContactNumber: pending.spouseContactNumber,
          email: normalizedEmail,
          phoneNumber: pending.contactNumber,
          userId: user.id,
          barangayId: barangay.id,
        },
      });

      await tx.residentMedicalHistory.create({
        data: {
          residentId: resident.id,
          hasHypertension: pending.hasHypertension,
          hasDiabetes: pending.hasDiabetes,
          hasStiHiv: pending.hasStiHiv,
          hasHeartDisease: pending.hasHeartDisease,
          hasKidneyFailure: pending.hasKidneyFailure,
          hasTuberculosis: pending.hasTuberculosis,
          hasAllergies: pending.hasAllergies,
          allergiesDetails: pending.allergiesDetails,
          hasCancer: pending.hasCancer,
          cancerDetails: pending.cancerDetails,
          hasOtherConditions: pending.hasOtherConditions,
          otherConditionsDetails: pending.otherConditionsDetails,
          maintenanceMedications: pending.maintenanceMedications,
          previousIllnessesSurgeries: pending.previousIllnessesSurgeries,
        },
      });

      await tx.residentFamilyHistory.create({
        data: {
          residentId: resident.id,
          asthmaAllergies: pending.familyAsthmaAllergies,
          birthDefects: pending.familyBirthDefects,
          cancer: pending.familyCancer,
          dementia: pending.familyDementia,
          diabetes: pending.familyDiabetes,
          hypertension: pending.familyHypertension,
          kidneyDisease: pending.familyKidneyDisease,
          mentalIllness: pending.familyMentalIllness,
        },
      });

      await tx.residentPersonalSocialHistory.create({
        data: {
          residentId: resident.id,
          eatsHealthyDiet: pending.eatsHealthyDiet,
          adequatePhysicalActivity: pending.adequatePhysicalActivity,
          sufficientRestSleep: pending.sufficientRestSleep,
          normalGrowthDevelopment: pending.normalGrowthDevelopment,
          multipleSexPartners: pending.multipleSexPartners,
          smokesTobacco: pending.smokesTobacco,
          tobaccoPacksPerYear: pending.tobaccoPacksPerYear,
          drinksAlcohol: pending.drinksAlcohol,
          alcoholBottlesPerDay: pending.alcoholBottlesPerDay,
          takesIllicitDrugs: pending.takesIllicitDrugs,
          illicitDrugsDetails: pending.illicitDrugsDetails,
        },
      });

      await tx.pendingRegistration.delete({
        where: { email: normalizedEmail },
      });

      return {
        userId: user.id,
        residentId: resident.id,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Account verified and created successfully.",
      userId: result.userId,
      residentId: result.residentId,
    });
  } catch (error) {
    console.error("VERIFY_CODE_ERROR", error);

    return NextResponse.json(
      { error: "Failed to verify and create account." },
      { status: 500 }
    );
  }
}