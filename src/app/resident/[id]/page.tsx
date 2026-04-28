import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PublicResidentPage({ params }: PageProps) {
  const { id } = await params;

  let resident;

  try {
    resident = await prisma.resident.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        sex: true,
        age: true,
        birthDate: true,
        civilStatus: true,
        religion: true,
        occupation: true,
        educationalAttainment: true,
        completeAddress: true,
        barangayName: true,
        city: true,
        contactNumber: true,
        email: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  } catch (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#EEF4FF] p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-red-600">
            Unable to load resident data
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {error instanceof Error ? error.message : "Unknown database error"}
          </p>
        </div>
      </main>
    );
  }

  if (!resident) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#EEF4FF] p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-slate-900">
            Resident Not Found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This Digital ID record does not exist.
          </p>
        </div>
      </main>
    );
  }

  const fullName = `${resident.firstName ?? ""} ${resident.middleName ?? ""} ${
    resident.lastName ?? ""
  }`
    .replace(/\s+/g, " ")
    .trim();

  return (
    <main className="min-h-screen bg-[#EEF4FF] p-6">
      <div className="mx-auto max-w-2xl rounded-[30px] border border-blue-100 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-4">
          <img
            src="/images/davao-logo.png"
            alt="Barangay Logo"
            className="h-16 w-16 rounded-full object-contain"
          />

          <div>
            <h1 className="text-2xl font-black text-blue-900">
              Barangay Health Digital ID
            </h1>
            <p className="text-sm text-slate-500">
              Public resident verification
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Info label="Full Name" value={fullName} />
          <Info label="Sex" value={resident.sex} />
          <Info label="Age" value={resident.age} />
          <Info
            label="Birth Date"
            value={
              resident.birthDate
                ? new Date(resident.birthDate).toLocaleDateString()
                : ""
            }
          />
          <Info label="Civil Status" value={resident.civilStatus} />
          <Info label="Religion" value={resident.religion} />
          <Info label="Occupation" value={resident.occupation} />
          <Info
            label="Educational Attainment"
            value={resident.educationalAttainment}
          />
          <Info label="Complete Address" value={resident.completeAddress} />
          <Info label="Barangay" value={resident.barangayName} />
          <Info label="City" value={resident.city} />
          <Info label="Contact Number" value={resident.contactNumber} />
          <Info label="Email" value={resident.email ?? resident.user?.email} />
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-900">{String(value)}</p>
    </div>
  );
}