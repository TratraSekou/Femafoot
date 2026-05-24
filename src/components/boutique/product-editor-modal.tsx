import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Image as ImageIcon, Tag, Package, DollarSign, List, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Product, ProductCategory } from './types';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

const CATEGORIES: ProductCategory[] = ['Maillots', 'Équipements', 'Accessoires', 'Lifestyle'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Unique'];

export function ProductEditorModal({ isOpen, onClose, onSave, product }: ProductEditorModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Maillots',
    price: 0,
    sizes: [],
    stock: 0,
    image: '',
    description: '',
    isPopular: false,
  });

  useEffect(() => {
    if (product && isOpen) {
      setFormData(product);
    } else if (isOpen) {
      setFormData({
        name: '',
        category: 'Maillots',
        price: 0,
        sizes: [],
        stock: 0,
        image: '',
        description: '',
        isPopular: false,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalData = {
      ...formData,
      id: product?.id || Math.random().toString(36).substring(7),
      reserved: product?.reserved || 0,
    } as Product;
    onSave(finalData);
    onClose();
  };

  const toggleSize = (size: string) => {
    const current = formData.sizes || [];
    if (current.includes(size)) {
      setFormData({ ...formData, sizes: current.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...current, size] });
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-[#0d1e19] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
        <header className="px-8 py-6 border-b border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Package size={20} />
             </div>
             <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                   {product ? "Modifier l'article" : "Ajouter un produit"}
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Boutique FemaFoot Premium</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
             <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             
             {/* Left Column: Image & Basic Info */}
             <div className="space-y-8">
                <div className="relative aspect-square rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group overflow-hidden transition-all hover:border-primary/30">
                   {formData.image ? (
                      <>
                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          onClick={() => setFormData({...formData, image: ''})}
                          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
                        >
                           <X size={16} />
                        </button>
                      </>
                   ) : (
                      <>
                         <div className="p-4 rounded-full bg-white/5 text-slate-400 group-hover:text-primary transition-all">
                            <ImageIcon size={40} />
                         </div>
                         <div className="text-center px-4">
                            <p className="text-sm font-bold text-white">Image du produit</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase mt-1">PNG transparent recommandé</p>
                         </div>
                         <input 
                           type="file" 
                           className="absolute inset-0 opacity-0 cursor-pointer" 
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onload = (ev) => setFormData({...formData, image: ev.target?.result as string});
                               reader.readAsDataURL(file);
                             }
                           }}
                         />
                      </>
                   )}
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setFormData({...formData, isPopular: !formData.isPopular})}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          formData.isPopular ? "bg-primary text-black border-primary" : "bg-white/5 text-slate-500 border-white/10 hover:border-white/20"
                        )}
                      >
                         <Star size={14} fill={formData.isPopular ? "currentColor" : "none"} />
                         Mettre en avant (Populaire)
                      </button>
                   </div>
                </div>
             </div>

             {/* Right Column: Details */}
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                      <Tag size={12} className="text-primary" /> Nom de l'article
                   </label>
                   <input 
                     type="text"
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                     placeholder="Ex: Maillot Domicile 2024..."
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                         <List size={12} className="text-primary" /> Catégorie
                      </label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as ProductCategory})}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none font-bold"
                      >
                         {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="bg-[#0d1e19]">{cat}</option>
                         ))}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                         <DollarSign size={12} className="text-primary" /> Prix (FCFA)
                      </label>
                      <input 
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Tailles disponibles</label>
                   <div className="flex flex-wrap gap-2">
                      {SIZES.map(size => (
                         <button
                           key={size}
                           type="button"
                           onClick={() => toggleSize(size)}
                           className={cn(
                             "w-12 h-10 rounded-xl text-xs font-black uppercase transition-all border",
                             formData.sizes?.includes(size) 
                                ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(203,160,65,0.3)]" 
                                : "bg-white/5 text-slate-500 border-white/10 hover:border-white/20"
                           )}
                         >
                            {size}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                      <Package size={12} className="text-primary" /> Stock initial (Global)
                   </label>
                   <input 
                     type="number"
                     value={formData.stock}
                     onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                     className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Description du produit</label>
                   <textarea 
                     rows={4}
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-primary/50 resize-none font-medium leading-relaxed"
                     placeholder="Décrivez les caractéristiques du produit (tissu, coupe, design...)"
                   />
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center justify-end gap-3 flex-shrink-0">
           <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase tracking-widest text-xs">Annuler</Button>
           <Button 
            onClick={handleSave}
            disabled={!formData.name || !formData.image}
            className="bg-primary hover:bg-primary/90 text-black px-10 h-12 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-[0_0_20px_rgba(203,160,65,0.3)]"
           >
              <Save className="mr-2 h-4 w-4" />
              {product ? "Mettre à jour" : "Ajouter au catalogue"}
           </Button>
        </footer>

      </div>
    </div>
  );
}
