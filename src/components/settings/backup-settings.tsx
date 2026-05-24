import React from 'react';
import { Database, Download, RefreshCcw, History, Clock, FileText, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BACKUPS = [
  { id: 'b1', date: '2026-05-16 00:00', size: '424 MB', type: 'Automatique', status: 'Réussi' },
  { id: 'b2', date: '2026-05-15 00:00', size: '418 MB', type: 'Automatique', status: 'Réussi' },
  { id: 'b3', date: '2026-05-14 14:32', size: '415 MB', type: 'Manuel', status: 'Réussi' },
  { id: 'b4', date: '2026-05-14 00:00', size: '0 MB', type: 'Automatique', status: 'Échec' },
];

export function BackupSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Quick Action Card */}
      <div className="glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
         
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
               <Database size={32} />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Sauvegarde Immédiate</h3>
               <p className="text-slate-400 text-sm max-w-sm">Lancez une sauvegarde complète de la base de données et des fichiers médias maintenant.</p>
            </div>
         </div>
         
         <Button className="bg-primary text-black font-black uppercase tracking-widest text-[10px] px-10 h-12 rounded-xl hover:scale-105 transition-all shadow-xl">
            <Play className="mr-2 h-4 w-4 fill-current" /> Démarrer le Backup
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* History */}
         <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
               <History size={14} className="text-primary" /> Historique des Sauvegardes
            </h4>
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
               <div className="divide-y divide-white/5">
                  {BACKUPS.map((backup) => (
                     <div key={backup.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                              <FileText size={20} />
                           </div>
                           <div>
                              <p className="text-xs font-black text-white uppercase tracking-tight">{backup.date}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                 <span className="text-[9px] font-bold text-slate-500 uppercase">{backup.type}</span>
                                 <span className="text-slate-700 text-[8px]">•</span>
                                 <span className="text-[9px] font-bold text-slate-500 uppercase">{backup.size}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={cn(
                             "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border",
                             backup.status === 'Réussi' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                           )}>
                              {backup.status}
                           </span>
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Télécharger">
                                 <Download size={14} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Restaurer">
                                 <RefreshCcw size={14} />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Configuration */}
         <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
               <Clock size={14} className="text-primary" /> Planification
            </h4>
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Fréquence des Backups</label>
                     <select className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none appearance-none font-bold">
                        <option className="bg-[#0d1e19]">Chaque jour à minuit</option>
                        <option className="bg-[#0d1e19]">Toutes les 12 heures</option>
                        <option className="bg-[#0d1e19]">Chaque semaine</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Rétention</label>
                     <select className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none appearance-none font-bold">
                        <option className="bg-[#0d1e19]">Garder les 30 derniers jours</option>
                        <option className="bg-[#0d1e19]">Garder les 90 derniers jours</option>
                        <option className="bg-[#0d1e19]">Illimité (Payant)</option>
                     </select>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-500">
                     <AlertTriangle size={24} className="shrink-0" />
                     <p className="text-[9px] font-bold leading-relaxed uppercase tracking-tight">
                        La restauration d'une sauvegarde écrasera toutes les données actuelles. Utilisez cette action avec prudence.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
