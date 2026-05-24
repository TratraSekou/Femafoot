import React from 'react';
import { Search, MapPin, Trophy, Calendar, Ticket, Filter, Activity } from 'lucide-react';

interface BilletterieFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCompetition: string;
  setSelectedCompetition: (c: string) => void;
  selectedVenue: string;
  setSelectedVenue: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
}

export function BilletterieFilters({
  searchQuery,
  setSearchQuery,
  selectedCompetition,
  setSelectedCompetition,
  selectedVenue,
  setSelectedVenue,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
}: BilletterieFiltersProps) {
  return (
    <div className="relative bg-[#132820]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-2 text-primary">
          <Filter size={18} />
          <h3 className="text-sm font-semibold tracking-wide uppercase">Filtres Billetterie</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-[#060d0a]/60 p-3 rounded-xl border border-white/5">
          {/* Recherche Match */}
          <div className="relative group md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un match..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Compétition */}
          <div className="relative group">
            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Toutes compétitions</option>
              <option value="Ligue 1 Malienne" className="bg-[#0d1e19]">Ligue 1</option>
              <option value="Coupe du Mali" className="bg-[#0d1e19]">Coupe du Mali</option>
              <option value="Éliminatoires CAN" className="bg-[#0d1e19]">Éliminatoires CAN</option>
            </select>
          </div>

          {/* Stade */}
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Tous les stades</option>
              <option value="Stade du 26 Mars" className="bg-[#0d1e19]">Stade du 26 Mars</option>
              <option value="Stade Modibo Kéïta" className="bg-[#0d1e19]">Stade Modibo Kéïta</option>
            </select>
          </div>

          {/* Statut */}
          <div className="relative group">
            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Tous les statuts</option>
              <option value="Ouvert" className="bg-[#0d1e19]">Ouvert</option>
              <option value="Presque complet" className="bg-[#0d1e19]">Presque complet</option>
              <option value="Complet" className="bg-[#0d1e19]">Complet</option>
              <option value="Fermé" className="bg-[#0d1e19]">Fermé</option>
            </select>
          </div>

          {/* Catégorie */}
          <div className="relative group">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Toutes catégories</option>
              <option value="VIP" className="bg-[#0d1e19]">VIP</option>
              <option value="Tribune" className="bg-[#0d1e19]">Tribune</option>
              <option value="Pelouse" className="bg-[#0d1e19]">Pelouse</option>
              <option value="Standard" className="bg-[#0d1e19]">Standard</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
