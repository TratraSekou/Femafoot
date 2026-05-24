import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Trophy, Shield, Activity, Clock } from 'lucide-react';
import { Match } from './types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MatchDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
}

export function MatchDetailsDrawer({ isOpen, onClose, match }: MatchDetailsDrawerProps) {
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
  if (!match) return null;

  const isLive = match.status === 'LIVE';

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md md:max-w-xl bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out custom-scrollbar overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Scoreboard TV Style Header */}
        <div className="relative pt-12 pb-8 px-6 bg-gradient-to-b from-[#132820] to-[#060d0a] border-b border-white/5 flex-shrink-0">
          {isLive && <div className="absolute inset-0 bg-red-500/5 blur-3xl animate-pulse pointer-events-none" />}
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center justify-center text-center gap-1 mb-6 relative z-10">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <Trophy size={14} className="text-primary" />
              <span>{match.competition}</span>
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            {/* Domicile */}
            <div className="flex flex-col items-center gap-3 w-[30%]">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-xl">
                {match.homeTeam.logo ? (
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" />
                ) : (
                  <Shield size={40} className="text-slate-400" />
                )}
              </div>
              <span className="font-bold text-white text-center leading-tight">{match.homeTeam.name}</span>
            </div>

            {/* Centre (Score/Heure) */}
            <div className="flex flex-col items-center justify-center w-[40%] gap-2">
              {['LIVE', 'TERMINÉ', 'MI-TEMPS'].includes(match.status) ? (
                <div className="flex items-center justify-center gap-4 bg-black/20 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                  <span className={cn("text-5xl font-black font-mono drop-shadow-xl", isLive ? "text-white" : "text-slate-200")}>{match.homeScore}</span>
                  <span className="text-2xl text-slate-500">-</span>
                  <span className={cn("text-5xl font-black font-mono drop-shadow-xl", isLive ? "text-white" : "text-slate-200")}>{match.awayScore}</span>
                </div>
              ) : (
                <div className="text-4xl font-black text-slate-300 font-mono tracking-widest bg-black/20 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
                  {match.time}
                </div>
              )}
              
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5",
                isLive ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5 text-slate-400 border border-white/5"
              )}>
                {isLive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                {isLive ? `${match.liveMinute}' LIVE` : match.status}
              </div>
            </div>

            {/* Extérieur */}
            <div className="flex flex-col items-center gap-3 w-[30%]">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-xl">
                {match.awayTeam.logo ? (
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" />
                ) : (
                  <Shield size={40} className="text-slate-400" />
                )}
              </div>
              <span className="font-bold text-white text-center leading-tight">{match.awayTeam.name}</span>
            </div>
          </div>
        </div>

        {/* Corps (Infos & Stats) */}
        <div className="p-6 flex-1 flex flex-col gap-8 relative z-20 overflow-y-auto custom-scrollbar">
          
          {/* Infos de match */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3 border border-white/5">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Date & Heure</p>
                <p className="text-sm font-medium text-slate-200">{new Date(match.date).toLocaleDateString('fr-FR')} à {match.time}</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3 border border-white/5">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Stade</p>
                <p className="text-sm font-medium text-slate-200 truncate" title={match.stadium}>{match.stadium}</p>
              </div>
            </div>
          </div>

          {/* Stats Fictives */}
          {match.stats && ['LIVE', 'TERMINÉ', 'MI-TEMPS'].includes(match.status) && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Statistiques du match
              </h3>
              
              <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-6">
                
                {/* Possession */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-white">{match.stats.possessionHome}%</span>
                    <span className="text-slate-400">Possession</span>
                    <span className="text-white">{match.stats.possessionAway}%</span>
                  </div>
                  <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/10">
                    <div style={{ width: `${match.stats.possessionHome}%` }} className="bg-primary" />
                    <div style={{ width: `${match.stats.possessionAway}%` }} className="bg-slate-500" />
                  </div>
                </div>

                {/* Tirs */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white w-8 text-center">{match.stats.shotsHome}</span>
                  <div className="flex-1 text-center text-xs text-slate-400 font-medium uppercase">Tirs</div>
                  <span className="text-lg font-bold text-white w-8 text-center">{match.stats.shotsAway}</span>
                </div>

                {/* Tirs Cadrés */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white w-8 text-center">{match.stats.shotsOnTargetHome}</span>
                  <div className="flex-1 text-center text-xs text-slate-400 font-medium uppercase">Tirs Cadrés</div>
                  <span className="text-lg font-bold text-white w-8 text-center">{match.stats.shotsOnTargetAway}</span>
                </div>

                {/* Corners */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white w-8 text-center">{match.stats.cornersHome}</span>
                  <div className="flex-1 text-center text-xs text-slate-400 font-medium uppercase">Corners</div>
                  <span className="text-lg font-bold text-white w-8 text-center">{match.stats.cornersAway}</span>
                </div>

                {/* Fautes */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white w-8 text-center">{match.stats.foulsHome}</span>
                  <div className="flex-1 text-center text-xs text-slate-400 font-medium uppercase">Fautes</div>
                  <span className="text-lg font-bold text-white w-8 text-center">{match.stats.foulsAway}</span>
                </div>

              </div>
            </div>
          )}

          {/* Arbitre */}
          {match.referee && (
            <div className="mt-auto">
              <div className="flex items-center gap-3 py-4 border-t border-white/5 text-sm text-slate-400">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Arbitre : <span className="text-slate-300 font-medium">{match.referee}</span></span>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
