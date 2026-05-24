export type TicketCategoryName = 'VIP' | 'Tribune' | 'Pelouse' | 'Presse' | 'Standard';
export type MatchTicketStatus = 'Ouvert' | 'Presque complet' | 'Complet' | 'Fermé';
export type ReservationStatus = 'EN ATTENTE' | 'EN TRAITEMENT' | 'VALIDÉE' | 'ANNULÉE' | 'EXPIRÉE' | 'UTILISÉE';

export interface TicketCategory {
  name: TicketCategoryName;
  price: number;
  capacity: number;
  available: number;
  reserved: number;
}

export interface MatchBilletterie {
  id: string;
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
  competition: string;
  date: string;
  time: string;
  venue: string;
  status: MatchTicketStatus;
  categories: TicketCategory[];
}

export interface TicketReservation {
  id: string;
  matchId: string;
  matchName: string;
  clientName: string;
  clientPhone: string;
  clientNeighborhood: string;
  category: TicketCategoryName;
  quantity: number;
  totalPrice: number;
  date: string;
  status: ReservationStatus;
  expiresAt: string; // ISO string
}

export interface BilletterieStats {
  totalTicketsAvailable: number;
  pendingReservations: number;
  activeMatches: number;
  reservedSeats: number;
  revenue: number;
}
