"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface Settings {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  viewMode: "kanban" | "list";
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => void;
}

const defaultSettings: Settings = {
  theme: "dark",
  sidebarOpen: true,
  viewMode: "kanban",
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const STORAGE_KEY = "app-settings";

function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
  
  return defaultSettings;
}

function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme, setTheme, resolvedTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load settings from localStorage after mount to avoid hydration mismatch
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    setMounted(true);
    // Sync theme with next-themes on mount
    if (loadedSettings.theme !== "system") {
      setTheme(loadedSettings.theme);
    }
  }, [setTheme]);

  useEffect(() => {
    if (!mounted) return;
    
    // Sync theme changes from settings to next-themes
    if (settings.theme !== "system" && currentTheme !== settings.theme) {
      setTheme(settings.theme);
    } else if (settings.theme === "system") {
      setTheme("system");
    }
  }, [settings.theme, currentTheme, setTheme, mounted]);

  function updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      saveSettings(updated);
      return updated;
    });
  }

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

