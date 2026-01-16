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

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "todo" | "in progress" | "done" | "cancelled";
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

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in progress");
  const doneTasks = tasks.filter((task) => task.status === "done");
  const cancelledTasks = tasks.filter((task) => task.status === "cancelled");

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

    // Check if we're dropping over a column
    if (overId === "todo" || overId === "in progress" || overId === "done" || overId === "cancelled") {
      const newStatus = overId as "todo" | "in progress" | "done" | "cancelled";
      if (activeTask.status !== newStatus) {
        setTasks((tasks) =>
          tasks.map((t) =>
            t.id === activeId ? { ...t, status: newStatus } : t
          )
        );
      }
      return;
    }

    // Check if we're dropping over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      setTasks((tasks) =>
        tasks.map((t) =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        )
      );
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
          id="todo"
          title="Todo"
          count={todoTasks.length}
          accentColor="bg-[#6B7280]"
        >
          <SortableContext
            items={todoTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {todoTasks.map((task) => (
              <SortableKanbanCard
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </KanbanColumn>

        <KanbanColumn
          id="in progress"
          title="In Progress"
          count={inProgressTasks.length}
          accentColor="bg-[#F59E0B]"
        >
          <SortableContext
            items={inProgressTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {inProgressTasks.map((task) => (
              <SortableKanbanCard
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </KanbanColumn>

        <KanbanColumn
          id="done"
          title="Done"
          count={doneTasks.length}
          accentColor="bg-[#10B981]"
        >
          <SortableContext
            items={doneTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {doneTasks.map((task) => (
              <SortableKanbanCard
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </KanbanColumn>

        <KanbanColumn
          id="cancelled"
          title="Cancelled"
          count={cancelledTasks.length}
          accentColor="bg-[#EF4444]"
        >
          <SortableContext
            items={cancelledTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {cancelledTasks.map((task) => (
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
