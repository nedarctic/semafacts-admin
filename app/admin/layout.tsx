import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserRole } from "@/lib/enums/user-role.enum";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.ADMIN) {
        redirect("/admin-login")
    };

    const { user: userData } = session;
    const { name, email } = userData;
    const avatar = name?.split(" ").map(name => name[0]).reduce((prev, current) => {
        return prev = prev + current;
    }, '');

    const user = {
        name,
        email,
        avatar
    } as {
        name: string;
        email: string;
        avatar: string;
    };

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
                    <div className="pl-2 pr-2 md:pr-8 py-6">{children}</div>
                </TooltipProvider>
            </SidebarInset>
        </SidebarProvider>
    )
}