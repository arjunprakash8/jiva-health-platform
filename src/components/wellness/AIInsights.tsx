"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Bot, Activity, Moon, Utensils, Heart, Zap, Target,
  ChevronRight, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const chartTooltipStyle = {
  backgroundColor: "hsl(240 22% 9%)",
  border: "1px solid hsl(240 12% 15%)",
  borderRadius: "10px",
  fontSize: "11px",
  color: "#f0eeeb",
};

const cardShadow = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";

const categoryConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  activity: { color: "#6366f1", icon: Activity },
  sleep: { color: "#a78bfa", icon: Moon },
  nutrition: { color: "#22c55e", icon: Utensils },
  vitals: { color: "#f43f5e", icon: Heart },
  recovery: { color: "#14b8a6", icon: Zap },
  goals: { color: "#f59e0b", icon: Target },
};

const insights = [
  {
    id: "ai1", category: "sleep", title: "Sleep Efficiency Declining",
    summary: "Your deep sleep has decreased by 18% over the past 2 weeks. This correlates with increased late-evening screen time detected before bed.",
    confidence: 87,
    recommendations: [
      "Reduce screen time 90 minutes before your target bedtime",
      "Try the 10-minute guided wind-down meditation in JIVA",
      "Keep bedroom temperature between 18–20°C",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice.",
  },
  {
    id: "ai2", category: "activity", title: "Optimal Training Window",
    summary: "Your body performs best during morning sessions 06:00–08:00. Your zone 3–4 output is 14% higher in this window based on HRV correlation.",
    confidence: 82,
    recommendations: [
      "Schedule high-intensity sessions on days when morning HRV > 50ms",
      "Start with a 5-minute warm-up walk to maximize zone 3 time",
      "Your next optimal training window is tomorrow morning",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice.",
  },
  {
    id: "ai3", category: "nutrition", title: "Protein Below Target",
    summary: "Averaging 108g protein daily — 23% below your 140g target. Post-workout synthesis windows are being missed on 3 of 5 workout days.",
    confidence: 91,
    recommendations: [
      "Add 25–30g protein shake within 45 min of gym sessions",
      "Greek yogurt or eggs at breakfast add 14–18g easily",
      "Log meals on workout days to hit your target",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice. Consult a dietitian for personalized nutrition advice.",
  },
  {
    id: "ai4", category: "vitals", title: "HRV Improving — Keep Going",
    summary: "7-day HRV average increased from 38ms to 52ms over the past month — a strong indicator of improving cardiovascular fitness.",
    confidence: 94,
    recommendations: [
      "Maintain 3–4 aerobic sessions per week",
      "Continue current stress management practices",
      "Milestone: sustain HRV > 55ms for 2 consecutive weeks",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice.",
  },
  {
    id: "ai5", category: "recovery", title: "Overreaching Risk Today",
    summary: "Training load over the past 5 days is 28% above your 4-week average. Recovery score of 54 suggests rest is needed.",
    confidence: 78,
    recommendations: [
      "Take a rest day or opt for light yoga / walking today",
      "Prioritize 8+ hours of sleep tonight",
      "Increase protein and carb intake for recovery",
    ],
    disclaimer: "This is a wellness suggestion, not medical advice.",
  },
];

const healthScoreComponents = [
  { component: "Activity", value: 78 },
  { component: "Sleep", value: 72 },
  { component: "Nutrition", value: 64 },
  { component: "Vitals", value: 82 },
  { component: "Recovery", value: 68 },
  { component: "Consistency", value: 75 },
];

const weeklyPerformancePoints = [
  { icon: CheckCircle2, color: "#22c55e", text: "Completed 4 of 5 planned workouts" },
  { icon: TrendingUp, color: "#14b8a6", text: "HRV improved by 14ms this week" },
  { icon: TrendingDown, color: "#f43f5e", text: "Sleep average dropped 0.4h vs last week" },
  { icon: CheckCircle2, color: "#22c55e", text: "Hit protein target 4 of 7 days" },
  { icon: AlertTriangle, color: "#f59e0b", text: "Hydration below target on 3 days" },
];

const trendAlerts = [
  { title: "HRV 7-day Trend", direction: "up", change: "+14ms", color: "#22c55e", detail: "Consistent improvement over 30 days" },
  { title: "Resting HR", direction: "down", change: "-3 bpm", color: "#22c55e", detail: "Trending toward optimal range" },
  { title: "Sleep Score", direction: "down", change: "-6 pts", color: "#f43f5e", detail: "2-week downward trend" },
];

export default function AIInsights() {
  return (
    <div className="space-y-4">
      {/* AI Disclaimer Banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#6366f1]/8 border border-[#6366f1]/20">
        <Bot className="w-4 h-4 text-[#6366f1] shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-semibold">JIVA AI Insights</span> are generated from your health data and provided for wellness guidance only.
          They are <span className="text-foreground">not a medical diagnosis</span>. Always consult your doctor for medical advice.
        </p>
      </div>

      {/* Insights Feed */}
      <div className="space-y-3">
        {insights.map((insight) => {
          const cfg = categoryConfig[insight.category];
          return (
            <Card key={insight.id} className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.color + "18" }}>
                      <cfg.icon className="w-4 h-4" style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge className="text-[10px] h-4 px-2 capitalize border-0" style={{ backgroundColor: cfg.color + "18", color: cfg.color }}>
                          {insight.category}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.summary}</p>

                {/* Confidence */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-muted-foreground">Confidence</span>
                    <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{insight.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-[hsl(240_12%_12%)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${insight.confidence}%`, backgroundColor: cfg.color }} />
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-1.5 mb-3">
                  {insight.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: cfg.color }} />
                      <span className="text-muted-foreground leading-relaxed">{r}</span>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-1.5 pt-2 border-t border-border/30">
                  <Info className="w-3 h-3 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground/60 italic">{insight.disclaimer}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health Score Radar */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#6366f1]" />
            Health Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={healthScoreComponents}>
              <PolarGrid stroke="hsl(240 12% 15%)" />
              <PolarAngleAxis dataKey="component" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} />
              <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}/100`]} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Performance Summary */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#14b8a6]" />
            Weekly Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {weeklyPerformancePoints.map((p, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <p.icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: p.color }} />
              <p className="text-xs text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trend Alerts */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
            Trend Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {trendAlerts.map((t) => (
            <div key={t.title} className="flex items-center justify-between p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-border/30">
              <div className="flex items-center gap-3">
                {t.direction === "up"
                  ? <TrendingUp className="w-4 h-4" style={{ color: t.color }} />
                  : <TrendingDown className="w-4 h-4" style={{ color: t.color }} />}
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground">{t.detail}</p>
                </div>
              </div>
              <span className="text-xs font-bold metric-number" style={{ color: t.color }}>{t.change}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
