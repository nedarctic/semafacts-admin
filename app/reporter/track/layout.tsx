import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FileIcon, LifeBuoy, ListIcon, LogOutIcon, MessageSquareIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ReporterPortalSidebar } from "@/components/reporter-portal-sidebar";

export default async function ReporterLayout({ children }: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/reporter-login")
    }

    return (
    <SidebarProvider >
        <ReporterPortalSidebar />
        <SidebarInset>
            <TooltipProvider>
                {children}
            </TooltipProvider>
        </SidebarInset>
    </SidebarProvider>);
}