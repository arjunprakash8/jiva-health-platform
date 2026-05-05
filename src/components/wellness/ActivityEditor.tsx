"use client";
/**
 * ActivityEditor — Dynamic "Edit Activity" screen
 *
 * Detects whether the selected sport is distance-based or strain-based
 * and renders the appropriate metric editor panel with a seamless
 * animated transition between the two modes.
 *
 * Distance  →  pace, elevation, splits, cadence
 * Strain    →  StrainDashboard (HR zones, max HR, duration, recovery impact)
 */

import { useState, useCallback } from "react";
import {
  ArrowLeft, Check, Navigation, Zap, MapPin,
  TrendingUp, Mountain, Activity, RotateCcw, Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StrainDashboard from "@/components/wellness/StrainDashboard";
import SportSelector, { SPORTS } from "@/components/ui/SportSelector";
import {
  ActivitySession, ActivityClass, getActivityClass,
  createActivitySession, formatPace, formatDuration,
  StrainMetrics, DistanceMetrics, SessionTime, CommonMetrics,
} from "@/lib/activitySchema";

// ─── Distance Metrics Editor ─────────────────────────────────────────────────

function DistanceEditor({
  distance, session, editable = false,
  onDistanceChange, onSessionChange,
}: {
  distance: DistanceMetrics;
  session: SessionTime;
  editable?: boolean;
  onDistanceChange?: (d: DistanceMetrics) => void;
  onSessionChange?: (s: SessionTime) => void;
}) {
  const [local, setLocal] = useState(distance);

  const update = (patch: Partial<DistanceMetrics>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onDistanceChange?.(next);
  };

  const fields = [
    {
      label: "Distance", value: local.distanceKm.toFixed(2), unit: "km",
      icon: MapPin, color: "#14b8a6",
      hint: "Total GPS distance",
      onChange: (v: string) => update({ distanceKm: parseFloat(v) || local.distanceKm }),
    },
    {
      label: "Avg Pace", value: formatPace(local.avgPaceSecPerKm), unit: "min/km",
      icon: TrendingUp, color: "#6366f1",
      hint: "Average pace per kilometre",
      onChange: () => {}, // pace is derived — show only
    },
    {
      label: "Elevation Gain", value: local.elevationGainM, unit: "m",
      icon: Mountain, color: "#f59e0b",
      hint: "Total ascent",
      onChange: (v: string) => update({ elevationGainM: parseInt(v) || local.elevationGainM }),
    },
    {
      label: "Avg Cadence", value: local.avgCadenceRpm, unit: "rpm",
      icon: Activity, color: "#22c55e",
      hint: "Steps or pedal strokes per minute",
      onChange: (v: string) => update({ avgCadenceRpm: parseInt(v) || local.avgCadenceRpm }),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Distance hero */}
      <div className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(99,102,241,0.1) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(20,184,166,0.6) 0%, transparent 60%)" }} />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Distance Activity</span>
            </div>
            <p className="text-xs text-white/40">GPS tracked · Pace &amp; elevation recorded</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-teal-400 tabular-nums">{local.distanceKm.toFixed(2)}</p>
            <p className="text-sm text-white/40">kilometres</p>
          </div>
        </div>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.label} className="stat-card hover-lift rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: f.color + "20", border: `1px solid ${f.color}30` }}>
                <f.icon className="w-3.5 h-3.5" style={{ color: f.color }} />
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{f.label}</p>
            </div>
            {editable && f.label !== "Avg Pace" ? (
              <input
                type={f.label === "Avg Pace" ? "text" : "number"}
                defaultValue={String(f.value)}
                onBlur={e => f.onChange(e.target.value)}
                className="w-full text-2xl font-black bg-transparent outline-none text-white border-b border-white/10 pb-1"
              />
            ) : (
              <div className="flex items-end gap-1.5">
                <span className="text-2xl font-black tabular-nums" style={{ color: f.color }}>{f.value}</span>
                <span className="text-xs text-white/40 mb-0.5">{f.unit}</span>
              </div>
            )}
            <p className="text-[9px] text-white/25">{f.hint}</p>
          </div>
        ))}
      </div>

      {/* Duration breakdown */}
      <div className="glass rounded-2xl p-4">
        <p className="text-sm font-bold text-white mb-3">Session Duration</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Active Time", secs: session.activeSeconds, color: "#22c55e" },
            { label: "Elapsed Time", secs: session.elapsedSeconds, color: "#f59e0b" },
          ].map(({ label, secs, color }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: color + "10", border: `1px solid ${color}20` }}>
              <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-lg font-black tabular-nums" style={{ color }}>{formatDuration(secs)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mode Switch Banner ───────────────────────────────────────────────────────

