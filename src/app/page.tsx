"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/page-layout";
import { TaskPanel, initialTasks } from "@/components/task-panel";
import { ChatPanel } from "@/components/chat-panel";
import { CommandPalette } from "@/components/command-palette";
import { TaskModal } from "@/components/task-modal";
import type { Task } from "@/components/kanban-board";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleOpenCreateModal();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskData.id ? ({ ...taskData, id: taskData.id } as Task) : t
        )
      );
    } else {
      const newId = `SCO-${String(tasks.length + 1).padStart(3, "0")}`;
      const newTask: Task = {
        ...taskData,
        id: newId,
      } as Task;
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  }

  function handleNavigateToTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      handleOpenEditModal(task);
    }
  }

  return (
    <>
      <PageLayout
        mainContent={
          <TaskPanel
            tasks={tasks}
            setTasks={setTasks}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenEditModal={handleOpenEditModal}
          />
        }
        sideContent={<ChatPanel />}
      />
      <CommandPalette
        tasks={tasks}
        onCreateTask={handleOpenCreateModal}
        onNavigateToTask={handleNavigateToTask}
      />
      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </>
  );
}
