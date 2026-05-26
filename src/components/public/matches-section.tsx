"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Clock, Trophy, ChevronRight } from "lucide-react"

type Club = {
  id: number
  name: string
  short: string
  logo_url: string | null
}

type MatchItem = {
  id: number
  match_date: string
  status: string
  home_score: number | null
  away_score: number | null
  referee: string | null
  home_club: Club
  away_club: Club
  competition: { name: string }
}

interface MatchesSectionProps {
  matches: MatchItem[]
}

export function MatchesSection({ matches }: MatchesSectionProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "results">("upcoming")

  // Fallback to mock data if no matches
  const displayMatches = matches.length > 0 ? matches : [
    {
      id: 1,
      match_date: new Date(Date.now() + 86400000).toISOString(),
      status: "À venir",
      home_score: null,
      away_score: null,
      referee: "M. Traoré",
      home_club: { id: 1, name: "Stade Malien", short: "SMA", logo_url: null },
      away_club: { id: 2, name: "Djoliba AC", short: "DJB", logo_url: null },
      competition: { name: "Ligue 1 Orange" }
    },
    {
      id: 2,
      match_date: new Date(Date.now() - 86400000).toISOString(),
      status: "Terminé",
      home_score: 2,
      away_score: 1,
      referee: "S. Keita",
      home_club: { id: 3, name: "AS Real", short: "ASR", logo_url: null },
      away_club: { id: 4, name: "Onze Créateurs", short: "ONZ", logo_url: null },
      competition: { name: "Coupe du Mali" }
    }
  ]

  const upcomingMatches = displayMatches.filter(m => m.status !== "Terminé").slice(0, 4)
  const results = displayMatches.filter(m => m.status === "Terminé").slice(0, 4)

  const activeMatches = activeTab === "upcoming" ? upcomingMatches : results

  return (
    <section id="matches" className="py-24 bg-slate-900 relative border-t border-white/5">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" />
              Matchs & Résultats
            </h2>
            <p className="text-slate-400 mt-2 font-medium">Ne manquez aucune affiche de nos compétitions.</p>
          </div>
          
          <div className="flex p-1 bg-slate-950/50 rounded-xl border border-white/10 w-fit">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === "upcoming" 
                  ? "bg-green-500 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === "results" 
                  ? "bg-green-500 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Résultats
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {activeMatches.map((match, index) => {
              const date = new Date(match.match_date)
              const dateStr = date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })
              const timeStr = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
              
              return (
                <motion.div
                  key={`${activeTab}-${match.id}`}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-slate-950 border border-white/5 rounded-3xl p-6 hover:border-green-500/30 hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Trophy className="w-4 h-4 text-green-500" />
                      {match.competition.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {dateStr} • {timeStr}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    {/* Home Club */}
                    <div className="flex flex-col items-center gap-3 w-1/3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shadow-lg border border-white/10 group-hover:border-white/20 transition-colors">
                        <span className="font-black text-xl text-slate-300">{match.home_club.short}</span>
                      </div>
                      <span className="font-bold text-white text-sm text-center line-clamp-1">{match.home_club.name}</span>
                    </div>
                    
                    {/* Score / VS */}
                    <div className="flex flex-col items-center justify-center gap-2 w-1/3">
                      {match.status === "Terminé" ? (
                        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-white/5">
                          <span className={`text-3xl font-black ${match.home_score! > match.away_score! ? 'text-green-400' : 'text-white'}`}>{match.home_score}</span>
                          <span className="text-slate-600 font-bold">-</span>
                          <span className={`text-3xl font-black ${match.away_score! > match.home_score! ? 'text-green-400' : 'text-white'}`}>{match.away_score}</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5">
                          <span className="text-xl font-black text-slate-400">VS</span>
                        </div>
                      )}
                      
                      {match.status === "En cours" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-red-500/20 text-red-500 animate-pulse">
                          En direct
                        </span>
                      )}
                    </div>

                    {/* Away Club */}
                    <div className="flex flex-col items-center gap-3 w-1/3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shadow-lg border border-white/10 group-hover:border-white/20 transition-colors">
                        <span className="font-black text-xl text-slate-300">{match.away_club.short}</span>
                      </div>
                      <span className="font-bold text-white text-sm text-center line-clamp-1">{match.away_club.name}</span>
                    </div>
                  </div>

                  {activeTab === "upcoming" && (
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        Stade Officiel
                      </span>
                      <button className="text-xs font-bold uppercase tracking-wider text-green-500 hover:text-green-400 flex items-center gap-1">
                        Billetterie <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {activeMatches.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-medium">
            Aucun match disponible pour le moment.
          </div>
        )}
      </div>
    </section>
  )
}
