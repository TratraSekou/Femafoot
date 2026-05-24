import React, { useEffect, useState } from 'react';
import { X, Calendar, User, Eye, MessageCircle, Share2, Tag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsArticle } from './types';

interface NewsDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle | null;
}

export function NewsDetailsDrawer({ isOpen, onClose, article }: NewsDetailsDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted && !isOpen) return null;
  if (!article) return null;

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-[201] w-full max-w-4xl bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header Hero Area */}
        <div className="relative h-[400px] flex-shrink-0">
           <div className="absolute inset-0 bg-gradient-to-t from-[#0d1e19] via-transparent to-transparent z-10" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10" />
           
           <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-30 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all border border-white/10"
           >
              <X size={20} />
           </button>

           {article.coverImage ? (
             <img src={article.coverImage} className="w-full h-full object-cover" alt={article.title} />
           ) : (
             <div className="w-full h-full bg-[#132820] flex items-center justify-center text-slate-500">
                Image Actualité
             </div>
           )}

           <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 space-y-6">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 bg-primary text-black text-xs font-black uppercase tracking-widest rounded-xl shadow-lg">
                    {article.category}
                 </span>
                 <div className="flex items-center gap-4 text-xs font-bold text-white/60">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {new Date(article.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><User size={14} className="text-primary" /> {article.author}</span>
                 </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter">
                 {article.title}
              </h2>
           </div>
        </div>

        {/* Article Body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
           
           {/* Summary Area */}
           <div className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/5">
              <div className="absolute top-0 left-8 -translate-y-1/2 bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Résumé
              </div>
              <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed italic opacity-90">
                 "{article.excerpt}"
              </p>
           </div>

           {/* Full Content */}
           <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                 {article.content || "Contenu de l'article en cours de rédaction..."}
              </p>
           </div>

           {/* Interactive Footer (Tags, Share) */}
           <div className="pt-12 border-t border-white/5 space-y-8">
              {article.tags && article.tags.length > 0 && (
                 <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                       <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer">
                          <Tag size={12} /> {tag}
                       </span>
                    ))}
                 </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-1">
                       <span className="text-2xl font-black text-white">{article.views}</span>
                       <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Lectures</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-center gap-1">
                       <span className="text-2xl font-black text-white">12</span>
                       <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Réactions</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all border border-white/10">
                       <Share2 size={16} /> Partager
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-black px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">
                       S'abonner <ArrowRight size={16} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Comments Section Mock */}
           <div className="space-y-6 pb-12">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <MessageCircle size={18} className="text-primary" /> Commentaires (12)
              </h3>
              <div className="space-y-4">
                 {[1, 2].map(i => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 shrink-0" />
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-white">Utilisateur Malien #{i}</p>
                          <p className="text-sm text-slate-400">Super article ! Allez les Aigles ! 🇲🇱⚽️</p>
                          <p className="text-[10px] text-slate-600 font-medium">Il y a {i*2}h</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </>
  );
}
