import React from 'react';
import { Eye, Edit2, Trash2, Calendar, MapPin, Trophy, Shield } from 'lucide-react';
import { Match, MatchStatus } from './types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MatchCardProps {
  match: Match;
  onView: (match: Match) => void;
  onEdit: (match: Match) => void;
  onDelete: (match: Match) => void;
  index: number;
}

export function MatchCard({ match, onView, onEdit, onDelete, index }: MatchCardProps) {
  const isLive = match.status === 'LIVE';

  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case 'LIVE': return 'text-red-500 border-red-500/20 bg-red-500/10 font-bold';
      case 'À VENIR': return 'text-primary border-primary/20 bg-primary/10';
      case 'TERMINÉ': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
      case 'REPORTÉ': return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
      case 'MI-TEMPS': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
    }
  };

  const getStatusText = () => {
    if (isLive && match.liveMinute) {
      return `${match.liveMinute}'`;
    }
    return match.status;
  };

  return (
    <div 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl glass-card transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
        isLive ? "hover:shadow-red-500/20 ring-1 ring-red-500/20" : "hover:shadow-primary/10"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Lueur supérieure au hover */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-500",
        isLive ? "via-red-500/50 group-hover:via-red-500" : "via-primary/0 group-hover:via-primary/50"
      )} />

      {/* En-tête : Compétition & Statut */}
      <div className="flex items-center justify-between p-4 pb-2 border-b border-white/5 bg-[#060d0a]/40">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <Trophy size={14} className="text-primary" />
          <span className="truncate max-w-[120px]" title={match.competition}>{match.competition}</span>
        </div>
        
        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border", getStatusColor(match.status))}>
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          {getStatusText()}
        </div>
      </div>

      {/* Corps central : Équipes & Score */}
      <div className="relative flex-1 p-6 flex items-center justify-between bg-gradient-to-br from-[#0d1e19] to-[#132820] overflow-hidden">
        {/* Glow central pour les matchs live */}
        {isLive && (
          <div className="absolute inset-0 bg-red-500/5 blur-3xl animate-pulse pointer-events-none" />
        )}

        {/* Équipe Domicile */}
        <div className="flex flex-col items-center gap-3 w-[30%] relative z-10">
          <div className="relative w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2 shadow-lg transition-transform duration-500 group-hover:scale-110">
            {match.homeTeam.logo ? (
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" />
            ) : (
              <Shield className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <span className="text-sm font-bold text-white text-center leading-tight line-clamp-2">
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score ou Heure */}
        <div className="flex flex-col items-center justify-center w-[40%] relative z-10">
          {['LIVE', 'TERMINÉ', 'MI-TEMPS'].includes(match.status) ? (
            <div className="flex items-center justify-center gap-2">
              <span className={cn("text-4xl font-black font-mono drop-shadow-lg", isLive ? "text-white" : "text-slate-200")}>
                {match.homeScore}
              </span>
              <span className="text-2xl font-bold text-slate-500 pb-1">-</span>
              <span className={cn("text-4xl font-black font-mono drop-shadow-lg", isLive ? "text-white" : "text-slate-200")}>
                {match.awayScore}
              </span>
            </div>
          ) : (
            <div className="text-2xl font-black text-slate-300 font-mono tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              {match.time}
            </div>
          )}
        </div>

        {/* Équipe Extérieure */}
        <div className="flex flex-col items-center gap-3 w-[30%] relative z-10">
          <div className="relative w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2 shadow-lg transition-transform duration-500 group-hover:scale-110">
            {match.awayTeam.logo ? (
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" />
            ) : (
              <Shield className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <span className="text-sm font-bold text-white text-center leading-tight line-clamp-2">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Footer : Date & Lieu */}
      <div className="p-4 bg-[#060d0a]/60 backdrop-blur-md border-t border-white/5 flex flex-col gap-2 relative z-20">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary/70" />
            <span>{new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate max-w-[50%]">
            <MapPin size={14} className="text-primary/70 flex-shrink-0" />
            <span className="truncate" title={match.stadium}>{match.stadium}</span>
          </div>
        </div>
      </div>

      {/* Menu d'actions (Reveal on hover) */}
      <div className="absolute inset-0 bg-[#060d0a]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-30 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onView(match); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
          title="Voir les détails"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(match); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110 shadow-lg"
          title="Modifier"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(match); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-destructive hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
