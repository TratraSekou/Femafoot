import React, { useState, useEffect } from 'react';
import { X, Upload, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Joueur, JoueurFormData } from './types';

interface JoueurFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JoueurFormData) => void;
  initialData?: Joueur;
  clubsList: string[];
}

export function JoueurFormModal({ isOpen, onClose, onSubmit, initialData, clubsList }: JoueurFormModalProps) {
  const [formData, setFormData] = useState<JoueurFormData>({
    firstName: '',
    lastName: '',
    age: 18,
    birthDate: '',
    club: '',
    position: 'ATT',
    number: 10,
    nationality: 'Mali',
    status: 'Actif',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        age: 18,
        birthDate: '',
        club: clubsList[0] || '',
        position: 'ATT',
        number: 10,
        nationality: 'Mali',
        status: 'Actif',
      });
    }
  }, [initialData, isOpen, clubsList]);

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
              <UserPlus className="w-5 h-5 text-primary" />
              {initialData ? 'Modifier le Joueur' : 'Ajouter un Joueur'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {initialData ? 'Modifiez les informations du joueur ci-dessous.' : 'Remplissez les informations pour créer un nouveau joueur.'}
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
          
          {/* Photo Section */}
          <div className="flex flex-col items-center sm:flex-row gap-6">
            <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center overflow-hidden group hover:border-primary/50 transition-colors">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Upload className="w-6 h-6 mb-2 group-hover:text-primary transition-colors" />
                  <span className="text-xs">Photo</span>
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
                      setFormData({ ...formData, avatar: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-medium text-white">Photo de profil</h3>
              <p className="text-xs text-slate-400">PNG, JPG jusqu'à 5MB. Recommandé : 500x500px, fond transparent (style carte FUT).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Prénom */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Prénom *</label>
              <input
                required
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Ex: Yves"
              />
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nom *</label>
              <input
                required
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Ex: Bissouma"
              />
            </div>

            {/* Club */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Club Actuel *</label>
              <select
                required
                value={formData.club}
                onChange={(e) => setFormData({...formData, club: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="" disabled className="bg-[#0f1c1a]">Sélectionner un club</option>
                {clubsList.map(club => (
                  <option key={club} value={club} className="bg-[#0f1c1a]">{club}</option>
                ))}
              </select>
            </div>

            {/* Poste */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Poste *</label>
              <select
                required
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value as JoueurFormData['position']})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="ATT" className="bg-[#0f1c1a]">Attaquant (ATT)</option>
                <option value="MIL" className="bg-[#0f1c1a]">Milieu (MIL)</option>
                <option value="DEF" className="bg-[#0f1c1a]">Défenseur (DEF)</option>
                <option value="GB" className="bg-[#0f1c1a]">Gardien (GB)</option>
              </select>
            </div>

            {/* Numéro */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Numéro de maillot</label>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: parseInt(e.target.value) || 0})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Âge</label>
              <input
                type="number"
                min="15"
                max="50"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 18})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Nationalité */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nationalité</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Ex: Mali"
              />
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Statut *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as JoueurFormData['status']})}
                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="Actif" className="bg-[#0f1c1a]">Actif</option>
                <option value="Blessé" className="bg-[#0f1c1a]">Blessé</option>
                <option value="Suspendu" className="bg-[#0f1c1a]">Suspendu</option>
                <option value="Inactif" className="bg-[#0f1c1a]">Inactif</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5 mt-8">
            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/5">
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
              {initialData ? 'Mettre à jour' : 'Créer le Joueur'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
