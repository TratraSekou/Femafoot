import React from 'react';
import { Calendar, MapPin, Ticket, Users, ArrowRight, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchBilletterie, MatchTicketStatus } from './types';

interface MatchCardProps {
  match: MatchBilletterie;
  onView: (match: MatchBilletterie) => void;
  onEdit: (match: MatchBilletterie) => void;
  onDelete: (id: string) => void;
  onReserve: (match: MatchBilletterie) => void;
}

export function MatchCard({ match, onView, onEdit, onDelete, onReserve }: MatchCardProps) {
  const totalCapacity = match.categories.reduce((acc, cat) => acc + cat.capacity, 0);
  const totalAvailable = match.categories.reduce((acc, cat) => acc + cat.available, 0);
  const occupancyRate = ((totalCapacity - totalAvailable) / totalCapacity) * 100;

  const getStatusStyles = (status: MatchTicketStatus) => {
    switch (status) {
      case 'Ouvert': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Presque complet': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Complet': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Fermé': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="group relative bg-[#060d0a]/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/30 shadow-2xl">
      
      {/* Background Gradient Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full" />
      
      {/* Top Section: Competition & Menu */}
      <div className="p-5 flex items-center justify-between border-b border-white/5 relative z-10">
         <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{match.competition}</span>
         <div className="relative group/menu">
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
               <MoreVertical size={16} />
            </button>
            <div className="absolute top-full right-0 mt-2 w-32 bg-[#0d1e19] border border-white/10 rounded-xl shadow-2xl p-1 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all translate-y-2 group-hover/menu:translate-y-0">
               <button onClick={() => onEdit(match)} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <Edit2 size={12} /> Modifier
               </button>
               <button onClick={() => onDelete(match.id)} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={12} /> Supprimer
               </button>
            </div>
         </div>
      </div>

      {/* Teams Section */}
      <div className="p-6 space-y-6">
         <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-3 flex-1 text-center">
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" />
               </div>
               <span className="text-[11px] font-black text-white uppercase tracking-tight">{match.homeTeam.name}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
               <div className="text-xl font-black text-primary italic tracking-tighter">VS</div>
               <div className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border", getStatusStyles(match.status))}>
                  {match.status}
               </div>
            </div>

            <div className="flex flex-col items-center gap-3 flex-1 text-center">
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" />
               </div>
               <span className="text-[11px] font-black text-white uppercase tracking-tight">{match.awayTeam.name}</span>
            </div>
         </div>

         {/* Match Info Grid */}
         <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
               <Calendar size={14} className="text-primary" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Date</span>
                  <span className="text-[10px] font-bold text-white">{match.date}</span>
               </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
               <MapPin size={14} className="text-primary" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Lieu</span>
                  <span className="text-[10px] font-bold text-white truncate w-24">{match.venue}</span>
               </div>
            </div>
         </div>

         {/* Occupancy Section */}
         <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
               <span className="text-slate-500">Places Disponibles</span>
               <span className="text-white">{totalAvailable} / {totalCapacity}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                 className={cn(
                  "h-full transition-all duration-1000 ease-out",
                  occupancyRate > 90 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : 
                  occupancyRate > 70 ? "bg-amber-500" : "bg-primary shadow-[0_0_10px_rgba(203,160,65,0.5)]"
                 )}
                 style={{ width: `${occupancyRate}%` }}
               />
            </div>
         </div>

         {/* Actions */}
         <div className="flex items-center gap-2 pt-4">
            <button 
              onClick={() => onReserve(match)}
              disabled={match.status === 'Complet' || match.status === 'Fermé'}
              className="flex-1 h-12 bg-primary text-black rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 shadow-[0_0_20px_rgba(203,160,65,0.2)]"
            >
               <Ticket size={16} /> Réserver Tickets
            </button>
            <button 
              onClick={() => onView(match)}
              className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 hover:border-primary/30 transition-all"
            >
               <Eye size={20} />
            </button>
         </div>
      </div>
    </div>
  );
}
