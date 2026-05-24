"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, Trophy, Plus, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Club, ClubFormData } from "@/components/clubs/types"
import { ClubCard } from "@/components/clubs/club-card"
import { ClubFilters } from "@/components/clubs/club-filters"
import { ClubFormModal } from "@/components/clubs/club-form-modal"
import { DeleteConfirmModal } from "@/components/clubs/delete-confirm-modal"
import { ClubDetailsDrawer } from "@/components/clubs/club-details-drawer"
import { useToast } from "@/components/ui/simple-toast"
import { supabase } from "@/lib/supabase"

export default function ClubsPage() {
  const { toast } = useToast();
  
  // -- ÉTATS DES DONNÉES --
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  
  // -- ÉTATS DES FILTRES --
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");

  // -- ÉTATS DES MODALS --
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  // -- RÉCUPÉRATION DES CLUBS DEPUIS SUPABASE --
  useEffect(() => {
    async function fetchClubs() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("clubs")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw error;
        if (data) setClubs(data as any);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        toast("Erreur lors de la récupération des clubs.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  // -- LOGIQUE DE FILTRAGE --
  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const matchSearch = 
        club.name.toLowerCase().includes(search.toLowerCase()) || 
        club.city.toLowerCase().includes(search.toLowerCase()) ||
        club.coach.toLowerCase().includes(search.toLowerCase());
      
      const matchDivision = division ? club.division === division : true;
      const matchRegion = region ? club.city === region : true;
      const matchStatus = status ? club.status === status : true;

      return matchSearch && matchDivision && matchRegion && matchStatus;
    });
  }, [clubs, search, division, region, status]);

  // -- LOGIQUE KPI DYNAMIQUE --
  const stats = useMemo(() => {
    const total = clubs.length;
    const actifs = clubs.filter(c => c.status === "Actif").length;
    const players = clubs.reduce((acc, c) => acc + c.players, 0);
    const divisionsCount = new Set(clubs.map(c => c.division)).size;
    return { total, actifs, players, divisionsCount };
  }, [clubs]);

  const CLUBS_KPI = [
    { title: "Total Clubs", value: stats.total.toString(), trend: "+4", icon: Shield, color: "text-primary" },
    { title: "Clubs Actifs", value: stats.actifs.toString(), trend: "+2", icon: Activity, color: "text-emerald-400" },
    { title: "Joueurs Licenciés", value: stats.players.toLocaleString(), trend: "+120", icon: Users, color: "text-blue-400" },
    { title: "Divisions", value: stats.divisionsCount.toString(), trend: "0", icon: Trophy, color: "text-purple-400" },
  ];

  // -- HANDLERS CRUD --
  const openAddModal = () => {
    setSelectedClub(null);
    setIsFormOpen(true);
  };

  const openEditModal = (club: Club) => {
    setSelectedClub(club);
    setIsFormOpen(true);
  };

  const openDeleteModal = (club: Club) => {
    setSelectedClub(club);
    setIsDeleteOpen(true);
  };

  const openViewDrawer = (club: Club) => {
    setSelectedClub(club);
    setIsDrawerOpen(true);
  };

  const handleSave = async (data: ClubFormData | Club) => {
    try {
      if (data.id) {
        // Modification
        const { error } = await supabase
          .from("clubs")
          .update({
            name: data.name,
            short: data.short,
            city: data.city,
            division: data.division,
            coach: data.coach,
            players: data.players,
            stadium: data.stadium,
            status: data.status
          })
          .eq("id", data.id);
        if (error) throw error;
        setClubs(prev => prev.map(c => c.id === data.id ? ({ ...data, id: data.id } as Club) : c));
        toast(`Le club ${data.name} a été mis à jour avec succès.`, "success");
      } else {
        // Ajout
        const { data: newClubs, error } = await supabase
          .from("clubs")
          .insert({
            name: data.name,
            short: data.short,
            city: data.city,
            division: data.division,
            coach: data.coach,
            players: data.players,
            stadium: data.stadium,
            status: data.status
          })
          .select();
        if (error) throw error;
        if (newClubs && newClubs.length > 0) {
          setClubs(prev => [newClubs[0] as any, ...prev]);
          toast(`Le club ${data.name} a été ajouté avec succès.`, "success");
        }
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error saving club:", err);
      toast("Erreur lors de l'enregistrement du club.", "error");
    }
  };

  const handleDelete = async () => {
    if (selectedClub) {
      try {
        const { error } = await supabase
          .from("clubs")
          .delete()
          .eq("id", selectedClub.id);
        if (error) throw error;
        setClubs(prev => prev.filter(c => c.id !== selectedClub.id));
        toast(`Le club ${selectedClub.name} a été supprimé.`, "error");
        setIsDeleteOpen(false);
      } catch (err) {
        console.error("Error deleting club:", err);
        toast("Erreur lors de la suppression du club.", "error");
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Clubs Affiliés</h1>
          <p className="text-white/70 mt-1 sm:text-lg font-medium tracking-wide">
            Gérez les clubs, leurs effectifs et leurs statuts en temps réel.
          </p>
        </div>
        <Button 
          onClick={openAddModal}
          className="bg-primary text-black hover:bg-primary/90 font-bold shadow-[0_0_15px_rgba(203,160,65,0.4)] hover:shadow-[0_0_25px_rgba(203,160,65,0.6)] transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un club
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out fill-mode-both delay-100">
        {CLUBS_KPI.map((kpi, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-heading tracking-wide text-sm">{kpi.title}</CardTitle>
              <kpi.icon className={cn("h-5 w-5 opacity-80", kpi.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {loading ? "..." : kpi.value}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10">
                  {kpi.trend} cette saison
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FILTRES */}
      <ClubFilters 
        search={search} setSearch={setSearch}
        division={division} setDivision={setDivision}
        region={region} setRegion={setRegion}
        status={status} setStatus={setStatus}
        totalClubs={filteredClubs.length}
      />

      {/* LISTE DES CLUBS */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredClubs.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both delay-300">
          {filteredClubs.map((club) => (
            <ClubCard 
              key={club.id} 
              club={club} 
              onView={openViewDrawer}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500 glass-card rounded-2xl border border-white/5">
          <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
            <Shield className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Aucun club trouvé</h3>
          <p className="text-slate-400 max-w-sm mb-6">
            Aucun club ne correspond à votre recherche ou à vos filtres actuels. Modifiez vos critères pour voir plus de résultats.
          </p>
          <Button variant="outline" onClick={() => {setSearch(""); setDivision(""); setRegion(""); setStatus("");}} className="border-white/10 text-white hover:bg-white/10">
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <ClubFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        club={selectedClub}
        onSave={handleSave}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        club={selectedClub}
        onConfirm={handleDelete}
      />

      <ClubDetailsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        club={selectedClub}
      />

    </div>
  )
}
