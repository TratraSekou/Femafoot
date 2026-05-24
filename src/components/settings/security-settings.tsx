import React from 'react';
import { Shield, Lock, Smartphone, Monitor, Globe, LogOut, Key, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SecuritySettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 2FA Status Card */}
      <div className="glass-card p-8 rounded-3xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
         
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(203,160,65,0.2)]">
               <Shield size={32} />
            </div>
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Authentification à deux facteurs</h3>
               <p className="text-slate-400 text-sm mt-1">Ajoutez une couche de sécurité supplémentaire à votre compte administrateur.</p>
            </div>
         </div>
         <Button className="bg-primary text-black font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl hover:scale-105 transition-all">
            Activer le 2FA
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Change Password */}
         <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
               <Key size={14} /> Modifier le mot de passe
            </h4>
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">Mot de passe actuel</label>
                  <input 
                    type="password"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                    placeholder="••••••••"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">Nouveau mot de passe</label>
                  <input 
                    type="password"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                    placeholder="Minimum 8 caractères"
                  />
               </div>
               <Button variant="outline" className="w-full h-12 border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/5">
                  Mettre à jour
               </Button>
            </div>
         </div>

         {/* Device Security */}
         <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
               <Monitor size={14} /> Sessions Actives
            </h4>
            <div className="space-y-4">
               <SessionItem 
                 device="MacBook Pro - Chrome" 
                 location="Bamako, Mali" 
                 status="Actuel" 
                 isCurrent 
               />
               <SessionItem 
                 device="iPhone 15 - App Femafoot" 
                 location="Sikasso, Mali" 
                 status="Il y a 2h" 
               />
               <SessionItem 
                 device="Windows PC - Firefox" 
                 location="Mopti, Mali" 
                 status="Hier" 
               />
               <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline mt-2">
                  Se déconnecter de toutes les autres sessions
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}

function SessionItem({ device, location, status, isCurrent = false }: { device: string; location: string; status: string; isCurrent?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-all">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
             {device.includes('iPhone') ? <Smartphone size={18} /> : <Monitor size={18} />}
          </div>
          <div>
             <p className="text-xs font-black text-white uppercase">{device}</p>
             <div className="flex items-center gap-2 mt-0.5">
                <Globe size={10} className="text-slate-600" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">{location}</span>
             </div>
          </div>
       </div>
       <div className="text-right">
          <span className={cn("text-[9px] font-black uppercase tracking-widest", isCurrent ? "text-emerald-500" : "text-slate-600")}>
             {status}
          </span>
       </div>
    </div>
  );
}
