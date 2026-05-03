"use client";

import { useState } from "react";
import {
  Activity, Zap, Heart, Moon, BarChart2, Navigation,
  Apple, Dumbbell, Battery, Droplets, Brain, Target,
  Sparkles, Star, Timer, TrendingUp, Wind, Flame
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/layout/DashboardShell";
// MetricCard not used in this page (sections use inline stat cards)
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PerformanceSphere from "@/components/wellness/PerformanceSphere";
import GPSMap from "@/components/wellness/GPSMap";
import WorkoutLogger from "@/components/wellness/WorkoutLogger";
import NutritionLogger from "@/components/wellness/NutritionLogger";
import RecoveryPanel from "@/components/wellness/RecoveryPanel";
import HydrationTracker from "@/components/wellness/HydrationTracker";
import MindfulnessModule from "@/components/wellness/MindfulnessModule";
import GoalsBiometrics from "@/components/wellness/GoalsBiometrics";
import AIInsights from "@/components/wellness/AIInsights";
import ClinicalTimeline from "@/components/medical/ClinicalTimeline";
import MedicalRecords from "@/components/medical/MedicalRecords";
import CareCoordination from "@/components/medical/CareCoordination";
import ChatInterface from "@/components/chat/ChatInterface";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

// ── Mock data ─────────────────────────────────────────────────────
const ECG_DATA = Array.from({ length: 80 }, (_, i) => {
  const x = i / 80;
  let y = Math.sin(x * Math.PI * 2 * 6) * 0.3;
  if (i % 14 === 7) y += 1.8;
  if (i % 14 === 8) y -= 0.6;
  return { t: i, v: y + (Math.random() - 0.5) * 0.05 };
});

const VITALS_24H = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  hr: 58 + Math.round(Math.sin(i * 0.4) * 18 + Math.random() * 8),
  spo2: 96 + Math.round(Math.random() * 3),
  bp: 118 + Math.round(Math.random() * 12),
}));

const SLEEP_DATA = [
  { stage: "Awake", hours: 0.3, color: "#f43f5e" },
  { stage: "REM", hours: 1.8, color: "#6366f1" },
  { stage: "Light", hours: 3.2, color: "#14b8a6" },
  { stage: "Deep", hours: 1.6, color: "#22c55e" },
];

const ACTIVITY_WEEK = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][i],
  steps: 4200 + Math.round(Math.random() * 7800),
  calories: 1600 + Math.round(Math.random() * 800),
}));

const NAV_ITEMS: NavItem[] = [
  { icon: Activity, label: "Overview", id: "overview" },
  { icon: Zap, label: "ECG Live", id: "ecg", badge: "LIVE" },
  { icon: Heart, label: "Vitals", id: "vitals" },
  { icon: Flame, label: "Activity", id: "activity" },
  { icon: Moon, label: "Sleep", id: "sleep" },
  { icon: BarChart2, label: "Body Comp", id: "body" },
  { icon: Navigation, label: "GPS & Routes", id: "gps" },
  { icon: Apple, label: "Nutrition", id: "nutrition" },
  { icon: Dumbbell, label: "Workout", id: "workout" },
  { icon: Battery, label: "Recovery", id: "recovery" },
  { icon: Droplets, label: "Hydration", id: "hydration" },
  { icon: Brain, label: "Mindfulness", id: "mindfulness" },
  { icon: Target, label: "Goals", id: "goals" },
  { icon: Sparkles, label: "AI Insights", id: "ai" },
  { icon: Star, label: "Tier & Rewards", id: "tier" },
];

const MOBILE_NAV = [
  { icon: Activity, label: "Home", id: "overview" },
  { icon: Navigation, label: "GPS", id: "gps" },
  { icon: Dumbbell, label: "Workout", id: "workout" },
  { icon: Heart, label: "Vitals", id: "vitals" },
  { icon: Brain, label: "Mind", id: "mindfulness" },
];

