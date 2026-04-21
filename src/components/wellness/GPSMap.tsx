"use client";

import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Play, Square, MapPin, Zap, Timer, Flame,
  TrendingUp, Navigation, Route as RouteIcon,
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

// Mock SVG route path points (normalized 0-400 x, 0-250 y)
const routePoints = [
  [40, 200], [60, 185], [90, 170], [120, 160], [150, 145], [175, 130],
  [200, 120], [220, 110], [245, 115], [265, 125], [285, 140], [300, 155],
  [315, 165], [330, 155], [345, 140], [355, 130], [360, 115], [355, 100],
  [340, 90], [320, 85], [295, 80], [265, 82], [240, 88], [215, 95],
  [185, 105], [160, 118], [135, 130], [110, 145], [85, 158], [65, 172],
  [50, 185], [40, 200],
];

function buildPolylinePoints(pts: number[][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

const elevationData = routePoints.map(([, y], i) => ({
  dist: (i * 0.15).toFixed(1),
  elevation: Math.round(250 - y * 0.5 + 10),
}));

const weeklyDistanceData = [
  { day: "Mon", km: 0 },
  { day: "Tue", km: 5.4 },
  { day: "Wed", km: 0 },
  { day: "Thu", km: 8.2 },
  { day: "Fri", km: 7.2 },
  { day: "Sat", km: 12.1 },
  { day: "Sun", km: 0 },
];

const recentRoutes = [
  { name: "Morning Loop", distance: 7.2, duration: "45:12", pace: "6:16/km", elevation: 84, date: "Today" },
  { name: "Evening 5K", distance: 5.0, duration: "29:48", pace: "5:58/km", elevation: 42, date: "Yesterday" },
  { name: "Weekend Long Run", distance: 12.1, duration: "1:14:30", pace: "6:09/km", elevation: 118, date: "Sat" },
];

const intensityZones = [
  { zone: 1, name: "Recovery", minutes: 3, pct: 7, color: "#94a3b8" },
  { zone: 2, name: "Aerobic", minutes: 12, pct: 27, color: "#22c55e" },
  { zone: 3, name: "Tempo", minutes: 18, pct: 40, color: "#f59e0b" },
  { zone: 4, name: "Threshold", minutes: 10, pct: 22, color: "#f97316" },
  { zone: 5, name: "Max", minutes: 2, pct: 4, color: "#ef4444" },
];

function useStopwatch(active: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (active) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
      setSeconds(0);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [active]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function GPSMap() {
  const [tracking, setTracking] = useState(false);
  const [liveDistance, setLiveDistance] = useState(0);
  const [liveHR, setLiveHR] = useState(148);
  const elapsed = useStopwatch(tracking);

  useEffect(() => {
    if (!tracking) return;
    const interval = setInterval(() => {
      setLiveDistance((d) => Math.round((d + 0.012) * 1000) / 1000);
      setLiveHR((h) => Math.min(182, Math.max(130, h + Math.floor((Math.random() - 0.48) * 4))));
    }, 1000);
    return () => clearInterval(interval);
  }, [tracking]);

  const livePace = liveDistance > 0
    ? `${Math.floor(elapsed.split(":").reduce((a, t, i) => a + Number(t) * (i === 0 ? 60 : 1), 0) / 60 / liveDistance)}:${String(Math.floor((elapsed.split(":").reduce((a, t, i) => a + Number(t) * (i === 0 ? 60 : 1), 0) / liveDistance) % 60)).padStart(2, "0")}/km`
    : "--:--/km";

  return (
    <div className="space-y-4">
      {/* Map + Route Stats */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#14b8a6]" />
              GPS Route Tracker
            </CardTitle>
            <Button
              onClick={() => setTracking((t) => !t)}
              size="sm"
              className={cn(
                "h-8 px-3 text-xs font-semibold rounded-xl gap-1.5",
                tracking
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                  : "bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/30 hover:bg-[#14b8a6]/25"
              )}
            >
              {tracking ? <><Square className="w-3 h-3" />Stop</> : <><Play className="w-3 h-3" />Start Workout</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SVG Map */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ backgroundColor: "hsl(240 18% 7%)", height: 270 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 400 270" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(240 12% 12%)" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <rect width="400" height="270" fill="url(#grid)" />
              {/* Route shadow */}
              <polyline
                points={buildPolylinePoints(routePoints)}
                fill="none"
                stroke="#14b8a6"
                strokeWidth="6"
                strokeOpacity="0.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Route line */}
              <polyline
                points={buildPolylinePoints(routePoints)}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Start marker */}
              <circle cx={routePoints[0][0]} cy={routePoints[0][1]} r="6" fill="#22c55e" opacity="0.9" />
              <circle cx={routePoints[0][0]} cy={routePoints[0][1]} r="10" fill="#22c55e" opacity="0.2" />
              <text x={routePoints[0][0] + 12} y={routePoints[0][1] + 4} fontSize="9" fill="#22c55e" fontWeight="600">START</text>
              {/* End marker */}
              <circle cx={routePoints[routePoints.length - 2][0]} cy={routePoints[routePoints.length - 2][1]} r="6" fill="#f43f5e" opacity="0.9" />
              <text x={routePoints[routePoints.length - 2][0] + 12} y={routePoints[routePoints.length - 2][1] + 4} fontSize="9" fill="#f43f5e" fontWeight="600">END</text>
              {/* Live dot if tracking */}
              {tracking && (
                <circle cx="200" cy="120" r="7" fill="#6366f1" opacity="0.9">
                  <animate attributeName="r" values="7;11;7" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
            </svg>
            {/* Map overlay stats */}
            <div className="absolute top-3 left-3 flex gap-2">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs">
                <span className="text-muted-foreground">Dist</span>{" "}
                <span className="text-[#14b8a6] font-bold">{tracking ? liveDistance.toFixed(2) : "7.2"} km</span>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs">
                <span className="text-muted-foreground">Elev</span>{" "}
                <span className="text-[#f59e0b] font-bold">+84m</span>
              </div>
            </div>
            {tracking && (
              <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl p-3 grid grid-cols-4 gap-2">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">Time</p>
                  <p className="text-sm font-bold text-[#14b8a6] metric-number">{elapsed}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">Dist</p>
                  <p className="text-sm font-bold text-foreground metric-number">{liveDistance.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">HR</p>
                  <p className="text-sm font-bold text-rose-400 metric-number">{liveHR}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">Pace</p>
                  <p className="text-sm font-bold text-foreground metric-number">{liveDistance > 0 ? livePace : "--"}</p>
                </div>
              </div>
            )}
          </div>

          {/* Route summary stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: RouteIcon, label: "Distance", value: "7.2 km", color: "#14b8a6" },
              { icon: Timer, label: "Duration", value: "45:12", color: "#6366f1" },
              { icon: TrendingUp, label: "Avg Pace", value: "6:16/km", color: "#f59e0b" },
              { icon: Flame, label: "Calories", value: "520 kcal", color: "#f97316" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-[hsl(240_18%_7%)] rounded-xl p-3 text-center">
                <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />
                <p className="text-xs font-bold metric-number" style={{ color }}>{value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Elevation Profile */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
            Elevation Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={elevationData}>
              <defs>
                <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" />
              <XAxis dataKey="dist" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} label={{ value: "km", position: "insideBottomRight", offset: -5, style: { fill: "hsl(240 5% 48%)", fontSize: 10 } }} />
              <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} unit="m" width={35} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}m`, "Elevation"]} />
              <Area type="monotone" dataKey="elevation" stroke="#f59e0b" strokeWidth={2} fill="url(#elevGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Intensity Zones + Weekly Distance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#6366f1]" />
              Intensity Zones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {intensityZones.map((z) => (
              <div key={z.zone} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Z{z.zone} {z.name}</span>
                  <span className="font-semibold" style={{ color: z.color }}>{z.minutes}m</span>
                </div>
                <div className="h-2 bg-[hsl(240_12%_12%)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${z.pct}%`, backgroundColor: z.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <RouteIcon className="w-4 h-4 text-[#14b8a6]" />
              Weekly Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weeklyDistanceData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} unit="km" width={30} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v} km`, "Distance"]} />
                <Bar dataKey="km" fill="#14b8a6" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Routes */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#f43f5e]" />
            Recent Routes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentRoutes.map((route) => (
            <div
              key={route.name}
              className="flex items-center justify-between p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-border/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#14b8a6]/10 flex items-center justify-center">
                  <RouteIcon className="w-4 h-4 text-[#14b8a6]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{route.name}</p>
                  <p className="text-xs text-muted-foreground">{route.pace} · {route.elevation}m elev</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#14b8a6] metric-number">{route.distance} km</p>
                <p className="text-xs text-muted-foreground">{route.duration} · {route.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
