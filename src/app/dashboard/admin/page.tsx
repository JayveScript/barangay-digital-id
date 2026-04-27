"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ClipboardList,
  Edit,
  Eye,
  FileText,
  HeartPulse,
  KeyRound,
  LogOut,
  MapPin,
  Phone,
  PieChart as PieChartIcon,
  Save,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ResidentRecord = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  sex: string;
  age: number;
  barangayName: string;
  city?: string | null;
  contactNumber?: string | null;
  religion?: string | null;
  birthDate?: string;
  completeAddress?: string | null;
  civilStatus?: string | null;
  educationalAttainment?: string | null;
  occupation?: string | null;
  accompanyingPerson?: string | null;
  relationship?: string | null;
  spouseMaidenName?: string | null;
  spouseOccupation?: string | null;
  spouseContactNumber?: string | null;
  createdAt: string;
  user?: {
    email?: string | null;
    isVerified: boolean;
  };
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

type StaffUser = {
  id: string;
  fullName?: string;
  username: string;
  role: string;
  createdAt: string;
  barangay?: {
    name: string;
  } | null;
};

type DashboardData = {
  stats: {
    totalResidents: number;
    totalStaff: number;
    totalVerifiedResidents: number;
  };
  residents: ResidentRecord[];
  staffUsers: StaffUser[];
};

type SecureAction = "edit" | "delete" | null;

