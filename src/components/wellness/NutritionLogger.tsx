"use client";

import { useState } from "react";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Utensils, Plus, Droplets, Clock, Flame, Target,
  Apple, Zap, ChevronDown, ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const meals = [
  {
    id: "m1", name: "Breakfast", time: "07:30", calories: 480, protein: 28, carbs: 52, fat: 18,
    items: [
      { name: "Oatmeal with berries", calories: 280 },
      { name: "Greek yogurt", calories: 120 },
      { name: "Almonds", calories: 80 },
    ],
  },
  {
    id: "m2", name: "Lunch", time: "12:30", calories: 620, protein: 42, carbs: 58, fat: 22,
    items: [
      { name: "Grilled chicken breast", calories: 250 },
      { name: "Brown rice", calories: 210 },
      { name: "Steamed broccoli", calories: 80 },
      { name: "Olive oil dressing", calories: 80 },
    ],
  },
  {
    id: "m3", name: "Snack", time: "16:00", calories: 210, protein: 12, carbs: 24, fat: 8,
    items: [{ name: "Protein bar", calories: 210 }],
  },
  {
    id: "m4", name: "Dinner", time: "19:30", calories: 540, protein: 38, carbs: 44, fat: 16,
    items: [
      { name: "Salmon fillet", calories: 280 },
      { name: "Quinoa", calories: 180 },
      { name: "Mixed salad", calories: 80 },
    ],
  },
];

const targets = { calories: 2200, protein: 140, carbs: 220, fat: 70, water: 3000 };
const totals = { calories: 1850, protein: 120, carbs: 178, fat: 64, water: 2250 };

const weeklyCals = [
  { day: "Mon", consumed: 1920, target: 2200 },
  { day: "Tue", consumed: 2100, target: 2200 },
  { day: "Wed", consumed: 1750, target: 2200 },
  { day: "Thu", consumed: 2050, target: 2200 },
  { day: "Fri", consumed: 1850, target: 2200 },
  { day: "Sat", consumed: 2300, target: 2200 },
  { day: "Sun", consumed: 1990, target: 2200 },
];

const macroRadarData = [
  { macro: "Protein", value: Math.round((totals.protein / targets.protein) * 100) },
  { macro: "Carbs", value: Math.round((totals.carbs / targets.carbs) * 100) },
  { macro: "Fat", value: Math.round((totals.fat / targets.fat) * 100) },
  { macro: "Fiber", value: 80 },
  { macro: "Water", value: Math.round((totals.water / targets.water) * 100) },
];

// Fasting window: last food at 19:30, next meal at 11:00 — 15.5h elapsed
const fastingStart = "7:30 PM";
const fastingTarget = 16;
const fastingElapsed = 15.5;
const fastingPct = Math.round((fastingElapsed / fastingTarget) * 100);

// Water cups: 8 cups of 250ml each
const totalCups = 12;
const filledCups = Math.floor(totals.water / 250);

