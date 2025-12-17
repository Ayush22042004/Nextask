import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { CommandPalette } from "@/components/CommandPalette";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b-2 border-red-500 flex items-center justify-between px-6 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md sticky top-0 z-40 shadow-lg shadow-red-900/20">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8" />
              <div className="hidden sm:block">
                <span className="text-xs font-mono text-yellow-400 tracking-widest">⚡ NEXUS ONLINE ⚡</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CommandPalette />
              <NotificationBell />
            </div>
          </header>
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
