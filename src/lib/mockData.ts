// ─── JIVA Mock Data Library ───────────────────────────────────────────────────
// Simulates data that would be streamed from the JIVA Smart Health Ring

export type RiskLevel = "high" | "moderate" | "low";
export type Tier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

export interface VitalReading {
  timestamp: string;
  value: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string[];
  healthScore: number;
  riskLevel: RiskLevel;
  tier: Tier;
  statusPoints: number;
  heartRate: number;
  spo2: number;
  hrv: number;
  temperature: number;
  steps: number;
  sleepScore: number;
  lastSync: string;
  ringBattery: number;
  activityCompliance: number;
  incentiveMultiplier: number;
  inactivityPenalty: number;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  vitals?: string;
  resolved: boolean;
}

// ─── ECG Waveform (PQRST pattern) ─────────────────────────────────────────────
export function generateECGData(points = 200): { x: number; y: number }[] {
  const data: { x: number; y: number }[] = [];
  const cycleLength = 40;
  for (let i = 0; i < points; i++) {
    const pos = i % cycleLength;
    let y = 0;
    // P wave
    if (pos >= 2 && pos <= 6) y = 15 * Math.sin(((pos - 2) / 4) * Math.PI);
    // Q dip
    else if (pos >= 8 && pos <= 10) y = -8;
    // R spike
    else if (pos === 11) y = 90;
    else if (pos === 12) y = 85;
    // S dip
    else if (pos >= 13 && pos <= 14) y = -15;
    // T wave
    else if (pos >= 16 && pos <= 22) y = 25 * Math.sin(((pos - 16) / 6) * Math.PI);
    // Baseline noise
    y += (Math.random() - 0.5) * 2;
    data.push({ x: i, y: Math.round(y) });
  }
  return data;
}

// ─── Heart Rate Trend (7 days) ─────────────────────────────────────────────────
export const heartRateTrend: VitalReading[] = [
  { timestamp: "Mon", value: 72 },
  { timestamp: "Tue", value: 68 },
  { timestamp: "Wed", value: 74 },
  { timestamp: "Thu", value: 71 },
  { timestamp: "Fri", value: 76 },
  { timestamp: "Sat", value: 69 },
  { timestamp: "Sun", value: 73 },
];

// ─── SpO2 Trend ────────────────────────────────────────────────────────────────
export const spo2Trend: VitalReading[] = [
  { timestamp: "Mon", value: 98 },
  { timestamp: "Tue", value: 97 },
  { timestamp: "Wed", value: 99 },
  { timestamp: "Thu", value: 98 },
  { timestamp: "Fri", value: 97 },
  { timestamp: "Sat", value: 98 },
  { timestamp: "Sun", value: 99 },
];

// ─── Activity / Steps (7 days) ─────────────────────────────────────────────────
export const activityTrend = [
  { day: "Mon", steps: 8420, target: 10000, activeMin: 42 },
  { day: "Tue", steps: 11230, target: 10000, activeMin: 67 },
  { day: "Wed", steps: 6890, target: 10000, activeMin: 31 },
  { day: "Thu", steps: 9560, target: 10000, activeMin: 55 },
  { day: "Fri", steps: 12100, target: 10000, activeMin: 74 },
  { day: "Sat", steps: 15340, target: 10000, activeMin: 95 },
  { day: "Sun", steps: 7230, target: 10000, activeMin: 38 },
];

// ─── Sleep Stages ──────────────────────────────────────────────────────────────
export const sleepData = [
  { stage: "Awake", hours: 0.5, color: "#f87171" },
  { stage: "Light", hours: 2.8, color: "#60a5fa" },
  { stage: "Deep", hours: 1.9, color: "#3b82f6" },
  { stage: "REM", hours: 1.8, color: "#8b5cf6" },
];

// ─── HRV Trend ─────────────────────────────────────────────────────────────────
export const hrvTrend: VitalReading[] = [
  { timestamp: "Mon", value: 42 },
  { timestamp: "Tue", value: 48 },
  { timestamp: "Wed", value: 38 },
  { timestamp: "Thu", value: 51 },
  { timestamp: "Fri", value: 46 },
  { timestamp: "Sat", value: 55 },
  { timestamp: "Sun", value: 49 },
];

