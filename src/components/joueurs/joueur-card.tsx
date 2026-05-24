import React from 'react';
import { Joueur } from './types';
import { Eye, Edit2, Trash2, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface JoueurCardProps {
  joueur: Joueur;
  onView: (joueur: Joueur) => void;
  onEdit: (joueur: Joueur) => void;
  onDelete: (joueur: Joueur) => void;
  index: number;
}

export function JoueurCard({ joueur, onView, onEdit, onDelete, index }: JoueurCardProps) {
  const getStatusColor = (status: Joueur['status']) => {
    switch (status) {
      case 'Actif': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Blessé': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Suspendu': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Inactif': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getPositionColor = (position: Joueur['position']) => {
    switch (position) {
      case 'ATT': return 'text-blue-400';
      case 'MIL': return 'text-emerald-400';
      case 'DEF': return 'text-amber-400';
      case 'GB': return 'text-purple-400';
    }
  };

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-2xl glass-card transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Lueur supérieure au hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/50" />
      
      {/* En-tête de la carte (Photo + Rating + Position) inspiré FUT */}
      <div className="relative h-48 w-full bg-gradient-to-br from-[#0d1e19] to-[#132820] overflow-hidden">
        {/* Glow de fond */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 left-4 z-10 flex flex-col items-center gap-1">
          <span className="text-2xl font-bold font-mono text-white drop-shadow-md">
            {joueur.stats?.rating || 75}
          </span>
          <span className={cn("text-xs font-black tracking-wider drop-shadow-md", getPositionColor(joueur.position))}>
            {joueur.position}
          </span>
          <div className="w-4 h-4 mt-1 rounded-sm overflow-hidden shadow-sm">
             {/* Mock Flag */}
             <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-[8px]">
               {joueur.nationality.substring(0, 2).toUpperCase()}
             </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-48 flex items-end justify-center z-0">
          {joueur.avatar ? (
             <Image 
                src={joueur.avatar} 
                alt={joueur.lastName} 
                fill 
                className="object-contain object-bottom drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110" 
             />
          ) : (
            <div className="w-full h-full flex items-end justify-center pb-2 opacity-50">
              <User size={120} className="text-slate-500" strokeWidth={1} />
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10 text-xl font-bold text-white/20 italic">
          #{joueur.number}
        </div>
        
        {/* Overlay gradient pour fusionner la photo avec le bas */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#060d0a]/80 to-transparent z-10" />
      </div>

      {/* Informations du joueur */}
      <div className="relative z-20 flex-1 p-5 bg-[#060d0a]/60 backdrop-blur-md border-t border-white/5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-1">
              {joueur.firstName} {joueur.lastName.toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
              <Shield className="w-3.5 h-3.5 text-primary/70" />
              <span className="truncate">{joueur.club}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="text-xs text-slate-400">
            <span className="text-slate-300 font-medium">{joueur.age}</span> ans
          </div>
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border",
            getStatusColor(joueur.status)
          )}>
            {joueur.status}
          </span>
        </div>
      </div>

      {/* Menu d'actions (Reveal on hover) */}
      <div className="absolute inset-0 bg-[#060d0a]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-30 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onView(joueur); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
          title="Voir les détails"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(joueur); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110 shadow-lg"
          title="Modifier"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(joueur); }}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-destructive hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
