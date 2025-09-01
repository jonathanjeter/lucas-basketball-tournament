import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Users, ChevronLeft, Trophy, Play, Pause, Check, Edit, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { TournamentData, TournamentGame, TournamentTeam, TournamentStanding } from '../../types/tournament';

interface ScoreTrackerProps {
  tournamentData: TournamentData;
  onScoreUpdated: (data: TournamentData) => void;
  onTournamentComplete: () => void;
  onBack: () => void;
}

export const ScoreTracker: React.FC<ScoreTrackerProps> = ({
  tournamentData,
  onScoreUpdated,
  onTournamentComplete,
  onBack
}) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [tempScores, setTempScores] = useState<{[gameId: string]: {scoreA: number, scoreB: number}}>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startGame = (gameId: string) => {
    const updatedGames = tournamentData.games.map(game =>
      game.id === gameId ? { ...game, status: 'in-progress' as const } : game
    );

    const updatedData: TournamentData = {
      ...tournamentData,
      games: updatedGames,
      status: 'in-progress'
    };

    onScoreUpdated(updatedData);
  };

  const updateScore = (gameId: string, scoreA: number, scoreB: number) => {
    setTempScores(prev => ({
      ...prev,
      [gameId]: { scoreA, scoreB }
    }));
  };

  const saveScore = (gameId: string) => {
    const scores = tempScores[gameId];
    if (!scores) return;

    const updatedGames = tournamentData.games.map(game => {
      if (game.id === gameId) {
        const winner = scores.scoreA > scores.scoreB ? game.teamA : 
                      scores.scoreB > scores.scoreA ? game.teamB : undefined;
        
        return {
          ...game,
          scoreA: scores.scoreA,
          scoreB: scores.scoreB,
          status: 'completed' as const,
          winner,
          completedAt: new Date()
        };
      }
      return game;
    });

    // Update team standings
    const updatedTeams = updateTeamStandings(tournamentData.teams, updatedGames);

    const updatedData: TournamentData = {
      ...tournamentData,
      games: updatedGames,
      teams: updatedTeams
    };

    onScoreUpdated(updatedData);
    
    // Remove from temp scores
    setTempScores(prev => {
      const newScores = { ...prev };
      delete newScores[gameId];
      return newScores;
    });
    
    setSelectedGame(null);

    // Check if tournament is complete
    if (updatedGames.every(g => g.status === 'completed')) {
      setTimeout(() => onTournamentComplete(), 1000);
    }
  };

  const updateTeamStandings = (teams: TournamentTeam[], games: TournamentGame[]): TournamentTeam[] => {
    const teamStats: {[teamId: string]: {wins: number, losses: number, pointsFor: number, pointsAgainst: number}} = {};
    
    // Initialize stats
    teams.forEach(team => {
      teamStats[team.id] = { wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 };
    });

    // Calculate stats from completed games
    games.filter(g => g.status === 'completed').forEach(game => {
      const scoreA = game.scoreA || 0;
      const scoreB = game.scoreB || 0;
      
      teamStats[game.teamA].pointsFor += scoreA;
      teamStats[game.teamA].pointsAgainst += scoreB;
      teamStats[game.teamB].pointsFor += scoreB;
      teamStats[game.teamB].pointsAgainst += scoreA;
      
      if (game.winner === game.teamA) {
        teamStats[game.teamA].wins++;
        teamStats[game.teamB].losses++;
      } else if (game.winner === game.teamB) {
        teamStats[game.teamB].wins++;
        teamStats[game.teamA].losses++;
      }
    });

    // Update teams with new stats
    return teams.map(team => ({
      ...team,
      wins: teamStats[team.id].wins,
      losses: teamStats[team.id].losses,
      pointsFor: teamStats[team.id].pointsFor,
      pointsAgainst: teamStats[team.id].pointsAgainst
    }));
  };

  const calculateStandings = (): TournamentStanding[] => {
    const standings = tournamentData.teams.map(team => ({
      team,
      wins: team.wins,
      losses: team.losses,
      pointsFor: team.pointsFor,
      pointsAgainst: team.pointsAgainst,
      pointDifferential: team.pointsFor - team.pointsAgainst,
      winPercentage: team.wins + team.losses > 0 ? team.wins / (team.wins + team.losses) : 0,
      rank: 0
    }));

    // Sort by wins (desc), then by point differential (desc), then by points for (desc)
    standings.sort((a, b) => {
      if (a.wins !== b.wins) return b.wins - a.wins;
      if (a.pointDifferential !== b.pointDifferential) return b.pointDifferential - a.pointDifferential;
      return b.pointsFor - a.pointsFor;
    });

    // Assign ranks
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    return standings;
  };

  const getGamesByStatus = (status: 'scheduled' | 'in-progress' | 'completed') => {
    return tournamentData.games.filter(g => g.status === status);
  };

  const getTeamName = (teamId: string) => {
    return tournamentData.teams.find(t => t.id === teamId)?.name || 'Unknown Team';
  };

  const getTeamColor = (teamId: string) => {
    return tournamentData.teams.find(t => t.id === teamId)?.color || '#6B7280';
  };

  const standings = calculateStandings();
  const completedGames = getGamesByStatus('completed');
  const inProgressGames = getGamesByStatus('in-progress');
  const scheduledGames = getGamesByStatus('scheduled');

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <Target className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Score Tracking</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track live scores for each game and monitor tournament standings in real-time.
        </p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="text-blue-600 font-medium">
            Current Time: {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Tournament Progress */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedGames.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{inProgressGames.length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{scheduledGames.length}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Management */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Games
            </h3>

            {/* In Progress Games */}
            {inProgressGames.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-yellow-700 mb-3">In Progress</h4>
                <div className="space-y-3">
                  {inProgressGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      tournamentData={tournamentData}
                      tempScores={tempScores}
                      selectedGame={selectedGame}
                      onScoreUpdate={updateScore}
                      onSaveScore={saveScore}
                      onSelectGame={setSelectedGame}
                      getTeamName={getTeamName}
                      getTeamColor={getTeamColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled Games */}
            {scheduledGames.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-blue-700 mb-3">Scheduled</h4>
                <div className="space-y-3">
                  {scheduledGames.slice(0, 3).map((game) => (
                    <div key={game.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-600">Game {game.gameNumber}</span>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getTeamColor(game.teamA) }}
                              />
                              <span className="font-medium">{getTeamName(game.teamA)}</span>
                              <span className="text-gray-500">vs</span>
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getTeamColor(game.teamB) }}
                              />
                              <span className="font-medium">{getTeamName(game.teamB)}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {game.scheduledTime} • Court {game.court}
                          </div>
                        </div>
                        <Button
                          onClick={() => startGame(game.id)}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Game
                        </Button>
                      </div>
                    </div>
                  ))}
                  {scheduledGames.length > 3 && (
                    <div className="text-center text-sm text-gray-600">
                      +{scheduledGames.length - 3} more games scheduled
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Completed Games */}
            {completedGames.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-green-700 mb-3">Recently Completed</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {completedGames.slice(-3).reverse().map((game) => (
                    <div key={game.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-600">Game {game.gameNumber}</span>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getTeamColor(game.teamA) }}
                              />
                              <span className={`font-medium ${game.winner === game.teamA ? 'text-green-700' : ''}`}>
                                {getTeamName(game.teamA)}
                              </span>
                              <span className="text-gray-500">vs</span>
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getTeamColor(game.teamB) }}
                              />
                              <span className={`font-medium ${game.winner === game.teamB ? 'text-green-700' : ''}`}>
                                {getTeamName(game.teamB)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {game.scoreA} - {game.scoreB}
                          </div>
                          <div className="text-xs text-gray-600">Final</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current Standings */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
              <Users className="w-5 h-5 mr-2" />
              Current Standings
            </h3>
            
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                  <div>Rank</div>
                  <div className="col-span-2">Team</div>
                  <div className="text-center">W-L</div>
                  <div className="text-center">PF-PA</div>
                  <div className="text-center">Diff</div>
                </div>
              </div>
              <div className="divide-y">
                {standings.map((standing) => (
                  <div key={standing.team.id} className="px-4 py-3">
                    <div className="grid grid-cols-6 gap-4 items-center">
                      <div className="font-bold text-lg">
                        #{standing.rank}
                      </div>
                      <div className="col-span-2 flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: standing.team.color || '#6B7280' }}
                        />
                        <span className="font-medium">{standing.team.name}</span>
                      </div>
                      <div className="text-center font-medium">
                        {standing.wins}-{standing.losses}
                      </div>
                      <div className="text-center text-sm">
                        {standing.pointsFor}-{standing.pointsAgainst}
                      </div>
                      <div className={`text-center font-medium ${
                        standing.pointDifferential > 0 ? 'text-green-600' : 
                        standing.pointDifferential < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {standing.pointDifferential > 0 ? '+' : ''}{standing.pointDifferential}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center space-x-2 px-6 py-3"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Brackets</span>
          </Button>
          
          <div className="text-center">
            {completedGames.length === tournamentData.games.length && tournamentData.games.length > 0 ? (
              <div>
                <p className="text-sm text-green-600 mb-2 font-medium">
                  🎉 Tournament Complete!
                </p>
                <Button
                  onClick={onTournamentComplete}
                  className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Final Results
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Tournament in progress • {completedGames.length}/{tournamentData.games.length} games complete
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface GameCardProps {
  game: TournamentGame;
  tournamentData: TournamentData;
  tempScores: {[gameId: string]: {scoreA: number, scoreB: number}};
  selectedGame: string | null;
  onScoreUpdate: (gameId: string, scoreA: number, scoreB: number) => void;
  onSaveScore: (gameId: string) => void;
  onSelectGame: (gameId: string | null) => void;
  getTeamName: (teamId: string) => string;
  getTeamColor: (teamId: string) => string;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  tempScores,
  selectedGame,
  onScoreUpdate,
  onSaveScore,
  onSelectGame,
  getTeamName,
  getTeamColor
}) => {
  const isSelected = selectedGame === game.id;
  const currentScores = tempScores[game.id] || { scoreA: game.scoreA || 0, scoreB: game.scoreB || 0 };

  return (
    <motion.div
      layout
      className={`border-2 rounded-lg p-4 ${
        isSelected ? 'border-yellow-400 bg-yellow-50' : 'border-yellow-200 bg-yellow-50'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">Game {game.gameNumber}</span>
          <div className="text-sm text-gray-600">
            {game.scheduledTime} • Court {game.court}
          </div>
        </div>
        {!isSelected && (
          <Button
            onClick={() => onSelectGame(game.id)}
            variant="outline"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Score
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: getTeamColor(game.teamA) }}
          />
          <div className="flex-1">
            <div className="font-medium">{getTeamName(game.teamA)}</div>
            {isSelected ? (
              <Input
                type="number"
                value={currentScores.scoreA}
                onChange={(e) => onScoreUpdate(game.id, parseInt(e.target.value) || 0, currentScores.scoreB)}
                className="mt-2 text-2xl font-bold text-center"
                min="0"
              />
            ) : (
              <div className="text-2xl font-bold mt-2">{currentScores.scoreA}</div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: getTeamColor(game.teamB) }}
          />
          <div className="flex-1">
            <div className="font-medium">{getTeamName(game.teamB)}</div>
            {isSelected ? (
              <Input
                type="number"
                value={currentScores.scoreB}
                onChange={(e) => onScoreUpdate(game.id, currentScores.scoreA, parseInt(e.target.value) || 0)}
                className="mt-2 text-2xl font-bold text-center"
                min="0"
              />
            ) : (
              <div className="text-2xl font-bold mt-2">{currentScores.scoreB}</div>
            )}
          </div>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3 mt-4 pt-4 border-t"
        >
          <Button
            onClick={() => onSaveScore(game.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Final Score
          </Button>
          <Button
            onClick={() => onSelectGame(null)}
            variant="outline"
          >
            Cancel
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};