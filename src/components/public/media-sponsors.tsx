"use client"

import React from "react"
import Image from "next/image"
import { Play, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

export function MediaSponsors() {
  const mediaItems = [
    { type: 'video', url: "https://images.unsplash.com/photo-1518605368461-1e1292234955?q=80&w=1000&auto=format&fit=crop", title: "Résumé: Finale Coupe du Mali" },
    { type: 'image', url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000&auto=format&fit=crop", title: "Célébration des Aigles" },
    { type: 'image', url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop", title: "Entraînement Équipe Nationale" },
    { type: 'image', url: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1000&auto=format&fit=crop", title: "Supporters au Stade 26 Mars" },
  ]

  const sponsors = [
    { name: "Orange", highlight: true },
    { name: "PMU MALI", highlight: true },
    { name: "BNDA", highlight: false },
    { name: "Malitel", highlight: false },
    { name: "FIFA", highlight: false },
    { name: "CAF", highlight: false },
    { name: "Kool", highlight: false },
  ]

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Media Gallery */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-green-500 rounded-full" />
                Galerie & Vidéos
              </h2>
              <p className="text-slate-400 mt-2 font-medium">Revivez les meilleurs moments du football malien.</p>
            </div>
            <button className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-wider text-sm hover:text-green-300 transition-colors group">
              Femafoot TV
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaItems.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative rounded-3xl overflow-hidden group cursor-pointer ${
                  i === 0 ? "lg:col-span-2 lg:row-span-2 h-[300px] lg:h-[616px]" : "h-[300px]"
                }`}
              >
                <Image 
                  src={item.url} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                
                {item.type === 'video' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-green-500/90 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] group-hover:scale-110 transition-transform backdrop-blur-sm">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {item.type === 'video' && (
                    <span className="px-3 py-1 rounded-md bg-red-500/90 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-3 inline-block">
                      Vidéo
                    </span>
                  )}
                  <h3 className={`font-bold text-white leading-tight group-hover:text-green-400 transition-colors ${i === 0 ? "text-2xl lg:text-3xl" : "text-lg"}`}>
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sponsors Banner */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Partenaires Officiels</h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {sponsors.map((sponsor, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`text-2xl md:text-3xl font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 cursor-pointer ${
                  sponsor.highlight ? "text-slate-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-slate-600 hover:text-slate-400"
                }`}
              >
                {sponsor.name}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
