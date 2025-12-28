"use client";

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
  Search,
  ListTodo,
  Settings,
  Sparkles,
  Copy,
  ChevronDown,
} from "lucide-react";
import { Kbd } from "@/components/ui/kbd";

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="none" className="border-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-purple-600">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-semibold text-sidebar-foreground">
              Scratchpad
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-7">
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
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
        <SidebarGroup className="px-4 py-2">
          <div className="relative">
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
                  <span>Tasks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-8 bg-cyan-600">
              <AvatarFallback className="bg-cyan-600 text-white text-sm font-medium">
                C
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-sidebar bg-green-500" />
          </div>
          <span className="text-sm font-medium text-sidebar-foreground">
            Carter
          </span>
          <ChevronDown className="ml-auto size-4 text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
