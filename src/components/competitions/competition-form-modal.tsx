import React, { useState, useEffect } from 'react';
import { X, Upload, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Competition, CompetitionFormData } from './types';

interface CompetitionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompetitionFormData) => void;
  initialData?: Competition;
}

export function CompetitionFormModal({ isOpen, onClose, onSubmit, initialData }: CompetitionFormModalProps) {
  const [formData, setFormData] = useState<CompetitionFormData>({
    name: '',
    type: 'Championnat',
    category: 'Seniors',
    season: '2026-2027',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0], // +1 year
    teamsCount: 16,
    matchesCount: 240,
    status: 'À VENIR',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        type: 'Championnat',
        category: 'Seniors',
        season: '2026-2027',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
        teamsCount: 16,
        matchesCount: 240,
        status: 'À VENIR',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0d1e19] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/5 bg-[#0d1e19]/95 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {initialData ? 'Modifier la Compétition' : 'Créer une Compétition'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {initialData ? 'Modifiez les informations du tournoi.' : 'Remplissez les informations pour lancer une nouvelle compétition.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center sm:flex-row gap-6">
            <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center overflow-hidden group hover:border-primary/50 transition-colors">
              {formData.logo ? (
                <img src={formData.logo} alt="Preview" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Upload className="w-6 h-6 mb-2 group-hover:text-primary transition-colors" />
                  <span className="text-xs">Logo / Trophée</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, logo: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-medium text-white">Identité visuelle</h3>
              <p className="text-xs text-slate-400">PNG transparent recommandé pour un affichage optimal (Sponsor, Trophée, Logo).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-300">Nom de la compétition *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Ex: Ligue 1 Orange"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Type *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as CompetitionFormData['type']})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="Championnat" className="bg-[#0f1c1a]">Championnat</option>
                <option value="Coupe" className="bg-[#0f1c1a]">Coupe</option>
                <option value="Tournoi" className="bg-[#0f1c1a]">Tournoi</option>
              </select>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Catégorie *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as CompetitionFormData['category']})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="Seniors" className="bg-[#0f1c1a]">Seniors</option>
                <option value="U23" className="bg-[#0f1c1a]">U23</option>
                <option value="U20" className="bg-[#0f1c1a]">U20</option>
                <option value="U17" className="bg-[#0f1c1a]">U17</option>
                <option value="Féminines" className="bg-[#0f1c1a]">Féminines</option>
              </select>
            </div>

            {/* Saison */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Saison *</label>
              <input
                required
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Ex: 2026-2027"
              />
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Statut *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as CompetitionFormData['status']})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="À VENIR" className="bg-[#0f1c1a] text-primary">À venir</option>
                <option value="EN COURS" className="bg-[#0f1c1a] text-emerald-400">En cours</option>
                <option value="TERMINÉE" className="bg-[#0f1c1a] text-slate-400">Terminée</option>
                <option value="SUSPENDUE" className="bg-[#0f1c1a] text-red-400">Suspendue</option>
              </select>
            </div>

            {/* Date début */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Date de début</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Date fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Date de fin prévue</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Nombre équipes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nombre d'équipes engagées</label>
              <input
                type="number"
                min="2"
                value={formData.teamsCount}
                onChange={(e) => setFormData({...formData, teamsCount: parseInt(e.target.value) || 0})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Nombre matchs */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Matchs totaux prévus</label>
              <input
                type="number"
                min="1"
                value={formData.matchesCount}
                onChange={(e) => setFormData({...formData, matchesCount: parseInt(e.target.value) || 0})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5 mt-8">
            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/5">
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
              {initialData ? 'Mettre à jour' : 'Créer la compétition'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
