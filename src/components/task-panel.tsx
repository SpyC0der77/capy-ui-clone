"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { KanbanBoard, type Task } from "@/components/kanban-board";
import { TaskListView } from "@/components/task-list-view";
import { TaskModal } from "@/components/task-modal";
import { useSettings } from "@/contexts/settings-context";
import { LayoutGrid, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "kanban" | "list";

const initialTasks: Task[] = [
  {
    id: "SCO-001",
    title: "Clone UI with Next.js and ShadCN",
    description: "Clone this UI in Next.js using ShadCN/ui.",
    date: "Dec 17",
    status: "completed",
  },
  {
    id: "SCO-002",
    title: "Implement authentication flow",
    description: "Add OAuth and email/password authentication.",
    date: "Dec 20",
    status: "active",
  },
  {
    id: "SCO-003",
    title: "Build API endpoints",
    description: "Create REST API for task management.",
    date: "Dec 22",
    status: "active",
  },
  {
    id: "SCO-004",
    title: "Design database schema",
    description: "PostgreSQL schema for users and tasks.",
    date: "Dec 15",
    status: "completed",
  },
];

export function TaskPanel() {
  const { settings, updateSetting } = useSettings();
  const [activeTab, setActiveTab] = useState<"active" | "done">("active");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Use viewMode directly from settings
  const viewMode = settings.viewMode;
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    function updateIndicator() {
      const activeButton = activeButtonRef.current;
      const doneButton = doneButtonRef.current;
      const container = activeButton?.parentElement;

      if (!activeButton || !doneButton || !container) return;

      const activeRect = activeButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (activeTab === "active") {
        setIndicatorStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
        });
      } else {
        setIndicatorStyle({
          left: doneButton.getBoundingClientRect().left - containerRect.left,
          width: doneButton.getBoundingClientRect().width,
        });
      }
    }

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  function handleOpenCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function handleOpenEditModal(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function handleSaveTask(taskData: Omit<Task, "id"> & { id?: string }) {
    if (taskData.id) {
      // Update existing task
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskData.id ? ({ ...taskData, id: taskData.id } as Task) : t
        )
      );
    } else {
      // Create new task - generate ID
      const newId = `SCO-${String(tasks.length + 1).padStart(3, "0")}`;
      const newTask: Task = {
        ...taskData,
        id: newId,
      } as Task;
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 border-b border-border bg-background dark:bg-[#1F1F1F]">
        {/* Sidebar Trigger */}
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          {/* Tabs */}
          <div className="relative flex items-center gap-1">
            <button
              ref={activeButtonRef}
              onClick={() => setActiveTab("active")}
              className={cn(
                "relative px-3 py-3 text-sm font-medium transition-colors",
                activeTab === "active"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Active
            </button>
            <button
              ref={doneButtonRef}
              onClick={() => setActiveTab("done")}
              className={cn(
                "relative px-3 py-3 text-sm font-medium transition-colors",
                activeTab === "done"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Done
            </button>
            <span
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => {
              if (value) {
                updateSetting("viewMode", value as ViewMode);
              }
            }}
            variant="outline"
            size="sm"
            spacing={0}
            className="h-8"
          >
            <ToggleGroupItem
              value="kanban"
              aria-label="Board view"
              className="size-8 px-0"
            >
              <LayoutGrid className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="size-8 px-0"
            >
              <List className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            size="sm"
            className="gap-1.5 h-8 ml-1"
            onClick={handleOpenCreateModal}
          >
            <Plus className="size-4" />
            Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={tasks}
            setTasks={setTasks}
            onTaskClick={handleOpenEditModal}
          />
        ) : (
          <TaskListView
            tasks={tasks}
            setTasks={setTasks}
            onTaskClick={handleOpenEditModal}
          />
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}
