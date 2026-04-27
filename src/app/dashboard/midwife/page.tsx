"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Baby,
  BarChart3,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  LogOut,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

type MidwifeUser = {
  id: string;
  fullName: string;
  username: string;
  role: "MIDWIFE";
  email?: string | null;
  phoneNumber?: string | null;
  isVerified: boolean;
  barangay?: {
    name: string;
  } | null;
  createdAt: string;
};

export default function MidwifeDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "personal">(
    "overview"
  );
  const [user, setUser] = useState<MidwifeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();

        if (!res.ok || data.role !== "MIDWIFE") {
          window.location.href = "/login";
          return;
        }

        setUser(data);
      } catch (error) {
        console.error("MIDWIFE_DASHBOARD_ERROR", error);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const initials = useMemo(() => {
    if (!user?.fullName) return "MW";
    return user.fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase())
      .join("");
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="h-screen overflow-hidden bg-[#EFF6FF] p-6">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-[#E5E7EB] bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">Loading Midwife dashboard...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="h-screen overflow-hidden bg-[#EFF6FF] p-4 sm:p-6">
      <div className="mx-auto flex h-full max-w-7xl gap-6 overflow-hidden">
        <aside className="hidden h-full w-[240px] shrink-0 rounded-[28px] bg-gradient-to-b from-[#0F172A] to-[#1E3A8A] p-5 text-white shadow-xl lg:block">
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Health Portal</h2>
                <p className="text-sm text-white/70">Midwife Dashboard</p>
              </div>
            </div>

            <div className="space-y-3">
              <SidebarButton
                active={activeTab === "overview"}
                icon={<Activity className="h-5 w-5" />}
                label="Overview"
                onClick={() => setActiveTab("overview")}
              />
              <SidebarButton
                active={activeTab === "personal"}
                icon={<UserRound className="h-5 w-5" />}
                label="Personal Info"
                onClick={() => setActiveTab("personal")}
              />
            </div>
          </div>
        </aside>

        <section className="h-full flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="sticky top-0 z-10 mb-6 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC]/95 p-5 backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DBEAFE] text-2xl font-extrabold text-[#2563EB]">
                    {initials}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-extrabold text-slate-900">
                        Midwife Dashboard
                      </h1>

                      <span className="rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white">
                        MIDWIFE
                      </span>

                      {user.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified Account
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm uppercase tracking-wide text-slate-500">
                      {user.fullName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>

            {activeTab === "overview" && <OverviewTab />}

            {activeTab === "personal" && (
              <PersonalInfoTab user={user} initials={initials} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-5 pb-4">
      <div className="grid items-start gap-4 md:grid-cols-4">
        <MetricCard
          icon={<Users className="h-5 w-5" />}
          label="Mothers Monitored"
          value="28"
        />
        <MetricCard
          icon={<Baby className="h-5 w-5" />}
          label="Newborn Records"
          value="12"
        />
        <MetricCard
          icon={<ClipboardList className="h-5 w-5" />}
          label="Prenatal Follow-ups"
          value="17"
        />
        <MetricCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Scheduled Visits"
          value="9"
        />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <Panel
          icon={<BarChart3 className="h-5 w-5" />}
          title="Maternal Health Activity"
          subtitle="Monthly midwife service progress"
        >
          <div className="space-y-5">
            <ProgressBar label="Prenatal Monitoring" value={86} />
            <ProgressBar label="Postnatal Follow-ups" value={72} />
            <ProgressBar label="Newborn Record Updates" value={68} />
            <ProgressBar label="Family Planning Support" value={55} />
          </div>
        </Panel>

        <Panel
          icon={<Activity className="h-5 w-5" />}
          title="Midwife Service Analytics"
          subtitle="Current maternal health workload summary"
        >
          <div className="grid items-start gap-4 md:grid-cols-2">
            <MiniStat label="High-Risk Cases" value="4" />
            <MiniStat label="Pending Visits" value="9" />
            <MiniStat label="Completed Checkups" value="31" />
            <MiniStat label="Updated Records" value="44" />
          </div>
        </Panel>
      </div>

      <Panel
        icon={<HeartPulse className="h-5 w-5" />}
        title="Maternal Health Summary"
        subtitle="Barangay 19-B midwife monitoring overview"
      >
        <div className="grid items-start gap-4 md:grid-cols-4">
          <SummaryBox title="Pregnant Residents" value="7" />
          <SummaryBox title="Postpartum Mothers" value="6" />
          <SummaryBox title="Infant Follow-ups" value="12" />
          <SummaryBox title="Reports Prepared" value="8" />
        </div>
      </Panel>
    </div>
  );
}

function PersonalInfoTab({
  user,
  initials,
}: {
  user: MidwifeUser;
  initials: string;
}) {
  return (
    <div className="space-y-5 pb-4">
      <Panel
        icon={<UserRound className="h-5 w-5" />}
        title="Personal Information"
        subtitle="Your midwife account details"
      >
        <div className="mb-5 flex items-center gap-4 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB] text-2xl font-extrabold text-white">
            {initials}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user.fullName}</h3>
            <p className="text-sm text-slate-500">Midwife</p>
          </div>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InfoBox label="Full Name" value={user.fullName} />
          <InfoBox label="Username" value={user.username} />
          <InfoBox label="Role" value={user.role} />
          <InfoBox label="Email" value={user.email || "Not set"} />
          <InfoBox label="Phone Number" value={user.phoneNumber || "Not set"} />
          <InfoBox
            label="Barangay"
            value={user.barangay?.name || "Barangay 19-B"}
          />
          <InfoBox
            label="Verification Status"
            value={user.isVerified ? "Verified" : "Pending"}
          />
          <InfoBox
            label="Account Created"
            value={new Date(user.createdAt).toLocaleDateString()}
          />
        </div>
      </Panel>
    </div>
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
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left text-sm font-semibold transition ${
        active
          ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
          : "text-white/80 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function Panel({
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
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
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

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold text-[#2563EB]">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#DBEAFE]">
        <div
          className="h-full rounded-full bg-[#2563EB]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-[#2563EB]">{value}</p>
    </div>
  );
}

function SummaryBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#BFDBFE] bg-gradient-to-br from-white to-[#EFF6FF] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4 shadow-sm">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}