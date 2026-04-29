"use client";

import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

type ResidentData = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  age: number;
  sex: string;
  birthDate: string;
  religion?: string | null;
  completeAddress: string;
  barangayName: string;
  city?: string | null;
  civilStatus: string;
  contactNumber?: string | null;
  educationalAttainment?: string | null;
  occupation?: string | null;
  accompanyingPerson?: string | null;
  relationship?: string | null;
  spouseMaidenName?: string | null;
  spouseOccupation?: string | null;
  spouseContactNumber?: string | null;

  email?: string | null;
  phoneNumber?: string | null;
  username: string;
  isVerified: boolean;

  medicalHistory?: {
    hasHypertension: boolean;
    hasDiabetes: boolean;
    hasStiHiv: boolean;
    hasHeartDisease: boolean;
    hasKidneyFailure: boolean;
    hasTuberculosis: boolean;
    hasAllergies: boolean;
    allergiesDetails?: string | null;
    hasCancer: boolean;
    cancerDetails?: string | null;
    hasOtherConditions: boolean;
    otherConditionsDetails?: string | null;
    maintenanceMedications?: string | null;
    previousIllnessesSurgeries?: string | null;
  } | null;

  familyHistory?: {
    asthmaAllergies: boolean;
    birthDefects: boolean;
    cancer: boolean;
    dementia: boolean;
    diabetes: boolean;
    hypertension: boolean;
    kidneyDisease: boolean;
    mentalIllness: boolean;
  } | null;

  personalSocialHistory?: {
    eatsHealthyDiet: boolean;
    adequatePhysicalActivity: boolean;
    sufficientRestSleep: boolean;
    normalGrowthDevelopment: boolean;
    multipleSexPartners: boolean;
    smokesTobacco: boolean;
    tobaccoPacksPerYear?: string | null;
    drinksAlcohol: boolean;
    alcoholBottlesPerDay?: string | null;
    takesIllicitDrugs: boolean;
    illicitDrugsDetails?: string | null;
  } | null;
};

