import React, { useState, useEffect } from 'react';
import { X, Trophy, MapPin, Calendar, Clock, Save, Plus, Database, Users, Ticket, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MatchBilletterie, TicketCategory, TicketCategoryName } from './types';

interface BilletterieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (match: MatchBilletterie) => void;
  match: MatchBilletterie | null;
}

const CATEGORIES: TicketCategoryName[] = ['VIP', 'Tribune', 'Pelouse', 'Presse', 'Standard'];

export function BilletterieModal({ isOpen, onClose, onSave, match }: BilletterieModalProps) {
  const [formData, setFormData] = useState<Partial<MatchBilletterie>>({
    homeTeam: { name: '', logo: '' },
    awayTeam: { name: '', logo: '' },
    competition: 'Ligue 1 Malienne',
    date: '',
    time: '',
    venue: 'Stade du 26 Mars',
    status: 'Ouvert',
    categories: [
      { name: 'VIP', price: 10000, capacity: 500, available: 500, reserved: 0 },
      { name: 'Tribune', price: 5000, capacity: 2000, available: 2000, reserved: 0 },
      { name: 'Standard', price: 2000, capacity: 10000, available: 10000, reserved: 0 },
    ],
  });

  useEffect(() => {
    if (match && isOpen) {
      setFormData(match);
    } else if (isOpen) {
      setFormData({
        homeTeam: { name: '', logo: '' },
        awayTeam: { name: '', logo: '' },
        competition: 'Ligue 1 Malienne',
        date: '',
        time: '',
        venue: 'Stade du 26 Mars',
        status: 'Ouvert',
        categories: [
          { name: 'VIP', price: 10000, capacity: 500, available: 500, reserved: 0 },
          { name: 'Tribune', price: 5000, capacity: 2000, available: 2000, reserved: 0 },
          { name: 'Standard', price: 2000, capacity: 10000, available: 10000, reserved: 0 },
        ],
      });
    }
  }, [match, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalData = {
      ...formData,
      id: match?.id || Math.random().toString(36).substring(7),
    } as MatchBilletterie;
    onSave(finalData);
    onClose();
  };

  const updateCategory = (index: number, field: keyof TicketCategory, value: any) => {
    const newCategories = [...(formData.categories || [])];
    newCategories[index] = { ...newCategories[index], [field]: value };
    // Synchroniser available avec capacity si c'est une création
    if (field === 'capacity' && !match) {
      newCategories[index].available = value;
    }
    setFormData({ ...formData, categories: newCategories });
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [
        ...(formData.categories || []),
        { name: 'Standard', price: 2000, capacity: 1000, available: 1000, reserved: 0 }
      ]
    });
  };

  const removeCategory = (index: number) => {
    setFormData({
      ...formData,
      categories: (formData.categories || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-[#0d1e19] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
        <header className="px-8 py-6 border-b border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Ticket size={20} />
             </div>
             <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                   {match ? "Modifier la billetterie" : "Créer une billetterie"}
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Événement Football FemaFoot</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
             <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
           
           {/* Section: Équipes */}
           <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                 <Users size={14} /> Affiche du match
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-black text-white/5 italic">VS</div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Équipe Domicile</label>
                    <div className="flex items-center gap-4">
                       <input 
                        type="text"
                        placeholder="Nom de l'équipe..."
                        value={formData.homeTeam?.name}
                        onChange={(e) => setFormData({...formData, homeTeam: {...formData.homeTeam!, name: e.target.value}})}
                        className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                       />
                       <input 
                        type="text"
                        placeholder="URL Logo..."
                        value={formData.homeTeam?.logo}
                        onChange={(e) => setFormData({...formData, homeTeam: {...formData.homeTeam!, logo: e.target.value}})}
                        className="w-1/3 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[10px] text-slate-400 focus:outline-none focus:border-primary/50"
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 text-right block">Équipe Extérieure</label>
                    <div className="flex items-center gap-4">
                       <input 
                        type="text"
                        placeholder="URL Logo..."
                        value={formData.awayTeam?.logo}
                        onChange={(e) => setFormData({...formData, awayTeam: {...formData.awayTeam!, logo: e.target.value}})}
                        className="w-1/3 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-[10px] text-slate-400 focus:outline-none focus:border-primary/50"
                       />
                       <input 
                        type="text"
                        placeholder="Nom de l'équipe..."
                        value={formData.awayTeam?.name}
                        onChange={(e) => setFormData({...formData, awayTeam: {...formData.awayTeam!, name: e.target.value}})}
                        className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                       />
                    </div>
                 </div>
              </div>
           </section>

           {/* Section: Infos Match */}
           <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                    <Trophy size={12} className="text-primary" /> Compétition
                 </label>
                 <select 
                  value={formData.competition}
                  onChange={(e) => setFormData({...formData, competition: e.target.value})}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none font-bold"
                 >
                    <option value="Ligue 1 Malienne" className="bg-[#0d1e19]">Ligue 1 Malienne</option>
                    <option value="Coupe du Mali" className="bg-[#0d1e19]">Coupe du Mali</option>
                    <option value="Éliminatoires CAN" className="bg-[#0d1e19]">Éliminatoires CAN</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                    <MapPin size={12} className="text-primary" /> Stade
                 </label>
                 <input 
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                  placeholder="Nom du stade..."
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                    <Calendar size={12} className="text-primary" /> Date
                 </label>
                 <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                    <Clock size={12} className="text-primary" /> Heure
                 </label>
                 <input 
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                 />
              </div>
           </section>

           {/* Section: Catégories & Prix */}
           <section className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Database size={14} /> Configuration des Tickets
                 </h3>
                 <button 
                  onClick={addCategory}
                  className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all"
                 >
                    <Plus size={12} /> Ajouter une zone
                 </button>
              </div>

              <div className="space-y-3">
                 {formData.categories?.map((cat, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl items-end group">
                       <div className="md:col-span-1 space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Catégorie</label>
                          <select 
                            value={cat.name}
                            onChange={(e) => updateCategory(index, 'name', e.target.value)}
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-xs text-white focus:outline-none font-bold appearance-none"
                          >
                             {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d1e19]">{c}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Prix (FCFA)</label>
                          <input 
                            type="number"
                            value={cat.price}
                            onChange={(e) => updateCategory(index, 'price', Number(e.target.value))}
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-xs text-white focus:outline-none font-bold"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Capacité Zone</label>
                          <input 
                            type="number"
                            value={cat.capacity}
                            onChange={(e) => updateCategory(index, 'capacity', Number(e.target.value))}
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-xs text-white focus:outline-none font-bold"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Dispo (Initiale)</label>
                          <input 
                            type="number"
                            value={cat.available}
                            disabled={!!match}
                            onChange={(e) => updateCategory(index, 'available', Number(e.target.value))}
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-xs text-slate-400 focus:outline-none font-bold disabled:opacity-50"
                          />
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => removeCategory(index)}
                            className="h-10 w-10 flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-white/5 bg-[#060d0a]/60 backdrop-blur-md flex items-center justify-end gap-3 flex-shrink-0">
           <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase tracking-widest text-xs">Annuler</Button>
           <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-black px-10 h-12 rounded-xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-[0_0_20px_rgba(203,160,65,0.3)]"
           >
              <Save className="mr-2 h-4 w-4" />
              {match ? "Mettre à jour" : "Lancer la billetterie"}
           </Button>
        </footer>

      </div>
    </div>
  );
}
