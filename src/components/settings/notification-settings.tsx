import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertTriangle, ShoppingBag, Ticket, Trophy, ShieldCheck } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emails: true,
    matches: true,
    news: false,
    security: true,
    orders: true,
    tickets: true,
    push: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Overview Card */}
      <div className="glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
         <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
               <Bell size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Canaux de Notifications</h3>
               <p className="text-slate-400 text-sm mt-1">Choisissez comment vous souhaitez être informé des activités critiques de la fédération.</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Communication Channels */}
         <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
               <Mail size={14} /> Canaux Principaux
            </h4>
            <div className="space-y-6">
               <NotificationToggle 
                 icon={<Mail size={18} />} 
                 title="Alertes Email" 
                 description="Recevez les rapports quotidiens et les alertes de sécurité par email." 
                 enabled={settings.emails}
                 onToggle={() => toggle('emails')}
               />
               <NotificationToggle 
                 icon={<Smartphone size={18} />} 
                 title="Notifications Push" 
                 description="Alertes instantanées sur votre mobile via l'application admin." 
                 enabled={settings.push}
                 onToggle={() => toggle('push')}
               />
            </div>
         </div>

         {/* Specific Alerts */}
         <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
               <ShieldCheck size={14} /> Événements & Activités
            </h4>
            <div className="space-y-6">
               <NotificationToggle 
                 icon={<Trophy size={18} />} 
                 title="Résultats de Matchs" 
                 description="Fin de match, scores et classements mis à jour." 
                 enabled={settings.matches}
                 onToggle={() => toggle('matches')}
               />
               <NotificationToggle 
                 icon={<ShoppingBag size={18} />} 
                 title="Boutique & Commandes" 
                 description="Nouvelles commandes et alertes de stock faible." 
                 enabled={settings.orders}
                 onToggle={() => toggle('orders')}
               />
               <NotificationToggle 
                 icon={<Ticket size={18} />} 
                 title="Billetterie" 
                 description="Suivi des ventes et alertes stade complet." 
                 enabled={settings.tickets}
                 onToggle={() => toggle('tickets')}
               />
               <NotificationToggle 
                 icon={<AlertTriangle size={18} />} 
                 title="Alertes Sécurité" 
                 description="Tentatives de connexion suspectes ou modifications de rôles." 
                 enabled={settings.security}
                 onToggle={() => toggle('security')}
               />
            </div>
         </div>
      </div>

    </div>
  );
}

function NotificationToggle({ icon, title, description, enabled, onToggle }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  enabled: boolean; 
  onToggle: () => void 
}) {
  return (
    <div className="flex items-start justify-between gap-6 group">
       <div className="flex gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
            enabled ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 text-slate-600 border border-white/5"
          )}>
             {icon}
          </div>
          <div className="space-y-0.5">
             <p className="text-xs font-black text-white uppercase tracking-tight">{title}</p>
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[200px]">{description}</p>
          </div>
       </div>
       <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}
