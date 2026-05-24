import React, { useState } from 'react';
import { Palette, Moon, Sun, Monitor, Type, LayoutGrid, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppearanceSettings() {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('gold');
  const [density, setDensity] = useState('comfortable');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Theme Selection */}
      <section className="space-y-6">
         <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 px-1">
            <Monitor size={14} /> Mode d'affichage
         </h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemeCard 
              id="light" 
              title="Clair" 
              active={theme === 'light'} 
              onClick={() => setTheme('light')}
              icon={<Sun size={24} />}
              previewClass="bg-slate-100"
            />
            <ThemeCard 
              id="dark" 
              title="Sombre" 
              active={theme === 'dark'} 
              onClick={() => setTheme('dark')}
              icon={<Moon size={24} />}
              previewClass="bg-[#060d0a]"
            />
            <ThemeCard 
              id="system" 
              title="Système" 
              active={theme === 'system'} 
              onClick={() => setTheme('system')}
              icon={<Monitor size={24} />}
              previewClass="bg-gradient-to-br from-slate-100 to-[#060d0a]"
            />
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Accent Color */}
         <section className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 px-1">
               <Palette size={14} /> Couleur d'accentuation
            </h4>
            <div className="glass-card p-8 rounded-2xl border border-white/5 flex flex-wrap gap-4">
               <AccentCircle color="bg-[#cba041]" active={accent === 'gold'} onClick={() => setAccent('gold')} label="Or Femafoot" />
               <AccentCircle color="bg-emerald-500" active={accent === 'emerald'} onClick={() => setAccent('emerald')} label="Émeraude" />
               <AccentCircle color="bg-blue-500" active={accent === 'blue'} onClick={() => setAccent('blue')} label="Royal Blue" />
               <AccentCircle color="bg-red-500" active={accent === 'red'} onClick={() => setAccent('red')} label="Passion" />
            </div>
         </section>

         {/* UI Density */}
         <section className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-500 flex items-center gap-2 px-1">
               <LayoutGrid size={14} /> Densité de l'interface
            </h4>
            <div className="glass-card p-6 rounded-2xl border border-white/5 grid grid-cols-2 gap-3">
               <DensityButton 
                 active={density === 'comfortable'} 
                 onClick={() => setDensity('comfortable')} 
                 label="Confortable" 
                 desc="Espacements larges" 
               />
               <DensityButton 
                 active={density === 'compact'} 
                 onClick={() => setDensity('compact')} 
                 label="Compact" 
                 desc="Maximise les infos" 
               />
            </div>
         </section>
      </div>

      {/* Font & UX */}
      <section className="glass-card p-8 rounded-3xl border border-white/5 space-y-8">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Zap size={16} className="text-primary" /> Animations Fluides
               </h4>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  Active les transitions CSS et Framer Motion pour une expérience plus dynamique.
               </p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
               <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
            </div>
         </div>
      </section>

    </div>
  );
}

function ThemeCard({ id, title, active, onClick, icon, previewClass }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 group transition-all duration-300",
        active ? "scale-[1.02]" : "hover:scale-[1.01]"
      )}
    >
       <div className={cn(
         "w-full aspect-[16/10] rounded-2xl border transition-all duration-300 flex items-center justify-center overflow-hidden relative shadow-2xl",
         active ? "border-primary shadow-[0_0_20px_rgba(203,160,65,0.2)]" : "border-white/10 group-hover:border-white/20",
         previewClass
       )}>
          <div className="text-white group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100">
             {icon}
          </div>
          {active && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-0 duration-300">
               <Check size={14} strokeWidth={4} />
            </div>
          )}
       </div>
       <span className={cn(
         "text-[10px] font-black uppercase tracking-[0.2em]",
         active ? "text-primary" : "text-slate-500 group-hover:text-slate-300"
       )}>{title}</span>
    </button>
  );
}

function AccentCircle({ color, active, onClick, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick}>
       <div className={cn(
         "w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center p-0.5",
         active ? "border-primary" : "border-transparent group-hover:border-white/20"
       )}>
          <div className={cn("w-full h-full rounded-full shadow-lg", color)} />
       </div>
       <span className={cn("text-[8px] font-black uppercase tracking-tighter transition-colors", active ? "text-primary" : "text-slate-500")}>
          {label}
       </span>
    </div>
  );
}

function DensityButton({ active, onClick, label, desc }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-4 rounded-xl border transition-all duration-300",
        active ? "bg-primary text-black border-primary" : "bg-white/5 text-slate-500 border-white/5 hover:border-white/10"
      )}
    >
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
       <span className={cn("text-[9px] font-bold mt-0.5", active ? "text-black/60" : "text-slate-600")}>{desc}</span>
    </button>
  );
}
