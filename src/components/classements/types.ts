export type FormResult = 'W' | 'D' | 'L';

export type StandingZone = 'qualification' | 'playoff' | 'relegation' | 'none';

export interface StandingRow {
  id: string;
  position: number;
  clubName: string;
  clubLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: FormResult[];
  zone: StandingZone;
}

export interface RankingStats {
  leader: string;
  bestAttack: {
    club: string;
    goals: number;
  };
  bestDefense: {
    club: string;
    goals: number;
  };
  totalMatches: number;
  totalGoals: number;
}
