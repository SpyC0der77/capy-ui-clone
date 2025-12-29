"use client";

import { useDroppable } from "@dnd-kit/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  accentColor: string;
  children: React.ReactNode;
}

export function KanbanColumn({
  id,
  title,
  count,
  accentColor,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      className={cn(
        "flex flex-col min-w-[340px] w-[340px] h-full rounded-xl",
        "bg-card dark:bg-[#282828] border border-border/50",
        "transition-all duration-300 ease-out",
        "shadow-sm hover:shadow-md",
        isOver &&
          "ring-2 ring-primary/50 ring-offset-2 ring-offset-background bg-primary/5 border-primary/30 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border/50 bg-card/50 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <div className={cn("size-2.5 rounded-full shadow-sm", accentColor)} />
          <h3 className="font-semibold text-sm text-foreground tracking-tight">
            {title}
          </h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-md min-w-[24px] text-center border border-border/50">
          {count}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className={cn(
            "flex flex-col gap-3 p-3 min-h-[200px] transition-all duration-300",
            isOver && "bg-primary/5",
            count === 0 && "items-center justify-center py-12"
          )}
        >
          {count === 0 ? (
            <div className="text-center space-y-1.5">
              <div className="text-muted-foreground/40 text-sm font-medium">
                No tasks
              </div>
              <div className="text-muted-foreground/30 text-xs">
                Drop tasks here
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
