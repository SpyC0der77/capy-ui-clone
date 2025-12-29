"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { PageLayout } from "@/components/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettings } from "@/contexts/settings-context";
import { Settings, Palette, LayoutGrid, List, Info, SplitSquareHorizontal, Square } from "lucide-react";
import { toast } from "sonner";

function SettingsMain() {
  const { settings, updateSetting } = useSettings();

  return (
    <>
      <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Settings className="size-5" />
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 space-y-6">
          <Separator />
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="size-5" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sidebar-default">Sidebar Default State</Label>
                    <p className="text-sm text-muted-foreground">
                      Whether the sidebar is open by default
                    </p>
                  </div>
                  <Switch
                    id="sidebar-default"
                    checked={settings.sidebarOpen}
                    onCheckedChange={(checked) => {
                      updateSetting("sidebarOpen", checked);
                      toast.success(
                        checked
                          ? "Sidebar will open by default"
                          : "Sidebar will be closed by default"
                      );
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: "light" | "dark" | "system") => {
                      updateSetting("theme", value);
                      toast.success(`Theme changed to ${value}`);
                    }}
                  >
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="view-mode">Default View Mode</Label>
                  <Select
                    value={settings.viewMode}
                    onValueChange={(value: "kanban" | "list") => {
                      updateSetting("viewMode", value);
                      toast.success(`Default view changed to ${value}`);
                    }}
                  >
                    <SelectTrigger id="view-mode" className="w-full">
                      <SelectValue placeholder="Select view mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kanban">
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="size-4" />
                          Kanban Board
                        </div>
                      </SelectItem>
                      <SelectItem value="list">
                        <div className="flex items-center gap-2">
                          <List className="size-4" />
                          List View
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your default task view mode
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="layout-style">Layout Style</Label>
                  <Select
                    value={settings.layoutStyle}
                    onValueChange={(value: "split" | "connected") => {
                      updateSetting("layoutStyle", value);
                      toast.success(`Layout changed to ${value}`);
                    }}
                  >
                    <SelectTrigger id="layout-style" className="w-full">
                      <SelectValue placeholder="Select layout style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="split">
                        <div className="flex items-center gap-2">
                          <SplitSquareHorizontal className="size-4" />
                          Split
                        </div>
                      </SelectItem>
                      <SelectItem value="connected">
                        <div className="flex items-center gap-2">
                          <Square className="size-4" />
                          Connected
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose how task and chat panels are displayed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}

function SettingsSide() {
  return (
    <>
      <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
        <Info className="size-5" />
        <h2 className="text-sm font-semibold">Settings Info</h2>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6 space-y-4">
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-1">Theme</h3>
            <p>
              Choose between light, dark, or system theme. System theme will
              automatically match your device preferences.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Sidebar</h3>
            <p>
              Control whether the sidebar is open or closed by default when you
              load the app.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">View Mode</h3>
            <p>
              Set your preferred default view for tasks. Choose between kanban
              board or list view.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Layout Style</h3>
            <p>
              Split shows task and chat panels as separate cards. Connected
              joins them into a single unified panel.
            </p>
          </div>
        </div>
        </div>
      </ScrollArea>
    </>
  );
}

export default function SettingsPage() {
  return (
    <PageLayout
      mainContent={<SettingsMain />}
      sideContent={<SettingsSide />}
    />
  );
}
