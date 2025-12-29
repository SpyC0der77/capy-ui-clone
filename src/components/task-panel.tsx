"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { KanbanBoard, type Task } from "@/components/kanban-board";
import { TaskListView } from "@/components/task-list-view";
import { TaskModal } from "@/components/task-modal";
import { useSettings } from "@/contexts/settings-context";
import { useTasks } from "@/contexts/tasks-context";
import { LayoutGrid, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "kanban" | "list";

export function TaskPanel() {
  const { settings, updateSetting } = useSettings();
  const { tasks, setTasks } = useTasks();
  const [activeTab, setActiveTab] = useState<"active" | "done">("active");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  // Listen for command menu create task event
  useEffect(() => {
    function handleCreateTask() {
      setEditingTask(null);
      setModalOpen(true);
    }

    function handleEditTask(event: Event) {
      const customEvent = event as CustomEvent<{ taskId: string }>;
      if (customEvent.detail?.taskId) {
        const taskToEdit = tasks.find(
          (t) => t.id === customEvent.detail.taskId
        );
        if (taskToEdit) {
          setEditingTask(taskToEdit);
          setModalOpen(true);
        }
      }
    }

    window.addEventListener("command-menu:create-task", handleCreateTask);
    window.addEventListener("command-menu:edit-task", handleEditTask);
    return () => {
      window.removeEventListener("command-menu:create-task", handleCreateTask);
      window.removeEventListener("command-menu:edit-task", handleEditTask);
    };
  }, [tasks]);

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
      <div className="flex items-center justify-between px-4 h-12 border-b border-border bg-card shrink-0">
        {/* Sidebar Trigger */}
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          {/* Tabs */}
          <div className="relative flex items-center gap-1">
            <button
              ref={activeButtonRef}
              onClick={() => setActiveTab("active")}
              className={cn(
                "relative px-3 h-12 text-sm font-medium transition-colors flex items-center",
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
                "relative px-3 h-12 text-sm font-medium transition-colors flex items-center",
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
