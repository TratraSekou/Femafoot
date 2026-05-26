"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Calendar, Ticket } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1e1292234955?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Gradient Overlays for readability and premium feel */}
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        
        {/* Glowing orb effect */}
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8 max-w-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                Officiel
              </span>
              <span className="text-slate-300 text-sm font-medium tracking-wide">
                Fédération Malienne de Football
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              LE FOOTBALL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                MALIEN
              </span>
              <br />EN MOUVEMENT
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light max-w-xl">
              Suivez toutes les compétitions nationales, soutenez vos clubs favoris et vivez la passion du football au cœur de notre fédération.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="#matches">
                <button className="h-14 px-8 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold uppercase tracking-wider text-sm shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all flex items-center gap-2 group">
                  <Calendar className="w-5 h-5" />
                  Matchs en direct
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#tickets">
                <button className="h-14 px-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider text-sm backdrop-blur-md transition-all flex items-center gap-2 group">
                  <Ticket className="w-5 h-5" />
                  Billetterie
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Featured/Next Match Card (Mockup on Hero) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex justify-end"
          >
            <div className="w-full max-w-sm rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-1 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="bg-slate-950/80 rounded-[22px] p-6 relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prochain Grand Match</span>
                  <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Bientôt
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center shadow-lg border border-white/5">
                      <span className="font-black text-xl text-slate-400">DJB</span>
                    </div>
                    <span className="font-bold text-white text-sm">Djoliba AC</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-black text-white">VS</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Stade 26 Mars</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center shadow-lg border border-white/5">
                      <span className="font-black text-xl text-slate-400">SMA</span>
                    </div>
                    <span className="font-bold text-white text-sm">Stade Malien</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-green-500/20 text-green-400 border border-green-500/20 font-bold text-sm uppercase tracking-wider transition-colors">
                    Réserver ma place
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Découvrir</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-green-500 to-transparent rounded-full" />
      </div>
    </section>
  )
}
