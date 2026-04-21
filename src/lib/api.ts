// ─── JIVA API Contract Layer ───────────────────────────────────────────────────
// React Query-style hooks returning mock data with proper types.
// Swap mock data for real fetch() calls when backend is available.

import type {
  UserProfile,
  VitalReading,
  ActivitySession,
  NutritionDay,
  SleepSession,
  RecoveryData,
  HydrationLog,
  MoodLog,
  Route,
  MedicalRecord,
  ClinicalEvent,
  Appointment,
  AIInsight,
  ChatChannel,
  ChatMessage,
  AdminUser,
  PlatformMetric,
} from "./types";

// ─── User Profile ──────────────────────────────────────────────────────────────
const mockUserProfile: UserProfile = {
  id: "P-001",
  name: "Kwame Mensah",
  age: 34,
  gender: "Male",
  height: 178,
  weight: 82,
  bmi: 25.9,
  bodyFatPct: 18.4,
  muscleMass: 66.8,
  restingHR: 62,
  vo2Max: 46.2,
  tier: "Gold",
  statusPoints: 3840,
  healthScore: 74,
  goals: [
    {
      id: "g1",
      type: "weight_loss",
      target: 78,
      current: 82,
      unit: "kg",
      deadline: "2025-06-30",
      createdAt: "2025-01-01",
      history: [
        { date: "Jan", value: 86 }, { date: "Feb", value: 85 }, { date: "Mar", value: 84 },
        { date: "Apr", value: 83 }, { date: "May", value: 82 },
      ],
    },
    {
      id: "g2",
      type: "endurance",
      target: 50,
      current: 46.2,
      unit: "ml/kg/min",
      deadline: "2025-09-30",
      createdAt: "2025-01-01",
      history: [
        { date: "Jan", value: 42 }, { date: "Feb", value: 43 }, { date: "Mar", value: 44.5 },
        { date: "Apr", value: 45.8 }, { date: "May", value: 46.2 },
      ],
    },
    {
      id: "g3",
      type: "activity_frequency",
      target: 5,
      current: 4,
      unit: "days/week",
      deadline: "2025-12-31",
      createdAt: "2025-01-01",
      history: [
        { date: "Jan", value: 2 }, { date: "Feb", value: 3 }, { date: "Mar", value: 3 },
        { date: "Apr", value: 4 }, { date: "May", value: 4 },
      ],
    },
    {
      id: "g4",
      type: "sleep",
      target: 8,
      current: 7.2,
      unit: "hours",
      deadline: "2025-12-31",
      createdAt: "2025-01-01",
      history: [
        { date: "Jan", value: 6.5 }, { date: "Feb", value: 6.8 }, { date: "Mar", value: 7.0 },
        { date: "Apr", value: 7.1 }, { date: "May", value: 7.2 },
      ],
    },
  ],
};

export function useUserProfile(): { data: UserProfile; isLoading: boolean } {
  return { data: mockUserProfile, isLoading: false };
}

// ─── Vitals History ────────────────────────────────────────────────────────────
const generateVitalHistory = (base: number, variance: number, days: number, unit: string): VitalReading[] =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - i));
    const value = base + (Math.random() - 0.5) * variance * 2;
    return {
      timestamp: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(value * 10) / 10,
      unit,
      status: "normal" as const,
    };
  });

export function useVitalsHistory(days: number): { data: VitalReading[][]; isLoading: boolean } {
  return {
    data: [
      generateVitalHistory(72, 8, days, "bpm"),
      generateVitalHistory(98, 1.5, days, "%"),
      generateVitalHistory(52, 12, days, "ms"),
      generateVitalHistory(36.6, 0.3, days, "°C"),
    ],
    isLoading: false,
  };
}

