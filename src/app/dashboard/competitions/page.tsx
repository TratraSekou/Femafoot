"use client";

import React, { useState, useMemo } from 'react';
import { Trophy, Plus, Shield, Calendar, Activity } from 'lucide-react';
import { Competition, CompetitionStatus, Category, CompetitionType, CompetitionFormData } from '@/components/competitions/types';
import { CompetitionFilters } from '@/components/competitions/competition-filters';
import { CompetitionCard } from '@/components/competitions/competition-card';
import { CompetitionFormModal } from '@/components/competitions/competition-form-modal';
import { DeleteCompetitionModal } from '@/components/competitions/delete-competition-modal';
import { CompetitionDetailsDrawer } from '@/components/competitions/competition-details-drawer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/simple-toast';

// --- MOCK DATA ---
const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: '1',
    name: 'Ligue 1 Orange',
    type: 'Championnat',
    category: 'Seniors',
    season: '2026-2027',
    startDate: '2026-08-15',
    endDate: '2027-05-30',
    teamsCount: 16,
    matchesCount: 240,
    status: 'EN COURS',
    stats: { totalGoals: 124, yellowCards: 342, redCards: 15, topScorer: 'Y. Bissouma (8 buts)', leadingTeam: 'Djoliba AC' }
  },
  {
    id: '2',
    name: 'Coupe du Mali',
    type: 'Coupe',
    category: 'Seniors',
    season: '2026-2027',
    startDate: '2026-10-01',
    endDate: '2027-06-15',
    teamsCount: 64,
    matchesCount: 63,
    status: 'EN COURS',
    stats: { totalGoals: 85, yellowCards: 120, redCards: 8, topScorer: 'A. Haidara (5 buts)', leadingTeam: 'Stade Malien' }
  },
  {
    id: '3',
    name: 'Championnat National U20',
    type: 'Championnat',
    category: 'U20',
    season: '2026-2027',
    startDate: '2026-09-01',
    endDate: '2027-04-30',
    teamsCount: 14,
    matchesCount: 182,
    status: 'À VENIR',
  },
  {
    id: '4',
    name: 'Super Coupe',
    type: 'Tournoi',
    category: 'Seniors',
    season: '2025-2026',
    startDate: '2026-08-01',
    endDate: '2026-08-01',
    teamsCount: 2,
    matchesCount: 1,
    status: 'TERMINÉE',
    stats: { totalGoals: 3, yellowCards: 5, redCards: 0, topScorer: 'E. Touré (2 buts)', leadingTeam: 'Djoliba AC' }
  },
  {
    id: '5',
    name: 'Ligue Féminine 1',
    type: 'Championnat',
    category: 'Féminines',
    season: '2026-2027',
    startDate: '2026-09-15',
    endDate: '2027-05-15',
    teamsCount: 12,
    matchesCount: 132,
    status: 'EN COURS',
    stats: { totalGoals: 95, yellowCards: 80, redCards: 2, topScorer: 'A. Traoré (12 buts)', leadingTeam: 'AS Mandé' }
  }
];

const SEASONS_LIST = Array.from(new Set(INITIAL_COMPETITIONS.map(c => c.season))).sort().reverse();

export default function CompetitionsPage() {
  const { toast } = useToast();
  
  // States
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('Tous');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tous'>('Tous');
  const [selectedType, setSelectedType] = useState<CompetitionType | 'Tous'>('Tous');
  const [selectedStatus, setSelectedStatus] = useState<CompetitionStatus | 'Tous'>('Tous');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  // Derived Data (Memoized)
  const filteredCompetitions = useMemo(() => {
    return competitions.filter(comp => {
      const matchSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSeason = selectedSeason === 'Tous' || comp.season === selectedSeason;
      const matchCategory = selectedCategory === 'Tous' || comp.category === selectedCategory;
      const matchType = selectedType === 'Tous' || comp.type === selectedType;
      const matchStatus = selectedStatus === 'Tous' || comp.status === selectedStatus;
      
      return matchSearch && matchSeason && matchCategory && matchType && matchStatus;
    });
  }, [competitions, searchQuery, selectedSeason, selectedCategory, selectedType, selectedStatus]);

  // KPIs
  const totalCompetitions = competitions.length;
  const competitionsEnCours = competitions.filter(c => c.status === 'EN COURS').length;
  const totalClubs = competitions.reduce((acc, curr) => acc + curr.teamsCount, 0); // Approximation
  const totalMatchs = competitions.reduce((acc, curr) => acc + curr.matchesCount, 0);

  // Handlers
  const handleOpenAdd = () => {
    setSelectedCompetition(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (comp: Competition) => {
    setSelectedCompetition(comp);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (comp: Competition) => {
    setSelectedCompetition(comp);
    setIsDeleteOpen(true);
  };

  const handleOpenView = (comp: Competition) => {
    setSelectedCompetition(comp);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (data: CompetitionFormData) => {
    if (selectedCompetition) {
      // Edit
      setCompetitions(competitions.map(c => c.id === selectedCompetition.id ? { ...c, ...data } : c));
      toast(`Les informations de ${data.name} ont été modifiées.`, "success");
    } else {
      // Add
      const newComp: Competition = {
        ...data,
        id: Math.random().toString(36).substring(7),
        stats: { totalGoals: 0, yellowCards: 0, redCards: 0, topScorer: 'N/A', leadingTeam: 'N/A' }
      };
      setCompetitions([newComp, ...competitions]);
      toast(`${data.name} a été créée avec succès.`, "success");
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedCompetition) {
      setCompetitions(competitions.filter(c => c.id !== selectedCompetition.id));
      toast("La compétition a été retirée du système.", "success");
      setSelectedCompetition(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Compétitions</h1>
          <p className="text-slate-400 mt-1">Gérez tous les championnats, coupes et tournois de la fédération.</p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(203,160,65,0.3)] transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" />
          Créer une compétition
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Actives (En cours)</p>
            <p className="text-2xl font-bold text-white">{competitionsEnCours} <span className="text-sm font-normal text-slate-500">/ {totalCompetitions}</span></p>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Saisons Gérées</p>
            <p className="text-2xl font-bold text-white">{SEASONS_LIST.length}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Clubs Engagés</p>
            <p className="text-2xl font-bold text-white">{totalClubs}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Matchs (Total)</p>
            <p className="text-2xl font-bold text-white">{totalMatchs}</p>
          </div>
        </div>
      </div>

      {/* FILTRES PREMIUM */}
      <CompetitionFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        seasonsList={SEASONS_LIST}
        totalResults={filteredCompetitions.length}
      />

      {/* GRILLE DES COMPÉTITIONS */}
      {filteredCompetitions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCompetitions.map((comp, index) => (
            <CompetitionCard 
              key={comp.id}
              competition={comp}
              index={index}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center glass-card rounded-2xl border border-white/5 border-dashed">
          <Trophy size={48} className="text-slate-500 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">Aucune compétition trouvée</h3>
          <p className="text-slate-400 max-w-sm">
            Modifiez vos filtres de recherche ou créez une nouvelle compétition.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-white/10 hover:bg-white/5 text-white"
            onClick={() => {
              setSearchQuery('');
              setSelectedSeason('Tous');
              setSelectedCategory('Tous');
              setSelectedType('Tous');
              setSelectedStatus('Tous');
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <CompetitionFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCompetition || undefined}
      />

      <DeleteCompetitionModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        competition={selectedCompetition}
      />

      <CompetitionDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        competition={selectedCompetition}
      />

    </div>
  );
}
