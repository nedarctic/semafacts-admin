import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "JD"
    }
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar user={user} variant="floating" />
            <SidebarInset>
                <TooltipProvider>
                    <div className="p-4">{children}</div>
                </TooltipProvider>
            </SidebarInset>
        </SidebarProvider>
    )
}