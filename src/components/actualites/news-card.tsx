import React from 'react';
import { Eye, Clock, User, MessageCircle, Share2, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsArticle, NewsStatus } from './types';
import Image from 'next/image';

interface NewsCardProps {
  article: NewsArticle;
  onView: (article: NewsArticle) => void;
  onEdit: (article: NewsArticle) => void;
  onDelete: (id: string) => void;
}

const getStatusStyles = (status: NewsStatus) => {
  switch (status) {
    case 'Publié': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Brouillon': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'Programmé': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Archivé': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
};

export function NewsCard({ article, onView, onEdit, onDelete }: NewsCardProps) {
  return (
    <div 
      onClick={() => onView(article)}
      className="group relative flex flex-col bg-[#060d0a]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 cursor-pointer shadow-xl"
    >
      {/* Image de couverture */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        {article.coverImage ? (
           <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-slate-500">
             Image Actualité
          </div>
        )}
        
        {/* Badge Catégorie */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
            {article.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 right-4 z-20">
          <span className={cn("px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-tighter", getStatusStyles(article.status))}>
            {article.status}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           <span className="flex items-center gap-1"><User size={12} className="text-primary" /> {article.author}</span>
           <span>•</span>
           <span className="flex items-center gap-1" suppressHydrationWarning>
             <Clock size={12} /> {new Date(article.publishDate).toLocaleDateString('fr-FR')}
           </span>
        </div>

        <h3 className="text-lg font-black text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Métadonnées & Actions */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors"><Eye size={14} /> {article.views}</span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MessageCircle size={14} /> 12</span>
           </div>
           
           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(article); }}
                className="p-2 rounded-full bg-white/5 hover:bg-secondary text-white hover:text-secondary-foreground transition-all"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(article.id); }}
                className="p-2 rounded-full bg-white/5 hover:bg-destructive text-white transition-all"
              >
                <Trash2 size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedNewsCard({ article, onView }: { article: NewsArticle; onView: (article: NewsArticle) => void }) {
  return (
    <div 
      onClick={() => onView(article)}
      className="group relative h-[400px] w-full rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/10"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-emerald-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative h-full w-full bg-[#060d0a]">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
        
        {article.coverImage && (
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
        )}

        <div className="relative z-30 h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl gap-4">
          <div className="flex items-center gap-3">
             <span className="px-4 py-1.5 bg-primary text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg">
                À la une
             </span>
             <span className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                {article.category}
             </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter transition-all group-hover:translate-x-2">
            {article.title}
          </h2>

          <p className="text-slate-300 text-sm md:text-base line-clamp-2 leading-relaxed opacity-80">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-6 mt-4">
             <div className="flex items-center gap-2 text-xs font-bold text-white">
                <User size={16} className="text-primary" /> {article.author}
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400" suppressHydrationWarning>
                <Clock size={16} /> {new Date(article.publishDate).toLocaleDateString('fr-FR')}
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Eye size={16} /> {article.views} vues
             </div>
          </div>
        </div>

        {/* Action button reveal */}
        <div className="absolute bottom-12 right-12 z-30 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
           <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
              Lire l'article <Share2 size={16} />
           </button>
        </div>
      </div>
    </div>
  );
}
