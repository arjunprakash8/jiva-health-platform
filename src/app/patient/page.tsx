"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  ReferenceLine,
} from "recharts";
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Moon,
  Footprints,
  Battery,
  Wifi,
  Bell,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  ChevronRight,
  Zap,
  Award,
  RefreshCw,
  Wind,
} from "lucide-react";
import {
  currentPatient,
  activityTrend,
  heartRateTrend,
  spo2Trend,
  hrvTrend,
  sleepData,
  healthScoreHistory,
  generateECGData,
  getScoreColor,
  getScoreLabel,
  tierConfig,
} from "@/lib/mockData";

// ─── Health Score Gauge ────────────────────────────────────────────────────────
function HealthScoreGauge({ score }: { score: number }) {
  const color = getScoreColor(score);
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-28 overflow-hidden">
        <svg
          width="208"
          height="112"
          viewBox="-4 -4 216 120"
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d="M 8 104 A 80 80 0 0 1 192 104"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            d="M 8 104 A 80 80 0 0 1 192 104"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
          {/* Zone markers */}
          <text x="4" y="120" fontSize="9" fill="#ef4444" fontWeight="600">
            0
          </text>
          <text x="90" y="8" fontSize="9" fill="#f59e0b" fontWeight="600" textAnchor="middle">
            50
          </text>
          <text x="192" y="120" fontSize="9" fill="#10b981" fontWeight="600" textAnchor="end">
            100
          </text>
        </svg>
        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl font-extrabold" style={{ color }}>
            {score}
          </span>
          <span className="text-xs font-semibold text-slate-500 -mt-1">
            {getScoreLabel(score)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Vital Card ────────────────────────────────────────────────────────────────
function VitalCard({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  color,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit: string;
  sub?: string;
  color: string;
  trend?: "up" | "down" | "stable";
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 card-hover">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "18" }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend === "up"
                ? "text-emerald-600"
                : trend === "down"
                ? "text-red-500"
                : "text-slate-400"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend === "down" ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
          </div>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="text-sm text-slate-500 mb-0.5">{unit}</span>
      </div>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs font-medium mt-1" style={{ color }}>{sub}</p>}
    </div>
  );
}

// ─── ECG Waveform ──────────────────────────────────────────────────────────────
function ECGWaveform() {
  const [data, setData] = useState(generateECGData(150));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateECGData(150));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-slate-200">Live ECG</span>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            500 Hz · 24-bit ADC
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-red-400" /> 73 bpm
          </span>
          <span>Normal Sinus Rhythm</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 4 }}>
          <Line
            type="monotone"
            dataKey="y"
            stroke="#34d399"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
          <YAxis domain={[-25, 95]} tick={{ fill: "#475569", fontSize: 9 }} />
          <XAxis dataKey="x" hide />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-3 text-xs text-slate-500">
        <span>P wave ✓</span>
        <span>QRS complex ✓</span>
        <span>T wave ✓</span>
        <span className="text-emerald-400 font-medium">No anomalies detected</span>
      </div>
    </div>
  );
}

