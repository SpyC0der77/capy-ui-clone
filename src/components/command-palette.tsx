"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  ListTodo,
  Settings,
  Search,
  Plus,
  LayoutGrid,
  List,
  Moon,
  Sun,
  Monitor,
  Home,
  FileText,
} from "lucide-react";
import { useSettings } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "active" | "completed";
}

interface CommandPaletteProps {
  tasks?: Task[];
  onCreateTask?: () => void;
  onNavigateToTask?: (taskId: string) => void;
}

export function CommandPalette({
  tasks = [],
  onCreateTask,
  onNavigateToTask,
}: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const { settings, updateSetting } = useSettings();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  return (
    <div>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50",
          open ? "block" : "hidden"
        )}
        onClick={() => setOpen(false)}
      />
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-[640px] translate-x-[-50%] translate-y-[-50%] rounded-xl border border-border bg-popover shadow-2xl"
      >
      <div className="flex items-center border-b border-border px-3">
        <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Type a command or search..."
          className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
          No results found.
        </Command.Empty>

        {!search && (
          <>
            <Command.Group heading="Navigation" className="mb-2">
              <CommandGroupHeading>Navigation</CommandGroupHeading>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/"))}
                className={commandItemClassName}
              >
                <Home className="mr-2 size-4" />
                <span>Home</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/"))}
                className={commandItemClassName}
              >
                <ListTodo className="mr-2 size-4" />
                <span>Tasks</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/settings"))}
                className={commandItemClassName}
              >
                <Settings className="mr-2 size-4" />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-border" />

            <Command.Group heading="Actions" className="mb-2">
              <CommandGroupHeading>Actions</CommandGroupHeading>
              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    if (onCreateTask) {
                      onCreateTask();
                    }
                  })
                }
                className={commandItemClassName}
              >
                <Plus className="mr-2 size-4" />
                <span>Create Task</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-border" />

            <Command.Group heading="View" className="mb-2">
              <CommandGroupHeading>View</CommandGroupHeading>
              <Command.Item
                onSelect={() =>
                  runCommand(() => updateSetting("viewMode", "kanban"))
                }
                className={commandItemClassName}
              >
                <LayoutGrid className="mr-2 size-4" />
                <span>Kanban View</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() => updateSetting("viewMode", "list"))
                }
                className={commandItemClassName}
              >
                <List className="mr-2 size-4" />
                <span>List View</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-border" />

            <Command.Group heading="Theme" className="mb-2">
              <CommandGroupHeading>Theme</CommandGroupHeading>
              <Command.Item
                onSelect={() => runCommand(() => updateSetting("theme", "light"))}
                className={commandItemClassName}
              >
                <Sun className="mr-2 size-4" />
                <span>Light Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => updateSetting("theme", "dark"))}
                className={commandItemClassName}
              >
                <Moon className="mr-2 size-4" />
                <span>Dark Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() => updateSetting("theme", "system"))
                }
                className={commandItemClassName}
              >
                <Monitor className="mr-2 size-4" />
                <span>System Theme</span>
              </Command.Item>
            </Command.Group>
          </>
        )}

        {tasks.length > 0 && (
          <>
            <Command.Separator className="my-2 h-px bg-border" />
            <Command.Group heading="Tasks" className="mb-2">
              <CommandGroupHeading>Tasks</CommandGroupHeading>
              {tasks.slice(0, 10).map((task) => (
                <Command.Item
                  key={task.id}
                  value={`${task.id} ${task.title} ${task.description}`}
                  onSelect={() =>
                    runCommand(() => {
                      if (onNavigateToTask) {
                        onNavigateToTask(task.id);
                      }
                    })
                  }
                  className={commandItemClassName}
                >
                  <FileText className="mr-2 size-4" />
                  <div className="flex flex-col gap-0.5">
                    <span>{task.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {task.id} • {task.date}
                    </span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </>
        )}
      </Command.List>

      <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Navigate with arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </Command.Dialog>
    </div>
  );
}

function CommandGroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {children}
    </div>
  );
}

function CommandShortcut({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto text-xs tracking-widest text-muted-foreground">
      {children}
    </span>
  );
}

const commandItemClassName = cn(
  "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none",
  "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  "transition-colors"
);
