import React from 'react';
import { MoreVertical, Edit2, Trash2, Eye, ShoppingCart, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onOrder: (product: Product) => void;
}

export function ProductCard({ product, onView, onEdit, onDelete, onOrder }: ProductCardProps) {
  const stockPercentage = Math.min(100, (product.stock / 50) * 100); // 50 est le max pour le calcul de la barre
  
  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Rupture', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (product.stock <= 5) return { label: 'Faible stock', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Disponible', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  };

  const status = getStockStatus();

  return (
    <div className="group relative bg-[#060d0a]/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 shadow-2xl">
      
      {/* Badge Populaire */}
      {product.isPopular && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-primary text-black rounded-full shadow-[0_0_15px_rgba(203,160,65,0.4)]">
           <Zap size={12} fill="currentColor" />
           <span className="text-[10px] font-black uppercase tracking-widest">Populaire</span>
        </div>
      )}

      {/* Menu Actions */}
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="relative group/menu">
            <button className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
               <MoreVertical size={16} />
            </button>
            <div className="absolute top-full right-0 mt-2 w-32 bg-[#0d1e19] border border-white/10 rounded-xl shadow-2xl p-1 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all translate-y-2 group-hover/menu:translate-y-0">
               <button onClick={() => onEdit(product)} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <Edit2 size={12} /> Modifier
               </button>
               <button onClick={() => onDelete(product.id)} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={12} /> Supprimer
               </button>
            </div>
         </div>
      </div>

      {/* Product Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0a1411]">
         <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#060d0a] via-transparent to-transparent opacity-60" />
         
         {/* Quick Actions Overlay */}
         <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <button 
              onClick={() => onOrder(product)}
              disabled={product.stock === 0}
              className="flex-1 h-11 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 shadow-xl"
            >
               <ShoppingCart size={14} /> Commander
            </button>
            <button 
              onClick={() => onView(product)}
              className="w-11 h-11 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
            >
               <Eye size={18} />
            </button>
         </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
         <div className="space-y-1">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{product.category}</span>
               <div className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border", status.bg, status.color, "border-current/30")}>
                  {status.label}
               </div>
            </div>
            <h3 className="text-lg font-black text-white truncate group-hover:text-primary transition-colors uppercase tracking-tight">
               {product.name}
            </h3>
         </div>

         {/* Stock Gauge */}
         <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
               <span>Stock Actuel</span>
               <span className={product.stock <= 5 ? "text-amber-500" : "text-white"}>{product.stock} unités</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                className={cn(
                  "h-full transition-all duration-1000 ease-out",
                  product.stock === 0 ? "bg-red-500" : product.stock <= 5 ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ width: `${stockPercentage}%` }}
               />
            </div>
            {product.reserved > 0 && (
              <p className="text-[8px] font-bold text-primary/60 italic uppercase tracking-tighter">
                * {product.reserved} articles en cours de réservation
              </p>
            )}
         </div>

         <div className="flex items-end justify-between pt-2 border-t border-white/5">
            <div className="space-y-0.5">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Prix unitaire</p>
               <p className="text-2xl font-black text-white leading-none">
                  {product.price.toLocaleString()} <span className="text-xs text-primary font-bold tracking-normal">FCFA</span>
               </p>
            </div>
            <div className="flex flex-wrap gap-1 justify-end max-w-[100px]">
               {product.sizes.map(size => (
                  <span key={size} className="w-5 h-5 flex items-center justify-center border border-white/10 rounded-md text-[8px] font-black text-slate-400 group-hover:border-primary/30 transition-colors">
                     {size}
                  </span>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