// ── Shared tooltip style ──────────────────────────────────────────
const TOOLTIP_STYLE = {
  contentStyle: {
    background: "hsl(240 22% 12%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
};

// ── Section: Overview ─────────────────────────────────────────────
function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Performance Sphere */}
      <div className="flex flex-col items-center py-4">
        <PerformanceSphere
          recovery={78}
          strain={11.2}
          hrv={52}
          sleepScore={84}
          size={220}
        />
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "HRV", value: "52ms", change: "+4ms", color: "#6366f1", icon: <Activity className="w-4 h-4" /> },
          { label: "Resting HR", value: "54 bpm", change: "-2", color: "#f43f5e", icon: <Heart className="w-4 h-4" /> },
          { label: "SpO₂", value: "98%", change: "+0%", color: "#14b8a6", icon: <Wind className="w-4 h-4" /> },
          { label: "Sleep", value: "7h 12m", change: "+18m", color: "#8b5cf6", icon: <Moon className="w-4 h-4" /> },
          { label: "Steps", value: "9,847", change: "+12%", color: "#22c55e", icon: <Activity className="w-4 h-4" /> },
          { label: "Calories", value: "2,140", change: "+180", color: "#f59e0b", icon: <Flame className="w-4 h-4" /> },
          { label: "Strain", value: "11.2", change: "+2.1", color: "#f97316", icon: <Zap className="w-4 h-4" /> },
          { label: "Recovery", value: "78%", change: "+5%", color: "#22c55e", icon: <Battery className="w-4 h-4" /> },
        ].map(({ label, value, change, color, icon }) => (
          <div key={label} className="stat-card p-4 hover-lift">
            <div className="flex items-center justify-between mb-2">
              <p className="metric-label">{label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: color + "18", color }}>
                {icon}
              </div>
            </div>
            <p className="text-xl font-bold tabular-nums text-foreground">{value}</p>
            <p className="text-[10px] text-[#22c55e] font-semibold mt-1">{change} today</p>
          </div>
        ))}
      </div>

      {/* Live ECG preview */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">ECG Live</h3>
              <div className="live-dot" />
              <span className="text-[10px] text-[#22c55e] font-bold">LIVE</span>
            </div>
            <p className="text-xs text-muted-foreground">Normal sinus rhythm · 72 bpm</p>
          </div>
          <div className="glass px-3 py-1.5 rounded-lg">
            <span className="text-sm font-bold text-[#14b8a6]">72 <span className="text-xs font-normal text-muted-foreground">bpm</span></span>
          </div>
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ECG_DATA}>
              <Line type="monotone" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today activity summary */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Today&apos;s Activity</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ACTIVITY_WEEK}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
              <YAxis hide />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [v.toLocaleString(), "Steps"]} />
              <Bar dataKey="steps" fill="#6366f1" radius={[6, 6, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Section: ECG ──────────────────────────────────────────────────
function ECGSection() {
  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Live ECG</h3>
            <div className="live-dot" />
          </div>
          <span className="text-xs glass px-2.5 py-1 rounded-lg text-[#22c55e] font-semibold">Normal</span>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ECG_DATA}>
              <Line type="monotone" dataKey="v" stroke="#14b8a6" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "HR", value: "72 bpm", color: "#f43f5e" },
            { label: "PR Interval", value: "168 ms", color: "#6366f1" },
            { label: "QRS Duration", value: "94 ms", color: "#14b8a6" },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card p-3 text-center">
              <p className="metric-label">{label}</p>
              <p className="text-sm font-bold tabular-nums" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">AI Analysis</p>
        <div className="glass-teal rounded-xl p-3">
          <p className="text-xs text-foreground leading-relaxed">Normal sinus rhythm detected. No arrhythmias or ST-segment anomalies found. HRV within optimal range for your age group.</p>
          <p className="text-[10px] text-muted-foreground/60 mt-2">Not medical advice · Updated 2s ago</p>
        </div>
      </div>
    </div>
  );
}