// ─── Activity Sessions ─────────────────────────────────────────────────────────
const mockActivitySessions: ActivitySession[] = [
  {
    id: "a1",
    type: "run",
    startTime: "2025-05-15T06:30:00",
    endTime: "2025-05-15T07:15:00",
    duration: 45,
    distance: 7.2,
    calories: 520,
    avgHR: 158,
    maxHR: 178,
    steps: 9200,
    elevationGain: 84,
    avgPace: 6.25,
    intensityZones: [
      { zone: 1, name: "Recovery", minutes: 3, color: "#94a3b8" },
      { zone: 2, name: "Aerobic", minutes: 12, color: "#22c55e" },
      { zone: 3, name: "Tempo", minutes: 18, color: "#f59e0b" },
      { zone: 4, name: "Threshold", minutes: 10, color: "#f97316" },
      { zone: 5, name: "Max", minutes: 2, color: "#ef4444" },
    ],
  },
  {
    id: "a2",
    type: "cycle",
    startTime: "2025-05-14T17:00:00",
    endTime: "2025-05-14T18:10:00",
    duration: 70,
    distance: 28.4,
    calories: 680,
    avgHR: 148,
    maxHR: 172,
    elevationGain: 210,
    intensityZones: [
      { zone: 1, name: "Recovery", minutes: 5, color: "#94a3b8" },
      { zone: 2, name: "Aerobic", minutes: 20, color: "#22c55e" },
      { zone: 3, name: "Tempo", minutes: 30, color: "#f59e0b" },
      { zone: 4, name: "Threshold", minutes: 12, color: "#f97316" },
      { zone: 5, name: "Max", minutes: 3, color: "#ef4444" },
    ],
  },
  {
    id: "a3",
    type: "gym",
    startTime: "2025-05-13T08:00:00",
    endTime: "2025-05-13T09:00:00",
    duration: 60,
    calories: 410,
    avgHR: 132,
    maxHR: 162,
    intensityZones: [
      { zone: 1, name: "Recovery", minutes: 8, color: "#94a3b8" },
      { zone: 2, name: "Aerobic", minutes: 22, color: "#22c55e" },
      { zone: 3, name: "Tempo", minutes: 20, color: "#f59e0b" },
      { zone: 4, name: "Threshold", minutes: 8, color: "#f97316" },
      { zone: 5, name: "Max", minutes: 2, color: "#ef4444" },
    ],
  },
  {
    id: "a4",
    type: "yoga",
    startTime: "2025-05-12T07:00:00",
    endTime: "2025-05-12T08:00:00",
    duration: 60,
    calories: 180,
    avgHR: 98,
    maxHR: 118,
    intensityZones: [
      { zone: 1, name: "Recovery", minutes: 40, color: "#94a3b8" },
      { zone: 2, name: "Aerobic", minutes: 18, color: "#22c55e" },
      { zone: 3, name: "Tempo", minutes: 2, color: "#f59e0b" },
      { zone: 4, name: "Threshold", minutes: 0, color: "#f97316" },
      { zone: 5, name: "Max", minutes: 0, color: "#ef4444" },
    ],
  },
  {
    id: "a5",
    type: "hiit",
    startTime: "2025-05-11T06:00:00",
    endTime: "2025-05-11T06:30:00",
    duration: 30,
    calories: 380,
    avgHR: 168,
    maxHR: 188,
    intensityZones: [
      { zone: 1, name: "Recovery", minutes: 2, color: "#94a3b8" },
      { zone: 2, name: "Aerobic", minutes: 4, color: "#22c55e" },
      { zone: 3, name: "Tempo", minutes: 8, color: "#f59e0b" },
      { zone: 4, name: "Threshold", minutes: 10, color: "#f97316" },
      { zone: 5, name: "Max", minutes: 6, color: "#ef4444" },
    ],
  },
];

export function useActivitySessions(limit: number): { data: ActivitySession[]; isLoading: boolean } {
  return { data: mockActivitySessions.slice(0, limit), isLoading: false };
}

