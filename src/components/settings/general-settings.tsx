import React, { useState } from 'react';
import { Camera, Globe, Mail, Phone, MapPin, Save, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/simple-toast';

export function GeneralSettings() {
  const { toast } = useToast();
  const [logo, setLogo] = useState("https://upload.wikimedia.org/wikipedia/fr/thumb/5/5f/Logo_Femafoot.svg/1200px-Logo_Femafoot.svg.png");

  const handleSave = () => {
    toast("Paramètres généraux enregistrés.", "success");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Profile Header */}
      <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-transparent to-transparent opacity-50" />
         
         <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center p-4 overflow-hidden backdrop-blur-md">
               <img src={logo} alt="Logo Femafoot" className="w-full h-full object-contain" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
               <Camera size={18} />
               <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setLogo(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
               />
            </button>
         </div>

         <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Identité Plateforme</h2>
            <p className="text-slate-400 text-sm max-w-md">Gérez les informations publiques et l'identité visuelle officielle de la FemaFoot sur le dashboard.</p>
         </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                     <Landmark size={12} className="text-primary" /> Nom Officiel
                  </label>
                  <input 
                    type="text"
                    defaultValue="Fédération Malienne de Football"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Slogan / Devise</label>
                  <input 
                    type="text"
                    defaultValue="Le football pour tous"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
               </div>
            </div>
         </div>

         <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                     <Mail size={12} className="text-primary" /> Email Officiel
                  </label>
                  <input 
                    type="email"
                    defaultValue="contact@femafoot.ml"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-bold"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                     <Phone size={12} className="text-primary" /> Téléphone
                  </label>
                  <input 
                    type="text"
                    defaultValue="+223 20 22 22 22"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
               </div>
            </div>
         </div>

         <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                     <MapPin size={12} className="text-primary" /> Adresse Siège
                  </label>
                  <input 
                    type="text"
                    defaultValue="Bamako, ACI 2000"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center gap-2">
                     <Globe size={12} className="text-primary" /> Site Web
                  </label>
                  <input 
                    type="text"
                    defaultValue="www.femafoot.ml"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
               </div>
               <div className="space-y-2 flex items-end">
                  <Button onClick={handleSave} className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
                     <Save className="mr-2 h-4 w-4" /> Enregistrer
                  </Button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
