"use client"
import React from "react";
import { Club } from "./types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MapPin, Users, Shield, Trophy, Activity, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClubDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club | null;
}

export function ClubDetailsDrawer({ isOpen, onClose, club }: ClubDetailsDrawerProps) {
  if (!club) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-[#060c0a] border-l border-white/10 overflow-y-auto custom-scrollbar">
        {/* Cover & Header */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-[#060c0a] border-b border-white/5 flex items-end p-6">
          <div className="absolute top-4 right-14 flex gap-2">
             <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ring-1 ring-inset backdrop-blur-md",
              club.status === "Actif" 
                ? "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30" 
                : "bg-slate-500/20 text-slate-400 ring-slate-500/30"
            )}>
              {club.status}
            </span>
          </div>

          <div className="flex items-center gap-4 relative z-10 translate-y-8">
            <div className="h-24 w-24 rounded-2xl bg-[#0a1511] flex items-center justify-center text-3xl font-black text-primary ring-2 ring-primary/50 shadow-2xl">
              {club.short}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-12 space-y-8">
          <div>
            <SheetTitle className="font-heading text-2xl font-bold text-white mb-1">{club.name}</SheetTitle>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4" /> {club.city} {club.region ? `(${club.region})` : ""}
              <span className="text-slate-600">•</span>
              <span className="text-primary font-medium">{club.division}</span>
              {club.founded_year && (
                <>
                  <span className="text-slate-600">•</span>
                  <span>Est. {club.founded_year}</span>
                </>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{club.players}</p>
                <p className="text-xs text-slate-400 font-medium">Joueurs licenciés</p>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-base font-bold text-white truncate">{club.coach || "Non défini"}</p>
                <p className="text-xs text-slate-400 font-medium">Entraîneur principal</p>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col gap-2 col-span-2">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-base font-bold text-white truncate">{club.stadium || "Non défini"}</p>
                <p className="text-xs text-slate-400 font-medium">Stade de réception</p>
              </div>
            </div>
            {club.description && (
              <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col gap-2 col-span-2 mt-2">
                <p className="text-sm text-slate-300 leading-relaxed">{club.description}</p>
              </div>
            )}
          </div>

          {/* Mock Recent Activity */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Forme Récente
            </h3>
            <div className="space-y-3">
              {[
                { result: "V", score: "2 - 0", opp: "Onze Créateurs", date: "Il y a 2 jours", color: "bg-emerald-500/20 text-emerald-400" },
                { result: "N", score: "1 - 1", opp: "AS Real", date: "Il y a 1 sem", color: "bg-slate-500/20 text-slate-300" },
                { result: "V", score: "3 - 1", opp: "USFAS", date: "Il y a 2 sem", color: "bg-emerald-500/20 text-emerald-400" },
                { result: "D", score: "0 - 1", opp: "Stade Malien", date: "Il y a 3 sem", color: "bg-red-500/20 text-red-400" },
              ].map((match, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className={cn("flex items-center justify-center h-8 w-8 rounded font-bold text-sm", match.color)}>
                      {match.result}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-[120px]">{match.opp}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1"><CalendarDays className="h-3 w-3" />{match.date}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-white bg-black/30 px-2 py-1 rounded">
                    {match.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
