import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Competition } from './types';

interface DeleteCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  competition: Competition | null;
}

export function DeleteCompetitionModal({ isOpen, onClose, onConfirm, competition }: DeleteCompetitionModalProps) {
  if (!isOpen || !competition) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#0d1e19] border border-destructive/20 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
        
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Supprimer la compétition</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Êtes-vous sûr de vouloir supprimer <span className="text-white font-semibold">{competition.name}</span> ? 
                  Toutes les données associées seront perdues.
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-white/5"
            >
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Oui, supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
