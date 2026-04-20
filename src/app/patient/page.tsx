"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine,
} from "recharts";
import {
  Heart, Activity, Thermometer, Droplets, Moon, Footprints,
  TrendingUp, AlertCircle, Info, ChevronRight, Zap, Award,
  Wind, LayoutDashboard, Battery, Wifi,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardShell from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/ui/metric-card";
import {
  currentPatient, activityTrend, heartRateTrend, spo2Trend, hrvTrend,
  sleepData, healthScoreHistory, generateECGData,
  getScoreColor, getScoreLabel, tierConfig,
} from "@/lib/mockData";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Activity, label: "ECG Live", id: "ecg", badge: "LIVE" as const },
  { icon: Heart, label: "Vitals", id: "vitals" },
  { icon: Footprints, label: "Activity", id: "activity" },
  { icon: Moon, label: "Sleep", id: "sleep" },
  { icon: Zap, label: "Body Comp", id: "bodycomp" },
  { icon: Award, label: "Tier & Rewards", id: "tier" },
];

const temperatureTrend = [
  { timestamp: "Mon", value: 36.5 },
  { timestamp: "Tue", value: 36.6 },
  { timestamp: "Wed", value: 36.7 },
  { timestamp: "Thu", value: 36.5 },
  { timestamp: "Fri", value: 36.8 },
  { timestamp: "Sat", value: 36.6 },
  { timestamp: "Sun", value: 36.6 },
];

function HealthScoreGauge({ score }: { score: number }) {
  const color = getScoreColor(score);
  const circumference = Math.PI * 80;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-28 overflow-hidden">
        <svg width="208" height="112" viewBox="-4 -4 216 120" className="overflow-visible">
          <path d="M 8 104 A 80 80 0 0 1 192 104" fill="none" stroke="hsl(240 12% 15%)" strokeWidth="16" strokeLinecap="round" />
          <path d="M 8 104 A 80 80 0 0 1 192 104" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
          <text x="4" y="120" fontSize="9" fill="#f43f5e" fontWeight="600">0</text>
          <text x="90" y="8" fontSize="9" fill="#f59e0b" fontWeight="600" textAnchor="middle">50</text>
          <text x="192" y="120" fontSize="9" fill="#10b981" fontWeight="600" textAnchor="end">100</text>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl font-extrabold metric-number" style={{ color }}>{score}</span>
          <span className="text-xs font-semibold text-muted-foreground -mt-0.5">{getScoreLabel(score)}</span>
        </div>
      </div>
    </div>
  );
}

