"use client"

import * as React from "react"
import { Menu, Search, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/context/AuthContext"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth()

  const email = user?.email || "admin@femafoot.ml"
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Administrateur"
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : "FF"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-sidebar/80 backdrop-blur-xl px-4 shadow-sm sm:px-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          render={<Button variant="outline" size="icon" className="shrink-0 md:hidden border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-transform"><Menu className="h-5 w-5" /><span className="sr-only">Ouvrir le menu</span></Button>}
        />
        <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-r border-white/10">
          <Sidebar onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center justify-end md:justify-between gap-4 md:ml-auto md:w-auto">
        {/* Search Command Palette Mock */}
        { /*<div className="flex-1 md:w-80 relative group hidden md:block">
          <button suppressHydrationWarning className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50">
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Rechercher (clubs, matchs...)
            </span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-slate-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>*/}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative rounded-full text-slate-400 hover:text-white hover:bg-white/5">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive shadow-[0_0_8px_rgba(227,0,15,0.6)]" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all active:scale-95" />}>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/images/logo.png" />
              <AvatarFallback className="bg-primary text-primary-foreground font-black">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-2xl border border-white/10 bg-sidebar/95 backdrop-blur-xl p-1.5 shadow-2xl">
            <DropdownMenuLabel className="px-2.5 py-2 flex flex-col">
              <span className="text-sm font-black text-white leading-none mb-1">{fullName}</span>
              <span className="text-[10px] font-semibold text-slate-400 truncate tracking-wide">{email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5 my-1" />
            <DropdownMenuItem className="px-2.5 py-2 text-slate-300 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5">
              Profil Administrateur
            </DropdownMenuItem>
            <DropdownMenuItem className="px-2.5 py-2 text-slate-300 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5">
              Paramètres Système
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5 my-1" />
            <DropdownMenuItem 
              onClick={logout}
              className="px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer rounded-lg font-bold"
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
