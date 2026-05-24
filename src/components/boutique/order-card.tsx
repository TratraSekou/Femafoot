import React, { useState, useEffect } from 'react';
import { Clock, User, ShoppingBag, CheckCircle2, XCircle, RefreshCcw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order, OrderStatus } from './types';

interface OrderCardProps {
  order: Order;
  onView: (order: Order) => void;
  onValidate: (id: string) => void;
  onCancel: (id: string) => void;
  onRestock: (id: string) => void;
}

export function OrderCard({ order, onView, onValidate, onCancel, onRestock }: OrderCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    if (order.status !== 'EN ATTENTE' && order.status !== 'EN TRAITEMENT') return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const expiry = new Date(order.expiresAt).getTime();
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
  }, [order.expiresAt, order.status]);

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case 'EN ATTENTE': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'EN TRAITEMENT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'VALIDÉE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'ANNULÉE': 
      case 'EXPIRÉE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'RÉCUPÉRÉE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="group bg-[#060d0a]/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Info Client & Produit */}
        <div className="flex items-center gap-4 flex-1">
           <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <ShoppingBag size={20} />
           </div>
           <div className="min-w-0">
              <h4 className="text-sm font-black text-white truncate uppercase tracking-tight">{order.productName}</h4>
              <div className="flex items-center gap-2 mt-1">
                 <User size={10} className="text-slate-500" />
                 <span className="text-[10px] font-bold text-slate-400 truncate">{order.clientName}</span>
                 <span className="text-slate-700">•</span>
                 <span className="text-[10px] font-black text-primary">Qté: {order.quantity}</span>
              </div>
           </div>
        </div>

        {/* Timer & Statut */}
        <div className="flex items-center gap-6">
           {(order.status === 'EN ATTENTE' || order.status === 'EN TRAITEMENT') && (
              <div className={cn(
                "flex flex-col items-end px-3 py-1.5 rounded-xl border transition-colors",
                isExpiringSoon ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-slate-300"
              )}>
                 <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Expiration</span>
                 <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                    <Clock size={12} className={cn(isExpiringSoon && "animate-pulse")} />
                    {timeLeft}
                 </div>
              </div>
           )}

           <div className="flex flex-col items-end gap-2">
              <span className={cn("px-2.5 py-1 border rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg", getStatusStyles(order.status))}>
                 {order.status}
              </span>
              <p className="text-[8px] font-bold text-slate-600 uppercase">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:ml-4 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-4">
           {order.status === 'EN ATTENTE' || order.status === 'EN TRAITEMENT' ? (
              <>
                <button 
                  onClick={() => onValidate(order.id)}
                  className="flex-1 sm:flex-none h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                   <CheckCircle2 size={12} /> Valider
                </button>
                <button 
                  onClick={() => onCancel(order.id)}
                  className="h-9 w-9 bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg flex items-center justify-center transition-all border border-white/5"
                  title="Annuler la commande"
                >
                   <XCircle size={16} />
                </button>
              </>
           ) : (order.status === 'EXPIRÉE' || order.status === 'ANNULÉE') && (
              <button 
                onClick={() => onRestock(order.id)}
                className="flex-1 sm:flex-none h-9 px-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                 <RefreshCcw size={12} /> Remettre en stock
              </button>
           )}
           <button 
            onClick={() => onView(order)}
            className="h-9 w-9 bg-white/5 text-slate-500 hover:text-white rounded-lg flex items-center justify-center transition-all border border-white/5"
           >
              <ArrowRight size={16} />
           </button>
        </div>

      </div>
    </div>
  );
}
