"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Ticket, MapPin, Clock, ArrowUpRight, Check } from "lucide-react"

type TicketItem = {
  id: number
  match_id: number
  category: string
  price: number
  available_quantity: number
  reserved_quantity: number
  status: string
  match: {
    match_date: string
    home_club: { name: string, short: string }
    away_club: { name: string, short: string }
    competition: { name: string }
  }
}

interface TicketsPreviewProps {
  tickets: TicketItem[]
}

export function TicketsPreview({ tickets }: TicketsPreviewProps) {
  const [reservingId, setReservingId] = useState<number | null>(null)
  const [reservedIds, setReservedIds] = useState<number[]>([])

  const displayTickets = tickets.length > 0 ? tickets : [
    {
      id: 1, match_id: 1, category: "Tribune VIP", price: 10000, available_quantity: 50, reserved_quantity: 45, status: "DISPONIBLE",
      match: { match_date: new Date(Date.now() + 86400000).toISOString(), home_club: { name: "Stade Malien", short: "SMA" }, away_club: { name: "Djoliba AC", short: "DJB" }, competition: { name: "Ligue 1 Orange" } }
    },
    {
      id: 2, match_id: 1, category: "Gradins", price: 2000, available_quantity: 1000, reserved_quantity: 500, status: "DISPONIBLE",
      match: { match_date: new Date(Date.now() + 86400000).toISOString(), home_club: { name: "Stade Malien", short: "SMA" }, away_club: { name: "Djoliba AC", short: "DJB" }, competition: { name: "Ligue 1 Orange" } }
    }
  ]

  const handleReserve = (id: number) => {
    setReservingId(id)
    setTimeout(() => {
      setReservingId(null)
      setReservedIds(prev => [...prev, id])
    }, 800)
  }

  return (
    <section id="tickets" className="py-24 bg-slate-900 relative">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" />
              Billetterie
            </h2>
            <p className="text-slate-400 mt-2 font-medium">Réservez vos places pour les prochains grands matchs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTickets.slice(0, 3).map((ticket, i) => {
            const available = ticket.available_quantity - ticket.reserved_quantity
            const isLowStock = available > 0 && available <= 20
            const date = new Date(ticket.match.match_date)
            const dateStr = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
            const timeStr = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            const isReserved = reservedIds.includes(ticket.id)
            const isReserving = reservingId === ticket.id

            return (
              <motion.div 
                key={ticket.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-slate-950 border border-white/5 rounded-3xl overflow-hidden hover:border-green-500/30 transition-colors group flex flex-col relative"
              >
                {/* Ticket header styling */}
                <div className="h-32 bg-gradient-to-br from-green-600/20 to-slate-900 border-b border-white/5 border-dashed p-6 relative flex flex-col justify-between">
                  <div className="absolute top-0 right-6 w-8 h-8 bg-green-500/10 rounded-b-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">{ticket.match.competition.name}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-white">{ticket.match.home_club.short}</span>
                    <span className="text-xs font-bold text-slate-500">VS</span>
                    <span className="text-xl font-black text-white">{ticket.match.away_club.short}</span>
                  </div>
                </div>

                {/* Circles for ticket effect */}
                <div className="absolute top-32 -left-3 w-6 h-6 bg-slate-900 rounded-full border-r border-white/5 -translate-y-1/2 z-10" />
                <div className="absolute top-32 -right-3 w-6 h-6 bg-slate-900 rounded-full border-l border-white/5 -translate-y-1/2 z-10" />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{ticket.category}</h3>
                    <div className="text-xl font-black text-green-400">{ticket.price.toLocaleString()} FCFA</div>
                  </div>

                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="capitalize">{dateStr} à {timeStr}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>Stade 26 Mars, Bamako</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Disponibilité</span>
                      <span className={`text-xs font-black uppercase tracking-widest ${
                        available === 0 ? "text-red-400" : isLowStock ? "text-orange-400" : "text-green-400"
                      }`}>
                        {available === 0 ? "Épuisé" : `${available} places`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${available === 0 ? "bg-red-500" : "bg-green-500"}`} 
                        style={{ width: `${(available / ticket.available_quantity) * 100}%` }}
                      />
                    </div>

                    <button 
                      disabled={available === 0 || isReserved || isReserving}
                      onClick={() => handleReserve(ticket.id)}
                      className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        isReserved 
                          ? "bg-green-500 text-white" 
                          : available === 0
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-white/5 hover:bg-green-500/20 text-green-400 hover:text-green-400 border border-green-500/20"
                      }`}
                    >
                      {isReserved ? (
                        <><Check className="w-5 h-5" /> Place Réservée (24h)</>
                      ) : isReserving ? (
                        <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                      ) : available === 0 ? (
                        "Complet"
                      ) : (
                        <><Ticket className="w-5 h-5" /> Réserver ce ticket</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
