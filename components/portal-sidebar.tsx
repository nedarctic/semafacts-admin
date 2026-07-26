'use client'

import { usePathname, useRouter } from "next/navigation";
import { JSX } from "react/jsx-runtime";
import { LogoutDialog } from "./logout-dialog";
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

export function PortalSidebar({ owner, links }: {
    owner: "Reporter" | "Handler", links: {
        label: string;
        url: string;
        icon: JSX.Element;
    }[]
}) {

    const pathname = usePathname();
    const router = useRouter();

    const urls = links.map(link => link.url);

    const isPathnameStartWithAnotherUrl = (path: string) => {
        const otherUrls = urls.filter(url => url !== path)
        const arr = otherUrls.filter(url => pathname.startsWith(url));
        if(arr.length) return true;
        return false;
    };

    const isActive = (path: string) => {
        if(pathname === path) return true;
        if(pathname.startsWith(path) && !isPathnameStartWithAnotherUrl(path)) return true;
        return false;
    }

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="font-medium">
                {owner === "Reporter" ? "Reporter Portal" : "Handler Portal"}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {links.map((link, index) =>
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton onClick={() => router.push(link.url)}
                                    className={`${isActive(link.url) ? "bg-black text-white" : "text-black"} text-md`}>{link.icon}{link.label}</SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <LogoutDialog owner={owner} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}