import React from 'react';
import { X, User, Phone, MapPin, Mail, ShoppingBag, Clock, CheckCircle2, XCircle, Info, Calendar, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus } from './types';

interface OrderDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onValidate: (id: string) => void;
  onCancel: (id: string) => void;
}

export function OrderDetailsDrawer({ isOpen, onClose, order, onValidate, onCancel }: OrderDetailsDrawerProps) {
  if (!order) return null;

  const getStatusStyles = (status: OrderStatus) => {
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
        {/* Header */}
        <header className="px-8 py-6 border-b border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                 <ShoppingBag size={20} />
              </div>
              <div>
                 <h2 className="text-lg font-black text-white uppercase tracking-tight">Détails de la commande</h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">ID: {order.id}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
              <X size={20} />
           </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
           
           {/* Statut Hero */}
           <div className={cn("p-6 rounded-2xl border flex items-center justify-between", getStatusStyles(order.status))}>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Statut actuel</p>
                 <p className="text-xl font-black">{order.status}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Date commande</p>
                 <p className="text-sm font-bold">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
              </div>
           </div>

           {/* Client Info */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <User size={14} className="text-primary" /> Informations Client
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                 <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                       <User size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom Complet</p>
                       <p className="text-sm font-black text-white">{order.clientName}</p>
                    </div>
                 </div>
                 <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                       <Phone size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Téléphone</p>
                       <p className="text-sm font-black text-white">{order.clientPhone}</p>
                    </div>
                 </div>
                 <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                       <MapPin size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quartier / Localisation</p>
                       <p className="text-sm font-black text-white">{order.clientNeighborhood}</p>
                    </div>
                 </div>
                 {order.clientEmail && (
                    <div className="p-4 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                          <Mail size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</p>
                          <p className="text-sm font-black text-white">{order.clientEmail}</p>
                       </div>
                    </div>
                 )}
              </div>
           </section>

           {/* Product Info */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <ShoppingBag size={14} className="text-primary" /> Article Commandé
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                 <div>
                    <p className="text-base font-black text-white">{order.productName}</p>
                    <p className="text-xs font-bold text-primary mt-1">Quantité: {order.quantity}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Produit</p>
                    <p className="text-xs font-bold text-slate-400">{order.productId}</p>
                 </div>
              </div>
           </section>

           {/* Reservation Expiry */}
           {(order.status === 'EN ATTENTE' || order.status === 'EN TRAITEMENT') && (
              <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={24} className="animate-pulse" />
                 </div>
                 <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">Réservation en cours</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                       Cette commande expirera automatiquement si elle n'est pas validée avant le :
                       <br />
                       <span className="text-primary font-bold">{new Date(order.expiresAt).toLocaleString('fr-FR')}</span>
                    </p>
                 </div>
              </section>
           )}

        </div>

        {/* Footer Actions */}
        {(order.status === 'EN ATTENTE' || order.status === 'EN TRAITEMENT') && (
          <footer className="px-8 py-6 border-t border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center gap-3">
             <Button 
               onClick={() => { onCancel(order.id); onClose(); }}
               variant="ghost" 
               className="flex-1 border border-white/10 text-red-500 hover:bg-red-500/10 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
             >
                <XCircle size={16} className="mr-2" /> Annuler
             </Button>
             <Button 
               onClick={() => { onValidate(order.id); onClose(); }}
               className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-900/20"
             >
                <CheckCircle2 size={16} className="mr-2" /> Valider la commande
             </Button>
          </footer>
        )}

      </div>
    </>
  );
}
