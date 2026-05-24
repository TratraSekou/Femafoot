import React from 'react';
import { Cpu, Activity, Database, Server, RefreshCcw, HardDrive, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SystemSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Services Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <HealthCard title="API Gateway" status="Stable" uptime="99.99%" latency="24ms" />
         <HealthCard title="Database (Supabase)" status="Online" uptime="99.95%" latency="48ms" />
         <HealthCard title="Assets Store" status="Online" uptime="100%" latency="12ms" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* System Resources */}
         <section className="glass-card p-8 rounded-3xl border border-white/5 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
               <Database size={14} /> Ressources Système (Simulé)
            </h4>
            
            <div className="space-y-6">
               <ResourceGauge label="Stockage Cloud" value={42} total={100} unit="GB" color="bg-primary" />
               <ResourceGauge label="CPU Usage" value={18} total={100} unit="%" color="bg-emerald-500" />
               <ResourceGauge label="Memory (RAM)" value={3.2} total={8} unit="GB" color="bg-blue-500" />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/5">
               <div className="flex items-center gap-2 text-slate-500">
                  <Server size={14} />
                  <span className="text-[10px] font-bold uppercase">Node: Bamako-Svr-01</span>
               </div>
               <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                  <RefreshCcw size={12} /> Redémarrer les services
               </button>
            </div>
         </section>

         {/* System Logs */}
         <section className="glass-card p-8 rounded-3xl border border-white/5 space-y-6 flex flex-col">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Activity size={14} className="text-primary" /> Logs d'Activité Récents
               </h4>
               <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[8px] font-black uppercase">Live</span>
            </div>
            
            <div className="flex-1 space-y-3 font-mono text-[10px]">
               <LogItem time="22:50:12" level="INFO" msg="Mise à jour du classement Ligue 1" />
               <LogItem time="22:45:05" level="AUTH" msg="Connexion réussie: m.toure (ACI 2000)" />
               <LogItem time="22:30:18" level="BACKUP" msg="Sauvegarde automatique terminée (424MB)" />
               <LogItem time="22:15:44" level="WARN" msg="Latence inhabituelle détectée sur API Storage" color="text-amber-500" />
               <LogItem time="21:55:01" level="INFO" msg="Nouveau produit ajouté à la boutique" />
            </div>

            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">
               Consulter tous les logs système
            </button>
         </section>
      </div>

    </div>
  );
}

function HealthCard({ title, status, uptime, latency }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
       <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
          <Zap size={40} className="text-primary" />
       </div>
       <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black text-white uppercase tracking-tight">{title}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Disponibilité</p>
                <p className="text-xs font-black text-emerald-500">{uptime}</p>
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Latence</p>
                <p className="text-xs font-black text-white">{latency}</p>
             </div>
          </div>
       </div>
    </div>
  );
}

function ResourceGauge({ label, value, total, unit, color }: any) {
  const percentage = (value / total) * 100;
  return (
    <div className="space-y-2">
       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="text-slate-500">{label}</span>
          <span className="text-white">{value}{unit} / {total}{unit}</span>
       </div>
       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]", color)} 
            style={{ width: `${percentage}%` }}
          />
       </div>
    </div>
  );
}

function LogItem({ time, level, msg, color = "text-slate-400" }: any) {
  return (
    <div className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-primary/30">
       <span className="text-slate-600 shrink-0">{time}</span>
       <span className={cn("font-black shrink-0", level === 'WARN' ? 'text-amber-500' : 'text-primary')}>{level}</span>
       <span className={cn("font-medium", color)}>{msg}</span>
    </div>
  );
}
