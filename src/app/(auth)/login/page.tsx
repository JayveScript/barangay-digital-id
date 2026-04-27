"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Lock,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!identifier.trim() || !password.trim()) {
      setServerError("Username/Email and password required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Login failed.");
        return;
      }

      switch (data.role) {
        case "SUPER_ADMIN":
        case "BARANGAY_ADMIN":
          window.location.href = "/dashboard/admin";
          break;

        case "RESIDENT":
          window.location.href = "/dashboard/resident";
          break;

        case "DOCTOR":
          window.location.href = "/dashboard/doctor";
          break;

        case "NURSE":
          window.location.href = "/dashboard/nurse";
          break;

        case "BHW":
          window.location.href = "/dashboard/bhw";
          break;

        case "STAFF":
          window.location.href = "/dashboard/staff";
          break;

        case "MIDWIFE":
          window.location.href = "/dashboard/midwife";
          break;

        default:
          setServerError("Unknown account role.");
          break;
      }
    } catch (error) {
      console.error("LOGIN_FRONTEND_ERROR", error);
      setServerError("Unable to connect to the login server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EFF6FF] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-xl">
        <section className="relative hidden w-[48%] overflow-hidden lg:flex lg:w-[55%] lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/login-medical-bg.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-blue-950/80" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Secure Health Center Access
              </div>

              <div className="mt-12 max-w-xl">
                <h1 className="text-5xl font-extrabold leading-tight">
                  Barangay Health Centers Management System
                </h1>
                <p className="mt-6 text-xl leading-9 text-sky-50/95">
                  A modern and secure platform for managing patients, health
                  records, consultations, and daily barangay health center
                  operations.
                </p>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <InfoCard
                icon={<HeartPulse className="h-5 w-5" />}
                title="Patient Records"
                text="Securely manage resident consultations, health history, and treatment records."
              />
              <InfoCard
                icon={<Stethoscope className="h-5 w-5" />}
                title="Health Staff Access"
                text="Provide organized access for doctors, nurses, BHWs, and barangay health staff."
              />
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-[#F8FAFC] px-5 py-8 sm:px-8 lg:w-[45%] lg:px-10">
          <div className="w-full max-w-xl">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#0EA5E9] text-white shadow-lg shadow-sky-500/20">
                <HeartPulse className="h-10 w-10" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-5xl font-extrabold text-[#0EA5E9]">
                Welcome
              </h2>
              <p className="mt-3 text-lg text-slate-500">
                Login to your health center account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <Input
                label="Username or Email"
                icon={<User className="h-5 w-5" />}
                value={identifier}
                onChange={setIdentifier}
                placeholder="Enter username or email"
              />

              <Input
                label="Password"
                type="password"
                icon={<Lock className="h-5 w-5" />}
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
              />

              {serverError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {serverError}
                </div>
              )}

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm font-medium text-slate-500 transition hover:text-[#0EA5E9]"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#0EA5E9] px-5 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm font-semibold text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#0EA5E9] hover:text-sky-600"
                >
                  Register Now
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#0EA5E9]">
        {label}
      </label>
      <div className="flex min-h-[54px] items-center rounded-2xl border border-sky-300 bg-white px-4 shadow-sm transition focus-within:border-[#0EA5E9]">
        <span className="mr-3 text-slate-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-3 text-base leading-8 text-sky-50/90">{text}</p>
    </div>
  );
}