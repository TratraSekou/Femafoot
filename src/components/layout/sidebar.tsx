"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Shield,
  Users,
  CalendarDays,
  Trophy,
  ListOrdered,
  Newspaper,
  FileText,
  Settings,
  Activity,
  Store,
  Ticket
} from "lucide-react"

// Let's replace Whistle with Activity or UserCog for referees
// Actually "Cctv" or "UserCheck" could work for Referees. Let's use UserCheck.

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clubs", href: "/dashboard/clubs", icon: Shield },
  { name: "Joueurs", href: "/dashboard/joueurs", icon: Users },
  { name: "Matchs", href: "/dashboard/matchs", icon: CalendarDays },
  { name: "Compétitions", href: "/dashboard/competitions", icon: Trophy },
  { name: "Classements", href: "/dashboard/classements", icon: ListOrdered },
  { name: "Actualités", href: "/dashboard/actualites", icon: Newspaper },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Boutique", href: "/dashboard/boutique", icon: Store },
  { name: "Billetterie", href: "/dashboard/billetterie", icon: Ticket },
  { name: "Paramètres", href: "/dashboard/parametres", icon: Settings },
]

interface SidebarProps {
  onLinkClick?: () => void;
}

export function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-white/5 overflow-hidden [&::-webkit-scrollbar]:hidden">
      <div className="flex min-h-[5rem] items-center px-6 py-4 shrink-0">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-primary">
          <div className="relative h-14 w-12 shrink-0">
            <Image 
              src="/images/logo.png" 
              alt="Logo FemaFoot" 
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="leading-tight">FemaFoot</span>
        </div>
      </div>
      <div className="flex-1 py-4 overflow-hidden flex flex-col">
        <nav className="space-y-1.5 px-3 w-full">
          {navigation.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === item.href 
              : pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out",
                  isActive
                    ? "bg-white/5 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                onClick={onLinkClick}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-1 bg-primary rounded-r-full shadow-[0_0_15px_rgba(203,160,65,0.8)]" />
                )}
                <Icon className={cn("h-[18px] w-[18px] transition-colors", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 shrink-0">
        <div className="rounded-xl bg-gradient-to-br from-white/5 to-transparent p-4 border border-white/5 hover:border-white/10 transition-colors">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Saison 2026-2027</p>
          <p className="text-sm font-semibold text-slate-200">Championnat National</p>
        </div>
      </div>
    </div>
  )
}
