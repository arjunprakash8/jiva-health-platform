"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, ReferenceLine,
} from "recharts";
import {
  Shield, TrendingDown, TrendingUp, Users, Activity,
  AlertCircle, CheckCircle, Download, BarChart3, DollarSign,
  Target, RefreshCw, LayoutDashboard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardShell from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/ui/metric-card";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import {
  populationRiskDistribution, complianceTrend, claimsProjection,
  tierDistribution, pilotKPIs, premiumAdjustments,
} from "@/lib/mockData";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: TrendingUp, label: "Compliance", id: "compliance" },
  { icon: DollarSign, label: "Claims", id: "claims" },
  { icon: Shield, label: "Premium", id: "premium" },
  { icon: Target, label: "Pilot KPIs", id: "kpis" },
];

const chartTooltipStyle = {
  backgroundColor: "hsl(240 22% 9%)",
  border: "1px solid hsl(240 12% 15%)",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#f0eeeb",
};

const axisTickStyle = { fill: "hsl(240 5% 48%)", fontSize: 10 };

export default function InsurerDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <>
      <DashboardShell
        navItems={navItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        role="insurer"
        userName="Amina Farooq"
        userInitials="AF"
        userSub="CIC Group · Insurer Portal"
        notificationCount={0}
        topBarTitle={navItems.find(n => n.id === activeSection)?.label ?? "Dashboard"}
        topBarSub={`Data as of ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · Nairobi Pilot`}
      >
        {/* ── OVERVIEW ── */}
        {activeSection === "overview" && (
          <div className="space-y-5 animate-fade-up">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Enrolled Members" value="500" icon={Users} color="#3b82f6" sub="Pilot cohort · Nairobi" trend="up" trendValue="+500 YTD" />
              <MetricCard label="Avg Compliance" value="88" unit="%" icon={Activity} color="#10b981" sub="↑ from 64% at launch" trend="up" trendValue="+24pp" />
              <MetricCard label="Claims Reduction" value="46" unit="%" icon={TrendingDown} color="#8b5cf6" sub="vs baseline by Dec 2025" trend="up" trendValue="On track" />
              <MetricCard label="Annual Savings" value="$46.9K" icon={DollarSign} color="#f59e0b" sub="Net across 500 members" trend="up" trendValue="vs baseline" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Risk distribution */}
              <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Population Risk Distribution</CardTitle>
                  <CardDescription className="text-xs">500 enrolled members</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={populationRiskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                        {populationRiskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [v, "Members"]} contentStyle={chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2.5 mt-2">
                    {populationRiskDistribution.map(d => (
                      <div key={d.name}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-muted-foreground">{d.name}</span>
                          </span>
                          <span className="font-semibold tabular">{d.value} ({d.percentage}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, backgroundColor: d.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Compliance trend chart */}
              <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">Compliance Trend</CardTitle>
                      <CardDescription className="text-xs">12-week rolling</CardDescription>
                    </div>
                    <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" /> 80% target hit
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={complianceTrend} margin={{ top: 4, right: 4, left: -25, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240 12% 13%)" />
                      <XAxis dataKey="week" tick={axisTickStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} domain={[50, 100]} />
                      <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, "Compliance"]} />
                      <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "80%", fill: "#f59e0b", fontSize: 9, position: "right" }} />
                      <Area type="monotone" dataKey="compliance" stroke="#8b5cf6" strokeWidth={2} fill="rgba(139,92,246,0.15)" name="compliance" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Cohort health scores */}
            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Health Score by Cohort</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Healthy", count: 228, avgScore: 82, color: "#10b981" },
                    { label: "Hypertension", count: 132, avgScore: 58, color: "#f59e0b" },
                    { label: "Type 2 Diabetes", count: 95, avgScore: 48, color: "#f43f5e" },
                    { label: "Comorbidities", count: 45, avgScore: 32, color: "#dc2626" },
                  ].map(c => (
                    <div key={c.label} className="rounded-xl border p-4 text-center" style={{ backgroundColor: c.color + "10", borderColor: c.color + "25" }}>
                      <p className="text-2xl font-extrabold metric-number" style={{ color: c.color }}>{c.avgScore}</p>
                      <p className="text-xs font-medium text-foreground/80 mt-1">{c.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.count} members</p>
                      <div className="mt-2 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.avgScore}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── COMPLIANCE ── */}
        {activeSection === "compliance" && (
          <div className="space-y-5 animate-fade-up">
            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">12-Week Compliance Trend</CardTitle>
                    <CardDescription className="text-xs">Activity verification rate across pilot cohort</CardDescription>
                  </div>
                  <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    <TrendingUp className="w-3 h-3 mr-1" /> Target exceeded — Week 7
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={complianceTrend} margin={{ top: 4, right: 4, left: -25, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240 12% 13%)" />
                    <XAxis dataKey="week" tick={axisTickStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} domain={[50, 100]} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, "Compliance"]} />
                    <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "80% Target", fill: "#f59e0b", fontSize: 10, position: "right" }} />
                    <Area type="monotone" dataKey="compliance" stroke="#8b5cf6" strokeWidth={2.5} fill="rgba(139,92,246,0.15)" name="compliance" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard label="3+ active days/week" value="67" unit="%" icon={CheckCircle} color="#10b981" sub="338 / 500 members" size="lg" />
              <MetricCard label="5+ active days/week" value="42" unit="%" icon={Target} color="#8b5cf6" sub="210 / 500 — Gold+ tier" size="lg" />
              <MetricCard label="Inactive (<2 days/week)" value="15" unit="%" icon={AlertCircle} color="#f43f5e" sub="75 / 500 — needs intervention" size="lg" glow />
            </div>

            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Incentive Optimisation Levers</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60">
                      <TableHead className="text-muted-foreground text-xs">Lever</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Description</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Projected Impact</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Rationale</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { lever: "Increase Multiplier", desc: "Raise cashback 10%→15%", impact: "+15% activity, −5% claims", rationale: "Apple Watch 34% uplift" },
                      { lever: "Lower Verification", desc: "Weekly goal: 5→3 active days", impact: "+20% participation", rationale: "SA inactivity epidemic" },
                      { lever: "Pre-Commitment", desc: "Auto-enrol; −20pts if non-compliant", impact: "+12% healthy behaviours", rationale: "Duke study: +3.5%" },
                      { lever: "AI Personalisation", desc: "Claims data → tailored goals", impact: "+25% vitality score", rationale: "50M+ life-years data" },
                      { lever: "Inactivity Penalty", desc: "+10% premium — zero-activity month", impact: "−25% inactivity, −40% severity", rationale: "Vitality Drive 30–34%" },
                    ].map((row, i) => (
                      <TableRow key={i} className="border-border/40 hover:bg-white/[0.02]">
                        <TableCell className="font-semibold text-[#8b5cf6] text-xs">{row.lever}</TableCell>
                        <TableCell className="text-xs text-foreground/80">{row.desc}</TableCell>
                        <TableCell className="text-xs text-[#10b981] font-medium">{row.impact}</TableCell>
                        <TableCell className="text-xs text-muted-foreground italic">{row.rationale}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── CLAIMS ── */}
        {activeSection === "claims" && (
          <div className="space-y-5 animate-fade-up">
            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Claims Cost Index (Baseline = 100)</CardTitle>
                    <CardDescription className="text-xs">Actual vs projected with JIVA programme</CardDescription>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#7c3aed] inline-block rounded" /> Actual</span>
                    <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#a78bfa] inline-block rounded border-dashed" /> Projected</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={claimsProjection} margin={{ top: 4, right: 4, left: -25, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240 12% 13%)" />
                    <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} domain={[40, 110]} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number | string) => [v != null ? `${v}` : "—", ""]} />
                    <ReferenceLine y={100} stroke="hsl(240 12% 20%)" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2.5} fill="rgba(124,58,237,0.15)" name="actual" connectNulls />
                    <Line type="monotone" dataKey="projected" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 3" name="projected" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Claims Reduction (Now)" value="17" unit="%" icon={TrendingDown} color="#10b981" sub="vs programme start" />
              <MetricCard label="Projected by Dec 2025" value="46" unit="%" icon={Target} color="#8b5cf6" sub="On trajectory" />
              <MetricCard label="Avg Claims/Member" value="$2,140" icon={DollarSign} color="#3b82f6" sub="Down from $2,580" />
              <MetricCard label="Programme Net ROI" value="3.4×" icon={TrendingUp} color="#f59e0b" sub="Projected 24 months" />
            </div>

            <Alert variant="info">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold text-sm">AI-Powered Risk Scoring</p>
                <p className="mt-1 text-xs text-muted-foreground">JIVA&apos;s multi-sensor fusion model (ECG · PPG · HRV · SpO₂ · BIA · Temperature) generates a normalised Health Score (0–100) used for actuarial modelling. High-risk flags (score ≤40) trigger clinician review workflows, reducing late-stage intervention costs by an estimated 40%.</p>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* ── PREMIUM ── */}
        {activeSection === "premium" && (
          <div className="space-y-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Premium Adjustment Recommendations</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Based on wellness compliance, health score, and activity tier</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs border-border"><Download className="w-3.5 h-3.5 mr-1" />Export CSV</Button>
            </div>

            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/60">
                      <TableHead className="text-muted-foreground text-xs">Cohort</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Members</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Premium Adj.</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Cashback</TableHead>
                      <TableHead className="text-muted-foreground text-xs">Net Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {premiumAdjustments.map((row, i) => {
                      const isNeg = row.savings.startsWith("-");
                      const adjColor = row.adjustment.startsWith("-") ? "#10b981" : row.adjustment === "0%" ? "#94a3b8" : "#f43f5e";
                      return (
                        <TableRow key={i} className="border-border/40 hover:bg-white/[0.02]">
                          <TableCell className="font-medium text-sm text-foreground">{row.cohort}</TableCell>
                          <TableCell className="text-sm tabular text-foreground/80">{row.users}</TableCell>
                          <TableCell>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: adjColor + "18", color: adjColor }}>
                              {row.adjustment}
                            </span>
                          </TableCell>
                          <TableCell className="text-[#10b981] font-semibold text-sm tabular">{row.cashback}</TableCell>
                          <TableCell className={`font-bold text-sm tabular ${isNeg ? "text-[#f43f5e]" : "text-[#10b981]"}`}>{row.savings}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="border-border/60">
                      <TableCell className="font-bold text-[#8b5cf6] text-sm">Total (500 members)</TableCell>
                      <TableCell className="font-bold text-foreground tabular">500</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="font-extrabold text-[#10b981] text-base tabular">$46,940</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <p className="text-xs font-bold text-foreground mb-3">Status Points Formula</p>
                <div className="rounded-lg bg-[#f59e0b]/8 border border-[#f59e0b]/20 px-3 py-2 mb-3">
                  <code className="text-xs text-[#f59e0b]">Status Points = (Activity × Multiplier) − Inactivity Penalty</code>
                </div>
                {["Bronze (0–999): standard premium", "Silver (1,000–2,499): 5% cashback", "Gold (2,500–4,999): 10% cashback", "Platinum (5,000–7,499): 12% cashback", "Diamond (7,500+): 15% cashback + free band"].map((t, i) => (
                  <p key={t} className="text-xs text-muted-foreground">
                    <span style={{ color: ["#b45309","#64748b","#f59e0b","#94a3b8","#a78bfa"][i] }}>•</span> {t}
                  </p>
                ))}
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <p className="text-xs font-bold text-foreground mb-3">Evidence Base</p>
                {[
                  "Apple Watch + Discovery: 34% activity uplift",
                  "Vitality Drive: 30–34% claims reduction",
                  "Duke Study: Pre-commitment +3.5% adherence",
                  "2025 Health Pathways: 42% COVID risk reduction",
                  "ObeCity Index: 60%+ overweight — lower goals drive inclusion",
                ].map(e => <p key={e} className="text-xs text-muted-foreground">• {e}</p>)}
              </div>
            </div>
          </div>
        )}

        {/* ── PILOT KPIs ── */}
        {activeSection === "kpis" && (
          <div className="space-y-5 animate-fade-up">
            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Pilot Programme KPIs</CardTitle>
                    <CardDescription className="text-xs">500 enrolled users · Nairobi pilot cohort</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Live monitoring</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: "Device Uptime", value: pilotKPIs.deviceUptime, target: 98, unit: "%", color: "#10b981", icon: Activity, inverted: false },
                    { label: "Sync Success", value: pilotKPIs.syncSuccessRate, target: 99, unit: "%", color: "#3b82f6", icon: RefreshCw, inverted: false },
                    { label: "Failure Rate", value: pilotKPIs.failureRate, target: 1, unit: "%", color: pilotKPIs.failureRate < 1 ? "#10b981" : "#f43f5e", icon: AlertCircle, inverted: true },
                    { label: "Compliance", value: pilotKPIs.avgCompliance, target: 80, unit: "%", color: "#f59e0b", icon: Target, inverted: false },
                    { label: "Avg Health Score", value: pilotKPIs.avgHealthScore, target: 70, unit: "", color: "#8b5cf6", icon: BarChart3, inverted: false },
                  ].map(kpi => {
                    const met = kpi.inverted ? kpi.value <= kpi.target : kpi.value >= kpi.target;
                    const progress = kpi.inverted
                      ? Math.max(0, (1 - kpi.value / 2) * 100)
                      : kpi.value;
                    return (
                      <div key={kpi.label} className="text-center space-y-2">
                        {/* Circular ring */}
                        <div className="relative w-16 h-16 mx-auto">
                          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                            <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(240 12% 15%)" strokeWidth="7" />
                            <circle cx="32" cy="32" r="26" fill="none" stroke={kpi.color} strokeWidth="7" strokeLinecap="round"
                              strokeDasharray={`${(progress / 100) * 163} 163`} style={{ transition: "stroke-dasharray 1s ease-out" }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                          </div>
                        </div>
                        <p className="text-lg font-extrabold metric-number" style={{ color: kpi.color }}>{kpi.value}{kpi.unit}</p>
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        <span
                          className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={met
                            ? { backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981" }
                            : { backgroundColor: "rgba(244,63,94,0.15)", color: "#f43f5e" }}
                        >
                          {met ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {kpi.inverted ? "<" : ">"}{kpi.target}{kpi.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Separator className="bg-border/60" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Enrolled", value: pilotKPIs.totalUsers, color: "#3b82f6" },
                { label: "Active Devices", value: pilotKPIs.activeDevices, color: "#10b981" },
                { label: "Active Alerts", value: pilotKPIs.highRiskAlerts, color: "#f43f5e" },
                { label: "Resolved", value: pilotKPIs.resolvedAlerts, color: "#f59e0b" },
              ].map(item => (
                <div key={item.label} className="text-center rounded-xl border p-4" style={{ backgroundColor: item.color + "10", borderColor: item.color + "25" }}>
                  <p className="text-2xl font-extrabold metric-number" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Tier distribution */}
            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Wellness Tier Distribution</CardTitle>
                <CardDescription className="text-xs">Status tier breakdown across 500 members</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={tierDistribution} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(240 12% 13%)" />
                    <XAxis type="number" tick={axisTickStyle} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="tier" tick={{ fontSize: 11, fill: "#f0eeeb" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [v, "Members"]} contentStyle={chartTooltipStyle} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {tierDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Compliance and data governance */}
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <p className="text-xs font-semibold text-foreground mb-3">Compliance & Data Governance</p>
              <div className="flex flex-wrap gap-2">
                {["HIPAA Aligned", "ODPC (Kenya)", "SOC 3 Ready", "AES-256", "TLS 1.3", "DSAR Supported", "Right to Erasure", "Auditable Consent"].map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-[#10b981]" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground pt-6 pb-2">
          JIVA APHP · Insurer Dashboard · Population Health Analytics · HIPAA Aligned · ODPC (Kenya) Compliant
        </p>
      </DashboardShell>
      <MobileBottomNav navItems={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
    </>
  );
}
