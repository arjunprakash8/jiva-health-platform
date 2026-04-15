"use client";

import Link from "next/link";
import { Activity, Heart, Shield, Stethoscope, Zap, BarChart3, Lock, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const roles = [
  {
    id: "patient",
    title: "Patient",
    subtitle: "Personal Health Dashboard",
    description: "Monitor real-time vitals, track your AI Health Score, earn Status Points, and receive proactive health insights from your JIVA Smart Ring.",
    icon: Heart,
    href: "/patient",
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-50",
    badge: "Patient Portal" as const,
    badgeVariant: "success" as const,
    features: ["Real-time ECG, PPG & SpO₂", "AI Health Score (0–100)", "Status Points & Tier Rewards", "Sleep & Activity Analytics"],
    cta: "Open Patient Dashboard",
    ctaClass: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0",
  },
  {
    id: "provider",
    title: "Healthcare Provider",
    subtitle: "Clinical Monitoring Dashboard",
    description: "Review biosignal data, triage AI-flagged anomalies, generate FHIR referrals, and monitor your patient cohort's outcomes in real time.",
    icon: Stethoscope,
    href: "/provider",
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-50",
    badge: "Clinical Portal" as const,
    badgeVariant: "info" as const,
    features: ["Patient Risk Stratification", "Anomaly & Alert Triage", "FHIR Data Export", "Telemedicine Integration"],
    cta: "Open Provider Dashboard",
    ctaClass: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0",
  },
  {
    id: "insurer",
    title: "Insurer",
    subtitle: "Population Health & Risk Dashboard",
    description: "Analyse population health trends, monitor pilot KPIs, manage wellness-linked premium adjustments, and project claims savings.",
    icon: Shield,
    href: "/insurer",
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-50",
    badge: "Insurer Portal" as const,
    badgeVariant: "purple" as const,
    features: ["Population Risk Scoring", "Wellness Compliance Tracking", "Claims Cost Projections", "Pilot KPI Monitoring (500 users)"],
    cta: "Open Insurer Dashboard",
    ctaClass: "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">JIVA</span>
            <Badge variant="outline" className="ml-2 text-teal-400 border-teal-400/30 bg-teal-400/10 text-xs">
              APHP v0.1 MVP
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Pilot · 500 Users</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-teal-300 text-sm font-medium">AI-Powered Pro-Active Healthcare Program</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
          Your Health.{" "}
          <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Predicted. Protected.
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          The JIVA Smart Health Ring continuously monitors ECG, PPG, HRV, SpO₂, temperature, and bio-impedance — delivering clinical-grade insights to patients, providers, and insurers.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
              <s.icon className="w-4 h-4 text-teal-400" />
              <span className="text-white font-bold text-sm">{s.value}</span>
              <span className="text-slate-400 text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-5 text-left">
          {roles.map((role) => (
            <Card key={role.id} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-border/60 h-full flex flex-col">
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.gradient}`} />

              <CardHeader className="pb-3 pt-7">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={role.badgeVariant}>{role.badge}</Badge>
                </div>
                <div className={`w-12 h-12 rounded-xl ${role.iconBg} flex items-center justify-center mb-3`}>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.gradient} flex items-center justify-center`}>
                    <role.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-foreground">{role.title}</h2>
                <p className="text-sm text-muted-foreground font-medium">{role.subtitle}</p>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>

                <Separator />

                <ul className="space-y-2">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <Button asChild className={`w-full ${role.ctaClass}`}>
                    <Link href={role.href}>{role.cta} →</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-7 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-sm">© 2025 JIVA Healthcare · AI-Powered Pro-Active Healthcare Program</p>
        <div className="flex gap-5 text-slate-500 text-xs">
          {["HIPAA Aligned", "ODPC (Kenya)", "SOC 3 Ready", "ISO 13485"].map((t) => (
            <span key={t} className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