// ─── Current Patient (logged-in patient view) ──────────────────────────────────
export const currentPatient: Patient = {
  id: "P-001",
  name: "Arjun Prakash",
  age: 32,
  gender: "Male",
  condition: ["Healthy"],
  healthScore: 78,
  riskLevel: "low",
  tier: "Gold",
  statusPoints: 3840,
  heartRate: 73,
  spo2: 98,
  hrv: 49,
  temperature: 36.6,
  steps: 9240,
  sleepScore: 82,
  lastSync: "2 min ago",
  ringBattery: 68,
  activityCompliance: 85,
  incentiveMultiplier: 1.15,
  inactivityPenalty: 0,
  alerts: [
    {
      id: "a1",
      type: "info",
      message: "Weekly activity goal 85% complete — keep it up!",
      timestamp: "Today, 09:14",
      resolved: false,
    },
    {
      id: "a2",
      type: "info",
      message: "Sleep quality improved by 12% this week",
      timestamp: "Today, 07:00",
      resolved: false,
    },
  ],
};

// ─── Health Score History (30 days) ───────────────────────────────────────────
export const healthScoreHistory = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  score: Math.round(70 + Math.sin(i / 3) * 8 + Math.random() * 5),
}));

// ─── Provider: Patient Roster ──────────────────────────────────────────────────
export const patientRoster: Patient[] = [
  {
    id: "P-001",
    name: "Amara Osei",
    age: 58,
    gender: "Female",
    condition: ["Hypertension", "Type 2 Diabetes"],
    healthScore: 34,
    riskLevel: "high",
    tier: "Bronze",
    statusPoints: 520,
    heartRate: 92,
    spo2: 94,
    hrv: 22,
    temperature: 37.4,
    steps: 2340,
    sleepScore: 51,
    lastSync: "5 min ago",
    ringBattery: 45,
    activityCompliance: 28,
    incentiveMultiplier: 1.0,
    inactivityPenalty: 120,
    alerts: [
      {
        id: "a1",
        type: "critical",
        message: "SpO₂ dropped to 94% — possible hypoxia event",
        timestamp: "Today, 08:23",
        vitals: "SpO₂: 94%, HR: 92 bpm",
        resolved: false,
      },
      {
        id: "a2",
        type: "critical",
        message: "Irregular ECG pattern detected — possible AFib",
        timestamp: "Today, 06:41",
        vitals: "HRV: 22ms, ECG anomaly",
        resolved: false,
      },
    ],
  },
  {
    id: "P-002",
    name: "Kwame Mensah",
    age: 45,
    gender: "Male",
    condition: ["Hypertension"],
    healthScore: 52,
    riskLevel: "moderate",
    tier: "Silver",
    statusPoints: 1890,
    heartRate: 81,
    spo2: 96,
    hrv: 35,
    temperature: 36.9,
    steps: 5670,
    sleepScore: 64,
    lastSync: "12 min ago",
    ringBattery: 72,
    activityCompliance: 55,
    incentiveMultiplier: 1.1,
    inactivityPenalty: 40,
    alerts: [
      {
        id: "a3",
        type: "warning",
        message: "Resting heart rate elevated above 80 bpm for 3 consecutive days",
        timestamp: "Yesterday, 23:00",
        vitals: "HR: 81–88 bpm",
        resolved: false,
      },
    ],
  },
  {
    id: "P-003",
    name: "Fatima Al-Rashid",
    age: 62,
    gender: "Female",
    condition: ["Type 2 Diabetes", "Obesity"],
    healthScore: 29,
    riskLevel: "high",
    tier: "Bronze",
    statusPoints: 310,
    heartRate: 96,
    spo2: 95,
    hrv: 18,
    temperature: 37.6,
    steps: 1890,
    sleepScore: 44,
    lastSync: "3 min ago",
    ringBattery: 31,
    activityCompliance: 18,
    incentiveMultiplier: 1.0,
    inactivityPenalty: 200,
    alerts: [
      {
        id: "a4",
        type: "critical",
        message: "Bio-impedance anomaly — possible fluid retention",
        timestamp: "Today, 10:05",
        vitals: "BIA: elevated, Temp: 37.6°C",
        resolved: false,
      },
      {
        id: "a5",
        type: "warning",
        message: "Activity compliance critically low (18%) — intervention recommended",
        timestamp: "Today, 08:00",
        resolved: false,
      },
    ],
  },
  {
    id: "P-004",
    name: "David Nkrumah",
    age: 38,
    gender: "Male",
    condition: ["Healthy"],
    healthScore: 85,
    riskLevel: "low",
    tier: "Platinum",
    statusPoints: 6720,
    heartRate: 64,
    spo2: 99,
    hrv: 62,
    temperature: 36.5,
    steps: 13450,
    sleepScore: 91,
    lastSync: "8 min ago",
    ringBattery: 88,
    activityCompliance: 94,
    incentiveMultiplier: 1.2,
    inactivityPenalty: 0,
    alerts: [],
  },
  {
    id: "P-005",
    name: "Aisha Kamara",
    age: 51,
    gender: "Female",
    condition: ["Hypertension"],
    healthScore: 61,
    riskLevel: "moderate",
    tier: "Silver",
    statusPoints: 2140,
    heartRate: 78,
    spo2: 97,
    hrv: 38,
    temperature: 36.8,
    steps: 6890,
    sleepScore: 72,
    lastSync: "21 min ago",
    ringBattery: 54,
    activityCompliance: 62,
    incentiveMultiplier: 1.1,
    inactivityPenalty: 20,
    alerts: [
      {
        id: "a6",
        type: "warning",
        message: "Blood pressure trend rising — review medication adherence",
        timestamp: "Today, 11:30",
        resolved: false,
      },
    ],
  },
  {
    id: "P-006",
    name: "Emmanuel Boateng",
    age: 29,
    gender: "Male",
    condition: ["Healthy"],
    healthScore: 91,
    riskLevel: "low",
    tier: "Diamond",
    statusPoints: 9450,
    heartRate: 58,
    spo2: 99,
    hrv: 74,
    temperature: 36.4,
    steps: 18200,
    sleepScore: 94,
    lastSync: "1 min ago",
    ringBattery: 92,
    activityCompliance: 98,
    incentiveMultiplier: 1.25,
    inactivityPenalty: 0,
    alerts: [],
  },
  {
    id: "P-007",
    name: "Grace Acheampong",
    age: 66,
    gender: "Female",
    condition: ["Type 2 Diabetes", "Hypertension"],
    healthScore: 38,
    riskLevel: "high",
    tier: "Bronze",
    statusPoints: 640,
    heartRate: 88,
    spo2: 95,
    hrv: 24,
    temperature: 37.3,
    steps: 3120,
    sleepScore: 55,
    lastSync: "7 min ago",
    ringBattery: 41,
    activityCompliance: 35,
    incentiveMultiplier: 1.0,
    inactivityPenalty: 150,
    alerts: [
      {
        id: "a7",
        type: "critical",
        message: "Nocturnal SpO₂ dip detected — possible sleep apnea",
        timestamp: "Today, 03:17",
        vitals: "SpO₂: 91% at 03:17",
        resolved: false,
      },
    ],
  },
  {
    id: "P-008",
    name: "Ibrahim Diallo",
    age: 44,
    gender: "Male",
    condition: ["Healthy"],
    healthScore: 74,
    riskLevel: "low",
    tier: "Gold",
    statusPoints: 4120,
    heartRate: 70,
    spo2: 98,
    hrv: 51,
    temperature: 36.7,
    steps: 9870,
    sleepScore: 78,
    lastSync: "15 min ago",
    ringBattery: 67,
    activityCompliance: 79,
    incentiveMultiplier: 1.15,
    inactivityPenalty: 0,
    alerts: [],
  },
];

