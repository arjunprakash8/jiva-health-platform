"use client";

import { useState } from "react";
import {
  FileText, FlaskConical, Stethoscope, Pill, Camera,
  Upload, ChevronDown, ChevronUp, Filter, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const cardShadow = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";

type RecordType = "lab" | "visit" | "prescription" | "imaging" | "report";

interface LabValue {
  name: string;
  value: number;
  unit: string;
  referenceRange: { min: number; max: number };
  status: "normal" | "borderline" | "high" | "low";
}

interface MedicalRecord {
  id: string;
  type: RecordType;
  date: string;
  title: string;
  provider?: string;
  summary: string;
  values?: LabValue[];
}

const records: MedicalRecord[] = [
  {
    id: "mr1", type: "lab", date: "Apr 10, 2025", title: "Comprehensive Metabolic Panel",
    provider: "Korle Bu Teaching Hospital",
    summary: "All values within normal range. HbA1c slightly elevated at 5.8%.",
    values: [
      { name: "Glucose (Fasting)", value: 94, unit: "mg/dL", referenceRange: { min: 70, max: 100 }, status: "normal" },
      { name: "HbA1c", value: 5.8, unit: "%", referenceRange: { min: 4.0, max: 5.6 }, status: "borderline" },
      { name: "Total Cholesterol", value: 188, unit: "mg/dL", referenceRange: { min: 0, max: 200 }, status: "normal" },
      { name: "LDL", value: 112, unit: "mg/dL", referenceRange: { min: 0, max: 130 }, status: "normal" },
      { name: "HDL", value: 58, unit: "mg/dL", referenceRange: { min: 40, max: 100 }, status: "normal" },
      { name: "Triglycerides", value: 142, unit: "mg/dL", referenceRange: { min: 0, max: 150 }, status: "normal" },
      { name: "Creatinine", value: 1.1, unit: "mg/dL", referenceRange: { min: 0.7, max: 1.3 }, status: "normal" },
      { name: "ALT", value: 28, unit: "U/L", referenceRange: { min: 7, max: 56 }, status: "normal" },
    ],
  },
  {
    id: "mr2", type: "visit", date: "Mar 22, 2025", title: "Annual Physical Examination",
    provider: "Dr. Ama Owusu — JIVA Health",
    summary: "Overall health good. BMI 25.9. Recommended increased physical activity and dietary improvements. Follow-up scheduled for June.",
  },
  {
    id: "mr3", type: "prescription", date: "Mar 22, 2025", title: "Vitamin D Supplementation",
    provider: "Dr. Ama Owusu",
    summary: "Vitamin D 2000 IU daily for 3 months. Re-evaluate in June 2025. Take with meals for better absorption.",
  },
  {
    id: "mr4", type: "imaging", date: "Feb 14, 2025", title: "Chest X-Ray — PA View",
    provider: "Accra Imaging Center",
    summary: "Clear chest fields. No pleural effusion, consolidation, or cardiomegaly. No significant findings. Normal study.",
  },
  {
    id: "mr5", type: "lab", date: "Oct 15, 2024", title: "Lipid Panel",
    provider: "Trust Hospital Accra",
    summary: "Lipid profile within normal range. Slight improvement from 2023 baseline. Continue dietary modifications.",
    values: [
      { name: "Total Cholesterol", value: 195, unit: "mg/dL", referenceRange: { min: 0, max: 200 }, status: "normal" },
      { name: "LDL", value: 118, unit: "mg/dL", referenceRange: { min: 0, max: 130 }, status: "normal" },
      { name: "HDL", value: 54, unit: "mg/dL", referenceRange: { min: 40, max: 100 }, status: "normal" },
      { name: "Triglycerides", value: 138, unit: "mg/dL", referenceRange: { min: 0, max: 150 }, status: "normal" },
    ],
  },
];

const typeConfig: Record<RecordType, { icon: React.ComponentType<{ className?: string }>, color: string, label: string }> = {
  lab: { icon: FlaskConical, color: "#6366f1", label: "Lab" },
  visit: { icon: Stethoscope, color: "#14b8a6", label: "Visit" },
  prescription: { icon: Pill, color: "#a78bfa", label: "Rx" },
  imaging: { icon: Camera, color: "#f59e0b", label: "Imaging" },
  report: { icon: FileText, color: "#38bdf8", label: "Report" },
};

const statusConfig: Record<string, { color: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  normal: { color: "#22c55e", label: "Normal", icon: Minus },
  borderline: { color: "#f59e0b", label: "Borderline", icon: TrendingUp },
  high: { color: "#f43f5e", label: "High", icon: TrendingUp },
  low: { color: "#38bdf8", label: "Low", icon: TrendingDown },
};

export default function MedicalRecords() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const typeOptions = [
    { id: "all", label: "All" },
    { id: "lab", label: "Labs" },
    { id: "visit", label: "Visits" },
    { id: "prescription", label: "Prescriptions" },
    { id: "imaging", label: "Imaging" },
  ];

  const filtered = records.filter(r => typeFilter === "all" || r.type === typeFilter);

  return (
    <div className="space-y-4">
      {/* Header + Upload */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              {typeOptions.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                    typeFilter === t.id
                      ? "bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/40"
                      : "bg-[hsl(240_18%_7%)] text-muted-foreground border border-border/30 hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              onClick={() => setShowUpload(s => !s)}
              className="h-8 px-3 text-xs rounded-xl bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/30 hover:bg-[#14b8a6]/25"
            >
              <Upload className="w-3 h-3 mr-1.5" />Upload Record
            </Button>
          </div>
          {showUpload && (
            <div className="mt-3 p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-border/40 space-y-2">
              <p className="text-xs font-semibold text-foreground">Upload Medical Record</p>
              <Input type="file" accept=".pdf,.jpg,.png,.doc" className="h-8 text-xs bg-[hsl(240_12%_10%)] border-border/60" />
              <div className="flex gap-2">
                <select className="flex-1 h-8 text-xs rounded-xl bg-[hsl(240_12%_10%)] border border-border/60 text-muted-foreground px-2">
                  <option>Lab Result</option><option>Visit Note</option><option>Prescription</option><option>Imaging</option>
                </select>
                <Button size="sm" className="h-8 px-3 text-xs rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30">Upload</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Records List */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6366f1]" />
            Medical Records
            <Badge className="text-[10px] px-2 h-4 bg-[hsl(240_12%_12%)] text-muted-foreground border-0 ml-1">
              {filtered.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map(record => {
            const tc = typeConfig[record.type];
            const isExpanded = expandedId === record.id;
            return (
              <div key={record.id} className="rounded-xl border border-border/30 overflow-hidden">
                <button
                  className="w-full flex items-start gap-3 p-3 bg-[hsl(240_18%_7%)] hover:bg-[hsl(240_18%_9%)] transition-colors text-left"
                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.color + "18" }}>
                    <tc.icon className="w-4 h-4" style={{ color: tc.color } as React.CSSProperties} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge className="text-[10px] h-4 px-2 border-0" style={{ backgroundColor: tc.color + "18", color: tc.color }}>{tc.label}</Badge>
                      <span className="text-[10px] text-muted-foreground">{record.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{record.title}</p>
                    {record.provider && <p className="text-[10px] text-muted-foreground">{record.provider}</p>}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="p-3 border-t border-border/40 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{record.summary}</p>

                    {record.values && (
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2">Lab Values</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-border/40">
                                <th className="text-left py-1.5 text-muted-foreground font-medium">Test</th>
                                <th className="text-right py-1.5 text-muted-foreground font-medium">Value</th>
                                <th className="text-right py-1.5 text-muted-foreground font-medium">Reference</th>
                                <th className="text-right py-1.5 text-muted-foreground font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {record.values.map((v, i) => {
                                const sc = statusConfig[v.status];
                                return (
                                  <tr key={i} className="border-b border-border/20 last:border-0">
                                    <td className="py-1.5 text-foreground">{v.name}</td>
                                    <td className="py-1.5 text-right font-semibold" style={{ color: sc.color }}>{v.value} {v.unit}</td>
                                    <td className="py-1.5 text-right text-muted-foreground">{v.referenceRange.min}–{v.referenceRange.max}</td>
                                    <td className="py-1.5 text-right">
                                      <Badge className="text-[10px] h-4 px-1.5 border-0" style={{ backgroundColor: sc.color + "18", color: sc.color }}>{sc.label}</Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {(record.type === "imaging" || record.type === "report") && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(240_12%_10%)] border border-border/30">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{record.title}.pdf</p>
                          <p className="text-[10px] text-muted-foreground">Document available for download</p>
                        </div>
                        <Button size="sm" className="h-7 ml-auto px-3 text-xs rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 hover:bg-[#6366f1]/25">
                          View
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
