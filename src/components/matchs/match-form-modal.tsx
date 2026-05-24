import React, { useState, useEffect } from 'react';
import { X, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Match, MatchFormData } from './types';

interface MatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MatchFormData) => void;
  initialData?: Match;
  clubsList: string[];
  competitionsList: string[];
}

export function MatchFormModal({ isOpen, onClose, onSubmit, initialData, clubsList, competitionsList }: MatchFormModalProps) {
  const [formData, setFormData] = useState<MatchFormData>({
    homeTeam: { name: '' },
    awayTeam: { name: '' },
    homeScore: null,
    awayScore: null,
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    stadium: 'Stade du 26 Mars',
    competition: competitionsList[0] || '',
    referee: '',
    status: 'À VENIR',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData
      });
    } else {
      setFormData({
        homeTeam: { name: clubsList[0] || '' },
        awayTeam: { name: clubsList[1] || '' },
        homeScore: null,
        awayScore: null,
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        stadium: 'Stade du 26 Mars',
        competition: competitionsList[0] || '',
        referee: '',
        status: 'À VENIR',
      });
    }
  }, [initialData, isOpen, clubsList, competitionsList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.homeTeam.name === formData.awayTeam.name) {
      alert("Une équipe ne peut pas jouer contre elle-même.");
      return;
    }
    onSubmit(formData);
  };

  const isScoreEditable = ['TERMINÉ', 'LIVE', 'MI-TEMPS'].includes(formData.status);

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
              <CalendarPlus className="w-5 h-5 text-primary" />
              {initialData ? 'Modifier le Match' : 'Programmer un Match'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {initialData ? 'Modifiez les informations de la rencontre.' : 'Planifiez une nouvelle rencontre.'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Section Équipes */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Affiche de la rencontre</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-medium text-slate-300 uppercase">Domicile</label>
                <select
                  required
                  value={formData.homeTeam.name}
                  onChange={(e) => setFormData({...formData, homeTeam: { name: e.target.value }})}
                  className="w-full h-11 px-3 bg-[#060d0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  <option value="" disabled>Sélectionner</option>
                  {clubsList.map(club => (
                    <option key={`home-${club}`} value={club}>{club}</option>
                  ))}
                </select>
              </div>

              <div className="hidden sm:flex text-slate-500 font-black italic mt-6">VS</div>

              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-medium text-slate-300 uppercase">Extérieur</label>
                <select
                  required
                  value={formData.awayTeam.name}
                  onChange={(e) => setFormData({...formData, awayTeam: { name: e.target.value }})}
                  className="w-full h-11 px-3 bg-[#060d0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  <option value="" disabled>Sélectionner</option>
                  {clubsList.map(club => (
                    <option key={`away-${club}`} value={club}>{club}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Statut de la rencontre *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as MatchFormData['status']})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="À VENIR" className="bg-[#0f1c1a] text-primary">À Venir</option>
                <option value="LIVE" className="bg-[#0f1c1a] text-red-400">En Direct (LIVE)</option>
                <option value="MI-TEMPS" className="bg-[#0f1c1a] text-yellow-400">Mi-Temps</option>
                <option value="TERMINÉ" className="bg-[#0f1c1a] text-emerald-400">Terminé</option>
                <option value="REPORTÉ" className="bg-[#0f1c1a] text-orange-400">Reporté</option>
              </select>
            </div>

            {/* Score (Conditionnel) */}
            <div className={`space-y-2 transition-opacity duration-300 ${isScoreEditable ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <label className="text-sm font-medium text-slate-300">Score (Dom - Ext)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={formData.homeScore ?? ''}
                  onChange={(e) => setFormData({...formData, homeScore: parseInt(e.target.value) || 0})}
                  className="w-full h-11 px-3 text-center bg-white/5 border border-white/10 rounded-lg text-white font-mono text-xl focus:outline-none focus:border-primary/50"
                  placeholder="0"
                  disabled={!isScoreEditable}
                />
                <span className="text-slate-500 font-bold">-</span>
                <input
                  type="number"
                  min="0"
                  value={formData.awayScore ?? ''}
                  onChange={(e) => setFormData({...formData, awayScore: parseInt(e.target.value) || 0})}
                  className="w-full h-11 px-3 text-center bg-white/5 border border-white/10 rounded-lg text-white font-mono text-xl focus:outline-none focus:border-primary/50"
                  placeholder="0"
                  disabled={!isScoreEditable}
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Date *</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Heure */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Heure du coup d'envoi *</label>
              <input
                required
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Compétition */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Compétition *</label>
              <select
                required
                value={formData.competition}
                onChange={(e) => setFormData({...formData, competition: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="" disabled className="bg-[#0f1c1a]">Sélectionner</option>
                {competitionsList.map(comp => (
                  <option key={comp} value={comp} className="bg-[#0f1c1a]">{comp}</option>
                ))}
              </select>
            </div>

            {/* Stade */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Stade *</label>
              <input
                required
                type="text"
                value={formData.stadium}
                onChange={(e) => setFormData({...formData, stadium: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Ex: Stade Modibo Keïta"
              />
            </div>

            {/* Arbitre */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-300">Arbitre Principal</label>
              <input
                type="text"
                value={formData.referee}
                onChange={(e) => setFormData({...formData, referee: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Ex: Boubou Traoré"
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5 mt-8">
            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/5">
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
              {initialData ? 'Mettre à jour' : 'Programmer le Match'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