// ─── Insurer: Population Analytics ────────────────────────────────────────────
export const populationRiskDistribution = [
  { name: "Low Risk (71–100)", value: 228, percentage: 45.6, color: "#10b981" },
  { name: "Moderate Risk (41–70)", value: 187, percentage: 37.4, color: "#f59e0b" },
  { name: "High Risk (0–40)", value: 85, percentage: 17.0, color: "#ef4444" },
];

export const complianceTrend = [
  { week: "Wk 1", compliance: 64, target: 80 },
  { week: "Wk 2", compliance: 69, target: 80 },
  { week: "Wk 3", compliance: 71, target: 80 },
  { week: "Wk 4", compliance: 74, target: 80 },
  { week: "Wk 5", compliance: 76, target: 80 },
  { week: "Wk 6", compliance: 78, target: 80 },
  { week: "Wk 7", compliance: 81, target: 80 },
  { week: "Wk 8", compliance: 83, target: 80 },
  { week: "Wk 9", compliance: 82, target: 80 },
  { week: "Wk 10", compliance: 85, target: 80 },
  { week: "Wk 11", compliance: 87, target: 80 },
  { week: "Wk 12", compliance: 88, target: 80 },
];

export const claimsProjection = [
  { month: "Jan", actual: 100, projected: 100 },
  { month: "Feb", actual: 97, projected: 96 },
  { month: "Mar", actual: 94, projected: 91 },
  { month: "Apr", actual: 90, projected: 85 },
  { month: "May", actual: 87, projected: 79 },
  { month: "Jun", actual: 83, projected: 73 },
  { month: "Jul", actual: null, projected: 68 },
  { month: "Aug", actual: null, projected: 64 },
  { month: "Sep", actual: null, projected: 61 },
  { month: "Oct", actual: null, projected: 58 },
  { month: "Nov", actual: null, projected: 56 },
  { month: "Dec", actual: null, projected: 54 },
];