// ─── Tier Badge ────────────────────────────────────────────────────────────────
function TierBadge({ tier, points }: { tier: string; points: number }) {
  const config = tierConfig[tier as keyof typeof tierConfig];
  const tiers = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
  const currentIdx = tiers.indexOf(tier);
  const nextTier = tiers[currentIdx + 1];
  const nextConfig = nextTier ? tierConfig[nextTier as keyof typeof tierConfig] : null;
  const progress = nextConfig
    ? ((points - config.min) / (nextConfig.min - config.min)) * 100
    : 100;

  const tierGradients: Record<string, string> = {
    Bronze: "from-amber-700 to-amber-900",
    Silver: "from-slate-400 to-slate-600",
    Gold: "from-yellow-400 to-amber-600",
    Platinum: "from-slate-300 to-slate-500",
    Diamond: "from-violet-400 via-pink-400 to-blue-500",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Status Tier</p>
          <div className="flex items-center gap-2">
            <span
              className={`text-xl font-extrabold bg-gradient-to-r ${tierGradients[tier]} bg-clip-text text-transparent`}
            >
              {config.emoji} {tier}
            </span>
          </div>
        </div>
        <Award className="w-8 h-8 text-slate-300" />
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-semibold text-slate-700">
            {points.toLocaleString()} pts
          </span>
          {nextTier && (
            <span>
              {nextConfig!.min.toLocaleString()} pts for {nextTier}
            </span>
          )}
        </div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tierGradients[tier]} transition-all duration-1000`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-emerald-50 rounded-xl p-2">
          <p className="text-xs text-emerald-600 font-bold">×1.15</p>
          <p className="text-xs text-slate-500">Multiplier</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-2">
          <p className="text-xs text-blue-600 font-bold">85%</p>
          <p className="text-xs text-slate-500">Compliance</p>
        </div>
        <div className="bg-violet-50 rounded-xl p-2">
          <p className="text-xs text-violet-600 font-bold">0 pts</p>
          <p className="text-xs text-slate-500">Penalty</p>
        </div>
      </div>

      <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-xs text-amber-700 font-medium">
          💡 Status Points = (Activity × 1.15) − 0
        </p>
        <p className="text-xs text-amber-600 mt-0.5">
          {nextTier
            ? `${(nextConfig!.min - points).toLocaleString()} pts to reach ${nextTier}`
            : "Maximum tier reached!"}
        </p>
      </div>
    </div>
  );
}

// ─── Alert Item ────────────────────────────────────────────────────────────────
function AlertItem({ alert }: { alert: { type: string; message: string; timestamp: string } }) {
  const config = {
    critical: { bg: "bg-red-50", border: "border-red-200", icon: AlertCircle, color: "text-red-600", dot: "bg-red-500" },
    warning:  { bg: "bg-amber-50", border: "border-amber-200", icon: AlertCircle, color: "text-amber-600", dot: "bg-amber-500" },
    info:     { bg: "bg-blue-50", border: "border-blue-200", icon: Info, color: "text-blue-600", dot: "bg-blue-500" },
  }[alert.type] ?? { bg: "bg-slate-50", border: "border-slate-200", icon: Info, color: "text-slate-600", dot: "bg-slate-400" };
  const IconComp = config.icon;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${config.bg} ${config.border}`}>
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${config.dot}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.color}`}>{alert.message}</p>
        <p className="text-xs text-slate-400 mt-0.5">{alert.timestamp}</p>
      </div>
      <IconComp className={`w-4 h-4 shrink-0 ${config.color}`} />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PatientDashboard() {
  const p = currentPatient;
  const [activeVitalChart, setActiveVitalChart] = useState<"hr" | "spo2" | "hrv">("hr");

  const vitalChartData = {
    hr: heartRateTrend,
    spo2: spo2Trend,
    hrv: hrvTrend,
  };

  const vitalChartColor = { hr: "#ef4444", spo2: "#3b82f6", hrv: "#8b5cf6" };
  const vitalChartLabel = { hr: "Heart Rate (bpm)", spo2: "SpO₂ (%)", hrv: "HRV (ms)" };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">JIVA</span>
                <span className="text-slate-400 text-sm"> · Patient Dashboard</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Ring status */}
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Ring Connected
              </span>
              <span className="flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
                {p.ringBattery}%
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" />
                {p.lastSync}
              </span>
            </div>
            <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {p.alerts.length}
              </span>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {p.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-500">Patient ID: {p.id}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Welcome row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Good morning, {p.name.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })} · JIVA Ring Active
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>Real-time sync · BLE 5.0</span>
            <span className="text-slate-300">|</span>
            <Battery className="w-3.5 h-3.5 text-emerald-500" />
            <span>{p.ringBattery}% battery</span>
            <span className="text-slate-300">|</span>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Last sync: {p.lastSync}</span>
          </div>
        </div>

        {/* Row 1: Health Score + Tier + Vitals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Health Score Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <h2 className="text-sm font-semibold text-slate-700">AI Health Score</h2>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                Multi-sensor fusion
              </span>
            </div>
            <HealthScoreGauge score={p.healthScore} />
            <div className="w-full mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "0–40", color: "#ef4444", name: "High Risk" },
                { label: "41–70", color: "#f59e0b", name: "Moderate" },
                { label: "71–100", color: "#10b981", name: "Low Risk" },
              ].map((zone) => (
                <div
                  key={zone.label}
                  className="rounded-xl p-2"
                  style={{ backgroundColor: zone.color + "12" }}
                >
                  <p className="text-xs font-bold" style={{ color: zone.color }}>
                    {zone.label}
                  </p>
                  <p className="text-xs text-slate-500">{zone.name}</p>
                </div>
              ))}
            </div>

            {/* 30-day trend */}
            <div className="w-full mt-4">
              <p className="text-xs text-slate-500 mb-2">30-Day Score Trend</p>
              <ResponsiveContainer width="100%" height={50}>
                <AreaChart data={healthScoreHistory} margin={{ top: 2, right: 2, left: -40, bottom: 2 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    fill="url(#scoreGrad)"
                    dot={false}
                  />
                  <ReferenceLine y={70} stroke="#94a3b8" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Tier Card */}
          <TierBadge tier={p.tier} points={p.statusPoints} />

          {/* Quick Vitals */}
          <div className="grid grid-cols-2 gap-3">
            <VitalCard
              icon={Heart}
              label="Heart Rate"
              value={p.heartRate}
              unit="bpm"
              sub="Normal range"
              color="#ef4444"
              trend="stable"
            />
            <VitalCard
              icon={Droplets}
              label="SpO₂"
              value={p.spo2}
              unit="%"
              sub="Excellent"
              color="#3b82f6"
              trend="stable"
            />
            <VitalCard
              icon={Wind}
              label="HRV"
              value={p.hrv}
              unit="ms"
              sub="RMSSD · Good"
              color="#8b5cf6"
              trend="up"
            />
            <VitalCard
              icon={Thermometer}
              label="Skin Temp"
              value={p.temperature}
              unit="°C"
              sub="±0.2°C accuracy"
              color="#f59e0b"
              trend="stable"
            />
          </div>
        </div>

        {/* Row 2: ECG + Steps + Sleep */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* ECG */}
          <div className="lg:col-span-2">
            <ECGWaveform />
          </div>

          {/* Steps + Sleep */}
          <div className="grid grid-rows-2 gap-3">
            <VitalCard
              icon={Footprints}
              label="Steps Today"
              value={p.steps.toLocaleString()}
              unit="steps"
              sub={`${Math.round((p.steps / 10000) * 100)}% of daily goal`}
              color="#10b981"
              trend="up"
            />
            <VitalCard
              icon={Moon}
              label="Sleep Score"
              value={p.sleepScore}
              unit="/100"
              sub="7h 4min · Good"
              color="#6366f1"
              trend="up"
            />
          </div>
        </div>

        {/* Row 3: Activity Chart + Vital Trend + Sleep */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Activity Trend */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Weekly Activity</h3>
                <p className="text-xs text-slate-500">Steps vs 10,000 daily target</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +18% vs last week
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={activityTrend} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }}
                  formatter={(v: number) => [v.toLocaleString(), "Steps"]}
                />
                <ReferenceLine y={10000} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "Goal", fill: "#f59e0b", fontSize: 10 }} />
                <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
                  {activityTrend.map((entry) => (
                    <Cell key={entry.day} fill={entry.steps >= 10000 ? "#10b981" : "#60a5fa"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Goal met
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" /> Below target
              </span>
              <span className="flex items-center gap-1.5 ml-auto">
                <Zap className="w-3 h-3 text-amber-500" />
                Active days this week: 5/7
              </span>
            </div>
          </div>

          {/* Sleep Stages */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Last Night Sleep</h3>
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie
                  data={sleepData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={48}
                  paddingAngle={3}
                  dataKey="hours"
                >
                  {sleepData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}h`, ""]} contentStyle={{ borderRadius: "12px", border: "none", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {sleepData.map((s) => (
                <div key={s.stage} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-600">{s.stage}</span>
                  </span>
                  <span className="font-semibold text-slate-800">{s.hours}h</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
              <p className="text-xs font-bold text-indigo-700">Total: 7h 0min</p>
              <p className="text-xs text-indigo-500">Score: {p.sleepScore}/100</p>
            </div>
          </div>
        </div>

        {/* Row 4: Vital Trend Chart + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Vital Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">7-Day Vital Trend</h3>
              <div className="flex gap-1">
                {(["hr", "spo2", "hrv"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVitalChart(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeVitalChart === v
                        ? "text-white shadow-sm"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                    style={activeVitalChart === v ? { backgroundColor: vitalChartColor[v] } : {}}
                  >
                    {v === "hr" ? "Heart Rate" : v === "spo2" ? "SpO₂" : "HRV"}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={vitalChartData[activeVitalChart]} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="vitalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={vitalChartColor[activeVitalChart]} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={vitalChartColor[activeVitalChart]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }}
                  formatter={(v: number) => [v, vitalChartLabel[activeVitalChart]]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={vitalChartColor[activeVitalChart]}
                  strokeWidth={2}
                  fill="url(#vitalGrad)"
                  dot={{ r: 4, fill: vitalChartColor[activeVitalChart], strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                {p.alerts.length} new
              </span>
            </div>
            <div className="space-y-3">
              {p.alerts.map((a) => (
                <AlertItem key={a.id} alert={a} />
              ))}
              {p.alerts.length === 0 && (
                <div className="text-center py-6">
                  <Activity className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">All clear — no alerts</p>
                </div>
              )}
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
              View All Notifications <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 5: BIA Metrics */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Bio-Impedance Analysis (BIA)</h3>
              <p className="text-xs text-slate-500">Multi-frequency · 5kHz–1MHz · Body composition estimation</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
              Last reading: 6:30 AM
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Body Fat", value: "18.4%", sub: "Athletic range", color: "#3b82f6" },
              { label: "Muscle Mass", value: "68.2 kg", sub: "Above average", color: "#10b981" },
              { label: "Hydration", value: "62.1%", sub: "Well hydrated", color: "#06b6d4" },
              { label: "ECW/ICW", value: "0.38", sub: "Normal ratio", color: "#8b5cf6" },
              { label: "Phase Angle", value: "7.2°", sub: "Excellent", color: "#f59e0b" },
            ].map((m) => (
              <div key={m.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: m.color + "10" }}>
                <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5">{m.label}</p>
                <p className="text-xs text-slate-500">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-slate-400">
          JIVA APHP · Patient Dashboard · For informational purposes only. Not a medical device diagnosis.
          <br />
          Data encrypted end-to-end · HIPAA aligned · ODPC (Kenya) compliant
        </footer>
      </main>
    </div>
  );
}
