"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskCard } from "@/components/task-card";
import { LayoutGrid, SlidersHorizontal, Plus, Circle } from "lucide-react";

const tasks = [
  {
    id: "SCO-001",
    title: "Clone UI with Next.js and ShadCN",
    description: "Clone this UI in Next.js using ShadCN/ui.",
    date: "Dec 17",
    model: "Sonnet 4.5",
    status: "completed" as const,
  },
];

export function TaskPanel() {
  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="done" className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <TabsList className="bg-transparent p-0 h-auto gap-1">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground px-3 py-1.5 text-sm font-medium rounded-md hover:text-foreground transition-colors"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="done"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground px-3 py-1.5 text-sm font-medium rounded-none hover:text-foreground transition-colors"
            >
              Done
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8">
              <LayoutGrid className="size-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
            </Button>
            <Button size="sm" className="gap-1.5 h-8">
              <Plus className="size-4" />
              Task
            </Button>
          </div>
        </div>
        <Separator />

        <TabsContent value="active" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <p className="text-sm text-muted-foreground">No active tasks</p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="done" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Circle className="size-3 fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Earlier
                </span>
                <span className="text-sm text-muted-foreground">
                  {tasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
