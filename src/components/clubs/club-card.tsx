"use client"
import React from "react";
import { Club } from "./types";
import { Button } from "@/components/ui/button";
import { Users, Shield, MapPin, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClubCardProps {
  club: Club;
  onView: (club: Club) => void;
  onEdit: (club: Club) => void;
  onDelete: (club: Club) => void;
}

export function ClubCard({ club, onView, onEdit, onDelete }: ClubCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl glass-card border border-white/5 overflow-hidden transition-all duration-400 hover:shadow-[0_0_30px_rgba(203,160,65,0.15)] hover:-translate-y-1 hover:border-primary/30 glow-effect">
      {/* Haut de la carte avec dégradé subtil */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      
      <div className="p-5 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#0a1511] flex items-center justify-center text-lg font-bold text-primary ring-1 ring-white/10 shadow-inner">
              {club.short}
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">{club.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <MapPin className="h-3 w-3" />
                {club.city}
              </div>
            </div>
          </div>
          {/* Actions Menu (Mock) */}
          <button className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-5">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
            club.status === "Actif" 
              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" 
              : "bg-slate-500/10 text-slate-400 ring-slate-500/20"
          )}>
            {club.status === "Actif" && <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span>}
            {club.status}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10">
            {club.division}
          </span>
        </div>

        {/* Détails */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Joueurs</span>
            <span className="text-slate-200 font-medium">{club.players}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Coach</span>
            <span className="text-slate-200 font-medium truncate max-w-[120px]">{club.coach}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer (Appears on hover) */}
      <div className="border-t border-white/5 bg-black/20 p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 relative z-10">
        <Button variant="ghost" size="sm" onClick={() => onView(club)} className="h-8 text-xs text-slate-400 hover:text-white hover:bg-white/10 flex-1 gap-1">
          <Eye className="h-3.5 w-3.5" /> Voir
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(club)} className="h-8 text-xs text-slate-400 hover:text-primary hover:bg-primary/10 flex-1 gap-1">
          <Edit className="h-3.5 w-3.5" /> Éditer
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(club)} className="h-8 text-xs text-slate-400 hover:text-red-400 hover:bg-red-400/10 flex-1 gap-1">
          <Trash2 className="h-3.5 w-3.5" /> Suppr
        </Button>
      </div>
    </div>
  );
}
