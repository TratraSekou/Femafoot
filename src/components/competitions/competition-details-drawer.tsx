import React, { useEffect, useState } from 'react';
import { X, Calendar, Shield, Trophy, Activity, Users, Star } from 'lucide-react';
import { Competition } from './types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CompetitionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Competition | null;
}

export function CompetitionDetailsDrawer({ isOpen, onClose, competition }: CompetitionDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted && !isOpen) return null;
  if (!competition) return null;

  const isEnCours = competition.status === 'EN COURS';

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md md:max-w-xl bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out custom-scrollbar overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header Hero */}
        <div className="relative pt-12 pb-8 px-6 bg-gradient-to-b from-[#132820] to-[#060d0a] border-b border-white/5 flex-shrink-0">
          {isEnCours && <div className="absolute inset-0 bg-emerald-500/5 blur-3xl animate-pulse pointer-events-none" />}
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center justify-center relative z-10 gap-4">
            <div className="relative w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-4 shadow-2xl">
              {competition.logo ? (
                <img src={competition.logo} alt={competition.name} className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
              ) : (
                <Trophy size={60} className="text-primary drop-shadow-md" />
              )}
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-black text-white leading-tight">
                {competition.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 bg-white/5 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-white/5">
                  Saison {competition.season}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
                  isEnCours ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-slate-400 border-white/5"
                )}>
                  {competition.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corps (Infos & Stats) */}
        <div className="p-6 flex-1 flex flex-col gap-8 relative z-20 overflow-y-auto custom-scrollbar">
          
          {/* Grille Infos de base */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 text-center">
              <Shield className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xl font-bold text-white font-mono">{competition.teamsCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Clubs Engagés</span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 text-center">
              <Calendar className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xl font-bold text-white font-mono">{competition.matchesCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Matchs Prévus</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
             <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col gap-1">
                   <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Date de début</span>
                   <span className="text-white font-medium">{new Date(competition.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col gap-1 text-right">
                   <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Date de fin</span>
                   <span className="text-white font-medium">{new Date(competition.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
             </div>
          </div>

          {/* Stats de la compétition (Mock) */}
          {competition.stats && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Chiffres Clés de la saison
              </h3>
              
              <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-4">
                {competition.type === 'Championnat' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Équipe en tête</span>
                      <span className="text-white font-bold">{competition.stats.leadingTeam}</span>
                    </div>
                    <div className="h-px w-full bg-white/5" />
                  </>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Meilleur buteur</span>
                  <span className="text-white font-bold">{competition.stats.topScorer}</span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 flex items-center gap-2">Total buts marqués</span>
                  <span className="text-white font-bold">{competition.stats.totalGoals}</span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 flex items-center gap-2">Cartons jaunes distribués</span>
                  <span className="text-yellow-500 font-bold">{competition.stats.yellowCards}</span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 flex items-center gap-2">Cartons rouges distribués</span>
                  <span className="text-red-500 font-bold">{competition.stats.redCards}</span>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Mock (Aperçu) */}
          {competition.type === 'Championnat' && isEnCours && (
             <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Top 3 Actuel
                </h3>
                <div className="bg-[#060d0a] border border-white/5 rounded-xl overflow-hidden">
                   <div className="flex justify-between p-3 text-[10px] uppercase font-bold text-slate-500 border-b border-white/5 bg-white/5">
                      <span>Club</span>
                      <span>Pts</span>
                   </div>
                   {['Djoliba AC', 'Stade Malien', 'AS Real Bamako'].map((club, idx) => (
                      <div key={club} className="flex justify-between p-3 text-sm text-white border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                         <div className="flex items-center gap-3">
                            <span className={cn("font-mono text-xs w-4", idx === 0 ? "text-primary font-bold" : "text-slate-500")}>{idx + 1}.</span>
                            <span>{club}</span>
                         </div>
                         <span className="font-mono font-bold text-primary">{Math.max(45 - (idx * 3), 0)}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}

        </div>
      </div>
    </>
  );
}