function ECGWaveform() {
  const [data, setData] = useState(generateECGData(150));
  useEffect(() => {
    const interval = setInterval(() => setData(generateECGData(150)), 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-foreground">Live ECG</span>
            <Badge variant="outline" className="text-muted-foreground border-border text-xs">500 Hz · 24-bit ADC</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#f43f5e]" /> 73 bpm</span>
            <span>Normal Sinus Rhythm</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 4 }}>
            <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            <ReferenceLine y={0} stroke="hsl(240 12% 18%)" strokeDasharray="3 3" />
            <YAxis domain={[-25, 95]} tick={{ fill: "#4b5563", fontSize: 9 }} />
            <XAxis dataKey="x" hide />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3 text-xs text-muted-foreground">
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

  const tierBg: Record<string, string> = {
    Bronze: "from-amber-900/30 to-amber-800/10",
    Silver: "from-slate-700/30 to-slate-600/10",
    Gold: "from-yellow-900/30 to-yellow-800/10",
    Platinum: "from-slate-600/30 to-slate-500/10",
    Diamond: "from-violet-900/30 to-violet-800/10",
  };

  const benefits: Record<string, string[]> = {
    Bronze: ["Standard premium rates", "Basic health insights"],
    Silver: ["5% premium cashback", "Weekly health reports"],
    Gold: ["10% premium cashback", "Priority support", "Advanced analytics"],
    Platinum: ["12% premium cashback", "Free teleconsultation", "VIP alerts"],
    Diamond: ["15% premium cashback", "Free band replacement", "Dedicated care manager"],
  };

  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br ${tierBg[tier]} p-5`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status Tier</p>
        <Award className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex items-end gap-2 mb-4">
        <span className="text-3xl font-extrabold metric-number" style={{ color: tierColors[tier] }}>{tier}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span className="font-semibold text-foreground tabular">{points.toLocaleString()} pts</span>
          {nextTier && <span>{nextConfig!.min.toLocaleString()} pts → {nextTier}</span>}
        </div>
        <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: tierColors[tier] }}
          />
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        {benefits[tier]?.map(b => (
          <div key={b} className="flex items-center gap-2 text-xs text-foreground/80">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tierColors[tier] }} />
            {b}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-xs">
        <p className="font-semibold text-foreground mb-0.5">Points Formula</p>
        <p className="text-muted-foreground font-mono text-[10px]">Status = (Activity × {currentPatient.incentiveMultiplier}) − {currentPatient.inactivityPenalty}</p>
        {nextTier && <p className="text-muted-foreground mt-1">{(nextConfig!.min - points).toLocaleString()} pts needed for {nextTier}</p>}
      </div>
    </div>
  );
}

const vitalChartData = { hr: heartRateTrend, spo2: spo2Trend, hrv: hrvTrend, temp: temperatureTrend };
const vitalChartColor = { hr: "#f43f5e", spo2: "#3b82f6", hrv: "#8b5cf6", temp: "#f59e0b" };
const vitalChartLabel = { hr: "Heart Rate (bpm)", spo2: "SpO₂ (%)", hrv: "HRV (ms)", temp: "Temperature (°C)" };
const vitalChartKey = ["hr", "spo2", "hrv", "temp"] as const;
const vitalChartName = { hr: "Heart Rate", spo2: "SpO₂", hrv: "HRV", temp: "Temperature" };

const chartTooltipStyle = {
  backgroundColor: "hsl(240 22% 9%)",
  border: "1px solid hsl(240 12% 15%)",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#f0eeeb",
};

const axisTickStyle = { fill: "hsl(240 5% 48%)", fontSize: 10 };

export default function PatientDashboard() {
  const p = currentPatient;
  const [activeSection, setActiveSection] = useState("overview");

  const notifCount = p.alerts.filter(a => !a.resolved).length;

  return (
    <DashboardShell
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      role="patient"
      userName={p.name}
      userInitials={p.name.split(" ").map(n => n[0]).join("")}
      userSub={`ID: ${p.id}`}
      notificationCount={notifCount}
      topBarTitle={activeSection === "overview" ? "Overview" : navItems.find(n => n.id === activeSection)?.label ?? "Dashboard"}
      topBarSub={`${new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })} · Band Active`}
    >
      {/* ── OVERVIEW ── */}
      {activeSection === "overview" && (
        <div className="space-y-5 animate-fade-up">
          {/* Welcome row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">Good morning, {p.name.split(" ")[0]}</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Your health data is being monitored in real time.</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground border border-border/60 rounded-xl px-3 py-2 bg-card">
              <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-emerald-400" />BLE 5.0</span>
              <span className="w-px h-3 bg-border" />
              <span className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5 text-emerald-400" />{p.bandBattery}%</span>
              <span className="w-px h-3 bg-border" />
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Synced {p.lastSync}
              </span>
            </div>
          </div>

          {/* Row 1: Health score + Vitals */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Health score card — wide */}
            <Card className="lg:col-span-2 border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">AI Health Score</CardTitle>
                  <Badge variant="outline" className="text-xs text-muted-foreground border-border">Multi-sensor</Badge>
                </div>
                <CardDescription className="text-xs">0–100 composite: ECG · PPG · HRV · SpO₂ · Temp · BIA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <HealthScoreGauge score={p.healthScore} />
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[{ label: "0–40", color: "#f43f5e", name: "High Risk" }, { label: "41–70", color: "#f59e0b", name: "Moderate" }, { label: "71–100", color: "#10b981", name: "Low Risk" }].map(z => (
                    <div key={z.label} className="rounded-xl p-2 border" style={{ backgroundColor: z.color + "12", borderColor: z.color + "30" }}>
                      <p className="text-xs font-bold tabular" style={{ color: z.color }}>{z.label}</p>
                      <p className="text-xs text-muted-foreground">{z.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 5 vital metric cards */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3 content-start">
              <MetricCard icon={Heart} label="Heart Rate" value={p.heartRate} unit="bpm" color="#f43f5e" trend="stable" trendValue="Normal" sub="Resting · NSR" />
              <MetricCard icon={Droplets} label="SpO₂" value={p.spo2} unit="%" color="#3b82f6" trend="stable" trendValue="Normal" sub="Excellent" />
              <MetricCard icon={Wind} label="HRV (RMSSD)" value={p.hrv} unit="ms" color="#8b5cf6" trend="up" trendValue="+3ms" sub="Good recovery" />
              <MetricCard icon={Thermometer} label="Skin Temp" value={p.temperature} unit="°C" color="#f59e0b" trend="stable" trendValue="Normal" sub="±0.2°C acc." />
              <MetricCard icon={Footprints} label="Steps Today" value={p.steps.toLocaleString()} color="#10b981" trend="up" trendValue="+18%" sub={`${Math.round((p.steps / 10000) * 100)}% of goal`} />
              <MetricCard icon={Moon} label="Sleep Score" value={p.sleepScore} unit="/100" color="#6366f1" trend="up" trendValue="+12%" sub="7h 4min · Good" />
            </div>
          </div>

          {/* Row 2: Health score trend + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2 border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Health Score Trend</CardTitle>
                    <CardDescription className="text-xs">30-day rolling average</CardDescription>
                  </div>
                  <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    <TrendingUp className="w-3 h-3 mr-1" /> Improving
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={healthScoreHistory} margin={{ top: 4, right: 4, left: -30, bottom: 4 }}>
                    <defs>
                      <linearGradient id="hsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240 12% 13%)" />
                    <XAxis dataKey="day" tick={axisTickStyle} axisLine={false} tickLine={false} interval={4} />
                    <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} domain={[60, 95]} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [v, "Score"]} />
                    <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fill="url(#hsGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Active Alerts</CardTitle>
                  {p.alerts.length > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#6366f1]">{p.alerts.length} new</span>
                  )}
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
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">All clear</p>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full text-xs">
                  View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── ECG LIVE ── */}
      {activeSection === "ecg" && (
        <div className="space-y-5 animate-fade-up">
          <ECGWaveform />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard label="RMSSD" value="49" unit="ms" icon={Activity} color="#10b981" trend="up" trendValue="+3ms" sub="Good HRV range" size="lg" glow />
            <MetricCard label="SDNN" value="62" unit="ms" icon={Wind} color="#6366f1" trend="up" trendValue="+5ms" sub="Excellent variability" size="lg" />
            <MetricCard label="pNN50" value="31" unit="%" icon={Heart} color="#14b8a6" trend="stable" trendValue="Stable" sub="Normal parasympathetic" size="lg" />
          </div>
        </div>
      )}

      {/* ── VITALS ── */}
      {activeSection === "vitals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up">
          {vitalChartKey.map(v => (
            <Card key={v} className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{vitalChartName[v]} Trend</CardTitle>
                <CardDescription className="text-xs">7-day history</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={vitalChartData[v]} margin={{ top: 4, right: 4, left: -30, bottom: 4 }}>
                    <defs>
                      <linearGradient id={`vg-${v}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={vitalChartColor[v]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={vitalChartColor[v]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240 12% 13%)" />
                    <XAxis dataKey="timestamp" tick={axisTickStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(val: number) => [val, vitalChartLabel[v]]} />
                    <Area type="monotone" dataKey="value" stroke={vitalChartColor[v]} strokeWidth={2} fill={`url(#vg-${v})`} dot={{ r: 3, fill: vitalChartColor[v], strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── ACTIVITY ── */}
      {activeSection === "activity" && (
        <div className="space-y-5 animate-fade-up">
          <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Weekly Steps</CardTitle>
                  <CardDescription className="text-xs">vs 10,000 daily target</CardDescription>
                </div>
                <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" /> +18% this week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityTrend} margin={{ top: 4, right: 4, left: -25, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(240 12% 13%)" />
                  <XAxis dataKey="day" tick={axisTickStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [v.toLocaleString(), "Steps"]} />
                  <ReferenceLine y={10000} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "Goal", fill: "#f59e0b", fontSize: 10 }} />
                  <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
                    {activityTrend.map((entry) => (
                      <Cell key={entry.day} fill={entry.steps >= 10000 ? "#10b981" : "#6366f1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Circular goal ring */}
            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Today&apos;s Goal</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(240 12% 15%)" strokeWidth="8" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(p.steps / 10000) * 201} 201`} style={{ transition: "stroke-dasharray 1s ease-out" }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-400 tabular">{Math.round((p.steps / 10000) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground metric-number">{p.steps.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">of 10,000 steps</p>
                  <p className="text-xs text-[#10b981] font-semibold mt-1">{(10000 - p.steps).toLocaleString()} to goal</p>
                </div>
              </CardContent>
            </Card>
            <MetricCard label="Active Minutes" value="42" unit="min" icon={Footprints} color="#f59e0b" trend="up" trendValue="+8 min" sub="Out of 60 min target" size="lg" />
          </div>
        </div>
      )}

      {/* ── SLEEP ── */}
      {activeSection === "sleep" && (
        <div className="space-y-5 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sleep Stages</CardTitle>
                <CardDescription className="text-xs">Last night · 7h 0min</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={sleepData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="hours">
                      {sleepData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}h`, ""]} contentStyle={chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {sleepData.map(s => (
                    <div key={s.stage} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-muted-foreground">{s.stage}</span>
                      </span>
                      <span className="font-semibold tabular">{s.hours}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              <MetricCard label="Total Sleep" value="7h 0m" icon={Moon} color="#6366f1" trend="up" trendValue="+24min" sub="vs last week" />
              <MetricCard label="REM Sleep" value="1.8" unit="hrs" icon={Activity} color="#8b5cf6" trend="stable" trendValue="Good" sub="25% of total" />
              <MetricCard label="Deep Sleep" value="1.9" unit="hrs" icon={Zap} color="#3b82f6" trend="up" trendValue="+0.2h" sub="27% of total" />
              <MetricCard label="Efficiency" value="92" unit="%" icon={TrendingUp} color="#10b981" trend="up" trendValue="+3%" sub="Excellent" />
            </div>
          </div>
        </div>
      )}

      {/* ── BODY COMP ── */}
      {activeSection === "bodycomp" && (
        <div className="space-y-5 animate-fade-up">
          <Card className="border-border/60" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Bio-Impedance Analysis (BIA)</CardTitle>
                  <CardDescription className="text-xs">Multi-frequency · 5kHz–1MHz · Body composition estimation</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs text-muted-foreground border-border">Last: 6:30 AM</Badge>
              </div>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Body Fat" value="18.4" unit="%" icon={Activity} color="#3b82f6" trend="down" trendValue="-0.3%" sub="Athletic range" size="lg" />
            <MetricCard label="Muscle Mass" value="68.2" unit="kg" icon={Zap} color="#10b981" trend="up" trendValue="+0.4kg" sub="Above average" size="lg" />
            <MetricCard label="Hydration" value="62.1" unit="%" icon={Droplets} color="#0ea5e9" trend="stable" trendValue="Good" sub="Well hydrated" size="lg" />
            <MetricCard label="ECW/ICW Ratio" value="0.38" icon={Wind} color="#8b5cf6" trend="stable" trendValue="Normal" sub="Normal fluid dist." size="lg" />
            <MetricCard label="Phase Angle" value="7.2" unit="°" icon={TrendingUp} color="#f59e0b" trend="up" trendValue="+0.2°" sub="Excellent cell health" size="lg" />
            <MetricCard label="BMI" value="22.4" icon={Heart} color="#14b8a6" trend="stable" trendValue="Normal" sub="Healthy range" size="lg" />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Multi-Frequency Analysis</p>
            <p>BIA uses electrical current at multiple frequencies (5kHz–1MHz) to distinguish between intracellular water (ICW) and extracellular water (ECW), providing precise body composition metrics with ±2% accuracy at population scale.</p>
          </div>
        </div>
      )}

      {/* ── TIER & REWARDS ── */}
      {activeSection === "tier" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-up">
          <TierCard tier={p.tier} points={p.statusPoints} />
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className="text-2xl font-extrabold text-[#6366f1] metric-number">×{p.incentiveMultiplier}</p>
                <p className="text-xs text-muted-foreground mt-1">Multiplier</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className="text-2xl font-extrabold text-emerald-400 metric-number">{p.activityCompliance}%</p>
                <p className="text-xs text-muted-foreground mt-1">Compliance</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
                <p className="text-2xl font-extrabold text-foreground metric-number">0</p>
                <p className="text-xs text-muted-foreground mt-1">Penalty pts</p>
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">All Tier Benefits</p>
              {["Bronze (0–999): standard premium", "Silver (1,000–2,499): 5% cashback", "Gold (2,500–4,999): 10% cashback", "Platinum (5,000–7,499): 12% + priority care", "Diamond (7,500+): 15% + free band + VIP"].map((t, i) => (
                <div key={t} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ["#b45309","#64748b","#f59e0b","#94a3b8","#a78bfa"][i] }} />
                  <span className={t.startsWith(p.tier) ? "text-foreground font-semibold" : "text-muted-foreground"}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground pt-6 pb-2">
        JIVA APHP · Patient Dashboard · For informational purposes only · HIPAA Aligned · ODPC (Kenya) Compliant
      </p>
    </DashboardShell>
  );
}
