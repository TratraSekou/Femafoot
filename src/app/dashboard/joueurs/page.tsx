"use client";

import React, { useState, useMemo } from 'react';
import { Users, UserPlus, Activity, ShieldAlert, Globe } from 'lucide-react';
import { Joueur, Position, Status, JoueurFormData } from '@/components/joueurs/types';
import { JoueurFilters } from '@/components/joueurs/joueur-filters';
import { JoueurCard } from '@/components/joueurs/joueur-card';
import { JoueurFormModal } from '@/components/joueurs/joueur-form-modal';
import { DeleteJoueurModal } from '@/components/joueurs/delete-joueur-modal';
import { JoueurDetailsDrawer } from '@/components/joueurs/joueur-details-drawer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/simple-toast';

// --- MOCK DATA ---
const INITIAL_JOUEURS: Joueur[] = [
  {
    id: '1',
    firstName: 'Yves',
    lastName: 'Bissouma',
    age: 27,
    birthDate: '1996-08-30',
    club: 'Tottenham Hotspur',
    position: 'MIL',
    number: 8,
    nationality: 'Mali',
    status: 'Actif',
    stats: { matches: 25, goals: 3, assists: 5, yellowCards: 4, redCards: 0, rating: 84 }
  },
  {
    id: '2',
    firstName: 'Amadou',
    lastName: 'Haidara',
    age: 26,
    birthDate: '1998-01-31',
    club: 'RB Leipzig',
    position: 'MIL',
    number: 4,
    nationality: 'Mali',
    status: 'Blessé',
    stats: { matches: 18, goals: 1, assists: 2, yellowCards: 2, redCards: 0, rating: 81 }
  },
  {
    id: '3',
    firstName: 'Kamory',
    lastName: 'Doumbia',
    age: 21,
    birthDate: '2003-02-18',
    club: 'Brest',
    position: 'MIL', // On cast en ATT ou MIL pour le mock simple, mettons MIL
    number: 26,
    nationality: 'Mali',
    status: 'Actif',
    stats: { matches: 30, goals: 6, assists: 5, yellowCards: 1, redCards: 0, rating: 78 }
  },
  {
    id: '4',
    firstName: 'Djigui',
    lastName: 'Diarra',
    age: 29,
    birthDate: '1995-02-27',
    club: 'Young Africans',
    position: 'GB',
    number: 1,
    nationality: 'Mali',
    status: 'Actif',
    stats: { matches: 40, goals: 0, assists: 1, yellowCards: 3, redCards: 0, rating: 76 }
  },
  {
    id: '5',
    firstName: 'El Bilal',
    lastName: 'Touré',
    age: 22,
    birthDate: '2001-10-03',
    club: 'Atalanta',
    position: 'ATT',
    number: 10,
    nationality: 'Mali',
    status: 'Actif',
    stats: { matches: 15, goals: 5, assists: 1, yellowCards: 1, redCards: 0, rating: 77 }
  },
  {
    id: '6',
    firstName: 'Ibrahima',
    lastName: 'Koné',
    age: 24,
    birthDate: '1999-06-16',
    club: 'Almería',
    position: 'ATT',
    number: 9,
    nationality: 'Mali',
    status: 'Suspendu',
    stats: { matches: 12, goals: 4, assists: 0, yellowCards: 5, redCards: 1, rating: 75 }
  }
];

const CLUBS_LIST = Array.from(new Set(INITIAL_JOUEURS.map(j => j.club))).sort();

