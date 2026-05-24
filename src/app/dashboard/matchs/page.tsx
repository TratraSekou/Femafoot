"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, CalendarPlus, Trophy, Activity, CheckCircle2 } from 'lucide-react';
import { Match, MatchStatus, MatchFormData } from '@/components/matchs/types';
import { MatchFilters } from '@/components/matchs/match-filters';
import { MatchCard } from '@/components/matchs/match-card';
import { MatchFormModal } from '@/components/matchs/match-form-modal';
import { DeleteMatchModal } from '@/components/matchs/delete-match-modal';
import { MatchDetailsDrawer } from '@/components/matchs/match-details-drawer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/simple-toast';
import { supabase } from '@/lib/supabase';

// Clubs and Competitions are fetched dynamically

export default function MatchsPage() {
  const { toast } = useToast();
  
  // States
  const [matchs, setMatchs] = useState<Match[]>([]);
  const [clubsList, setClubsList] = useState<string[]>([]);
  const [competitionsList, setCompetitionsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('Tous');
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'Tous'>('Tous');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch dropdowns
      const [clubsRes, compsRes, matchsRes] = await Promise.all([
        supabase.from('clubs').select('name'),
        supabase.from('competitions').select('name'),
        supabase
          .from('matches')
          .select(`
            *,
            home_club:clubs!home_club_id(name, logo_url, stadium),
            away_club:clubs!away_club_id(name, logo_url),
            competition:competitions(name)
          `)
          .order('match_date', { ascending: false })
      ]);

      if (matchsRes.error) throw matchsRes.error;

      if (clubsRes.data) setClubsList(clubsRes.data.map(c => c.name));
      if (compsRes.data) setCompetitionsList(compsRes.data.map(c => c.name));

      if (matchsRes.data) {
        const mappedMatchs: Match[] = matchsRes.data.map((d: any) => {
          let uiStatus: MatchStatus = 'À VENIR';
          if (d.status === 'Terminé') uiStatus = 'TERMINÉ';
          else if (d.status === 'En cours') uiStatus = 'LIVE';

          const dateObj = new Date(d.match_date);
          const dateStr = dateObj.toISOString().split('T')[0];
          const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

          return {
            id: d.id.toString(),
            homeTeam: { name: d.home_club?.name || "Inconnu", logo: d.home_club?.logo_url || '' },
            awayTeam: { name: d.away_club?.name || "Inconnu", logo: d.away_club?.logo_url || '' },
            homeScore: d.home_score,
            awayScore: d.away_score,
            date: dateStr,
            time: timeStr,
            stadium: d.home_club?.stadium || 'Stade Principal',
            competition: d.competition?.name || 'Compétition',
            referee: d.referee || 'Arbitre',
            status: uiStatus,
            liveMinute: d.status === 'En cours' ? 75 : undefined,
            stats: { possessionHome: 50, shotsHome: 4, shotsOnTargetHome: 2, cornersHome: 3, foulsHome: 11, possessionAway: 50, shotsAway: 4, shotsOnTargetAway: 2, cornersAway: 3, foulsAway: 11 }
          };
        });
        setMatchs(mappedMatchs);
      }
    } catch (err) {
      console.error("Error fetching matches data:", err);
      toast("Erreur lors de la récupération des matchs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Derived Data (Memoized)
  const filteredMatchs = useMemo(() => {
    return matchs.filter(match => {
      const matchSearch = `${match.homeTeam.name} ${match.awayTeam.name}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchComp = selectedCompetition === 'Tous' || match.competition === selectedCompetition;
      const matchStatusFilter = selectedStatus === 'Tous' || match.status === selectedStatus;
      
      return matchSearch && matchComp && matchStatusFilter;
    }).sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
  }, [matchs, searchQuery, selectedCompetition, selectedStatus]);

  // KPIs
  const totalMatchs = matchs.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const matchsToday = matchs.filter(m => m.date === todayStr).length;
  const matchsLive = matchs.filter(m => m.status === 'LIVE').length;
  const matchsTermines = matchs.filter(m => m.status === 'TERMINÉ').length;

  // Handlers
  const handleOpenAdd = () => {
    setSelectedMatch(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (match: Match) => {
    setSelectedMatch(match);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (match: Match) => {
    setSelectedMatch(match);
    setIsDeleteOpen(true);
  };

  const handleOpenView = (match: Match) => {
    setSelectedMatch(match);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (data: MatchFormData) => {
    try {
      let dbStatus = 'À venir';
      if (data.status === 'TERMINÉ') dbStatus = 'Terminé';
      else if (data.status === 'LIVE') dbStatus = 'En cours';

      const scheduledAt = new Date(`${data.date}T${data.time}`).toISOString();

      // Resolve IDs for clubs and competition
      const { data: homeClub } = await supabase.from('clubs').select('id').eq('name', data.homeTeam.name).single();
      const { data: awayClub } = await supabase.from('clubs').select('id').eq('name', data.awayTeam.name).single();
      const { data: comp } = await supabase.from('competitions').select('id').eq('name', data.competition || competitionsList[0]).single();

      if (!comp || !homeClub || !awayClub) {
        toast("Données de match invalides (club ou compétition introuvable).", "error");
        return;
      }

      const dbPayload = {
        competition_id: comp.id,
        home_club_id: homeClub.id,
        away_club_id: awayClub.id,
        home_score: data.homeScore,
        away_score: data.awayScore,
        status: dbStatus,
        referee: "Arbitre (à définir)",
        match_date: scheduledAt
      };

      if (selectedMatch) {
        // Edit
        const { error } = await supabase
          .from('matches')
          .update(dbPayload)
          .eq('id', Number(selectedMatch.id));

        if (error) throw error;
        toast(`Le match ${data.homeTeam.name} vs ${data.awayTeam.name} a été modifié.`, "success");
      } else {
        // Add
        const { error } = await supabase
          .from('matches')
          .insert(dbPayload);

        if (error) throw error;
        toast(`La rencontre a été ajoutée au calendrier.`, "success");
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving match:", err);
      toast("Erreur lors de l'enregistrement du match.", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedMatch) {
      try {
        const { error } = await supabase
          .from('matches')
          .delete()
          .eq('id', Number(selectedMatch.id));

        if (error) throw error;
        toast("Le match a été retiré du calendrier.", "success");
        setSelectedMatch(null);
        setIsDeleteOpen(false);
        fetchData();
      } catch (err) {
        console.error("Error deleting match:", err);
        toast("Erreur lors de la suppression du match.", "error");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Matchs</h1>
          <p className="text-slate-400 mt-1">Gérez le calendrier et les résultats des rencontres sportives.</p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(203,160,65,0.3)] transition-all hover:scale-105"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Programmer un match
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <CalendarIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Matchs</p>
            <p className="text-2xl font-bold text-white">{totalMatchs}</p>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500 relative">
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Matchs en cours</p>
            <p className="text-2xl font-bold text-white">{matchsLive}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Terminés</p>
            <p className="text-2xl font-bold text-white">{matchsTermines}</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Aujourd'hui</p>
            <p className="text-2xl font-bold text-white">{matchsToday}</p>
          </div>
        </div>
      </div>

      {/* FILTRES PREMIUM */}
      <MatchFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCompetition={selectedCompetition}
        setSelectedCompetition={setSelectedCompetition}
        competitionsList={competitionsList}
        totalResults={filteredMatchs.length}
      />

      {/* GRILLE DES MATCHS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredMatchs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMatchs.map((match, index) => (
            <MatchCard 
              key={match.id}
              match={match}
              index={index}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center glass-card rounded-2xl border border-white/5 border-dashed">
          <CalendarIcon size={48} className="text-slate-500 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">Aucun match trouvé</h3>
          <p className="text-slate-400 max-w-sm">
            Modifiez vos critères de recherche ou programmez un nouveau match.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-white/10 hover:bg-white/5 text-white"
            onClick={() => {
              setSearchQuery('');
              setSelectedCompetition('Tous');
              setSelectedStatus('Tous');
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <MatchFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMatch || undefined}
        clubsList={clubsList}
        competitionsList={competitionsList}
      />

      <DeleteMatchModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        match={selectedMatch}
      />

      <MatchDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        match={selectedMatch}
      />

    </div>
  );
}
