"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Ticket, Users, Trophy, AlertTriangle, Clock, Calendar, MapPin, Database, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/simple-toast'
import { BilletterieFilters } from '@/components/billetterie/billetterie-filters'
import { MatchCard } from '@/components/billetterie/match-card'
import { ReservationCard } from '@/components/billetterie/reservation-card'
import { BilletterieModal } from '@/components/billetterie/billetterie-modal'
import { MatchDetailsDrawer } from '@/components/billetterie/match-details-drawer'
import { ReservationDetailsDrawer } from '@/components/billetterie/reservation-details-drawer'
import { MatchBilletterie, TicketReservation, BilletterieStats, ReservationStatus, TicketCategoryName } from '@/components/billetterie/types'
import { supabase } from '@/lib/supabase'

const getLogo = (name: string) => {
  if (name.includes("Djoliba")) return "https://upload.wikimedia.org/wikipedia/fr/thumb/c/cf/Logo_Djoliba_AC.svg/1200px-Logo_Djoliba_AC.svg.png";
  if (name.includes("Stade Malien")) return "https://upload.wikimedia.org/wikipedia/fr/0/07/Stade_malien.png";
  if (name.includes("Real de Bamako")) return "https://upload.wikimedia.org/wikipedia/fr/7/70/Logo_AS_Real_Bamako.png";
  return "https://upload.wikimedia.org/wikipedia/fr/thumb/5/5f/Logo_Femafoot.svg/1200px-Logo_Femafoot.svg.png";
};

