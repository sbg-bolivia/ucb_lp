"use client";

import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 shrink-0  items-center gap-2 border-b border-border bg-background/10 backdrop-blur-md px-3 sm:px-4">
          <SidebarTrigger className="-ml-1 h-8 w-8" />
          <DashboardNavbar />
        </header>
        <div className="flex flex-1 flex-col gap-4 p- pt-0">
          <div className="min-h-[100vh] flex-1 bg-background  p-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
