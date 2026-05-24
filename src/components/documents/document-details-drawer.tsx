import React from 'react';
import { X, FileText, Download, Share2, Trash2, Edit2, User, Calendar, Database, History, Shield, Info, Tag, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FemaDocument, DocType } from './types';

interface DocumentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  document: FemaDocument | null;
  onDownload: (doc: FemaDocument) => void;
}

const getFileTypeIcon = (type: DocType) => {
  switch (type) {
    case 'PDF': return <FileText className="text-red-500" />;
    case 'DOCX': return <FileText className="text-blue-500" />;
    case 'XLSX': return <FileText className="text-emerald-500" />;
    case 'IMAGE': return <FileText className="text-purple-500" />;
    case 'ZIP': return <FileText className="text-amber-500" />;
    default: return <FileText className="text-slate-500" />;
  }
};

export function DocumentDetailsDrawer({ isOpen, onClose, document: doc, onDownload }: DocumentDetailsDrawerProps) {
  if (!doc) return null;

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
          "fixed inset-y-0 right-0 z-[201] w-full max-w-xl bg-[#0d1e19]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header Hero */}
        <div className="relative h-64 flex-shrink-0 overflow-hidden bg-[#060d0a]/40 border-b border-white/5">
           <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
           
           <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors border border-white/10"
           >
              <X size={20} />
           </button>

           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="relative w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl group">
                 <div className="scale-[2] opacity-80 transition-transform duration-700 group-hover:scale-[2.2] group-hover:rotate-3">
                   {getFileTypeIcon(doc.type)}
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-1">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight line-clamp-2">{doc.name}</h2>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{doc.type} • {doc.size}</p>
              </div>
           </div>
        </div>

        {/* Action Bar */}
        <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between gap-4">
           <Button 
            onClick={() => onDownload(doc)}
            className="flex-1 bg-primary text-black font-black uppercase tracking-widest text-[10px] h-10 rounded-xl hover:scale-[1.02] transition-all"
           >
              <Download size={14} className="mr-2" /> Télécharger
           </Button>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white">
                 <Share2 size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white">
                 <Edit2 size={16} />
              </Button>
           </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
           
           {/* General Info */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Info size={14} className="text-primary" /> Informations générales
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                 <DetailRow label="Catégorie" value={doc.category} />
                 <DetailRow label="Statut" value={doc.status} />
                 <DetailRow label="Auteur" value={doc.author} />
                 <DetailRow label="Date d'ajout" value={new Date(doc.uploadDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} />
                 <DetailRow label="Téléchargements" value={doc.downloads.toString()} />
              </div>
           </section>

           {/* Description */}
           <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <FileText size={14} className="text-primary" /> Description
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-6">
                 {doc.description || "Aucune description fournie pour ce document."}
              </p>
           </section>

           {/* Tags */}
           {doc.tags && doc.tags.length > 0 && (
             <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   <Tag size={14} className="text-primary" /> Mots-clés
                </h3>
                <div className="flex flex-wrap gap-2">
                   {doc.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 hover:text-primary transition-colors cursor-pointer">
                         #{tag}
                      </span>
                   ))}
                </div>
             </section>
           )}

           {/* History Mock */}
           <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <History size={14} className="text-primary" /> Historique des activités
              </h3>
              <div className="space-y-4 border-l-2 border-white/5 ml-2 pl-6">
                 <HistoryItem date="Aujourd'hui, 14:30" action="Aperçu par Admin" />
                 <HistoryItem date="Hier, 09:15" action="Mise à jour du statut en 'Public'" />
                 <HistoryItem date="12 Mai 2026" action="Document téléversé par Admin FemaFoot" />
              </div>
           </section>

           {/* Preview Link (Mock) */}
           <div className="pt-6">
              <button className="w-full flex items-center justify-center gap-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-all py-4 border-t border-white/5">
                 <ExternalLink size={14} /> Ouvrir l'aperçu plein écran
              </button>
           </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
       <span className="text-xs font-black text-slate-200">{value}</span>
    </div>
  );
}

function HistoryItem({ date, action }: { date: string; action: string }) {
  return (
    <div className="relative group">
       <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-white/10 border-2 border-[#0d1e19] group-hover:bg-primary transition-colors" />
       <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mb-0.5">{date}</p>
       <p className="text-xs font-medium text-slate-300">{action}</p>
    </div>
  );
}
