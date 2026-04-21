"use client";

import { useState } from "react";
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Droplets, Plus, Bell, Clock, TrendingUp, CheckCircle2,
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

const weeklyData = [
  { day: "Mon", ml: 2400, target: 3000 },
  { day: "Tue", ml: 3100, target: 3000 },
  { day: "Wed", ml: 1800, target: 3000 },
  { day: "Thu", ml: 2700, target: 3000 },
  { day: "Fri", ml: 2250, target: 3000 },
  { day: "Sat", ml: 3200, target: 3000 },
  { day: "Sun", ml: 2900, target: 3000 },
];

const initialEntries = [
  { time: "07:00 AM", amount: 250, label: "Morning glass" },
  { time: "09:30 AM", amount: 500, label: "Post-workout bottle" },
  { time: "11:00 AM", amount: 250, label: "Mid-morning" },
  { time: "01:00 PM", amount: 500, label: "Lunch" },
  { time: "03:00 PM", amount: 250, label: "Afternoon" },
  { time: "05:30 PM", amount: 500, label: "Pre-dinner" },
];

const target = 3000;

function getStatus(total: number): { label: string; color: string } {
  if (total >= target) return { label: "Well Hydrated", color: "#22c55e" };
  if (total >= 2000) return { label: "Optimal", color: "#38bdf8" };
  return { label: "Dehydrated", color: "#f43f5e" };
}

// SVG water level
function WaterLevel({ pct }: { pct: number }) {
  const clampedPct = Math.min(100, Math.max(0, pct));
  const fillY = 10 + (80 * (1 - clampedPct / 100));
  return (
    <svg viewBox="0 0 80 100" width="80" height="100" className="shrink-0">
      <defs>
        <clipPath id="bottleClip">
          <path d="M 25 10 L 20 20 L 15 35 L 15 85 Q 15 92 22 92 L 58 92 Q 65 92 65 85 L 65 35 L 60 20 L 55 10 Z" />
        </clipPath>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Bottle outline */}
      <path d="M 25 10 L 20 20 L 15 35 L 15 85 Q 15 92 22 92 L 58 92 Q 65 92 65 85 L 65 35 L 60 20 L 55 10 Z"
        fill="hsl(240 12% 12%)" stroke="hsl(240 12% 18%)" strokeWidth="1.5" />
      {/* Water fill */}
      <rect x="14" y={fillY} width="52" height={100 - fillY} fill="url(#waterGrad)" clipPath="url(#bottleClip)" />
      {/* Cap */}
      <rect x="28" y="4" width="24" height="10" rx="4" fill="hsl(240 12% 18%)" stroke="hsl(240 12% 22%)" strokeWidth="1" />
      {/* % label */}
      <text x="40" y="60" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f0eeeb">{clampedPct}%</text>
    </svg>
  );
}

export default function HydrationTracker() {
  const [waterTotal, setWaterTotal] = useState(2250);
  const [entries, setEntries] = useState(initialEntries);

  const pct = Math.round((waterTotal / target) * 100);
  const { label: statusLabel, color: statusColor } = getStatus(waterTotal);

  const addWater = (ml: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setWaterTotal((w) => Math.min(target + 1000, w + ml));
    setEntries((e) => [{ time: timeStr, amount: ml, label: `Added ${ml}ml` }, ...e]);
  };

  return (
    <div className="space-y-4">
      {/* Main display */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#38bdf8]" />
              Water Intake
            </CardTitle>
            <Badge className="text-xs px-2.5 py-1 border" style={{ backgroundColor: statusColor + "18", color: statusColor, borderColor: statusColor + "40" }}>
              {statusLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <WaterLevel pct={pct} />
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-extrabold metric-number" style={{ color: statusColor }}>{waterTotal}</span>
                  <span className="text-sm text-muted-foreground mb-1.5">ml</span>
                </div>
                <p className="text-xs text-muted-foreground">Target: {target} ml · Remaining: {Math.max(0, target - waterTotal)} ml</p>
              </div>

              {/* Quick add buttons */}
              <div className="flex gap-2">
                {[150, 250, 500].map((ml) => (
                  <Button
                    key={ml}
                    size="sm"
                    onClick={() => addWater(ml)}
                    className="flex-1 h-8 text-xs rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/25 hover:bg-[#38bdf8]/20"
                  >
                    <Plus className="w-3 h-3 mr-0.5" />+{ml}ml
                  </Button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-2.5 bg-[hsl(240_12%_12%)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, pct)}%`, backgroundColor: statusColor }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{pct}% of daily goal</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Reminder */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6366f1]/15 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-[#6366f1]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Next Reminder</p>
              <p className="text-xs text-muted-foreground">Drink 250ml at <span className="text-[#6366f1] font-semibold">3:00 PM</span> · Every 90 minutes</p>
            </div>
            <Badge className="text-xs bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Chart */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#38bdf8]" />
            Weekly Hydration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weeklyData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} unit="ml" width={40} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v} ml`]} />
              <Bar dataKey="ml" fill="#38bdf8" fillOpacity={0.75} radius={[4, 4, 0, 0]} name="Intake" />
              <Bar dataKey="target" fill="#6366f1" fillOpacity={0.15} radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Today&apos;s Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {entries.slice(0, 8).map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">{entry.label}</p>
                  <p className="text-[10px] text-muted-foreground">{entry.time}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#38bdf8] metric-number">+{entry.amount}ml</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
