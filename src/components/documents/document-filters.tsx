import React from 'react';
import { Search, Filter, FileType, FolderOpen, Calendar, User, CheckCircle2 } from 'lucide-react';

interface DocumentFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
}

export function DocumentFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
}: DocumentFiltersProps) {
  return (
    <div className="relative bg-[#132820]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-primary">
            <Filter size={18} />
            <h3 className="text-sm font-semibold tracking-wide uppercase">Contrôle documentaire</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#060d0a]/60 p-3 rounded-xl border border-white/5">
          {/* Recherche */}
          <div className="relative group md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Catégorie */}
          <div className="relative group">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Toutes catégories</option>
              <option value="Administratif" className="bg-[#0d1e19]">Administratif</option>
              <option value="Règlements" className="bg-[#0d1e19]">Règlements</option>
              <option value="Sportif" className="bg-[#0d1e19]">Sportif</option>
              <option value="Finances" className="bg-[#0d1e19]">Finances</option>
              <option value="Presse" className="bg-[#0d1e19]">Presse</option>
            </select>
          </div>

          {/* Type de fichier */}
          <div className="relative group">
            <FileType className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Tous types</option>
              <option value="PDF" className="bg-[#0d1e19]">PDF</option>
              <option value="DOCX" className="bg-[#0d1e19]">DOCX</option>
              <option value="XLSX" className="bg-[#0d1e19]">XLSX</option>
              <option value="IMAGE" className="bg-[#0d1e19]">IMAGE</option>
              <option value="ZIP" className="bg-[#0d1e19]">ZIP</option>
            </select>
          </div>

          {/* Statut */}
          <div className="relative group">
            <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              suppressHydrationWarning
              className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#0d1e19]">Tous statuts</option>
              <option value="Public" className="bg-[#0d1e19]">Public</option>
              <option value="Privé" className="bg-[#0d1e19]">Privé</option>
              <option value="Brouillon" className="bg-[#0d1e19]">Brouillon</option>
              <option value="Archivé" className="bg-[#0d1e19]">Archivé</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
