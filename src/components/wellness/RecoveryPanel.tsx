"use client";

import {
  AreaChart, Area, ComposedChart, Scatter, ScatterChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line,
} from "recharts";
import {
  Zap, Moon, Heart, TrendingUp, Activity,
  AlertCircle, CheckCircle2, Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const chartTooltipStyle = {
  backgroundColor: "hsl(240 22% 9%)",
  border: "1px solid hsl(240 12% 15%)",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#f0eeeb",
};

const cardShadow = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";

const recoveryScore = 68;

function getRecoveryColor(score: number) {
  if (score > 70) return "#22c55e";
  if (score > 50) return "#f59e0b";
  return "#f43f5e";
}

function getReadiness(score: number): string {
  if (score > 80) return "Peak";
  if (score > 65) return "High";
  if (score > 45) return "Moderate";
  return "Low";
}

const color = getRecoveryColor(recoveryScore);
const readiness = getReadiness(recoveryScore);

// SVG arc gauge
function RecoveryGauge({ score }: { score: number }) {
  const c = getRecoveryColor(score);
  const circumference = Math.PI * 80;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-28 overflow-hidden">
        <svg width="208" height="112" viewBox="-4 -4 216 120" className="overflow-visible">
          <path d="M 8 104 A 80 80 0 0 1 192 104" fill="none" stroke="hsl(240 12% 12%)" strokeWidth="16" strokeLinecap="round" />
          <path d="M 8 104 A 80 80 0 0 1 192 104" fill="none" stroke={c} strokeWidth="16" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }} />
          <text x="4" y="120" fontSize="9" fill="#f43f5e" fontWeight="600">Low</text>
          <text x="90" y="8" fontSize="9" fill="#f59e0b" fontWeight="600" textAnchor="middle">Moderate</text>
          <text x="192" y="120" fontSize="9" fill="#22c55e" fontWeight="600" textAnchor="end">Peak</text>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl font-extrabold metric-number" style={{ color: c }}>{score}</span>
          <span className="text-xs font-semibold mt-0.5" style={{ color: c }}>{getReadiness(score)}</span>
        </div>
      </div>
    </div>
  );
}

const hrvTrend = [
  { day: "Mon", hrv: 44 }, { day: "Tue", hrv: 48 }, { day: "Wed", hrv: 38 },
  { day: "Thu", hrv: 52 }, { day: "Fri", hrv: 55 }, { day: "Sat", hrv: 50 },
  { day: "Sun", hrv: 52 },
];

const strainRecoveryData = [
  { strain: 12.2, recovery: 72, day: "Mon" },
  { strain: 15.8, recovery: 65, day: "Tue" },
  { strain: 8.4, recovery: 81, day: "Wed" },
  { strain: 17.2, recovery: 58, day: "Thu" },
  { strain: 14.6, recovery: 70, day: "Fri" },
  { strain: 16.1, recovery: 68, day: "Sat" },
  { strain: 9.0, recovery: 74, day: "Sun" },
];

const recoveryHistory = [
  { day: "Mon", score: 72, readiness: "high" },
  { day: "Tue", score: 65, readiness: "moderate" },
  { day: "Wed", score: 81, readiness: "peak" },
  { day: "Thu", score: 58, readiness: "moderate" },
  { day: "Fri", score: 70, readiness: "high" },
  { day: "Sat", score: 68, readiness: "high" },
  { day: "Sun", score: 68, readiness: "high" },
];

const factors = [
  { label: "Sleep Score", value: 76, target: 85, color: "#a78bfa", icon: Moon, status: "good" },
  { label: "HRV", value: 52, target: 60, color: "#14b8a6", icon: Activity, status: "good" },
  { label: "Resting HR", value: 62, target: 60, color: "#f43f5e", icon: Heart, status: "neutral" },
  { label: "Activity Load", value: 14.6, target: 12, color: "#f59e0b", icon: Zap, status: "caution" },
];

const readinessColors: Record<string, string> = {
  peak: "#22c55e",
  high: "#14b8a6",
  moderate: "#f59e0b",
  low: "#f43f5e",
};

export default function RecoveryPanel() {
  const sleepDebt = -0.8; // negative = deficit

  return (
    <div className="space-y-4">
      {/* Recovery Score Gauge */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#14b8a6]" />
              Recovery Score
            </CardTitle>
            <Badge
              className={cn(
                "text-xs px-2.5 py-1 border",
                readiness === "Peak" ? "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30" :
                readiness === "High" ? "bg-[#14b8a6]/15 text-[#14b8a6] border-[#14b8a6]/30" :
                readiness === "Moderate" ? "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30" :
                "bg-rose-500/15 text-rose-400 border-rose-500/30"
              )}
            >
              {readiness}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <RecoveryGauge score={recoveryScore} />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Today&apos;s readiness is <span style={{ color }}>moderate</span>. Consider a light-to-moderate workout.
          </p>
        </CardContent>
      </Card>

      {/* Recovery Factors Grid */}
      <div className="grid grid-cols-2 gap-3">
        {factors.map((f) => (
          <Card key={f.label} className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: f.color + "18" }}>
                  <f.icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                {f.status === "good" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
                ) : f.status === "caution" ? (
                  <AlertCircle className="w-3.5 h-3.5 text-[#f59e0b]" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
              <p className="text-lg font-extrabold metric-number" style={{ color: f.color }}>{f.value}</p>
              <p className="text-xs text-muted-foreground">{f.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* HRV Trend */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#14b8a6]" />
            HRV Trend (7 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={hrvTrend}>
              <defs>
                <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} unit="ms" width={35} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}ms`, "HRV"]} />
              <Area type="monotone" dataKey="hrv" stroke="#14b8a6" strokeWidth={2} fill="url(#hrvGrad)" dot={{ fill: "#14b8a6", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Strain vs Recovery */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
            Strain vs Recovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={strainRecoveryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} width={25} domain={[0, 25]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} width={30} domain={[40, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line yAxisId="left" type="monotone" dataKey="strain" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} name="Strain" />
              <Line yAxisId="right" type="monotone" dataKey="recovery" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6", r: 3 }} name="Recovery %" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sleep Debt + 7-Day History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sleep Debt */}
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#a78bfa]" />
              Sleep Debt Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-extrabold metric-number text-[#f59e0b]">
                  {sleepDebt < 0 ? `${Math.abs(sleepDebt)}h` : `+${sleepDebt}h`}
                </p>
                <p className="text-xs text-muted-foreground">{sleepDebt < 0 ? "Sleep Deficit" : "Sleep Surplus"}</p>
              </div>
              <Badge className={cn("text-xs px-2.5 py-1", sleepDebt < -1 ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : sleepDebt < 0 ? "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30" : "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30")}>
                {sleepDebt < -1 ? "High Deficit" : sleepDebt < 0 ? "Mild Deficit" : "Surplus"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Target</span>
                <span className="text-foreground font-medium">8.0h / night</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">7-day avg</span>
                <span className="text-[#f59e0b] font-semibold">7.2h</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cumulative debt</span>
                <span className="text-rose-400 font-semibold">-5.6h this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Timeline */}
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#6366f1]" />
              7-Day Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-24">
              {recoveryHistory.map((r) => (
                <div key={r.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-md transition-all duration-700"
                    style={{
                      height: `${(r.score / 100) * 72}px`,
                      backgroundColor: readinessColors[r.readiness] + "cc",
                    }}
                  />
                  <span className="text-[9px] text-muted-foreground">{r.day}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(readinessColors).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v }} />
                  <span className="text-[10px] text-muted-foreground capitalize">{k}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
