"use client";

import { useState } from "react";
import ExecutionFramework from "@/components/ExecutionFramework";
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
  ClipboardList, FolderOpen, CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardShell from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/ui/metric-card";
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

const chartTooltipStyle = {
  backgroundColor: "hsl(240 22% 9%)",
  border: "1px solid hsl(240 12% 15%)",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#f0eeeb",
};

const axisTickStyle = { fill: "hsl(240 5% 48%)", fontSize: 10 };

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    high: { bg: "rgba(244,63,94,0.15)", text: "#f43f5e", dot: "#f43f5e" },
    moderate: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", dot: "#f59e0b" },
    low: { bg: "rgba(16,185,129,0.15)", text: "#10b981", dot: "#10b981" },
  };
  const s = styles[risk] ?? styles.low;
  const label = { high: "High Risk", moderate: "Moderate", low: "Low Risk" }[risk] ?? "Low Risk";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${risk === "high" ? "animate-pulse" : ""}`} style={{ backgroundColor: s.dot }} />
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
    <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Patient Detail</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground text-xs">
            <XCircle className="w-4 h-4 mr-1" /> Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {/* Patient header */}
          <div className="rounded-xl p-5 bg-gradient-to-br from-[#3b82f6]/20 to-[#6366f1]/10 border border-[#6366f1]/20">
            <div className="flex items-start justify-between mb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-white font-bold text-sm" style={{ backgroundColor: getRiskColor(patient.riskLevel) }}>
                  {patient.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <RiskBadge risk={patient.riskLevel} />
            </div>
            <h3 className="text-base font-bold text-foreground">{patient.name}</h3>
            <p className="text-muted-foreground text-sm">{patient.age}y · {patient.gender} · {patient.id}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{patient.condition.join(", ")}</p>
            <div className="flex items-center gap-6 mt-4">
              {[
                { label: "Health Score", val: patient.healthScore, color: getScoreColor(patient.healthScore) },
                { label: "Compliance", val: `${patient.activityCompliance}%`, color: "#f0eeeb" },
                { label: "Battery", val: `${patient.bandBattery}%`, color: "#f0eeeb" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-extrabold metric-number" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {vitals.map(v => (
              <div key={v.label} className="rounded-xl border p-3" style={{ backgroundColor: v.warn ? "rgba(244,63,94,0.06)" : "hsl(240 22% 9%)", borderColor: v.warn ? "rgba(244,63,94,0.25)" : "hsl(240 12% 15%)" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <v.icon className="w-3.5 h-3.5" style={{ color: v.color }} />
                  <span className="text-xs text-muted-foreground">{v.label}</span>
                </div>
                <p className="text-base font-bold text-foreground tabular">{v.value}</p>
                {v.warn && <p className="text-xs font-medium text-[#f43f5e] mt-0.5">Elevated</p>}
              </div>
            ))}
          </div>

          {/* Alerts */}
          {activeAlerts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active Alerts</p>
              {activeAlerts.map(alert => (
                <Alert key={alert.id} variant={alert.type === "critical" ? "destructive" : "warning"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-semibold text-xs">{alert.message}</p>
                    {alert.vitals && <p className="text-xs mt-0.5 opacity-80">{alert.vitals}</p>}
                    <p className="text-xs mt-0.5 opacity-60">{alert.timestamp}</p>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button className="bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white border-0 hover:opacity-90 text-xs">
              <Video className="w-3.5 h-3.5 mr-1.5" /> Teleconsult
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-border">
              <FileText className="w-3.5 h-3.5 mr-1.5" /> Referral
            </Button>
            <Button variant="outline" size="sm" className="col-span-2 text-xs border-border">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export FHIR Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Patients" value={patientRoster.length} icon={Users} color="#3b82f6" sub="Pilot cohort" trend="stable" trendValue="Pilot" />
              <MetricCard label="High Risk" value={highRiskCount} icon={AlertCircle} color="#f43f5e" sub="Require attention" trend="down" trendValue="-1 vs last wk" glow />
              <MetricCard label="Active Alerts" value={allAlerts.length} icon={Bell} color="#f59e0b" sub={`${criticalAlerts.length} critical`} trend="up" trendValue={`${criticalAlerts.length} critical`} />
              <MetricCard label="Avg Health Score" value={avgScore} icon={Activity} color="#10b981" sub="Moderate range" trend="up" trendValue="+2 pts" />
            </div>

            {/* Critical alert banner */}
            {criticalAlerts.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 animate-pulse" />
                <AlertDescription>
                  <p className="font-bold mb-2">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? "s" : ""} — Immediate Attention Required</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {criticalAlerts.slice(0, 3).map(alert => (
                      <div key={alert.id} className="bg-white/10 rounded-xl p-2.5 text-xs">
                        <p className="font-bold">{alert.patientName} · {alert.patientId}</p>
                        <p className="mt-0.5 opacity-90">{alert.message}</p>
                        {alert.vitals && <p className="mt-0.5 font-medium">{alert.vitals}</p>}
                        <p className="mt-1 opacity-60">{alert.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Risk distribution */}
              <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Risk Distribution</CardTitle>
                  <CardDescription className="text-xs">{patientRoster.length} patients</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={populationRiskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                        {populationRiskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [v, "Patients"]} contentStyle={chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {populationRiskDistribution.map(d => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-muted-foreground">{d.name}</span>
                        </span>
                        <span className="font-semibold tabular">{d.value} ({d.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alert trend */}
              <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Weekly Alert Trend</CardTitle>
                  <CardDescription className="text-xs">Critical vs warning alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={alertTrend} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240 12% 13%)" />
                      <XAxis dataKey="day" tick={axisTickStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="critical" name="Critical" stackId="a" fill="#f43f5e" radius={[0,0,4,4]} />
                      <Bar dataKey="warning" name="Warning" stackId="a" fill="#f59e0b" radius={[4,4,0,0]} />
                      <Legend wrapperStyle={{ fontSize: "11px", color: "hsl(240 5% 48%)" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── PATIENTS ── */}
        {activeSection === "patients" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-up">
            {/* Patient roster */}
            <Card className="flex flex-col border-border/60" style={{ maxHeight: "78vh", boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Patient Roster</CardTitle>
                  <Badge variant="outline" className="text-xs text-muted-foreground border-border">{filteredPatients.length}/{patientRoster.length}</Badge>
                </div>
                <div className="relative mt-2">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input placeholder="Search patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-9 text-sm bg-card border-border" />
                </div>
                <div className="flex gap-1 mt-2">
                  {(["all", "high", "moderate", "low"] as const).map(r => {
                    const colors: Record<string, string> = { high: "#f43f5e", moderate: "#f59e0b", low: "#10b981", all: "#6366f1" };
                    return (
                      <button key={r}
                        onClick={() => setRiskFilter(r)}
                        className="flex-1 h-7 text-xs rounded-lg font-medium transition-all duration-200"
                        style={riskFilter === r
                          ? { backgroundColor: colors[r] + "20", color: colors[r], border: `1px solid ${colors[r]}40` }
                          : { color: "hsl(240 5% 48%)", border: "1px solid hsl(240 12% 15%)" }}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 overflow-y-auto">
                {filteredPatients.map(patient => (
                  <button key={patient.id} onClick={() => setSelectedPatient(patient)}
                    className="w-full text-left px-4 py-3 border-b border-border/40 hover:bg-white/[0.03] transition-colors relative"
                    style={selectedPatient?.id === patient.id ? { backgroundColor: "rgba(99,102,241,0.08)", borderLeft: "3px solid #6366f1" } : {}}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: getRiskColor(patient.riskLevel) }}>
                            {patient.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-tight">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.age}y · {patient.id}</p>
                        </div>
                      </div>
                      <ScorePill score={patient.healthScore} />
                    </div>
                    <div className="flex flex-wrap gap-1 pl-[42px]">
                      {patient.condition.map(c => (
                        <span key={c} className="text-xs px-1.5 py-0.5 rounded-md bg-white/[0.06] text-muted-foreground">{c}</span>
                      ))}
                      {patient.alerts.filter(a => !a.resolved && a.type === "critical").length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-[#f43f5e]/15 text-[#f43f5e] font-bold animate-pulse">
                          {patient.alerts.filter(a => !a.resolved && a.type === "critical").length} critical
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </Card>

            {/* Right panel */}
            <div className="lg:col-span-2">
              {selectedPatient ? (
                <PatientDetail patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
              ) : (
                <div className="flex items-center justify-center h-64 rounded-2xl border border-dashed border-border text-center">
                  <div>
                    <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Select a patient to view details</p>
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
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 animate-pulse" />
                <AlertDescription>
                  <p className="font-bold">{criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? "s" : ""} require immediate attention</p>
                </AlertDescription>
              </Alert>
            )}
            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">All Active Alerts</CardTitle>
                    <CardDescription className="text-xs">Click a row to view patient detail</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs border-border"><Filter className="w-3.5 h-3.5 mr-1" />Filter</Button>
                    <Button variant="outline" size="sm" className="text-xs border-border"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60">
                      <TableHead className="text-muted-foreground text-xs">Severity</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Patient</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Alert</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Vitals</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allAlerts.map(alert => {
                      const sevColor = alert.type === "critical" ? { bg: "rgba(244,63,94,0.15)", text: "#f43f5e" } : alert.type === "warning" ? { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" } : { bg: "rgba(99,102,241,0.15)", text: "#6366f1" };
                      return (
                        <TableRow key={alert.id} className="cursor-pointer border-border/40 hover:bg-white/[0.02]"
                          onClick={() => { setSelectedPatient(patientRoster.find(p => p.id === alert.patientId) ?? null); setActiveSection("patients"); }}>
                          <TableCell>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: sevColor.bg, color: sevColor.text }}>
                              {alert.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">
                            <span className="font-semibold text-foreground">{alert.patientName}</span>
                            <br /><span className="text-muted-foreground">{alert.patientId}</span>
                          </TableCell>
                          <TableCell className="text-xs text-foreground/80 max-w-[200px]">{alert.message}</TableCell>
                          <TableCell className="text-xs text-[#f43f5e] font-medium">{alert.vitals ?? "—"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{alert.timestamp}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {activeSection === "analytics" && (
          <div className="space-y-5 animate-fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Patients" value={patientRoster.length} icon={Users} color="#3b82f6" sub="Pilot cohort" />
              <MetricCard label="High Risk" value={highRiskCount} icon={AlertCircle} color="#f43f5e" sub="Need attention" glow />
              <MetricCard label="Active Alerts" value={allAlerts.length} icon={Bell} color="#f59e0b" sub={`${criticalAlerts.length} critical`} />
              <MetricCard label="Avg Health Score" value={avgScore} icon={TrendingUp} color="#10b981" sub="Moderate range" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={populationRiskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                        {populationRiskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [v, "Patients"]} contentStyle={chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  {populationRiskDistribution.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-xs mt-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-muted-foreground">{d.name}</span>
                      </span>
                      <span className="font-semibold tabular">{d.value} ({d.percentage}%)</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Compliance Metrics</CardTitle>
                  <CardDescription className="text-xs">Activity verification across cohort</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "High compliance (>80%)", value: 37, color: "#10b981" },
                    { label: "Moderate (55–80%)", value: 44, color: "#f59e0b" },
                    { label: "Low (<55%)", value: 19, color: "#f43f5e" },
                  ].map(c => (
                    <div key={c.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{c.label}</span>
                        <span className="font-bold tabular" style={{ color: c.color }}>{c.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.value}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── EXECUTION FRAMEWORK ── */}
        {activeSection === "execution" && (
          <div className="animate-fade-up">
            <ExecutionFramework />
          </div>
        )}

        {activeSection === "timeline" && <div className="animate-fade-up"><ClinicalTimeline /></div>}
        {activeSection === "records" && <div className="animate-fade-up"><MedicalRecords /></div>}
        {activeSection === "care" && <div className="animate-fade-up"><CareCoordination /></div>}

        <p className="text-center text-xs text-muted-foreground pt-6 pb-2">
          JIVA APHP · Provider Dashboard · HIPAA Aligned · FHIR Compatible · Role-Based Access Control
        </p>
      </DashboardShell>
      <MobileBottomNav navItems={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
    </>
  );
}
