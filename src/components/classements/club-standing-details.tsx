import React from 'react';
import { X, Shield, TrendingUp, History, MapPin, Trophy, Target, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StandingRow } from './types';

interface ClubStandingDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  club: StandingRow | null;
}

export function ClubStandingDetails({ isOpen, onClose, club }: ClubStandingDetailsProps) {
  if (!club) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header Hero */}
        <div className="relative h-64 flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-4 shadow-2xl mb-4 group">
               <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               {club.clubLogo ? (
                 <img src={club.clubLogo} alt={club.clubName} className="relative z-10 object-contain" />
               ) : (
                 <Shield size={48} className="relative z-10 text-primary" />
               )}
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-1">{club.clubName}</h2>
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Trophy size={14} />
              <span>Position {club.position} • {club.points} Points</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Stats Principales */}
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-4 flex items-center gap-2">
              <TrendingUp size={14} /> Performance Actuelle
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Victoires" value={club.won} color="text-emerald-500" />
              <StatCard label="Défaites" value={club.lost} color="text-red-500" />
              <StatCard label="Attaque" value={`${club.goalsFor} buts`} />
              <StatCard label="Défense" value={`${club.goalsAgainst} encaissés`} />
            </div>
          </section>

          {/* Forme Récente */}
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-4 flex items-center gap-2">
              <History size={14} /> Forme des 5 derniers matchs
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center">
              {club.form.map((res, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className={cn(
                     "w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-black shadow-lg",
                     res === 'W' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                     res === 'D' ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                     "bg-red-500/20 border-red-500/30 text-red-400"
                   )}>
                     {res}
                   </div>
                   <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Match {i+1}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Séries & Stats Mock */}
          <section className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 flex items-center gap-2">
              <Activity size={14} /> Statistiques Détaillées
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
              <DetailRow icon={<Target size={14} />} label="Efficacité offensive" value="1.8 b/match" />
              <DetailRow icon={<Shield size={14} />} label="Clean sheets" value="8" />
              <DetailRow icon={<MapPin size={14} />} label="Points à domicile" value="24" />
              <DetailRow icon={<TrendingUp size={14} />} label="Série actuelle" value="3 Victoires" highlight />
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, color = "text-white" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:border-primary/30">
      <p className="text-[9px] uppercase tracking-widest font-bold text-slate-500 mb-1">{label}</p>
      <p className={cn("text-xl font-black font-mono", color)}>{value}</p>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight = false }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <span className={cn(
        "text-sm font-bold",
        highlight ? "text-primary underline decoration-primary/30 underline-offset-4" : "text-slate-200"
      )}>
        {value}
      </span>
    </div>
  );
}
