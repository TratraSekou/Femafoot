"use client"
import React from "react";
import { Search, Filter, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClubFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  division: string;
  setDivision: (v: string) => void;
  region: string;
  setRegion: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  totalClubs?: number;
}

export function ClubFilters({
  search, setSearch, division, setDivision, region, setRegion, status, setStatus, totalClubs
}: ClubFiltersProps) {
  
  const hasFilters = search || division || region || status;

  const resetFilters = () => {
    setSearch("");
    setDivision("");
    setRegion("");
    setStatus("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both delay-200">
      {/* Conteneur principal avec une couleur bien distincte pour créer une vraie séparation */}
      <div className="relative overflow-hidden rounded-2xl bg-[#132820]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 p-1.5">
        {/* Gradient subtil en fond */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none opacity-50" />
        {/* Ligne lumineuse supérieure */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />
        
        {/* Intérieur plus sombre pour faire ressortir les inputs */}
        <div className="relative bg-[#060d0a]/60 rounded-xl p-4 flex flex-col xl:flex-row gap-5 items-start xl:items-center justify-between z-10 border border-white/5">
          
          <div className="flex flex-col sm:flex-row w-full xl:w-auto items-start sm:items-center gap-4">
            {/* Compteur (si passé) */}
            {totalClubs !== undefined && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm font-medium text-slate-300">
                <span className="text-primary font-bold">{totalClubs}</span> clubs
              </div>
            )}
            
            <div className="relative w-full sm:w-80 lg:w-96 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, ville, coach..." 
                className="pl-10 h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all hover:bg-white/10 rounded-lg"
              />
            </div>
          </div>
          
          <div className="flex w-full xl:w-auto flex-wrap items-center gap-3">
          {hasFilters && (
            <button 
              onClick={resetFilters}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-white mr-2 transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" />
              Réinitialiser
            </button>
          )}
          
          <div className="relative flex-1 sm:flex-none">
            <select 
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full sm:w-40 appearance-none bg-white/5 border border-white/10 text-slate-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 cursor-pointer pr-9 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <option value="" className="bg-[#0a1511]">Toutes divisions</option>
              <option value="Ligue 1" className="bg-[#0a1511]">Ligue 1</option>
              <option value="Ligue 2" className="bg-[#0a1511]">Ligue 2</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          
          <div className="relative flex-1 sm:flex-none">
            <select 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full sm:w-40 appearance-none bg-white/5 border border-white/10 text-slate-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 cursor-pointer pr-9 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <option value="" className="bg-[#0a1511]">Toutes régions</option>
              <option value="Bamako" className="bg-[#0a1511]">Bamako</option>
              <option value="Ségou" className="bg-[#0a1511]">Ségou</option>
              <option value="Sikasso" className="bg-[#0a1511]">Sikasso</option>
              <option value="Kita" className="bg-[#0a1511]">Kita</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full sm:w-40 appearance-none bg-white/5 border border-white/10 text-slate-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 cursor-pointer pr-9 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <option value="" className="bg-[#0a1511]">Tous statuts</option>
              <option value="Actif" className="bg-[#0a1511]">Actif</option>
              <option value="Inactif" className="bg-[#0a1511]">Inactif</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
