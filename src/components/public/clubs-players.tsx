"use client"

import React from "react"
import { motion } from "framer-motion"
import { Shield, Users, ArrowUpRight } from "lucide-react"

type Club = {
  id: number
  name: string
  short: string
  city: string
  logo_url: string | null
}

type Player = {
  id: number
  first_name: string
  last_name: string
  position: string
  club: { name: string, short: string }
  photo_url: string | null
}

interface ClubsPlayersProps {
  clubs: Club[]
  players: Player[]
}

export function ClubsPlayers({ clubs, players }: ClubsPlayersProps) {
  // Mocks if empty
  const displayClubs = clubs.length > 0 ? clubs : [
    { id: 1, name: "Djoliba AC", short: "DJB", city: "Bamako", logo_url: null },
    { id: 2, name: "Stade Malien", short: "SMA", city: "Bamako", logo_url: null },
    { id: 3, name: "AS Real", short: "ASR", city: "Bamako", logo_url: null },
    { id: 4, name: "USFAS", short: "USF", city: "Bamako", logo_url: null },
    { id: 5, name: "Onze Créateurs", short: "ONZ", city: "Bamako", logo_url: null },
    { id: 6, name: "COB", short: "COB", city: "Bamako", logo_url: null },
  ]

  const displayPlayers = players.length > 0 ? players : [
    { id: 1, first_name: "Amadou", last_name: "Haidara", position: "Milieu", club: { name: "Équipe Nationale", short: "MLI" }, photo_url: null },
    { id: 2, first_name: "Yves", last_name: "Bissouma", position: "Milieu", club: { name: "Équipe Nationale", short: "MLI" }, photo_url: null },
    { id: 3, first_name: "Hamari", last_name: "Traoré", position: "Défenseur", club: { name: "Équipe Nationale", short: "MLI" }, photo_url: null },
    { id: 4, first_name: "Kamory", last_name: "Doumbia", position: "Attaquant", club: { name: "Équipe Nationale", short: "MLI" }, photo_url: null },
  ]

  return (
    <section id="clubs" className="py-24 bg-slate-900 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" />
              Clubs & Joueurs
            </h2>
            <p className="text-slate-400 mt-2 font-medium">Les acteurs majeurs du football malien.</p>
          </div>
        </div>

        {/* Players Section (Stars) */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-8">
            <Users className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">Joueurs Vedettes</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPlayers.slice(0, 4).map((player, i) => (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-80 rounded-3xl bg-slate-950 overflow-hidden border border-white/5 group-hover:border-green-500/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10" />
                  
                  {/* Player Image Placeholder if none */}
                  <div className="absolute inset-0 bg-slate-800 flex items-end justify-center">
                    <Users className="w-32 h-32 text-slate-700 opacity-50 mb-10" />
                  </div>

                  <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">{player.position}</span>
                    <h4 className="text-2xl font-black text-white leading-none uppercase tracking-wide group-hover:text-green-400 transition-colors">
                      {player.first_name} <br /> {player.last_name}
                    </h4>
                    <span className="text-sm font-medium text-slate-400 mt-2 flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[8px] font-black text-white">
                        {player.club.short}
                      </div>
                      {player.club.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Clubs Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Clubs Affiliés</h3>
            </div>
            <button className="text-sm font-bold text-slate-400 hover:text-green-400 uppercase tracking-wider transition-colors flex items-center gap-1">
              Tous les clubs <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayClubs.slice(0, 6).map((club, i) => (
              <motion.div 
                key={club.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-slate-950 border border-white/5 hover:border-green-500/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group cursor-pointer transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="font-black text-xl text-slate-400 group-hover:text-white">{club.short}</span>
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-white text-sm group-hover:text-green-400 transition-colors line-clamp-1">{club.name}</h4>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{club.city}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
