import React from 'react';
import { Settings, Shield, Bell, Users, Palette, Cpu, Database, Landmark, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SettingsSection = 'general' | 'federation' | 'security' | 'notifications' | 'users' | 'appearance' | 'system' | 'backups';

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const NAV_ITEMS = [
  { id: 'general', label: 'Général', icon: Settings },
  { id: 'federation', label: 'Fédération', icon: Landmark },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'users', label: 'Utilisateurs & Rôles', icon: Users },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'system', label: 'Système', icon: Cpu },
  { id: 'backups', label: 'Sauvegardes', icon: Database },
] as const;

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="w-full lg:w-64 flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id as SettingsSection)}
          className={cn(
            "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden",
            activeSection === item.id 
              ? "bg-primary text-black shadow-[0_0_15px_rgba(203,160,65,0.3)]" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <item.icon size={18} className={cn(
            "transition-transform duration-300 group-hover:scale-110",
            activeSection === item.id ? "text-black" : "text-slate-500 group-hover:text-primary"
          )} />
          <span className="relative z-10">{item.label}</span>
          
          {/* Active Glow */}
          {activeSection === item.id && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
          )}
        </button>
      ))}
      
      <div className="mt-8 px-4 py-6 border-t border-white/5 space-y-4 hidden lg:block">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Version 2.4.0-Stable</span>
         </div>
         <p className="text-[9px] text-slate-600 leading-relaxed font-medium">
            Toutes les modifications sont enregistrées localement avant synchronisation.
         </p>
      </div>
    </div>
  );
}
