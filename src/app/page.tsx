"use client";

import Link from "next/link";
import { Activity, Heart, Shield, Stethoscope, Zap, BarChart3, Lock, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const roles = [
  {
    id: "patient",
    title: "Patient",
    subtitle: "Personal Health Dashboard",
    description: "Monitor real-time vitals, track your AI Health Score, earn Status Points, and receive proactive health insights from your JIVA Smart Band.",
    icon: Heart,
    href: "/patient",
    accentColor: "#14b8a6",
    accentGradient: "from-[#14b8a6] to-[#6366f1]",
    badge: "Patient Portal",
    badgeColor: "rgba(20,184,166,0.15)",
    badgeText: "#14b8a6",
    features: [
      { text: "Real-time ECG, PPG & SpO₂", color: "#14b8a6" },
      { text: "AI Health Score (0–100)", color: "#6366f1" },
      { text: "Status Points & Tier Rewards", color: "#f59e0b" },
      { text: "Sleep & Activity Analytics", color: "#10b981" },
    ],
    cta: "Open Patient Dashboard",
  },
  {
    id: "provider",
    title: "Healthcare Provider",
    subtitle: "Clinical Monitoring Dashboard",
    description: "Review biosignal data, triage AI-flagged anomalies, generate FHIR referrals, and monitor your patient cohort's outcomes in real time.",
    icon: Stethoscope,
    href: "/provider",
    accentColor: "#6366f1",
    accentGradient: "from-[#3b82f6] to-[#6366f1]",
    badge: "Clinical Portal",
    badgeColor: "rgba(99,102,241,0.15)",
    badgeText: "#6366f1",
    features: [
      { text: "Patient Risk Stratification", color: "#f43f5e" },
      { text: "Anomaly & Alert Triage", color: "#f59e0b" },
      { text: "FHIR Data Export", color: "#3b82f6" },
      { text: "Telemedicine Integration", color: "#10b981" },
    ],
    cta: "Open Provider Dashboard",
  },
  {
    id: "insurer",
    title: "Insurer",
    subtitle: "Population Health & Risk",
    description: "Analyse population health trends, monitor pilot KPIs, manage wellness-linked premium adjustments, and project claims savings.",
    icon: Shield,
    href: "/insurer",
    accentColor: "#8b5cf6",
    accentGradient: "from-[#8b5cf6] to-[#6366f1]",
    badge: "Insurer Portal",
    badgeColor: "rgba(139,92,246,0.15)",
    badgeText: "#8b5cf6",
    features: [
      { text: "Population Risk Scoring", color: "#f43f5e" },
      { text: "Wellness Compliance Tracking", color: "#10b981" },
      { text: "Claims Cost Projections", color: "#f59e0b" },
      { text: "Pilot KPI Monitoring (500 users)", color: "#6366f1" },
    ],
    cta: "Open Insurer Dashboard",
  },
];

const stats = [
  { label: "Biosignals", value: "6+", icon: Activity },
  { label: "Accuracy", value: "≥90%", icon: BarChart3 },
  { label: "Battery", value: "72h", icon: Zap },
  { label: "Encryption", value: "AES-256", icon: Lock },
  { label: "Compliance", value: "HIPAA+ODPC", icon: Globe },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#6366f1]/10 blur-[120px]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#14b8a6]/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[#6366f1]/6 blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#6366f1] flex items-center justify-center shadow-glow-teal">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold text-foreground tracking-tight">JIVA</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full border text-[#14b8a6] border-[#14b8a6]/30 bg-[#14b8a6]/10">
              APHP v0.1 MVP
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Pilot · 500 Users · Nairobi</span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 border border-[#14b8a6]/25 rounded-full px-4 py-2 mb-7 bg-[#14b8a6]/8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
          <span className="text-[#14b8a6] text-sm font-medium">AI-Powered Pro-Active Healthcare Program</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-5 leading-tight tracking-tight">
          Your Health.{" "}
          <span className="bg-gradient-to-r from-[#14b8a6] via-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
            Predicted. Protected.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          The JIVA Smart Health Band continuously monitors ECG, PPG, HRV, SpO₂, temperature, and bio-impedance — delivering clinical-grade insights to patients, providers, and insurers.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-16">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 border border-white/[0.08] rounded-xl px-4 py-2.5 bg-white/[0.03] backdrop-blur-sm"
            >
              <s.icon className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span className="text-foreground font-bold text-sm tabular">{s.value}</span>
              <span className="text-muted-foreground text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Role cards */}
        <div className="grid md:grid-cols-3 gap-5 text-left">
          {roles.map((role) => (
            <div
              key={role.id}
              className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14]"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Gradient top accent */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${role.accentGradient}`} />

              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${role.accentColor}12 0%, transparent 70%)`,
                }}
              />

              <div className="relative p-6 pb-4">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-5"
                  style={{ backgroundColor: role.badgeColor, color: role.badgeText }}
                >
                  <role.icon className="w-3 h-3" />
                  {role.badge}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.accentGradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <role.icon className="w-6 h-6 text-white" />
                </div>

                <h2 className="text-lg font-bold text-foreground mb-0.5">{role.title}</h2>
                <p className="text-sm text-muted-foreground font-medium mb-3">{role.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{role.description}</p>

                {/* Divider */}
                <div className="h-px bg-white/[0.06] mb-4" />

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {role.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: f.color }} />
                      <span className="text-foreground/80">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative p-6 pt-0 mt-auto">
                <Button
                  asChild
                  className={`w-full bg-gradient-to-r ${role.accentGradient} hover:opacity-90 text-white border-0 font-semibold transition-all duration-200`}
                >
                  <Link href={role.href}>{role.cta} →</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative max-w-7xl mx-auto px-6 py-6 border-t border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">© 2025 JIVA Healthcare · AI-Powered Pro-Active Healthcare Program</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {["HIPAA Aligned", "ODPC (Kenya)", "SOC 3 Ready", "ISO 13485"].map((t) => (
            <span key={t} className="flex items-center gap-1 text-muted-foreground text-xs">
              <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
              {t}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
