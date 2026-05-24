import React from 'react';
import { Search, Filter, Calendar, User, TrendingUp } from 'lucide-react';

interface NewsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
}

export function NewsFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}: NewsFiltersProps) {
  return (
    <div className="relative bg-[#132820]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-primary">
            <Filter size={18} />
            <h3 className="text-sm font-semibold tracking-wide uppercase">Contrôle des publications</h3>
          </div>
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
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Toutes les catégories</option>
              <option value="National" className="bg-[#0d1e19]">Équipe Nationale</option>
              <option value="Championnat" className="bg-[#0d1e19]">Championnat</option>
              <option value="Communique" className="bg-[#0d1e19]">Communiqués</option>
              <option value="International" className="bg-[#0d1e19]">International</option>
            </select>
          </div>

          {/* Statut */}
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Tous les statuts</option>
              <option value="Publié" className="bg-[#0d1e19]">Publié</option>
              <option value="Brouillon" className="bg-[#0d1e19]">Brouillon</option>
              <option value="Programmé" className="bg-[#0d1e19]">Programmé</option>
              <option value="Archivé" className="bg-[#0d1e19]">Archivé</option>
            </select>
          </div>

          {/* Auteur (Mock) */}
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Tous les auteurs</option>
              <option value="admin" className="bg-[#0d1e19]">Admin FemaFoot</option>
              <option value="presse" className="bg-[#0d1e19]">Service Presse</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
