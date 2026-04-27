import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
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
    console.log("Admin already exists.");
    console.log(existing);
    return;
  }

  const passwordHash = await hash("admin12345", 10);

  const admin = await db.user.create({
    data: {
      username: "admin",
      email: "admin@barangay.com",
      password: passwordHash,
      role: "BARANGAY_ADMIN",
      isVerified: true,
      barangayId: barangay.id,
    },
  });

  console.log("Admin created successfully:");
  console.log({
    username: admin.username,
    email: admin.email,
    password: "admin12345",
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error("CREATE_ADMIN_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });