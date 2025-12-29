"use client";

import { PageLayout } from "@/components/page-layout";
import { TaskPanel } from "@/components/task-panel";
import { ChatPanel } from "@/components/chat-panel";

export default function Home() {
  return <PageLayout mainContent={<TaskPanel />} sideContent={<ChatPanel />} />;
}
