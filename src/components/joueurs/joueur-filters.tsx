import React from 'react';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { Joueur, Position, Status } from './types';

interface JoueurFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedClub: string;
  setSelectedClub: (c: string) => void;
  selectedPosition: Position | 'Tous';
  setSelectedPosition: (p: Position | 'Tous') => void;
  selectedStatus: Status | 'Tous';
  setSelectedStatus: (s: Status | 'Tous') => void;
  clubsList: string[];
  totalResults: number;
}

export function JoueurFilters({
  searchQuery,
  setSearchQuery,
  selectedClub,
  setSelectedClub,
  selectedPosition,
  setSelectedPosition,
  selectedStatus,
  setSelectedStatus,
  clubsList,
  totalResults
}: JoueurFiltersProps) {
  return (
    <div className="relative bg-[#132820]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40 overflow-hidden">
      {/* Ligne lumineuse en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative z-10 flex flex-col gap-4">
        {/* Entête des filtres */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-primary">
            <SlidersHorizontal size={18} />
            <h3 className="text-sm font-semibold tracking-wide uppercase">Filtres</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <Users size={14} className="text-slate-400" />
            <span className="text-slate-300">{totalResults} joueur(s)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#060d0a]/60 p-3 rounded-xl border border-white/5">
          {/* Recherche */}
          <div className="col-span-1 md:col-span-4 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Filtre Club */}
          <div className="col-span-1 md:col-span-3">
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="Tous" className="bg-[#0f1c1a]">Tous les clubs</option>
              {clubsList.map(club => (
                <option key={club} value={club} className="bg-[#0f1c1a]">{club}</option>
              ))}
            </select>
          </div>

          {/* Filtre Poste */}
          <div className="col-span-1 md:col-span-3">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value as Position | 'Tous')}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="Tous" className="bg-[#0f1c1a]">Tous les postes</option>
              <option value="ATT" className="bg-[#0f1c1a]">Attaquant (ATT)</option>
              <option value="MIL" className="bg-[#0f1c1a]">Milieu (MIL)</option>
              <option value="DEF" className="bg-[#0f1c1a]">Défenseur (DEF)</option>
              <option value="GB" className="bg-[#0f1c1a]">Gardien (GB)</option>
            </select>
          </div>

          {/* Filtre Statut */}
          <div className="col-span-1 md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Status | 'Tous')}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="Tous" className="bg-[#0f1c1a]">Statut</option>
              <option value="Actif" className="bg-[#0f1c1a] text-emerald-400">Actif</option>
              <option value="Blessé" className="bg-[#0f1c1a] text-orange-400">Blessé</option>
              <option value="Suspendu" className="bg-[#0f1c1a] text-red-400">Suspendu</option>
              <option value="Inactif" className="bg-[#0f1c1a] text-slate-400">Inactif</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
