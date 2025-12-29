"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useSettings } from "@/contexts/settings-context";
import { useTasks } from "@/contexts/tasks-context";
import {
  ListTodo,
  Settings,
  Sun,
  Moon,
  Monitor,
  LayoutGrid,
  List,
  Plus,
  PanelLeft,
  PanelLeftClose,
  Columns2,
  Square,
  CircleDot,
  CircleCheck,
  Search,
} from "lucide-react";

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandMenu({
  open: controlledOpen,
  onOpenChange,
}: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { settings, updateSetting } = useSettings();
  const { tasks } = useTasks();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      showCloseButton={false}
      className="sm:max-w-[600px]"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-[500px]">
        <CommandEmpty className="py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-muted p-3">
              <Search className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No results found</p>
            <p className="text-xs text-muted-foreground">
              Try searching for something else
            </p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
            className="gap-3"
          >
            <ListTodo className="size-4 shrink-0" />
            <span className="flex-1">Tasks</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
            className="gap-3"
          >
            <Settings className="size-4 shrink-0" />
            <span className="flex-1">Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {tasks.length > 0 && (
          <>
            <CommandGroup heading="Tasks">
              {tasks.map((task) => (
                <CommandItem
                  key={task.id}
                  value={`${task.id} ${task.title} ${task.description}`}
                  onSelect={() =>
                    runCommand(() => {
                      if (pathname !== "/") {
                        router.push("/");
                        setTimeout(() => {
                          window.dispatchEvent(
                            new CustomEvent("command-menu:edit-task", {
                              detail: { taskId: task.id },
                            })
                          );
                        }, 300);
                      } else {
                        setTimeout(() => {
                          window.dispatchEvent(
                            new CustomEvent("command-menu:edit-task", {
                              detail: { taskId: task.id },
                            })
                          );
                        }, 100);
                      }
                    })
                  }
                  className="gap-3 py-2.5"
                >
                  {task.status === "active" ? (
                    <CircleDot className="size-4 shrink-0 text-amber-500" />
                  ) : (
                    <CircleCheck className="size-4 shrink-0 text-emerald-500" />
                  )}
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span className="truncate font-medium">{task.title}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {task.id} · {task.date}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                if (pathname !== "/") {
                  // Navigate to tasks page first, then open modal after navigation
                  router.push("/");
                  setTimeout(() => {
                    window.dispatchEvent(
                      new CustomEvent("command-menu:create-task")
                    );
                  }, 300);
                } else {
                  setTimeout(() => {
                    window.dispatchEvent(
                      new CustomEvent("command-menu:create-task")
                    );
                  }, 100);
                }
              })
            }
            className="gap-3"
          >
            <Plus className="size-4 shrink-0" />
            <span className="flex-1">Create New Task</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="View">
          <CommandItem
            onSelect={() =>
              runCommand(() => updateSetting("viewMode", "kanban"))
            }
            className="gap-3"
          >
            <LayoutGrid className="size-4 shrink-0" />
            <span className="flex-1">Board View</span>
            {settings.viewMode === "kanban" && (
              <CommandShortcut className="text-primary">✓</CommandShortcut>
            )}
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => updateSetting("viewMode", "list"))}
            className="gap-3"
          >
            <List className="size-4 shrink-0" />
            <span className="flex-1">List View</span>
            {settings.viewMode === "list" && (
              <CommandShortcut className="text-primary">✓</CommandShortcut>
            )}
          </CommandItem>

          <CommandSeparator className="my-1" />

          <CommandItem
            onSelect={() =>
              runCommand(() => updateSetting("layoutStyle", "split"))
            }
            className="gap-3"
          >
            <Columns2 className="size-4 shrink-0" />
            <span className="flex-1">Split Layout</span>
            {settings.layoutStyle === "split" && (
              <CommandShortcut className="text-primary">✓</CommandShortcut>
            )}
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => updateSetting("layoutStyle", "connected"))
            }
            className="gap-3"
          >
            <Square className="size-4 shrink-0" />
            <span className="flex-1">Connected Layout</span>
            {settings.layoutStyle === "connected" && (
              <CommandShortcut className="text-primary">✓</CommandShortcut>
            )}
          </CommandItem>

          <CommandSeparator className="my-1" />

          <CommandItem
            onSelect={() =>
              runCommand(() =>
                updateSetting("sidebarOpen", !settings.sidebarOpen)
              )
            }
            className="gap-3"
          >
            {settings.sidebarOpen ? (
              <PanelLeftClose className="size-4 shrink-0" />
            ) : (
              <PanelLeft className="size-4 shrink-0" />
            )}
            <span className="flex-1">
              {settings.sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            </span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() => runCommand(() => setTheme("light"))}
            className="gap-3"
          >
            <Sun className="size-4 shrink-0" />
            <span className="flex-1">Light Mode</span>
            {theme === "light" && (
              <CommandShortcut className="text-primary">✓</CommandShortcut>
            )}
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => setTheme("dark"))}
            className="gap-3"
          >
            <Moon className="size-4 shrink-0" />
            <span className="flex-1">Dark Mode</span>
            {theme === "dark" && (
              <CommandShortcut className="text-primary">✓</CommandShortcut>
            )}
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => setTheme("system"))}
            className="gap-3"
          >
            <Monitor className="size-4 shrink-0" />
            <span className="flex-1">System Theme</span>
            {theme === "system" && (
              <CommandShortcut className="text-primary">✓</CommandShortcut>
            )}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
