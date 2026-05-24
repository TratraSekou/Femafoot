import React, { useState, useEffect } from 'react';
import { Clock, User, Ticket, CheckCircle2, XCircle, RefreshCcw, ArrowRight, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TicketReservation, ReservationStatus } from './types';

interface ReservationCardProps {
  reservation: TicketReservation;
  onView: (reservation: TicketReservation) => void;
  onValidate: (id: string) => void;
  onCancel: (id: string) => void;
  onRelase: (id: string) => void;
}

export function ReservationCard({ reservation, onView, onValidate, onCancel, onRelase }: ReservationCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    if (reservation.status !== 'EN ATTENTE' && reservation.status !== 'EN TRAITEMENT') return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const expiry = new Date(reservation.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRÉ');
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setIsExpiringSoon(hours < 1);
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [reservation.expiresAt, reservation.status]);

  const getStatusStyles = (status: ReservationStatus) => {
    switch (status) {
      case 'EN ATTENTE': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'EN TRAITEMENT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'VALIDÉE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ANNULÉE': 
      case 'EXPIRÉE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'UTILISÉE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="group bg-[#060d0a]/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Info Client & Match */}
        <div className="flex items-center gap-4 flex-1">
           <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Ticket size={20} />
           </div>
           <div className="min-w-0">
              <h4 className="text-sm font-black text-white truncate uppercase tracking-tight">{reservation.matchName}</h4>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                 <div className="flex items-center gap-1.5">
                    <User size={10} className="text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-400">{reservation.clientName}</span>
                 </div>
                 <span className="text-slate-700">•</span>
                 <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20 uppercase tracking-tighter">
                       {reservation.category} x{reservation.quantity}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Timer & Statut */}
        <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
           {(reservation.status === 'EN ATTENTE' || reservation.status === 'EN TRAITEMENT') && (
              <div className={cn(
                "flex flex-col items-end px-3 py-1.5 rounded-xl border transition-colors",
                isExpiringSoon ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-slate-400"
              )}>
                 <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Expiration</span>
                 <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                    <Clock size={12} className={cn(isExpiringSoon && "animate-pulse")} />
                    {timeLeft}
                 </div>
              </div>
           )}

           <div className="flex flex-col items-end gap-2">
              <span className={cn("px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg", getStatusStyles(reservation.status))}>
                 {reservation.status}
              </span>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{reservation.totalPrice.toLocaleString()} FCFA</p>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
           {reservation.status === 'EN ATTENTE' || reservation.status === 'EN TRAITEMENT' ? (
              <>
                <button 
                  onClick={() => onValidate(reservation.id)}
                  className="flex-1 lg:flex-none h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                   <CheckCircle2 size={14} /> Valider
                </button>
                <button 
                  onClick={() => onCancel(reservation.id)}
                  className="h-10 w-10 bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl flex items-center justify-center transition-all border border-white/5"
                  title="Annuler"
                >
                   <XCircle size={18} />
                </button>
              </>
           ) : (reservation.status === 'EXPIRÉE' || reservation.status === 'ANNULÉE') && (
              <button 
                onClick={() => onRelase(reservation.id)}
                className="flex-1 lg:flex-none h-10 px-5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                 <RefreshCcw size={14} /> Relâcher les places
              </button>
           )}
           <button 
            onClick={() => onView(reservation)}
            className="h-10 w-10 bg-white/5 text-slate-500 hover:text-white rounded-xl flex items-center justify-center transition-all border border-white/5"
           >
              <ArrowRight size={18} />
           </button>
        </div>

      </div>
    </div>
  );
}
