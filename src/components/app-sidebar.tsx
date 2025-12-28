"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Search,
  ListTodo,
  Settings,
  Sparkles,
  Copy,
  ChevronDown,
  Check,
  LogOut,
  User,
} from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const workspaces = [
  {
    value: "scratchpad",
    label: "Scratchpad",
    icon: Sparkles,
  },
  {
    value: "project-alpha",
    label: "Project Alpha",
    icon: Sparkles,
  },
  {
    value: "project-beta",
    label: "Project Beta",
    icon: Sparkles,
  },
];

const userMenuItems = [
  {
    value: "profile",
    label: "Profile",
    icon: User,
  },
  {
    value: "settings",
    label: "Settings",
    icon: Settings,
  },
  {
    value: "logout",
    label: "Log out",
    icon: LogOut,
  },
];

export function AppSidebar() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("scratchpad");

  const selectedWorkspaceData = workspaces.find(
    (w) => w.value === selectedWorkspace
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <Popover open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity group-data-[collapsible=icon]:gap-0">
                <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-purple-600">
                  {selectedWorkspaceData && (
                    <selectedWorkspaceData.icon className="size-4 text-white" />
                  )}
                </div>
                <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  {selectedWorkspaceData?.label || "Scratchpad"}
                </span>
                <ChevronDown className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search workspace..." />
                <CommandList>
                  <CommandEmpty>No workspace found.</CommandEmpty>
                  <CommandGroup>
                    {workspaces.map((workspace) => (
                      <CommandItem
                        key={workspace.value}
                        value={workspace.value}
                        onSelect={() => {
                          setSelectedWorkspace(workspace.value);
                          setWorkspaceOpen(false);
                        }}
                      >
                        <workspace.icon className="size-4" />
                        <span>{workspace.label}</span>
                        <Check
                          className={cn(
                            "ml-auto size-4",
                            selectedWorkspace === workspace.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
            <Button variant="ghost" size="icon" className="size-7">
              <Settings className="size-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="size-7">
              <Copy className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-4 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0">
          <div className="relative group-data-[collapsible=icon]:hidden">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks and threads"
              className="h-9 bg-sidebar-accent/50 border-0 pl-9 pr-12 text-sm placeholder:text-muted-foreground"
            />
            <Kbd className="absolute right-2 top-1/2 -translate-y-1/2">⌘K</Kbd>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="gap-3">
                  <ListTodo className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Tasks
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
        <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center gap-3 hover:opacity-80 transition-opacity group-data-[collapsible=icon]:justify-center">
              <div className="relative">
                <Avatar className="size-8 bg-cyan-600">
                  <AvatarFallback className="bg-cyan-600 text-white text-sm font-medium">
                    C
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-sidebar bg-green-500" />
              </div>
              <span className="text-sm font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                Carter
              </span>
              <ChevronDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="end" side="top">
            <Command>
              <CommandList>
                <CommandGroup>
                  {userMenuItems.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => {
                        setUserMenuOpen(false);
                        // Handle menu item selection here
                      }}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
}
