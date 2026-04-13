"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Activity,
  ArrowLeft,
  Bell,
  Search,
  Filter,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Users,
  TrendingUp,
  Download,
  FileText,
  Video,
  Heart,
  Droplets,
  Thermometer,
  Wind,
  Footprints,
  Moon,
  CheckCircle,
  XCircle,
  Clock,
  Stethoscope,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import {
  patientRoster,
  heartRateTrend,
  spo2Trend,
  hrvTrend,
  populationRiskDistribution,
  getRiskColor,
  getScoreColor,
  getScoreLabel,
  Patient,
} from "@/lib/mockData";

// ─── Mini Health Score Badge ───────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = getScoreColor(score);
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{ backgroundColor: color + "18", color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {score}
    </div>
  );
}

// ─── Risk Badge ────────────────────────────────────────────────────────────────
function RiskBadge({ risk }: { risk: string }) {
  const configs = {
    high:     { bg: "bg-red-100", text: "text-red-700", label: "High Risk", dot: "bg-red-500" },
    moderate: { bg: "bg-amber-100", text: "text-amber-700", label: "Moderate", dot: "bg-amber-500" },
    low:      { bg: "bg-emerald-100", text: "text-emerald-700", label: "Low Risk", dot: "bg-emerald-500" },
  };
  const c = configs[risk as keyof typeof configs] ?? configs.low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${risk === "high" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}

// ─── Alert Badge ───────────────────────────────────────────────────────────────
function AlertCount({ alerts }: { alerts: { type: string; resolved: boolean }[] }) {
  const active = alerts.filter((a) => !a.resolved);
  if (active.length === 0)
    return <span className="text-xs text-slate-400 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> Clear</span>;
  const critical = active.filter((a) => a.type === "critical").length;
  return (
    <div className="flex items-center gap-1">
      {critical > 0 && (
        <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
          <AlertCircle className="w-3 h-3" /> {critical}
        </span>
      )}
      {active.length - critical > 0 && (
        <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3 h-3" /> {active.length - critical}
        </span>
      )}
    </div>
  );
}

// ─── Patient Detail Panel ──────────────────────────────────────────────────────
function PatientDetailPanel({ patient }: { patient: Patient }) {
  const vitalRows = [
    { icon: Heart, label: "Heart Rate", value: `${patient.heartRate} bpm`, color: "#ef4444", sub: patient.heartRate > 85 ? "⚠ Elevated" : "Normal" },
    { icon: Droplets, label: "SpO₂", value: `${patient.spo2}%`, color: "#3b82f6", sub: patient.spo2 < 95 ? "⚠ Low" : "Normal" },
    { icon: Wind, label: "HRV (RMSSD)", value: `${patient.hrv} ms`, color: "#8b5cf6", sub: patient.hrv < 25 ? "⚠ Low" : "Normal" },
    { icon: Thermometer, label: "Skin Temp", value: `${patient.temperature}°C`, color: "#f59e0b", sub: patient.temperature > 37.2 ? "⚠ Elevated" : "Normal" },
    { icon: Footprints, label: "Steps", value: patient.steps.toLocaleString(), color: "#10b981", sub: `${Math.round(patient.steps / 100)}% goal` },
    { icon: Moon, label: "Sleep Score", value: `${patient.sleepScore}/100`, color: "#6366f1", sub: patient.sleepScore < 60 ? "Poor" : "Good" },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Patient header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
            {patient.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <RiskBadge risk={patient.riskLevel} />
        </div>
        <h3 className="text-lg font-bold">{patient.name}</h3>
        <p className="text-blue-200 text-sm">{patient.age}y · {patient.gender} · {patient.id}</p>
        <p className="text-blue-200 text-xs mt-1">{patient.condition.join(", ")}</p>
        <div className="flex items-center gap-3 mt-4">
          <div className="text-center">
            <p className="text-2xl font-extrabold" style={{ color: getScoreColor(patient.healthScore) }}>
              {patient.healthScore}
            </p>
            <p className="text-blue-200 text-xs">Health Score</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-white">{patient.activityCompliance}%</p>
            <p className="text-blue-200 text-xs">Compliance</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-white">{patient.ringBattery}%</p>
            <p className="text-blue-200 text-xs">Ring Battery</p>
          </div>
        </div>
      </div>

      {/* Vitals grid */}
      <div className="grid grid-cols-2 gap-2">
        {vitalRows.map((v) => (
          <div key={v.label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <v.icon className="w-3.5 h-3.5" style={{ color: v.color }} />
              <span className="text-xs text-slate-500">{v.label}</span>
            </div>
            <p className="text-base font-bold text-slate-900">{v.value}</p>
            <p
              className="text-xs font-medium"
              style={{ color: v.sub.startsWith("⚠") ? "#ef4444" : "#10b981" }}
            >
              {v.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {patient.alerts.filter((a) => !a.resolved).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Active Alerts</p>
          {patient.alerts
            .filter((a) => !a.resolved)
            .map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border text-xs ${
                  alert.type === "critical"
                    ? "bg-red-50 border-red-200"
                    : alert.type === "warning"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                      alert.type === "critical" ? "text-red-600" : "text-amber-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        alert.type === "critical" ? "text-red-700" : "text-amber-700"
                      }`}
                    >
                      {alert.message}
                    </p>
                    {alert.vitals && <p className="text-slate-500 mt-0.5">{alert.vitals}</p>}
                    <p className="text-slate-400 mt-0.5">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Video className="w-4 h-4" /> Teleconsult
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors">
          <FileText className="w-4 h-4" /> Referral
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors col-span-2">
          <Download className="w-4 h-4" /> Export FHIR Data
        </button>
      </div>
    </div>
  );
}

// ─── Alert trend data ──────────────────────────────────────────────────────────
const alertTrend = [
  { day: "Mon", critical: 3, warning: 7 },
  { day: "Tue", critical: 5, warning: 9 },
  { day: "Wed", critical: 2, warning: 6 },
  { day: "Thu", critical: 6, warning: 8 },
  { day: "Fri", critical: 4, warning: 11 },
  { day: "Sat", critical: 2, warning: 5 },
  { day: "Sun", critical: 3, warning: 7 },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProviderDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "moderate" | "low">("all");

  const allAlerts = patientRoster.flatMap((p) =>
    p.alerts.filter((a) => !a.resolved).map((a) => ({ ...a, patientName: p.name, patientId: p.id }))
  );
  const criticalAlerts = allAlerts.filter((a) => a.type === "critical");

  const filteredPatients = patientRoster.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchRisk = riskFilter === "all" || p.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const highRiskCount = patientRoster.filter((p) => p.riskLevel === "high").length;
  const avgScore = Math.round(patientRoster.reduce((s, p) => s + p.healthScore, 0) / patientRoster.length);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">JIVA</span>
                <span className="text-slate-400 text-sm"> · Provider Dashboard</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
              <RefreshCw className="w-3 h-3" /> Live · auto-refresh 30s
            </span>
            <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              {criticalAlerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
                  {criticalAlerts.length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                DR
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">Dr. Rebecca Owusu</p>
                <p className="text-xs text-slate-500">JIVA Clinical Team · Nairobi</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Patients", value: patientRoster.length, icon: Users, color: "#3b82f6", sub: "Pilot cohort" },
            { label: "High Risk", value: highRiskCount, icon: AlertCircle, color: "#ef4444", sub: "Require attention", pulse: true },
            { label: "Active Alerts", value: allAlerts.length, icon: Bell, color: "#f59e0b", sub: `${criticalAlerts.length} critical` },
            { label: "Avg Health Score", value: avgScore, icon: Activity, color: "#10b981", sub: "Moderate range" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.color + "18" }}>
                  <kpi.icon className={`w-5 h-5 ${kpi.pulse ? "animate-pulse" : ""}`} style={{ color: kpi.color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{kpi.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-0.5">{kpi.label}</p>
              <p className="text-xs text-slate-400">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Critical Alert Banner */}
        {criticalAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
              <span className="font-bold text-red-800">
                {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? "s" : ""} Require Immediate Attention
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {criticalAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="bg-white border border-red-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700">{alert.patientName} · {alert.patientId}</p>
                  <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                  {alert.vitals && <p className="text-xs text-red-500 font-medium mt-1">{alert.vitals}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main grid: patient list + detail + charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Patient Roster (left) */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col" style={{ maxHeight: "75vh" }}>
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">Patient Roster</h2>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                  {filteredPatients.length}/{patientRoster.length}
                </span>
              </div>
              {/* Search */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
              </div>
              {/* Risk filter */}
              <div className="flex gap-1">
                {(["all", "high", "moderate", "low"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRiskFilter(r)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      riskFilter === r
                        ? r === "all"
                          ? "bg-slate-800 text-white"
                          : r === "high"
                          ? "bg-red-600 text-white"
                          : r === "moderate"
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-500 text-white"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient list */}
            <div className="overflow-y-auto flex-1">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left px-4 py-3.5 border-b border-slate-50 hover:bg-blue-50/50 transition-colors ${
                    selectedPatient?.id === patient.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center"
                        style={{ backgroundColor: getRiskColor(patient.riskLevel) }}
                      >
                        {patient.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{patient.name}</p>
                        <p className="text-xs text-slate-400">{patient.age}y · {patient.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <ScoreBadge score={patient.healthScore} />
                      <AlertCount alerts={patient.alerts} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5 pl-10">
                    {patient.condition.map((c) => (
                      <span key={c} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">{c}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right side: detail or charts */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {selectedPatient ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5" style={{ minHeight: "75vh" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900">Patient Detail</h2>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Close
                  </button>
                </div>
                <PatientDetailPanel patient={selectedPatient} />
              </div>
            ) : (
              <>
                {/* Charts row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Risk Distribution */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Risk Distribution</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={populationRiskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {populationRiskDistribution.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => [v, "Patients"]} contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {populationRiskDistribution.map((d) => (
                        <div key={d.name} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-slate-600">{d.name}</span>
                          </span>
                          <span className="font-semibold text-slate-800">{d.value} pts ({d.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alert Trend */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Weekly Alert Trend</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={alertTrend} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} />
                        <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[0,0,4,4]} />
                        <Bar dataKey="warning" name="Warning" stackId="a" fill="#f59e0b" radius={[4,4,0,0]} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* All Alerts Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">All Active Alerts</h3>
                    <div className="flex gap-2">
                      <button className="text-xs text-slate-500 flex items-center gap-1 hover:text-slate-700">
                        <Filter className="w-3 h-3" /> Filter
                      </button>
                      <button className="text-xs text-blue-600 flex items-center gap-1 hover:text-blue-700">
                        <Download className="w-3 h-3" /> Export
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:opacity-90 transition-opacity ${
                          alert.type === "critical"
                            ? "bg-red-50 border-red-200"
                            : alert.type === "warning"
                            ? "bg-amber-50 border-amber-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                        onClick={() => setSelectedPatient(patientRoster.find((p) => p.id === alert.patientId) ?? null)}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          alert.type === "critical" ? "bg-red-500 animate-pulse" : alert.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-slate-700">{alert.patientName}</span>
                            <span className="text-xs text-slate-400">{alert.patientId}</span>
                          </div>
                          <p className="text-xs text-slate-600">{alert.message}</p>
                          {alert.vitals && <p className="text-xs font-medium text-red-500 mt-0.5">{alert.vitals}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-xs text-slate-400">{alert.timestamp}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <footer className="text-center py-5 text-xs text-slate-400 mt-4">
          JIVA APHP · Healthcare Provider Dashboard · HIPAA Aligned · FHIR Compatible · Role-Based Access Control
        </footer>
      </main>
    </div>
  );
}
