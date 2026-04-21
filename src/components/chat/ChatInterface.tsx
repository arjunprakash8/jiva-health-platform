"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare, Bot, Users, Headphones, Send, Info,
  UserCircle2, Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const cardShadow = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "patient" | "doctor" | "ai" | "system";
  content: string;
  timestamp: string;
  isAI?: boolean;
  disclaimer?: string;
}

interface ChatChannel {
  id: string;
  name: string;
  type: "1:1" | "group" | "ai_assistant";
  lastMessage?: string;
  unreadCount: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const channels: ChatChannel[] = [
  { id: "ch1", name: "Dr. Ama Owusu", type: "1:1", lastMessage: "Remember to log your BP readings daily.", unreadCount: 2, color: "#14b8a6", icon: UserCircle2 },
  { id: "ch2", name: "JIVA AI Assistant", type: "ai_assistant", lastMessage: "Your recovery score looks great today!", unreadCount: 1, color: "#6366f1", icon: Bot },
  { id: "ch3", name: "Care Team", type: "group", lastMessage: "Appointment confirmed for May 22.", unreadCount: 0, color: "#f59e0b", icon: Users },
  { id: "ch4", name: "JIVA Support", type: "1:1", lastMessage: "How can we help you today?", unreadCount: 0, color: "#94a3b8", icon: Headphones },
];

const allMessages: Record<string, ChatMessage[]> = {
  ch1: [
    { id: "1", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "Good morning Kwame! How are you feeling after yesterday's run?", timestamp: "09:15 AM" },
    { id: "2", senderId: "P-001", senderName: "Kwame", senderRole: "patient", content: "Morning Doctor! Feeling a bit tired but good. My legs are sore.", timestamp: "09:22 AM" },
    { id: "3", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "That's normal after a 7km run. Make sure to hydrate well and consider a rest day or light yoga today.", timestamp: "09:25 AM" },
    { id: "4", senderId: "P-001", senderName: "Kwame", senderRole: "patient", content: "Will do! Should I be worried about my HRV dropping to 38 last night?", timestamp: "09:28 AM" },
    { id: "5", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "At your fitness level, occasional dips after hard efforts are normal. If it stays below 40 for more than 3 days, let me know. Remember to log your BP readings daily.", timestamp: "09:32 AM" },
    { id: "6", senderId: "P-001", senderName: "Kwame", senderRole: "patient", content: "Thank you, Doctor. I'll keep tracking.", timestamp: "09:35 AM" },
  ],
  ch2: [
    { id: "ai1", senderId: "AI", senderName: "JIVA AI", senderRole: "ai", content: "Good morning, Kwame! I've analyzed your overnight data. Your sleep quality score is 76 — solid recovery after yesterday's workout.", timestamp: "06:30 AM", isAI: true },
    { id: "ai2", senderId: "P-001", senderName: "Kwame", senderRole: "patient", content: "Thanks! What should I focus on today?", timestamp: "07:15 AM" },
    { id: "ai3", senderId: "AI", senderName: "JIVA AI", senderRole: "ai", content: "Based on your recovery score of 68 and HRV of 52ms, today is a good day for moderate aerobic activity. A 30–40 minute zone 2 run or cycle would be ideal.", timestamp: "07:15 AM", isAI: true, disclaimer: "Wellness guidance only. Not medical advice." },
    { id: "ai4", senderId: "P-001", senderName: "Kwame", senderRole: "patient", content: "What about my nutrition today?", timestamp: "07:18 AM" },
    { id: "ai5", senderId: "AI", senderName: "JIVA AI", senderRole: "ai", content: "You've been hitting about 76% of your protein target this week. Try adding Greek yogurt to breakfast and a protein shake post-workout. Your recovery score looks great today!", timestamp: "07:19 AM", isAI: true, disclaimer: "Wellness guidance only. Not medical advice." },
  ],
  ch3: [
    { id: "ct1", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "Team update: Kwame's labs from last month are within normal range. HbA1c is 5.8% — borderline. Let's monitor.", timestamp: "Yesterday" },
    { id: "ct2", senderId: "NR-001", senderName: "Nurse Akua", senderRole: "doctor", content: "Noted. I'll add a dietary counselling follow-up to the care plan.", timestamp: "Yesterday" },
    { id: "ct3", senderId: "P-001", senderName: "Kwame", senderRole: "patient", content: "Thank you both. Should I cut back on sugar intake?", timestamp: "Yesterday" },
    { id: "ct4", senderId: "NR-001", senderName: "Nurse Akua", senderRole: "doctor", content: "Yes, reducing added sugars is a good first step. Aim for < 25g of added sugar per day.", timestamp: "Yesterday" },
    { id: "ct5", senderId: "DR-001", senderName: "Dr. Ama Owusu", senderRole: "doctor", content: "Appointment confirmed for May 22.", timestamp: "08:00 AM" },
  ],
  ch4: [
    { id: "sp1", senderId: "SUPPORT", senderName: "JIVA Support", senderRole: "system", content: "Hi Kwame! Welcome to JIVA Support. How can we help you today?", timestamp: "2 days ago" },
    { id: "sp2", senderId: "P-001", senderName: "Kwame", senderRole: "patient", content: "I can't sync my health band — it's showing offline.", timestamp: "2 days ago" },
    { id: "sp3", senderId: "SUPPORT", senderName: "JIVA Support", senderRole: "system", content: "Sorry to hear that! Please try: 1) Force-close the JIVA app 2) Toggle Bluetooth off/on 3) Hold band button 5 seconds to restart.", timestamp: "2 days ago" },
    { id: "sp4", senderId: "P-001", senderName: "Kwame", senderRole: "patient", content: "That worked! Thank you.", timestamp: "2 days ago" },
    { id: "sp5", senderId: "SUPPORT", senderName: "JIVA Support", senderRole: "system", content: "Great! Let us know if you need anything else. Have a healthy day!", timestamp: "2 days ago" },
  ],
};

export default function ChatInterface() {
  const [activeChannel, setActiveChannel] = useState("ch1");
  const [channelUnreads, setChannelUnreads] = useState<Record<string, number>>({ ch1: 2, ch2: 1, ch3: 0, ch4: 0 });
  const [messages, setMessages] = useState(allMessages);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannel, messages]);

  const handleChannelSelect = (id: string) => {
    setActiveChannel(id);
    setChannelUnreads(u => ({ ...u, [id]: 0 }));
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      senderId: "P-001",
      senderName: "Kwame",
      senderRole: "patient",
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(m => ({ ...m, [activeChannel]: [...(m[activeChannel] ?? []), newMsg] }));
    setInputText("");
  };

  const currentChannel = channels.find(c => c.id === activeChannel);
  const currentMessages = messages[activeChannel] ?? [];
  const isAIChannel = currentChannel?.type === "ai_assistant";

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[500px] gap-4">
      {/* Channel Sidebar */}
      <Card className="w-64 shrink-0 rounded-2xl border border-border/60 bg-card flex flex-col" style={{ boxShadow: cardShadow }}>
        <div className="p-4 border-b border-border/40">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#6366f1]" />
            Messages
          </p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {channels.map(ch => (
              <button
                key={ch.id}
                onClick={() => handleChannelSelect(ch.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all",
                  activeChannel === ch.id
                    ? "bg-[#6366f1]/15 border border-[#6366f1]/30"
                    : "hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ch.color + "18" }}>
                  <ch.icon className="w-4 h-4" style={{ color: ch.color } as React.CSSProperties} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{ch.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{ch.lastMessage}</p>
                </div>
                {channelUnreads[ch.id] > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#f43f5e] text-white text-[9px] flex items-center justify-center font-bold shrink-0">
                    {channelUnreads[ch.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        <Card className="flex-1 rounded-2xl border border-border/60 bg-card flex flex-col overflow-hidden" style={{ boxShadow: cardShadow }}>
          {/* Channel Header */}
          <div className="p-4 border-b border-border/40 flex items-center gap-3">
            {currentChannel && (
              <>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: currentChannel.color + "18" }}>
                  <currentChannel.icon className="w-4 h-4" style={{ color: currentChannel.color } as React.CSSProperties} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{currentChannel.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{currentChannel.type.replace("_", " ")}</p>
                </div>
              </>
            )}
            {isAIChannel && (
              <Badge className="ml-auto text-[10px] bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20">
                <Shield className="w-2.5 h-2.5 mr-1" />AI-Powered
              </Badge>
            )}
          </div>

          {/* AI Disclaimer */}
          {isAIChannel && (
            <div className="mx-4 mt-3 flex items-start gap-2 p-3 rounded-xl bg-[#f59e0b]/8 border border-[#f59e0b]/20">
              <Info className="w-3.5 h-3.5 text-[#f59e0b] shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="text-foreground font-semibold">JIVA AI</span> provides wellness guidance only. This is{" "}
                <span className="text-foreground">not a medical diagnosis</span>. Always consult your doctor for medical advice.
              </p>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {currentMessages.map(msg => {
                const isMe = msg.senderId === "P-001";
                const isAI = msg.isAI;
                return (
                  <div key={msg.id} className={cn("flex gap-2.5", isMe ? "flex-row-reverse" : "flex-row")}>
                    {/* Avatar */}
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 self-end",
                      isMe ? "bg-[#6366f1] text-white" :
                      isAI ? "bg-[#6366f1]/15 border border-[#6366f1]/30" :
                      msg.senderRole === "doctor" ? "bg-[#14b8a6]/15 border border-[#14b8a6]/30" :
                      "bg-[hsl(240_12%_14%)]"
                    )}>
                      {isAI ? <Bot className="w-3.5 h-3.5 text-[#6366f1]" /> : msg.senderName.charAt(0)}
                    </div>

                    {/* Bubble */}
                    <div className={cn("max-w-[75%] space-y-1", isMe && "items-end flex flex-col")}>
                      {!isMe && (
                        <span className="text-[10px] text-muted-foreground px-1">{msg.senderName}</span>
                      )}
                      <div className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                        isMe
                          ? "bg-[#6366f1] text-white rounded-tr-sm"
                          : isAI
                          ? "bg-[#6366f1]/10 border border-[#6366f1]/20 text-foreground rounded-tl-sm"
                          : "bg-[hsl(240_18%_11%)] border border-border/30 text-foreground rounded-tl-sm"
                      )}>
                        {msg.content}
                        {msg.disclaimer && (
                          <p className="text-[9px] opacity-60 mt-1.5 italic border-t border-current/20 pt-1">{msg.disclaimer}</p>
                        )}
                      </div>
                      <span className="text-[9px] text-muted-foreground px-1">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border/40">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={isAIChannel ? "Ask JIVA AI about your wellness..." : "Type a message..."}
                className="flex-1 h-9 text-xs bg-[hsl(240_18%_7%)] border-border/60 rounded-xl"
              />
              <Button
                onClick={handleSend}
                disabled={!inputText.trim()}
                size="sm"
                className="h-9 w-9 p-0 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
            {isAIChannel && (
              <p className="text-[9px] text-muted-foreground text-center mt-1.5">
                AI responses are not a substitute for professional medical advice
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