function ModeSwitchBanner({
  from, to, sportLabel, onDismiss,
}: {
  from: ActivityClass; to: ActivityClass; sportLabel: string; onDismiss: () => void;
}) {
  return (
    <div className="rounded-2xl p-4 flex items-start gap-3 animate-fade-up"
      style={{ background: to === "strain" ? "rgba(245,158,11,0.1)" : "rgba(20,184,166,0.1)", border: `1px solid ${to === "strain" ? "rgba(245,158,11,0.3)" : "rgba(20,184,166,0.3)"}` }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: to === "strain" ? "rgba(245,158,11,0.2)" : "rgba(20,184,166,0.2)" }}>
        {to === "strain" ? <Zap className="w-4 h-4 text-amber-400" /> : <Navigation className="w-4 h-4 text-teal-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">
          Switched to {to === "strain" ? "Strain" : "Distance"} mode
        </p>
        <p className="text-xs text-white/50 mt-0.5">
          {sportLabel} uses {to === "strain"
            ? "cardiovascular effort metrics instead of distance/pace"
            : "GPS distance and pace as primary metrics"}
        </p>
      </div>
      <button onClick={onDismiss} className="text-white/30 hover:text-white/60 text-lg leading-none">×</button>
    </div>
  );
}

// ─── Sport Switcher ───────────────────────────────────────────────────────────

