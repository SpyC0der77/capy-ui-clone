import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TaskPanel } from "@/components/task-panel";
import { ChatPanel } from "@/components/chat-panel";

export default function Home() {
  return (
    <SidebarProvider defaultOpen className="h-svh">
      <AppSidebar />
      <main className="flex flex-1 overflow-hidden gap-2 p-2 h-full">
        <div className="flex-1 min-w-0 rounded-xl bg-card border border-border overflow-hidden flex flex-col">
          <TaskPanel />
        </div>
        <div className="w-[400px] shrink-0 rounded-xl bg-card border border-border overflow-hidden flex flex-col">
          <ChatPanel />
        </div>
      </main>
    </SidebarProvider>
  );
}
