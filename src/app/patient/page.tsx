"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine,
} from "recharts";
import {
  Heart, Activity, Thermometer, Droplets, Moon, Footprints,
  Battery, Wifi, Bell, ArrowLeft, TrendingUp, TrendingDown,
  AlertCircle, Info, ChevronRight, Zap, Award, RefreshCw, Wind,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  currentPatient, activityTrend, heartRateTrend, spo2Trend, hrvTrend,
  sleepData, healthScoreHistory, generateECGData,
  getScoreColor, getScoreLabel, tierConfig,
} from "@/lib/mockData";

function HealthScoreGauge({ score }: { score: number }) {
  const color = getScoreColor(score);
  const circumference = Math.PI * 80;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-28 overflow-hidden">
        <svg width="208" height="112" viewBox="-4 -4 216 120" className="overflow-visible">
          <path d="M 8 104 A 80 80 0 0 1 192 104" fill="none" stroke="hsl(var(--muted))" strokeWidth="16" strokeLinecap="round" />
          <path d="M 8 104 A 80 80 0 0 1 192 104" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
          <text x="4" y="120" fontSize="9" fill="#ef4444" fontWeight="600">0</text>
          <text x="90" y="8" fontSize="9" fill="#f59e0b" fontWeight="600" textAnchor="middle">50</text>
          <text x="192" y="120" fontSize="9" fill="#10b981" fontWeight="600" textAnchor="end">100</text>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl font-extrabold" style={{ color }}>{score}</span>
          <span className="text-xs font-semibold text-muted-foreground -mt-0.5">{getScoreLabel(score)}</span>
        </div>
      </div>
    </div>
  );
}

