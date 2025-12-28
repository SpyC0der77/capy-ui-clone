"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KanbanBoard, type Task } from "@/components/kanban-board";
import { TaskListView } from "@/components/task-list-view";
import { TaskModal } from "@/components/task-modal";
import { LayoutGrid, SlidersHorizontal, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "kanban" | "list";

const initialTasks: Task[] = [
  {
    id: "SCO-001",
    title: "Clone UI with Next.js and ShadCN",
    description: "Clone this UI in Next.js using ShadCN/ui.",
    date: "Dec 17",
    model: "Sonnet 4.5",
    status: "completed",
  },
  {
    id: "SCO-002",
    title: "Implement authentication flow",
    description: "Add OAuth and email/password authentication.",
    date: "Dec 20",
    model: "Opus 4",
    status: "active",
  },
  {
    id: "SCO-003",
    title: "Build API endpoints",
    description: "Create REST API for task management.",
    date: "Dec 22",
    model: "Sonnet 4.5",
    status: "active",
  },
  {
    id: "SCO-004",
    title: "Design database schema",
    description: "PostgreSQL schema for users and tasks.",
    date: "Dec 15",
    model: "Opus 4",
    status: "completed",
  },
];

export function TaskPanel() {
  const [activeTab, setActiveTab] = useState<"active" | "done">("active");
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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
      <div className="flex items-center justify-between px-4 border-b border-border">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "relative px-3 py-3 text-sm font-medium transition-colors",
              activeTab === "active"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Active
            {activeTab === "active" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("done")}
            className={cn(
              "relative px-3 py-3 text-sm font-medium transition-colors",
              activeTab === "done"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Done
            {activeTab === "done" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8", viewMode === "kanban" && "bg-muted")}
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid
              className={cn(
                "size-4",
                viewMode === "kanban"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8", viewMode === "list" && "bg-muted")}
            onClick={() => setViewMode("list")}
          >
            <List
              className={cn(
                "size-4",
                viewMode === "list"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            />
          </Button>
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
          <TaskListView tasks={tasks} onTaskClick={handleOpenEditModal} />
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
