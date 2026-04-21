"use client";

import { useState } from "react";
import { MessageSquare, Bot, Users } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import ChatInterface from "@/components/chat/ChatInterface";

const navItems = [
  { icon: MessageSquare, label: "Messages", id: "messages" },
  { icon: Bot, label: "AI Assistant", id: "ai_assistant" },
  { icon: Users, label: "Care Team", id: "care_team" },
];

export default function ChatPage() {
  const [activeSection, setActiveSection] = useState("messages");

  return (
    <DashboardShell
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      role="patient"
      userName="Kwame Mensah"
      userInitials="KM"
      userSub="Patient · Gold Tier"
      notificationCount={3}
      topBarTitle="Messages"
      topBarSub="Chat with your care team and JIVA AI"
    >
      <ChatInterface />
    </DashboardShell>
  );
}
