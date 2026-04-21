"use client";

import { useState } from "react";
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Target, Edit2, Save, Award, TrendingDown, TrendingUp,
  Dumbbell, Moon, Heart, Activity, Zap, Scale,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const chartTooltipStyle = {
  backgroundColor: "hsl(240 22% 9%)",
  border: "1px solid hsl(240 12% 15%)",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#f0eeeb",
};

const cardShadow = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";

interface BiometricField {
  key: string;
  label: string;
  value: number;
  unit: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

const initialBiometrics: BiometricField[] = [
  { key: "weight", label: "Weight", value: 82.0, unit: "kg", icon: Scale, color: "#6366f1" },
  { key: "height", label: "Height", value: 178, unit: "cm", icon: Activity, color: "#14b8a6" },
  { key: "bodyFat", label: "Body Fat %", value: 18.4, unit: "%", icon: Zap, color: "#f97316" },
  { key: "restingHR", label: "Resting HR", value: 62, unit: "bpm", icon: Heart, color: "#f43f5e" },
  { key: "vo2Max", label: "VO2 Max", value: 46.2, unit: "ml/kg/min", icon: TrendingUp, color: "#22c55e" },
  { key: "sleepTarget", label: "Sleep Target", value: 8.0, unit: "hrs", icon: Moon, color: "#a78bfa" },
];

const goals = [
  {
    id: "g1", type: "weight_loss", label: "Weight Loss", target: 78, current: 82, unit: "kg",
    deadline: "Jun 2025", color: "#6366f1",
    history: [{ m: "Jan", v: 86 }, { m: "Feb", v: 85 }, { m: "Mar", v: 84 }, { m: "Apr", v: 83 }, { m: "May", v: 82 }],
  },
  {
    id: "g2", type: "endurance", label: "VO2 Max", target: 50, current: 46.2, unit: "ml/kg/min",
    deadline: "Sep 2025", color: "#14b8a6",
    history: [{ m: "Jan", v: 42 }, { m: "Feb", v: 43 }, { m: "Mar", v: 44.5 }, { m: "Apr", v: 45.8 }, { m: "May", v: 46.2 }],
  },
  {
    id: "g3", type: "activity_frequency", label: "Active Days/Week", target: 5, current: 4, unit: "days",
    deadline: "Dec 2025", color: "#f59e0b",
    history: [{ m: "Jan", v: 2 }, { m: "Feb", v: 3 }, { m: "Mar", v: 3 }, { m: "Apr", v: 4 }, { m: "May", v: 4 }],
  },
  {
    id: "g4", type: "sleep", label: "Sleep Duration", target: 8, current: 7.2, unit: "hrs",
    deadline: "Dec 2025", color: "#a78bfa",
    history: [{ m: "Jan", v: 6.5 }, { m: "Feb", v: 6.8 }, { m: "Mar", v: 7.0 }, { m: "Apr", v: 7.1 }, { m: "May", v: 7.2 }],
  },
];

const badges = [
  { label: "7-Day Streak", icon: "🔥", color: "#f97316", unlocked: true },
  { label: "5K Runner", icon: "🏃", color: "#14b8a6", unlocked: true },
  { label: "Hydration Hero", icon: "💧", color: "#38bdf8", unlocked: true },
  { label: "Sleep Champion", icon: "🌙", color: "#a78bfa", unlocked: false },
  { label: "30-Day Streak", icon: "⚡", color: "#f59e0b", unlocked: false },
  { label: "Half Marathon", icon: "🥇", color: "#22c55e", unlocked: false },
];

export default function GoalsBiometrics() {
  const [biometrics, setBiometrics] = useState(initialBiometrics);
  const [editMode, setEditMode] = useState(false);
  const [goalEditMode, setGoalEditMode] = useState(false);
  const [goalValues, setGoalValues] = useState(goals.map(g => ({ target: g.target, current: g.current })));
  const [selectedGoal, setSelectedGoal] = useState("g1");

  const updateBiometric = (key: string, value: string) => {
    setBiometrics(bm => bm.map(b => b.key === key ? { ...b, value: parseFloat(value) || b.value } : b));
  };

  const activeGoal = goals.find(g => g.id === selectedGoal);

  return (
    <div className="space-y-4">
      {/* Biometrics Panel */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#6366f1]" />
              Biometrics
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setEditMode(e => !e)}
              className={cn("h-7 px-3 text-xs rounded-xl border", editMode
                ? "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30 hover:bg-[#22c55e]/25"
                : "bg-[#6366f1]/15 text-[#6366f1] border-[#6366f1]/30 hover:bg-[#6366f1]/25")}
            >
              {editMode ? <><Save className="w-3 h-3 mr-1" />Save</> : <><Edit2 className="w-3 h-3 mr-1" />Edit</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {biometrics.map((b) => (
              <div key={b.key} className="p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: b.color + "18" }}>
                    <b.icon className="w-3.5 h-3.5" style={{ color: b.color }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{b.label}</span>
                </div>
                {editMode ? (
                  <Input
                    type="number"
                    value={b.value}
                    onChange={(e) => updateBiometric(b.key, e.target.value)}
                    className="h-7 text-xs bg-[hsl(240_12%_10%)] border-border/60"
                  />
                ) : (
                  <div className="flex items-end gap-1">
                    <span className="text-lg font-extrabold metric-number" style={{ color: b.color }}>{b.value}</span>
                    <span className="text-xs text-muted-foreground mb-0.5">{b.unit}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals Panel */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#14b8a6]" />
              Active Goals
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setGoalEditMode(e => !e)}
              className={cn("h-7 px-3 text-xs rounded-xl border", goalEditMode
                ? "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30 hover:bg-[#22c55e]/25"
                : "bg-[#14b8a6]/15 text-[#14b8a6] border-[#14b8a6]/30 hover:bg-[#14b8a6]/25")}
            >
              {goalEditMode ? <><Save className="w-3 h-3 mr-1" />Save</> : <><Edit2 className="w-3 h-3 mr-1" />Edit Goals</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {goals.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setSelectedGoal(g.id)}
              className={cn("w-full text-left p-3 rounded-xl border transition-all", selectedGoal === g.id ? "border-opacity-50" : "border-border/30 bg-[hsl(240_18%_7%)] hover:border-border/60")}
              style={selectedGoal === g.id ? { backgroundColor: g.color + "10", borderColor: g.color + "50" } : undefined}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-semibold text-foreground">{g.label}</p>
                  <p className="text-[10px] text-muted-foreground">Target by {g.deadline}</p>
                </div>
                {goalEditMode ? (
                  <div className="flex gap-1.5">
                    <Input
                      type="number"
                      value={goalValues[i].current}
                      onClick={e => e.stopPropagation()}
                      onChange={(e) => setGoalValues(v => v.map((gv, gi) => gi === i ? { ...gv, current: parseFloat(e.target.value) } : gv))}
                      className="h-6 w-16 text-[10px] text-center bg-[hsl(240_12%_10%)] border-border/60"
                      placeholder="current"
                    />
                    <Input
                      type="number"
                      value={goalValues[i].target}
                      onClick={e => e.stopPropagation()}
                      onChange={(e) => setGoalValues(v => v.map((gv, gi) => gi === i ? { ...gv, target: parseFloat(e.target.value) } : gv))}
                      className="h-6 w-16 text-[10px] text-center bg-[hsl(240_12%_10%)] border-border/60"
                      placeholder="target"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-bold metric-number" style={{ color: g.color }}>
                    {g.current} / {g.target} {g.unit}
                  </span>
                )}
              </div>
              <div className="h-2 bg-[hsl(240_12%_12%)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%`, backgroundColor: g.color }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {Math.round((g.current / g.target) * 100)}% complete
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Goal Timeline Chart */}
      {activeGoal && (
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: activeGoal.color }} />
              {activeGoal.label} Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={activeGoal.history}>
                <defs>
                  <linearGradient id="goalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeGoal.color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={activeGoal.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" />
                <XAxis dataKey="m" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v} ${activeGoal.unit}`]} />
                <Area type="monotone" dataKey="v" stroke={activeGoal.color} strokeWidth={2} fill="url(#goalGrad)" dot={{ fill: activeGoal.color, r: 3 }} name={activeGoal.label} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Achievement Badges */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-[#f59e0b]" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <div
                key={b.label}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                  b.unlocked
                    ? "border-opacity-40"
                    : "border-border/20 bg-[hsl(240_12%_8%)] text-muted-foreground/40"
                )}
                style={b.unlocked ? {
                  backgroundColor: b.color + "15",
                  borderColor: b.color + "40",
                  color: b.color,
                } : undefined}
              >
                <span className={cn(!b.unlocked && "grayscale opacity-40")}>{b.icon}</span>
                {b.label}
                {!b.unlocked && <Badge className="text-[9px] h-4 px-1.5 bg-[hsl(240_12%_12%)] text-muted-foreground border-0">Locked</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
