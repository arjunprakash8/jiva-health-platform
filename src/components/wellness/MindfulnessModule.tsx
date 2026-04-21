"use client";

import { useState } from "react";
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Brain, Wind, Moon, Smile, Meh, Frown, Play,
  CheckCircle2, Flame, Zap, Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const moodOptions = [
  { value: 1, emoji: "😞", label: "Rough", color: "#f43f5e" },
  { value: 2, emoji: "😕", label: "Low", color: "#f97316" },
  { value: 3, emoji: "😐", label: "Okay", color: "#f59e0b" },
  { value: 4, emoji: "🙂", label: "Good", color: "#14b8a6" },
  { value: 5, emoji: "😄", label: "Great", color: "#22c55e" },
];

const moodHistory = [
  { day: "Mon", mood: 3, stress: 3 },
  { day: "Tue", mood: 4, stress: 2 },
  { day: "Wed", mood: 2, stress: 4 },
  { day: "Thu", mood: 4, stress: 2 },
  { day: "Fri", mood: 5, stress: 1 },
  { day: "Sat", mood: 5, stress: 1 },
  { day: "Sun", mood: 4, stress: 2 },
];

const sessions = [
  { id: "s1", type: "meditation" as const, title: "Morning Meditation", duration: 10, description: "Focused breathing & awareness", color: "#6366f1", icon: Brain },
  { id: "s2", type: "breathing" as const, title: "Box Breathing", duration: 5, description: "4-4-4-4 stress relief", color: "#14b8a6", icon: Wind },
  { id: "s3", type: "body_scan" as const, title: "Body Scan", duration: 15, description: "Progressive muscle relaxation", color: "#a78bfa", icon: Zap },
  { id: "s4", type: "sleep_story" as const, title: "Sleep Story", duration: 20, description: "Guided journey to sleep", color: "#38bdf8", icon: Moon },
];

const sessionHistory = [
  { title: "Morning Meditation", duration: 10, date: "Today", type: "meditation" },
  { title: "Box Breathing", duration: 5, date: "Yesterday", type: "breathing" },
  { title: "Body Scan", duration: 15, date: "2 days ago", type: "body_scan" },
  { title: "Morning Meditation", duration: 10, date: "3 days ago", type: "meditation" },
];

// Stress index gauge
function StressGauge({ score }: { score: number }) {
  const color = score < 30 ? "#22c55e" : score < 60 ? "#f59e0b" : "#f43f5e";
  const label = score < 30 ? "Low" : score < 60 ? "Moderate" : "High";
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(240 12% 12%)" strokeWidth="8" />
          <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-extrabold metric-number" style={{ color }}>{score}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color }}>{label} Stress</p>
        <p className="text-xs text-muted-foreground">Derived from HRV</p>
        <p className="text-xs text-muted-foreground">HRV: 52ms</p>
      </div>
    </div>
  );
}

export default function MindfulnessModule() {
  const [selectedMood, setSelectedMood] = useState<number | null>(4);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Mood Check-in */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Smile className="w-4 h-4 text-[#f59e0b]" />
              How are you feeling?
            </CardTitle>
            <Badge className="text-xs bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20">
              <Flame className="w-2.5 h-2.5 mr-1" />14 day streak
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-2">
            {moodOptions.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
                  selectedMood === m.value
                    ? "border-opacity-60 scale-105"
                    : "border-border/30 bg-[hsl(240_18%_7%)] hover:border-border/60"
                )}
                style={selectedMood === m.value ? {
                  backgroundColor: m.color + "18",
                  borderColor: m.color + "60",
                } : undefined}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-semibold" style={{ color: selectedMood === m.value ? m.color : undefined }}>{m.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Mood logged: <span className="text-foreground font-semibold">{moodOptions.find(m => m.value === selectedMood)?.label}</span>
              {" "}· Logged at {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stress Index */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#a78bfa]" />
            Stress Index
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StressGauge score={32} />
        </CardContent>
      </Card>

      {/* Guided Sessions */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Play className="w-4 h-4 text-[#6366f1]" />
            Guided Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="p-3 rounded-xl border border-border/40 bg-[hsl(240_18%_7%)] hover:border-border/70 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "18" }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{s.duration} min</span>
              </div>
              <p className="text-xs font-semibold text-foreground leading-tight">{s.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.description}</p>
              <button
                onClick={() => setActiveSession(activeSession === s.id ? null : s.id)}
                className={cn(
                  "mt-2.5 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all border",
                  activeSession === s.id
                    ? "border-opacity-40"
                    : "border-border/30 text-muted-foreground hover:text-foreground"
                )}
                style={activeSession === s.id ? {
                  backgroundColor: s.color + "20",
                  borderColor: s.color + "50",
                  color: s.color,
                } : undefined}
              >
                {activeSession === s.id ? (
                  <><CheckCircle2 className="w-3 h-3" />Active</>
                ) : (
                  <><Play className="w-3 h-3" />Start</>
                )}
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-Day Mood Chart */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Meh className="w-4 h-4 text-[#f59e0b]" />
            Mood History (7 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={moodHistory} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 5]} width={20} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number, name: string) => [v, name === "mood" ? "Mood (1-5)" : "Stress (1-5)"]} />
              <Bar dataKey="mood" fill="#f59e0b" fillOpacity={0.8} radius={[3, 3, 0, 0]} name="mood" />
              <Bar dataKey="stress" fill="#f43f5e" fillOpacity={0.5} radius={[3, 3, 0, 0]} name="stress" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Award className="w-4 h-4 text-[#f59e0b]" />
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sessionHistory.map((h, i) => {
            const s = sessions.find(s => s.type === h.type);
            return (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: s?.color ?? "#6366f1" }} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{h.title}</p>
                    <p className="text-[10px] text-muted-foreground">{h.date}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{h.duration} min</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
