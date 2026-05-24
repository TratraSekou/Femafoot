import React from 'react';
import { cn } from '@/lib/utils';
import { StandingRow, StandingZone } from './types';
import Image from 'next/image';

interface StandingTableProps {
  data: StandingRow[];
  onClubClick: (club: StandingRow) => void;
}

export function StandingTable({ data, onClubClick }: StandingTableProps) {
  const getZoneColor = (zone: StandingZone) => {
    switch (zone) {
      case 'qualification': return 'bg-blue-500';
      case 'playoff': return 'bg-primary';
      case 'relegation': return 'bg-red-500';
      default: return 'transparent';
    }
  };

  const getFormColor = (result: 'W' | 'D' | 'L') => {
    switch (result) {
      case 'W': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      case 'D': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'L': return 'bg-red-500/20 text-red-500 border-red-500/30';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass-card border border-white/10 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#060d0a]/60 text-slate-400 text-[10px] uppercase tracking-widest border-b border-white/5">
              <th className="py-4 px-4 font-bold text-center w-12">Pos</th>
              <th className="py-4 px-4 font-bold">Club</th>
              <th className="py-4 px-4 font-bold text-center">MJ</th>
              <th className="py-4 px-4 font-bold text-center">V</th>
              <th className="py-4 px-4 font-bold text-center">N</th>
              <th className="py-4 px-4 font-bold text-center">D</th>
              <th className="py-4 px-4 font-bold text-center">BM</th>
              <th className="py-4 px-4 font-bold text-center">BE</th>
              <th className="py-4 px-4 font-bold text-center">DB</th>
              <th className="py-4 px-4 font-bold text-center">Pts</th>
              <th className="py-4 px-4 font-bold text-center">Forme</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, index) => {
              const isTop3 = row.position <= 3;
              
              return (
                <tr 
                  key={row.id}
                  onClick={() => onClubClick(row)}
                  className={cn(
                    "group relative transition-all duration-300 cursor-pointer hover:bg-white/[0.03]",
                    isTop3 && "bg-primary/[0.02]"
                  )}
                >
                  {/* Indicateur de Zone */}
                  <td className="p-0 w-1">
                    <div className={cn("w-1 h-12", getZoneColor(row.zone))} />
                  </td>

                  {/* Position */}
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "text-sm font-mono",
                      isTop3 ? "text-primary font-black" : "text-slate-400"
                    )}>
                      {row.position.toString().padStart(2, '0')}
                    </span>
                  </td>

                  {/* Club */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "relative h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-110",
                        isTop3 && "shadow-[0_0_15px_rgba(203,160,65,0.2)] border-primary/30"
                      )}>
                        {row.clubLogo ? (
                          <img src={row.clubLogo} alt={row.clubName} className="object-contain" />
                        ) : (
                          <div className="text-[10px] font-bold text-slate-500">{row.clubName.substring(0, 2)}</div>
                        )}
                        {row.position === 1 && (
                          <div className="absolute -top-1.5 -right-1.5 bg-primary text-black rounded-full p-0.5 shadow-lg border border-[#0d1e19]">
                             <Trophy size={8} />
                          </div>
                        )}
                      </div>
                      <span className={cn(
                        "text-sm font-bold tracking-tight",
                        isTop3 ? "text-white" : "text-slate-300"
                      )}>
                        {row.clubName}
                      </span>
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="py-4 px-4 text-center text-sm font-mono text-slate-300">{row.played}</td>
                  <td className="py-4 px-4 text-center text-sm font-mono text-emerald-500/80">{row.won}</td>
                  <td className="py-4 px-4 text-center text-sm font-mono text-amber-500/80">{row.drawn}</td>
                  <td className="py-4 px-4 text-center text-sm font-mono text-red-500/80">{row.lost}</td>
                  <td className="py-4 px-4 text-center text-sm font-mono text-slate-400">{row.goalsFor}</td>
                  <td className="py-4 px-4 text-center text-sm font-mono text-slate-400">{row.goalsAgainst}</td>
                  <td className="py-4 px-4 text-center text-sm font-mono text-slate-400">
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </td>
                  
                  {/* Points */}
                  <td className="py-4 px-4 text-center">
                    <span className={cn(
                      "text-base font-black font-mono",
                      isTop3 ? "text-primary drop-shadow-[0_0_10px_rgba(203,160,65,0.4)]" : "text-white"
                    )}>
                      {row.points}
                    </span>
                  </td>

                  {/* Forme */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.map((res, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "w-6 h-6 rounded-md border flex items-center justify-center text-[10px] font-black transition-transform duration-300 group-hover:scale-110",
                            getFormColor(res)
                          )}
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          {res}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Légende */}
      <div className="bg-[#060d0a]/80 p-4 border-t border-white/5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Ligue des Champions CAF</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(203,160,65,0.5)]" />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Play-offs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Relégation</span>
        </div>
      </div>
    </div>
  );
}

function Trophy({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V18" /><path d="M14 22V18" /><path d="M12 4V18" /><path d="M12 4C10 4 6 5 6 9c0 4 1.33 6 4 6h4c2.67 0 4-2 4-6 0-4-4-5-6-5Z" />
    </svg>
  )
}
