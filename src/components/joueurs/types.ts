export type Position = 'ATT' | 'MIL' | 'DEF' | 'GB';
export type Status = 'Actif' | 'Blessé' | 'Suspendu' | 'Inactif';

export interface Joueur {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  birthDate: string;
  club: string;
  clubLogo?: string;
  position: Position;
  number: number;
  nationality: string;
  status: Status;
  avatar?: string;
  // Stats fictives pour le drawer
  stats?: {
    matches: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    rating: number; // Note sur 100 type EA FC
  };
}

export type JoueurFormData = Omit<Joueur, 'id' | 'stats'>;
