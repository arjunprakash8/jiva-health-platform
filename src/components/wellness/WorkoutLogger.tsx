"use client";
import { useState, useEffect, useRef } from "react";
import {
  Play, Pause, Square, ChevronRight, Trophy, Flame,
  Timer, Heart, Zap, TrendingUp, TrendingDown, CheckCircle,
  Star, Share2, BarChart2, RefreshCw, Target, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from "recharts";
import SportSelector, { Sport } from "@/components/ui/SportSelector";

type LoggerState = "select" | "setup" | "active" | "paused" | "summary";

interface Goal {
  type: "distance" | "time" | "calories";
  value: number;
}

const AI_INSIGHTS = [
  "Your pace consistency improved 6% vs last week's run.",
  "HR zone distribution optimal — 35% in Zone 3.",
  "Consider adding a cooldown stretch to aid recovery.",
  "Best performance window: 18:00–20:00 based on your history.",
];

const RADAR_DATA = [
  { metric: "Pace", current: 82, avg: 74 },
  { metric: "HR Ctrl", current: 78, avg: 70 },
  { metric: "Cadence", current: 85, avg: 76 },
  { metric: "Endurance", current: 71, avg: 68 },
  { metric: "Power", current: 76, avg: 72 },
];

export default function WorkoutLogger() {
  const [state, setState] = useState<LoggerState>("select");
  const [sport, setSport] = useState<Sport | null>(null);
  const [goals, setGoals] = useState<Partial<Goal>>({});
  const [elapsed, setElapsed] = useState(0);
  const [hr, setHr] = useState(72);
  const [calories, setCalories] = useState(0);
  const [insight, setInsight] = useState(AI_INSIGHTS[0]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const distance = elapsed * 0.002;
  const pace = 4.8 + Math.sin(elapsed * 0.05) * 0.4;
  const strain = Math.min(21, elapsed * 0.012);
  const performanceScore = Math.round(72 + Math.random() * 8);

  useEffect(() => {
    if (state === "active") {
      intervalRef.current = setInterval(() => {
        setElapsed(e => e + 1);
        setHr(h => Math.round(Math.max(140, Math.min(180, h + (Math.random() - 0.45) * 3))));
        setCalories(c => c + 0.08);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [state]);

  useEffect(() => {
    setInsight(AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)]);
  }, [state]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const paceStr = `${Math.floor(pace)}:${Math.round((pace % 1) * 60).toString().padStart(2, "0")}`;

  // ── SPORT SELECT ─────────────────────────────────────────────
  if (state === "select") return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Log Workout</h3>
          <p className="text-xs text-muted-foreground">Choose your activity</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#f59e0b]">
          <Star className="w-3.5 h-3.5" />
          <span>Streak: 7 days</span>
        </div>
      </div>
      <SportSelector
        onSelect={s => { setSport(s); setState("setup"); }}
        selected={sport?.id}
      />
    </div>
  );

  // ── SETUP ────────────────────────────────────────────────────
  if (state === "setup" && sport) return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setState("select")} className="w-8 h-8 rounded-xl glass flex items-center justify-center">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h3 className="text-base font-bold text-foreground">{sport.emoji} {sport.label}</h3>
          <p className="text-xs text-muted-foreground">Set your targets (optional)</p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: "Distance goal", key: "distance" as const, unit: "km", placeholder: "e.g. 5" },
          { label: "Time goal", key: "time" as const, unit: "min", placeholder: "e.g. 30" },
          { label: "Calorie target", key: "calories" as const, unit: "kcal", placeholder: "e.g. 300" },
        ].map(({ label, key, unit, placeholder }) => (
          <div key={key} className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <input
                type="number"
                placeholder={placeholder}
                className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
                onChange={e => setGoals(g => ({ ...g, [key]: Number(e.target.value) }))}
              />
            </div>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setState("active")}
        className="w-full py-4 rounded-2xl font-bold text-white gradient-teal hover-lift press-scale flex items-center justify-center gap-2 shadow-lg"
      >
        <Play className="w-5 h-5" />
        Start {sport.label}
      </button>
    </div>
  );

  // ── ACTIVE / PAUSED ──────────────────────────────────────────
  if ((state === "active" || state === "paused") && sport) return (
    <div className="space-y-4">
      {/* Status banner */}
      <div className={cn(
        "glass rounded-2xl p-4 flex items-center justify-between",
        state === "paused" && "border border-[#f59e0b]/30"
      )}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sport.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{sport.label}</span>
              {state === "active" ? (
                <div className="flex items-center gap-1">
                  <div className="live-dot" />
                  <span className="text-[10px] text-[#22c55e] font-bold">LIVE</span>
                </div>
              ) : (
                <span className="text-[10px] text-[#f59e0b] font-bold bg-[#f59e0b]/10 px-2 py-0.5 rounded-full">PAUSED</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{fmt(elapsed)} elapsed</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black tabular-nums text-foreground">{fmt(elapsed)}</p>
        </div>
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card p-4">
          <p className="metric-label">Distance</p>
          <p className="metric-hero text-[#14b8a6]">{distance.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">km</p>
        </div>
        <div className="stat-card p-4">
          <p className="metric-label">Pace</p>
          <p className="metric-hero text-[#6366f1]">{paceStr}</p>
          <p className="text-xs text-muted-foreground">min/km</p>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="stat-card p-3 text-center">
          <Heart className="w-4 h-4 text-[#f43f5e] mx-auto mb-1" />
          <p className="text-lg font-bold tabular-nums text-[#f43f5e]">{hr}</p>
          <p className="metric-label">BPM</p>
        </div>
        <div className="stat-card p-3 text-center">
          <Flame className="w-4 h-4 text-[#f59e0b] mx-auto mb-1" />
          <p className="text-lg font-bold tabular-nums text-[#f59e0b]">{Math.round(calories)}</p>
          <p className="metric-label">kcal</p>
        </div>
        <div className="stat-card p-3 text-center">
          <Zap className="w-4 h-4 text-[#f97316] mx-auto mb-1" />
          <p className="text-lg font-bold tabular-nums text-[#f97316]">{strain.toFixed(1)}</p>
          <p className="metric-label">Strain</p>
        </div>
      </div>

      {/* Goal progress */}
      {goals.distance && (
        <div className="glass rounded-xl p-3">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground flex items-center gap-1"><Target className="w-3 h-3" /> Distance goal</span>
            <span className="text-[#14b8a6] font-semibold">{distance.toFixed(2)} / {goals.distance}km</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#14b8a6] transition-all" style={{ width: `${Math.min(100, (distance / goals.distance) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {state === "active" ? (
          <button onClick={() => setState("paused")} className="flex-1 glass py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm text-foreground">
            <Pause className="w-5 h-5" /> Pause
          </button>
        ) : (
          <button onClick={() => setState("active")} className="flex-1 gradient-teal py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white">
            <Play className="w-5 h-5" /> Resume
          </button>
        )}
        <button
          onClick={() => setState("summary")}
          className="flex-1 bg-[#f43f5e]/10 border border-[#f43f5e]/30 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm text-[#f43f5e]"
        >
          <Square className="w-5 h-5" /> Finish
        </button>
      </div>
    </div>
  );

  // ── POST-WORKOUT SUMMARY ──────────────────────────────────────
  if (state === "summary" && sport) return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-lg font-black text-foreground">Workout Complete!</h3>
        <p className="text-sm text-muted-foreground">{sport.emoji} {sport.label} · {fmt(elapsed)}</p>
      </div>

      {/* Score card */}
      <div className="glass-purple rounded-2xl p-5 text-center">
        <p className="metric-label text-[#6366f1]">Performance Score</p>
        <div className="flex items-end justify-center gap-1 my-2">
          <span className="text-5xl font-black text-foreground">{performanceScore}</span>
          <span className="text-lg text-muted-foreground mb-1">/100</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-[#22c55e]" />
          <span className="text-xs text-[#22c55e] font-semibold">+4 pts from last session</span>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Distance", value: `${distance.toFixed(2)} km`, color: "#14b8a6" },
          { label: "Avg Pace", value: `${paceStr} /km`, color: "#6366f1" },
          { label: "Calories", value: `${Math.round(calories)} kcal`, color: "#f59e0b" },
          { label: "Avg HR", value: `${Math.round(hr)} bpm`, color: "#f43f5e" },
          { label: "Max HR", value: `${Math.round(hr + 12)} bpm`, color: "#f97316" },
          { label: "Strain", value: strain.toFixed(1), color: "#8b5cf6" },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card p-3">
            <p className="metric-label">{label}</p>
            <p className="text-base font-bold tabular-nums" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Performance radar */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Performance Breakdown</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
              <Radar name="You" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Avg" dataKey="avg" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 2" />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI insight */}
      <div className="glass-teal rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#14b8a6]/20 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 text-[#14b8a6]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#14b8a6] mb-1">AI Coach Insight</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Not medical advice</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 glass py-3 rounded-xl text-xs font-semibold text-foreground flex items-center justify-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
        <button className="flex-1 glass py-3 rounded-xl text-xs font-semibold text-foreground flex items-center justify-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5" /> Analyse
        </button>
        <button
          onClick={() => { setState("select"); setElapsed(0); setCalories(0); }}
          className="flex-1 gradient-teal py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> New
        </button>
      </div>
    </div>
  );

  return null;
}
