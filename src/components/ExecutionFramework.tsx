"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, Shield, Users, FileText, ChevronRight, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Check = "pass" | "fail" | "pending";
type PhaseStatus = "complete" | "active" | "pending" | "blocked";
type DriftType = "scope" | "logic" | "assumption" | "contradiction";
type WaveStatus = "complete" | "active" | "pending";

interface PhaseResult {
  structural: Check;
  integrity: Check;
  evidence: { label: string; done: boolean }[];
  agent: string;
  status: PhaseStatus;
}

interface DriftFlag {
  type: DriftType;
  message: string;
  critical: boolean;
  resolved: boolean;
}

interface ClinicalChunk {
  patientId: string;
  patientName: string;
  condition: string;
  currentPhase: number;
  phases: PhaseResult[];
  drift: DriftFlag[];
  gatePass: boolean;
  approved: boolean;
}

interface ClinicalWave {
  id: number;
  name: string;
  objective: string;
  status: WaveStatus;
  chunks: ClinicalChunk[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PHASE_NAMES = [
  "Prep", "Audit", "Review", "Root Cause",
  "Plan", "Build", "Verify", "Test", "Post-Audit", "Final",
];

const AGENTS = ["Dr. Owusu", "Nurse Adjei", "Dr. Mensah", "AI Engine", "Clinical Lead"];

function makePhases(current: number): PhaseResult[] {
  return PHASE_NAMES.map((_, i): PhaseResult => {
    if (i < current) return {
      structural: "pass", integrity: "pass",
      evidence: [{ label: "Data collected", done: true }, { label: "Reviewed by agent", done: true }],
      agent: AGENTS[i % AGENTS.length], status: "complete",
    };
    if (i === current) return {
      structural: "pass", integrity: "pending",
      evidence: [{ label: "Data collected", done: true }, { label: "Reviewed by agent", done: false }, { label: "Outcome logged", done: false }],
      agent: AGENTS[i % AGENTS.length], status: "active",
    };
    return {
      structural: "pending", integrity: "pending",
      evidence: [{ label: "Awaiting prior phase", done: false }],
      agent: AGENTS[i % AGENTS.length], status: "pending",
    };
  });
}

const WAVES: ClinicalWave[] = [
  {
    id: 1, name: "Wave 1 — Baseline", objective: "Enroll patients, collect baseline biometrics, establish health score benchmarks",
    status: "complete",
    chunks: [
      { patientId: "PT-001", patientName: "Amara Osei", condition: "Hypertension", currentPhase: 10, phases: makePhases(10), drift: [], gatePass: true, approved: true },
      { patientId: "PT-002", patientName: "Kofi Mensah", condition: "Type 2 Diabetes", currentPhase: 10, phases: makePhases(10), drift: [], gatePass: true, approved: true },
      { patientId: "PT-003", patientName: "Ama Darko", condition: "Arrhythmia", currentPhase: 10, phases: makePhases(10), drift: [], gatePass: true, approved: true },
    ],
  },
  {
    id: 2, name: "Wave 2 — Intervention", objective: "Deploy personalised health interventions, validate lifestyle modifications, measure compliance deltas",
    status: "active",
    chunks: [
      {
        patientId: "PT-001", patientName: "Amara Osei", condition: "Hypertension", currentPhase: 5,
        phases: makePhases(5),
        drift: [
          { type: "scope", message: "Additional medication review added mid-phase — not in original plan", critical: false, resolved: true },
          { type: "assumption", message: "Assumed patient compliance at 80%; actual is 64%", critical: true, resolved: false },
        ],
        gatePass: false, approved: false,
      },
      {
        patientId: "PT-002", patientName: "Kofi Mensah", condition: "Type 2 Diabetes", currentPhase: 3,
        phases: makePhases(3),
        drift: [
          { type: "logic", message: "HbA1c trend diverges from predicted model — root cause unresolved", critical: true, resolved: false },
        ],
        gatePass: false, approved: false,
      },
      {
        patientId: "PT-004", patientName: "Yaw Asante", condition: "Obesity", currentPhase: 8,
        phases: makePhases(8),
        drift: [],
        gatePass: true, approved: false,
      },
    ],
  },
  {
    id: 3, name: "Wave 3 — Outcome Evaluation", objective: "Measure 90-day health score deltas, validate insurer KPIs, publish FHIR outcome reports",
    status: "pending",
    chunks: [],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckIcon({ val }: { val: Check }) {
  if (val === "pass") return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
  if (val === "fail") return <XCircle className="w-3.5 h-3.5 text-destructive" />;
  return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
}

function PhaseStatusDot({ status }: { status: PhaseStatus }) {
  const cls = {
    complete: "bg-emerald-500",
    active: "bg-primary animate-pulse",
    pending: "bg-muted-foreground/30",
    blocked: "bg-destructive",
  }[status];
  return <span className={cn("w-2 h-2 rounded-full shrink-0", cls)} />;
}

function WaveBadge({ status }: { status: WaveStatus }) {
  if (status === "complete") return <Badge variant="success">Complete</Badge>;
  if (status === "active") return <Badge variant="default">Active</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

function DriftBadge({ type }: { type: DriftType }) {
  const map: Record<DriftType, string> = {
    scope: "bg-blue-100 text-blue-800",
    logic: "bg-purple-100 text-purple-800",
    assumption: "bg-amber-100 text-amber-800",
    contradiction: "bg-red-100 text-red-800",
  };
  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border-0", map[type])}>
      {type}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExecutionFramework() {
  const [activeWave, setActiveWave] = useState(1);
  const [activeChunk, setActiveChunk] = useState<ClinicalChunk | null>(WAVES[1].chunks[0]);

  const wave = WAVES.find(w => w.id === activeWave)!;
  const unresolvedCriticalDrift = activeChunk?.drift.filter(d => d.critical && !d.resolved) ?? [];
  const evidenceComplete = activeChunk
    ? activeChunk.phases[activeChunk.currentPhase < 10 ? activeChunk.currentPhase : 9]?.evidence.every(e => e.done)
    : false;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Clinical Execution Framework</h2>
          <p className="text-xs text-muted-foreground">Program → Waves → Chunks → Phases → Agents → Evidence → Gates</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>No single-agent decisions · No proof = no completion</span>
        </div>
      </div>

      {/* Wave Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {WAVES.map(w => (
          <button key={w.id} onClick={() => { setActiveWave(w.id); setActiveChunk(w.chunks[0] ?? null); }}
            className={cn(
              "text-left rounded-xl border p-4 transition-all hover:shadow-md",
              activeWave === w.id ? "border-primary bg-primary/5 shadow-sm" : "bg-card hover:border-primary/40"
            )}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground">WAVE {w.id}</span>
              <WaveBadge status={w.status} />
            </div>
            <p className="font-semibold text-sm leading-tight">{w.name}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{w.objective}</p>
            {w.chunks.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Progress
                  value={Math.round(w.chunks.filter(c => c.approved).length / w.chunks.length * 100)}
                  className="h-1.5 flex-1"
                />
                <span className="text-xs text-muted-foreground shrink-0">
                  {w.chunks.filter(c => c.approved).length}/{w.chunks.length}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {wave.chunks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Lock className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Wave {wave.id} is locked</p>
            <p className="text-xs mt-1">All prior waves must fully pass before this wave unlocks.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Chunk List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Chunks — {wave.name}</CardTitle>
              <CardDescription className="text-xs">Select a patient chunk to inspect</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {wave.chunks.map(chunk => {
                const phasePct = Math.round((chunk.currentPhase / 10) * 100);
                const critDrift = chunk.drift.filter(d => d.critical && !d.resolved).length;
                return (
                  <button key={chunk.patientId} onClick={() => setActiveChunk(chunk)}
                    className={cn(
                      "w-full text-left px-4 py-3.5 border-b border-border/50 hover:bg-muted/50 transition-colors",
                      activeChunk?.patientId === chunk.patientId ? "bg-primary/5 border-l-4 border-l-primary" : ""
                    )}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-sm font-semibold">{chunk.patientName}</p>
                        <p className="text-xs text-muted-foreground">{chunk.patientId} · {chunk.condition}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={phasePct} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground shrink-0">Phase {chunk.currentPhase}/10</span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {chunk.approved && <Badge variant="success" className="text-xs py-0">Approved</Badge>}
                      {chunk.gatePass && !chunk.approved && <Badge variant="info" className="text-xs py-0">Gate Pass</Badge>}
                      {critDrift > 0 && <Badge variant="danger" className="text-xs py-0 animate-pulse">{critDrift} drift</Badge>}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Phase Detail + Evidence + Gates */}
          {activeChunk && (
            <div className="lg:col-span-2 space-y-4">

              {/* Phase Grid */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-sm">{activeChunk.patientName} — Phase Tracker</CardTitle>
                      <CardDescription className="text-xs">10 mandatory phases · S = Structural · I = Integrity</CardDescription>
                    </div>
                    {activeChunk.gatePass
                      ? <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Gate Pass</Badge>
                      : <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Gate Pending</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {activeChunk.phases.map((ph, i) => (
                      <div key={i}
                        className={cn(
                          "rounded-lg border p-2.5 text-xs transition-colors",
                          ph.status === "complete" ? "bg-emerald-50 border-emerald-200" :
                          ph.status === "active" ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20" :
                          "bg-muted/30 border-border"
                        )}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <PhaseStatusDot status={ph.status} />
                          <span className={cn("font-bold", ph.status === "complete" ? "text-emerald-700" : ph.status === "active" ? "text-primary" : "text-muted-foreground")}>
                            P{i + 1}
                          </span>
                        </div>
                        <p className="font-semibold leading-tight mb-2">{PHASE_NAMES[i]}</p>
                        <div className="flex gap-1.5">
                          <span className="flex items-center gap-0.5">
                            <span className="text-muted-foreground">S</span>
                            <CheckIcon val={ph.structural} />
                          </span>
                          <span className="flex items-center gap-0.5">
                            <span className="text-muted-foreground">I</span>
                            <CheckIcon val={ph.integrity} />
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1.5 truncate">{ph.agent}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Evidence Panel */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Evidence — Phase {activeChunk.currentPhase < 10 ? activeChunk.currentPhase + 1 : 10}
                    </CardTitle>
                    <CardDescription className="text-xs">No proof = no completion</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {activeChunk.phases[activeChunk.currentPhase < 10 ? activeChunk.currentPhase : 9]?.evidence.map((e, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {e.done
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          : <Clock className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <span className={e.done ? "text-foreground" : "text-muted-foreground"}>{e.label}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Evidence complete</span>
                      {evidenceComplete
                        ? <Badge variant="success">Yes</Badge>
                        : <Badge variant="warning">Incomplete</Badge>}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="w-3.5 h-3.5" />Assigned agent</span>
                      <span className="font-semibold">{activeChunk.phases[activeChunk.currentPhase < 10 ? activeChunk.currentPhase : 9]?.agent}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Drift Tracker */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Anti-Drift Tracker
                    </CardTitle>
                    <CardDescription className="text-xs">Unresolved critical drift = FAI</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {activeChunk.drift.length === 0 ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>No drift flags — chunk is consistent</span>
                      </div>
                    ) : (
                      activeChunk.drift.map((d, i) => (
                        <div key={i} className={cn(
                          "rounded-lg p-2.5 text-xs border",
                          d.critical && !d.resolved ? "bg-red-50 border-red-200" :
                          d.resolved ? "bg-muted/30 border-border opacity-60" :
                          "bg-amber-50 border-amber-200"
                        )}>
                          <div className="flex items-center justify-between mb-1">
                            <DriftBadge type={d.type} />
                            {d.resolved
                              ? <Badge variant="success" className="text-xs py-0">Resolved</Badge>
                              : d.critical
                              ? <Badge variant="danger" className="text-xs py-0 animate-pulse">Critical</Badge>
                              : <Badge variant="warning" className="text-xs py-0">Open</Badge>}
                          </div>
                          <p className="text-xs leading-snug">{d.message}</p>
                        </div>
                      ))
                    )}
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">FAI risk</span>
                      {unresolvedCriticalDrift.length > 0
                        ? <Badge variant="danger">{unresolvedCriticalDrift.length} blocking</Badge>
                        : <Badge variant="success">None</Badge>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gate Checklist */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Chunk Gate Checklist</CardTitle>
                  <CardDescription className="text-xs">All must pass before this chunk is approved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "All 10 phases complete", pass: activeChunk.currentPhase >= 10 },
                      { label: "All phase evidence present", pass: activeChunk.phases.every(p => p.evidence.every(e => e.done)) },
                      { label: "No unresolved critical drift", pass: unresolvedCriticalDrift.length === 0 },
                      { label: "Structural checks passed", pass: activeChunk.phases.filter(p => p.status === "complete").every(p => p.structural === "pass") },
                      { label: "Integrity checks passed", pass: activeChunk.phases.filter(p => p.status === "complete").every(p => p.integrity === "pass") },
                      { label: "Multi-agent review complete", pass: activeChunk.currentPhase >= 8 },
                      { label: "Documentation updated", pass: activeChunk.currentPhase >= 9 },
                      { label: "Gate approved", pass: activeChunk.gatePass },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {item.pass
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          : <XCircle className="w-4 h-4 text-muted-foreground/50 shrink-0" />}
                        <span className={item.pass ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  {unresolvedCriticalDrift.length > 0 && (
                    <Alert variant="destructive" className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        <strong>FAI — Fatal Action Identified.</strong> {unresolvedCriticalDrift.length} critical drift flag{unresolvedCriticalDrift.length > 1 ? "s are" : " is"} unresolved. Chunk cannot proceed to Final or be approved until all critical drift is resolved.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        JIVA Clinical Execution Framework · Waves → Chunks → Phases → Agents → Evidence → Gates
      </p>
    </div>
  );
}
