import React from 'react';
import { X, Calendar, MapPin, Users, Ticket, TrendingUp, History, Info, Share2, Phone, User, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StadiumView } from './stadium-view';
import { MatchBilletterie, TicketReservation } from './types';

interface MatchDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchBilletterie | null;
  reservations: TicketReservation[];
  onReserve: (match: MatchBilletterie) => void;
}

export function MatchDetailsDrawer({ isOpen, onClose, match, reservations, onReserve }: MatchDetailsDrawerProps) {
  if (!match) return null;

  const totalCapacity = match.categories.reduce((acc, cat) => acc + cat.capacity, 0);
  const totalAvailable = match.categories.reduce((acc, cat) => acc + cat.available, 0);
  const totalReserved = match.categories.reduce((acc, cat) => acc + cat.reserved, 0);

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-[201] w-full max-w-2xl bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header Hero */}
        <header className="relative h-[30vh] flex-shrink-0 bg-gradient-to-br from-[#060d0a] to-[#132820] border-b border-white/5 overflow-hidden flex items-center justify-center p-8">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           
           <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors border border-white/10">
              <X size={20} />
           </button>

           <div className="relative z-10 flex items-center gap-10 w-full justify-center">
              <div className="flex flex-col items-center gap-2">
                 <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-center">
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain" />
                 </div>
                 <span className="text-xs font-black text-white uppercase">{match.homeTeam.name}</span>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-2xl font-black text-primary italic italic">VS</span>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{match.time}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-center">
                    <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain" />
                 </div>
                 <span className="text-xs font-black text-white uppercase">{match.awayTeam.name}</span>
              </div>
           </div>
        </header>

        {/* Action Bar */}
        <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between gap-4">
           <Button 
            disabled={match.status === 'Complet' || match.status === 'Fermé'}
            onClick={() => onReserve(match)}
            className="flex-1 bg-primary text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(203,160,65,0.3)] disabled:opacity-50"
           >
              <Ticket size={16} className="mr-2" /> Réserver des tickets
           </Button>
           <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white">
              <Share2 size={18} />
           </Button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
           
           {/* Stadium Visualization */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Users size={14} className="text-primary" /> Visualisation du Stade (Modèle Abstrait)
              </h3>
              <StadiumView categories={match.categories} />
           </section>

           {/* Detailed Stats */}
           <section className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Capacité</p>
                 <p className="text-lg font-black text-white">{totalCapacity}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Occupées</p>
                 <p className="text-lg font-black text-emerald-500">{totalCapacity - totalAvailable}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Bloquées</p>
                 <p className="text-lg font-black text-primary">{totalReserved}</p>
              </div>
           </section>

           {/* Categories List */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <TrendingUp size={14} className="text-primary" /> Tarification & Disponibilité
              </h3>
              <div className="grid grid-cols-1 gap-2">
                 {match.categories.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={cn("w-2 h-8 rounded-full", 
                             cat.name === 'VIP' ? 'bg-amber-500' : 
                             cat.name === 'Tribune' ? 'bg-primary' : 
                             'bg-emerald-500'
                          )} />
                          <div>
                             <p className="text-xs font-black text-white uppercase">{cat.name}</p>
                             <p className="text-[10px] font-bold text-primary">{cat.price.toLocaleString()} FCFA</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-white">{cat.available} places</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase">sur {cat.capacity}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           {/* Recent Reservations */}
           <section className="space-y-6 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <History size={14} className="text-primary" /> Réservations Récentes
              </h3>
              <div className="space-y-3">
                 {reservations.length > 0 ? reservations.slice(0, 5).map(res => (
                    <div key={res.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                             <User size={14} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white uppercase">{res.clientName}</p>
                             <p className="text-[8px] text-slate-500">{res.category} x{res.quantity}</p>
                          </div>
                       </div>
                       <div className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase border", 
                          res.status === 'VALIDÉE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                       )}>
                          {res.status}
                       </div>
                    </div>
                 )) : (
                    <div className="p-8 text-center border border-white/5 border-dashed rounded-2xl">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Aucune réservation pour le moment</p>
                    </div>
                 )}
              </div>
           </section>

        </div>
      </div>
    </>
  );
}
