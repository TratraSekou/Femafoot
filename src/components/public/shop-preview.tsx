"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Store, ShoppingBag, ArrowUpRight, Check } from "lucide-react"

type Product = {
  id: number
  name: string
  price: number
  category: string
  images: string[] | null
  stock: number
  reserved: number
}

interface ShopPreviewProps {
  products: Product[]
}

export function ShopPreview({ products }: ShopPreviewProps) {
  const [reservingId, setReservingId] = useState<number | null>(null)
  const [reservedIds, setReservedIds] = useState<number[]>([])

  const displayProducts = products.length > 0 ? products : [
    { id: 1, name: "Maillot Domicile 2024", price: 35000, category: "Maillots", images: null, stock: 50, reserved: 10 },
    { id: 2, name: "Veste d'entraînement Pro", price: 45000, category: "Vêtements", images: null, stock: 20, reserved: 5 },
    { id: 3, name: "Casquette Officielle FemaFoot", price: 15000, category: "Accessoires", images: null, stock: 100, reserved: 0 },
    { id: 4, name: "Ballon Officiel Ligue 1", price: 25000, category: "Équipements", images: null, stock: 5, reserved: 4 }, // Stock faible
  ]

  const handleReserve = (id: number) => {
    setReservingId(id)
    setTimeout(() => {
      setReservingId(null)
      setReservedIds(prev => [...prev, id])
    }, 800)
  }

  return (
    <section id="shop" className="py-24 bg-slate-950 relative border-t border-white/5">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" />
              Boutique Officielle
            </h2>
            <p className="text-slate-400 mt-2 font-medium">Équipez-vous aux couleurs de la fédération.</p>
          </div>
          <button className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-wider text-sm hover:text-green-300 transition-colors group">
            Voir tous les produits
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.slice(0, 4).map((product, i) => {
            const availableStock = product.stock - product.reserved
            const isLowStock = availableStock > 0 && availableStock <= 5
            const isReserved = reservedIds.includes(product.id)
            const isReserving = reservingId === product.id

            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-green-500/30 transition-colors group flex flex-col"
              >
                {/* Image Area */}
                <div className="relative h-64 bg-slate-800/50 flex items-center justify-center p-6">
                  {product.images && product.images.length > 0 ? (
                    // Add real image rendering here if needed
                    <div className="w-full h-full bg-slate-700 rounded-xl" />
                  ) : (
                    <Store className="w-24 h-24 text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {availableStock === 0 ? (
                      <span className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                        Rupture
                      </span>
                    ) : isLowStock ? (
                      <span className="px-3 py-1 rounded-md bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-md animate-pulse">
                        Stock Faible ({availableStock})
                      </span>
                    ) : null}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-md bg-slate-950/80 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-green-400 transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-xl font-black text-white mt-auto pt-4">
                    {product.price.toLocaleString()} FCFA
                  </div>
                  
                  <button 
                    disabled={availableStock === 0 || isReserved || isReserving}
                    onClick={() => handleReserve(product.id)}
                    className={`mt-6 w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isReserved 
                        ? "bg-green-500 text-white" 
                        : availableStock === 0
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-white/5 hover:bg-green-500/20 text-green-400 hover:text-green-400 border border-green-500/20"
                    }`}
                  >
                    {isReserved ? (
                      <><Check className="w-4 h-4" /> Réservé (24h)</>
                    ) : isReserving ? (
                      <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    ) : availableStock === 0 ? (
                      "Indisponible"
                    ) : (
                      <><ShoppingBag className="w-4 h-4" /> Réserver</>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
