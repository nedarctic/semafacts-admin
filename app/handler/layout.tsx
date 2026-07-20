import { PortalSidebar } from "@/components/portal-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserRole } from "@/lib/enums/user-role.enum";
import { BellIcon, ListIcon, SettingsIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HandlerPortalLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.HANDLER) {
        redirect("/handler-login");
    }

    const links = [
        { label: "Incidents", url: "/handler", icon: <ListIcon size={16} /> },
        { label: "Notifications", url: "/handler/notifications", icon: <BellIcon size={16} /> },
        { label: "Settings", url: "/handler/settings", icon: <SettingsIcon size={16} /> },
    ];

    return (
        <SidebarProvider >
            <PortalSidebar owner={"Handler"} links={links} />
            <SidebarInset>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </SidebarInset>
        </SidebarProvider>);
}