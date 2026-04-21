"use client";

import { useState } from "react";
import {
  Calendar, Video, UserCheck, Plus, CheckCircle2,
  Clock, MapPin, Phone, Mail, X, Stethoscope, Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const cardShadow = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";

interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  specialty: string;
  type: "in_person" | "telemedicine";
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

const appointments: Appointment[] = [
  { id: "ap1", date: "May 22, 2025", time: "10:00 AM", provider: "Dr. Ama Owusu", specialty: "General Practice", type: "telemedicine", status: "confirmed" },
  { id: "ap2", date: "Jun 5, 2025", time: "2:30 PM", provider: "Dr. Kofi Asante", specialty: "Cardiology", type: "in_person", status: "scheduled" },
  { id: "ap3", date: "Apr 14, 2025", time: "9:00 AM", provider: "Dr. Ama Owusu", specialty: "General Practice", type: "telemedicine", status: "completed", notes: "Blood pressure reviewed. Continue monitoring." },
  { id: "ap4", date: "Mar 22, 2025", time: "11:00 AM", provider: "Dr. Ama Owusu", specialty: "General Practice", type: "in_person", status: "completed", notes: "Annual physical completed. Labs ordered." },
  { id: "ap5", date: "Feb 28, 2025", time: "3:00 PM", provider: "Dr. Emmanuel Ofori", specialty: "Nutrition", type: "telemedicine", status: "cancelled" },
];

const careTeam = [
  {
    name: "Dr. Ama Owusu", specialty: "General Practice", role: "Primary Care",
    initials: "AO", color: "#14b8a6", phone: "+233 20 000 1234", email: "dr.owusu@jiva.health",
    available: true,
  },
  {
    name: "Dr. Kofi Asante", specialty: "Cardiology", role: "Specialist",
    initials: "KA", color: "#6366f1", phone: "+233 20 000 5678", email: "dr.asante@korlebu.gh",
    available: true,
  },
  {
    name: "Nurse Akua Mensah", specialty: "Care Coordinator", role: "Nursing",
    initials: "NM", color: "#f59e0b", phone: "+233 20 000 9012", email: "akua@jiva.health",
    available: false,
  },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  scheduled: { color: "#6366f1", label: "Scheduled" },
  confirmed: { color: "#22c55e", label: "Confirmed" },
  completed: { color: "#94a3b8", label: "Completed" },
  cancelled: { color: "#f43f5e", label: "Cancelled" },
};

// Static week calendar
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekDates = [19, 20, 21, 22, 23, 24, 25];
const appointmentDay = 22; // May 22

export default function CareCoordination() {
  const [showBookModal, setShowBookModal] = useState(false);
  const [showTelemedicine, setShowTelemedicine] = useState(false);
  const [bookForm, setBookForm] = useState({ date: "", provider: "Dr. Ama Owusu", type: "telemedicine", notes: "" });

  const upcoming = appointments.filter(a => a.status === "scheduled" || a.status === "confirmed");
  const past = appointments.filter(a => a.status === "completed" || a.status === "cancelled");

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => setShowBookModal(s => !s)}
          className="flex-1 h-9 text-xs rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 hover:bg-[#6366f1]/25"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />Book Appointment
        </Button>
        <Button
          onClick={() => setShowTelemedicine(s => !s)}
          className="flex-1 h-9 text-xs rounded-xl bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/30 hover:bg-[#14b8a6]/25"
        >
          <Video className="w-3.5 h-3.5 mr-1.5" />Start Telemedicine
        </Button>
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <Card className="rounded-2xl border border-[#6366f1]/30 bg-card" style={{ boxShadow: cardShadow }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6366f1]" />
                Book Appointment
              </CardTitle>
              <button onClick={() => setShowBookModal(false)} className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Date</label>
              <Input type="date" value={bookForm.date} onChange={e => setBookForm(f => ({ ...f, date: e.target.value }))} className="h-8 text-xs bg-[hsl(240_18%_7%)] border-border/60" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Provider</label>
              <select
                value={bookForm.provider}
                onChange={e => setBookForm(f => ({ ...f, provider: e.target.value }))}
                className="w-full h-8 text-xs rounded-xl bg-[hsl(240_18%_7%)] border border-border/60 text-foreground px-2"
              >
                {careTeam.map(p => <option key={p.name} value={p.name}>{p.name} — {p.specialty}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <div className="flex gap-2">
                {[{ v: "telemedicine", label: "Telemedicine" }, { v: "in_person", label: "In Person" }].map(t => (
                  <button
                    key={t.v}
                    onClick={() => setBookForm(f => ({ ...f, type: t.v }))}
                    className={cn("flex-1 py-1.5 text-xs rounded-xl border font-semibold", bookForm.type === t.v ? "bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/40" : "bg-[hsl(240_18%_7%)] text-muted-foreground border-border/30")}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <Input placeholder="Notes (optional)" value={bookForm.notes} onChange={e => setBookForm(f => ({ ...f, notes: e.target.value }))} className="h-8 text-xs bg-[hsl(240_18%_7%)] border-border/60" />
            <Button className="w-full h-8 text-xs rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 hover:bg-[#6366f1]/25" onClick={() => setShowBookModal(false)}>
              Request Appointment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Telemedicine placeholder */}
      {showTelemedicine && (
        <Card className="rounded-2xl border border-[#14b8a6]/30 bg-card" style={{ boxShadow: cardShadow }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/15 flex items-center justify-center">
                  <Video className="w-5 h-5 text-[#14b8a6]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Telemedicine Session</p>
                  <p className="text-xs text-muted-foreground">Connecting to Dr. Ama Owusu...</p>
                </div>
              </div>
              <button onClick={() => setShowTelemedicine(false)} className="w-7 h-7 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 hover:bg-rose-500/25">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="aspect-video rounded-xl bg-[hsl(240_18%_7%)] flex flex-col items-center justify-center border border-border/40">
              <div className="w-16 h-16 rounded-full bg-[#14b8a6]/15 flex items-center justify-center mb-3">
                <UserCheck className="w-8 h-8 text-[#14b8a6]" />
              </div>
              <p className="text-sm font-semibold text-foreground">Dr. Ama Owusu</p>
              <p className="text-xs text-muted-foreground mt-1">Waiting for provider to join...</p>
              <div className="flex gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3">
              This is a demo. In production, JIVA integrates with licensed telemedicine providers.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mini Calendar */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#6366f1]" />
            May 2025 — Week 3
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-medium">{d}</span>
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all",
                  weekDates[i] === appointmentDay
                    ? "bg-[#6366f1] text-white shadow-glow-sm"
                    : weekDates[i] === 21
                    ? "bg-[hsl(240_18%_11%)] text-foreground border border-border/60"
                    : "text-muted-foreground"
                )}>
                  {weekDates[i]}
                </div>
                {weekDates[i] === appointmentDay && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#22c55e]" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcoming.map(appt => {
            const sc = statusConfig[appt.status];
            return (
              <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-border/30">
                <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center shrink-0">
                  {appt.type === "telemedicine" ? <Video className="w-4 h-4 text-[#6366f1]" /> : <MapPin className="w-4 h-4 text-[#14b8a6]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{appt.provider}</p>
                  <p className="text-[10px] text-muted-foreground">{appt.specialty} · {appt.date}, {appt.time}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="text-[10px] h-4 px-2 border-0" style={{ backgroundColor: sc.color + "18", color: sc.color }}>{sc.label}</Badge>
                  <Badge className="text-[10px] h-4 px-2 bg-[hsl(240_12%_12%)] text-muted-foreground border-0">
                    {appt.type === "telemedicine" ? "Video" : "In-person"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Care Team */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#14b8a6]" />
            Care Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {careTeam.map(member => (
            <div key={member.name} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(240_18%_7%)] border border-border/30">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: member.color }}>
                  {member.initials}
                </div>
                <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[hsl(240_18%_7%)]", member.available ? "bg-[#22c55e]" : "bg-[#94a3b8]")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{member.name}</p>
                <p className="text-[10px] text-muted-foreground">{member.specialty} · {member.role}</p>
              </div>
              <div className="flex gap-1.5">
                <button className="w-7 h-7 rounded-xl bg-[hsl(240_12%_12%)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[hsl(240_12%_15%)] transition-colors">
                  <Phone className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 rounded-xl bg-[hsl(240_12%_12%)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[hsl(240_12%_15%)] transition-colors">
                  <Mail className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card className="rounded-2xl border border-border/60 bg-card" style={{ boxShadow: cardShadow }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            Past Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {past.map(appt => {
            const sc = statusConfig[appt.status];
            return (
              <div key={appt.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[hsl(240_18%_7%)] border border-border/20">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{appt.provider}</p>
                  <p className="text-[10px] text-muted-foreground">{appt.date}, {appt.time} · {appt.specialty}</p>
                  {appt.notes && <p className="text-[10px] text-muted-foreground/70 mt-0.5 italic">{appt.notes}</p>}
                </div>
                <Badge className="text-[10px] h-4 px-2 border-0 shrink-0" style={{ backgroundColor: sc.color + "15", color: sc.color }}>{sc.label}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
