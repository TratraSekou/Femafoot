"use client"
import React, { useState, useEffect } from "react";
import { Club, ClubFormData } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClubFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  club?: Club | null;
  onSave: (data: ClubFormData | Club) => void;
}

export function ClubFormModal({ isOpen, onClose, club, onSave }: ClubFormModalProps) {
  const [formData, setFormData] = useState<ClubFormData>({
    name: "",
    short: "",
    city: "",
    division: "Ligue 1",
    coach: "",
    players: 0,
    stadium: "",
    status: "Actif",
    region: "",
    founded_year: new Date().getFullYear(),
    description: "",
    logo_url: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (club) {
      setFormData(club);
    } else {
      setFormData({
        name: "", short: "", city: "", division: "Ligue 1", 
        coach: "", players: 0, stadium: "", status: "Actif",
        region: "", founded_year: new Date().getFullYear(), description: "", logo_url: ""
      });
    }
    setErrors({});
  }, [club, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.short.trim()) newErrors.short = "Initiales requises (ex: DAC)";
    if (!formData.city.trim()) newErrors.city = "La ville est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(club ? { ...formData, id: club.id } as Club : formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-card border border-white/10 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
          <h2 className="font-heading text-xl font-bold text-white">
            {club ? "Modifier le Club" : "Ajouter un Club"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-white rounded-full hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form id="club-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Logo Upload Mock */}
            <div className="flex justify-center">
              <div className="relative h-24 w-24 rounded-full border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center text-slate-400 hover:border-primary/50 hover:text-primary transition-colors cursor-pointer group">
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Logo</span>
                {formData.short && (
                  <div className="absolute inset-0 rounded-full bg-[#0a1511] flex items-center justify-center text-2xl font-bold text-primary ring-1 ring-white/10 opacity-0 group-hover:opacity-0 transition-opacity" style={{ opacity: club ? 1 : 0}}>
                    {formData.short}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Nom du Club</label>
                <Input 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={cn("bg-white/5 border-white/10 text-white", errors.name && "border-red-500/50 ring-1 ring-red-500/20")}
                  placeholder="ex: Djoliba AC"
                />
                {errors.name && <span className="text-red-400 text-[10px] mt-1">{errors.name}</span>}
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Initiales</label>
                <Input 
                  value={formData.short}
                  onChange={e => setFormData({...formData, short: e.target.value.toUpperCase()})}
                  className={cn("bg-white/5 border-white/10 text-white", errors.short && "border-red-500/50 ring-1 ring-red-500/20")}
                  placeholder="ex: DAC"
                  maxLength={4}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Région</label>
                <Input 
                  value={formData.region || ""}
                  onChange={e => setFormData({...formData, region: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="ex: Koulikoro"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Ville</label>
                <Input 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className={cn("bg-white/5 border-white/10 text-white", errors.city && "border-red-500/50 ring-1 ring-red-500/20")}
                  placeholder="ex: Bamako"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Division</label>
                <select 
                  value={formData.division}
                  onChange={e => setFormData({...formData, division: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm h-8 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                >
                  <option value="Ligue 1" className="bg-[#0a1511]">Ligue 1</option>
                  <option value="Ligue 2" className="bg-[#0a1511]">Ligue 2</option>
                  <option value="Régional" className="bg-[#0a1511]">Régional</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Statut</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as "Actif" | "Inactif"})}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm h-8 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                >
                  <option value="Actif" className="bg-[#0a1511]">Actif</option>
                  <option value="Inactif" className="bg-[#0a1511]">Inactif</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Stade Principal</label>
                <Input 
                  value={formData.stadium}
                  onChange={e => setFormData({...formData, stadium: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="ex: Stade Modibo Kéïta"
                />
              </div>

              <div className="col-span-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Année de fondation</label>
                <Input 
                  type="number"
                  value={formData.founded_year || ""}
                  onChange={e => setFormData({...formData, founded_year: parseInt(e.target.value) || null})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="ex: 1960"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Entraîneur</label>
                <Input 
                  value={formData.coach}
                  onChange={e => setFormData({...formData, coach: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Nom de l'entraîneur"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Effectif (Joueurs)</label>
                <Input 
                  type="number"
                  value={formData.players}
                  onChange={e => setFormData({...formData, players: parseInt(e.target.value) || 0})}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea 
                  value={formData.description || ""}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-3 text-sm min-h-[80px] outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 custom-scrollbar"
                  placeholder="Historique ou description du club..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white hover:bg-white/10">
            Annuler
          </Button>
          <Button type="submit" form="club-form" className="bg-primary text-black hover:bg-primary/90 font-bold">
            {club ? "Mettre à jour" : "Créer le club"}
          </Button>
        </div>
      </div>
    </div>
  );
}
