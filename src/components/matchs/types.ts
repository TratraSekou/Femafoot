export type MatchStatus = 'À VENIR' | 'LIVE' | 'MI-TEMPS' | 'TERMINÉ' | 'REPORTÉ';

export interface Team {
  name: string;
  logo?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  stadium: string;
  competition: string;
  referee: string;
  status: MatchStatus;
  liveMinute?: number; // Pour les matchs LIVE, ex: 67
  // Mocks pour le drawer
  stats?: {
    possessionHome: number; // %
    shotsHome: number;
    shotsOnTargetHome: number;
    cornersHome: number;
    foulsHome: number;
    possessionAway: number; // 100 - possessionHome
    shotsAway: number;
    shotsOnTargetAway: number;
    cornersAway: number;
    foulsAway: number;
  };
}

export type MatchFormData = Omit<Match, 'id' | 'stats'>;