export default function JoueursPage() {
  const { toast } = useToast();
  
  // States
  const [joueurs, setJoueurs] = useState<Joueur[]>(INITIAL_JOUEURS);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState<string>('Tous');
  const [selectedPosition, setSelectedPosition] = useState<Position | 'Tous'>('Tous');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'Tous'>('Tous');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedJoueur, setSelectedJoueur] = useState<Joueur | null>(null);

  // Derived Data (Memoized)
  const filteredJoueurs = useMemo(() => {
    return joueurs.filter(joueur => {
      const matchSearch = `${joueur.firstName} ${joueur.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClub = selectedClub === 'Tous' || joueur.club === selectedClub;
      const matchPosition = selectedPosition === 'Tous' || joueur.position === selectedPosition;
      const matchStatus = selectedStatus === 'Tous' || joueur.status === selectedStatus;
      
      return matchSearch && matchClub && matchPosition && matchStatus;
    });
  }, [joueurs, searchQuery, selectedClub, selectedPosition, selectedStatus]);

  // KPIs
  const totalJoueurs = joueurs.length;
  const actifsJoueurs = joueurs.filter(j => j.status === 'Actif').length;
  const blessesJoueurs = joueurs.filter(j => j.status === 'Blessé').length;
  const etrangersJoueurs = joueurs.filter(j => j.club !== 'Stade Malien').length; // Mock rule
  const avgAge = Math.round(joueurs.reduce((acc, curr) => acc + curr.age, 0) / (totalJoueurs || 1));

  // Handlers
  const handleOpenAdd = () => {
    setSelectedJoueur(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (joueur: Joueur) => {
    setSelectedJoueur(joueur);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (joueur: Joueur) => {
    setSelectedJoueur(joueur);
    setIsDeleteOpen(true);
  };

  const handleOpenView = (joueur: Joueur) => {
    setSelectedJoueur(joueur);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (data: JoueurFormData) => {
    if (selectedJoueur) {
      // Edit
      setJoueurs(joueurs.map(j => j.id === selectedJoueur.id ? { ...j, ...data } : j));
      toast(`Les informations de ${data.firstName} ${data.lastName} ont été modifiées.`, "success");
    } else {
      // Add
      const newJoueur: Joueur = {
        ...data,
        id: Math.random().toString(36).substring(7),
        stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rating: 70 }
      };
      setJoueurs([newJoueur, ...joueurs]);
      toast(`${data.firstName} ${data.lastName} a été ajouté avec succès.`, "success");
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedJoueur) {
      setJoueurs(joueurs.filter(j => j.id !== selectedJoueur.id));
      toast("Le joueur a été retiré de la base de données.", "success");
      setSelectedJoueur(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Joueurs</h1>
          <p className="text-slate-400 mt-1">Gérez la base de données de tous les joueurs de la fédération.</p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(203,160,65,0.3)] transition-all hover:scale-105"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un joueur
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Joueurs</p>
            <p className="text-2xl font-bold text-white">{totalJoueurs}</p>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Joueurs Actifs</p>
            <p className="text-2xl font-bold text-white">{actifsJoueurs}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Blessés</p>
            <p className="text-2xl font-bold text-white">{blessesJoueurs}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Moy. d'Âge</p>
            <p className="text-2xl font-bold text-white">{avgAge} ans</p>
          </div>
        </div>
      </div>

      {/* FILTRES PREMIUM */}
      <JoueurFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedClub={selectedClub}
        setSelectedClub={setSelectedClub}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        clubsList={CLUBS_LIST}
        totalResults={filteredJoueurs.length}
      />

      {/* GRILLE DES JOUEURS */}
      {filteredJoueurs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredJoueurs.map((joueur, index) => (
            <JoueurCard 
              key={joueur.id}
              joueur={joueur}
              index={index}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center glass-card rounded-2xl border border-white/5 border-dashed">
          <Users size={48} className="text-slate-500 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">Aucun joueur trouvé</h3>
          <p className="text-slate-400 max-w-sm">
            Modifiez vos filtres de recherche ou ajoutez un nouveau joueur à la base de données.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-white/10 hover:bg-white/5 text-white"
            onClick={() => {
              setSearchQuery('');
              setSelectedClub('Tous');
              setSelectedPosition('Tous');
              setSelectedStatus('Tous');
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <JoueurFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedJoueur || undefined}
        clubsList={CLUBS_LIST}
      />

      <DeleteJoueurModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        joueur={selectedJoueur}
      />

      <JoueurDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        joueur={selectedJoueur}
      />

    </div>
  );
}
