"use client";

import { useState } from "react";
import type React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard, SortableKanbanCard } from "./kanban-card";
import { useNotifications } from "@/contexts/notifications-context";

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "active" | "completed";
}

interface KanbanBoardProps {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  onTaskClick?: (task: Task) => void;
}

export function KanbanBoard({
  tasks,
  setTasks,
  onTaskClick,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { addNotification } = useNotifications();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeTasks = tasks.filter((task) => task.status === "active");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    if (overId === "active" || overId === "completed") {
      const newStatus = overId as "active" | "completed";
      if (activeTask.status !== newStatus) {
        setTasks((tasks) =>
          tasks.map((t) =>
            t.id === activeId ? { ...t, status: newStatus } : t
          )
        );
        if (newStatus === "completed") {
          addNotification({
            type: "task_completed",
            title: "Task completed",
            description: `"${activeTask.title}" has been marked as done.`,
            taskId: activeId,
          });
        }
      }
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      setTasks((tasks) =>
        tasks.map((t) =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        )
      );
      if (overTask.status === "completed") {
        addNotification({
          type: "task_completed",
          title: "Task completed",
          description: `"${activeTask.title}" has been marked as done.`,
          taskId: activeId,
        });
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // If dropping on another task in the same column, reorder
    if (overTask && activeTask.status === overTask.status) {
      const tasksInColumn = tasks.filter((t) => t.status === activeTask.status);
      const oldIndex = tasksInColumn.findIndex((t) => t.id === activeId);
      const newIndex = tasksInColumn.findIndex((t) => t.id === overId);

      const reorderedColumn = arrayMove(tasksInColumn, oldIndex, newIndex);
      const otherTasks = tasks.filter((t) => t.status !== activeTask.status);

      setTasks([...otherTasks, ...reorderedColumn]);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-5 p-5 overflow-x-auto bg-card">
        <KanbanColumn
          id="active"
          title="Active"
          count={activeTasks.length}
          accentColor="bg-[#0070C3]"
        >
          <SortableContext
            items={activeTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {activeTasks.map((task) => (
              <SortableKanbanCard
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </KanbanColumn>

        <KanbanColumn
          id="completed"
          title="Done"
          count={completedTasks.length}
          accentColor="bg-[#0070C3]"
        >
          <SortableContext
            items={completedTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {completedTasks.map((task) => (
              <SortableKanbanCard
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </KanbanColumn>
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
