import React from 'react';
import { Search, Trophy, Calendar, LayoutGrid, Filter } from 'lucide-react';

interface StandingFiltersProps {
  onCompetitionChange: (competition: string) => void;
  onSeasonChange: (season: string) => void;
  onCategoryChange: (category: string) => void;
  onGroupChange: (group: string) => void;
}

export function StandingFilters({
  onCompetitionChange,
  onSeasonChange,
  onCategoryChange,
  onGroupChange,
}: StandingFiltersProps) {
  return (
    <div className="relative bg-[#132820]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40 overflow-hidden">
      {/* Ligne lumineuse en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative z-10 flex flex-col gap-4">
        {/* Entête des filtres */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-primary">
            <Filter size={18} />
            <h3 className="text-sm font-semibold tracking-wide uppercase">Contrôle du classement</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#060d0a]/60 p-3 rounded-xl border border-white/5">
          {/* Compétition */}
          <div className="relative group">
            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              onChange={(e) => onCompetitionChange(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="ligue1" className="bg-[#0f1c1a]">Ligue 1 Malienne</option>
              <option value="ligue2" className="bg-[#0f1c1a]">Ligue 2</option>
              <option value="coupe" className="bg-[#0f1c1a]">Coupe du Mali</option>
            </select>
          </div>

          {/* Saison */}
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              onChange={(e) => onSeasonChange(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="2023-2024" className="bg-[#0f1c1a]">Saison 2023-2024</option>
              <option value="2022-2023" className="bg-[#0f1c1a]">Saison 2022-2023</option>
            </select>
          </div>

          {/* Catégorie */}
          <div className="relative group">
            <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="seniors" className="bg-[#0f1c1a]">Seniors</option>
              <option value="u20" className="bg-[#0f1c1a]">U20</option>
              <option value="u17" className="bg-[#0f1c1a]">U17</option>
              <option value="feminines" className="bg-[#0f1c1a]">Féminines</option>
            </select>
          </div>

          {/* Groupe */}
          <div className="relative group">
            <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              onChange={(e) => onGroupChange(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="a" className="bg-[#0f1c1a]">Groupe A</option>
              <option value="b" className="bg-[#0f1c1a]">Groupe B</option>
              <option value="national" className="bg-[#0f1c1a]">Poule Nationale</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
