'use client'

import {
    FileIcon,
    LifeBuoy,
    ListIcon,
    MessageSquareIcon
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReporterLogoutDialog } from "./reporter-logout-dialog";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "./ui/sidebar";

export function ReporterPortalSidebar () {

    const pathname = usePathname();
    const router = useRouter();

    const isActive = (url: string) => {
        
        if(pathname === url) {
            return true;
        }
        if (pathname.startsWith(url) && url !== "/reporter/track"){
            return true;
        }
        return false;
    };

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                Reporter Portal
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => router.push("/reporter/track/")} 
                            className={`${isActive("/reporter/track") ? "bg-black text-white" : "text-black"} text-md`}><ListIcon size={16} />Incident</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => router.push("/reporter/track/messages")} 
                                className={`${isActive("/reporter/track/messages") ? "bg-black text-white" : "text-black"} text-md`}><MessageSquareIcon size={16} /> Messages</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => router.push("/reporter/track/attachments")}
                                className={`${isActive("/reporter/track/attachments") ? "bg-black text-white" : "text-black"} text-md`}><FileIcon size={16} />Attachments</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => router.push("/reporter/track/support")}
                                className={`${isActive("/reporter/track/support") ? "bg-black text-white" : "text-black"} text-md`}><LifeBuoy size={16} />Support</SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ReporterLogoutDialog />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}