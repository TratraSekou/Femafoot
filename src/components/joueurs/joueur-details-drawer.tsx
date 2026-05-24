import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Flag, Trophy, Shield, Goal, Activity } from 'lucide-react';
import { Joueur } from './types';
import Image from 'next/image';

interface JoueurDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  joueur: Joueur | null;
}

export function JoueurDetailsDrawer({ isOpen, onClose, joueur }: JoueurDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setMounted(false), 300); // Wait for exit animation
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted && !isOpen) return null;
  if (!joueur) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Blessé': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Suspendu': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Inactif': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out custom-scrollbar overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header / Couverture */}
        <div className="relative h-64 sm:h-72 w-full flex-shrink-0 bg-gradient-to-br from-[#132820] to-[#060d0a] overflow-hidden">
          {/* Lueur de fond */}
          <div className="absolute inset-0 bg-primary/10 opacity-50 blur-3xl" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
          >
            <X size={20} />
          </button>

          {/* Photo ou Icone Générique */}
          <div className="absolute inset-x-0 bottom-0 top-10 flex justify-center z-10">
            {joueur.avatar ? (
               <Image 
                  src={joueur.avatar} 
                  alt={joueur.lastName} 
                  fill 
                  className="object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]" 
               />
            ) : (
               <div className="w-full h-full flex items-end justify-center pb-4 opacity-30">
                 <Shield size={160} />
               </div>
            )}
          </div>

          <div className="absolute bottom-4 right-4 z-20">
            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border backdrop-blur-md ${getStatusColor(joueur.status)}`}>
              {joueur.status}
            </span>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0d1e19] to-transparent z-10" />
        </div>

        {/* Corps du Drawer */}
        <div className="p-6 flex-1 flex flex-col gap-8 relative z-20 -mt-6">
          
          {/* Infos de base */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                {joueur.firstName} {joueur.lastName}
              </h2>
              <span className="text-2xl text-white/20 italic font-bold">#{joueur.number}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                <span>{joueur.club}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-primary" />
                <span>{joueur.nationality}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-white px-2 py-0.5 bg-white/10 rounded-md">
                {joueur.position}
              </div>
            </div>
          </div>

          {/* Stats Principales (Mock) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-white font-mono">{joueur.stats?.rating || 75}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Note Globale</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-white font-mono">{joueur.age}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Ans</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-white font-mono">{joueur.stats?.matches || 0}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Matchs</span>
            </div>
          </div>

          {/* Performances Saison */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Performances (Saison 2026-2027)
            </h3>
            
            <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 flex items-center gap-2"><Goal className="w-4 h-4 text-primary" /> Buts marqués</span>
                <span className="text-white font-bold">{joueur.stats?.goals || 0}</span>
              </div>
              <div className="h-px w-full bg-white/5" />
              <div className="flex justify-between items-center">
                <span className="text-slate-300 flex items-center gap-2"><Goal className="w-4 h-4 text-secondary" /> Passes décisives</span>
                <span className="text-white font-bold">{joueur.stats?.assists || 0}</span>
              </div>
              <div className="h-px w-full bg-white/5" />
              <div className="flex justify-between items-center">
                <span className="text-slate-300 flex items-center gap-2">
                   <div className="w-3 h-4 bg-yellow-400 rounded-sm" /> Cartons Jaunes
                </span>
                <span className="text-white font-bold">{joueur.stats?.yellowCards || 0}</span>
              </div>
              <div className="h-px w-full bg-white/5" />
              <div className="flex justify-between items-center">
                <span className="text-slate-300 flex items-center gap-2">
                   <div className="w-3 h-4 bg-red-500 rounded-sm" /> Cartons Rouges
                </span>
                <span className="text-white font-bold">{joueur.stats?.redCards || 0}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
