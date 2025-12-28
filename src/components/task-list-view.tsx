"use client";

import { useState } from "react";
import type { Task } from "@/components/kanban-board";
import { cn } from "@/lib/utils";
import { ChevronRight, CircleDot, CircleCheck } from "lucide-react";

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

interface TaskGroup {
  id: string;
  title: string;
  status: "active" | "completed";
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
}: {
  task: Task;
  onTaskClick?: (task: Task) => void;
}) {
  const isActive = task.status === "active";

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors"
      )}
      onClick={() => onTaskClick?.(task)}
    >
      {/* Priority */}
      <PriorityIcon priority="medium" />

      {/* Task ID */}
      <span className="text-xs text-muted-foreground font-mono w-16 shrink-0">
        {task.id}
      </span>

      {/* Status Icon */}
      <div className="shrink-0">
        {isActive ? (
          <CircleDot className="size-4 text-amber-500" />
        ) : (
          <CircleCheck className="size-4 text-emerald-500" />
        )}
      </div>

      {/* Title */}
      <span className="flex-1 text-sm font-medium text-foreground truncate">
        {task.title}
      </span>

      {/* Date */}
      <span className="text-xs text-muted-foreground w-16 text-right shrink-0">
        {task.date}
      </span>
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

  return (
    <div className="border-b border-border">
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
          {group.tasks.map((task) => (
            <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskListView({ tasks, onTaskClick }: TaskListViewProps) {
  const activeTasks = tasks.filter((task) => task.status === "active");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const groups: TaskGroup[] = [
    {
      id: "in-progress",
      title: "In Progress",
      status: "active" as const,
      icon: <CircleDot className="size-4 text-amber-500" />,
      iconColor: "text-amber-500",
      tasks: activeTasks,
    },
    {
      id: "done",
      title: "Done",
      status: "completed" as const,
      icon: <CircleCheck className="size-4 text-emerald-500" />,
      iconColor: "text-emerald-500",
      tasks: completedTasks,
    },
  ].filter((group) => group.tasks.length > 0);

  return (
    <div className="flex flex-col h-full overflow-auto bg-[#1F1F1F]">
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
  );
}
