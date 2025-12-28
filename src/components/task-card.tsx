import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Trash2, Bot } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  model: string;
  status: "completed" | "active";
}

export function TaskCard({
  id,
  title,
  description,
  date,
  model,
  status,
}: TaskCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-primary/20" />
          <span className="text-sm font-medium text-primary">{id}</span>
        </div>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="gap-1.5 bg-muted/50 text-muted-foreground font-normal"
        >
          <Bot className="size-3" />
          {model}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground capitalize">
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-7 px-3 text-xs font-medium"
          >
            Reopen
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
