"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/header";

export default function AppLayout({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 md:hidden">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex-1" />
          <Header />
        </header>

        <main className="flex-1 p-6 bg-muted/40 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}