export default function BilletteriePage() {
  const { toast } = useToast()
  
  // States
  const [matches, setMatches] = useState<MatchBilletterie[]>([])
  const [reservations, setReservations] = useState<TicketReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'matchs' | 'reservations'>('matchs')
  
  // Filters States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompetition, setSelectedCompetition] = useState('all')
  const [selectedVenue, setSelectedVenue] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMatchDrawerOpen, setIsMatchDrawerOpen] = useState(false)
  const [isResDrawerOpen, setIsResDrawerOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<MatchBilletterie | null>(null)
  const [selectedRes, setSelectedRes] = useState<TicketReservation | null>(null)

  // --- CHARGEMENT DYNAMIQUE SUPABASE ---
  const fetchData = async () => {
    try {
      setLoading(true)
      // 1. Déclencher le nettoyage automatique des réservations expirées sur Supabase
      await supabase.rpc('release_expired_tickets')

      // 2. Charger les matchs
      const { data: dbMatches, error: matchErr } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          match_date,
          home_club:clubs!home_club_id(name),
          away_club:clubs!away_club_id(name),
          competition:competitions(name),
          tickets(id, category, price, available_quantity, reserved_quantity)
        `)
        .order('match_date', { ascending: true })
      
      if (matchErr) throw matchErr

      // 3. Charger les réservations
      const { data: dbReservations, error: resErr } = await supabase
        .from('ticket_reservations')
        .select(`
          id,
          client_name,
          client_phone,
          status,
          expires_at,
          created_at,
          quantity,
          ticket:tickets(
            id,
            category,
            price,
            match:matches(
               id,
               home_club:clubs!home_club_id(name),
               away_club:clubs!away_club_id(name)
            )
          )
        `)
        .order('created_at', { ascending: false })
      
      if (resErr) throw resErr

      // 4. Mappage des Réservations
      let mappedReservations: TicketReservation[] = []
      if (dbReservations) {
        mappedReservations = dbReservations.map((r: any) => {
          const t = r.ticket;
          const m = t?.match;
          const matchLabel = m ? `${m.home_club?.name} vs ${m.away_club?.name}` : "Match Inconnu"
          
          return {
            id: r.id,
            matchId: m ? m.id.toString() : "",
            matchName: matchLabel,
            clientName: r.client_name,
            clientPhone: r.client_phone,
            clientNeighborhood: "Bamako",
            category: t?.category as TicketCategoryName || 'Standard',
            quantity: r.quantity,
            totalPrice: Number(t?.price || 0) * r.quantity,
            date: r.created_at,
            status: r.status === 'EN TRAITEMENT' ? 'EN ATTENTE' : r.status as ReservationStatus,
            expiresAt: r.expires_at
          }
        })
        setReservations(mappedReservations)
      }

      // 5. Mappage des Matchs (Abstract Stadium Seat Tiers)
      if (dbMatches) {
        const mappedMatches: MatchBilletterie[] = dbMatches.map((m: any) => {
          const homeName = m.home_club?.name || "Inconnu"
          const awayName = m.away_club?.name || "Inconnu"

          const vipRes = mappedReservations
            .filter(r => r.matchId === m.id.toString() && r.category === 'VIP' && r.status !== 'ANNULÉE' && r.status !== 'EXPIRÉE')
            .reduce((sum, r) => sum + r.quantity, 0)
          
          const tribRes = mappedReservations
            .filter(r => r.category === 'Tribune' && r.matchId === m.id.toString() && r.status !== 'ANNULÉE' && r.status !== 'EXPIRÉE')
            .reduce((sum, r) => sum + r.quantity, 0)
          
          const stdRes = mappedReservations
            .filter(r => (r.category === 'Standard' || r.category === 'Pelouse') && r.matchId === m.id.toString() && r.status !== 'ANNULÉE' && r.status !== 'EXPIRÉE')
            .reduce((sum, r) => sum + r.quantity, 0)

          const dObj = new Date(m.match_date || new Date())

          return {
            id: m.id.toString(),
            homeTeam: { name: homeName, logo: getLogo(homeName) },
            awayTeam: { name: awayName, logo: getLogo(awayName) },
            competition: m.competition?.name || "Ligue 1 Malienne",
            date: dObj.toISOString().split('T')[0],
            time: dObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            venue: "Stade du 26 Mars",
            status: m.status === 'À venir' ? 'Ouvert' : m.status === 'En cours' ? 'Presque complet' : 'Fermé',
            categories: [
              { name: 'VIP', price: 10000, capacity: 100, available: 100 - vipRes, reserved: vipRes },
              { name: 'Tribune', price: 3000, capacity: 1500, available: 1500 - tribRes, reserved: tribRes },
              { name: 'Standard', price: 1000, capacity: 10000, available: 10000 - stdRes, reserved: stdRes },
            ]
          }
        })
        setMatches(mappedMatches)
      }

    } catch (err) {
      console.error("Error fetching billetterie data:", err)
      toast("Erreur lors de la récupération de la billetterie.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- ACTIONS MATCHS ---
  const handleSaveMatch = async (match: MatchBilletterie) => {
    try {
      const dbStatus = match.status === 'Ouvert' ? 'À venir' : match.status === 'Presque complet' ? 'En cours' : 'Terminé'

      const exists = matches.find(m => m.id === match.id)
      if (exists) {
        const { error } = await supabase
          .from('matches')
          .update({ status: dbStatus })
          .eq('id', Number(match.id))
        if (error) throw error
        toast("Statut du match mis à jour !", "success")
      } else {
        toast("Veuillez créer le match depuis la page Matchs pour sélectionner les clubs.", "error")
        return
      }
      setIsModalOpen(false)
      fetchData()
    } catch (err) {
      console.error("Error saving match:", err)
      toast("Erreur lors de la sauvegarde.", "error")
    }
  }

  const handleDeleteMatch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', Number(id))
      if (error) throw error
      toast("Billetterie supprimée.", "success")
      fetchData()
    } catch (err) {
      console.error("Error deleting match:", err)
      toast("Erreur lors de la suppression.", "error")
    }
  }

  const handleReserveSimulation = async (match: MatchBilletterie) => {
    const standardCat = match.categories.find(c => c.name === 'Standard')
    if (!standardCat || standardCat.available <= 0) {
       toast("Plus de places disponibles en Standard !", "error")
       return
    }

    try {
      const { data: tickets } = await supabase.from('tickets').select('id, price').eq('match_id', Number(match.id)).eq('category', 'Standard').limit(1);
      if (!tickets || tickets.length === 0) { toast("Billetterie non configurée.", "error"); return; }
      
      const ticketId = tickets[0].id;

      const { error } = await supabase
        .from('ticket_reservations')
        .insert({
          ticket_id: ticketId,
          client_name: "Sim Billetterie",
          client_phone: "+223 00 00 00 00",
          quantity: 1,
          status: 'EN TRAITEMENT'
        })
      if (error) throw error
      toast(`Place réservée avec succès pour le match.`, "success")
      fetchData()
    } catch (err) {
      console.error("Error creating reservation:", err)
      toast("Erreur lors de la réservation.", "error")
    }
  }

  // --- ACTIONS RÉSERVATIONS ---
  const handleValidateRes = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ticket_reservations')
        .update({ status: 'VALIDÉE' })
        .eq('id', id)
      if (error) throw error
      toast("Réservation confirmée !", "success")
      fetchData()
    } catch (err) {
      console.error("Error validating reservation:", err)
      toast("Erreur lors de la validation.", "error")
    }
  }

  const handleCancelRes = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ticket_reservations')
        .update({ status: 'ANNULÉE' })
        .eq('id', id)
      if (error) throw error
      toast("Réservation annulée. Places libérées.", "success")
      fetchData()
    } catch (err) {
      console.error("Error cancelling reservation:", err)
      toast("Erreur lors de l'annulation.", "error")
    }
  }

  // --- FILTERING ---
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const matchSearch = (m.homeTeam.name + m.awayTeam.name).toLowerCase().includes(searchQuery.toLowerCase())
      const matchComp = selectedCompetition === 'all' || m.competition === selectedCompetition
      const matchVenue = selectedVenue === 'all' || m.venue === selectedVenue
      const matchStatus = selectedStatus === 'all' || m.status === selectedStatus
      const matchCat = selectedCategory === 'all' || m.categories.some(c => c.name === selectedCategory && c.available > 0)
      return matchSearch && matchComp && matchVenue && matchStatus && matchCat
    })
  }, [matches, searchQuery, selectedCompetition, selectedVenue, selectedStatus, selectedCategory])

  const filteredReservations = useMemo(() => {
    return reservations.filter(r => 
      r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.matchName.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [reservations, searchQuery])

  // Stats
  const stats: BilletterieStats = useMemo(() => {
    const totalTicketsAvailable = matches.reduce((acc, m) => acc + m.categories.reduce((a, c) => a + c.available, 0), 0)
    const pendingReservations = reservations.filter(r => r.status === 'EN ATTENTE' || r.status === 'EN TRAITEMENT').length
    const activeMatches = matches.filter(m => m.status !== 'Fermé').length
    const reservedSeats = matches.reduce((acc, m) => acc + m.categories.reduce((a, c) => a + c.reserved, 0), 0)
    const revenue = reservations.filter(r => r.status === 'VALIDÉE').reduce((sum, r) => sum + r.totalPrice, 0)
    return { totalTicketsAvailable, pendingReservations, activeMatches, reservedSeats, revenue }
  }, [matches, reservations])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Billetterie</h1>
          <p className="text-slate-400 mt-1">Gestion des événements sportifs et réservations de places.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             variant="outline"
             onClick={() => setActiveTab(activeTab === 'matchs' ? 'reservations' : 'matchs')}
             className="h-12 px-6 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
           >
              {activeTab === 'matchs' ? (
                <>
                  <ClipboardList className="mr-2 h-5 w-5 text-primary" /> Voir Réservations
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-5 w-5 text-primary" /> Voir Matchs
                </>
              )}
           </Button>
           <Button 
            onClick={() => { setSelectedMatch(null); setIsModalOpen(true); }}
            className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest h-12 px-8 rounded-2xl shadow-[0_0_20px_rgba(203,160,65,0.3)] transition-all hover:scale-105"
           >
             <Plus className="mr-2 h-5 w-5" />
             Créer une billetterie
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Disponibles" value={stats.totalTicketsAvailable} icon={<Database className="text-blue-500" />} />
        <StatCard title="En attente" value={stats.pendingReservations} icon={<Clock className="text-amber-500" />} highlight={stats.pendingReservations > 0} />
        <StatCard title="Matchs Actifs" value={stats.activeMatches} icon={<Trophy className="text-primary" />} />
        <StatCard title="Places Bloquées" value={stats.reservedSeats} icon={<Users className="text-emerald-500" />} />
        <StatCard title="Revenus (est.)" value={`${(stats.revenue / 1000000).toFixed(1)}M`} icon={<Ticket className="text-purple-500" />} />
      </div>

      {/* Filter Bar */}
      <BilletterieFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCompetition={selectedCompetition}
        setSelectedCompetition={setSelectedCompetition}
        selectedVenue={selectedVenue}
        setSelectedVenue={setSelectedVenue}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Tabs Content */}
      <div className="space-y-6">
         <div className="flex items-center gap-4 border-b border-white/5 pb-1">
            <button 
              onClick={() => setActiveTab('matchs')}
              className={cn(
                "pb-3 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
                activeTab === 'matchs' ? "text-primary" : "text-slate-500 hover:text-slate-300"
              )}
            >
               Matchs & Événements
               {activeTab === 'matchs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(203,160,65,0.5)]" />}
            </button>
            <button 
              onClick={() => setActiveTab('reservations')}
              className={cn(
                "pb-3 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
                activeTab === 'reservations' ? "text-primary" : "text-slate-500 hover:text-slate-300"
              )}
            >
               Réservations en cours
               {activeTab === 'reservations' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(203,160,65,0.5)]" />}
            </button>
         </div>

         {activeTab === 'matchs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {filteredMatches.map(match => (
                  <MatchCard 
                    key={match.id}
                    match={match}
                    onView={(m) => { setSelectedMatch(m); setIsMatchDrawerOpen(true); }}
                    onEdit={(m) => { setSelectedMatch(m); setIsModalOpen(true); }}
                    onDelete={handleDeleteMatch}
                    onReserve={handleReserveSimulation}
                  />
               ))}
            </div>
         ) : (
            <div className="space-y-4">
               {filteredReservations.map(res => (
                  <ReservationCard 
                    key={res.id}
                    reservation={res}
                    onView={(r) => { setSelectedRes(r); setIsResDrawerOpen(true); }}
                    onValidate={handleValidateRes}
                    onCancel={handleCancelRes}
                    onRelase={handleCancelRes}
                  />
               ))}
            </div>
         )}
      </div>

      {/* Modals & Drawers */}
      <BilletterieModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMatch}
        match={selectedMatch}
      />

      <MatchDetailsDrawer 
        isOpen={isMatchDrawerOpen}
        onClose={() => setIsMatchDrawerOpen(false)}
        match={selectedMatch}
        reservations={reservations.filter(r => r.matchId === selectedMatch?.id)}
        onReserve={handleReserveSimulation}
      />

      <ReservationDetailsDrawer 
        isOpen={isResDrawerOpen}
        onClose={() => setIsResDrawerOpen(false)}
        reservation={selectedRes}
        onValidate={handleValidateRes}
        onCancel={handleCancelRes}
      />

    </div>
  )
}

function StatCard({ title, value, icon, highlight = false }: { title: string; value: string | number; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn(
      "glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-3 transition-all duration-300 hover:border-white/10 group",
      highlight && "bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(203,160,65,0.1)]"
    )}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
           {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-0.5">{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </div>
  )
}
