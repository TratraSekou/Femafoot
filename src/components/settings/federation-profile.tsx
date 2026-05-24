import { User, ShieldCheck, Mail, Globe, Landmark } from 'lucide-react';

export function FederationProfile() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Hero Profile Card */}
      <div className="relative glass-card rounded-3xl border border-white/5 overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
         
         <div className="relative p-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-48 h-48 rounded-3xl bg-[#060d0a]/60 border border-white/10 p-6 backdrop-blur-xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 duration-500">
               <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/5/5f/Logo_Femafoot.svg/1200px-Logo_Femafoot.svg.png" alt="Femafoot Logo" className="w-full h-full object-contain" />
            </div>

            <div className="flex-1 space-y-6 text-center lg:text-left">
               <div className="space-y-2">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                     <span className="px-3 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full">Institutionnel</span>
                     <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Fondée en 1960</span>
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Fédération Malienne de Football</h2>
                  <p className="text-xl font-bold text-primary italic">Le cœur du football au Mali</p>
               </div>
               
               <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  La Femafoot est l'organisme national chargé de l'organisation du football au Mali. Elle gère les équipes nationales (Aigles) et les compétitions professionnelles et amateurs sur tout le territoire.
               </p>

               <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                     <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                     <span className="text-[10px] font-bold text-white uppercase">femafoot_officiel</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                     <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                     <span className="text-[10px] font-bold text-white uppercase">@femafoot</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Leadership Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <LeaderCard 
           role="Président" 
           name="Mamadou Touré" 
           info="Élu en 2023 pour un mandat de 4 ans."
           icon={<User size={20} className="text-primary" />}
         />
         <LeaderCard 
           role="Secrétaire Général" 
           name="Ibrahim Traoré" 
           info="Responsable de l'administration fédérale."
           icon={<ShieldCheck size={20} className="text-emerald-500" />}
         />
      </div>

    </div>
  );
}

function LeaderCard({ role, name, info, icon }: { role: string; name: string; info: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-start gap-5 hover:border-white/10 transition-all group">
       <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{role}</p>
          <h4 className="text-lg font-black text-white uppercase tracking-tight">{name}</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">{info}</p>
       </div>
    </div>
  );
}
