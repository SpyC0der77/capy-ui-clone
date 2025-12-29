"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useSettings } from "@/contexts/settings-context";

interface PageLayoutProps {
  mainContent: ReactNode;
  sideContent: ReactNode;
}

function SplitLayout({ mainContent, sideContent }: PageLayoutProps) {
  return (
    <main className="flex flex-1 overflow-hidden gap-2 p-2 h-full bg-background">
      <div className="flex-1 min-w-0 rounded-xl bg-card border border-border overflow-hidden flex flex-col">
        {mainContent}
      </div>
      <div className="w-[400px] shrink-0 rounded-xl bg-card border border-border overflow-hidden flex flex-col">
        {sideContent}
      </div>
    </main>
  );
}

function ConnectedLayout({ mainContent, sideContent }: PageLayoutProps) {
  return (
    <main className="flex flex-1 overflow-hidden p-2 h-full bg-background">
      <div className="flex flex-1 min-w-0 rounded-xl bg-card border border-border overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col">
          {mainContent}
        </div>
        <div className="w-[400px] shrink-0 border-l border-border flex flex-col">
          {sideContent}
        </div>
      </div>
    </main>
  );
}

function LayoutContent({ mainContent, sideContent }: PageLayoutProps) {
  const { settings } = useSettings();

  if (settings.layoutStyle === "connected") {
    return <ConnectedLayout mainContent={mainContent} sideContent={sideContent} />;
  }
  return <SplitLayout mainContent={mainContent} sideContent={sideContent} />;
}

export function PageLayout({ mainContent, sideContent }: PageLayoutProps) {
  const { settings, updateSetting } = useSettings();

  return (
    <SidebarProvider
      open={settings.sidebarOpen}
      onOpenChange={(open) => updateSetting("sidebarOpen", open)}
      className="h-svh"
    >
      <AppSidebar />
      <LayoutContent mainContent={mainContent} sideContent={sideContent} />
    </SidebarProvider>
  );
}
