/**
 * Activity Metric Schema
 * Defines the conditional logic for distance-based vs strain-based sports.
 * Mirrors the WHOOP approach: non-linear / stationary sports prioritise
 * cardiovascular strain rather than distance / pace.
 */

// ─── Sport Classification ────────────────────────────────────────────────────

/** Sports where distance + pace are the primary performance indicators */
export const DISTANCE_SPORT_IDS = new Set([
  "running",
  "walking",
  "cycling",
  "hiking",
  "skiing",
  "soccer",
]);

/** Sports where cardiovascular strain is the primary indicator */
export const STRAIN_SPORT_IDS = new Set([
  "surfing",
  "hiit",
  "yoga",
  "strength",
  "boxing",
  "swimming",
  "pilates",
  "rowing",
  "basketball",
  "tennis",
  "dance",
  "crossfit",
  "martial_arts",
  "gym",
]);

export type ActivityClass = "distance" | "strain";

export function getActivityClass(sportId: string): ActivityClass {
  if (DISTANCE_SPORT_IDS.has(sportId)) return "distance";
  return "strain"; // default to strain for unknown sports
}

// ─── HR Zone Definitions ─────────────────────────────────────────────────────

export interface HRZone {
  zoneId: 1 | 2 | 3 | 4 | 5;
  name: string;
  label: string; // short label for charts
  color: string;
  minPct: number; // % of max HR
  maxPct: number;
  secondsInZone: number;
}

export const HR_ZONE_DEFINITIONS: Omit<HRZone, "secondsInZone">[] = [
  { zoneId: 1, name: "Recovery",   label: "Z1", color: "#6b7280", minPct: 50, maxPct: 60 },
  { zoneId: 2, name: "Fat Burn",   label: "Z2", color: "#3b82f6", minPct: 60, maxPct: 70 },
  { zoneId: 3, name: "Aerobic",    label: "Z3", color: "#22c55e", minPct: 70, maxPct: 80 },
  { zoneId: 4, name: "Anaerobic",  label: "Z4", color: "#f59e0b", minPct: 80, maxPct: 90 },
  { zoneId: 5, name: "Max Effort", label: "Z5", color: "#f43f5e", minPct: 90, maxPct: 100 },
];

/** Generate a default zero-filled HR zones array */
export function defaultHRZones(): HRZone[] {
  return HR_ZONE_DEFINITIONS.map(def => ({ ...def, secondsInZone: 0 }));
}

/** Generate realistic mock HR zone data for a given strain score (0–21) */
export function generateMockHRZones(strainScore: number): HRZone[] {
  const intensity = strainScore / 21; // 0–1
  const totalSecs = 2400 + Math.round(intensity * 1800); // 40–70 min
  // Weight distribution shifts toward higher zones as strain increases
  const weights = [
    Math.max(0.05, 0.20 - intensity * 0.15),  // Z1 shrinks
    Math.max(0.10, 0.30 - intensity * 0.10),  // Z2 shrinks
    0.30,                                       // Z3 stable core
    Math.min(0.35, 0.15 + intensity * 0.25),  // Z4 grows
    Math.min(0.20, 0.05 + intensity * 0.20),  // Z5 grows
  ];
  const total = weights.reduce((a, b) => a + b, 0);
  return HR_ZONE_DEFINITIONS.map((def, i) => ({
    ...def,
    secondsInZone: Math.round((weights[i] / total) * totalSecs),
  }));
}

// ─── Metric Interfaces ───────────────────────────────────────────────────────

export interface StrainMetrics {
  strainScore: number;         // 0–21 WHOOP scale
  maxHrBpm: number;
  avgHrBpm: number;
  hrZones: HRZone[];
  recoveryImpact: number;      // 0–100: how much readiness this burns
}

export interface DistanceMetrics {
  distanceKm: number;
  avgPaceSecPerKm: number;     // stored as seconds, formatted as mm:ss
  elevationGainM: number;
  avgCadenceRpm: number;
}

export interface SessionTime {
  activeSeconds: number;
  elapsedSeconds: number;
}

export interface CommonMetrics {
  caloriesBurned: number;
  avgRpe: number;              // Rate of Perceived Exertion 1–10
  notes: string;
}

export interface ActivitySession {
  id: string;
  sportId: string;
  sportLabel: string;
  sportEmoji: string;
  activityClass: ActivityClass;
  startedAt: string;           // ISO-8601
  session: SessionTime;
  strain: StrainMetrics;
  distance: DistanceMetrics;
  common: CommonMetrics;
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createActivitySession(
  sportId: string,
  sportLabel: string,
  sportEmoji: string,
  overrides: Partial<ActivitySession> = {}
): ActivitySession {
  const activityClass = getActivityClass(sportId);
  const strain = 8 + Math.random() * 10;
  return {
    id: `act_${Date.now()}`,
    sportId,
    sportLabel,
    sportEmoji,
    activityClass,
    startedAt: new Date().toISOString(),
    session: {
      activeSeconds: 2520,
      elapsedSeconds: 2700,
    },
    strain: {
      strainScore: parseFloat(strain.toFixed(1)),
      maxHrBpm: 172 + Math.round(Math.random() * 18),
      avgHrBpm: 148 + Math.round(Math.random() * 14),
      hrZones: generateMockHRZones(strain),
      recoveryImpact: Math.round(40 + strain * 3),
    },
    distance: {
      distanceKm: 6.4,
      avgPaceSecPerKm: 302,
      elevationGainM: 84,
      avgCadenceRpm: 176,
    },
    common: {
      caloriesBurned: Math.round(280 + strain * 15),
      avgRpe: Math.round(4 + strain / 3),
      notes: "",
    },
    ...overrides,
  };
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

export function formatPace(secondsPerKm: number): string {
  const m = Math.floor(secondsPerKm / 60);
  const s = secondsPerKm % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function hrZoneTotalSeconds(zones: HRZone[]): number {
  return zones.reduce((sum, z) => sum + z.secondsInZone, 0);
}

export function hrZonePct(zone: HRZone, zones: HRZone[]): number {
  const total = hrZoneTotalSeconds(zones);
  return total === 0 ? 0 : Math.round((zone.secondsInZone / total) * 100);
}
