import React from 'react';
import { FileText, FileSpreadsheet, FileImage, FileArchive, FileCode, MoreVertical, Download, Eye, Share2, Trash2, Edit2, User, Calendar, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FemaDocument, DocType, DocStatus } from './types';

interface DocumentCardProps {
  document: FemaDocument;
  onView: (doc: FemaDocument) => void;
  onDownload: (doc: FemaDocument) => void;
  onEdit: (doc: FemaDocument) => void;
  onDelete: (id: string) => void;
}

const getFileTypeIcon = (type: DocType) => {
  switch (type) {
    case 'PDF': return <FileText className="text-red-500" />;
    case 'DOCX': return <FileText className="text-blue-500" />;
    case 'XLSX': return <FileSpreadsheet className="text-emerald-500" />;
    case 'IMAGE': return <FileImage className="text-purple-500" />;
    case 'ZIP': return <FileArchive className="text-amber-500" />;
    default: return <FileCode className="text-slate-500" />;
  }
};

const getStatusStyles = (status: DocStatus) => {
  switch (status) {
    case 'Public': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Privé': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Brouillon': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'Archivé': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
};

export function DocumentCard({ document, onView, onDownload, onEdit, onDelete }: DocumentCardProps) {
  return (
    <div className="group relative bg-[#060d0a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 shadow-xl overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
      
      <div className="relative z-10 space-y-4">
        {/* Header: Icon & Status */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
             {getFileTypeIcon(document.type)}
          </div>
          <span className={cn("px-2 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-tighter", getStatusStyles(document.status))}>
            {document.status}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-base font-black text-white truncate pr-6 group-hover:text-primary transition-colors">
            {document.name}
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="text-primary/60">{document.category}</span>
            <span>•</span>
            <span>{document.size}</span>
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 pt-2">
           <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <User size={12} className="text-primary/40" />
              <span className="truncate">{document.author}</span>
           </div>
           <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <Database size={12} className="text-primary/40" />
              <span>{document.downloads} dl</span>
           </div>
        </div>

        {/* Footer: Date & Actions */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
              <Calendar size={12} />
              {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
           </div>

           <div className="flex items-center gap-1">
              <button 
                onClick={() => onView(document)}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                title="Aperçu"
              >
                <Eye size={14} />
              </button>
              <button 
                onClick={() => onDownload(document)}
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                title="Télécharger"
              >
                <Download size={14} />
              </button>
              <div className="relative flex items-center group/menu">
                <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all">
                   <MoreVertical size={14} />
                </button>
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-[#0d1e19] border border-white/10 rounded-xl shadow-2xl p-1 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all translate-y-2 group-hover/menu:translate-y-0 z-50">
                   <button 
                    onClick={() => onEdit(document)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                   >
                      <Edit2 size={12} /> Modifier
                   </button>
                   <button 
                    onClick={() => onDelete(document.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                   >
                      <Trash2 size={12} /> Supprimer
                   </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
