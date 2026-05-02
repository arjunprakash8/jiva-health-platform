"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Navigation, Maximize2, Minimize2, Play, Pause, Square,
  Zap, Heart, Timer, Flame, TrendingUp, ChevronUp, ChevronDown,
  RotateCcw, Layers, Signal, Battery
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// ── Mock GPS data ────────────────────────────────────────────────
const generateRoute = () => {
  const points: Array<{ x: number; y: number }> = [];
  let x = 120, y = 200;
  for (let i = 0; i < 80; i++) {
    x += Math.random() * 18 - 5;
    y += Math.random() * 14 - 5;
    x = Math.max(60, Math.min(540, x));
    y = Math.max(60, Math.min(380, y));
    points.push({ x, y });
  }
  return points;
};

const ROUTE = generateRoute();

const PACE_DATA = Array.from({ length: 20 }, (_, i) => ({
  min: i + 1,
  pace: 4.5 + Math.random() * 1.5,
  hr: 148 + Math.random() * 22,
}));

const ELEVATION_DATA = Array.from({ length: 20 }, (_, i) => ({
  min: i + 1,
  elev: 42 + Math.sin(i * 0.5) * 18 + Math.random() * 8,
}));

const HR_ZONES = [
  { zone: "Z1", pct: 8, color: "#6b7280" },
  { zone: "Z2", pct: 22, color: "#3b82f6" },
  { zone: "Z3", pct: 35, color: "#22c55e" },
  { zone: "Z4", pct: 26, color: "#f59e0b" },
  { zone: "Z5", pct: 9, color: "#f43f5e" },
];

type WorkoutState = "idle" | "active" | "paused" | "done";
type SheetState = "collapsed" | "partial" | "full";

// ── SVG Map Component ────────────────────────────────────────────
function DarkMap({ routeProgress }: { routeProgress: number }) {
  const visibleCount = Math.floor(ROUTE.length * routeProgress);
  const visibleRoute = ROUTE.slice(0, Math.max(2, visibleCount));
  const current = ROUTE[visibleCount - 1] || ROUTE[0];

  const pathD = visibleRoute.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Grid lines for map feel
  const gridLines = [];
  for (let i = 0; i < 8; i++) {
    gridLines.push(<line key={`h${i}`} x1="0" y1={i * 55} x2="600" y2={i * 55} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />);
    gridLines.push(<line key={`v${i}`} x1={i * 75} y1="0" x2={i * 75} y2="440" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />);
  }

  return (
    <svg viewBox="0 0 600 440" className="w-full h-full" style={{ background: "linear-gradient(180deg, #0a0a1a 0%, #0d1117 100%)" }}>
      <defs>
        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="mapBlur">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <radialGradient id="currentGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background grid */}
      {gridLines}

      {/* Road network simulation */}
      {[
        "M 0 220 Q 150 200 300 220 Q 450 240 600 220",
        "M 200 0 Q 220 150 200 300 Q 180 380 200 440",
        "M 0 110 Q 200 105 400 115 Q 500 120 600 110",
        "M 400 0 Q 410 200 400 440",
      ].map((d, i) => (
        <path key={i} d={d} stroke="rgba(255,255,255,0.04)" strokeWidth={i < 2 ? "8" : "4"} fill="none" />
      ))}

      {/* Route shadow */}
      {visibleRoute.length > 1 && (
        <path d={pathD} stroke="rgba(0,0,0,0.5)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#mapBlur)" />
      )}

      {/* Main route (gradient) */}
      {visibleRoute.length > 1 && (
        <path d={pathD} stroke="url(#routeGrad)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
      )}

      {/* Start marker */}
      <g transform={`translate(${ROUTE[0].x}, ${ROUTE[0].y})`}>
        <circle r="10" fill="#22c55e" opacity="0.3" />
        <circle r="6" fill="#22c55e" />
        <text x="12" y="4" fill="#22c55e" fontSize="10" fontWeight="bold">START</text>
      </g>

      {/* Current position */}
      {visibleRoute.length > 1 && (
        <g transform={`translate(${current.x}, ${current.y})`}>
          <circle r="20" fill="url(#currentGlow)" className="animate-ping" />
          <circle r="10" fill="rgba(20,184,166,0.3)" />
          <circle r="6" fill="#14b8a6" stroke="white" strokeWidth="2" />
          {/* Heading arrow */}
          <path d="M 0 -9 L 3.5 0 L 0 -3 L -3.5 0 Z" fill="white" opacity="0.9" />
        </g>
      )}

      {/* Distance markers */}
      {[20, 40, 60].map((idx) => (
        ROUTE[idx] && (
          <g key={idx} transform={`translate(${ROUTE[idx].x}, ${ROUTE[idx].y})`}>
            <circle r="4" fill="rgba(99,102,241,0.6)" stroke="rgba(99,102,241,1)" strokeWidth="1" />
            <text x="8" y="4" fill="rgba(99,102,241,0.9)" fontSize="8" fontWeight="600">{Math.round(idx / 20 * 0.8)}km</text>
          </g>
        )
      ))}
    </svg>
  );
}