// ─── Nutrition ─────────────────────────────────────────────────────────────────
const mockNutritionDay: NutritionDay = {
  date: "2025-05-15",
  meals: [
    {
      id: "m1",
      name: "Breakfast",
      time: "07:30",
      calories: 480,
      protein: 28,
      carbs: 52,
      fat: 18,
      fiber: 6,
      items: [
        { name: "Oatmeal with berries", calories: 280, protein: 10, carbs: 48, fat: 5, serving: 1, servingUnit: "bowl" },
        { name: "Greek yogurt", calories: 120, protein: 14, carbs: 8, fat: 3, serving: 150, servingUnit: "g" },
        { name: "Almonds", calories: 80, protein: 4, carbs: 3, fat: 7, serving: 20, servingUnit: "g" },
      ],
    },
    {
      id: "m2",
      name: "Lunch",
      time: "12:30",
      calories: 620,
      protein: 42,
      carbs: 58,
      fat: 22,
      fiber: 9,
      items: [
        { name: "Grilled chicken breast", calories: 250, protein: 32, carbs: 0, fat: 8, serving: 150, servingUnit: "g" },
        { name: "Brown rice", calories: 210, protein: 5, carbs: 44, fat: 1, serving: 1, servingUnit: "cup" },
        { name: "Steamed broccoli", calories: 80, protein: 4, carbs: 10, fat: 0, serving: 200, servingUnit: "g" },
        { name: "Olive oil dressing", calories: 80, protein: 0, carbs: 0, fat: 9, serving: 1, servingUnit: "tbsp" },
      ],
    },
    {
      id: "m3",
      name: "Snack",
      time: "16:00",
      calories: 210,
      protein: 12,
      carbs: 24,
      fat: 8,
      fiber: 3,
      items: [
        { name: "Protein bar", calories: 210, protein: 12, carbs: 24, fat: 8, serving: 1, servingUnit: "bar" },
      ],
    },
    {
      id: "m4",
      name: "Dinner",
      time: "19:30",
      calories: 540,
      protein: 38,
      carbs: 44,
      fat: 16,
      fiber: 8,
      items: [
        { name: "Salmon fillet", calories: 280, protein: 30, carbs: 0, fat: 14, serving: 150, servingUnit: "g" },
        { name: "Quinoa", calories: 180, protein: 6, carbs: 32, fat: 2, serving: 1, servingUnit: "cup" },
        { name: "Mixed salad", calories: 80, protein: 2, carbs: 12, fat: 3, serving: 1, servingUnit: "bowl" },
      ],
    },
  ],
  totals: { calories: 1850, protein: 120, carbs: 178, fat: 64, fiber: 26, water: 2200 },
  targets: { calories: 2200, protein: 140, carbs: 220, fat: 70, water: 3000 },
  fastingWindow: { start: "19:00", end: "11:00", duration: 16 },
};

export function useNutritionLog(_date: string): { data: NutritionDay; isLoading: boolean } {
  return { data: mockNutritionDay, isLoading: false };
}

// ─── Sleep History ─────────────────────────────────────────────────────────────
const mockSleepHistory: SleepSession[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  const score = 60 + Math.floor(Math.random() * 35);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    bedtime: "22:30",
    wakeTime: "06:30",
    duration: 6.5 + Math.random() * 2,
    stages: { light: 2.1, deep: 1.4, rem: 1.8, awake: 0.7 },
    score,
    hrAvg: 54 + Math.floor(Math.random() * 8),
    hrMin: 48 + Math.floor(Math.random() * 6),
    hrMax: 72 + Math.floor(Math.random() * 10),
    recoveryScore: score - 5 + Math.floor(Math.random() * 10),
    strainscore: 8 + Math.random() * 12,
  };
});

export function useSleepHistory(days: number): { data: SleepSession[]; isLoading: boolean } {
  return { data: mockSleepHistory.slice(0, days), isLoading: false };
}

// ─── Recovery History ──────────────────────────────────────────────────────────
const mockRecoveryHistory: RecoveryData[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  const score = 55 + Math.floor(Math.random() * 40);
  const readiness: RecoveryData["readiness"] = score > 80 ? "peak" : score > 65 ? "high" : score > 45 ? "moderate" : "low";
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score,
    hrv: 42 + Math.floor(Math.random() * 30),
    restingHR: 58 + Math.floor(Math.random() * 10),
    sleepScore: 60 + Math.floor(Math.random() * 35),
    readiness,
  };
});

export function useRecoveryHistory(days: number): { data: RecoveryData[]; isLoading: boolean } {
  return { data: mockRecoveryHistory.slice(0, days), isLoading: false };
}

