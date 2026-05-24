import React from 'react';
import { Search, Filter, ShoppingBag, BarChart3, Ruler, Star, Zap } from 'lucide-react';

interface BoutiqueFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedStockStatus: string;
  setSelectedStockStatus: (s: string) => void;
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  showPopularOnly: boolean;
  setShowPopularOnly: (b: boolean) => void;
}

export function BoutiqueFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStockStatus,
  setSelectedStockStatus,
  selectedSize,
  setSelectedSize,
  showPopularOnly,
  setShowPopularOnly,
}: BoutiqueFiltersProps) {
  return (
    <div className="relative bg-[#132820]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-primary">
            <Filter size={18} />
            <h3 className="text-sm font-semibold tracking-wide uppercase">Contrôle Boutique</h3>
          </div>
          <button 
            onClick={() => setShowPopularOnly(!showPopularOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              showPopularOnly ? 'bg-primary text-black' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Star size={12} fill={showPopularOnly ? "currentColor" : "none"} />
            Populaires
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#060d0a]/60 p-3 rounded-xl border border-white/5">
          {/* Recherche */}
          <div className="relative group md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Catégorie */}
          <div className="relative group">
            <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Toutes catégories</option>
              <option value="Maillots" className="bg-[#0d1e19]">Maillots</option>
              <option value="Équipements" className="bg-[#0d1e19]">Équipements</option>
              <option value="Accessoires" className="bg-[#0d1e19]">Accessoires</option>
              <option value="Lifestyle" className="bg-[#0d1e19]">Lifestyle</option>
            </select>
          </div>

          {/* Statut Stock */}
          <div className="relative group">
            <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Tous les stocks</option>
              <option value="disponible" className="bg-[#0d1e19]">Disponible</option>
              <option value="faible" className="bg-[#0d1e19]">Stock faible</option>
              <option value="rupture" className="bg-[#0d1e19]">Rupture</option>
            </select>
          </div>

          {/* Taille */}
          <div className="relative group">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Toutes tailles</option>
              <option value="S" className="bg-[#0d1e19]">S</option>
              <option value="M" className="bg-[#0d1e19]">M</option>
              <option value="L" className="bg-[#0d1e19]">L</option>
              <option value="XL" className="bg-[#0d1e19]">XL</option>
              <option value="XXL" className="bg-[#0d1e19]">XXL</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