// ── Live Metric Strip ────────────────────────────────────────────
function LiveMetrics({ elapsed, distance, pace, hr, calories }: {
  elapsed: number; distance: number; pace: number; hr: number; calories: number;
}) {
  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const paceStr = `${Math.floor(pace)}:${Math.round((pace % 1) * 60).toString().padStart(2, "0")}`;

  return (
    <div className="grid grid-cols-4 gap-3">
      {[
        { label: "Time", value: fmt(elapsed), icon: <Timer className="w-3 h-3" />, color: "#6366f1" },
        { label: "Distance", value: `${distance.toFixed(2)}km`, icon: <Navigation className="w-3 h-3" />, color: "#14b8a6" },
        { label: "Pace", value: paceStr + "/km", icon: <Zap className="w-3 h-3" />, color: "#f59e0b" },
        { label: "HR", value: hr + " bpm", icon: <Heart className="w-3 h-3" />, color: "#f43f5e" },
      ].map(({ label, value, icon, color }) => (
        <div key={label} className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5" style={{ color }}>
            {icon}
            <span className="metric-label" style={{ color }}>{label}</span>
          </div>
          <p className="text-sm font-bold tabular-nums text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function GPSMap() {
  const [workoutState, setWorkoutState] = useState<WorkoutState>("idle");
  const [sheetState, setSheetState] = useState<SheetState>("partial");
  const [fullscreen, setFullscreen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [routeProgress, setRouteProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"pace" | "zones" | "elevation">("pace");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const distance = routeProgress * 5.2;
  const pace = 4.8 + Math.sin(routeProgress * 10) * 0.3;
  const hr = Math.round(148 + routeProgress * 20 + Math.sin(elapsed * 0.1) * 5);
  const calories = Math.round(routeProgress * 380);

  useEffect(() => {
    if (workoutState === "active") {
      intervalRef.current = setInterval(() => {
        setElapsed(e => e + 1);
        setRouteProgress(p => Math.min(1, p + 0.003));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [workoutState]);

  const handleStart = () => setWorkoutState("active");
  const handlePause = () => setWorkoutState("paused");
  const handleResume = () => setWorkoutState("active");
  const handleStop = () => {
    setWorkoutState("done");
    setSheetState("full");
  };
  const handleReset = () => {
    setWorkoutState("idle");
    setElapsed(0);
    setRouteProgress(0);
    setSheetState("partial");
  };

  const mapHeight = fullscreen ? "h-screen" : sheetState === "full" ? "h-48" : sheetState === "partial" ? "h-72" : "h-96";

  return (
    <div className={cn("relative flex flex-col overflow-hidden", fullscreen ? "fixed inset-0 z-50 bg-[#080810]" : "rounded-2xl")}>
      {/* ── MAP AREA ── */}
      <div className={cn("relative overflow-hidden transition-all duration-500", mapHeight)}>
        <DarkMap routeProgress={routeProgress} />

        {/* Top Navbar Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="glass-dark rounded-2xl px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-foreground">
                {workoutState === "idle" ? "GPS Ready" : workoutState === "done" ? "Workout Complete" : "🏃 Running"}
              </span>
              {workoutState === "active" && (
                <div className="flex items-center gap-1.5">
                  <div className="live-dot" />
                  <span className="text-[10px] text-[#22c55e] font-bold">LIVE</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Signal className="w-3.5 h-3.5 text-[#22c55e]" />
                <span className="text-[10px] text-muted-foreground">GPS</span>
              </div>
              <div className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">87%</span>
              </div>
              <button onClick={() => setFullscreen(!fullscreen)} className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center">
                {fullscreen ? <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" /> : <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right floating controls */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {[
            { icon: <Navigation className="w-4 h-4" />, label: "recenter" },
            { icon: <Layers className="w-4 h-4" />, label: "style" },
            { icon: <RotateCcw className="w-4 h-4" />, label: "reset" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              onClick={label === "reset" ? handleReset : undefined}
              className="w-10 h-10 glass-dark rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          {workoutState === "idle" && (
            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-2xl font-bold text-sm text-white gradient-teal hover-lift press-scale shadow-lg"
            >
              Start Workout
            </button>
          )}
          {workoutState === "active" && (
            <div className="flex gap-3">
              <button onClick={handlePause} className="glass-dark px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground flex items-center gap-2">
                <Pause className="w-4 h-4" /> Pause
              </button>
              <button onClick={handleStop} className="bg-[#f43f5e]/20 border border-[#f43f5e]/40 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#f43f5e] flex items-center gap-2">
                <Square className="w-4 h-4" /> Stop
              </button>
            </div>
          )}
          {workoutState === "paused" && (
            <div className="flex gap-3">
              <button onClick={handleResume} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-teal flex items-center gap-2">
                <Play className="w-4 h-4" /> Resume
              </button>
              <button onClick={handleStop} className="glass-dark px-5 py-2.5 rounded-xl text-sm font-semibold text-[#f43f5e]">
                <Square className="w-4 h-4" />
              </button>
            </div>
          )}
          {workoutState === "done" && (
            <button onClick={handleReset} className="glass-dark px-6 py-2.5 rounded-xl text-sm font-semibold text-foreground">
              New Workout
            </button>
          )}
        </div>
      </div>

      {/* ── BOTTOM SHEET ── */}
      <div className="flex-1 bg-[hsl(240_22%_9%)] border-t border-white/[0.06]">
        {/* Handle + toggle */}
        <button
          className="w-full flex flex-col items-center py-3 gap-1"
          onClick={() => setSheetState(s => s === "collapsed" ? "partial" : s === "partial" ? "full" : "collapsed")}
        >
          <div className="bottom-sheet-handle" />
          <div className="flex items-center gap-1 text-muted-foreground">
            {sheetState === "full" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </div>
        </button>

        {sheetState !== "collapsed" && (
          <div className="px-4 pb-4 space-y-4">
            {/* Live metrics */}
            <LiveMetrics elapsed={elapsed} distance={distance} pace={pace} hr={hr} calories={calories} />

            {/* Secondary grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Calories", value: calories, unit: "kcal", color: "#f59e0b" },
                { label: "Elevation", value: "+124", unit: "m", color: "#22c55e" },
                { label: "Cadence", value: "162", unit: "spm", color: "#6366f1" },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="stat-card p-3">
                  <p className="metric-label">{label}</p>
                  <p className="text-lg font-bold tabular-nums" style={{ color }}>{value}<span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span></p>
                </div>
              ))}
            </div>

            {sheetState === "full" && (
              <>
                {/* Chart tabs */}
                <div className="flex gap-1 p-1 glass rounded-xl">
                  {(["pace", "zones", "elevation"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                        activeTab === tab ? "bg-[#6366f1] text-white" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Charts */}
                <div className="h-32">
                  {activeTab === "pace" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PACE_DATA}>
                        <defs>
                          <linearGradient id="paceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="min" hide />
                        <YAxis domain={[4, 7]} hide />
                        <Tooltip contentStyle={{ background: "hsl(240 22% 12%)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${Math.floor(v)}:${Math.round((v%1)*60).toString().padStart(2,"0")}/km`, "Pace"]} />
                        <Area type="monotone" dataKey="pace" stroke="#6366f1" fill="url(#paceGrad)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                  {activeTab === "zones" && (
                    <div className="space-y-1.5">
                      {HR_ZONES.map(z => (
                        <div key={z.zone} className="flex items-center gap-3">
                          <span className="text-xs font-bold w-6" style={{ color: z.color }}>{z.zone}</span>
                          <div className="flex-1 h-5 bg-white/[0.04] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${z.pct}%`, background: z.color + "cc" }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">{z.pct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === "elevation" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ELEVATION_DATA}>
                        <defs>
                          <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="min" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{ background: "hsl(240 22% 12%)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${Math.round(v)}m`, "Elevation"]} />
                        <Area type="monotone" dataKey="elev" stroke="#22c55e" fill="url(#elevGrad)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Route progress scrubber */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Route playback</span>
                    <span>{Math.round(routeProgress * 100)}%</span>
                  </div>
                  <div className="relative h-1.5 bg-white/[0.08] rounded-full">
                    <div className="absolute left-0 top-0 h-full rounded-full gradient-teal" style={{ width: `${routeProgress * 100}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg" style={{ left: `calc(${routeProgress * 100}% - 6px)` }} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
