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
  FileText,
  CircleDot,
  CircleCheck,
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
    <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <ListTodo className="size-4" />
            <span>Tasks</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="size-4" />
            <span>Settings</span>
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
                >
                  {task.status === "active" ? (
                    <CircleDot className="size-4 text-amber-500" />
                  ) : (
                    <CircleCheck className="size-4 text-emerald-500" />
                  )}
                  <div className="flex flex-col">
                    <span>{task.title}</span>
                    <span className="text-xs text-muted-foreground">
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
          >
            <Plus className="size-4" />
            <span>Create New Task</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="View">
          <CommandItem
            onSelect={() =>
              runCommand(() => updateSetting("viewMode", "kanban"))
            }
          >
            <LayoutGrid className="size-4" />
            <span>Board View</span>
            {settings.viewMode === "kanban" && (
              <CommandShortcut>✓</CommandShortcut>
            )}
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => updateSetting("viewMode", "list"))}
          >
            <List className="size-4" />
            <span>List View</span>
            {settings.viewMode === "list" && (
              <CommandShortcut>✓</CommandShortcut>
            )}
          </CommandItem>

          <CommandSeparator className="my-1" />

          <CommandItem
            onSelect={() =>
              runCommand(() => updateSetting("layoutStyle", "split"))
            }
          >
            <Columns2 className="size-4" />
            <span>Split Layout</span>
            {settings.layoutStyle === "split" && (
              <CommandShortcut>✓</CommandShortcut>
            )}
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => updateSetting("layoutStyle", "connected"))
            }
          >
            <Square className="size-4" />
            <span>Connected Layout</span>
            {settings.layoutStyle === "connected" && (
              <CommandShortcut>✓</CommandShortcut>
            )}
          </CommandItem>

          <CommandSeparator className="my-1" />

          <CommandItem
            onSelect={() =>
              runCommand(() =>
                updateSetting("sidebarOpen", !settings.sidebarOpen)
              )
            }
          >
            {settings.sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeft className="size-4" />
            )}
            <span>
              {settings.sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            </span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="size-4" />
            <span>Light Mode</span>
            {theme === "light" && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="size-4" />
            <span>Dark Mode</span>
            {theme === "dark" && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Monitor className="size-4" />
            <span>System Theme</span>
            {theme === "system" && <CommandShortcut>✓</CommandShortcut>}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
