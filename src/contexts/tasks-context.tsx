"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Task } from "@/components/kanban-board";

interface TasksContextType {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: "SCO-001",
    title: "Clone UI with Next.js and ShadCN",
    description: "Clone this UI in Next.js using ShadCN/ui.",
    date: "Dec 17",
    status: "done",
  },
  {
    id: "SCO-002",
    title: "Implement authentication flow",
    description: "Add OAuth and email/password authentication.",
    date: "Dec 20",
    status: "in progress",
  },
  {
    id: "SCO-003",
    title: "Build API endpoints",
    description: "Create REST API for task management.",
    date: "Dec 22",
    status: "todo",
  },
  {
    id: "SCO-004",
    title: "Design database schema",
    description: "PostgreSQL schema for users and tasks.",
    date: "Dec 15",
    status: "done",
  },
];

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}