// ─── Hydration ─────────────────────────────────────────────────────────────────
const mockHydrationLog: HydrationLog = {
  date: "2025-05-15",
  entries: [
    { time: "07:00", amount: 250, unit: "ml" },
    { time: "09:30", amount: 500, unit: "ml" },
    { time: "11:00", amount: 250, unit: "ml" },
    { time: "13:00", amount: 500, unit: "ml" },
    { time: "15:00", amount: 250, unit: "ml" },
    { time: "17:30", amount: 500, unit: "ml" },
  ],
  total: 2250,
  target: 3000,
};

export function useHydrationLog(_date: string): { data: HydrationLog; isLoading: boolean } {
  return { data: mockHydrationLog, isLoading: false };
}

// ─── Mood History ──────────────────────────────────────────────────────────────
const mockMoodHistory: MoodLog[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return {
    timestamp: d.toISOString(),
    mood: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
    stressLevel: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
    tags: ["work", "exercise"].slice(0, Math.floor(Math.random() * 2) + 1),
  };
});

export function useMoodHistory(days: number): { data: MoodLog[]; isLoading: boolean } {
  return { data: mockMoodHistory.slice(0, days), isLoading: false };
}

// ─── GPS Routes ────────────────────────────────────────────────────────────────
const mockRoutes: Route[] = [
  {
    id: "r1",
    name: "Morning Loop",
    distance: 7.2,
    elevationGain: 84,
    points: Array.from({ length: 50 }, (_, i) => ({
      lat: 5.6037 + Math.sin(i * 0.15) * 0.01,
      lng: -0.187 + Math.cos(i * 0.15) * 0.01,
      elevation: 20 + Math.sin(i * 0.3) * 15,
      timestamp: new Date(Date.now() - (50 - i) * 60000).toISOString(),
      speed: 2.8 + Math.random() * 0.8,
    })),
    createdAt: "2025-05-15T07:15:00",
  },
  {
    id: "r2",
    name: "Evening 5K",
    distance: 5.0,
    elevationGain: 42,
    points: Array.from({ length: 35 }, (_, i) => ({
      lat: 5.612 + Math.cos(i * 0.18) * 0.008,
      lng: -0.19 + Math.sin(i * 0.18) * 0.008,
      elevation: 15 + Math.cos(i * 0.25) * 10,
      timestamp: new Date(Date.now() - (35 - i) * 60000).toISOString(),
      speed: 2.5 + Math.random() * 0.6,
    })),
    createdAt: "2025-05-14T18:10:00",
  },
];

export function useGPSRoutes(): { data: Route[]; isLoading: boolean } {
  return { data: mockRoutes, isLoading: false };
}

// ─── Medical Records ───────────────────────────────────────────────────────────
const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "mr1",
    type: "lab",
    date: "2025-04-10",
    title: "Comprehensive Metabolic Panel",
    provider: "Korle Bu Teaching Hospital",
    summary: "All values within normal range. HbA1c slightly elevated at 5.8%.",
    values: [
      { name: "Glucose (Fasting)", value: 94, unit: "mg/dL", referenceRange: { min: 70, max: 100 }, status: "normal" },
      { name: "HbA1c", value: 5.8, unit: "%", referenceRange: { min: 4.0, max: 5.6 }, status: "borderline" },
      { name: "Total Cholesterol", value: 188, unit: "mg/dL", referenceRange: { min: 0, max: 200 }, status: "normal" },
      { name: "LDL", value: 112, unit: "mg/dL", referenceRange: { min: 0, max: 130 }, status: "normal" },
      { name: "HDL", value: 58, unit: "mg/dL", referenceRange: { min: 40, max: 100 }, status: "normal" },
      { name: "Triglycerides", value: 142, unit: "mg/dL", referenceRange: { min: 0, max: 150 }, status: "normal" },
    ],
  },
  {
    id: "mr2",
    type: "visit",
    date: "2025-03-22",
    title: "Annual Physical Examination",
    provider: "Dr. Ama Owusu",
    summary: "Overall health good. Recommended increased physical activity and dietary improvements.",
  },
  {
    id: "mr3",
    type: "prescription",
    date: "2025-03-22",
    title: "Vitamin D Supplementation",
    provider: "Dr. Ama Owusu",
    summary: "Vitamin D 2000 IU daily for 3 months. Re-evaluate in June.",
  },
  {
    id: "mr4",
    type: "imaging",
    date: "2025-02-14",
    title: "Chest X-Ray",
    provider: "Accra Imaging Center",
    summary: "Clear chest fields. No significant findings.",
  },
];

