export type CompetitionStatus = 'EN COURS' | 'TERMINÉE' | 'À VENIR' | 'SUSPENDUE';
export type CompetitionType = 'Championnat' | 'Coupe' | 'Tournoi';
export type Category = 'Seniors' | 'U23' | 'U20' | 'U17' | 'Féminines';

export interface Competition {
  id: string;
  name: string;
  type: CompetitionType;
  category: Category;
  season: string; // Ex: "2026-2027"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  teamsCount: number;
  matchesCount: number;
  status: CompetitionStatus;
  logo?: string;
  
  // Mocks supplémentaires pour le drawer
  stats?: {
    totalGoals: number;
    yellowCards: number;
    redCards: number;
    topScorer: string;
    leadingTeam: string;
  };
}

export type CompetitionFormData = Omit<Competition, 'id' | 'stats'>;
