"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PerformanceSphereProps {
  recovery: number;       // 0–100
  strain: number;         // 0–21
  hrv: number;           // ms
  sleepScore: number;    // 0–100
  size?: number;
  className?: string;
  onClick?: () => void;
}

function getStateColor(recovery: number): { primary: string; secondary: string; label: string; glow: string } {
  if (recovery >= 67) return { primary: "#22c55e", secondary: "#14b8a6", label: "Optimal", glow: "rgba(34,197,94,0.4)" };
  if (recovery >= 34) return { primary: "#f59e0b", secondary: "#f97316", label: "Moderate", glow: "rgba(245,158,11,0.4)" };
  return { primary: "#f43f5e", secondary: "#e11d48", label: "Low Recovery", glow: "rgba(244,63,94,0.4)" };
}

export default function PerformanceSphere({
  recovery,
  strain,
  hrv,
  sleepScore,
  size = 220,
  className,
  onClick,
}: PerformanceSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const timeRef = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const colors = getStateColor(recovery);

  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const cx = W / 2;
    const cy = H / 2;
    const r = (W * 0.38);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer glow ring
    const breathScale = 1 + 0.03 * Math.sin(t * 0.8);
    const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.7 * breathScale, cx, cy, r * 1.4 * breathScale);
    glowGrad.addColorStop(0, colors.glow.replace("0.4", "0.15"));
    glowGrad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.4 * breathScale, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Outer ring track
    ctx.beginPath();
    ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Recovery arc (colored progress ring)
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (recovery / 100) * Math.PI * 2;
    const arcGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    arcGrad.addColorStop(0, colors.primary);
    arcGrad.addColorStop(1, colors.secondary);
    ctx.beginPath();
    ctx.arc(cx, cy, r + 14, startAngle, endAngle);
    ctx.strokeStyle = arcGrad;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    // Sphere base gradient (main body)
    const sphereGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.05, cx, cy, r);
    sphereGrad.addColorStop(0, colors.primary + "55");
    sphereGrad.addColorStop(0.4, "rgba(10,10,25,0.85)");
    sphereGrad.addColorStop(0.8, "rgba(6,6,16,0.95)");
    sphereGrad.addColorStop(1, "rgba(4,4,12,1)");
    ctx.beginPath();
    ctx.arc(cx, cy * breathScale * 0.995, r * breathScale, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad;
    ctx.fill();

    // Inner shimmer — rotating highlight
    const shimmerAngle = t * 0.3;
    const shimX = cx + Math.cos(shimmerAngle) * r * 0.25;
    const shimY = cy + Math.sin(shimmerAngle) * r * 0.15;
    const shimGrad = ctx.createRadialGradient(shimX, shimY, 0, shimX, shimY, r * 0.6);
    shimGrad.addColorStop(0, colors.primary + "22");
    shimGrad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = shimGrad;
    ctx.fill();

    // Top-left specular highlight
    const highlightGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx - r * 0.35, cy - r * 0.35, r * 0.5);
    highlightGrad.addColorStop(0, "rgba(255,255,255,0.18)");
    highlightGrad.addColorStop(0.4, "rgba(255,255,255,0.06)");
    highlightGrad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = highlightGrad;
    ctx.fill();

    // Bottom-right secondary light
    const secondGrad = ctx.createRadialGradient(cx + r * 0.3, cy + r * 0.35, 0, cx + r * 0.3, cy + r * 0.35, r * 0.45);
    secondGrad.addColorStop(0, colors.secondary + "18");
    secondGrad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = secondGrad;
    ctx.fill();

    // Strain dots ring (inner)
    const strainDots = Math.round((strain / 21) * 12);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const dotR = r * 0.72;
      const dx = cx + Math.cos(angle) * dotR;
      const dy = cy + Math.sin(angle) * dotR;
      ctx.beginPath();
      ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = i < strainDots ? colors.primary + "cc" : "rgba(255,255,255,0.1)";
      ctx.fill();
    }

    // Center text: recovery score
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Large number
    ctx.font = `800 ${r * 0.52}px -apple-system, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(Math.round(recovery).toString(), cx, cy - r * 0.06);

    // Label below
    ctx.font = `600 ${r * 0.14}px -apple-system, sans-serif`;
    ctx.fillStyle = colors.primary;
    ctx.letterSpacing = "0.1em";
    ctx.fillText("RECOVERY", cx, cy + r * 0.3);

    // Status dot
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.46, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.fill();
  }, [colors, recovery, strain]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const animate = (timestamp: number) => {
      timeRef.current = timestamp / 1000;
      draw(timeRef.current);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [size, draw]);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className="relative cursor-pointer"
        style={{ animation: "orbFloat 4s ease-in-out infinite" }}
        onClick={() => { setExpanded(!expanded); onClick?.(); }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="rounded-full"
        />
        {/* Status label */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: colors.primary }}>
            {colors.label}
          </span>
        </div>
      </div>

      {/* Expanded detail strip */}
      {expanded && (
        <div className="w-full grid grid-cols-3 gap-2 animate-fade-in">
          {[
            { label: "HRV", value: hrv + "ms", color: "#6366f1" },
            { label: "Strain", value: strain.toFixed(1), color: "#f59e0b" },
            { label: "Sleep", value: sleepScore + "%", color: "#14b8a6" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-xl p-3 text-center">
              <p className="metric-label">{label}</p>
              <p className="text-lg font-bold tabular-nums" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