// ── Section: Vitals ───────────────────────────────────────────────
function VitalsSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Heart Rate", value: "72", unit: "bpm", color: "#f43f5e", subtext: "Resting" },
          { label: "Blood Pressure", value: "118/76", unit: "mmHg", color: "#6366f1", subtext: "Normal" },
          { label: "SpO₂", value: "98", unit: "%", color: "#14b8a6", subtext: "Excellent" },
          { label: "Temperature", value: "36.6", unit: "°C", color: "#f59e0b", subtext: "Normal" },
          { label: "Resp. Rate", value: "14", unit: "brpm", color: "#22c55e", subtext: "Normal" },
          { label: "HRV", value: "52", unit: "ms", color: "#8b5cf6", subtext: "+4ms today" },
        ].map(({ label, value, unit, color, subtext }) => (
          <div key={label} className="stat-card p-4 hover-lift">
            <p className="metric-label">{label}</p>
            <div className="flex items-end gap-1.5 my-1">
              <span className="text-2xl font-black tabular-nums" style={{ color }}>{value}</span>
              <span className="text-xs text-muted-foreground mb-0.5">{unit}</span>
            </div>
            <p className="text-[10px] text-[#22c55e] font-semibold">{subtext}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-5">
        <p className="text-sm font-bold text-foreground mb-4">24h Heart Rate</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={VITALS_24H}>
              <defs>
                <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} interval={3} />
              <YAxis hide domain={[40, 110]} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`${v} bpm`, "HR"]} />
              <Area type="monotone" dataKey="hr" stroke="#f43f5e" fill="url(#hrGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Section: Activity ─────────────────────────────────────────────