export default function NutritionLogger() {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [foodInput, setFoodInput] = useState("");
  const [waterAmount, setWaterAmount] = useState(totals.water);
  const [showAddFood, setShowAddFood] = useState(false);
  const [loggedFoods, setLoggedFoods] = useState<string[]>([]);

  const handleAddWater = (ml: number) => setWaterAmount((w) => Math.min(targets.water + 500, w + ml));

  const handleLogFood = () => {
    if (foodInput.trim()) {
      setLoggedFoods((f) => [foodInput.trim(), ...f]);
      setFoodInput("");
      setShowAddFood(false);
    }
  };

  const localFilledCups = Math.floor(waterAmount / 250);

  return (
    <div className="space-y-4">
      {/* Calorie Ring + Macros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calorie donut */}
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#f97316]" />
              Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-5">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(240 12% 12%)" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - totals.calories / targets.calories)}`}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold metric-number text-foreground">{totals.calories}</span>
                <span className="text-[10px] text-muted-foreground">/ {targets.calories}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Consumed</span>
                  <span className="font-semibold text-[#f97316]">{totals.calories} kcal</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Burned (Activity)</span>
                  <span className="font-semibold text-[#22c55e]">-520 kcal</span>
                </div>
              </div>
              <div className="h-px bg-border/40" />
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Net Balance</span>
                  <span className="font-semibold text-[#6366f1]">{totals.calories - 520} kcal</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-semibold text-foreground">{targets.calories - totals.calories} kcal</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Macros */}
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#6366f1]" />
              Macronutrients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Protein", current: totals.protein, target: targets.protein, unit: "g", color: "#6366f1" },
              { label: "Carbs", current: totals.carbs, target: targets.carbs, unit: "g", color: "#f59e0b" },
              { label: "Fat", current: totals.fat, target: targets.fat, unit: "g", color: "#f97316" },
            ].map(({ label, current, target, unit, color }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-semibold" style={{ color }}>
                    {current}{unit} / {target}{unit}
                  </span>
                </div>
                <div className="h-2 bg-[hsl(240_12%_12%)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.round((current / target) * 100))}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Meal Log */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#14b8a6]" />
              Meal Log
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowAddFood((s) => !s)}
              className="h-7 px-3 text-xs rounded-xl bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/30 hover:bg-[#14b8a6]/25"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Food
            </Button>
          </div>
          {showAddFood && (
            <div className="mt-3 flex gap-2">
              <Input
                placeholder='e.g. "2 eggs scrambled" or "banana"'
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogFood()}
                className="h-8 text-xs bg-[hsl(240_18%_7%)] border-border/60"
              />
              <Button size="sm" onClick={handleLogFood} className="h-8 px-3 text-xs rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 hover:bg-[#6366f1]/25 shrink-0">
                Log
              </Button>
            </div>
          )}
          {loggedFoods.length > 0 && (
            <div className="mt-2 space-y-1">
              {loggedFoods.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Apple className="w-3 h-3 text-[#22c55e]" />
                  <span>{f}</span>
                  <Badge className="text-[9px] h-4 px-1.5 bg-[#22c55e]/10 text-[#22c55e] border-0">Logged</Badge>
                </div>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {meals.map((meal) => (
            <div key={meal.id} className="rounded-xl border border-border/40 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 bg-[hsl(240_18%_7%)] hover:bg-[hsl(240_18%_9%)] transition-colors"
                onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
              >
                <div className="flex items-center gap-3">
                  <Utensils className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">{meal.time} · {meal.items.length} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#f97316] metric-number">{meal.calories} kcal</span>
                  {expandedMeal === meal.id ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
              </button>
              {expandedMeal === meal.id && (
                <div className="p-3 space-y-2 border-t border-border/40">
                  {meal.items.map((item) => (
                    <div key={item.name} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="text-foreground font-medium">{item.calories} kcal</span>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-2 pt-2 border-t border-border/30 text-xs text-muted-foreground">
                    <span>P: <b className="text-foreground">{meal.protein}g</b></span>
                    <span>C: <b className="text-foreground">{meal.carbs}g</b></span>
                    <span>F: <b className="text-foreground">{meal.fat}g</b></span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fasting + Water */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fasting Window */}
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#a78bfa]" />
              Fasting Window (16:8)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Started</p>
                <p className="font-semibold text-foreground">{fastingStart}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Elapsed</p>
                <p className="text-lg font-extrabold text-[#a78bfa] metric-number">{fastingElapsed}h</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Target</p>
                <p className="font-semibold text-foreground">{fastingTarget}h</p>
              </div>
            </div>
            <div className="space-y-1">
              <Progress value={fastingPct} className="h-3 bg-[hsl(240_12%_12%)]" style={{ "--progress-color": "#a78bfa" } as React.CSSProperties} />
              <p className="text-xs text-muted-foreground text-right">{fastingPct}% complete · Next meal: 11:00 AM</p>
            </div>
            <Badge className={cn("text-xs px-2.5 py-1", fastingPct >= 100 ? "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30" : "bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/30")}>
              {fastingPct >= 100 ? "Fast Complete" : "In Progress"}
            </Badge>
          </CardContent>
        </Card>

        {/* Water Intake */}
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#38bdf8]" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-extrabold metric-number text-[#38bdf8]">{waterAmount}</span>
                <span className="text-xs text-muted-foreground ml-1">/ {targets.water} ml</span>
              </div>
              <Badge className={cn("text-xs", waterAmount >= targets.water ? "bg-[#22c55e]/15 text-[#22c55e] border-0" : waterAmount >= 2000 ? "bg-[#38bdf8]/15 text-[#38bdf8] border-0" : "bg-rose-500/15 text-rose-400 border-0")}>
                {waterAmount >= targets.water ? "Well Hydrated" : waterAmount >= 2000 ? "Optimal" : "Dehydrated"}
              </Badge>
            </div>

            {/* Cup visualization */}
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: totalCups }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setWaterAmount((w) => i < localFilledCups ? Math.max(0, w - 250) : w + 250)}
                  className={cn(
                    "w-7 h-8 rounded-md flex items-end justify-center pb-0.5 transition-all border",
                    i < localFilledCups
                      ? "bg-[#38bdf8]/20 border-[#38bdf8]/40"
                      : "bg-[hsl(240_12%_12%)] border-border/30 hover:border-[#38bdf8]/30"
                  )}
                >
                  <Droplets className={cn("w-3.5 h-3.5", i < localFilledCups ? "text-[#38bdf8]" : "text-muted-foreground/40")} />
                </button>
              ))}
            </div>

            {/* Quick add */}
            <div className="flex gap-2">
              {[150, 250, 500].map((ml) => (
                <Button
                  key={ml}
                  size="sm"
                  onClick={() => handleAddWater(ml)}
                  className="flex-1 h-7 text-xs rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 hover:bg-[#38bdf8]/20"
                >
                  +{ml}ml
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calories + Macro Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-[#f97316]" />
              Weekly Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weeklyCals} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 12% 12%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v} kcal`]} />
                <Bar dataKey="consumed" fill="#f97316" fillOpacity={0.8} radius={[3, 3, 0, 0]} name="Consumed" />
                <Bar dataKey="target" fill="#6366f1" fillOpacity={0.2} radius={[3, 3, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#6366f1]" />
              Macro Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={macroRadarData}>
                <PolarGrid stroke="hsl(240 12% 15%)" />
                <PolarAngleAxis dataKey="macro" tick={{ fill: "hsl(240 5% 48%)", fontSize: 10 }} />
                <Radar dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, "% of Target"]} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
