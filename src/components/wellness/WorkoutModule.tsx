"use client";

import { useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Activity, Dumbbell, Bike, Waves, PersonStanding,
  Zap, Flame, Clock, Heart, TrendingUp, Plus, Target,
  ChevronRight, Award, Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const chartTooltipStyle = {
  backgroundColor: "hsl(240 22% 9%)",
  border: "1px solid hsl(240 12% 15%)",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#f0eeeb",
};

const cardShadow = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";

const workoutTypes = [
  { id: "all", label: "All" },
  { id: "run", label: "Run" },
  { id: "cycle", label: "Cycle" },
  { id: "gym", label: "Gym" },
  { id: "yoga", label: "Yoga" },
  { id: "hiit", label: "HIIT" },
];

const sessions = [
  { id: "a1", type: "run", label: "Morning Run", date: "Today", duration: 45, distance: 7.2, calories: 520, avgHR: 158, maxHR: 178, icon: Activity },
  { id: "a2", type: "cycle", label: "Road Cycling", date: "Yesterday", duration: 70, distance: 28.4, calories: 680, avgHR: 148, maxHR: 172, icon: Bike },
  { id: "a3", type: "gym", label: "Strength Session", date: "2 days ago", duration: 60, calories: 410, avgHR: 132, maxHR: 162, icon: Dumbbell },
  { id: "a4", type: "yoga", label: "Flow Yoga", date: "3 days ago", duration: 60, calories: 180, avgHR: 98, maxHR: 118, icon: PersonStanding },
  { id: "a5", type: "hiit", label: "HIIT Circuit", date: "4 days ago", duration: 30, calories: 380, avgHR: 168, maxHR: 188, icon: Zap },
];

const intensityZones = [
  { name: "Z1 Recovery", value: 3, color: "#94a3b8" },
  { name: "Z2 Aerobic", value: 12, color: "#22c55e" },
  { name: "Z3 Tempo", value: 18, color: "#f59e0b" },
  { name: "Z4 Threshold", value: 10, color: "#f97316" },
  { name: "Z5 Max", value: 2, color: "#ef4444" },
];

const weeklyPerf = [
  { day: "Mon", duration: 0, calories: 0 },
  { day: "Tue", duration: 45, calories: 380 },
  { day: "Wed", duration: 0, calories: 0 },
  { day: "Thu", duration: 70, calories: 680 },
  { day: "Fri", duration: 45, calories: 520 },
  { day: "Sat", duration: 60, calories: 410 },
  { day: "Sun", duration: 0, calories: 0 },
];

const goals = [
  { label: "Weekly Runs", current: 3, target: 4, unit: "runs", color: "#14b8a6" },
  { label: "VO2 Max", current: 46.2, target: 50, unit: "ml/kg/min", color: "#6366f1" },
  { label: "Weekly Calories", current: 1990, target: 2500, unit: "kcal", color: "#f97316" },
];

const defaultExercises = [
  { name: "Barbell Squat", sets: 4, reps: 8, weight: 80 },
  { name: "Bench Press", sets: 4, reps: 8, weight: 70 },
  { name: "Pull-ups", sets: 3, reps: 10, weight: 0 },
  { name: "Romanian Deadlift", sets: 3, reps: 10, weight: 60 },
];

// Mini SVG route for thumbnail
const miniRoutePoints = [
  [10, 60], [20, 50], [35, 42], [50, 38], [65, 40], [78, 48],
  [88, 55], [92, 48], [88, 38], [80, 32], [68, 28], [54, 30],
  [40, 34], [28, 42], [18, 52], [10, 60],
];

function buildPolyline(pts: number[][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

export default function WorkoutModule() {
  const [filter, setFilter] = useState("all");
  const [exercises, setExercises] = useState(defaultExercises);

  const filtered = filter === "all" ? sessions : sessions.filter((s) => s.type === filter);

  const updateExercise = (i: number, field: string, value: string) => {
    setExercises((ex) => ex.map((e, idx) => idx === i ? { ...e, [field]: field === "name" ? value : Number(value) } : e));
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {workoutTypes.map((wt) => (
          <button
            key={wt.id}
            onClick={() => setFilter(wt.id)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
              filter === wt.id
                ? "bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/40"
                : "bg-[hsl(240_18%_7%)] text-muted-foreground border border-border/40 hover:text-foreground"
            )}
          >
            {wt.label}
          </button>
        ))}
      </div>

      {/* Session List */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#6366f1]" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-border/30 hover:border-border/60 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#6366f118" }}>
                <s.icon className="w-4 h-4 text-[#6366f1]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.date} · {s.duration}min</p>
              </div>
              <div className="flex items-center gap-3 text-xs shrink-0">
                {s.distance && <span className="text-[#14b8a6] font-semibold">{s.distance}km</span>}
                <span className="text-[#f97316] font-semibold">{s.calories} kcal</span>
                <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                  <Heart className="w-2.5 h-2.5" />{s.avgHR}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Post-Workout Summary */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-[#f59e0b]" />
              Post-Workout Summary
            </CardTitle>
            <Badge className="text-xs bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20">Morning Run</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Duration", value: "45:12", color: "#6366f1", icon: Clock },
              { label: "Distance", value: "7.2 km", color: "#14b8a6", icon: TrendingUp },
              { label: "Avg HR", value: "158 bpm", color: "#f43f5e", icon: Heart },
              { label: "Calories", value: "520 kcal", color: "#f97316", icon: Flame },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-[hsl(240_18%_7%)]">
                <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />
                <p className="text-sm font-bold metric-number" style={{ color }}>{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Intensity Zones Pie */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Intensity Zones</p>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={intensityZones} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                    {intensityZones.map((z, i) => <Cell key={i} fill={z.color} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v} min`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Mini GPS Map + AI insight */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Route Thumbnail</p>
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "hsl(240 18% 7%)", height: 80 }}>
                <svg width="100%" height="80" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="miniGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(240 12% 12%)" strokeWidth="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100" height="80" fill="url(#miniGrid)" />
                  <polyline points={buildPolyline(miniRoutePoints)} fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={miniRoutePoints[0][0]} cy={miniRoutePoints[0][1]} r="3" fill="#22c55e" />
                </svg>
              </div>
              <div className="p-3 rounded-xl bg-[#6366f1]/5 border border-[#6366f1]/20">
                <div className="flex items-start gap-2">
                  <Bot className="w-3.5 h-3.5 text-[#6366f1] shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-semibold">Great run!</span> Your zone 3 time increased by 8% vs your last run. Keep targeting 6:00–6:30/km pace to build your aerobic base.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend + Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#6366f1]" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={weeklyPerf}>
                <defs>
                  <linearGradient id="durGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="duration" stroke="#6366f1" strokeWidth={2} fill="url(#durGrad)" dot={false} name="Duration (min)" />
                <Area type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} fill="url(#calGrad)" dot={false} name="Calories" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#14b8a6]" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((g) => (
              <div key={g.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">{g.label}</span>
                  <span className="text-xs font-semibold" style={{ color: g.color }}>
                    {g.current} / {g.target} {g.unit}
                  </span>
                </div>
                <div className="h-2.5 bg-[hsl(240_12%_12%)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%`, backgroundColor: g.color }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 text-right">
                  {Math.round((g.current / g.target) * 100)}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Workout Builder */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#f59e0b]" />
              Workout Builder
            </CardTitle>
            <Button size="sm" className="h-7 px-3 text-xs rounded-xl bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/25">
              <Plus className="w-3 h-3 mr-1" />Exercise
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium px-1 mb-1">
              <span className="col-span-1">Exercise</span>
              <span className="text-center">Sets</span>
              <span className="text-center">Reps</span>
              <span className="text-center">Weight (kg)</span>
            </div>
            {exercises.map((ex, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center">
                <Input
                  value={ex.name}
                  onChange={(e) => updateExercise(i, "name", e.target.value)}
                  className="h-8 text-xs bg-[hsl(240_18%_7%)] border-border/60 col-span-1"
                />
                <Input
                  type="number"
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, "sets", e.target.value)}
                  className="h-8 text-xs text-center bg-[hsl(240_18%_7%)] border-border/60"
                />
                <Input
                  type="number"
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, "reps", e.target.value)}
                  className="h-8 text-xs text-center bg-[hsl(240_18%_7%)] border-border/60"
                />
                <Input
                  type="number"
                  value={ex.weight}
                  onChange={(e) => updateExercise(i, "weight", e.target.value)}
                  className="h-8 text-xs text-center bg-[hsl(240_18%_7%)] border-border/60"
                />
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 h-9 text-xs rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 hover:bg-[#6366f1]/25">
            Save Workout Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
