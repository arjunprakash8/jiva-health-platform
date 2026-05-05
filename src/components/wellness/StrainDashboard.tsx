"use client";
/**
 * StrainDashboard — WHOOP-style strain metrics editor
 * Used when the selected sport is classified as "strain-based"
 * (non-linear or stationary: boxing, yoga, HIIT, surfing, etc.)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Zap, Clock, TrendingUp, Battery, Edit3, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StrainMetrics, HRZone, SessionTime,
  hrZonePct, hrZoneTotalSeconds, formatDuration,
} from "@/lib/activitySchema";

// ─── Circular Strain Gauge (Canvas) ──────────────────────────────────────────

interface StrainGaugeProps {
  score: number;   // 0–21
  size?: number;
  animated?: boolean;
}

function StrainGauge({ score, size = 160, animated = true }: StrainGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const progressRef = useRef(0);

  const getColor = (s: number) => {
    if (s <= 7) return { primary: "#6b7280", label: "Light",    glow: "rgba(107,114,128,0.4)" };
    if (s <= 13) return { primary: "#3b82f6", label: "Moderate", glow: "rgba(59,130,246,0.4)" };
    if (s <= 17) return { primary: "#f59e0b", label: "Hard",     glow: "rgba(245,158,11,0.4)" };
    return          { primary: "#f43f5e", label: "All Out",  glow: "rgba(244,63,94,0.4)" };
  };

  const draw = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const cx = W / 2, cy = H / 2;
    const r = W * 0.38;
    const col = getColor(score);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glow halo
    const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.5);
    glowGrad.addColorStop(0, col.glow.replace("0.4", "0.12"));
    glowGrad.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad; ctx.fill();

    // Track ring
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI * 0.75, Math.PI * 1.75);
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.stroke();

    // Filled arc (animated)
    const maxAngle = Math.PI * 2.5; // 270 degrees arc
    const fillAngle = (progress / 21) * maxAngle;
    const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    grad.addColorStop(0, col.primary + "aa");
    grad.addColorStop(1, col.primary);
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI * 0.75, -Math.PI * 0.75 + fillAngle);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.stroke();

    // Drop shadow / glow on arc tip
    const tipAngle = -Math.PI * 0.75 + fillAngle;
    const tx = cx + Math.cos(tipAngle) * r;
    const ty = cy + Math.sin(tipAngle) * r;
    const tipGlow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 14);
    tipGlow.addColorStop(0, col.primary);
    tipGlow.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(tx, ty, 7, 0, Math.PI * 2);
    ctx.fillStyle = tipGlow; ctx.fill();

    // Center score
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `800 ${r * 0.55}px -apple-system, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(progress.toFixed(1), cx, cy - r * 0.08);

    ctx.font = `600 ${r * 0.18}px -apple-system, sans-serif`;
    ctx.fillStyle = col.primary;
    ctx.fillText("STRAIN", cx, cy + r * 0.35);

    ctx.font = `500 ${r * 0.14}px -apple-system, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText("/ 21", cx, cy + r * 0.55);
  }, [score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    if (animated) {
      const target = score;
      const start = performance.now();
      const duration = 900;
      const animate = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        progressRef.current = ease * target;
        draw(progressRef.current);
        if (t < 1) animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } else {
      draw(score);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [size, score, draw, animated]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="drop-shadow-lg"
    />
  );
}

// ─── HR Zone Bar ─────────────────────────────────────────────────────────────

interface HRZoneBarProps {
  zones: HRZone[];
  editable?: boolean;
  onZoneChange?: (zoneId: number, seconds: number) => void;
}

function HRZoneBar({ zones, editable = false, onZoneChange }: HRZoneBarProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const [tempVal, setTempVal] = useState("");
  const totalSecs = hrZoneTotalSeconds(zones);

  return (
    <div className="space-y-3">
      {/* Stacked percentage bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {zones.map(z => {
          const pct = hrZonePct(z, zones);
          if (pct === 0) return null;
          return (
            <div
              key={z.zoneId}
              className="rounded-sm transition-all duration-700"
              style={{ flex: z.secondsInZone, background: z.color }}
              title={`${z.name}: ${pct}%`}
            />
          );
        })}
      </div>

      {/* Per-zone rows */}
      <div className="space-y-2">
        {zones.map(z => {
          const pct = hrZonePct(z, zones);
          const isEditing = editing === z.zoneId;
          return (
            <div key={z.zoneId} className="flex items-center gap-3">
              {/* Zone color dot + label */}
              <div className="flex items-center gap-2 w-28 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: z.color }} />
                <div>
                  <p className="text-[10px] font-bold text-white/80">{z.label} · {z.name}</p>
                  <p className="text-[9px] text-white/30">{z.minPct}–{z.maxPct}% MHR</p>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: z.color }}
                />
              </div>

              {/* Time display / editable */}
              {editable && isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={tempVal}
                    onChange={e => setTempVal(e.target.value)}
                    className="w-16 text-xs text-right bg-white/[0.08] border border-white/20 rounded-lg px-2 py-1 text-white outline-none"
                    placeholder="min"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      onZoneChange?.(z.zoneId, parseInt(tempVal || "0") * 60);
                      setEditing(null);
                    }}
                    className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-teal-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { if (editable) { setTempVal(String(Math.round(z.secondsInZone / 60))); setEditing(z.zoneId); } }}
                  className={cn(
                    "text-xs font-mono tabular-nums text-right w-16",
                    editable ? "text-white/70 hover:text-white cursor-pointer" : "text-white/50 cursor-default"
                  )}
                >
                  {formatDuration(z.secondsInZone)}
                  {editable && <Edit3 className="w-2.5 h-2.5 inline ml-1 opacity-40" />}
                </button>
              )}

              {/* Pct */}
              <span className="text-[10px] text-white/30 w-8 text-right tabular-nums">{pct}%</span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-white/30 text-right">
        Total tracked: {formatDuration(totalSecs)}
      </p>
    </div>
  );
}

