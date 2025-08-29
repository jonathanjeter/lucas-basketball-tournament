export interface Player {
  id?: string;
  name: string;
  email: string;
  ageCategory: 'middle-school' | 'high-school-adult';
  emergencyContact: string;
  parentConsent?: boolean;
}

export interface Team {
  id?: string;
  name?: string;
  players: Player[];
  status: 'complete' | 'partial' | 'individual';
  donationAmount?: number;
  paypalTransactionId?: string;
  createdAt?: string;
}

export interface Sponsor {
  id?: string;
  name: string;
  donationAmount: number;
  logoUrl?: string;
  website?: string;
  createdAt?: string;
}

export interface Tournament {
  id?: string;
  name: string;
  bracket: Bracket[];
  status: 'setup' | 'active' | 'completed';
}

export interface Bracket {
  id?: string;
  tournamentId?: string;
  teamAId: string;
  teamBId: string;
  teamAScore?: number;
  teamBScore?: number;
  completed: boolean;
  round: number;
}

export interface FundraisingStats {
  totalRaised: number;
  goal: number;
  registeredTeams: number;
  registeredPlayers: number;
}