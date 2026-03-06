"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import {
  Home,
  CreditCard,
  List,
  ArrowLeftRight,
  Users,
  BarChart3,
  Bell,
  Wallet,
  TrendingUp,
  ChevronDown,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

/**
 * DESIGNER NOTE: Wise-style app sidebar (left navigation)
 * — Home, Cards, Transactions, Payments, Recipients, Insights (with submenu: Rate alerts, Spending insights, Market overview).
 * — To restyle: edit className on Sidebar, or override --sidebar-* in globals.css
 */
export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      gapClassName=""
      className="top-16 h-[calc(100vh-4rem)]"
    >
      <SidebarHeader className="flex h-14 items-center justify-center px-4 pt-0 pb-10 text-brand-green-700">
        <Logo className="h-6 w-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/" className="flex items-center gap-3">
                    <Home className="size-6" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href="/" className="flex items-center gap-3">
                    <CreditCard className="size-6" />
                    <span>Cards</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href="/" className="flex items-center gap-3">
                    <List className="size-6" />
                    <span>Transactions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href="/" className="flex items-center gap-3">
                    <ArrowLeftRight className="size-6" />
                    <span>Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href="/" className="flex items-center gap-3">
                    <Users className="size-6" />
                    <span>Recipients</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible
                asChild
                defaultOpen={pathname?.startsWith("/insights") ?? false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={pathname?.startsWith("/insights") ?? false}
                      className="flex items-center gap-3"
                      data-insights-trigger="true"
                    >
                      <BarChart3 className="size-6" />
                      <span>Insights</span>
                      <ChevronDown className="insights-chevron ml-auto shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/insights"}>
                          <Link href="/insights" className="flex items-center gap-2" data-submenu="rate-alerts">
                            <Bell className="size-4 shrink-0" aria-hidden />
                            <span>Rate alerts</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/insights/spending"}>
                          <Link href="/insights/spending" className="flex items-center gap-2" data-submenu="spending">
                            <Wallet className="size-4 shrink-0" aria-hidden />
                            <span>Spending insights</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/insights/market"}>
                          <Link href="/insights/market" className="flex items-center gap-2" data-submenu="market">
                            <TrendingUp className="size-4 shrink-0" aria-hidden />
                            <span>Market overview</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
