import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TaskPanel } from "@/components/task-panel";
import { ChatPanel } from "@/components/chat-panel";

export default function Home() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main className="flex flex-1 overflow-hidden gap-2 p-2">
        <div className="flex-1 min-w-0 rounded-xl bg-card border border-border overflow-hidden">
          <TaskPanel />
        </div>
        <div className="w-[400px] shrink-0 rounded-xl bg-card border border-border overflow-hidden">
          <ChatPanel />
        </div>
      </main>
    </SidebarProvider>
  );
}
