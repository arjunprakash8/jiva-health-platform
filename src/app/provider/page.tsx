"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Activity, Search, AlertCircle,
  Users, TrendingUp, Download,
  FileText, Video, Heart, Droplets, Thermometer, Wind,
  Footprints, Moon, XCircle, LayoutDashboard, Bell,
  BarChart3, GitBranch, Filter,
  ClipboardList, FolderOpen, CalendarDays, Zap, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardShell from "@/components/layout/DashboardShell";
import ClinicalTimeline from "@/components/medical/ClinicalTimeline";
import MedicalRecords from "@/components/medical/MedicalRecords";
import CareCoordination from "@/components/medical/CareCoordination";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import {
  patientRoster, populationRiskDistribution,
  getRiskColor, getScoreColor, Patient,
} from "@/lib/mockData";

const alertTrend = [
  { day: "Mon", critical: 3, warning: 7 },
  { day: "Tue", critical: 5, warning: 9 },
  { day: "Wed", critical: 2, warning: 6 },
  { day: "Thu", critical: 6, warning: 8 },
  { day: "Fri", critical: 4, warning: 11 },
  { day: "Sat", critical: 2, warning: 5 },
  { day: "Sun", critical: 3, warning: 7 },
];

const tooltipStyle = {
  backgroundColor: "rgba(10,10,20,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  fontSize: "11px",
  color: "#f0eeeb",
  backdropFilter: "blur(16px)",
};

const axisTick = { fill: "rgba(255,255,255,0.35)", fontSize: 10 };

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    high: { bg: "rgba(244,63,94,0.15)", text: "#f43f5e", dot: "#f43f5e" },
    moderate: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", dot: "#f59e0b" },
    low: { bg: "rgba(16,185,129,0.15)", text: "#10b981", dot: "#10b981" },
  };
  const s = styles[risk] ?? styles.low;
  const label = { high: "High Risk", moderate: "Moderate", low: "Low Risk" }[risk] ?? "Low Risk";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}>
      <span className={`w-1.5 h-1.5 rounded-full ${risk === "high" ? "animate-pulse" : ""}`}
        style={{ backgroundColor: s.dot }} />
      {label}
    </span>
  );
}

