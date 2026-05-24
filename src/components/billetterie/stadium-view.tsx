import React from 'react';
import { cn } from '@/lib/utils';
import { TicketCategory } from './types';

interface StadiumViewProps {
  categories: TicketCategory[];
}

export function StadiumView({ categories }: StadiumViewProps) {
  const getSectionStatus = (name: string) => {
    const category = categories.find(c => c.name === name);
    if (!category) return { color: 'fill-slate-800', opacity: '0.3' };
    
    const rate = ((category.capacity - category.available) / category.capacity) * 100;
    if (rate >= 100) return { color: 'fill-red-500', opacity: '0.8', label: 'Complet' };
    if (rate >= 80) return { color: 'fill-amber-500', opacity: '0.6', label: 'Faible' };
    return { color: 'fill-emerald-500', opacity: '0.4', label: 'Disponible' };
  };

  const sections = [
    { id: 'VIP', d: "M 300,50 L 500,50 L 550,150 L 250,150 Z", label: 'VIP' }, // Top
    { id: 'Tribune', d: "M 250,450 L 550,450 L 600,550 L 200,550 Z", label: 'Tribune' }, // Bottom
    { id: 'Pelouse', d: "M 50,200 L 150,200 L 150,400 L 50,400 Z", label: 'Pelouse' }, // Left
    { id: 'Standard', d: "M 650,200 L 750,200 L 750,400 L 650,400 Z", label: 'Standard' }, // Right
  ];

  return (
    <div className="relative w-full aspect-[4/3] bg-black/40 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Stadium Glow */}
      <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] rounded-full scale-75" />

      {/* SVG Stadium Map */}
      <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
         {/* Field */}
         <rect x="200" y="200" width="400" height="200" rx="10" className="fill-emerald-600/20 stroke-emerald-500/30 stroke-2" />
         <circle cx="400" cy="300" r="40" className="fill-none stroke-emerald-500/20 stroke-1" />
         <line x1="400" y1="200" x2="400" y2="400" className="stroke-emerald-500/20 stroke-1" />

         {/* Sections */}
         {sections.map((section) => {
            const status = getSectionStatus(section.id);
            return (
              <g key={section.id} className="cursor-help transition-all duration-500 hover:scale-[1.02] transform-gpu origin-center group">
                 <path 
                  d={section.d} 
                  className={cn("transition-all duration-500 stroke-white/10 stroke-1", status.color)} 
                  style={{ fillOpacity: status.opacity }}
                 />
                 <text 
                  x={section.id === 'Pelouse' ? 100 : section.id === 'Standard' ? 700 : 400} 
                  y={section.id === 'VIP' ? 100 : section.id === 'Tribune' ? 500 : 300}
                  className="fill-white text-[10px] font-black uppercase tracking-widest text-center"
                  textAnchor="middle"
                 >
                    {section.label}
                 </text>
                 
                 {/* Tooltip-like info on hover */}
                 <rect 
                  x="350" y="280" width="100" height="40" rx="8" 
                  className="fill-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                 />
              </g>
            );
         })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-6 border-t border-white/5 pt-4">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Disponible</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Faible</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Complet</span>
         </div>
      </div>
    </div>
  );
}
