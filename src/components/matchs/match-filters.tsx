import React from 'react';
import { Search, SlidersHorizontal, Calendar as CalendarIcon, Trophy } from 'lucide-react';
import { MatchStatus } from './types';

interface MatchFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatus: MatchStatus | 'Tous';
  setSelectedStatus: (s: MatchStatus | 'Tous') => void;
  selectedCompetition: string;
  setSelectedCompetition: (c: string) => void;
  competitionsList: string[];
  totalResults: number;
}

export function MatchFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedCompetition,
  setSelectedCompetition,
  competitionsList,
  totalResults
}: MatchFiltersProps) {
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
            <CalendarIcon size={14} className="text-slate-400" />
            <span className="text-slate-300">{totalResults} match(s)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#060d0a]/60 p-3 rounded-xl border border-white/5">
          {/* Recherche */}
          <div className="col-span-1 md:col-span-4 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher une équipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Filtre Compétition */}
          <div className="col-span-1 md:col-span-4">
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                <option value="Tous" className="bg-[#0f1c1a]">Toutes les compétitions</option>
                {competitionsList.map(comp => (
                  <option key={comp} value={comp} className="bg-[#0f1c1a]">{comp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtre Statut */}
          <div className="col-span-1 md:col-span-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as MatchStatus | 'Tous')}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="Tous" className="bg-[#0f1c1a]">Tous les statuts</option>
              <option value="LIVE" className="bg-[#0f1c1a] text-red-400">En Direct (LIVE)</option>
              <option value="À VENIR" className="bg-[#0f1c1a] text-primary">À Venir</option>
              <option value="TERMINÉ" className="bg-[#0f1c1a] text-emerald-400">Terminé</option>
              <option value="MI-TEMPS" className="bg-[#0f1c1a] text-yellow-400">Mi-Temps</option>
              <option value="REPORTÉ" className="bg-[#0f1c1a] text-orange-400">Reporté</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
