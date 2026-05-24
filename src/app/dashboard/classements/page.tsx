"use client"

import React, { useState, useMemo } from 'react'
import { Trophy, TrendingUp, ShieldAlert, Target, Calendar } from 'lucide-react'
import { StandingFilters } from '@/components/classements/standing-filters'
import { StandingTable } from '@/components/classements/standing-table'
import { ClubStandingDetails } from '@/components/classements/club-standing-details'
import { StandingRow, RankingStats } from '@/components/classements/types'

// Mock Data
const MOCK_STANDING: StandingRow[] = [
  { id: '1', position: 1, clubName: 'Djoliba AC', clubLogo: '', played: 22, won: 15, drawn: 5, lost: 2, goalsFor: 42, goalsAgainst: 12, goalDifference: 30, points: 50, form: ['W', 'W', 'W', 'D', 'W'], zone: 'qualification' },
  { id: '2', position: 2, clubName: 'Stade Malien', clubLogo: '', played: 22, won: 14, drawn: 4, lost: 4, goalsFor: 38, goalsAgainst: 15, goalDifference: 23, points: 46, form: ['W', 'L', 'W', 'W', 'D'], zone: 'qualification' },
  { id: '3', position: 3, clubName: 'AS Real Bamako', clubLogo: '', played: 22, won: 12, drawn: 6, lost: 4, goalsFor: 31, goalsAgainst: 18, goalDifference: 13, points: 42, form: ['D', 'W', 'D', 'W', 'W'], zone: 'playoff' },
  { id: '4', position: 4, clubName: 'Onze Créateurs', clubLogo: '', played: 22, won: 11, drawn: 5, lost: 6, goalsFor: 29, goalsAgainst: 20, goalDifference: 9, points: 38, form: ['W', 'D', 'L', 'W', 'L'], zone: 'playoff' },
  { id: '5', position: 5, clubName: 'USFAS', clubLogo: '', played: 22, won: 10, drawn: 7, lost: 5, goalsFor: 27, goalsAgainst: 22, goalDifference: 5, points: 37, form: ['D', 'W', 'W', 'L', 'D'], zone: 'none' },
  { id: '6', position: 6, clubName: 'Bakaridjan', clubLogo: '', played: 22, won: 9, drawn: 6, lost: 7, goalsFor: 24, goalsAgainst: 21, goalDifference: 3, points: 33, form: ['L', 'L', 'W', 'D', 'W'], zone: 'none' },
  { id: '7', position: 7, clubName: 'AFE', clubLogo: '', played: 22, won: 8, drawn: 7, lost: 7, goalsFor: 22, goalsAgainst: 23, goalDifference: -1, points: 31, form: ['W', 'D', 'L', 'L', 'W'], zone: 'none' },
  { id: '8', position: 8, clubName: 'COB', clubLogo: '', played: 22, won: 7, drawn: 5, lost: 10, goalsFor: 19, goalsAgainst: 28, goalDifference: -9, points: 26, form: ['L', 'W', 'L', 'D', 'L'], zone: 'none' },
  { id: '9', position: 9, clubName: 'USC Kita', clubLogo: '', played: 22, won: 6, drawn: 4, lost: 12, goalsFor: 15, goalsAgainst: 30, goalDifference: -15, points: 22, form: ['L', 'L', 'W', 'L', 'D'], zone: 'relegation' },
  { id: '10', position: 10, clubName: 'Black Stars', clubLogo: '', played: 22, won: 4, drawn: 3, lost: 15, goalsFor: 12, goalsAgainst: 40, goalDifference: -28, points: 15, form: ['L', 'L', 'L', 'W', 'L'], zone: 'relegation' },
]

const STATS: RankingStats = {
  leader: 'Djoliba AC',
  bestAttack: { club: 'Djoliba AC', goals: 42 },
  bestDefense: { club: 'Djoliba AC', goals: 12 },
  totalMatches: 110,
  totalGoals: 259
}

export default function ClassementsPage() {
  const [selectedClub, setSelectedClub] = useState<StandingRow | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleClubClick = (club: StandingRow) => {
    setSelectedClub(club)
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Classements</h1>
          <p className="text-slate-400 mt-1">Gérez et visualisez l'état des championnats nationaux.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard 
          title="Leader Actuel" 
          value={STATS.leader} 
          icon={<Trophy className="text-primary" size={20} />} 
          subtitle="Ligue 1 Malienne"
        />
        <KPICard 
          title="Meilleure Attaque" 
          value={STATS.bestAttack.club} 
          icon={<Target className="text-blue-500" size={20} />} 
          subtitle={`${STATS.bestAttack.goals} buts marqués`}
        />
        <KPICard 
          title="Meilleure Défense" 
          value={STATS.bestDefense.club} 
          icon={<ShieldAlert className="text-emerald-500" size={20} />} 
          subtitle={`${STATS.bestDefense.goals} encaissés`}
        />
        <KPICard 
          title="Matchs Joués" 
          value={STATS.totalMatches.toString()} 
          icon={<Calendar className="text-amber-500" size={20} />} 
          subtitle="Saison 2023-2024"
        />
        <KPICard 
          title="Total Buts" 
          value={STATS.totalGoals.toString()} 
          icon={<TrendingUp className="text-purple-500" size={20} />} 
          subtitle="2.35 b/match"
        />
      </div>

      {/* Section Filtres */}
      <StandingFilters 
        onCompetitionChange={(v) => console.log(v)}
        onSeasonChange={(v) => console.log(v)}
        onCategoryChange={(v) => console.log(v)}
        onGroupChange={(v) => console.log(v)}
      />

      {/* Tableau de Classement */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Classement Général</h2>
           <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-bold uppercase tracking-tighter">Mise à jour : il y a 2h</span>
        </div>
        <StandingTable data={MOCK_STANDING} onClubClick={handleClubClick} />
      </div>

      {/* Drawer Détail */}
      <ClubStandingDetails 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        club={selectedClub} 
      />
    </div>
  )
}

function KPICard({ title, value, icon, subtitle }: { title: string; value: string; icon: React.ReactNode; subtitle: string }) {
  return (
    <div className="group relative glass-card p-5 rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-white/10">
      {/* Glow Effect */}
      <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="relative z-10 flex flex-col gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 transition-transform duration-500 group-hover:rotate-6">
          {icon}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-0.5">{title}</p>
          <p className="text-lg font-black text-white truncate tracking-tight">{value}</p>
          <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
