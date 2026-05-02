"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Sport {
  id: string;
  label: string;
  emoji: string;
  hasGPS: boolean;
}

const SPORTS: Sport[] = [
  { id: "running", label: "Running", emoji: "🏃", hasGPS: true },
  { id: "walking", label: "Walking", emoji: "🚶", hasGPS: true },
  { id: "cycling", label: "Cycling", emoji: "🚴", hasGPS: true },
  { id: "swimming", label: "Swimming", emoji: "🏊", hasGPS: false },
  { id: "strength", label: "Strength", emoji: "🏋️", hasGPS: false },
  { id: "hiit", label: "HIIT", emoji: "⚡", hasGPS: false },
  { id: "yoga", label: "Yoga", emoji: "🧘", hasGPS: false },
  { id: "pilates", label: "Pilates", emoji: "🤸", hasGPS: false },
  { id: "rowing", label: "Rowing", emoji: "🚣", hasGPS: false },
  { id: "hiking", label: "Hiking", emoji: "⛰️", hasGPS: true },
  { id: "basketball", label: "Basketball", emoji: "🏀", hasGPS: false },
  { id: "soccer", label: "Soccer", emoji: "⚽", hasGPS: true },
  { id: "tennis", label: "Tennis", emoji: "🎾", hasGPS: false },
  { id: "boxing", label: "Boxing", emoji: "🥊", hasGPS: false },
  { id: "dance", label: "Dance", emoji: "💃", hasGPS: false },
  { id: "crossfit", label: "CrossFit", emoji: "🔥", hasGPS: false },
  { id: "skiing", label: "Skiing", emoji: "⛷️", hasGPS: true },
  { id: "surfing", label: "Surfing", emoji: "🏄", hasGPS: false },
  { id: "martial_arts", label: "Martial Arts", emoji: "🥋", hasGPS: false },
  { id: "gym", label: "Gym", emoji: "💪", hasGPS: false },
];

interface SportSelectorProps {
  onSelect: (sport: Sport) => void;
  selected?: string;
}

export default function SportSelector({ onSelect, selected }: SportSelectorProps) {
  const [search, setSearch] = useState("");
  const filtered = SPORTS.filter(s => s.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search activity..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#6366f1]/50 transition-colors"
      />
      <div className="grid grid-cols-4 gap-2">
        {filtered.map(sport => (
          <button
            key={sport.id}
            onClick={() => onSelect(sport)}
            className={cn(
              "sport-icon-btn",
              selected === sport.id && "active"
            )}
          >
            <span className="text-2xl">{sport.emoji}</span>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight text-center">{sport.label}</span>
            {sport.hasGPS && (
              <span className="text-[8px] text-[#14b8a6] font-bold">GPS</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { SPORTS };
export type { Sport };
