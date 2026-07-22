import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PortalSidebar } from "@/components/portal-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserRole } from "@/lib/enums/user-role.enum";
import { FileIcon, LifeBuoy, ListIcon, MessageSquareIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ReporterLayout({ children }: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.REPORTER) {
        redirect("/reporter-login")
    }

    const links = [
        { label: "Incident", url: "/reporter/track", icon: <ListIcon size={16} /> },
        { label: "Messages", url: "/reporter/track/messages", icon: <MessageSquareIcon size={16} /> },
        { label: "Attachments", url: "/reporter/track/attachments", icon: <FileIcon size={16} /> },
        { label: "Support", url: "/reporter/track/support", icon: <LifeBuoy size={16} /> },
    ];

    return (
        <SidebarProvider >
            <PortalSidebar owner={"Reporter"} links={links} />
            <SidebarInset>
                <TooltipProvider>
                    {children}
                    <Toaster richColors position="top-right" />
                </TooltipProvider>
            </SidebarInset>
        </SidebarProvider>);
}