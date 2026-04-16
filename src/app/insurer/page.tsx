"use client";

import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, ReferenceLine,
} from "recharts";
import {
  Shield, ArrowLeft, TrendingDown, TrendingUp, Users, Activity,
  AlertCircle, CheckCircle, Download, BarChart3, DollarSign,
  Target, Clock, RefreshCw, Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  populationRiskDistribution, complianceTrend, claimsProjection,
  tierDistribution, pilotKPIs, premiumAdjustments,
} from "@/lib/mockData";

function KPICard({ label, value, sub, icon: Icon, color, trend, trendLabel }: {
  label: string; value: string; sub: string; icon: React.ElementType;
  color: string; trend?: "up" | "down" | "neutral"; trendLabel?: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          {trend && trendLabel && (
            <Badge variant={trend === "up" ? "success" : trend === "down" ? "danger" : "secondary"}
              className="flex items-center gap-1">
              {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
              {trendLabel}
            </Badge>
          )}
        </div>
        <p className="text-3xl font-extrabold">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">{label}</p>
        <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

function PilotKPIPanel() {
  const kpis = [
    { label: "Device Uptime", value: pilotKPIs.deviceUptime, target: 98, unit: "%", color: "#10b981", icon: Activity },
    { label: "Sync Success", value: pilotKPIs.syncSuccessRate, target: 99, unit: "%", color: "#3b82f6", icon: RefreshCw },
    { label: "Failure Rate", value: pilotKPIs.failureRate, target: 1, unit: "%", color: pilotKPIs.failureRate < 1 ? "#10b981" : "#ef4444", icon: AlertCircle, inverted: true },
    { label: "Compliance", value: pilotKPIs.avgCompliance, target: 80, unit: "%", color: "#f59e0b", icon: Target },
    { label: "Avg Health Score", value: pilotKPIs.avgHealthScore, target: 70, unit: "", color: "#8b5cf6", icon: BarChart3 },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pilot Programme KPIs</CardTitle>
            <CardDescription>500 enrolled users · Nairobi pilot cohort</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live monitoring</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {kpis.map(kpi => {
            const met = kpi.inverted ? kpi.value <= kpi.target : kpi.value >= kpi.target;
            return (
              <div key={kpi.label} className="text-center space-y-2">
                <div className="relative w-14 h-14 mx-auto">
                  <svg viewBox="0 0 56 56" className="transform -rotate-90 w-14 h-14">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
                    <circle cx="28" cy="28" r="22" fill="none" stroke={kpi.color} strokeWidth="7" strokeLinecap="round"
                      strokeDasharray={`${(kpi.inverted ? Math.max(0, 1 - kpi.value / 2) : kpi.value / 100) * 138} 138`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-lg font-extrabold" style={{ color: kpi.color }}>{kpi.value}{kpi.unit}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <Badge variant={met ? "success" : "danger"} className="text-xs">
                  {met ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                  {kpi.inverted ? "<" : ">"}{kpi.target}{kpi.unit}
                </Badge>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Enrolled", value: pilotKPIs.totalUsers, color: "#3b82f6" },
            { label: "Active Devices", value: pilotKPIs.activeDevices, color: "#10b981" },
            { label: "Active Alerts", value: pilotKPIs.highRiskAlerts, color: "#ef4444" },
            { label: "Resolved", value: pilotKPIs.resolvedAlerts, color: "#f59e0b" },
          ].map(item => (
            <div key={item.label} className="text-center p-3 rounded-xl border" style={{ backgroundColor: item.color + "10", borderColor: item.color + "25" }}>
              <p className="text-xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function InsurerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="bg-card border-b px-6 py-3.5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link href="/"><ArrowLeft className="w-4 h-4" /> Back</Link>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">JIVA</span>
              <span className="text-muted-foreground text-sm">· Insurer Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" /> Data as of {new Date().toLocaleDateString()}
            </span>
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1" /> Export Report
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold">AF</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-semibold leading-tight">Amina Farooq</p>
              <p className="text-xs text-muted-foreground">CIC Group · Insurer Portal</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-5">
        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Enrolled Members" value="500" sub="Pilot cohort · Nairobi" icon={Users} color="#3b82f6" trend="up" trendLabel="+500 YTD" />
          <KPICard label="Avg Wellness Compliance" value="88%" sub="↑ from 64% at launch" icon={Activity} color="#10b981" trend="up" trendLabel="+24pp" />
          <KPICard label="Projected Claims Reduction" value="46%" sub="vs baseline by Dec 2025" icon={TrendingDown} color="#8b5cf6" trend="up" trendLabel="on track" />
          <KPICard label="Projected Annual Savings" value="$46.9K" sub="Net across 500 members" icon={DollarSign} color="#f59e0b" trend="up" trendLabel="vs baseline" />
        </div>

        {/* Pilot KPIs */}
        <PilotKPIPanel />

        {/* Tabbed content */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b px-5">
                <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none">
                  {["overview", "compliance", "claims", "premiums"].map(tab => (
                    <TabsTrigger key={tab} value={tab}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-5 py-4 text-sm font-medium capitalize">
                      {tab === "premiums" ? "Premium Adj." : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* ── OVERVIEW ── */}
              <TabsContent value="overview" className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <h3 className="text-sm font-semibold mb-4">Population Risk Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={populationRiskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                          {populationRiskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [v, "Members"]} contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: "11px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3 mt-2">
                      {populationRiskDistribution.map(d => (
                        <div key={d.name}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                              <span className="text-muted-foreground">{d.name}</span>
                            </span>
                            <span className="font-semibold">{d.value} ({d.percentage}%)</span>
                          </div>
                          <Progress value={d.percentage} className="h-1.5" style={{ "--progress-color": d.color } as React.CSSProperties} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-4">Wellness Tier Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={tierDistribution} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="tier" tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(v: number) => [v, "Members"]} contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: "11px" }} />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                          {tierDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <Alert variant="warning" className="mt-4">
                      <AlertDescription className="text-xs">
                        <p className="font-medium">Status Points = (Activity × Multiplier) − Inactivity Penalty</p>
                        <p className="mt-1">Diamond members show 42% fewer claims vs Bronze tier members.</p>
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold mb-3">Health Score by Cohort</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Healthy", count: 228, avgScore: 82, color: "#10b981" },
                        { label: "Hypertension", count: 132, avgScore: 58, color: "#f59e0b" },
                        { label: "Type 2 Diabetes", count: 95, avgScore: 48, color: "#ef4444" },
                        { label: "Comorbidities", count: 45, avgScore: 32, color: "#dc2626" },
                      ].map(c => (
                        <div key={c.label} className="text-center p-4 rounded-xl border" style={{ backgroundColor: c.color + "10", borderColor: c.color + "25" }}>
                          <p className="text-2xl font-extrabold" style={{ color: c.color }}>{c.avgScore}</p>
                          <p className="text-xs font-medium mt-1">{c.label}</p>
                          <p className="text-xs text-muted-foreground">{c.count} members</p>
                          <Progress value={c.avgScore} className="mt-2 h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ── COMPLIANCE ── */}
              <TabsContent value="compliance" className="p-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold">12-Week Compliance Trend</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Activity verification rate across pilot cohort</p>
                    </div>
                    <Badge variant="success" className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Target 80% exceeded — Week 7
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={complianceTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                      <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: "11px" }} formatter={(v: number) => [`${v}%`, "Compliance"]} />
                      <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "80% Target", fill: "#f59e0b", fontSize: 10, position: "right" }} />
                      <Area type="monotone" dataKey="compliance" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf620" name="compliance" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "3+ active days/week", value: "67%", sub: "338 / 500 members", color: "#10b981", icon: CheckCircle },
                    { label: "5+ active days/week", value: "42%", sub: "210 / 500 — Gold+ tier", color: "#8b5cf6", icon: Target },
                    { label: "Inactive (<2 days/week)", value: "15%", sub: "75 / 500 — intervention needed", color: "#ef4444", icon: AlertCircle },
                  ].map(s => (
                    <Card key={s.label}>
                      <CardContent className="p-4">
                        <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
                        <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                        <p className="text-xs font-medium mt-0.5">{s.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">Incentive Optimisation Levers</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lever</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Projected Impact</TableHead>
                        <TableHead>Rationale</TableHead>
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
                        <TableRow key={i}>
                          <TableCell className="font-semibold text-violet-700 text-xs">{row.lever}</TableCell>
                          <TableCell className="text-xs">{row.desc}</TableCell>
                          <TableCell className="text-xs text-emerald-600 font-medium">{row.impact}</TableCell>
                          <TableCell className="text-xs text-muted-foreground italic">{row.rationale}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* ── CLAIMS ── */}
              <TabsContent value="claims" className="p-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold">Claims Cost Index (Baseline = 100)</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Actual vs projected with JIVA programme</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-violet-600 inline-block" /> Actual</span>
                      <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-violet-300 inline-block border-dashed" /> Projected</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={claimsProjection} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[40, 110]} />
                      <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: "11px" }} formatter={(v: number | string) => [v != null ? `${v}` : "—", ""]} />
                      <Area type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2.5} fill="#7c3aed20" name="actual" connectNulls />
                      <Line type="monotone" dataKey="projected" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 3" name="projected" dot={false} />
                      <ReferenceLine y={100} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Claims Reduction (Now)", value: "17%", sub: "vs programme start", color: "#10b981" },
                    { label: "Projected by Dec 2025", value: "46%", sub: "on trajectory", color: "#8b5cf6" },
                    { label: "Avg Claims/Member", value: "$2,140", sub: "down from $2,580", color: "#3b82f6" },
                    { label: "Programme Net ROI", value: "3.4×", sub: "projected 24 months", color: "#f59e0b" },
                  ].map(s => (
                    <div key={s.label} className="p-4 rounded-xl text-center border" style={{ backgroundColor: s.color + "10", borderColor: s.color + "25" }}>
                      <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs font-medium mt-1">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>

                <Alert variant="info">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-semibold text-sm">AI-Powered Risk Scoring</p>
                    <p className="mt-1 text-xs">JIVA's multi-sensor fusion model (ECG · PPG · HRV · SpO₂ · BIA · Temperature) generates a normalised Health Score (0–100) used for actuarial modelling. High-risk flags (score ≤40) trigger clinician review workflows, reducing late-stage intervention costs by an estimated 40%.</p>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* ── PREMIUMS ── */}
              <TabsContent value="premiums" className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Premium Adjustment Recommendations</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Based on wellness compliance, health score, and activity tier</p>
                  </div>
                  <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" />Export CSV</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cohort</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Premium Adj.</TableHead>
                      <TableHead>Cashback</TableHead>
                      <TableHead>Net Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {premiumAdjustments.map((row, i) => {
                      const isNeg = row.savings.startsWith("-");
                      return (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm">{row.cohort}</TableCell>
                          <TableCell className="text-sm">{row.users}</TableCell>
                          <TableCell>
                            <Badge variant={row.adjustment.startsWith("-") ? "success" : row.adjustment === "0%" ? "secondary" : "danger"}>
                              {row.adjustment}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-emerald-600 font-semibold text-sm">{row.cashback}</TableCell>
                          <TableCell className={`font-bold text-sm ${isNeg ? "text-destructive" : "text-emerald-600"}`}>{row.savings}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold text-violet-800">Total (500 members)</TableCell>
                      <TableCell className="font-bold">500</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="font-extrabold text-emerald-600 text-base">$46,940</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert variant="warning">
                    <AlertDescription>
                      <p className="font-bold text-sm mb-2">Status Points Formula</p>
                      <code className="text-xs block bg-amber-100 rounded px-2 py-1.5 mb-2">
                        Status Points = (Activity × Incentive Multiplier) − Inactivity Penalty
                      </code>
                      {["Bronze (0–999): standard premium", "Silver (1000–2499): 5% cashback", "Gold (2500–4999): 10% cashback", "Platinum (5000–7499): 12% cashback", "Diamond (7500+): 15% cashback + free ring"].map(t => (
                        <p key={t} className="text-xs">• {t}</p>
                      ))}
                    </AlertDescription>
                  </Alert>
                  <Alert variant="success">
                    <AlertDescription>
                      <p className="font-bold text-sm mb-2">Evidence Base</p>
                      {[
                        "📊 Apple Watch + Discovery: 34% activity uplift",
                        "📊 Vitality Drive: 30–34% claims reduction",
                        "📊 Duke Study: Pre-commitment +3.5% adherence",
                        "📊 2025 Health Pathways: 42% COVID risk reduction",
                        "📊 ObeCity Index: 60%+ overweight — lower goals drive inclusion",
                      ].map(e => <p key={e} className="text-xs">{e}</p>)}
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-xs font-semibold mb-2">Compliance & Data Governance</p>
                  <div className="flex flex-wrap gap-2">
                    {["HIPAA Aligned", "ODPC (Kenya)", "SOC 3 Ready", "AES-256", "TLS 1.3", "DSAR Supported", "Right to Erasure", "Auditable Consent"].map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">✓ {tag}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground pb-4">
          JIVA APHP · Insurer Dashboard · Population Health Analytics · HIPAA Aligned · ODPC (Kenya) Compliant
        </p>
      </main>
    </div>
  );
}
