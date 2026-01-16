"use client";

import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "./kanban-board";

interface KanbanCardProps {
  task: Task;
  isOverlay?: boolean;
  onTaskClick?: (task: Task) => void;
}

export function KanbanCard({ task, isOverlay, onTaskClick }: KanbanCardProps) {
  return (
    <Card
      className={cn(
        "p-4 space-y-3 cursor-grab active:cursor-grabbing",
        "transition-all duration-200 ease-out",
        "bg-card border-border/60",
        "hover:shadow-md hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-0.5",
        "group",
        !isOverlay && onTaskClick && "cursor-pointer",
        isOverlay &&
          "shadow-2xl shadow-primary/20 rotate-1 scale-105 border-primary/40 bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-3.5 rounded-md bg-gradient-to-br from-primary/40 to-primary/20 shadow-sm flex-shrink-0" />
          <span className="text-xs font-semibold text-primary tracking-tight truncate">
            {task.id}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground/80 font-medium">
            {task.date}
          </span>
          <GripVertical className="size-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-foreground leading-snug text-sm line-clamp-2">
          {task.title}
        </h3>
        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3 text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground/70 font-medium capitalize">
            {task.status === "in progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface SortableKanbanCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
}

export function SortableKanbanCard({
  task,
  onTaskClick,
}: SortableKanbanCardProps) {
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

  // Track if we actually dragged (not just clicked)
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
    // Only trigger if we didn't drag and we're not currently dragging
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
        <KanbanCard task={task} onTaskClick={undefined} />
      </div>
    </div>
  );
}
