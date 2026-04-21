// ─── JIVA Health Platform — Comprehensive Type Definitions ────────────────────

// Core user types
export interface Goal {
  id: string;
  type: "weight_loss" | "weight_gain" | "endurance" | "strength" | "activity_frequency" | "sleep";
  target: number;
  current: number;
  unit: string;
  deadline: string;
  createdAt: string;
  history: { date: string; value: number }[];
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  bodyFatPct: number;
  muscleMass: number;
  restingHR: number;
  vo2Max: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  statusPoints: number;
  healthScore: number;
  goals: Goal[];
}

// Vitals
export interface VitalReading {
  timestamp: string;
  value: number;
  unit: string;
  status: "normal" | "borderline" | "out_of_range";
}

export interface VitalsSnapshot {
  heartRate: number;
  spo2: number;
  hrv: number;
  temperature: number;
  respirationRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  glucose: number;
  timestamp: string;
}

// Activity
export interface IntensityZone {
  zone: 1 | 2 | 3 | 4 | 5;
  name: string;
  minutes: number;
  color: string;
}

export interface GPSPoint {
  lat: number;
  lng: number;
  elevation?: number;
  timestamp: string;
  speed?: number;
}

export interface ActivitySession {
  id: string;
  type: "run" | "walk" | "cycle" | "swim" | "gym" | "yoga" | "hiit";
  startTime: string;
  endTime: string;
  duration: number;
  distance?: number;
  calories: number;
  avgHR: number;
  maxHR: number;
  steps?: number;
  route?: GPSPoint[];
  elevationGain?: number;
  avgPace?: number;
  intensityZones: IntensityZone[];
}

export interface Route {
  id: string;
  name: string;
  distance: number;
  elevationGain: number;
  points: GPSPoint[];
  createdAt: string;
}

// Nutrition
export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: number;
  servingUnit: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  items: FoodItem[];
}

export interface NutritionDay {
  date: string;
  meals: Meal[];
  totals: { calories: number; protein: number; carbs: number; fat: number; fiber: number; water: number };
  targets: { calories: number; protein: number; carbs: number; fat: number; water: number };
  fastingWindow?: { start: string; end: string; duration: number };
}

// Sleep & Recovery
export interface SleepSession {
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  stages: { light: number; deep: number; rem: number; awake: number };
  score: number;
  hrAvg: number;
  hrMin: number;
  hrMax: number;
  recoveryScore: number;
  strainscore: number;
}

export interface RecoveryData {
  date: string;
  score: number;
  hrv: number;
  restingHR: number;
  sleepScore: number;
  readiness: "peak" | "high" | "moderate" | "low";
}

// Hydration
export interface HydrationLog {
  date: string;
  entries: { time: string; amount: number; unit: string }[];
  total: number;
  target: number;
}

// Mindfulness
export interface MoodLog {
  timestamp: string;
  mood: 1 | 2 | 3 | 4 | 5;
  stressLevel: 1 | 2 | 3 | 4 | 5;
  note?: string;
  tags: string[];
}

export interface MindfulnessSession {
  id: string;
  type: "meditation" | "breathing" | "body_scan" | "sleep_story";
  duration: number;
  completedAt: string;
  stressReduction?: number;
}

// Medical
export interface LabValue {
  name: string;
  value: number;
  unit: string;
  referenceRange: { min: number; max: number };
  status: "normal" | "borderline" | "high" | "low";
}

export interface MedicalRecord {
  id: string;
  type: "lab" | "visit" | "prescription" | "imaging" | "report";
  date: string;
  title: string;
  provider?: string;
  values?: LabValue[];
  summary: string;
  attachmentUrl?: string;
}

export interface ClinicalEvent {
  id: string;
  date: string;
  type: "vital" | "lab" | "visit" | "alert" | "medication";
  title: string;
  description: string;
  source: "wearable" | "manual" | "provider";
  severity?: "info" | "warning" | "critical";
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  specialty: string;
  type: "in_person" | "telemedicine";
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

// Chat
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "patient" | "doctor" | "ai" | "system";
  content: string;
  timestamp: string;
  isAI?: boolean;
  disclaimer?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: "1:1" | "group" | "ai_assistant";
  participants: string[];
  lastMessage?: string;
  unreadCount: number;
}

// AI Insights
export interface AIInsight {
  id: string;
  category: "activity" | "sleep" | "nutrition" | "vitals" | "recovery" | "goals";
  title: string;
  summary: string;
  details: string;
  confidence: number;
  generatedAt: string;
  recommendations: string[];
  disclaimer: string;
}

// Admin
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "patient" | "provider" | "insurer" | "admin";
  status: "active" | "suspended" | "pending";
  joinedAt: string;
  lastActive: string;
  subscriptionTier: string;
}

export interface PlatformMetric {
  name: string;
  value: number;
  change: number;
  changeType: "up" | "down" | "stable";
  period: string;
}

// API Response wrappers
export interface APIResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
