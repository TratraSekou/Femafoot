"use client"

import React from "react"
import { motion } from "framer-motion"
import { Trophy, ChevronRight } from "lucide-react"

type Competition = {
  id: number
  name: string
  season: string
  type: string
  logo_url: string | null
}

type Standing = {
  id: number
  club: { name: string, short: string }
  points: number
  played: number
  goal_difference: number
}

interface CompetitionsStandingsProps {
  competitions: Competition[]
  standings: Standing[]
}

export function CompetitionsStandings({ competitions, standings }: CompetitionsStandingsProps) {
  // Mocks if empty
  const displayComps = competitions.length > 0 ? competitions : [
    { id: 1, name: "Ligue 1 Orange", season: "2023-2024", type: "Championnat", logo_url: null },
    { id: 2, name: "Coupe du Mali", season: "2023-2024", type: "Coupe", logo_url: null },
    { id: 3, name: "Ligue 2", season: "2023-2024", type: "Championnat", logo_url: null },
  ]

  const displayStandings = standings.length > 0 ? standings : [
    { id: 1, club: { name: "Djoliba AC", short: "DJB" }, points: 45, played: 18, goal_difference: +15 },
    { id: 2, club: { name: "Stade Malien", short: "SMA" }, points: 42, played: 18, goal_difference: +12 },
    { id: 3, club: { name: "AS Real", short: "ASR" }, points: 38, played: 18, goal_difference: +8 },
    { id: 4, club: { name: "USFAS", short: "USF" }, points: 31, played: 18, goal_difference: +2 },
    { id: 5, club: { name: "Onze Créateurs", short: "ONZ" }, points: 29, played: 18, goal_difference: -1 },
  ]

  return (
    <section id="competitions" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute -left-64 top-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Competitions Column */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-green-500 rounded-full" />
                Compétitions
              </h2>
              <p className="text-slate-400 mt-2 font-medium">Découvrez les tournois majeurs de la fédération.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayComps.map((comp, i) => (
                <motion.div 
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-green-500/30 rounded-2xl p-6 transition-all group cursor-pointer flex flex-col items-start gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Trophy className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{comp.type} • {comp.season}</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors mt-1">{comp.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Standings Column */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-400 to-transparent" />
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Classement</h3>
                <span className="px-3 py-1 rounded bg-white/5 text-xs font-bold text-slate-300">Ligue 1 Orange</span>
              </div>

              <div className="w-full">
                <div className="grid grid-cols-12 gap-2 pb-3 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5">Club</div>
                  <div className="col-span-2 text-center">J</div>
                  <div className="col-span-2 text-center">Diff</div>
                  <div className="col-span-2 text-center">Pts</div>
                </div>

                <div className="flex flex-col gap-1 mt-3">
                  {displayStandings.map((row, index) => (
                    <div 
                      key={row.id} 
                      className={`grid grid-cols-12 gap-2 items-center py-3 px-2 rounded-xl transition-colors hover:bg-white/5 ${
                        index === 0 ? 'bg-green-500/10 border border-green-500/20' : ''
                      }`}
                    >
                      <div className={`col-span-1 text-center text-xs font-black ${index === 0 ? 'text-green-400' : 'text-slate-400'}`}>
                        {index + 1}
                      </div>
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-[8px] font-black text-slate-300">
                          {row.club.short}
                        </div>
                        <span className={`text-sm font-bold truncate ${index === 0 ? 'text-green-400' : 'text-slate-200'}`}>
                          {row.club.name}
                        </span>
                      </div>
                      <div className="col-span-2 text-center text-xs font-medium text-slate-400">{row.played}</div>
                      <div className="col-span-2 text-center text-xs font-medium text-slate-400">{row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}</div>
                      <div className="col-span-2 text-center text-sm font-black text-white">{row.points}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                Voir tout le classement <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
