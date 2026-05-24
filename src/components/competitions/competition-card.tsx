import React from 'react';
import { Eye, Edit2, Trash2, Calendar, Shield, Trophy } from 'lucide-react';
import { Competition, CompetitionStatus, Category, CompetitionType } from './types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CompetitionCardProps {
  competition: Competition;
  onView: (comp: Competition) => void;
  onEdit: (comp: Competition) => void;
  onDelete: (comp: Competition) => void;
  index: number;
}

export function CompetitionCard({ competition, onView, onEdit, onDelete, index }: CompetitionCardProps) {
  const isEnCours = competition.status === 'EN COURS';

  const getStatusColor = (status: CompetitionStatus) => {
    switch (status) {
      case 'EN COURS': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10 font-bold';
      case 'À VENIR': return 'text-primary border-primary/20 bg-primary/10';
      case 'TERMINÉE': return 'text-slate-400 border-slate-500/20 bg-slate-500/10';
      case 'SUSPENDUE': return 'text-red-500 border-red-500/20 bg-red-500/10';
    }
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'Seniors': return 'text-blue-400';
      case 'U23': return 'text-cyan-400';
      case 'U20': return 'text-purple-400';
      case 'U17': return 'text-pink-400';
      case 'Féminines': return 'text-rose-400';
    }
  };

  const getTypeIcon = (type: CompetitionType) => {
    // We could use different icons, but Trophy is good for all.
    return <Trophy size={14} className="text-primary/70" />;
  };

  return (
    <div 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl glass-card transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
        isEnCours ? "hover:shadow-emerald-500/10 ring-1 ring-emerald-500/10" : "hover:shadow-primary/10"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Lueur supérieure au hover */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-500",
        isEnCours ? "via-emerald-500/50 group-hover:via-emerald-500" : "via-primary/0 group-hover:via-primary/50"
      )} />

      {/* Visuel de la compétition (Logo / Trophée) */}
      <div className="relative h-40 w-full bg-gradient-to-br from-[#0d1e19] to-[#132820] overflow-hidden flex items-center justify-center border-b border-white/5">
        {/* Glow de fond */}
        {isEnCours && (
          <div className="absolute inset-0 bg-emerald-500/5 blur-3xl animate-pulse pointer-events-none" />
        )}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 w-24 h-24 transition-transform duration-500 group-hover:scale-110">
          {competition.logo ? (
             <Image 
                src={competition.logo} 
                alt={competition.name} 
                fill 
                className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]" 
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 bg-white/5 rounded-full border border-white/10 shadow-lg">
              <Trophy size={40} />
            </div>
          )}
        </div>

        {/* Badges sur l'image */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <span className={cn("px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border backdrop-blur-md", getStatusColor(competition.status))}>
            {competition.status}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border border-white/10 bg-black/40 text-white backdrop-blur-md">
            Saison {competition.season}
          </span>
        </div>
      </div>

      {/* Informations */}
      <div className="relative z-20 flex-1 p-5 bg-[#060d0a]/60 backdrop-blur-md flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-white leading-tight mb-1 truncate" title={competition.name}>
            {competition.name}
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
             <span className="text-slate-400 flex items-center gap-1">{getTypeIcon(competition.type)} {competition.type}</span>
             <span className="text-slate-600">•</span>
             <span className={cn("font-bold", getCategoryColor(competition.category))}>{competition.category}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 flex flex-col items-center justify-center">
            <Shield className="w-4 h-4 text-slate-400 mb-1" />
            <span className="text-lg font-bold text-white font-mono">{competition.teamsCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500">Clubs</span>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 flex flex-col items-center justify-center">
            <Calendar className="w-4 h-4 text-slate-400 mb-1" />
            <span className="text-lg font-bold text-white font-mono">{competition.matchesCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500">Matchs</span>
          </div>
        </div>
      </div>

      {/* Menu d'actions (Reveal on hover) */}
      <div className="absolute inset-0 bg-[#060d0a]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-30 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onView(competition); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
          title="Voir les détails"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(competition); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110 shadow-lg"
          title="Modifier"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(competition); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-destructive hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
