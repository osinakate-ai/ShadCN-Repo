"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"

/**
 * DESIGNER NOTE: Wise-style top header
 * — Left: sidebar trigger + WISE logo. Right: Earn CTA + user profile (avatar, name, dropdown).
 * — Restyle: edit button variants, avatar size, or add --wise-* CSS variables in globals.css.
 */
export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      {/* DESIGNER: Replace with your logo asset or SVG; Wise uses green "WISE" wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">WISE</span>
      </div>
      <div className="flex flex-1" />
      <div className="flex items-center gap-2">
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Earn €90
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src="" alt="Carolina Fernandes" />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  CF
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline-block">
                Carolina Fernandes
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="font-normal">Account</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
