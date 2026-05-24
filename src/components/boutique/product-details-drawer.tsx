import React from 'react';
import { X, ShoppingCart, Zap, BarChart3, Package, History, Info, ExternalLink, Ruler, Share2, Tag, Calendar, Database, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Product, Order } from './types';

interface ProductDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  productOrders: Order[];
  onOrder: (product: Product) => void;
}

export function ProductDetailsDrawer({ isOpen, onClose, product, productOrders, onOrder }: ProductDetailsDrawerProps) {
  if (!product) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-[201] w-full max-w-2xl bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header Hero */}
        <div className="relative h-[40vh] flex-shrink-0 overflow-hidden bg-[#060d0a]/60 border-b border-white/5 group">
           <img 
            src={product.image} 
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
            alt={product.name} 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0d1e19] via-transparent to-black/40" />
           
           <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors border border-white/10"
           >
              <X size={20} />
           </button>

           <div className="absolute bottom-8 left-8 right-8 space-y-2">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                    {product.category}
                 </span>
                 {product.isPopular && (
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">
                       <Zap size={10} className="inline mr-1" fill="currentColor" /> Populaire
                    </span>
                 )}
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">{product.name}</h2>
              <p className="text-3xl font-black text-primary">{product.price.toLocaleString()} <span className="text-sm font-bold text-white/40 ml-1">FCFA</span></p>
           </div>
        </div>

        {/* Action Bar */}
        <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between gap-4">
           <Button 
            disabled={product.stock === 0}
            onClick={() => onOrder(product)}
            className="flex-1 bg-primary text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(203,160,65,0.3)] disabled:opacity-50"
           >
              <ShoppingCart size={16} className="mr-2" /> Créer une commande
           </Button>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white">
                 <Share2 size={18} />
              </Button>
           </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
           
           {/* Stock & Stats Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-3 opacity-10"><Package size={40} /></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stock disponible</p>
                 <p className="text-2xl font-black text-white">{product.stock}</p>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} />
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-3 opacity-10"><Clock size={40} /></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">En réservation</p>
                 <p className="text-2xl font-black text-primary">{product.reserved}</p>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (product.reserved / 10) * 100)}%` }} />
                 </div>
              </div>
           </div>

           {/* Description */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Info size={14} className="text-primary" /> Détails de l'article
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-6 font-medium">
                 {product.description || "Aucune description détaillée disponible pour cet article."}
              </p>
           </section>

           {/* Tailles */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Ruler size={14} className="text-primary" /> Tailles incluses dans ce stock
              </h3>
              <div className="flex flex-wrap gap-2">
                 {product.sizes.map(size => (
                    <span key={size} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white">
                       {size}
                    </span>
                 ))}
              </div>
           </section>

           {/* History / Orders */}
           <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <History size={14} className="text-primary" /> Historique des commandes récentes
              </h3>
              <div className="space-y-3">
                 {productOrders.length > 0 ? productOrders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                             <User size={14} />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white">{order.clientName}</p>
                             <p className="text-[10px] text-slate-500">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-primary">Qté: {order.quantity}</p>
                          <p className={cn("text-[8px] font-black uppercase tracking-widest", 
                             order.status === 'VALIDÉE' ? 'text-emerald-500' : 'text-slate-500'
                          )}>{order.status}</p>
                       </div>
                    </div>
                 )) : (
                    <div className="p-8 text-center border border-white/5 border-dashed rounded-2xl">
                       <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Aucune commande pour le moment</p>
                    </div>
                 )}
              </div>
           </section>

        </div>
      </div>
    </>
  );
}
