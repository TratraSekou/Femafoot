import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Eye, Send, FileText, Image as ImageIcon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsArticle, NewsStatus } from './types';

interface NewsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: NewsArticle) => void;
  article: NewsArticle | null;
}

export function NewsEditorModal({ isOpen, onClose, onSave, article }: NewsEditorModalProps) {
  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'National',
    author: 'Admin FemaFoot',
    status: 'Brouillon',
    coverImage: '',
    tags: [],
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'National',
        author: 'Admin FemaFoot',
        status: 'Brouillon',
        coverImage: '',
        tags: [],
      });
    }
  }, [article, isOpen]);

  if (!isOpen) return null;

  const handleSave = (statusOverride?: NewsStatus) => {
    const finalData = {
      ...formData,
      id: article?.id || Math.random().toString(36).substring(7),
      publishDate: formData.publishDate || new Date().toISOString(),
      views: formData.views || 0,
      slug: formData.title?.toLowerCase().replace(/ /g, '-') || '',
      status: statusOverride || formData.status || 'Brouillon',
    } as NewsArticle;
    onSave(finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#0d1e19] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header de l'éditeur */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#060d0a]/60 backdrop-blur-md">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                 <FileText size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    {article ? "Modifier l'article" : "Rédiger une actualité"}
                 </h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                    Mode Édition {formData.status && `• ${formData.status}`}
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                 <X size={20} />
              </button>
           </div>
        </header>

        {/* Corps de l'éditeur */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
           
           {/* Zone de saisie principale */}
           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar border-r border-white/5">
              
              {/* Image de couverture */}
              <div className="relative h-64 w-full rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] group overflow-hidden transition-all hover:border-primary/30">
                 {formData.coverImage ? (
                    <div className="relative h-full w-full">
                       <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                       <button 
                        onClick={() => setFormData({...formData, coverImage: ''})}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
                       >
                          <X size={16} />
                       </button>
                    </div>
                 ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer">
                       <div className="p-4 rounded-full bg-white/5 text-slate-400 group-hover:text-primary transition-colors">
                          <ImageIcon size={32} />
                       </div>
                       <div className="text-center">
                          <p className="text-sm font-bold text-white">Ajouter une image de couverture</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Recommandé : 1920x1080px • Max 5MB</p>
                       </div>
                       <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onload = (ev) => setFormData({...formData, coverImage: ev.target?.result as string});
                             reader.readAsDataURL(file);
                          }
                        }}
                       />
                    </div>
                 )}
              </div>

              {/* Titre */}
              <div className="space-y-3">
                 <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest px-1">Titre de l'actualité</label>
                 <input 
                    type="text"
                    placeholder="Entrez un titre percutant..."
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-transparent text-3xl md:text-4xl font-black text-white placeholder:text-white/10 border-none focus:ring-0 p-0"
                 />
              </div>

              {/* Extrait */}
              <div className="space-y-3">
                 <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest px-1">Extrait court (Introduction)</label>
                 <textarea 
                    placeholder="Résumez l'article en deux phrases..."
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all resize-none"
                 />
              </div>

              {/* Contenu Riche (Mock) */}
              <div className="space-y-3">
                 <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest px-1">Corps de l'article</label>
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[300px] flex flex-col">
                    {/* Toolbar Mock */}
                    <div className="flex items-center gap-4 pb-6 mb-6 border-b border-white/5">
                       <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">B</button>
                       <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors underline">U</button>
                       <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">I</button>
                       <div className="w-px h-6 bg-white/5 mx-2" />
                       <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">Lien</button>
                       <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors">Liste</button>
                    </div>
                    <textarea 
                       placeholder="Racontez votre histoire..."
                       value={formData.content}
                       onChange={(e) => setFormData({...formData, content: e.target.value})}
                       className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 leading-relaxed resize-none text-base"
                    />
                 </div>
              </div>

           </div>

           {/* Sidebar de configuration */}
           <div className="w-full md:w-80 bg-[#060d0a]/40 p-8 space-y-8 overflow-y-auto custom-scrollbar">
              
              <div className="space-y-6">
                 <h3 className="text-[10px] uppercase font-black text-slate-500 flex items-center gap-2">
                    <Settings size={14} /> Paramètres de publication
                 </h3>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Catégorie</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                    >
                       <option value="National" className="bg-[#0d1e19]">Équipe Nationale</option>
                       <option value="Championnat" className="bg-[#0d1e19]">Championnat</option>
                       <option value="Communique" className="bg-[#0d1e19]">Communiqué</option>
                       <option value="International" className="bg-[#0d1e19]">International</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Auteur</label>
                    <input 
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tags (Séparés par virgule)</label>
                    <input 
                      type="text"
                      placeholder="Foot, Mali, CAF..."
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                      onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                    />
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                 <button 
                  onClick={() => handleSave('Publié')}
                  className="w-full flex items-center justify-center gap-3 bg-primary text-black h-12 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(203,160,65,0.3)]"
                 >
                    <Send size={16} /> Publier maintenant
                 </button>
                 <button 
                  onClick={() => handleSave('Brouillon')}
                  className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white h-12 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                 >
                    <Save size={16} /> Enregistrer Brouillon
                 </button>
                 <button className="w-full flex items-center justify-center gap-3 text-slate-500 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
                    <Eye size={16} /> Aperçu en ligne
                 </button>
              </div>

           </div>

        </div>

      </div>
    </div>
  );
}
