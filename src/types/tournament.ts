// Tournament Management System Types

export interface ImportedPlayerData {
  id: string;
  player_name: string;
  age_category: string;
  grade_level: string;
  contact_phone?: string;
  team_name?: string;
}

export interface TournamentPlayer {
  id: string;
  name: string;
  age?: string;
  phone?: string;
  gradeLevel?: string;
  ageCategory?: 'middle-school' | 'high-school-adult';
  isWalkIn?: boolean;
  registeredAt: Date;
}

export interface TournamentTeam {
  id: string;
  name: string;
  players: TournamentPlayer[];
  color?: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface TournamentGame {
  id: string;
  round: number;
  gameNumber: number;
  teamA: string; // team ID
  teamB: string; // team ID
  court?: number;
  scheduledTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  scoreA?: number;
  scoreB?: number;
  winner?: string; // team ID
  completedAt?: Date;
}

export interface TournamentSettings {
  courtCount: number;
  gameLength: number; // minutes
  maxPlayersPerTeam: number;
  minPlayersPerTeam: number;
  tournamentStyle: 'round-robin' | 'single-elimination' | 'double-elimination';
  allowWalkIns: boolean;
}

export interface TournamentData {
  id: string;
  name: string;
  date: string;
  status: 'setup' | 'registration' | 'teams-assigned' | 'brackets-generated' | 'in-progress' | 'completed';
  participants: TournamentPlayer[];
  teams: TournamentTeam[];
  games: TournamentGame[];
  settings: TournamentSettings;
  createdAt: Date;
  lastModified: Date;
}

export interface TournamentStanding {
  team: TournamentTeam;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  winPercentage: number;
  rank: number;
}

export type TournamentStep = 
  | 'import-data'
  | 'walk-in-registration' 
  | 'team-assignment'
  | 'bracket-generation'
  | 'score-tracking'
  | 'tournament-results';
