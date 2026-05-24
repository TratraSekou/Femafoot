import React, { useState, useRef } from 'react';
import { X, Upload, File, CheckCircle2, AlertCircle, Loader2, Database, Shield, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FemaDocument, DocType, DocStatus } from './types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: FemaDocument) => void;
  document: FemaDocument | null;
}

export function DocumentUploadModal({ isOpen, onClose, onSave, document: editingDoc }: DocumentUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Administratif',
    description: '',
    type: 'PDF' as DocType,
    status: 'Public' as DocStatus,
    tags: [] as string[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editingDoc && isOpen) {
      setFormData({
        name: editingDoc.name,
        category: editingDoc.category,
        description: editingDoc.description || '',
        type: editingDoc.type,
        status: editingDoc.status,
        tags: editingDoc.tags || [],
      });
      // On ne peut pas facilement restaurer l'objet File, mais on peut simuler qu'il est déjà là pour le nom
      setSelectedFile(null); 
    } else if (isOpen) {
      resetForm();
    }
  }, [editingDoc, isOpen]);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelection(file);
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    setFormData(prev => ({ ...prev, name: file.name }));
    // Déterminer le type basé sur l'extension
    const ext = file.name.split('.').pop()?.toUpperCase();
    if (['PDF', 'DOCX', 'XLSX', 'ZIP'].includes(ext || '')) {
      setFormData(prev => ({ ...prev, type: ext as DocType }));
    } else if (['JPG', 'PNG', 'WEBP', 'SVG'].includes(ext || '')) {
      setFormData(prev => ({ ...prev, type: 'IMAGE' }));
    }
  };

  const startUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const finalDoc: FemaDocument = {
            id: editingDoc?.id || Math.random().toString(36).substring(7),
            name: formData.name,
            category: formData.category,
            size: selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB' : (editingDoc?.size || '0 MB'),
            type: formData.type,
            uploadDate: editingDoc?.uploadDate || new Date().toISOString(),
            author: editingDoc?.author || 'Admin FemaFoot',
            downloads: editingDoc?.downloads || 0,
            status: formData.status,
            description: formData.description,
            tags: formData.tags,
          };
          onSave(finalDoc);
          resetForm();
          onClose();
        }, 500);
      }
    }, 200);
  };

  const handleUpdateOnly = () => {
    if (!editingDoc) return;
    const finalDoc: FemaDocument = {
      ...editingDoc,
      ...formData,
    };
    onSave(finalDoc);
    onClose();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setFormData({
      name: '',
      category: 'Administratif',
      description: '',
      type: 'PDF',
      status: 'Public',
      tags: [],
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0d1e19] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <header className="px-8 py-6 border-b border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Upload size={20} />
             </div>
             <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                   {editingDoc ? "Modifier le document" : "Ajouter un document"}
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Centre documentaire FemaFoot</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
             <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Drop Zone */}
          {!selectedFile ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative h-48 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden group",
                isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/10 bg-white/[0.02] hover:border-white/20"
              )}
            >
               <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
               />
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:scale-110 transition-all">
                  <Upload size={32} />
               </div>
               <div className="text-center">
                  <p className="text-sm font-bold text-white">Glissez-déposez un fichier ici</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">ou cliquez pour parcourir • Max 50MB</p>
               </div>
               {/* Glow effect on hover */}
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 animate-in slide-in-from-bottom-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                     <File size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-black text-white truncate">{selectedFile.name}</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  {!isUploading && (
                    <button onClick={() => setSelectedFile(null)} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                       <X size={16} />
                    </button>
                  )}
               </div>

               {isUploading && (
                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-primary">Téléversement en cours...</span>
                       <span className="text-white">{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-primary shadow-[0_0_15px_rgba(203,160,65,0.5)] transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                       />
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Nom du document</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                  placeholder="Ex: Règlement intérieur..."
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Catégorie</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                >
                   <option value="Administratif" className="bg-[#0d1e19]">Administratif</option>
                   <option value="Règlements" className="bg-[#0d1e19]">Règlements</option>
                   <option value="Sportif" className="bg-[#0d1e19]">Sportif</option>
                   <option value="Finances" className="bg-[#0d1e19]">Finances</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                   <Shield size={12} className="text-primary" /> Visibilité
                </label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as DocStatus})}
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                >
                   <option value="Public" className="bg-[#0d1e19]">Public (Tous)</option>
                   <option value="Privé" className="bg-[#0d1e19]">Privé (Admin uniquement)</option>
                   <option value="Brouillon" className="bg-[#0d1e19]">Brouillon</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                   <Tag size={12} className="text-primary" /> Tags (séparés par virgule)
                </label>
                <input 
                  type="text"
                  placeholder="Ligue1, Statuts, 2024..."
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                />
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Description (Optionnel)</label>
             <textarea 
               rows={3}
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-primary/50 resize-none"
               placeholder="Précisez le contenu du document..."
             />
          </div>

        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center justify-end gap-3">
           <Button variant="ghost" onClick={onClose} disabled={isUploading} className="rounded-xl font-bold uppercase tracking-widest text-xs">Annuler</Button>
           
           {editingDoc && !selectedFile ? (
             <Button 
              onClick={handleUpdateOnly}
              className="bg-primary hover:bg-primary/90 text-black px-8 h-11 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105"
             >
                <Database className="mr-2 h-4 w-4" />
                Enregistrer les modifications
             </Button>
           ) : (
             <Button 
              onClick={startUpload}
              disabled={!selectedFile || isUploading}
              className="bg-primary hover:bg-primary/90 text-black px-8 h-11 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105"
             >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {editingDoc ? "Remplacer et enregistrer" : "Lancer l'upload"}
                  </>
                )}
             </Button>
           )}
        </footer>

      </div>
    </div>
  );
}