const chartColors = ["#2563EB", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"];
const STATIC_BARANGAY = "Barangay 19-B";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<
    "overview" | "residents" | "create-user" | "staff-users"
  >("overview");

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedResident, setSelectedResident] = useState<ResidentRecord | null>(
    null
  );
  const [residentModalOpen, setResidentModalOpen] = useState(false);
  const [residentEditMode, setResidentEditMode] = useState(false);
  const [residentEditPassword, setResidentEditPassword] = useState("");
  const [residentModalTab, setResidentModalTab] = useState<
    "identifying" | "medical" | "family" | "personal"
  >("identifying");

  const [secureModalOpen, setSecureModalOpen] = useState(false);
  const [secureAction, setSecureAction] = useState<SecureAction>(null);
  const [secureResident, setSecureResident] = useState<ResidentRecord | null>(
    null
  );
  const [securePassword, setSecurePassword] = useState("");
  const [secureLoading, setSecureLoading] = useState(false);
  const [secureError, setSecureError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "STAFF",
    barangayName: STATIC_BARANGAY,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sexData = useMemo(() => {
    const residents = data?.residents ?? [];

    const male = residents.filter(
      (r) => String(r.sex).toUpperCase() === "MALE"
    ).length;

    const female = residents.filter(
      (r) => String(r.sex).toUpperCase() === "FEMALE"
    ).length;

    return [
      { name: "Male", value: male },
      { name: "Female", value: female },
    ];
  }, [data]);

  const ageGroupData = useMemo(() => {
    const groups: Record<string, number> = {
      "0-12": 0,
      "13-17": 0,
      "18-35": 0,
      "36-59": 0,
      "60+": 0,
    };

    for (const r of data?.residents ?? []) {
      if (r.age <= 12) groups["0-12"]++;
      else if (r.age <= 17) groups["13-17"]++;
      else if (r.age <= 35) groups["18-35"]++;
      else if (r.age <= 59) groups["36-59"]++;
      else groups["60+"]++;
    }

    return Object.entries(groups).map(([name, total]) => ({ name, total }));
  }, [data]);

  const roleData = useMemo(() => {
    const map: Record<string, number> = {};

    for (const u of data?.staffUsers ?? []) {
      map[u.role] = (map[u.role] || 0) + 1;
    }

    return Object.entries(map).map(([name, total]) => ({ name, total }));
  }, [data]);

  const recentResidents = useMemo(() => {
    return [...(data?.residents ?? [])].slice(0, 5);
  }, [data]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setFormLoading(true);

      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          barangayName: STATIC_BARANGAY,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to create user.");
        return;
      }

      setMessage("User created successfully.");

      setForm({
        fullName: "",
        username: "",
        password: "",
        role: "STAFF",
        barangayName: STATIC_BARANGAY,
      });

      fetchDashboard();
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setFormLoading(false);
    }
  };

  const openResidentDetails = (resident: ResidentRecord) => {
    setSelectedResident(resident);
    setResidentEditMode(false);
    setResidentEditPassword("");
    setResidentModalTab("identifying");
    setResidentModalOpen(true);
  };

  const openSecureModal = (resident: ResidentRecord, action: SecureAction) => {
    setSecureResident(resident);
    setSecureAction(action);
    setSecurePassword("");
    setSecureError("");
    setSecureModalOpen(true);
  };

  const closeSecureModal = () => {
    if (secureLoading) return;

    setSecureModalOpen(false);
    setSecureResident(null);
    setSecureAction(null);
    setSecurePassword("");
    setSecureError("");
  };

  const confirmSecureAction = async () => {
  if (!secureResident || !secureAction) return;

  if (!securePassword.trim()) {
    setSecureError("Admin password is required.");
    return;
  }

  try {
    setSecureLoading(true);
    setSecureError("");

    const verifyRes = await fetch("/api/admin/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: securePassword,
      }),
    });

    const verifyJson = await readJsonSafe(verifyRes);

    if (!verifyRes.ok) {
      setSecureError(verifyJson.error || "Invalid admin password.");
      return;
    }

    if (secureAction === "edit") {
      setSelectedResident(secureResident);
      setResidentEditPassword(securePassword);
      setResidentEditMode(true);
      setResidentModalTab("identifying");
      setResidentModalOpen(true);
      closeSecureModal();
      return;
    }

    const deleteRes = await fetch(`/api/residents/${secureResident.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: securePassword,
      }),
    });

    const deleteJson = await readJsonSafe(deleteRes);

    if (!deleteRes.ok) {
      setSecureError(deleteJson.error || "Failed to delete resident.");
      return;
    }

    closeSecureModal();
    await fetchDashboard();
  } catch (err) {
    console.error(err);
    setSecureError("Unable to connect to the server.");
  } finally {
    setSecureLoading(false);
  }
};
  return (
    <main className="h-screen overflow-hidden bg-[#EFF6FF] p-4 sm:p-6">
      <div className="mx-auto flex h-full max-w-7xl gap-6">
        <aside className="hidden h-full w-[240px] shrink-0 rounded-[28px] bg-gradient-to-b from-[#0F172A] to-[#1E3A8A] p-5 text-white shadow-xl lg:block">
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <HeartPulse className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold">Health Portal</h2>
                <p className="text-sm text-white/70">Admin Navigation</p>
              </div>
            </div>

            <div className="space-y-3">
              <SidebarButton
                active={tab === "overview"}
                icon={<Activity className="h-5 w-5" />}
                label="Overview"
                onClick={() => setTab("overview")}
              />

              <SidebarButton
                active={tab === "residents"}
                icon={<Users className="h-5 w-5" />}
                label="Registered Residents"
                onClick={() => setTab("residents")}
              />

              <SidebarButton
                active={tab === "create-user"}
                icon={<UserPlus className="h-5 w-5" />}
                label="Create User"
                onClick={() => setTab("create-user")}
              />

              <SidebarButton
                active={tab === "staff-users"}
                icon={<Stethoscope className="h-5 w-5" />}
                label="Staff Users"
                onClick={() => setTab("staff-users")}
              />
            </div>
          </div>
        </aside>

        <div className="h-full flex-1 overflow-y-auto">
          <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="mb-5 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DBEAFE] text-2xl font-bold text-[#2563EB]">
                    AD
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl font-extrabold text-slate-900">
                        BARANGAY ADMIN
                      </h1>

                      <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified Admin
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage residents and health center users
                    </p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await fetch("/api/logout", { method: "POST" });
                    window.location.href = "/login";
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading dashboard...</p>
            ) : (
              <>
                {tab === "overview" && (
                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-3">
                      <StatCard
                        icon={<Users className="h-5 w-5" />}
                        label="Total Residents"
                        value={data?.stats.totalResidents ?? 0}
                      />

                      <StatCard
                        icon={<ShieldCheck className="h-5 w-5" />}
                        label="Verified Residents"
                        value={data?.stats.totalVerifiedResidents ?? 0}
                      />

                      <StatCard
                        icon={<Stethoscope className="h-5 w-5" />}
                        label="Health Staff Users"
                        value={data?.stats.totalStaff ?? 0}
                      />
                    </div>

                    <div className="grid gap-5 xl:grid-cols-2">
                      <ChartCard
                        icon={<PieChartIcon className="h-5 w-5" />}
                        title="Resident Sex Distribution"
                        subtitle="Current registered resident demographics"
                      >
                        <ResponsiveContainer width="100%" height={240}>
                          <PieChart>
                            <Pie
                              data={sexData}
                              cx="50%"
                              cy="50%"
                              outerRadius={78}
                              dataKey="value"
                              nameKey="name"
                              label
                            >
                              {sexData.map((_, index) => (
                                <Cell
                                  key={index}
                                  fill={chartColors[index % chartColors.length]}
                                />
                              ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartCard>

                      <ChartCard
                        icon={<Users className="h-5 w-5" />}
                        title="Age Group Distribution"
                        subtitle="Resident population by age group"
                      >
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={ageGroupData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                              {ageGroupData.map((_, index) => (
                                <Cell
                                  key={index}
                                  fill={chartColors[index % chartColors.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartCard>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                      <ChartCard
                        icon={<Activity className="h-5 w-5" />}
                        title="Recent Registered Residents"
                        subtitle="Latest verified resident accounts"
                      >
                        <div className="space-y-3">
                          {recentResidents.map((resident) => (
                            <div
                              key={resident.id}
                              className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-4"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900">
                                  {resident.firstName} {resident.lastName}
                                </p>

                                <p className="truncate text-sm text-slate-500">
                                  {resident.barangayName} • {resident.age} years
                                  old
                                </p>
                              </div>

                              <span className="ml-3 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                {resident.user?.isVerified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </ChartCard>

                      <ChartCard
                        icon={<Stethoscope className="h-5 w-5" />}
                        title="Staff Role Distribution"
                        subtitle="Created health center user accounts"
                      >
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={roleData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                              dataKey="total"
                              fill="#2563EB"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartCard>
                    </div>
                  </div>
                )}

                {tab === "residents" && (
                  <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
                        <ClipboardList className="h-6 w-6" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          Registered Residents
                        </h2>

                        <p className="text-sm text-slate-500">
                          View, edit, or delete registered resident accounts.
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full border-separate border-spacing-y-2">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-3">Resident Name</th>
                            <th className="px-3">Sex</th>
                            <th className="px-3">Age</th>
                            <th className="px-3">City</th>
                            <th className="px-3">Contact</th>
                            <th className="px-3">Status</th>
                            <th className="px-3 text-center">Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {data?.residents.map((resident) => (
                            <tr key={resident.id} className="bg-[#F8FAFC] shadow-sm">
                              <td className="rounded-l-2xl px-3 py-3 font-semibold text-slate-900">
                                <span className="block max-w-[230px] truncate whitespace-nowrap">
                                  {resident.firstName} {resident.middleName ?? ""}{" "}
                                  {resident.lastName}
                                </span>
                              </td>

                              <td className="px-3 py-3 text-sm text-slate-600">
                                {resident.sex}
                              </td>

                              <td className="px-3 py-3 text-sm text-slate-600">
                                {resident.age}
                              </td>

                              <td className="px-3 py-3 text-sm text-slate-600">
                                {resident.city || "—"}
                              </td>

                              <td className="px-3 py-3 text-sm text-slate-600">
                                {resident.contactNumber || "—"}
                              </td>

                              <td className="px-3 py-3">
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                  {resident.user?.isVerified ? "Verified" : "Pending"}
                                </span>
                              </td>

                              <td className="rounded-r-2xl px-3 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <IconActionButton
                                    label="View Details"
                                    icon={<Eye className="h-4 w-4" />}
                                    onClick={() => openResidentDetails(resident)}
                                  />

                                  <IconActionButton
                                    label="Edit Resident"
                                    icon={<Edit className="h-4 w-4" />}
                                    variant="warning"
                                    onClick={() => openSecureModal(resident, "edit")}
                                  />

                                  <IconActionButton
                                    label="Delete Resident"
                                    icon={<Trash2 className="h-4 w-4" />}
                                    variant="danger"
                                    onClick={() =>
                                      openSecureModal(resident, "delete")
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tab === "create-user" && (
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
                          <UserPlus className="h-6 w-6" />
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">
                            Create User
                          </h2>

                          <p className="text-sm text-slate-500">
                            Add a new staff, doctor, BHW, nurse, or midwife account.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input
                            label="Full Name"
                            value={form.fullName}
                            onChange={(v) =>
                              setForm((p) => ({ ...p, fullName: v }))
                            }
                          />

                          <Input
                            label="Username"
                            value={form.username}
                            onChange={(v) =>
                              setForm((p) => ({ ...p, username: v }))
                            }
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <Input
                            label="Password"
                            type="password"
                            value={form.password}
                            onChange={(v) =>
                              setForm((p) => ({ ...p, password: v }))
                            }
                          />

                          <Select
                            label="Role"
                            value={form.role}
                            onChange={(v) => setForm((p) => ({ ...p, role: v }))}
                            options={["STAFF", "DOCTOR", "BHW", "NURSE", "MIDWIFE"]}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <ReadonlyBadgeInput
                            label="Barangay"
                            value={STATIC_BARANGAY}
                          />
                        </div>

                        {error && (
                          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                          </div>
                        )}

                        {message && (
                          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {message}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={formLoading}
                          className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                          {formLoading ? "Creating..." : "Create User"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {tab === "staff-users" && (
                  <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
                        <Stethoscope className="h-6 w-6" />
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          Existing Staff Users
                        </h2>

                        <p className="text-sm text-slate-500">
                          View all staff, doctor, BHW, nurse, and midwife accounts.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {data?.staffUsers.map((user) => (
                        <div
                          key={user.id}
                          className="rounded-[24px] border border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-lg font-bold text-slate-900">
                                {user.fullName}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Barangay 19-B
                              </p>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-sm">
                              <UserRound className="h-5 w-5" />
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-between">
                            <span className="inline-flex rounded-full bg-[#2563EB] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {residentModalOpen && selectedResident && (
        <ResidentDetailsModal
          resident={selectedResident}
          activeTab={residentModalTab}
          editMode={residentEditMode}
          editPassword={residentEditPassword}
          onTabChange={setResidentModalTab}
          onSaved={async () => {
            setResidentModalOpen(false);
            setSelectedResident(null);
            setResidentEditMode(false);
            setResidentEditPassword("");
            await fetchDashboard();
          }}
          onClose={() => {
            setResidentModalOpen(false);
            setSelectedResident(null);
            setResidentEditMode(false);
            setResidentEditPassword("");
          }}
        />
      )}

      {secureModalOpen && secureResident && (
        <PasswordConfirmModal
          action={secureAction}
          password={securePassword}
          loading={secureLoading}
          error={secureError}
          onPasswordChange={setSecurePassword}
          onCancel={closeSecureModal}
          onConfirm={confirmSecureAction}
        />
      )}
    </main>
  );
}

function SidebarButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-semibold transition ${
        active
          ? "bg-[#2563EB] text-white"
          : "bg-white/0 text-white/80 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function IconActionButton({
  icon,
  label,
  variant = "primary",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "warning" | "danger";
  onClick: () => void;
}) {
  const color =
    variant === "danger"
      ? "bg-red-50 text-red-600 hover:bg-red-100"
      : variant === "warning"
      ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
      : "bg-blue-50 text-blue-600 hover:bg-blue-100";

  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${color}`}
    >
      {icon}
    </button>
  );
}

