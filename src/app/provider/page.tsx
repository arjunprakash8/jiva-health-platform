"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Activity, ArrowLeft, Bell, Search, Filter, AlertCircle,
  AlertTriangle, ChevronRight, Users, TrendingUp, Download,
  FileText, Video, Heart, Droplets, Thermometer, Wind,
  Footprints, Moon, CheckCircle, XCircle, Clock, Stethoscope, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, { variant: "danger" | "warning" | "success"; label: string }> = {
    high:     { variant: "danger",  label: "High Risk" },
    moderate: { variant: "warning", label: "Moderate" },
    low:      { variant: "success", label: "Low Risk" },
  };
  const c = map[risk] ?? map.low;
  return (
    <Badge variant={c.variant} className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${risk === "high" ? "animate-pulse" : ""}`}
        style={{ backgroundColor: risk === "high" ? "#ef4444" : risk === "moderate" ? "#f59e0b" : "#10b981" }} />
      {c.label}
    </Badge>
  );
}

function ScorePill({ score }: { score: number }) {
  const color = getScoreColor(score);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border"
      style={{ backgroundColor: color + "15", color, borderColor: color + "30" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />{score}
    </span>
  );
}

function PatientDetail({ patient }: { patient: Patient }) {
  const vitals = [
    { icon: Heart, label: "Heart Rate", value: `${patient.heartRate} bpm`, color: "#ef4444", warn: patient.heartRate > 85 },
    { icon: Droplets, label: "SpO₂", value: `${patient.spo2}%`, color: "#3b82f6", warn: patient.spo2 < 95 },
    { icon: Wind, label: "HRV (RMSSD)", value: `${patient.hrv} ms`, color: "#8b5cf6", warn: patient.hrv < 25 },
    { icon: Thermometer, label: "Skin Temp", value: `${patient.temperature}°C`, color: "#f59e0b", warn: patient.temperature > 37.2 },
    { icon: Footprints, label: "Steps", value: patient.steps.toLocaleString(), color: "#10b981", warn: false },
    { icon: Moon, label: "Sleep Score", value: `${patient.sleepScore}/100`, color: "#6366f1", warn: patient.sleepScore < 60 },
  ];

  const activeAlerts = patient.alerts.filter(a => !a.resolved);

  return (
    <div className="space-y-5">
      {/* Patient header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white">
        <div className="flex items-start justify-between mb-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-white/20 text-white font-bold">
              {patient.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <RiskBadge risk={patient.riskLevel} />
        </div>
        <h3 className="text-lg font-bold">{patient.name}</h3>
        <p className="text-blue-200 text-sm">{patient.age}y · {patient.gender} · {patient.id}</p>
        <p className="text-blue-200 text-xs mt-1">{patient.condition.join(", ")}</p>
        <div className="flex items-center gap-5 mt-4">
          {[
            { label: "Health Score", val: patient.healthScore, color: getScoreColor(patient.healthScore) },
            { label: "Compliance", val: `${patient.activityCompliance}%`, color: "white" },
            { label: "Battery", val: `${patient.ringBattery}%`, color: "white" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-extrabold" style={{ color: typeof s.color === "string" ? s.color : "#fff" }}>{s.val}</p>
              <p className="text-blue-200 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-2 gap-2">
        {vitals.map(v => (
          <Card key={v.label} className={v.warn ? "border-destructive/40" : ""}>
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <v.icon className="w-3.5 h-3.5" style={{ color: v.color }} />
                <span className="text-xs text-muted-foreground">{v.label}</span>
              </div>
              <p className="text-base font-bold">{v.value}</p>
              {v.warn && <p className="text-xs font-medium text-destructive mt-0.5">⚠ Elevated</p>}
            </CardContent>
          </Card>
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Video className="w-4 h-4" /> Teleconsult
        </Button>
        <Button variant="outline">
          <FileText className="w-4 h-4" /> Referral
        </Button>
        <Button variant="outline" className="col-span-2">
          <Download className="w-4 h-4" /> Export FHIR Data
        </Button>
      </div>
    </div>
  );
}

export default function ProviderDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "moderate" | "low">("all");

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

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="bg-card border-b px-6 py-3.5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link href="/"><ArrowLeft className="w-4 h-4" /> Back</Link>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">JIVA</span>
              <span className="text-muted-foreground text-sm">· Provider Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="w-3 h-3" /> Live · auto-refresh 30s
            </span>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {criticalAlerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
                  {criticalAlerts.length}
                </span>
              )}
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">DR</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-semibold leading-tight">Dr. Rebecca Owusu</p>
              <p className="text-xs text-muted-foreground">JIVA Clinical · Nairobi</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Patients", value: patientRoster.length, icon: Users, color: "#3b82f6", sub: "Pilot cohort" },
            { label: "High Risk", value: highRiskCount, icon: AlertCircle, color: "#ef4444", sub: "Require attention", pulse: true },
            { label: "Active Alerts", value: allAlerts.length, icon: Bell, color: "#f59e0b", sub: `${criticalAlerts.length} critical` },
            { label: "Avg Health Score", value: avgScore, icon: Activity, color: "#10b981", sub: "Moderate range" },
          ].map(kpi => (
            <Card key={kpi.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.color + "18" }}>
                    <kpi.icon className={`w-5 h-5 ${kpi.pulse ? "animate-pulse" : ""}`} style={{ color: kpi.color }} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-muted-foreground/40" />
                </div>
                <p className="text-3xl font-extrabold">{kpi.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-0.5">{kpi.label}</p>
                <p className="text-xs text-muted-foreground/70">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Critical Alert Banner */}
        {criticalAlerts.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 animate-pulse" />
            <AlertDescription>
              <p className="font-bold mb-2">{criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? "s" : ""} — Immediate Attention Required</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {criticalAlerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="bg-white/10 rounded-lg p-2.5 text-xs">
                    <p className="font-bold">{alert.patientName} · {alert.patientId}</p>
                    <p className="mt-0.5 opacity-90">{alert.message}</p>
                    {alert.vitals && <p className="mt-0.5 font-medium">{alert.vitals}</p>}
                    <p className="mt-1 opacity-60 flex items-center gap-1"><Clock className="w-3 h-3" />{alert.timestamp}</p>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Patient Roster */}
          <Card className="flex flex-col" style={{ maxHeight: "78vh" }}>
            <CardHeader className="pb-3 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle>Patient Roster</CardTitle>
                <Badge variant="secondary">{filteredPatients.length}/{patientRoster.length}</Badge>
              </div>
              <div className="relative mt-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-9 text-sm" />
              </div>
              <div className="flex gap-1 mt-2">
                {(["all", "high", "moderate", "low"] as const).map(r => (
                  <Button key={r} size="sm"
                    variant={riskFilter === r ? "default" : "ghost"}
                    className={`flex-1 h-7 text-xs ${riskFilter === r && r === "high" ? "bg-destructive hover:bg-destructive/90" : riskFilter === r && r === "moderate" ? "bg-amber-500 hover:bg-amber-600" : riskFilter === r && r === "low" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                    onClick={() => setRiskFilter(r)}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 overflow-y-auto">
              {filteredPatients.map(patient => (
                <button key={patient.id} onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${selectedPatient?.id === patient.id ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: getRiskColor(patient.riskLevel) }}>
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.age}y · {patient.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <ScorePill score={patient.healthScore} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 pl-[42px]">
                    {patient.condition.map(c => <Badge key={c} variant="secondary" className="text-xs py-0">{c}</Badge>)}
                    {patient.alerts.filter(a => !a.resolved && a.type === "critical").length > 0 && (
                      <Badge variant="danger" className="text-xs py-0 animate-pulse">
                        {patient.alerts.filter(a => !a.resolved && a.type === "critical").length} critical
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </ScrollArea>
          </Card>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-5">
            {selectedPatient ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Patient Detail</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)} className="text-muted-foreground">
                      <XCircle className="w-4 h-4 mr-1" /> Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent><PatientDetail patient={selectedPatient} /></CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Risk Distribution */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Risk Distribution</CardTitle>
                      <CardDescription>{patientRoster.length} patients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={populationRiskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                            {populationRiskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => [v, "Patients"]} contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 mt-2">
                        {populationRiskDistribution.map(d => (
                          <div key={d.name} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                              <span className="text-muted-foreground">{d.name}</span>
                            </span>
                            <span className="font-semibold">{d.value} ({d.percentage}%)</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alert Trend */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Weekly Alert Trend</CardTitle>
                      <CardDescription>Critical vs warning alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={alertTrend} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: "11px" }} />
                          <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[0,0,4,4]} />
                          <Bar dataKey="warning" name="Warning" stackId="a" fill="#f59e0b" radius={[4,4,0,0]} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* All Alerts Table */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>All Active Alerts</CardTitle>
                        <CardDescription>Click a row to view patient detail</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Filter className="w-3.5 h-3.5 mr-1" />Filter</Button>
                        <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />Export</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-64">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Severity</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Alert</TableHead>
                            <TableHead>Vitals</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allAlerts.map(alert => (
                            <TableRow key={alert.id} className="cursor-pointer"
                              onClick={() => setSelectedPatient(patientRoster.find(p => p.id === alert.patientId) ?? null)}>
                              <TableCell>
                                <Badge variant={alert.type === "critical" ? "danger" : alert.type === "warning" ? "warning" : "info"}>
                                  {alert.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-xs">{alert.patientName}<br /><span className="text-muted-foreground">{alert.patientId}</span></TableCell>
                              <TableCell className="text-xs max-w-[200px]">{alert.message}</TableCell>
                              <TableCell className="text-xs text-destructive font-medium">{alert.vitals ?? "—"}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{alert.timestamp}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">
          JIVA APHP · Provider Dashboard · HIPAA Aligned · FHIR Compatible · Role-Based Access Control
        </p>
      </main>
    </div>
  );
}
