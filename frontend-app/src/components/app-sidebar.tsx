"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePatients } from "@/data/use-patients";
import { Skeleton } from "./ui/skeleton";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Intake Patient",
          url: "/intake",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: patients, isLoading } = usePatients();
  console.log(pathname);
  return (
    <Sidebar {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Your Clients</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <SidebarMenuItem key={`skeleton-${i}`}>
                      <Skeleton className="w-[full] h-[20px] rounded-md" />
                    </SidebarMenuItem>
                  ))}
                </>
              )}
              {patients?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(`/patients/${item.id}/`)}
                  >
                    <a href={`/patients/${item.id}/profile`}>{item.name}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