export default function ResidentDashboard() {
  const [resident, setResident] = useState<ResidentData | null>(null);
  const [activeTab, setActiveTab] = useState("identifying");
  const [sidebarTab, setSidebarTab] = useState<"personal" | "digital">(
    "personal"
  );

  useEffect(() => {
    fetch("/api/residents/me")
      .then((res) => res.json())
      .then((data) => setResident(data));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("LOGOUT_ERROR", error);
    }
  };

  if (!resident) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF4FF] px-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 px-8 py-6 shadow-xl backdrop-blur">
          <p className="text-sm font-medium text-slate-600">
            Loading resident portal...
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${resident.firstName} ${resident.middleName ?? ""} ${
    resident.lastName
  }`
    .replace(/\s+/g, " ")
    .trim();

  return (
    <main className="h-screen overflow-hidden bg-[linear-gradient(180deg,#EEF4FF_0%,#F8FBFF_45%,#F3F7FD_100%)] px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto h-full max-w-7xl">
        <div className="grid h-full gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,#0F172A_0%,#172554_52%,#1E3A8A_100%)] p-5 text-white shadow-[0_20px_60px_rgba(30,58,138,0.30)]">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldIcon className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h2 className="whitespace-nowrap text-lg font-bold">
                    Health Portal
                  </h2>
                  <p className="text-sm text-blue-100/70">Navigation</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => setSidebarTab("personal")}
                  className={`flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-4 text-left text-sm font-semibold transition ${
                    sidebarTab === "personal"
                      ? "bg-[linear-gradient(135deg,#2563EB_0%,#3B82F6_100%)] text-white shadow-lg shadow-blue-900/20"
                      : "bg-white/0 text-blue-100/80 hover:bg-white/10"
                  }`}
                >
                  <UserIcon className="h-5 w-5 shrink-0" />
                  Personal Info
                </button>

                <button
                  type="button"
                  onClick={() => setSidebarTab("digital")}
                  className={`flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-4 text-left text-sm font-semibold transition ${
                    sidebarTab === "digital"
                      ? "bg-[linear-gradient(135deg,#2563EB_0%,#3B82F6_100%)] text-white shadow-lg shadow-blue-900/20"
                      : "bg-white/0 text-blue-100/80 hover:bg-white/10"
                  }`}
                >
                  <IdCardIcon className="h-5 w-5 shrink-0" />
                  Digital ID
                </button>
              </div>
            </div>
          </aside>

          <section className="h-full overflow-y-auto rounded-[30px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
            <div className="mb-6 flex flex-col gap-4 rounded-[24px] bg-[linear-gradient(135deg,#F8FBFF_0%,#EEF4FF_100%)] p-5 ring-1 ring-slate-200/70 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    fullName
                  )}&background=DBEAFE&color=1D4ED8&bold=true&size=128`}
                  alt={fullName}
                  className="h-16 w-16 rounded-2xl border border-blue-100 object-cover shadow-sm"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      {fullName}
                    </h2>

                    {resident.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        <VerifiedIcon className="h-3.5 w-3.5" />
                        Verified Resident
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Secure access to personal and medical records
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 md:self-center"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>

            {sidebarTab === "personal" && (
              <>
                <div className="mb-6 overflow-x-auto">
                  <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          activeTab === tab.id
                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                            : "text-slate-500 hover:bg-white hover:text-blue-600"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                  {activeTab === "identifying" && (
                    <Section
                      title="Identifying Data"
                      subtitle="Resident profile grouped into one clean section with personal information, contact details, and address."
                      icon={<UserIcon className="h-5 w-5" />}
                    >
                      <div className="grid gap-5 xl:grid-cols-3">
                        <PersonalInfoCard
                          resident={resident}
                          fullName={fullName}
                        />

                        <InfoCard
                          title="Contacts"
                          icon={<PhoneIcon className="h-5 w-5" />}
                        >
                          <MiniField
                            label="Contact No."
                            value={resident.contactNumber}
                          />
                          <MiniField label="Email" value={resident.email} />
                          <MiniField
                            label="Accompanying Person"
                            value={resident.accompanyingPerson}
                          />
                          <MiniField
                            label="Relationship"
                            value={resident.relationship}
                          />
                          <MiniField
                            label="Spouse Maiden Name"
                            value={resident.spouseMaidenName}
                          />
                          <MiniField
                            label="Spouse Occupation"
                            value={resident.spouseOccupation}
                          />
                          <MiniField
                            label="Spouse Contact No."
                            value={resident.spouseContactNumber}
                          />
                        </InfoCard>

                        <InfoCard
                          title="Address"
                          icon={<LocationIcon className="h-5 w-5" />}
                        >
                          <MiniField
                            label="Street"
                            value={getStreetOnly(resident.completeAddress)}
                          />
                          <MiniField
                            label="Barangay"
                            value={resident.barangayName}
                          />
                          <MiniField label="City" value={resident.city} />
                          <MiniField
                            label="Province"
                            value="Davao del Norte"
                          />
                        </InfoCard>
                      </div>
                    </Section>
                  )}

                  {activeTab === "medical" && (
                    <Section
                      title="Past Medical History"
                      subtitle="Resident’s declared conditions, treatments, and prior procedures."
                      icon={<MedicalIcon className="h-5 w-5" />}
                    >
                      <div className="grid gap-5 xl:grid-cols-3">
                        <InfoCard
                          title="Conditions"
                          icon={<MedicalIcon className="h-5 w-5" />}
                        >
                          <MiniField
                            label="Hypertension"
                            value={bool(
                              resident.medicalHistory?.hasHypertension
                            )}
                          />
                          <MiniField
                            label="Diabetes"
                            value={bool(resident.medicalHistory?.hasDiabetes)}
                          />
                          <MiniField
                            label="STI / HIV"
                            value={bool(resident.medicalHistory?.hasStiHiv)}
                          />
                          <MiniField
                            label="Heart Disease"
                            value={bool(
                              resident.medicalHistory?.hasHeartDisease
                            )}
                          />
                          <MiniField
                            label="Kidney Failure"
                            value={bool(
                              resident.medicalHistory?.hasKidneyFailure
                            )}
                          />
                          <MiniField
                            label="Tuberculosis"
                            value={bool(
                              resident.medicalHistory?.hasTuberculosis
                            )}
                          />
                        </InfoCard>

                        <InfoCard
                          title="Details"
                          icon={<FamilyIcon className="h-5 w-5" />}
                        >
                          <MiniField
                            label="Has Allergies"
                            value={bool(resident.medicalHistory?.hasAllergies)}
                          />
                          <MiniField
                            label="Allergies Details"
                            value={resident.medicalHistory?.allergiesDetails}
                          />
                          <MiniField
                            label="Has Cancer"
                            value={bool(resident.medicalHistory?.hasCancer)}
                          />
                          <MiniField
                            label="Cancer Details"
                            value={resident.medicalHistory?.cancerDetails}
                          />
                          <MiniField
                            label="Other Conditions"
                            value={bool(
                              resident.medicalHistory?.hasOtherConditions
                            )}
                          />
                          <MiniField
                            label="Other Conditions Details"
                            value={
                              resident.medicalHistory?.otherConditionsDetails
                            }
                          />
                        </InfoCard>

                        <InfoCard
                          title="Medication / Surgeries"
                          icon={<LifestyleIcon className="h-5 w-5" />}
                        >
                          <MiniField
                            label="Maintenance Medication(s)"
                            value={
                              resident.medicalHistory?.maintenanceMedications
                            }
                          />
                          <MiniField
                            label="Previous Illnesses / Surgeries"
                            value={
                              resident.medicalHistory
                                ?.previousIllnessesSurgeries
                            }
                          />
                        </InfoCard>
                      </div>
                    </Section>
                  )}

                  {activeTab === "family" && (
                    <Section
                      title="Family History"
                      subtitle="Recorded hereditary or family-related health conditions."
                      icon={<FamilyIcon className="h-5 w-5" />}
                    >
                      <div className="grid gap-5 xl:grid-cols-3">
                        <InfoCard
                          title="Family History"
                          icon={<FamilyIcon className="h-5 w-5" />}
                        >
                          <MiniField
                            label="Asthma / Allergies"
                            value={bool(
                              resident.familyHistory?.asthmaAllergies
                            )}
                          />
                          <MiniField
                            label="Birth Defects"
                            value={bool(resident.familyHistory?.birthDefects)}
                          />
                          <MiniField
                            label="Cancer"
                            value={bool(resident.familyHistory?.cancer)}
                          />
                          <MiniField
                            label="Dementia"
                            value={bool(resident.familyHistory?.dementia)}
                          />
                          <MiniField
                            label="Diabetes"
                            value={bool(resident.familyHistory?.diabetes)}
                          />
                          <MiniField
                            label="Hypertension"
                            value={bool(resident.familyHistory?.hypertension)}
                          />
                          <MiniField
                            label="Kidney Disease"
                            value={bool(resident.familyHistory?.kidneyDisease)}
                          />
                          <MiniField
                            label="Mental Illness"
                            value={bool(resident.familyHistory?.mentalIllness)}
                          />
                        </InfoCard>
                      </div>
                    </Section>
                  )}

                  {activeTab === "personal" && (
                    <Section
                      title="Personal / Social History"
                      subtitle="Lifestyle, daily habits, and social health information."
                      icon={<LifestyleIcon className="h-5 w-5" />}
                    >
                      <div className="grid gap-5 xl:grid-cols-3">
                        <InfoCard
                          title="Lifestyle Information"
                          icon={<LifestyleIcon className="h-5 w-5" />}
                        >
                          <MiniField
                            label="Eats Healthy Diet"
                            value={bool(
                              resident.personalSocialHistory?.eatsHealthyDiet
                            )}
                          />
                          <MiniField
                            label="Adequate Physical Activity"
                            value={bool(
                              resident.personalSocialHistory
                                ?.adequatePhysicalActivity
                            )}
                          />
                          <MiniField
                            label="Sufficient Rest / Sleep"
                            value={bool(
                              resident.personalSocialHistory
                                ?.sufficientRestSleep
                            )}
                          />
                          <MiniField
                            label="Normal Growth & Development"
                            value={bool(
                              resident.personalSocialHistory
                                ?.normalGrowthDevelopment
                            )}
                          />
                          <MiniField
                            label="Multiple Sex Partners"
                            value={bool(
                              resident.personalSocialHistory?.multipleSexPartners
                            )}
                          />
                        </InfoCard>

                        <InfoCard
                          title="Risk Factors"
                          icon={<ShieldIcon className="h-5 w-5" />}
                        >
                          <MiniField
                            label="Smokes Tobacco"
                            value={bool(
                              resident.personalSocialHistory?.smokesTobacco
                            )}
                          />
                          <MiniField
                            label="Packs / Year"
                            value={
                              resident.personalSocialHistory?.tobaccoPacksPerYear
                            }
                          />
                          <MiniField
                            label="Drinks Alcohol"
                            value={bool(
                              resident.personalSocialHistory?.drinksAlcohol
                            )}
                          />
                          <MiniField
                            label="Bottles / Day"
                            value={
                              resident.personalSocialHistory?.alcoholBottlesPerDay
                            }
                          />
                          <MiniField
                            label="Takes Illicit Drugs"
                            value={bool(
                              resident.personalSocialHistory?.takesIllicitDrugs
                            )}
                          />
                          <MiniField
                            label="Drug Details"
                            value={
                              resident.personalSocialHistory?.illicitDrugsDetails
                            }
                          />
                        </InfoCard>
                      </div>
                    </Section>
                  )}
                </div>
              </>
            )}

            {sidebarTab === "digital" && (
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <Section
                  title="Digital ID Card"
                  subtitle="This is the resident's official barangay health digital identification card."
                  icon={<IdCardIcon className="h-5 w-5" />}
                >
                  <DigitalIdCard resident={resident} fullName={fullName} />
                </Section>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function DigitalIdCard({
  resident,
  fullName,
}: {
  resident: ResidentData;
  fullName: string;
}) {
  const qrData = {
    title: "BARANGAY HEALTH DIGITAL ID",
    fullName,
    age: resident.age,
    sex: resident.sex,
    birthDate: resident.birthDate,
    religion: resident.religion,
    civilStatus: resident.civilStatus,
    contactNumber: resident.contactNumber,
    email: resident.email,
    completeAddress: resident.completeAddress,
    barangay: resident.barangayName,
    city: resident.city,
    educationalAttainment: resident.educationalAttainment,
    occupation: resident.occupation,
    verified: resident.isVerified,
  };

  const readablePhone = resident.contactNumber
  ? resident.contactNumber.split("").join(" ")
  : "";

const qrText = [
  "BARANGAY HEALTH DIGITAL ID",
  "",
  `Name: ${formatIdName(resident)}`,
  `Sex: ${resident.sex || ""}`,
  `Birth Date: ${formatDate(resident.birthDate) || ""}`,
  `Age: ${resident.age || ""}`,
  `Civil Status: ${resident.civilStatus || ""}`,
  `Religion: ${resident.religion || ""}`,
  `Occupation: ${resident.occupation || ""}`,
  "",
  "Complete Address:",
  resident.completeAddress || "",
  "",
  `Barangay: ${resident.barangayName || ""}`,
  `City: ${resident.city || ""}`,
  "",
  `Contact Number: ${readablePhone}`,
  `Email: ${resident.email || ""}`,
  "",
  `Educational Attainment: ${resident.educationalAttainment || ""}`,
  `Verified Resident: ${resident.isVerified ? "Yes" : "No"}`,
].join("\n");

const profileUrl = `https://barangay-digital-id-git-public-qr-deploy-jayvescripts-projects.vercel.app/resident/${resident.id}`;

const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
  profileUrl
)}`;


  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-[900px] overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.14)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#F8FBFF_0%,#FFFFFF_45%,#EEF6FF_100%)]" />

        <div className="absolute inset-0 opacity-[0.16]">
          <div className="h-full w-full bg-[repeating-linear-gradient(125deg,rgba(37,99,235,0.16)_0px,rgba(37,99,235,0.16)_1px,transparent_1px,transparent_11px)]" />
        </div>

        <div className="absolute right-20 top-28 opacity-[0.09]">
          <img
            src="/images/davao-logo.png"
            alt="Watermark"
            className="h-64 w-64 rounded-full object-contain"
          />
        </div>

        <div className="absolute -bottom-16 left-0 right-0 h-32 rounded-t-[55%] bg-[#061B49]" />
        <div className="absolute -bottom-9 left-0 right-0 h-28 rounded-t-[58%] border-t-[6px] border-[#D6A53A] bg-[#08265F]" />

        <div className="relative z-10 p-5">
          <div className="mb-5 flex items-center justify-between gap-5">
            <img
              src="/images/davao-logo.png"
              alt="Barangay Logo"
              className="h-28 w-28 shrink-0 rounded-full object-contain"
            />

            <div className="flex-1 text-center">
              <h2 className="text-2xl font-black uppercase tracking-[0.12em] text-[#0B1F4D] md:text-3xl">
                Barangay Health Digital ID
              </h2>
              <div className="mx-auto mt-2 h-[3px] max-w-lg rounded-full bg-blue-600" />
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] bg-white/75 text-blue-600 ring-1 ring-blue-100">
              <HealthLogoIcon className="h-12 w-12" />
            </div>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-[250px_minmax(0,1fr)]">
            <div className="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-sm">
              <img
                src={qrUrl}
                alt="Resident QR Code"
                className="mx-auto h-48 w-48 object-contain"
              />
              <p className="mt-3 text-center text-xs font-semibold text-slate-500">
                Scan to view resident information
              </p>
            </div>

            <div className="p-2">
              <p className="text-sm font-bold text-[#0B1F4D]">
                Last Name, First Name, Middle Name
              </p>

              <h3 className="mt-1 text-2xl font-black uppercase leading-tight tracking-wide text-slate-950">
                {formatIdName(resident)}
              </h3>

              <div className="mt-2 h-px bg-slate-300" />

              <div className="grid grid-cols-[145px_1fr_80px_1fr] items-center border-b border-slate-200 py-3">
                <p className="text-sm font-bold text-blue-700">Nationality</p>
                <p className="text-base font-black uppercase text-slate-950">
                  PHL
                </p>

                <p className="text-sm font-bold text-blue-700">Sex</p>
                <p className="text-base font-black uppercase text-slate-950">
                  {resident.sex}
                </p>
              </div>

              <div className="grid grid-cols-[145px_minmax(0,1fr)] items-center border-b border-slate-200 py-3">
                <p className="text-sm font-bold text-blue-700">Date of Birth</p>
                <p className="text-base font-black text-slate-950">
                  {formatDate(resident.birthDate)}
                </p>
              </div>

              <div className="grid grid-cols-[145px_minmax(0,1fr)] border-b border-slate-200 py-3">
                <p className="text-sm font-bold text-blue-700">Address</p>
                <p className="text-base font-black uppercase leading-6 text-slate-950">
                  {resident.completeAddress}
                </p>
              </div>

              <div className="grid gap-4 py-3 md:grid-cols-3">
                <IdBlock label="Civil Status" value={resident.civilStatus} />
                <IdBlock label="Religion" value={resident.religion} />
                <IdBlock label="Occupation" value={resident.occupation} />
              </div>
            </div>
          </div>

          <p className="relative z-10 mt-4 pb-8 text-xs font-semibold text-slate-500">
            
          </p>
        </div>
      </div>
    </div>
  );
}

function IdLine({ label, value }: { label: string; value: unknown }) {
  if (!hasDisplayValue(value)) return null;

  return (
    <>
      <p className="text-sm font-bold text-blue-700">{label}</p>
      <p className="text-base font-black uppercase text-slate-950">
        {String(value)}
      </p>
    </>
  );
}

function IdBlock({ label, value }: { label: string; value: unknown }) {
  if (!hasDisplayValue(value)) return null;

  return (
    <div>
      <p className="text-sm font-bold text-blue-700">{label}</p>
      <p className="mt-1 text-base font-black uppercase text-slate-950">
        {String(value)}
      </p>
    </div>
  );
}

function IdInfo({
  label,
  value,
  large = false,
}: {
  label: string;
  value: unknown;
  large?: boolean;
}) {
  if (!hasDisplayValue(value)) {
    return null;
  }

  return (
    <div>
      <p className="text-sm font-semibold text-blue-800">{label}</p>
      <p
        className={`mt-1 font-black uppercase text-slate-950 ${
          large ? "text-xl leading-8" : "text-lg"
        }`}
      >
        {String(value)}
      </p>
    </div>
  );
}

function HealthLogoIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M20 34c-6.5 0-11-5-11-11 0-5.5 4.3-10 9.8-10 4 0 7.3 2.3 9 5.6C29.7 15.3 33 13 37 13c5.5 0 9.8 4.5 9.8 10 0 6-4.5 11-11 11H20z"
        fill="#22C55E"
      />
      <circle cx="45" cy="16" r="7" fill="#2563EB" />
      <circle cx="22" cy="14" r="6" fill="#16A34A" />
      <path
        d="M31 28c-10 0-18 8-18 18v5h36v-5c0-10-8-18-18-18z"
        fill="#2563EB"
        opacity="0.95"
      />
      <circle cx="31" cy="29" r="10" fill="white" />
      <path
        d="M31 21v16M23 29h16"
        stroke="#EF4444"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PersonalInfoCard({
  resident,
  fullName,
}: {
  resident: ResidentData;
  fullName: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          <UserIcon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Personal Information
        </h3>
      </div>

      <div className="grid gap-3">
        <MiniField label="Full Name" value={fullName} />

        <div className="grid grid-cols-2 gap-3">
          <MiniField label="Age" value={resident.age} />
          <MiniField label="Sex" value={resident.sex} />
        </div>

        <MiniField
          label="Birthday"
          value={new Date(resident.birthDate).toLocaleDateString()}
        />
        <MiniField label="Religion" value={resident.religion} />
        <MiniField label="Civil Status" value={resident.civilStatus} />
        <MiniField
          label="Educational Attainment"
          value={resident.educationalAttainment}
        />
        <MiniField label="Occupation" value={resident.occupation} />
      </div>
    </div>
  );
}

const tabs = [
  { id: "identifying", label: "Identifying Data" },
  { id: "medical", label: "Past Medical History" },
  { id: "family", label: "Family History" },
  { id: "personal", label: "Personal / Social History" },
];

function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex items-start gap-3">
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const visibleChildren = React.Children.toArray(children).filter((child) => {
    if (!React.isValidElement(child)) return false;
    const props = child.props as { value?: unknown };
    return hasDisplayValue(props.value);
  });

  if (visibleChildren.length === 0) return null;

  return (
    <div className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>

      <div className="grid gap-3">{visibleChildren}</div>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: unknown }) {
  if (!hasDisplayValue(value)) return null;

  const displayValue = String(value).trim();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-words text-[15px] font-semibold text-slate-900">
        {displayValue}
      </p>
    </div>
  );
}

function hasDisplayValue(value: unknown) {
  if (value === null || value === undefined) return false;
  return String(value).trim() !== "";
}

function getStreetOnly(address?: string | null) {
  if (!address) return null;
  return address.split(",")[0]?.trim() || null;
}

function formatDate(date?: string | null) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

function formatIdName(resident: ResidentData) {
  const middle = resident.middleName ? ` ${resident.middleName}` : "";
  return `${resident.lastName}, ${resident.firstName}${middle}`.trim();
}

function bool(value?: boolean | null) {
  if (value === null || value === undefined) return null;
  return value ? "Yes" : "No";
}

function ShieldIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function IdCardIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6.5 16a3.5 3.5 0 0 1 5 0" />
      <path d="M14 10h4" />
      <path d="M14 14h4" />
    </svg>
  );
}

function UserIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function LocationIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MedicalIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v3" />
      <path d="M16 3v3" />
      <path d="M3 8h18" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M12 11v6" />
      <path d="M9 14h6" />
    </svg>
  );
}

function FamilyIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LifestyleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 20h12" />
      <path d="M8 20V10" />
      <path d="M16 20V4" />
      <path d="M12 20v-6" />
    </svg>
  );
}

function VerifiedIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2l2.4 2.1 3.1-.5 1.3 2.8 2.8 1.3-.5 3.1L22 12l-2.1 2.4.5 3.1-2.8 1.3-1.3 2.8-3.1-.5L12 22l-2.4-2.1-3.1.5-1.3-2.8-2.8-1.3.5-3.1L2 12l2.1-2.4-.5-3.1 2.8-1.3 1.3-2.8 3.1.5L12 2zm-1.1 13.6l5.7-5.7-1.4-1.4-4.3 4.3-2-2-1.4 1.4 3.4 3.4z" />
    </svg>
  );
}