function VitalCard({ icon: Icon, label, value, unit, sub, color, trend }: {
  icon: React.ElementType; label: string; value: string | number; unit: string;
  sub?: string; color: string; trend?: "up" | "down" | "stable";
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          {trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
          {trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground mb-0.5">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="text-xs font-medium mt-1" style={{ color }}>{sub}</p>}
      </CardContent>
    </Card>
  );
}

function ECGWaveform() {
  const [data, setData] = useState(generateECGData(150));
  useEffect(() => {
    const interval = setInterval(() => setData(generateECGData(150)), 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-slate-200">Live ECG</span>
            <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-800 text-xs">500 Hz · 24-bit ADC</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" /> 73 bpm</span>
            <span>Normal Sinus Rhythm</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={90}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 4 }}>
            <Line type="monotone" dataKey="y" stroke="#34d399" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
            <YAxis domain={[-25, 95]} tick={{ fill: "#475569", fontSize: 9 }} />
            <XAxis dataKey="x" hide />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3 text-xs text-slate-500">
          <span>P wave ✓</span><span>QRS complex ✓</span><span>T wave ✓</span>
          <span className="text-emerald-400 font-medium ml-auto">No anomalies detected</span>
        </div>
      </CardContent>
    </Card>
  );
}

function TierCard({ tier, points }: { tier: string; points: number }) {
  const config = tierConfig[tier as keyof typeof tierConfig];
  const tiers = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
  const idx = tiers.indexOf(tier);
  const nextTier = tiers[idx + 1];
  const nextConfig = nextTier ? tierConfig[nextTier as keyof typeof tierConfig] : null;
  const progress = nextConfig ? ((points - config.min) / (nextConfig.min - config.min)) * 100 : 100;

  const tierColors: Record<string, string> = {
    Bronze: "#b45309", Silver: "#64748b", Gold: "#f59e0b", Platinum: "#94a3b8", Diamond: "#a78bfa",
  };
  const tierEmoji: Record<string, string> = {
    Bronze: "🥉", Silver: "🥈", Gold: "🥇", Platinum: "💎", Diamond: "✨",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Status Tier</CardTitle>
          <Award className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-extrabold" style={{ color: tierColors[tier] }}>
            {tierEmoji[tier]} {tier}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span className="font-semibold text-foreground">{points.toLocaleString()} pts</span>
            {nextTier && <span>{nextConfig!.min.toLocaleString()} pts for {nextTier}</span>}
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2.5" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
            <p className="text-xs font-bold text-emerald-700">×1.15</p>
            <p className="text-xs text-muted-foreground">Multiplier</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
            <p className="text-xs font-bold text-blue-700">85%</p>
            <p className="text-xs text-muted-foreground">Compliance</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-2 border border-violet-100">
            <p className="text-xs font-bold text-violet-700">0 pts</p>
            <p className="text-xs text-muted-foreground">Penalty</p>
          </div>
        </div>

        <Alert variant="warning" className="py-2.5">
          <AlertDescription>
            <p className="font-medium text-xs">Status Points = (Activity × 1.15) − 0</p>
            <p className="mt-0.5 text-xs">
              {nextTier
                ? `${(nextConfig!.min - points).toLocaleString()} pts to ${nextTier}`
                : "Maximum tier reached! 🎉"}
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

const vitalChartData = { hr: heartRateTrend, spo2: spo2Trend, hrv: hrvTrend };
const vitalChartColor = { hr: "#ef4444", spo2: "#3b82f6", hrv: "#8b5cf6" };
const vitalChartLabel = { hr: "Heart Rate (bpm)", spo2: "SpO₂ (%)", hrv: "HRV (ms)" };

export default function PatientDashboard() {
  const p = currentPatient;

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-foreground">JIVA</span>
              <span className="text-muted-foreground text-sm">· Patient Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Ring Connected</span>
              <span className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5 text-emerald-500" />{p.ringBattery}%</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" />{p.lastSync}</span>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {p.alerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-white text-xs flex items-center justify-center font-bold">{p.alerts.length}</span>
              )}
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-500 text-white text-xs font-bold">
                  {p.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-semibold leading-tight">{p.name}</p>
                <p className="text-xs text-muted-foreground">ID: {p.id}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-5">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Good morning, {p.name.split(" ")[0]} 👋</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })} · JIVA Ring Active
            </p>
          </div>
          <Card className="border-border/60">
            <CardContent className="py-2.5 px-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-emerald-500" />BLE 5.0 · Real-time</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5 text-emerald-500" />{p.ringBattery}%</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" />Synced {p.lastSync}</span>
            </CardContent>
          </Card>
        </div>

        {/* Row 1: Health Score + Tier + Vitals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Health Score */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>AI Health Score</CardTitle>
                <Badge variant="secondary">Multi-sensor fusion</Badge>
              </div>
              <CardDescription>0–100 composite from ECG, PPG, HRV, SpO₂, Temp, BIA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <HealthScoreGauge score={p.healthScore} />
              <div className="grid grid-cols-3 gap-2 text-center">
                {[{ label: "0–40", color: "#ef4444", name: "High Risk" }, { label: "41–70", color: "#f59e0b", name: "Moderate" }, { label: "71–100", color: "#10b981", name: "Low Risk" }].map(z => (
                  <div key={z.label} className="rounded-lg p-2 border" style={{ backgroundColor: z.color + "12", borderColor: z.color + "30" }}>
                    <p className="text-xs font-bold" style={{ color: z.color }}>{z.label}</p>
                    <p className="text-xs text-muted-foreground">{z.name}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">30-Day Trend</p>
                <ResponsiveContainer width="100%" height={50}>
                  <AreaChart data={healthScoreHistory} margin={{ top: 2, right: 2, left: -40, bottom: 2 }}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={1.5} fill="url(#sg)" dot={false} />
                    <ReferenceLine y={70} stroke="#94a3b8" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tier */}
          <TierCard tier={p.tier} points={p.statusPoints} />

          {/* Vitals grid */}
          <div className="grid grid-cols-2 gap-3">
            <VitalCard icon={Heart} label="Heart Rate" value={p.heartRate} unit="bpm" sub="Normal range" color="#ef4444" trend="stable" />
            <VitalCard icon={Droplets} label="SpO₂" value={p.spo2} unit="%" sub="Excellent" color="#3b82f6" trend="stable" />
            <VitalCard icon={Wind} label="HRV" value={p.hrv} unit="ms" sub="RMSSD · Good" color="#8b5cf6" trend="up" />
            <VitalCard icon={Thermometer} label="Skin Temp" value={p.temperature} unit="°C" sub="±0.2°C acc." color="#f59e0b" trend="stable" />
          </div>
        </div>

        {/* Row 2: ECG + Steps/Sleep */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><ECGWaveform /></div>
          <div className="grid grid-rows-2 gap-3">
            <VitalCard icon={Footprints} label="Steps Today" value={p.steps.toLocaleString()} unit="steps" sub={`${Math.round((p.steps / 10000) * 100)}% of daily goal`} color="#10b981" trend="up" />
            <VitalCard icon={Moon} label="Sleep Score" value={p.sleepScore} unit="/100" sub="7h 4min · Good" color="#6366f1" trend="up" />
          </div>
        </div>

        {/* Row 3: Activity + Sleep + Vital Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Steps vs 10,000 daily target</CardDescription>
                </div>
                <Badge variant="success" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18% vs last week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={activityTrend} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(v: number) => [v.toLocaleString(), "Steps"]} />
                  <ReferenceLine y={10000} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "Goal", fill: "#f59e0b", fontSize: 10 }} />
                  <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
                    {activityTrend.map((entry) => (
                      <Cell key={entry.day} fill={entry.steps >= 10000 ? "#10b981" : "#60a5fa"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-emerald-500 inline-block" />Goal met</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-blue-400 inline-block" />Below target</span>
                <span className="flex items-center gap-1.5 ml-auto"><Zap className="w-3 h-3 text-amber-500" />Active days: 5/7</span>
              </div>
            </CardContent>
          </Card>

          {/* Sleep */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Last Night Sleep</CardTitle>
                <Moon className="w-4 h-4 text-indigo-400" />
              </div>
              <CardDescription>7h 0min · Score: {p.sleepScore}/100</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={sleepData} cx="50%" cy="50%" innerRadius={32} outerRadius={48} paddingAngle={3} dataKey="hours">
                    {sleepData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}h`, ""]} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {sleepData.map(s => (
                  <div key={s.stage} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-muted-foreground">{s.stage}</span>
                    </span>
                    <span className="font-semibold">{s.hours}h</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 4: Vital Trend Tabs + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>7-Day Vital Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="hr">
                <TabsList className="mb-4">
                  <TabsTrigger value="hr">Heart Rate</TabsTrigger>
                  <TabsTrigger value="spo2">SpO₂</TabsTrigger>
                  <TabsTrigger value="hrv">HRV</TabsTrigger>
                </TabsList>
                {(["hr", "spo2", "hrv"] as const).map(v => (
                  <TabsContent key={v} value={v}>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={vitalChartData[v]} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`vg-${v}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={vitalChartColor[v]} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={vitalChartColor[v]} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} formatter={(val: number) => [val, vitalChartLabel[v]]} />
                        <Area type="monotone" dataKey="value" stroke={vitalChartColor[v]} strokeWidth={2} fill={`url(#vg-${v})`} dot={{ r: 4, fill: vitalChartColor[v], strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                {p.alerts.length > 0 && <Badge variant="info">{p.alerts.length} new</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {p.alerts.map(a => (
                <Alert key={a.id} variant={a.type === "critical" ? "destructive" : a.type === "warning" ? "warning" : "info"}>
                  {a.type === "critical" ? <AlertCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  <AlertDescription>
                    <p className="font-medium text-xs">{a.message}</p>
                    <p className="text-xs opacity-70 mt-0.5">{a.timestamp}</p>
                  </AlertDescription>
                </Alert>
              ))}
              {p.alerts.length === 0 && (
                <div className="text-center py-6">
                  <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All clear — no alerts</p>
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full mt-2">
                View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Row 5: BIA */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bio-Impedance Analysis (BIA)</CardTitle>
                <CardDescription>Multi-frequency · 5kHz–1MHz · Body composition estimation</CardDescription>
              </div>
              <Badge variant="secondary">Last reading: 6:30 AM</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Body Fat", value: "18.4%", sub: "Athletic range", color: "#3b82f6" },
                { label: "Muscle Mass", value: "68.2 kg", sub: "Above average", color: "#10b981" },
                { label: "Hydration", value: "62.1%", sub: "Well hydrated", color: "#06b6d4" },
                { label: "ECW/ICW", value: "0.38", sub: "Normal ratio", color: "#8b5cf6" },
                { label: "Phase Angle", value: "7.2°", sub: "Excellent", color: "#f59e0b" },
              ].map(m => (
                <div key={m.label} className="text-center p-3 rounded-xl border" style={{ backgroundColor: m.color + "10", borderColor: m.color + "25" }}>
                  <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-xs font-medium mt-0.5">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground pb-4">
          JIVA APHP · Patient Dashboard · For informational purposes only · HIPAA Aligned · ODPC (Kenya) Compliant
        </p>
      </main>
    </div>
  );
}
