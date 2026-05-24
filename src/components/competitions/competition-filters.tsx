import React from 'react';
import { Search, SlidersHorizontal, Trophy } from 'lucide-react';
import { CompetitionStatus, Category, CompetitionType } from './types';

interface CompetitionFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatus: CompetitionStatus | 'Tous';
  setSelectedStatus: (s: CompetitionStatus | 'Tous') => void;
  selectedCategory: Category | 'Tous';
  setSelectedCategory: (c: Category | 'Tous') => void;
  selectedType: CompetitionType | 'Tous';
  setSelectedType: (t: CompetitionType | 'Tous') => void;
  selectedSeason: string;
  setSelectedSeason: (s: string) => void;
  seasonsList: string[];
  totalResults: number;
}

export function CompetitionFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedSeason,
  setSelectedSeason,
  seasonsList,
  totalResults
}: CompetitionFiltersProps) {
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
            <Trophy size={14} className="text-slate-400" />
            <span className="text-slate-300">{totalResults} compétition(s)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-15 gap-4 bg-[#060d0a]/60 p-3 rounded-xl border border-white/5">
          {/* Recherche */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Saison */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="Tous" className="bg-[#0f1c1a]">Toutes Saisons</option>
              {seasonsList.map(season => (
                <option key={season} value={season} className="bg-[#0f1c1a]">{season}</option>
              ))}
            </select>
          </div>

          {/* Catégorie */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | 'Tous')}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="Tous" className="bg-[#0f1c1a]">Catégorie</option>
              <option value="Seniors" className="bg-[#0f1c1a]">Seniors</option>
              <option value="U23" className="bg-[#0f1c1a]">U23</option>
              <option value="U20" className="bg-[#0f1c1a]">U20</option>
              <option value="U17" className="bg-[#0f1c1a]">U17</option>
              <option value="Féminines" className="bg-[#0f1c1a]">Féminines</option>
            </select>
          </div>
          
          {/* Type */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as CompetitionType | 'Tous')}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="Tous" className="bg-[#0f1c1a]">Type</option>
              <option value="Championnat" className="bg-[#0f1c1a]">Championnat</option>
              <option value="Coupe" className="bg-[#0f1c1a]">Coupe</option>
              <option value="Tournoi" className="bg-[#0f1c1a]">Tournoi</option>
            </select>
          </div>

          {/* Statut */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as CompetitionStatus | 'Tous')}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
            >
              <option value="Tous" className="bg-[#0f1c1a]">Statut</option>
              <option value="EN COURS" className="bg-[#0f1c1a] text-emerald-400">En cours</option>
              <option value="À VENIR" className="bg-[#0f1c1a] text-primary">À venir</option>
              <option value="TERMINÉE" className="bg-[#0f1c1a] text-slate-400">Terminée</option>
              <option value="SUSPENDUE" className="bg-[#0f1c1a] text-red-400">Suspendue</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