// ─── Recovery Impact Gauge ────────────────────────────────────────────────────

function RecoveryImpactMeter({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const color = value >= 70 ? "#f43f5e" : value >= 40 ? "#f59e0b" : "#22c55e";
  const label = value >= 70 ? "High Impact" : value >= 40 ? "Moderate" : "Low Impact";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] text-white/40 uppercase tracking-widest">Recovery Impact</span>
        <span className="text-sm font-bold" style={{ color }}>{label}</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, #22c55e, ${value >= 40 ? "#f59e0b" : "#22c55e"}, ${value >= 70 ? "#f43f5e" : "#f59e0b"})`,
          }}
        />
      </div>
      {onChange && (
        <input
          type="range"
          min={0} max={100} step={1}
          value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          className="w-full h-1 accent-teal-400 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        />
      )}
      <div className="flex justify-between text-[9px] text-white/20">
        <span>Light ({`<`}40)</span>
        <span>Moderate (40–70)</span>
        <span>High ({`>`}70)</span>
      </div>
      <p className="text-[10px] text-white/40 text-center">
        {value}/100 — {value >= 70 ? "Prioritise sleep & nutrition tonight" : value >= 40 ? "Normal recovery routine" : "Minimal recovery needed"}
      </p>
    </div>
  );
}

// ─── Inline Metric Input ─────────────────────────────────────────────────────

