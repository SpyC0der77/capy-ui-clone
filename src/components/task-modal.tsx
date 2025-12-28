"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Task } from "./kanban-board";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSave: (task: Omit<Task, "id"> & { id?: string }) => void;
}

export function TaskModal({
  open,
  onOpenChange,
  task,
  onSave,
}: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    status: "active" as "active" | "completed",
  });

  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        date: task.date,
        status: task.status,
      });
    } else {
      // Reset form for new task
      const today = new Date();
      const month = today.toLocaleString("default", { month: "short" });
      const day = today.getDate();
      setFormData({
        title: "",
        description: "",
        date: `${month} ${day}`,
        status: "active",
      });
    }
  }, [task, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...formData,
      id: task?.id,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl">
              {isEditMode ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {isEditMode
                ? "Update the task details below."
                : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-5 space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter task title"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter task description"
                rows={4}
                className="resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder="Dec 17"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "completed") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t gap-3 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-5"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-10 px-5">
              {isEditMode ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