function ScorePill({ score }: { score: number }) {
  const color = getScoreColor(score);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border"
      style={{ backgroundColor: color + "15", color, borderColor: color + "30" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />{score}
    </span>
  );
}

function StatCard({ label, value, sub, color, icon: Icon, pulse }: {
  label: string; value: string | number; sub?: string;
  color: string; icon: React.ElementType; pulse?: boolean;
}) {
  return (
    <div className="stat-card hover-lift rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color + "20", border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {pulse && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mt-1" />}
      </div>
      <p className="text-2xl font-extrabold metric-number" style={{ color }}>{value}</p>
      <p className="text-xs text-white/50 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

function PatientDetail({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const vitals = [
    { icon: Heart, label: "Heart Rate", value: `${patient.heartRate} bpm`, color: "#f43f5e", warn: patient.heartRate > 85 },
    { icon: Droplets, label: "SpO₂", value: `${patient.spo2}%`, color: "#3b82f6", warn: patient.spo2 < 95 },
    { icon: Wind, label: "HRV (RMSSD)", value: `${patient.hrv} ms`, color: "#8b5cf6", warn: patient.hrv < 25 },
    { icon: Thermometer, label: "Skin Temp", value: `${patient.temperature}°C`, color: "#f59e0b", warn: patient.temperature > 37.2 },
    { icon: Footprints, label: "Steps", value: patient.steps.toLocaleString(), color: "#10b981", warn: false },
    { icon: Moon, label: "Sleep Score", value: `${patient.sleepScore}/100`, color: "#6366f1", warn: patient.sleepScore < 60 },
  ];
  const activeAlerts = patient.alerts.filter(a => !a.resolved);

  return (
    <div className="glass rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Patient Detail</h3>
        <button onClick={onClose}
          className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
          <XCircle className="w-4 h-4" /> Close
        </button>
      </div>

      {/* Hero */}
      <div className="rounded-xl p-4"
        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.12) 100%)", border: "1px solid rgba(99,102,241,0.25)" }}>
        <div className="flex items-start justify-between mb-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-white font-bold text-sm"
              style={{ backgroundColor: getRiskColor(patient.riskLevel) }}>
              {patient.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <RiskBadge risk={patient.riskLevel} />
        </div>
        <h3 className="text-base font-bold text-white">{patient.name}</h3>
        <p className="text-white/50 text-sm">{patient.age}y · {patient.gender} · {patient.id}</p>
        <p className="text-white/40 text-xs mt-0.5">{patient.condition.join(", ")}</p>
        <div className="flex items-center gap-6 mt-4">
          {[
            { label: "Health Score", val: patient.healthScore, color: getScoreColor(patient.healthScore) },
            { label: "Compliance", val: `${patient.activityCompliance}%`, color: "#f0eeeb" },
            { label: "Battery", val: `${patient.bandBattery}%`, color: "#f0eeeb" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-extrabold metric-number" style={{ color: s.color }}>{s.val}</p>
              <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vitals grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {vitals.map(v => (
          <div key={v.label} className="rounded-xl border p-3 hover-lift"
            style={{ backgroundColor: v.warn ? "rgba(244,63,94,0.08)" : "rgba(255,255,255,0.03)", borderColor: v.warn ? "rgba(244,63,94,0.3)" : "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <v.icon className="w-3.5 h-3.5" style={{ color: v.color }} />
              <span className="text-xs text-white/40">{v.label}</span>
            </div>
            <p className="text-base font-bold text-white tabular">{v.value}</p>
            {v.warn && <p className="text-xs font-medium text-rose-400 mt-0.5">Elevated</p>}
          </div>
        ))}
      </div>

      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Active Alerts</p>
          {activeAlerts.map(alert => (
            <div key={alert.id} className="rounded-xl p-3"
              style={{ background: alert.type === "critical" ? "rgba(244,63,94,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${alert.type === "critical" ? "rgba(244,63,94,0.3)" : "rgba(245,158,11,0.3)"}` }}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: alert.type === "critical" ? "#f43f5e" : "#f59e0b" }} />
                <p className="font-semibold text-xs text-white">{alert.message}</p>
              </div>
              {alert.vitals && <p className="text-xs mt-1 text-white/60">{alert.vitals}</p>}
              <p className="text-xs mt-0.5 text-white/30">{alert.timestamp}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold text-white press-scale"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
          <Video className="w-3.5 h-3.5" /> Teleconsult
        </button>
        <button className="flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold text-white/70 hover:text-white glass press-scale">
          <FileText className="w-3.5 h-3.5" /> Referral
        </button>
        <button className="col-span-2 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold text-white/70 hover:text-white glass press-scale">
          <Download className="w-3.5 h-3.5" /> Export FHIR Data
        </button>
      </div>
    </div>
  );
}

export default function ProviderDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "moderate" | "low">("all");
  const [activeSection, setActiveSection] = useState("overview");

  const allAlerts = patientRoster.flatMap(p =>
    p.alerts.filter(a => !a.resolved).map(a => ({ ...a, patientName: p.name, patientId: p.id }))
  );
  const criticalAlerts = allAlerts.filter(a => a.type === "critical");

  const filteredPatients = patientRoster.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchRisk = riskFilter === "all" || p.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const highRiskCount = patientRoster.filter(p => p.riskLevel === "high").length;
  const avgScore = Math.round(patientRoster.reduce((s, p) => s + p.healthScore, 0) / patientRoster.length);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", id: "overview" },
    { icon: Users, label: "Patients", id: "patients" },
    { icon: Bell, label: "Alerts", id: "alerts", badge: allAlerts.length },
    { icon: BarChart3, label: "Analytics", id: "analytics" },
    { icon: GitBranch, label: "Execution", id: "execution" },
    { icon: ClipboardList, label: "Timeline", id: "timeline" },
    { icon: FolderOpen, label: "Records", id: "records" },
    { icon: CalendarDays, label: "Care Coord", id: "care" },
  ];

  return (
    <>
      <DashboardShell
        navItems={navItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        role="provider"
        userName="Dr. Rebecca Owusu"
        userInitials="DR"
        userSub="JIVA Clinical · Nairobi"
        notificationCount={criticalAlerts.length}
        topBarTitle={navItems.find(n => n.id === activeSection)?.label ?? "Dashboard"}
        topBarSub="JIVA Provider Dashboard · Auto-refresh 30s"
      >

        {/* ── OVERVIEW ── */}
        {activeSection === "overview" && (
          <div className="space-y-5 animate-fade-up">
            {/* Hero banner */}
            <div className="relative overflow-hidden rounded-2xl p-5"
              style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(244,63,94,0.08) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(20,184,166,0.4) 0%, transparent 60%)" }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="live-dot" />
                  <span className="text-xs font-semibold text-teal-400">LIVE MONITORING</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">Dr. Rebecca Owusu</h2>
                <p className="text-white/50 text-sm">JIVA Clinical · Nairobi · {patientRoster.length} patients under care</p>
              </div>
            </div>

            {/* KPI stat grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Patients" value={patientRoster.length} sub="Pilot cohort" color="#3b82f6" icon={Users} />
              <StatCard label="High Risk" value={highRiskCount} sub="Need attention" color="#f43f5e" icon={AlertCircle} pulse />
              <StatCard label="Active Alerts" value={allAlerts.length} sub={`${criticalAlerts.length} critical`} color="#f59e0b" icon={Bell} />
              <StatCard label="Avg Health Score" value={avgScore} sub="Moderate range" color="#10b981" icon={Activity} />
            </div>

            {/* Critical alert banner */}
            {criticalAlerts.length > 0 && (
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)" }}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
                  <p className="font-bold text-sm text-rose-300">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? "s" : ""} — Immediate Attention Required</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {criticalAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="rounded-xl p-3 text-xs"
                      style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}>
                      <p className="font-bold text-white">{alert.patientName} · {alert.patientId}</p>
                      <p className="mt-0.5 text-rose-300">{alert.message}</p>
                      {alert.vitals && <p className="mt-0.5 text-white/60 font-medium">{alert.vitals}</p>}
                      <p className="mt-1 text-white/30">{alert.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Risk distribution */}
              <div className="glass rounded-2xl p-4">
                <p className="text-sm font-bold text-white mb-1">Risk Distribution</p>
                <p className="text-xs text-white/40 mb-3">{patientRoster.length} patients</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={populationRiskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                      {populationRiskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v, "Patients"]} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {populationRiskDistribution.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-white/50">{d.name}</span>
                      </span>
                      <span className="font-semibold text-white tabular">{d.value} ({d.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert trend */}
              <div className="glass rounded-2xl p-4">
                <p className="text-sm font-bold text-white mb-1">Weekly Alert Trend</p>
                <p className="text-xs text-white/40 mb-3">Critical vs warning alerts</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={alertTrend} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="critical" name="Critical" stackId="a" fill="#f43f5e" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="warning" name="Warning" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── PATIENTS ── */}
        {activeSection === "patients" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-up">
            {/* Roster */}
            <div className="glass rounded-2xl flex flex-col" style={{ maxHeight: "78vh" }}>
              <div className="p-4 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-white">Patient Roster</p>
                  <span className="text-xs px-2 py-0.5 rounded-full glass text-white/50">
                    {filteredPatients.length}/{patientRoster.length}
                  </span>
                </div>
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input placeholder="Search patients..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 text-sm bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 rounded-xl" />
                </div>
                <div className="flex gap-1">
                  {(["all", "high", "moderate", "low"] as const).map(r => {
                    const colors: Record<string, string> = { high: "#f43f5e", moderate: "#f59e0b", low: "#10b981", all: "#6366f1" };
                    return (
                      <button key={r} onClick={() => setRiskFilter(r)}
                        className="flex-1 h-7 text-xs rounded-lg font-medium transition-all duration-200 press-scale"
                        style={riskFilter === r
                          ? { backgroundColor: colors[r] + "20", color: colors[r], border: `1px solid ${colors[r]}40` }
                          : { color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <ScrollArea className="flex-1 overflow-y-auto">
                {filteredPatients.map(patient => (
                  <button key={patient.id} onClick={() => setSelectedPatient(patient)}
                    className="w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                    style={selectedPatient?.id === patient.id
                      ? { backgroundColor: "rgba(99,102,241,0.08)", borderLeft: "3px solid #6366f1" } : {}}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-white text-xs font-bold"
                            style={{ backgroundColor: getRiskColor(patient.riskLevel) }}>
                            {patient.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-white leading-tight">{patient.name}</p>
                          <p className="text-xs text-white/40">{patient.age}y · {patient.id}</p>
                        </div>
                      </div>
                      <ScorePill score={patient.healthScore} />
                    </div>
                    <div className="flex flex-wrap gap-1 pl-[42px]">
                      {patient.condition.map(c => (
                        <span key={c} className="text-xs px-1.5 py-0.5 rounded-md text-white/40"
                          style={{ background: "rgba(255,255,255,0.05)" }}>{c}</span>
                      ))}
                      {patient.alerts.filter(a => !a.resolved && a.type === "critical").length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-400 font-bold animate-pulse">
                          {patient.alerts.filter(a => !a.resolved && a.type === "critical").length} critical
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2">
              {selectedPatient ? (
                <PatientDetail patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
              ) : (
                <div className="glass rounded-2xl flex items-center justify-center h-64 text-center">
                  <div>
                    <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">Select a patient to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ALERTS ── */}
        {activeSection === "alerts" && (
          <div className="space-y-5 animate-fade-up">
            {criticalAlerts.length > 0 && (
              <div className="flex items-center gap-3 rounded-2xl p-4"
                style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)" }}>
                <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse flex-shrink-0" />
                <p className="font-bold text-sm text-rose-300">
                  {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? "s" : ""} require immediate attention
                </p>
              </div>
            )}

            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <div>
                  <p className="text-sm font-bold text-white">All Active Alerts</p>
                  <p className="text-xs text-white/40 mt-0.5">Click a row to view patient detail</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 h-8 px-3 rounded-xl text-xs font-medium glass text-white/60 hover:text-white press-scale">
                    <Filter className="w-3.5 h-3.5" /> Filter
                  </button>
                  <button className="flex items-center gap-1 h-8 px-3 rounded-xl text-xs font-medium glass text-white/60 hover:text-white press-scale">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-white/40 text-xs">Severity</TableHead>
                    <TableHead className="text-white/40 text-xs">Patient</TableHead>
                    <TableHead className="text-white/40 text-xs">Alert</TableHead>
                    <TableHead className="text-white/40 text-xs">Vitals</TableHead>
                    <TableHead className="text-white/40 text-xs">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAlerts.map(alert => {
                    const sev = alert.type === "critical"
                      ? { bg: "rgba(244,63,94,0.15)", text: "#f43f5e" }
                      : alert.type === "warning"
                        ? { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" }
                        : { bg: "rgba(99,102,241,0.15)", text: "#6366f1" };
                    return (
                      <TableRow key={alert.id} className="cursor-pointer border-white/[0.04] hover:bg-white/[0.02]"
                        onClick={() => {
                          setSelectedPatient(patientRoster.find(p => p.id === alert.patientId) ?? null);
                          setActiveSection("patients");
                        }}>
                        <TableCell>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: sev.bg, color: sev.text }}>{alert.type}</span>
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className="font-semibold text-white">{alert.patientName}</span>
                          <br /><span className="text-white/40">{alert.patientId}</span>
                        </TableCell>
                        <TableCell className="text-xs text-white/70 max-w-[200px]">{alert.message}</TableCell>
                        <TableCell className="text-xs text-rose-400 font-medium">{alert.vitals ?? "—"}</TableCell>
                        <TableCell className="text-xs text-white/40">{alert.timestamp}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {activeSection === "analytics" && (
          <div className="space-y-5 animate-fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Patients" value={patientRoster.length} sub="Pilot cohort" color="#3b82f6" icon={Users} />
              <StatCard label="High Risk" value={highRiskCount} sub="Need attention" color="#f43f5e" icon={AlertCircle} pulse />
              <StatCard label="Active Alerts" value={allAlerts.length} sub={`${criticalAlerts.length} critical`} color="#f59e0b" icon={Bell} />
              <StatCard label="Avg Health Score" value={avgScore} sub="Moderate range" color="#10b981" icon={Activity} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass rounded-2xl p-4">
                <p className="text-sm font-bold text-white mb-3">Risk Distribution</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={populationRiskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                      {populationRiskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v, "Patients"]} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                {populationRiskDistribution.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs mt-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-white/50">{d.name}</span>
                    </span>
                    <span className="font-semibold text-white tabular">{d.value} ({d.percentage}%)</span>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-4">
                <p className="text-sm font-bold text-white mb-1">Compliance Metrics</p>
                <p className="text-xs text-white/40 mb-3">Activity verification across cohort</p>
                <div className="space-y-3">
                  {[
                    { label: "Activity Compliance", value: 78, color: "#10b981" },
                    { label: "Medication Adherence", value: 65, color: "#6366f1" },
                    { label: "Data Sync Rate", value: 92, color: "#3b82f6" },
                    { label: "Appointment Attendance", value: 71, color: "#f59e0b" },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">{m.label}</span>
                        <span className="font-bold tabular" style={{ color: m.color }}>{m.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${m.value}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Patient health score distribution */}
            <div className="glass rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-3">Patient Health Score Distribution</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Excellent (80–100)", count: patientRoster.filter(p => p.healthScore >= 80).length, color: "#10b981" },
                  { label: "Good (60–79)", count: patientRoster.filter(p => p.healthScore >= 60 && p.healthScore < 80).length, color: "#3b82f6" },
                  { label: "Fair (40–59)", count: patientRoster.filter(p => p.healthScore >= 40 && p.healthScore < 60).length, color: "#f59e0b" },
                  { label: "Poor (<40)", count: patientRoster.filter(p => p.healthScore < 40).length, color: "#f43f5e" },
                ].map(seg => (
                  <div key={seg.label} className="text-center rounded-xl p-4 hover-lift"
                    style={{ background: seg.color + "10", border: `1px solid ${seg.color}25` }}>
                    <p className="text-3xl font-extrabold metric-number" style={{ color: seg.color }}>{seg.count}</p>
                    <p className="text-xs text-white/50 mt-1">{seg.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EXECUTION ── */}
        {activeSection === "execution" && (
          <div className="animate-fade-up">
            <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
              <Zap className="w-5 h-5 text-teal-400" />
              <div>
                <p className="text-sm font-bold text-white">Clinical Execution Framework</p>
                <p className="text-xs text-white/40">Protocol-driven care pathways for high-risk patients</p>
              </div>
            </div>
            <div className="glass rounded-2xl overflow-hidden p-4">
              <p className="text-sm text-white/60 text-center py-8">Execution framework module available in full deployment</p>
            </div>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {activeSection === "timeline" && (
          <div className="animate-fade-up">
            <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm font-bold text-white">Clinical Timeline</p>
                <p className="text-xs text-white/40">Longitudinal view of patient care events</p>
              </div>
            </div>
            <ClinicalTimeline />
          </div>
        )}

        {/* ── RECORDS ── */}
        {activeSection === "records" && (
          <div className="animate-fade-up">
            <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-bold text-white">Medical Records</p>
                <p className="text-xs text-white/40">FHIR-compliant patient health records</p>
              </div>
            </div>
            <MedicalRecords />
          </div>
        )}

        {/* ── CARE COORD ── */}
        {activeSection === "care" && (
          <div className="animate-fade-up">
            <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-bold text-white">Care Coordination</p>
                <p className="text-xs text-white/40">Multi-disciplinary care team management</p>
              </div>
            </div>
            <CareCoordination />
          </div>
        )}

      </DashboardShell>
      <MobileBottomNav navItems={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
    </>
  );
}
