"use client"
import React from "react";
import { Club } from "./types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club | null;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ isOpen, onClose, club, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen || !club) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-card border border-red-500/20 shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          
          <h2 className="font-heading text-xl font-bold text-white mb-2">
            Supprimer le club ?
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Êtes-vous sûr de vouloir supprimer <strong className="text-white">{club.name}</strong> ? Cette action est irréversible.
          </p>

          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 text-white hover:bg-white/10">
              Annuler
            </Button>
            <Button onClick={onConfirm} className="flex-1 bg-red-500 text-white hover:bg-red-600 border-none">
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
