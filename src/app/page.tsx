"use client";

import Link from "next/link";
import {
  Activity,
  Heart,
  Shield,
  Stethoscope,
  Zap,
  BarChart3,
  Lock,
  Globe,
  CheckCircle2,
} from "lucide-react";

const roles = [
  {
    id: "patient",
    title: "Patient",
    subtitle: "Personal Health Dashboard",
    description:
      "Monitor your real-time vitals, track your Health Score, earn Status Points, and receive AI-powered health insights from your JIVA Smart Ring.",
    icon: Heart,
    href: "/patient",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    features: [
      "Real-time ECG, PPG & SpO₂",
      "AI Health Score (0–100)",
      "Status Points & Tier Rewards",
      "Sleep & Activity Analytics",
    ],
    badge: "For Patients",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "provider",
    title: "Healthcare Provider",
    subtitle: "Clinical Monitoring Dashboard",
    description:
      "Access patient biosignal data, review AI-flagged anomalies, generate referrals, and monitor your patient cohort's health outcomes in real time.",
    icon: Stethoscope,
    href: "/provider",
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    features: [
      "Patient Risk Stratification",
      "Anomaly & Alert Triage",
      "FHIR Data Export",
      "Telemedicine Integration",
    ],
    badge: "For Doctors & Clinicians",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "insurer",
    title: "Insurer",
    subtitle: "Population Health & Risk Dashboard",
    description:
      "Analyse population health trends, monitor pilot KPIs, manage wellness-linked premium adjustments, and project claims savings across your enrolled members.",
    icon: Shield,
    href: "/insurer",
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    borderColor: "border-violet-200",
    features: [
      "Population Risk Scoring",
      "Wellness Compliance Tracking",
      "Claims Cost Projections",
      "Pilot KPI Monitoring (500 users)",
    ],
    badge: "For Insurance Partners",
    badgeColor: "bg-violet-100 text-violet-800",
  },
];

const stats = [
  { label: "Biosignals Tracked", value: "6+", icon: Activity },
  { label: "Health Score Accuracy", value: "≥90%", icon: BarChart3 },
  { label: "Ring Battery Life", value: "72h", icon: Zap },
  { label: "Data Encrypted", value: "AES-256", icon: Lock },
  { label: "Global Compliance", value: "HIPAA + ODPC", icon: Globe },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">JIVA</span>
            <span className="ml-2 text-xs font-medium text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full border border-teal-400/20">
              APHP v0.1 MVP
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Pilot Mode · 500 Users</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-teal-300 text-sm font-medium">
            AI-Powered Pro-Active Healthcare Program
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Your Health.
          <br />
          <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Predicted. Protected.
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          The JIVA Smart Health Ring continuously monitors ECG, PPG, HRV, SpO₂,
          temperature, and bio-impedance — delivering clinical-grade insights to
          patients, providers, and insurers.
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5"
            >
              <s.icon className="w-4 h-4 text-teal-400" />
              <span className="text-white font-bold text-sm">{s.value}</span>
              <span className="text-slate-400 text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {roles.map((role) => (
            <Link key={role.id} href={role.href} className="group block">
              <div
                className={`relative bg-white rounded-2xl border ${role.borderColor} p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full`}
              >
                {/* Top gradient bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${role.gradient}`}
                />

                {/* Badge */}
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${role.badgeColor}`}
                >
                  {role.badge}
                </span>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${role.bgLight} flex items-center justify-center mb-5`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.gradient} flex items-center justify-center`}
                  >
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {role.title}
                </h2>
                <p className="text-sm font-medium text-slate-500 mb-3">
                  {role.subtitle}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {role.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${role.gradient} text-white text-sm font-semibold text-center group-hover:opacity-90 transition-opacity`}
                >
                  Open {role.title} Dashboard →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">
          © 2025 JIVA Healthcare · AI-Powered Pro-Active Healthcare Program
        </p>
        <div className="flex gap-6 text-slate-500 text-xs">
          <span>HIPAA Aligned</span>
          <span>ODPC (Kenya) Compliant</span>
          <span>SOC 3 Ready</span>
          <span>ISO 13485 QMS</span>
        </div>
      </footer>
    </div>
  );
}