export const tierDistribution = [
  { tier: "Diamond", count: 18, color: "#a78bfa" },
  { tier: "Platinum", count: 67, color: "#94a3b8" },
  { tier: "Gold", count: 142, color: "#f59e0b" },
  { tier: "Silver", count: 198, color: "#64748b" },
  { tier: "Bronze", count: 75, color: "#b45309" },
];

export const pilotKPIs = {
  totalUsers: 500,
  activeDevices: 496,
  deviceUptime: 99.2,
  syncSuccessRate: 99.6,
  failureRate: 0.4,
  avgHealthScore: 64.8,
  highRiskAlerts: 47,
  resolvedAlerts: 39,
  avgBattery: 71,
  avgCompliance: 78,
};

export const premiumAdjustments = [
  {
    cohort: "High Activity (85%+ compliance)",
    users: 142,
    adjustment: "-15%",
    cashback: "15%",
    savings: "$42,600",
  },
  {
    cohort: "Moderate Activity (55–84%)",
    users: 218,
    adjustment: "0%",
    cashback: "8%",
    savings: "$17,440",
  },
  {
    cohort: "Low Activity (< 55%)",
    users: 95,
    adjustment: "+10%",
    cashback: "0%",
    savings: "-$9,500",
  },
  {
    cohort: "High Risk — Chronic Conditions",
    users: 45,
    adjustment: "+8%",
    cashback: "5%",
    savings: "-$3,600",
  },
];

// ─── Status Tier Config ────────────────────────────────────────────────────────
export const tierConfig: Record<Tier, { min: number; max: number; color: string; emoji: string }> = {
  Bronze:   { min: 0,     max: 999,  color: "#b45309", emoji: "🥉" },
  Silver:   { min: 1000,  max: 2499, color: "#64748b", emoji: "🥈" },
  Gold:     { min: 2500,  max: 4999, color: "#f59e0b", emoji: "🥇" },
  Platinum: { min: 5000,  max: 7499, color: "#94a3b8", emoji: "💎" },
  Diamond:  { min: 7500,  max: Infinity, color: "#a78bfa", emoji: "✨" },
};

export function getRiskColor(risk: RiskLevel): string {
  return { high: "#ef4444", moderate: "#f59e0b", low: "#10b981" }[risk];
}

export function getScoreColor(score: number): string {
  if (score <= 40) return "#ef4444";
  if (score <= 70) return "#f59e0b";
  return "#10b981";
}

export function getScoreLabel(score: number): string {
  if (score <= 40) return "High Risk";
  if (score <= 70) return "Moderate";
  return "Low Risk";
}
