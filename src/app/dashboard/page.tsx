"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Shield, Activity, Store, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface HomeStats {
  clubsCount: number;
  boutiqueRevenue: number;
  matchsCount: number;
  ticketsCount: number;
  competitionsCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<HomeStats>({
    clubsCount: 0,
    boutiqueRevenue: 0,
    matchsCount: 0,
    ticketsCount: 0,
    competitionsCount: 0
  })
  const [recentMatches, setRecentMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)
        
        // 1. Clubs Count
        const { count: clubCount, error: clubErr } = await supabase
          .from('clubs')
          .select('*', { count: 'exact', head: true })
        if (clubErr) throw clubErr

        // 2. Boutique Revenue
        const { data: dbOrders, error: orderErr } = await supabase
          .from('orders')
          .select('total')
          .eq('status', 'VALIDÉE')
        if (orderErr) throw orderErr
        const boutiqueRevenue = dbOrders ? dbOrders.reduce((sum, o) => sum + Number(o.total), 0) : 0

        // 3. Matchs Count
        const { count: matchCount, error: matchErr } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true })
        if (matchErr) throw matchErr

        // 4. Tickets Count
        const { data: dbTickets, error: ticketErr } = await supabase
          .from('ticket_reservations')
          .select('quantity')
          .eq('status', 'VALIDÉE')
        if (ticketErr) throw ticketErr
        const ticketsCount = dbTickets ? dbTickets.reduce((sum, t) => sum + t.quantity, 0) : 0

        // 5. Recent Matches
        const { data: dbMatches, error: matchesErr } = await supabase
          .from('matches')
          .select(`
            *,
            home_club:clubs!home_club_id(name),
            away_club:clubs!away_club_id(name),
            competition:competitions(name)
          `)
          .order('match_date', { ascending: false })
          .limit(4)
        if (matchesErr) throw matchesErr

        // 6. Competitions Count
        const comps = dbMatches ? new Set(dbMatches.map(m => m.competition?.name || "Ligue 1")).size : 0

        setStats({
          clubsCount: clubCount || 0,
          boutiqueRevenue,
          matchsCount: matchCount || 0,
          ticketsCount: ticketsCount || 0,
          competitionsCount: comps || 2
        })

        if (dbMatches) {
          const mappedMatches = dbMatches.map(m => {
            let statusLabel = "À venir"
            if (m.status === "En cours") statusLabel = "En cours"
            if (m.status === "Terminé") statusLabel = "Terminé"
            
            const timeDiff = new Date(m.match_date).getTime() - new Date().getTime()
            let timeLabel = "À venir"
            if (m.status === "Terminé") timeLabel = "Terminé"
            else if (m.status === "En cours") timeLabel = "En cours"
            else {
              timeLabel = timeDiff < 86400000 ? "Aujourd'hui" : "Bientôt"
            }

            return {
              s: statusLabel,
              h: m.home_club?.name || "Inconnu",
              a: m.away_club?.name || "Inconnu",
              r: m.status === 'À venir' ? "- - -" : `${m.home_score || 0} - ${m.away_score || 0}`,
              t: timeLabel
            }
          })
          setRecentMatches(mappedMatches)
        }

      } catch (err) {
        console.error("Error loading dashboard stats:", err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Tableau de bord</h1>
        <p className="text-white/70 mt-1 sm:mt-2 text-base sm:text-lg font-medium tracking-wide">
          Bienvenue sur l'interface d'administration de la FemaFoot.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out fill-mode-both delay-100">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading tracking-wide">Clubs Affiliés</CardTitle>
            <Shield className="h-5 w-5 text-primary opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{stats.clubsCount}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                Actifs
              </span>
              <p className="text-xs text-slate-400">dans tout le Mali</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading tracking-wide">Ventes Boutique</CardTitle>
            <Store className="h-5 w-5 text-primary opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{(stats.boutiqueRevenue / 1000).toFixed(0)}k FCFA</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                +15%
              </span>
              <p className="text-xs text-slate-400">ce mois-ci</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading tracking-wide">Matchs Actifs</CardTitle>
            <Activity className="h-5 w-5 text-primary opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{stats.matchsCount}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10">
                Saison 2026
              </span>
              <p className="text-xs text-slate-400">compétitions de la fédération</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-heading tracking-wide">Billets Validés</CardTitle>
            <Ticket className="h-5 w-5 text-primary opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{stats.ticketsCount}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                Réservés
              </span>
              <p className="text-xs text-slate-400">depuis le lancement</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading tracking-wide">Compétitions</CardTitle>
            <Trophy className="h-5 w-5 text-primary opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{stats.competitionsCount}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                Actif
              </span>
              <p className="text-xs text-slate-400">championnats & coupes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both delay-300">
        <Card className="col-span-4 relative overflow-hidden group/chart">
          <CardHeader>
            <CardTitle className="font-heading tracking-wide z-10 relative">Activité Récente (Revenus)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[350px] w-full relative flex items-end">
              {/* Axes et Grille subtile */}
              <div className="absolute inset-0 flex flex-col justify-between px-6 pt-16 pb-12 pointer-events-none">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full border-b border-white/5" />
                ))}
              </div>
              
              {/* Labels X */}
              <div className="absolute bottom-4 left-6 right-6 flex justify-between text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest z-10">
                <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
              </div>

              {/* Graphique SVG Courbe Premium */}
              <div className="absolute inset-0 w-full h-[85%] bottom-10">
                <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(203, 160, 65, 0.4)" />
                      <stop offset="100%" stopColor="rgba(203, 160, 65, 0.0)" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Area */}
                  <path 
                    d="M 0 280 C 150 250, 250 150, 400 180 S 600 50, 800 120 S 950 40, 1000 60 L 1000 300 L 0 300 Z" 
                    fill="url(#chartGradient)" 
                    className="opacity-60 transition-opacity duration-700 group-hover/chart:opacity-100"
                  />
                  
                  {/* Ligne */}
                  <path 
                    d="M 0 280 C 150 250, 250 150, 400 180 S 600 50, 800 120 S 950 40, 1000 60" 
                    fill="none" 
                    stroke="#cba041" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="opacity-80 transition-all duration-700 group-hover/chart:opacity-100 group-hover/chart:stroke-[5px]"
                  />
                  
                  {/* Points interactifs */}
                  {[
                    { x: 150, y: 250, v: "1.2M" }, { x: 400, y: 180, v: "2.4M" }, 
                    { x: 600, y: 80, v: "3.8M" }, { x: 800, y: 120, v: "3.1M" }, 
                    { x: 950, y: 45, v: "4.5M" }
                  ].map((p, i) => (
                    <g key={i} className="group/point">
                      <circle cx={p.x} cy={p.y} r="6" fill="#132a22" stroke="#cba041" strokeWidth="3" className="transition-all duration-300 hover:r-[8px] hover:fill-[#cba041] cursor-pointer" />
                      {/* Tooltip SVG */}
                      <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <rect x={p.x - 30} y={p.y - 45} width="60" height="28" rx="6" fill="#0f1c1a" stroke="rgba(255,255,255,0.1)" />
                        <text x={p.x} y={p.y - 26} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" fontFamily="Inter">{p.v}</text>
                      </g>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="font-heading tracking-wide">Derniers Matchs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMatches.length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-bold uppercase text-xs">
                  Aucun match récent enregistré
                </div>
              ) : (
                recentMatches.map((match, i) => (
                  <div key={i} className="group relative flex items-center justify-between rounded-xl bg-white/5 p-3 sm:p-4 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex flex-col flex-1 items-end">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[60px] sm:max-w-none">{match.h}</span>
                        <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-white/10">
                          {match.h.charAt(0)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center px-4 flex-shrink-0">
                      {match.s === "En cours" && <span className="absolute top-2 right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>}
                      <span className={cn(
                        "text-sm font-black px-3 py-1 rounded shadow-sm tracking-widest",
                        match.s === "Terminé" ? "bg-white/10 text-white" : 
                        match.s === "En cours" ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30" : "text-slate-400"
                      )}>
                        {match.r}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{match.t}</span>
                    </div>
                    
                    <div className="flex flex-col flex-1 items-start">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="h-6 w-6 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-white/10">
                          {match.a.charAt(0)}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[60px] sm:max-w-none">{match.a}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
