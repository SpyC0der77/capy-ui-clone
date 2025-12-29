"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TaskPanel } from "@/components/task-panel";
import { ChatPanel } from "@/components/chat-panel";
import { useSettings } from "@/contexts/settings-context";

function MainContent() {
  return (
    <main className="flex flex-1 overflow-hidden gap-2 p-2 h-full bg-background">
      <div className="flex-1 min-w-0 rounded-xl bg-card border border-border overflow-hidden flex flex-col">
        <TaskPanel />
      </div>
      <div className="w-[400px] shrink-0 rounded-xl bg-card border border-border overflow-hidden flex flex-col">
        <ChatPanel />
      </div>
    </main>
  );
}

export default function Home() {
  const { settings, updateSetting } = useSettings();

  return (
    <SidebarProvider
      open={settings.sidebarOpen}
      onOpenChange={(open) => updateSetting("sidebarOpen", open)}
      className="h-svh"
    >
      <AppSidebar />
      <MainContent />
    </SidebarProvider>
  );
}