function ActivitySection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Steps", value: "9,847", goal: "10,000", pct: 98, color: "#22c55e" },
          { label: "Calories", value: "2,140 kcal", goal: "2,200", pct: 97, color: "#f59e0b" },
          { label: "Active Time", value: "1h 42m", goal: "60 min", pct: 100, color: "#14b8a6" },
          { label: "Stand Hours", value: "10 hrs", goal: "12", pct: 83, color: "#6366f1" },
        ].map(({ label, value, goal, pct, color }) => (
          <div key={label} className="stat-card p-4">
            <p className="metric-label">{label}</p>
            <p className="text-lg font-bold text-foreground mt-1">{value}</p>
            <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Goal: {goal}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-5">
        <p className="text-sm font-bold text-foreground mb-4">Weekly Activity</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ACTIVITY_WEEK}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
              <YAxis hide />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="steps" fill="#22c55e" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Section: Sleep ────────────────────────────────────────────────
function SleepSection() {
  const total = SLEEP_DATA.reduce((s, d) => s + d.hours, 0);
  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Last night</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-foreground">{total.toFixed(1)}</span>
              <span className="text-lg text-muted-foreground mb-1">hrs</span>
            </div>
          </div>
          <div className="glass-teal rounded-xl px-3 py-2 text-center">
            <p className="text-xl font-black text-[#14b8a6]">84</p>
            <p className="metric-label">Score</p>
          </div>
        </div>
        {/* Sleep stages bar */}
        <div className="flex h-6 rounded-full overflow-hidden gap-0.5">
          {SLEEP_DATA.map(d => (
            <div key={d.stage} className="rounded-sm transition-all" style={{ flex: d.hours, background: d.color + "cc" }} />
          ))}
        </div>
        <div className="flex gap-3 mt-3 flex-wrap">
          {SLEEP_DATA.map(d => (
            <div key={d.stage} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
              <span className="text-[10px] text-muted-foreground">{d.stage} {d.hours}h</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Sleep Onset", value: "11:23 PM", color: "#8b5cf6" },
          { label: "Wake Time", value: "7:18 AM", color: "#f59e0b" },
          { label: "Deep Sleep", value: "1h 36m", color: "#22c55e" },
          { label: "REM Sleep", value: "1h 48m", color: "#6366f1" },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card p-3">
            <p className="metric-label">{label}</p>
            <p className="text-base font-bold tabular-nums" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Body Comp ────────────────────────────────────────────
function BodyCompSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Weight", value: "73.2 kg", change: "-0.3", color: "#14b8a6" },
          { label: "Body Fat", value: "16.4%", change: "-0.2%", color: "#6366f1" },
          { label: "Muscle Mass", value: "57.8 kg", change: "+0.1", color: "#22c55e" },
          { label: "BMI", value: "22.8", change: "0", color: "#f59e0b" },
          { label: "Hydration", value: "61.2%", change: "+0.5%", color: "#0ea5e9" },
          { label: "Visceral Fat", value: "8", change: "-1", color: "#f43f5e" },
        ].map(({ label, value, change, color }) => (
          <div key={label} className="stat-card p-4 hover-lift">
            <p className="metric-label">{label}</p>
            <p className="text-xl font-bold tabular-nums text-foreground mt-1">{value}</p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: change.startsWith("-") && label !== "Body Fat" ? "#f43f5e" : "#22c55e" }}>
              {change === "0" ? "No change" : change + " this week"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Tier ─────────────────────────────────────────────────
function TierSection() {
  return (
    <div className="space-y-5">
      <div className="glass-purple rounded-2xl p-6 text-center">
        <Star className="w-10 h-10 text-[#6366f1] mx-auto mb-3" />
        <p className="text-xs text-muted-foreground mb-1">Current Tier</p>
        <p className="text-3xl font-black text-foreground">Gold</p>
        <p className="text-sm text-[#6366f1] mt-1">Top 22% of JIVA users</p>
        <div className="mt-4 h-2 bg-white/[0.06] rounded-full">
          <div className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#f59e0b]" style={{ width: "72%" }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">2,840 / 4,000 pts to Platinum</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {[
          { label: "7-Day Streak", pts: "+350", icon: "🔥" },
          { label: "Sleep Goal Met", pts: "+120", icon: "🌙" },
          { label: "5K Run Completed", pts: "+200", icon: "🏃" },
          { label: "Hydration Goal", pts: "+80", icon: "💧" },
        ].map(({ label, pts, icon }) => (
          <div key={label} className="stat-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
            <span className="text-sm font-bold text-[#f59e0b]">{pts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function PatientDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":     return <OverviewSection />;
      case "ecg":          return <ECGSection />;
      case "vitals":       return <VitalsSection />;
      case "activity":     return <ActivitySection />;
      case "sleep":        return <SleepSection />;
      case "body":         return <BodyCompSection />;
      case "gps":          return <GPSMap />;
      case "nutrition":    return <NutritionLogger />;
      case "workout":      return <WorkoutLogger />;
      case "recovery":     return <RecoveryPanel />;
      case "hydration":    return <HydrationTracker />;
      case "mindfulness":  return <MindfulnessModule />;
      case "goals":        return <GoalsBiometrics />;
      case "ai":           return <AIInsights />;
      case "records":      return <MedicalRecords />;
      case "timeline":     return <ClinicalTimeline />;
      case "care":         return <CareCoordination />;
      case "tier":         return <TierSection />;
      default:             return <OverviewSection />;
    }
  };

  const activeItem = NAV_ITEMS.find(n => n.id === activeSection);

  return (
    <>
      <DashboardShell
        navItems={NAV_ITEMS}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        role="patient"
        userName="Arjun Prakash"
        userInitials="AP"
        userSub="Gold Member · JIVA Band Pro"
        notificationCount={3}
        topBarTitle={activeItem?.label ?? "Dashboard"}
        topBarSub="Patient Portal"
      >
        <div className="max-w-3xl mx-auto pb-24 lg:pb-0">
          {renderSection()}
        </div>
      </DashboardShell>

      {/* Mobile bottom nav */}
      <MobileBottomNav
        navItems={MOBILE_NAV}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
    </>
  );
}