function SportSwitcherRow({
  currentSportId, currentSportLabel, currentSportEmoji, activityClass, onChangeSport,
}: {
  currentSportId: string;
  currentSportLabel: string;
  currentSportEmoji: string;
  activityClass: ActivityClass;
  onChangeSport: (id: string, label: string, emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-2xl p-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl flex-shrink-0">
          {currentSportEmoji}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{currentSportLabel}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {activityClass === "strain" ? (
              <><Zap className="w-3 h-3 text-amber-400" /><span className="text-[10px] text-amber-400 font-semibold">Strain-based</span></>
            ) : (
              <><Navigation className="w-3 h-3 text-teal-400" /><span className="text-[10px] text-teal-400 font-semibold">Distance-based</span></>
            )}
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-white/40 hover:text-white/70 glass px-3 py-1.5 rounded-xl press-scale transition-colors"
        >
          Change
        </button>
      </div>

      {open && (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <SportSelector
            onSelect={s => {
              onChangeSport(s.id, s.label, s.emoji);
              setOpen(false);
            }}
            selected={currentSportId}
          />
        </div>
      )}
    </div>
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────

function NotesCard({ value, onChange }: { value: string; onChange?: (v: string) => void }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-sm font-bold text-white mb-2">Session Notes</p>
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder="How did it feel? Any injuries, PRs, or observations..."
        rows={3}
        readOnly={!onChange}
        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-teal-500/40 resize-none transition-colors"
      />
    </div>
  );
}

// ─── Calories / RPE ──────────────────────────────────────────────────────────

function CommonMetricsCard({
  common, editable = false, onChange,
}: {
  common: CommonMetrics; editable?: boolean;
  onChange?: (c: CommonMetrics) => void;
}) {
  const rpeLabels = ["", "Very Light", "Light", "Moderate", "Moderate+", "Hard", "Hard+", "Very Hard", "Very Hard+", "Extremely Hard", "Max Effort"];
  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      <p className="text-sm font-bold text-white">Effort Summary</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Calories</p>
          {editable ? (
            <input type="number" defaultValue={common.caloriesBurned}
              onBlur={e => onChange?.({ ...common, caloriesBurned: parseInt(e.target.value) || common.caloriesBurned })}
              className="w-full text-xl font-black bg-transparent outline-none text-amber-400 border-b border-white/10 pb-0.5" />
          ) : (
            <p className="text-xl font-black text-amber-400 tabular-nums">{common.caloriesBurned}</p>
          )}
          <p className="text-[9px] text-white/30 mt-0.5">kcal burned</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">RPE</p>
          <p className="text-xl font-black text-indigo-400 tabular-nums">{common.avgRpe}<span className="text-sm font-normal text-white/30">/10</span></p>
          <p className="text-[9px] text-white/30 mt-0.5">{rpeLabels[common.avgRpe] ?? ""}</p>
        </div>
      </div>
      {editable && (
        <div>
          <p className="text-[10px] text-white/40 mb-1">Rate of Perceived Exertion (RPE)</p>
          <input type="range" min={1} max={10} step={1} value={common.avgRpe}
            onChange={e => onChange?.({ ...common, avgRpe: parseInt(e.target.value) })}
            className="w-full h-1.5 cursor-pointer accent-indigo-400" />
          <div className="flex justify-between text-[9px] text-white/20 mt-1">
            <span>1 Easy</span><span>5 Moderate</span><span>10 Max</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ActivityEditor ──────────────────────────────────────────────────────

export interface ActivityEditorProps {
  session?: ActivitySession;
  onSave?: (s: ActivitySession) => void;
  onBack?: () => void;
}

export default function ActivityEditor({ session, onSave, onBack }: ActivityEditorProps) {
  // Bootstrap with a mock session if none provided
  const [data, setData] = useState<ActivitySession>(() =>
    session ?? createActivitySession("hiit", "HIIT", "⚡")
  );
  const [switchBanner, setSwitchBanner] = useState<{ from: ActivityClass; to: ActivityClass } | null>(null);
  const [saved, setSaved] = useState(false);

  const activityClass = getActivityClass(data.sportId);

  const handleSportChange = useCallback((id: string, label: string, emoji: string) => {
    const prevClass = getActivityClass(data.sportId);
    const nextClass = getActivityClass(id);
    setData(d => ({ ...d, sportId: id, sportLabel: label, sportEmoji: emoji, activityClass: nextClass }));
    if (prevClass !== nextClass) {
      setSwitchBanner({ from: prevClass, to: nextClass });
    }
  }, [data.sportId]);

  const handleSave = () => {
    onSave?.(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 pb-8 animate-fade-up">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/[0.08] transition-colors press-scale">
            <ArrowLeft className="w-4 h-4 text-white/70" />
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-base font-bold text-white">Edit Activity</h2>
          <p className="text-[10px] text-white/40 mt-0.5">
            {activityClass === "strain" ? "Strain-based sport" : "Distance-based sport"} · Tap fields to edit
          </p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-bold press-scale transition-all",
            saved ? "bg-teal-500/20 text-teal-300 border border-teal-500/40" : "gradient-teal text-white shadow-lg"
          )}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save</>}
        </button>
      </div>

      {/* Mode-switch notification */}
      {switchBanner && (
        <ModeSwitchBanner
          from={switchBanner.from}
          to={switchBanner.to}
          sportLabel={data.sportLabel}
          onDismiss={() => setSwitchBanner(null)}
        />
      )}

      {/* Sport switcher */}
      <SportSwitcherRow
        currentSportId={data.sportId}
        currentSportLabel={data.sportLabel}
        currentSportEmoji={data.sportEmoji}
        activityClass={activityClass}
        onChangeSport={handleSportChange}
      />

      {/* ── Conditional metric panel ── */}
      <div key={activityClass} className="transition-all duration-300">
        {activityClass === "strain" ? (
          <StrainDashboard
            strain={data.strain}
            session={data.session}
            sportLabel={data.sportLabel}
            sportEmoji={data.sportEmoji}
            editable
            onStrainChange={s => setData(d => ({ ...d, strain: s }))}
            onSessionChange={s => setData(d => ({ ...d, session: s }))}
          />
        ) : (
          <DistanceEditor
            distance={data.distance}
            session={data.session}
            editable
            onDistanceChange={d => setData(prev => ({ ...prev, distance: d }))}
            onSessionChange={s => setData(prev => ({ ...prev, session: s }))}
          />
        )}
      </div>

      {/* Common metrics (both modes) */}
      <CommonMetricsCard
        common={data.common}
        editable
        onChange={c => setData(d => ({ ...d, common: c }))}
      />

      {/* Notes */}
      <NotesCard
        value={data.common.notes}
        onChange={notes => setData(d => ({ ...d, common: { ...d.common, notes } }))}
      />

      {/* Reset button */}
      <button
        onClick={() => setData(createActivitySession(data.sportId, data.sportLabel, data.sportEmoji))}
        className="w-full flex items-center justify-center gap-2 h-10 rounded-2xl glass text-xs text-white/40 hover:text-white/60 press-scale transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset to auto-calculated values
      </button>
    </div>
  );
}
