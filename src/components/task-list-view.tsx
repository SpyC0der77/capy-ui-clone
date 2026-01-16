"use client";

import { useState, useRef } from "react";
import type { Task } from "@/components/kanban-board";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  CircleDot,
  CircleCheck,
  GripVertical,
} from "lucide-react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

interface TaskListViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  onTaskClick?: (task: Task) => void;
}

interface TaskGroup {
  id: string;
  title: string;
  status: "todo" | "in progress" | "done" | "cancelled";
  icon: React.ReactNode;
  iconColor: string;
  tasks: Task[];
}

function PriorityIcon({ priority = "medium" }: { priority?: string }) {
  const bars = priority === "high" ? 3 : priority === "medium" ? 2 : 1;
  return (
    <div className="flex items-end gap-[2px] h-3.5 w-3.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "w-[3px] rounded-[1px] transition-colors",
            i === 1 ? "h-[5px]" : i === 2 ? "h-[9px]" : "h-[13px]",
            i <= bars ? "bg-muted-foreground" : "bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

function TaskRow({
  task,
  onTaskClick,
  isOverlay,
}: {
  task: Task;
  onTaskClick?: (task: Task) => void;
  isOverlay?: boolean;
}) {
  function getStatusIcon() {
    switch (task.status) {
      case "todo":
        return <CircleDot className="size-4 text-gray-500" />;
      case "in progress":
        return <CircleDot className="size-4 text-amber-500" />;
      case "done":
        return <CircleCheck className="size-4 text-emerald-500" />;
      case "cancelled":
        return <CircleDot className="size-4 text-red-500" />;
    }
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors",
        isOverlay && "bg-muted/80 shadow-lg"
      )}
      onClick={() => !isOverlay && onTaskClick?.(task)}
    >
      {/* Priority */}
      <PriorityIcon priority="medium" />

      {/* Task ID */}
      <span className="text-xs text-muted-foreground font-mono w-16 shrink-0">
        {task.id}
      </span>

      {/* Status Icon */}
      <div className="shrink-0">
        {getStatusIcon()}
      </div>

      {/* Title */}
      <span className="flex-1 text-sm font-medium text-foreground truncate">
        {task.title}
      </span>

      {/* Date */}
      <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
        {task.date}
      </span>

      {/* Drag Handle */}
      {!isOverlay && (
        <GripVertical className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors shrink-0" />
      )}
    </div>
  );
}

function SortableTaskRow({
  task,
  onTaskClick,
}: {
  task: Task;
  onTaskClick?: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);

  function handlePointerDown(e: React.PointerEvent) {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasMoved.current = false;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (dragStartPos.current && !hasMoved.current) {
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);
      if (dx > 5 || dy > 5) {
        hasMoved.current = true;
      }
    }
  }

  function handleClick(e: React.MouseEvent) {
    if (!isDragging && !hasMoved.current && onTaskClick) {
      e.stopPropagation();
      onTaskClick(task);
    }
    dragStartPos.current = null;
    hasMoved.current = false;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      suppressHydrationWarning
      className={cn(
        "transition-all duration-200",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div {...listeners}>
        <TaskRow task={task} onTaskClick={undefined} />
      </div>
    </div>
  );
}

function TaskGroupSection({
  group,
  onTaskClick,
}: {
  group: TaskGroup;
  onTaskClick?: (task: Task) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { setNodeRef, isOver } = useDroppable({
    id: group.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-b border-border transition-all duration-200",
        isOver && "bg-primary/5"
      )}
    >
      {/* Group Header */}
      <button
        className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronRight
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-90"
          )}
        />
        <div className={cn("size-4 flex items-center justify-center")}>
          {group.icon}
        </div>
        <span className="text-sm font-medium text-foreground">
          {group.title}
        </span>
        <span className="text-xs text-muted-foreground ml-1">
          {group.tasks.length}
        </span>
      </button>

      {/* Tasks */}
      {isExpanded && (
        <div>
          <SortableContext
            items={group.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {group.tasks.map((task) => (
              <SortableTaskRow
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

export function TaskListView({
  tasks,
  setTasks,
  onTaskClick,
}: TaskListViewProps) {
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

  const groups: TaskGroup[] = [
    {
      id: "todo",
      title: "Todo",
      status: "todo" as const,
      icon: <CircleDot className="size-4 text-gray-500" />,
      iconColor: "text-gray-500",
      tasks: todoTasks,
    },
    {
      id: "in-progress",
      title: "In Progress",
      status: "in progress" as const,
      icon: <CircleDot className="size-4 text-amber-500" />,
      iconColor: "text-amber-500",
      tasks: inProgressTasks,
    },
    {
      id: "done",
      title: "Done",
      status: "done" as const,
      icon: <CircleCheck className="size-4 text-emerald-500" />,
      iconColor: "text-emerald-500",
      tasks: doneTasks,
    },
    {
      id: "cancelled",
      title: "Cancelled",
      status: "cancelled" as const,
      icon: <CircleDot className="size-4 text-red-500" />,
      iconColor: "text-red-500",
      tasks: cancelledTasks,
    },
  ];

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

    // Check if we're dropping over a section
    if (overId === "todo" || overId === "in-progress" || overId === "done" || overId === "cancelled") {
      let newStatus: "todo" | "in progress" | "done" | "cancelled";
      if (overId === "in-progress") {
        newStatus = "in progress";
      } else {
        newStatus = overId as "todo" | "done" | "cancelled";
      }
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

    // If dropping on another task in the same section, reorder
    if (overTask && activeTask.status === overTask.status) {
      const tasksInSection = tasks.filter(
        (t) => t.status === activeTask.status
      );
      const oldIndex = tasksInSection.findIndex((t) => t.id === activeId);
      const newIndex = tasksInSection.findIndex((t) => t.id === overId);

      const reorderedSection = arrayMove(tasksInSection, oldIndex, newIndex);
      const otherTasks = tasks.filter((t) => t.status !== activeTask.status);

      setTasks([...otherTasks, ...reorderedSection]);
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
      <div className="flex flex-col h-full overflow-auto bg-card">
        {groups.map((group) => (
          <TaskGroupSection
            key={group.id}
            group={group}
            onTaskClick={onTaskClick}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeTask ? <TaskRow task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
