import React from 'react';
import { X, User, Phone, MapPin, Mail, Ticket, Clock, CheckCircle2, XCircle, Info, Calendar, Database, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TicketReservation, ReservationStatus } from './types';

interface ReservationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: TicketReservation | null;
  onValidate: (id: string) => void;
  onCancel: (id: string) => void;
}

export function ReservationDetailsDrawer({ isOpen, onClose, reservation, onValidate, onCancel }: ReservationDetailsDrawerProps) {
  if (!reservation) return null;

  const getStatusStyles = (status: ReservationStatus) => {
    switch (status) {
      case 'EN ATTENTE': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'EN TRAITEMENT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'VALIDÉE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ANNULÉE': 
      case 'EXPIRÉE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

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
          "fixed inset-y-0 right-0 z-[201] w-full max-w-lg bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="px-8 py-6 border-b border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                 <Ticket size={20} />
              </div>
              <div>
                 <h2 className="text-lg font-black text-white uppercase tracking-tight">Détails Réservation</h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">ID: {reservation.id}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
              <X size={20} />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
           
           <div className={cn("p-6 rounded-2xl border flex items-center justify-between", getStatusStyles(reservation.status))}>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Statut réservation</p>
                 <p className="text-xl font-black">{reservation.status}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total à payer</p>
                 <p className="text-lg font-black">{reservation.totalPrice.toLocaleString()} FCFA</p>
              </div>
           </div>

           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <User size={14} className="text-primary" /> Informations Détenteur
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/5">
                 <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400"><User size={18} /></div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom</p>
                       <p className="text-sm font-black text-white">{reservation.clientName}</p>
                    </div>
                 </div>
                 <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400"><Phone size={18} /></div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Téléphone</p>
                       <p className="text-sm font-black text-white">{reservation.clientPhone}</p>
                    </div>
                 </div>
                 <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400"><MapPin size={18} /></div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quartier</p>
                       <p className="text-sm font-black text-white">{reservation.clientNeighborhood}</p>
                    </div>
                 </div>
              </div>
           </section>

           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Trophy size={14} className="text-primary" /> Détails du Match
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                 <p className="text-base font-black text-white uppercase tracking-tight">{reservation.matchName}</p>
                 <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                       <Ticket size={12} className="text-primary" />
                       <span className="text-[11px] font-black text-white">{reservation.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Database size={12} className="text-primary" />
                       <span className="text-[11px] font-black text-white">x{reservation.quantity} Tickets</span>
                    </div>
                 </div>
              </div>
           </section>

           {(reservation.status === 'EN ATTENTE' || reservation.status === 'EN TRAITEMENT') && (
              <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={24} className="animate-pulse" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-white uppercase tracking-widest">Blocage temporaire</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                       Ces places sont réservées jusqu'au :<br />
                       <span className="text-primary font-bold">{new Date(reservation.expiresAt).toLocaleString('fr-FR')}</span>
                    </p>
                 </div>
              </section>
           )}

        </div>

        {(reservation.status === 'EN ATTENTE' || reservation.status === 'EN TRAITEMENT') && (
          <footer className="px-8 py-6 border-t border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center gap-3">
             <Button 
               onClick={() => { onCancel(reservation.id); onClose(); }}
               variant="ghost" 
               className="flex-1 border border-white/10 text-red-500 hover:bg-red-500/10 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
             >
                <XCircle size={16} className="mr-2" /> Annuler
             </Button>
             <Button 
               onClick={() => { onValidate(reservation.id); onClose(); }}
               className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-900/20"
             >
                <CheckCircle2 size={16} className="mr-2" /> Valider & Confirmer
             </Button>
          </footer>
        )}

      </div>
    </>
  );
}