function PasswordConfirmModal({
  action,
  password,
  loading,
  error,
  onPasswordChange,
  onCancel,
  onConfirm,
}: {
  action: SecureAction;
  password: string;
  loading: boolean;
  error: string;
  onPasswordChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.30)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <KeyRound className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Enter Password
            </h2>

            <p className="text-sm text-slate-500">
              Required before you can {action === "delete" ? "delete" : "edit"} this resident.
            </p>
          </div>
        </div>

        <Input
          label="Admin Password"
          type="password"
          value={password}
          onChange={onPasswordChange}
        />

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
              action === "delete"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#2563EB] hover:bg-blue-700"
            }`}
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
        {icon}
      </div>

      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function ChartCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[52px] w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#2563EB]"
      />
    </div>
  );
}

function ReadonlyBadgeInput({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <div className="flex min-h-[52px] items-center rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] px-4">
        <span className="inline-flex rounded-full bg-[#2563EB] px-3 py-1 text-sm font-semibold text-white shadow-sm">
          {value}
        </span>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[52px] w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#2563EB]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResidentDetailsModal({
  resident,
  activeTab,
  editMode,
  editPassword,
  onTabChange,
  onSaved,
  onClose,
}: {
  resident: ResidentRecord;
  activeTab: "identifying" | "medical" | "family" | "personal";
  editMode: boolean;
  editPassword: string;
  onTabChange: (
    tab: "identifying" | "medical" | "family" | "personal"
  ) => void;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const [editForm, setEditForm] = useState({
    firstName: resident.firstName ?? "",
    lastName: resident.lastName ?? "",
    middleName: resident.middleName ?? "",
    age: String(resident.age ?? ""),
    sex: resident.sex ?? "",
    birthDate: resident.birthDate ? resident.birthDate.slice(0, 10) : "",
    religion: resident.religion ?? "",
    civilStatus: resident.civilStatus ?? "",
    educationalAttainment: resident.educationalAttainment ?? "",
    occupation: resident.occupation ?? "",
    contactNumber: resident.contactNumber ?? "",
    email: resident.user?.email ?? "",
    accompanyingPerson: resident.accompanyingPerson ?? "",
    relationship: resident.relationship ?? "",
    spouseMaidenName: resident.spouseMaidenName ?? "",
    spouseOccupation: resident.spouseOccupation ?? "",
    spouseContactNumber: resident.spouseContactNumber ?? "",
    completeAddress: resident.completeAddress ?? "",
    barangayName: resident.barangayName ?? "",
    city: resident.city ?? "",
  });

  const fullName = `${editForm.firstName} ${editForm.middleName ?? ""} ${editForm.lastName}`
    .replace(/\s+/g, " ")
    .trim();

  const update = (key: keyof typeof editForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveResident = async () => {
    try {
      setSaving(true);
      setModalError("");

      const res = await fetch(`/api/residents/${resident.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: editPassword,
          ...editForm,
          age: Number(editForm.age),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setModalError(json.error || "Failed to update resident.");
        return;
      }

      onSaved();
    } catch (err) {
      console.error(err);
      setModalError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-[#F8FBFF] via-white to-[#F8FBFF] px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {fullName || "Resident Details"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editMode
                  ? "Edit resident registration information"
                  : "Full resident registration information"}
              </p>
            </div>

            <div className="flex gap-2">
              {editMode && (
                <button
                  type="button"
                  onClick={saveResident}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <ModalTabButton
              active={activeTab === "identifying"}
              label="Identifying Data"
              onClick={() => onTabChange("identifying")}
            />

            <ModalTabButton
              active={activeTab === "medical"}
              label="Past Medical History"
              onClick={() => onTabChange("medical")}
            />

            <ModalTabButton
              active={activeTab === "family"}
              label="Family History"
              onClick={() => onTabChange("family")}
            />

            <ModalTabButton
              active={activeTab === "personal"}
              label="Personal / Social History"
              onClick={() => onTabChange("personal")}
            />
          </div>

          {modalError && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {modalError}
            </div>
          )}
        </div>

        <div className="max-h-[72vh] overflow-y-auto bg-[#F8FAFC] p-6 sm:p-7">
          {activeTab === "identifying" && (
            <div className="grid gap-6 xl:grid-cols-3">
              <InfoSection
                icon={<UserRound className="h-5 w-5" />}
                title="Personal Information"
              >
                <InfoRow label="Full Name" value={fullName} />

                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Age"
                    value={editForm.age}
                    editMode={editMode}
                    onChange={(v) => update("age", v)}
                  />

                  <InfoRow
                    label="Sex"
                    value={editForm.sex}
                    editMode={editMode}
                    onChange={(v) => update("sex", v)}
                  />
                </div>

                <InfoRow
                  label="Birthday"
                  value={editForm.birthDate}
                  editMode={editMode}
                  type="date"
                  onChange={(v) => update("birthDate", v)}
                />

                <InfoRow
                  label="Religion"
                  value={editForm.religion}
                  editMode={editMode}
                  onChange={(v) => update("religion", v)}
                />

                <InfoRow
                  label="Civil Status"
                  value={editForm.civilStatus}
                  editMode={editMode}
                  onChange={(v) => update("civilStatus", v)}
                />

                <InfoRow
                  label="Educational Attainment"
                  value={editForm.educationalAttainment}
                  editMode={editMode}
                  onChange={(v) => update("educationalAttainment", v)}
                />

                <InfoRow
                  label="Occupation"
                  value={editForm.occupation}
                  editMode={editMode}
                  onChange={(v) => update("occupation", v)}
                />
              </InfoSection>

              <InfoSection icon={<Phone className="h-5 w-5" />} title="Contacts">
                <InfoRow
                  label="Contact No."
                  value={editForm.contactNumber}
                  editMode={editMode}
                  onChange={(v) => update("contactNumber", v)}
                />

                <InfoRow
                  label="Email"
                  value={editForm.email}
                  editMode={editMode}
                  onChange={(v) => update("email", v)}
                />

                <InfoRow
                  label="Accompanying Person"
                  value={editForm.accompanyingPerson}
                  editMode={editMode}
                  onChange={(v) => update("accompanyingPerson", v)}
                />

                <InfoRow
                  label="Relationship"
                  value={editForm.relationship}
                  editMode={editMode}
                  onChange={(v) => update("relationship", v)}
                />

                <InfoRow
                  label="Spouse Maiden Name"
                  value={editForm.spouseMaidenName}
                  editMode={editMode}
                  onChange={(v) => update("spouseMaidenName", v)}
                />

                <InfoRow
                  label="Spouse Occupation"
                  value={editForm.spouseOccupation}
                  editMode={editMode}
                  onChange={(v) => update("spouseOccupation", v)}
                />

                <InfoRow
                  label="Spouse Contact No."
                  value={editForm.spouseContactNumber}
                  editMode={editMode}
                  onChange={(v) => update("spouseContactNumber", v)}
                />
              </InfoSection>

              <InfoSection icon={<MapPin className="h-5 w-5" />} title="Address">
  <InfoRow
    label="Street"
    value={editForm.completeAddress?.split(",")[0] || "—"}
    editMode={editMode}
    onChange={(v) => update("completeAddress", v)}
  />
                <InfoRow
                  label="Barangay"
                  value={editForm.barangayName}
                  editMode={editMode}
                  onChange={(v) => update("barangayName", v)}
                />

                <InfoRow
                  label="City"
                  value={editForm.city}
                  editMode={editMode}
                  onChange={(v) => update("city", v)}
                />
              </InfoSection>
            </div>
          )}

          {activeTab === "medical" && (
            <div className="grid gap-6 xl:grid-cols-3">
              <InfoSection
                icon={<HeartPulse className="h-5 w-5" />}
                title="Conditions"
              >
                <InfoRow
                  label="Hypertension"
                  value={yesNo(resident.medicalHistory?.hasHypertension)}
                />
                <InfoRow
                  label="Diabetes"
                  value={yesNo(resident.medicalHistory?.hasDiabetes)}
                />
                <InfoRow
                  label="STI / HIV"
                  value={yesNo(resident.medicalHistory?.hasStiHiv)}
                />
                <InfoRow
                  label="Heart Disease"
                  value={yesNo(resident.medicalHistory?.hasHeartDisease)}
                />
                <InfoRow
                  label="Kidney Failure"
                  value={yesNo(resident.medicalHistory?.hasKidneyFailure)}
                />
                <InfoRow
                  label="Tuberculosis"
                  value={yesNo(resident.medicalHistory?.hasTuberculosis)}
                />
              </InfoSection>

              <InfoSection
                icon={<ClipboardList className="h-5 w-5" />}
                title="Details"
              >
                <InfoRow
                  label="Has Allergies"
                  value={yesNo(resident.medicalHistory?.hasAllergies)}
                />
                <InfoRow
                  label="Allergies Details"
                  value={resident.medicalHistory?.allergiesDetails}
                  multiline
                />
                <InfoRow
                  label="Has Cancer"
                  value={yesNo(resident.medicalHistory?.hasCancer)}
                />
                <InfoRow
                  label="Cancer Details"
                  value={resident.medicalHistory?.cancerDetails}
                  multiline
                />
                <InfoRow
                  label="Other Conditions"
                  value={yesNo(resident.medicalHistory?.hasOtherConditions)}
                />
                <InfoRow
                  label="Other Conditions Details"
                  value={resident.medicalHistory?.otherConditionsDetails}
                  multiline
                />
              </InfoSection>

              <InfoSection
                icon={<FileText className="h-5 w-5" />}
                title="Medication / Surgeries"
              >
                <InfoRow
                  label="Maintenance Medications"
                  value={resident.medicalHistory?.maintenanceMedications}
                  multiline
                />
                <InfoRow
                  label="Previous Illnesses / Surgeries"
                  value={resident.medicalHistory?.previousIllnessesSurgeries}
                  multiline
                />
              </InfoSection>
            </div>
          )}

          {activeTab === "family" && (
            <div className="grid gap-6 xl:grid-cols-3">
              <InfoSection icon={<Users className="h-5 w-5" />} title="Family History">
                <InfoRow
                  label="Asthma / Allergies"
                  value={yesNo(resident.familyHistory?.asthmaAllergies)}
                />
                <InfoRow
                  label="Birth Defects"
                  value={yesNo(resident.familyHistory?.birthDefects)}
                />
                <InfoRow
                  label="Cancer"
                  value={yesNo(resident.familyHistory?.cancer)}
                />
                <InfoRow
                  label="Dementia"
                  value={yesNo(resident.familyHistory?.dementia)}
                />
                <InfoRow
                  label="Diabetes"
                  value={yesNo(resident.familyHistory?.diabetes)}
                />
                <InfoRow
                  label="Hypertension"
                  value={yesNo(resident.familyHistory?.hypertension)}
                />
                <InfoRow
                  label="Kidney Disease"
                  value={yesNo(resident.familyHistory?.kidneyDisease)}
                />
                <InfoRow
                  label="Mental Illness"
                  value={yesNo(resident.familyHistory?.mentalIllness)}
                />
              </InfoSection>
            </div>
          )}

          {activeTab === "personal" && (
            <div className="grid gap-6 xl:grid-cols-3">
              <InfoSection
                icon={<Activity className="h-5 w-5" />}
                title="Lifestyle Information"
              >
                <InfoRow
                  label="Eats Healthy Diet"
                  value={yesNo(resident.personalSocialHistory?.eatsHealthyDiet)}
                />
                <InfoRow
                  label="Adequate Physical Activity"
                  value={yesNo(
                    resident.personalSocialHistory?.adequatePhysicalActivity
                  )}
                />
                <InfoRow
                  label="Sufficient Rest / Sleep"
                  value={yesNo(resident.personalSocialHistory?.sufficientRestSleep)}
                />
                <InfoRow
                  label="Normal Growth & Development"
                  value={yesNo(
                    resident.personalSocialHistory?.normalGrowthDevelopment
                  )}
                />
                <InfoRow
                  label="Multiple Sex Partners"
                  value={yesNo(resident.personalSocialHistory?.multipleSexPartners)}
                />
              </InfoSection>

              <InfoSection
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Risk Factors"
              >
                <InfoRow
                  label="Smokes Tobacco"
                  value={yesNo(resident.personalSocialHistory?.smokesTobacco)}
                />
                <InfoRow
                  label="Tobacco Packs / Year"
                  value={resident.personalSocialHistory?.tobaccoPacksPerYear}
                />
                <InfoRow
                  label="Drinks Alcohol"
                  value={yesNo(resident.personalSocialHistory?.drinksAlcohol)}
                />
                <InfoRow
                  label="Alcohol Bottles / Day"
                  value={resident.personalSocialHistory?.alcoholBottlesPerDay}
                />
                <InfoRow
                  label="Takes Illicit Drugs"
                  value={yesNo(resident.personalSocialHistory?.takesIllicitDrugs)}
                />
                <InfoRow
                  label="Illicit Drugs Details"
                  value={resident.personalSocialHistory?.illicitDrugsDetails}
                  multiline
                />
              </InfoSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const hasVisibleContent = hasVisibleReactContent(children);

  if (!hasVisibleContent) {
    return null;
  }

  return (
    <section className="rounded-[30px] border border-slate-200 bg-[#F8FBFF] p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-blue-100 bg-[#EAF3FF] text-[#2563EB] shadow-sm">
          {icon}
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h3>
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ModalTabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
        active
          ? "bg-[#2563EB] text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function InfoRow({
  label,
  value,
  multiline = false,
  editMode = false,
  type = "text",
  onChange,
}: {
  label: string;
  value: unknown;
  multiline?: boolean;
  editMode?: boolean;
  type?: string;
  onChange?: (value: string) => void;
}) {
  if (!editMode && !hasDisplayValue(value)) {
    return null;
  }

  const displayValue = hasDisplayValue(value) ? String(value) : "";

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      {editMode && onChange ? (
        multiline ? (
          <textarea
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#2563EB]"
          />
        ) : (
          <input
            type={type}
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[46px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#2563EB]"
          />
        )
      ) : (
        <p
          className={`font-semibold text-slate-900 ${
            multiline
              ? "whitespace-pre-wrap break-words text-[0.95rem] leading-7"
              : "text-[0.95rem] leading-7"
          }`}
        >
          {displayValue}
        </p>
      )}
    </div>
  );
}

function hasVisibleReactContent(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) {
      return hasDisplayValue(child);
    }

    const props = child.props as {
      value?: unknown;
      editMode?: boolean;
      children?: React.ReactNode;
    };

    if (props.editMode) return true;

    if ("value" in props) {
      return hasDisplayValue(props.value);
    }

    if (props.children) {
      return hasVisibleReactContent(props.children);
    }

    return false;
  });
}

function hasDisplayValue(value: unknown) {
  if (value === null || value === undefined) return false;

  const text = String(value).trim();

  return text !== "" && text !== "—";
}

function yesNo(value?: boolean | null) {
  if (value === null || value === undefined) return null;
  return value ? "Yes" : "No";
}

async function readJsonSafe(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      error:
        "API route returned HTML instead of JSON. Check your backend route or terminal error.",
    };
  }
}