function MetricInput({
  label, value, unit, icon: Icon, color, editable = false,
  onChange, type = "number", hint,
}: {
  label: string; value: string | number; unit?: string;
  icon: React.ElementType; color: string; editable?: boolean;
  onChange?: (v: string) => void; type?: string; hint?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(String(value));

  return (
    <div className="stat-card hover-lift rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: color + "20", border: `1px solid ${color}30` }}>
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">{label}</p>
        </div>
        {editable && !editing && (
          <button onClick={() => { setTemp(String(value)); setEditing(true); }}
            className="w-6 h-6 rounded-lg glass flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
            <Edit3 className="w-3 h-3 text-white/60" />
          </button>
        )}
        {editable && editing && (
          <button onClick={() => { onChange?.(temp); setEditing(false); }}
            className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
            <Check className="w-3 h-3 text-teal-400" />
          </button>
        )}
      </div>

      {editing ? (
        <input
          type={type}
          value={temp}
          onChange={e => setTemp(e.target.value)}
          className="w-full text-2xl font-black bg-transparent outline-none text-white border-b border-white/20 pb-1"
          autoFocus
        />
      ) : (
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-black tabular-nums" style={{ color }}>{value}</span>
          {unit && <span className="text-xs text-white/40 mb-0.5">{unit}</span>}
        </div>
      )}

      {hint && <p className="text-[9px] text-white/25">{hint}</p>}
    </div>
  );
}

// ─── Session Time Editor ─────────────────────────────────────────────────────

function SessionTimeCard({
  session, editable = false, onChange,
}: {
  session: SessionTime; editable?: boolean;
  onChange?: (s: SessionTime) => void;
}) {
  const efficiency = session.elapsedSeconds > 0
    ? Math.round((session.activeSeconds / session.elapsedSeconds) * 100)
    : 0;

  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-teal-400" />
        <p className="text-sm font-bold text-white">Session Duration</p>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full glass text-teal-300 font-semibold">
          {efficiency}% efficiency
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Active Time", secs: session.activeSeconds, key: "activeSeconds" as const, color: "#22c55e" },
          { label: "Elapsed Time", secs: session.elapsedSeconds, key: "elapsedSeconds" as const, color: "#f59e0b" },
        ].map(({ label, secs, key, color }) => (
          <div key={key} className="rounded-xl p-3" style={{ background: color + "10", border: `1px solid ${color}20` }}>
            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-black tabular-nums" style={{ color }}>{formatDuration(secs)}</p>
            <div className="mt-2 h-1 rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (secs / 3600) * 100)}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main StrainDashboard ─────────────────────────────────────────────────────

export interface StrainDashboardProps {
  strain: StrainMetrics;
  session: SessionTime;
  sportLabel: string;
  sportEmoji: string;
  editable?: boolean;
  onStrainChange?: (s: StrainMetrics) => void;
  onSessionChange?: (s: SessionTime) => void;
}

export default function StrainDashboard({
  strain,
  session,
  sportLabel,
  sportEmoji,
  editable = false,
  onStrainChange,
  onSessionChange,
}: StrainDashboardProps) {
  const [local, setLocal] = useState<StrainMetrics>(strain);

  useEffect(() => { setLocal(strain); }, [strain]);

  const update = (patch: Partial<StrainMetrics>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onStrainChange?.(next);
  };

  const updateZone = (zoneId: number, seconds: number) => {
    const zones = local.hrZones.map(z =>
      z.zoneId === zoneId ? { ...z, secondsInZone: seconds } : z
    );
    update({ hrZones: zones });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(245,158,11,0.08) 50%, rgba(99,102,241,0.08) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(244,63,94,0.6) 0%, transparent 60%)" }} />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Strain Activity</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">{sportEmoji} {sportLabel}</h3>
            <p className="text-xs text-white/40 mt-0.5">Cardiovascular effort · No distance tracked</p>
          </div>
          <StrainGauge score={local.strainScore} size={100} />
        </div>
      </div>

      {/* Key HR Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricInput
          label="Max Heart Rate" value={local.maxHrBpm} unit="bpm"
          icon={Heart} color="#f43f5e" editable={editable}
          hint="Peak BPM during session"
          onChange={v => update({ maxHrBpm: parseInt(v) || local.maxHrBpm })}
        />
        <MetricInput
          label="Avg Heart Rate" value={local.avgHrBpm} unit="bpm"
          icon={TrendingUp} color="#f59e0b" editable={editable}
          hint="Mean BPM across active time"
          onChange={v => update({ avgHrBpm: parseInt(v) || local.avgHrBpm })}
        />
      </div>

      {/* Strain score edit */}
      {editable && (
        <div className="glass rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <p className="text-sm font-bold text-white">Strain Score</p>
            </div>
            <span className="text-xl font-black text-amber-400 tabular-nums">{local.strainScore}</span>
          </div>
          <input
            type="range" min={0} max={21} step={0.1}
            value={local.strainScore}
            onChange={e => update({ strainScore: parseFloat(e.target.value) })}
            className="w-full h-1.5 cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[9px] text-white/25">
            <span>0 Light</span>
            <span>7 Moderate</span>
            <span>14 Hard</span>
            <span>21 All Out</span>
          </div>
        </div>
      )}

      {/* Session Time */}
      <SessionTimeCard session={session} editable={editable} onChange={onSessionChange} />

      {/* HR Zones */}
      <div className="glass rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <p className="text-sm font-bold text-white">Heart Rate Zones</p>
          {editable && <span className="ml-auto text-[10px] text-white/30">Tap time to edit</span>}
        </div>
        <HRZoneBar zones={local.hrZones} editable={editable} onZoneChange={updateZone} />
      </div>

      {/* Recovery Impact */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4 text-teal-400" />
          <p className="text-sm font-bold text-white">Recovery Impact</p>
        </div>
        <RecoveryImpactMeter
          value={local.recoveryImpact}
          onChange={editable ? v => update({ recoveryImpact: v }) : undefined}
        />
      </div>
    </div>
  );
}
