"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  GitPullRequest,
  Users,
  Sparkles,
  Wand2,
  Paperclip,
  Send,
  Bot,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const suggestions = [
  { icon: Search, label: "Analyze latest changes" },
  { icon: GitPullRequest, label: "Review the latest PR" },
  { icon: Users, label: "Analyze git contributions" },
  { icon: Sparkles, label: "Review task statuses" },
  { icon: Wand2, label: "Deslop the latest changes" },
];

export function ChatPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Carter</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7">
            <Search className="size-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7">
            <Menu className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <Separator />

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <Bot className="size-8 text-muted-foreground" />
          </div>

          <h2 className="mb-8 text-xl font-semibold text-foreground">
            What should we do today?
          </h2>

          <div className="w-full max-w-sm space-y-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-10 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <suggestion.icon className="size-4" />
                <span className="text-sm">{suggestion.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <Separator />
      <div className="p-4">
        <div className="relative">
          <Input
            placeholder="Ask Captain Capy..."
            className="h-12 bg-muted/30 border-muted pr-20 text-sm placeholder:text-muted-foreground"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8">
              <Paperclip className="size-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Send className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
