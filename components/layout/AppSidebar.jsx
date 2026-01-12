"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
  SidebarRail, // Added for better UX
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import sidebarData from "@/lib/sidebar";
import { useAuth } from "@/lib/AuthContext";

export function AppSidebar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return <SidebarSkeleton />;
  if (!user) return null;

  const filteredItems = sidebarData.filter((item) =>
    item.role.includes(user.role)
  );

  return (
    <Sidebar collapsible="icon" className="border-r transition-all duration-300 ease-in-out">
      {/* 🔝 HEADER */}
      <SidebarHeader className="flex flex-row items-center justify-between p-4 h-16 border-b">
        <div className="flex items-center gap-2 overflow-hidden transition-all duration-300">
          <span className="font-semibold tracking-tight text-lg whitespace-nowrap opacity-100 transition-[width,opacity] duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:overflow-hidden">
            Smart Inventory
          </span>
        </div>
        
        <SidebarTrigger className="shrink-0" />
      </SidebarHeader>

      <SidebarSeparator />

      {/* 📚 MENU */}
      <SidebarContent className="px-2">
        <SidebarMenu className="gap-1">
          {filteredItems.map((item) => {
            const Icon = item.icon; 
            return (
              <SidebarMenuItem key={item.href}>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.name}
                        className="h-10 transition-colors"
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className="h-5 w-5 shrink-0" />
                          
                          
                          <span className="whitespace-nowrap overflow-hidden transition-[width,opacity] duration-300 ease-in-out opacity-100 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:h-0">
                            {item.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="hidden group-data-[collapsible=icon]:block">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />
      
      <SidebarRail />
    </Sidebar>
  );
}

function SidebarSkeleton() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="h-16 px-4 flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-6 w-28" />
      </SidebarHeader>

      <SidebarContent className="px-2 space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </SidebarContent>

      <SidebarFooter className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-12" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
