import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/contexts/settings-context";
import { TasksProvider } from "@/contexts/tasks-context";
import { NotificationsProvider } from "@/contexts/notifications-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scratchpad",
  description: "AI-powered task management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsProvider>
            <TasksProvider>
              <NotificationsProvider>
                {children}
                <Toaster />
              </NotificationsProvider>
            </TasksProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