export function useMedicalRecords(): { data: MedicalRecord[]; isLoading: boolean } {
  return { data: mockMedicalRecords, isLoading: false };
}

// ─── Clinical Timeline ─────────────────────────────────────────────────────────
const mockClinicalEvents: ClinicalEvent[] = [
  { id: "ce1", date: "2025-05-15", type: "vital", title: "Elevated Resting HR", description: "Resting HR of 84 bpm detected — above baseline of 62 bpm.", source: "wearable", severity: "warning" },
  { id: "ce2", date: "2025-05-10", type: "lab", title: "Lab Results Received", description: "CMP results available. HbA1c borderline at 5.8%.", source: "provider", severity: "info" },
  { id: "ce3", date: "2025-05-08", type: "alert", title: "Low SpO2 Alert", description: "Nocturnal SpO2 dipped to 93% at 02:14 AM.", source: "wearable", severity: "critical" },
  { id: "ce4", date: "2025-04-28", type: "visit", title: "Telemedicine Consultation", description: "Follow-up with Dr. Owusu. Medication adherence reviewed.", source: "provider", severity: "info" },
  { id: "ce5", date: "2025-04-20", type: "medication", title: "Vitamin D Started", description: "Started Vitamin D 2000 IU daily supplementation.", source: "manual", severity: "info" },
  { id: "ce6", date: "2025-04-10", type: "lab", title: "Comprehensive Metabolic Panel", description: "All values normal. HbA1c 5.8% — borderline.", source: "provider", severity: "info" },
  { id: "ce7", date: "2025-03-22", type: "visit", title: "Annual Physical", description: "Annual physical with Dr. Ama Owusu. Recommended activity increase.", source: "provider", severity: "info" },
  { id: "ce8", date: "2025-03-10", type: "vital", title: "Irregular HR Pattern", description: "Brief irregular HR pattern detected during sleep — 42 seconds.", source: "wearable", severity: "warning" },
];

export function useClinicalTimeline(): { data: ClinicalEvent[]; isLoading: boolean } {
  return { data: mockClinicalEvents, isLoading: false };
}

// ─── Appointments ──────────────────────────────────────────────────────────────
const mockAppointments: Appointment[] = [
  { id: "ap1", date: "2025-05-22", time: "10:00 AM", provider: "Dr. Ama Owusu", specialty: "General Practice", type: "telemedicine", status: "confirmed" },
  { id: "ap2", date: "2025-06-05", time: "02:30 PM", provider: "Dr. Kofi Asante", specialty: "Cardiology", type: "in_person", status: "scheduled" },
  { id: "ap3", date: "2025-04-14", time: "09:00 AM", provider: "Dr. Ama Owusu", specialty: "General Practice", type: "telemedicine", status: "completed", notes: "Blood pressure discussed. Continue monitoring." },
  { id: "ap4", date: "2025-03-22", time: "11:00 AM", provider: "Dr. Ama Owusu", specialty: "General Practice", type: "in_person", status: "completed", notes: "Annual physical completed." },
];

export function useAppointments(): { data: Appointment[]; isLoading: boolean } {
  return { data: mockAppointments, isLoading: false };
}

