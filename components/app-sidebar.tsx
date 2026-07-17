"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { FileTextIcon, LayoutDashboardIcon, ListIcon, SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const data = {


  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Incidents",
      url: "/admin/incidents",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: "Team",
      url: "/admin/team",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Reporting Page",
      url: "/admin/reporting",
      icon: (
        <FileTextIcon
        />
      ),
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: (
        <SettingsIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ user, ...props }: { user: { name: string; email: string; avatar: string; } } & React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <SidebarMenuButton>
              <p className="font-semibold text-black text-md">SF</p>
              <span>Admin Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}