// ─── AI Insights ───────────────────────────────────────────────────────────────
const mockAIInsights: AIInsight[] = [
  {
    id: "ai1",
    category: "sleep",
    title: "Sleep Efficiency Declining",
    summary: "Your deep sleep has decreased by 18% over the past 2 weeks. This correlates with increased late-evening screen time detected before bed.",
    details: "Deep sleep is critical for physical recovery and memory consolidation. Your data shows deep sleep averaging 68 minutes compared to your baseline of 82 minutes.",
    confidence: 87,
    generatedAt: "2025-05-15T08:00:00",
    recommendations: [
      "Reduce screen time 90 minutes before your target bedtime of 22:30",
      "Try the 10-minute guided wind-down meditation in JIVA Mindfulness",
      "Keep bedroom temperature between 18–20°C for optimal sleep",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice. Consult your doctor for persistent sleep issues.",
  },
  {
    id: "ai2",
    category: "activity",
    title: "Optimal Running Window Detected",
    summary: "Based on your HRV and recovery scores, your body performs best during morning sessions between 06:00–08:00. Your zone 3–4 output is 14% higher in this window.",
    details: "Analysis of 23 recent runs shows peak performance correlates with morning HRV > 48ms and resting HR < 65 bpm.",
    confidence: 82,
    generatedAt: "2025-05-15T08:00:00",
    recommendations: [
      "Schedule high-intensity workouts on days when morning HRV > 50ms",
      "Consider a 5-minute warm-up walk to maximize zone 3 time",
      "Your next optimal training window is tomorrow morning",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice.",
  },
  {
    id: "ai3",
    category: "nutrition",
    title: "Protein Intake Below Target",
    summary: "You've been averaging 108g of protein daily — 23% below your 140g target. This may be limiting muscle recovery after your strength sessions.",
    details: "Post-workout protein synthesis windows (30–60 min after exercise) are being missed on 3 out of 5 workout days based on meal log timing.",
    confidence: 91,
    generatedAt: "2025-05-15T08:00:00",
    recommendations: [
      "Add a 25–30g protein shake within 45 minutes of your gym sessions",
      "Greek yogurt or eggs at breakfast can add 14–18g protein easily",
      "Consider tracking meals on workout days to hit your target",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice. Consult a registered dietitian for personalized nutrition advice.",
  },
  {
    id: "ai4",
    category: "vitals",
    title: "HRV Trend Improving",
    summary: "Your 7-day HRV average has increased from 38ms to 52ms over the past month — a strong indicator of improving cardiovascular fitness and stress recovery.",
    details: "HRV improvement correlates with your increased aerobic training volume and improved sleep consistency. This is a positive health signal.",
    confidence: 94,
    generatedAt: "2025-05-15T08:00:00",
    recommendations: [
      "Maintain your current aerobic training volume of 3–4 sessions per week",
      "Continue the stress management practices that are working",
      "Your next milestone: sustain HRV > 55ms for 2 consecutive weeks",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice.",
  },
  {
    id: "ai5",
    category: "recovery",
    title: "Overreaching Risk — Rest Day Recommended",
    summary: "Your training load over the past 5 days is 28% above your 4-week average. Today's recovery score of 54 suggests your body needs active recovery.",
    details: "Strain-to-recovery ratio is currently at 1.8 (optimal is 1.0–1.3). Continuing high-intensity training today increases injury risk.",
    confidence: 78,
    generatedAt: "2025-05-15T08:00:00",
    recommendations: [
      "Take a rest day or opt for light yoga / walking today",
      "Prioritize 8+ hours of sleep tonight",
      "Increase protein and carbohydrate intake to support recovery",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice. Consult a sports medicine professional if you experience pain.",
  },
];

export function useAIInsights(): { data: AIInsight[]; isLoading: boolean } {
  return { data: mockAIInsights, isLoading: false };
}

// ─── Chat Channels ─────────────────────────────────────────────────────────────
const mockChatChannels: ChatChannel[] = [
  { id: "ch1", name: "Dr. Ama Owusu", type: "1:1", participants: ["P-001", "DR-001"], lastMessage: "Remember to log your BP readings daily.", unreadCount: 2 },
  { id: "ch2", name: "JIVA AI Assistant", type: "ai_assistant", participants: ["P-001", "AI"], lastMessage: "Your recovery score looks great today!", unreadCount: 1 },
  { id: "ch3", name: "Care Team", type: "group", participants: ["P-001", "DR-001", "NR-001"], lastMessage: "Appointment confirmed for May 22.", unreadCount: 0 },
  { id: "ch4", name: "JIVA Support", type: "1:1", participants: ["P-001", "SUPPORT"], lastMessage: "How can we help you today?", unreadCount: 0 },
];

export function useChatChannels(): { data: ChatChannel[]; isLoading: boolean } {
  return { data: mockChatChannels, isLoading: false };
}

// ─── Chat Messages ─────────────────────────────────────────────────────────────
const mockMessages: Record<string, ChatMessage[]> = {
  ch1: [
    { id: "msg1", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "Good morning Kwame! How are you feeling after yesterday's run?", timestamp: "09:15 AM" },
    { id: "msg2", senderId: "P-001", senderName: "Kwame Mensah", senderRole: "patient", content: "Morning Doctor! Feeling a bit tired but good. My legs are sore.", timestamp: "09:22 AM" },
    { id: "msg3", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "That's normal after a 7km run. Make sure to hydrate well and consider a rest day or light yoga today.", timestamp: "09:25 AM" },
    { id: "msg4", senderId: "P-001", senderName: "Kwame Mensah", senderRole: "patient", content: "Will do! Should I be worried about my HRV dropping to 38 last night?", timestamp: "09:28 AM" },
    { id: "msg5", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "At your fitness level, occasional dips after hard efforts are normal. If it stays below 40 for more than 3 days, let me know. Remember to log your BP readings daily.", timestamp: "09:32 AM" },
    { id: "msg6", senderId: "P-001", senderName: "Kwame Mensah", senderRole: "patient", content: "Thank you, Doctor. I'll keep tracking.", timestamp: "09:35 AM" },
  ],
  ch2: [
    { id: "ai1", senderId: "AI", senderName: "JIVA AI", senderRole: "ai", content: "Good morning, Kwame! I've analyzed your overnight data. Your sleep quality score is 76 — solid recovery after yesterday's workout.", timestamp: "06:30 AM", isAI: true },
    { id: "ai2", senderId: "P-001", senderName: "Kwame Mensah", senderRole: "patient", content: "Thanks! What should I focus on today?", timestamp: "07:15 AM" },
    { id: "ai3", senderId: "AI", senderName: "JIVA AI", senderRole: "ai", content: "Based on your recovery score of 68 and HRV of 52ms, today is a good day for moderate aerobic activity. A 30–40 minute zone 2 run or cycle would be ideal.", timestamp: "07:15 AM", isAI: true, disclaimer: "This is wellness guidance only, not medical advice." },
    { id: "ai4", senderId: "P-001", senderName: "Kwame Mensah", senderRole: "patient", content: "What about my nutrition today?", timestamp: "07:18 AM" },
    { id: "ai5", senderId: "AI", senderName: "JIVA AI", senderRole: "ai", content: "You've been hitting about 76% of your protein target this week. Try adding a Greek yogurt to breakfast and a protein shake post-workout today. Your recovery score looks great today!", timestamp: "07:19 AM", isAI: true, disclaimer: "This is wellness guidance only, not medical advice." },
  ],
  ch3: [
    { id: "ct1", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "Team update: Kwame's labs from last month are within normal range. HbA1c is 5.8% — borderline. Let's monitor.", timestamp: "Yesterday" },
    { id: "ct2", senderId: "NR-001", senderName: "Nurse Akua", senderRole: "doctor", content: "Noted. I'll add a dietary counselling follow-up to the care plan.", timestamp: "Yesterday" },
    { id: "ct3", senderId: "P-001", senderName: "Kwame Mensah", senderRole: "patient", content: "Thank you both. Should I cut back on sugar intake?", timestamp: "Yesterday" },
    { id: "ct4", senderId: "NR-001", senderName: "Nurse Akua", senderRole: "doctor", content: "Yes, reducing added sugars is a good first step. Aim for < 25g of added sugar per day. I'll share a meal guide.", timestamp: "Yesterday" },
    { id: "ct5", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "Appointment confirmed for May 22. We'll review your 30-day trends then.", timestamp: "08:00 AM" },
  ],
  ch4: [
    { id: "sp1", senderId: "SUPPORT", senderName: "JIVA Support", senderRole: "system", content: "Hi Kwame! Welcome to JIVA Support. How can we help you today?", timestamp: "2 days ago" },
    { id: "sp2", senderId: "P-001", senderName: "Kwame Mensah", senderRole: "patient", content: "I can't sync my health band — it's showing offline.", timestamp: "2 days ago" },
    { id: "sp3", senderId: "SUPPORT", senderName: "JIVA Support", senderRole: "system", content: "Sorry to hear that! Please try: 1) Force-close the JIVA app 2) Toggle Bluetooth off/on 3) Restart the band by holding the button for 5 seconds.", timestamp: "2 days ago" },
    { id: "sp4", senderId: "P-001", senderName: "Kwame Mensah", senderRole: "patient", content: "That worked! Thank you.", timestamp: "2 days ago" },
    { id: "sp5", senderId: "SUPPORT", senderName: "JIVA Support", senderRole: "system", content: "Great! Let us know if you need anything else. Have a healthy day!", timestamp: "2 days ago" },
  ],
};

export function useChatMessages(channelId: string): { data: ChatMessage[]; isLoading: boolean } {
  return { data: mockMessages[channelId] ?? [], isLoading: false };
}

// ─── Admin Users ───────────────────────────────────────────────────────────────
const mockAdminUsers: AdminUser[] = [
  { id: "U001", name: "Kwame Mensah", email: "kwame@example.com", role: "patient", status: "active", joinedAt: "2025-01-15", lastActive: "2025-05-15", subscriptionTier: "Gold" },
  { id: "U002", name: "Ama Owusu", email: "dr.owusu@jiva.health", role: "provider", status: "active", joinedAt: "2024-11-01", lastActive: "2025-05-15", subscriptionTier: "Provider" },
  { id: "U003", name: "Kofi Asante", email: "kofi@example.com", role: "patient", status: "active", joinedAt: "2025-02-10", lastActive: "2025-05-14", subscriptionTier: "Silver" },
  { id: "U004", name: "Abena Dankwa", email: "abena@example.com", role: "patient", status: "suspended", joinedAt: "2024-12-05", lastActive: "2025-04-20", subscriptionTier: "Bronze" },
  { id: "U005", name: "StarLife Insurance", email: "admin@starlife.com", role: "insurer", status: "active", joinedAt: "2024-10-01", lastActive: "2025-05-15", subscriptionTier: "Enterprise" },
  { id: "U006", name: "Efua Mensah", email: "efua@example.com", role: "patient", status: "pending", joinedAt: "2025-05-14", lastActive: "2025-05-14", subscriptionTier: "Bronze" },
  { id: "U007", name: "Emmanuel Boateng", email: "emmab@example.com", role: "patient", status: "active", joinedAt: "2025-01-22", lastActive: "2025-05-15", subscriptionTier: "Diamond" },
  { id: "U008", name: "Grace Acheampong", email: "grace@example.com", role: "patient", status: "active", joinedAt: "2024-09-15", lastActive: "2025-05-13", subscriptionTier: "Bronze" },
  { id: "U009", name: "Ibrahim Diallo", email: "ibrahim@example.com", role: "patient", status: "active", joinedAt: "2025-03-01", lastActive: "2025-05-12", subscriptionTier: "Gold" },
  { id: "U010", name: "Platform Admin", email: "admin@jiva.health", role: "admin", status: "active", joinedAt: "2024-08-01", lastActive: "2025-05-15", subscriptionTier: "Admin" },
];

export function useAdminUsers(_page: number): { data: AdminUser[]; total: number; isLoading: boolean } {
  return { data: mockAdminUsers, total: mockAdminUsers.length, isLoading: false };
}

// ─── Platform Metrics ──────────────────────────────────────────────────────────
const mockPlatformMetrics: PlatformMetric[] = [
  { name: "Total Users", value: 500, change: 12.4, changeType: "up", period: "vs last month" },
  { name: "Daily Active Users", value: 342, change: 8.2, changeType: "up", period: "vs last week" },
  { name: "Monthly Active Users", value: 487, change: 5.1, changeType: "up", period: "vs last month" },
  { name: "Churn Rate", value: 2.4, change: 0.3, changeType: "down", period: "vs last month" },
  { name: "Avg Health Score", value: 64.8, change: 2.1, changeType: "up", period: "vs last month" },
  { name: "Alerts Resolved", value: 39, change: 18.2, changeType: "up", period: "this week" },
];

export function usePlatformMetrics(): { data: PlatformMetric[]; isLoading: boolean } {
  return { data: mockPlatformMetrics, isLoading: false };
}
