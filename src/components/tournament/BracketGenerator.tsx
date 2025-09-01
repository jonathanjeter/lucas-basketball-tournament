import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, ChevronLeft, Calendar, Clock, Shuffle, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { TournamentData, TournamentGame } from '../../types/tournament';

interface BracketGeneratorProps {
  tournamentData: TournamentData;
  onBracketsGenerated: (data: TournamentData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BracketGenerator: React.FC<BracketGeneratorProps> = ({
  tournamentData,
  onBracketsGenerated,
  onNext,
  onBack
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRoundRobinBracket = async () => {
    setIsGenerating(true);
    
    // Simulate generation time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const teams = tournamentData.teams;
    const games: TournamentGame[] = [];
    let gameNumber = 1;
    
    // Generate round robin games (each team plays every other team once)
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const game: TournamentGame = {
          id: `game-${gameNumber}`,
          round: 1, // All games are round 1 in round robin
          gameNumber,
          teamA: teams[i].id,
          teamB: teams[j].id,
          court: ((gameNumber - 1) % tournamentData.settings.courtCount) + 1,
          scheduledTime: calculateGameTime(gameNumber),
          status: 'scheduled',
          scoreA: undefined,
          scoreB: undefined,
          winner: undefined
        };
        games.push(game);
        gameNumber++;
      }
    }

    const updatedData: TournamentData = {
      ...tournamentData,
      games,
      status: 'brackets-generated'
    };

    onBracketsGenerated(updatedData);
    setIsGenerating(false);
  };

  const calculateGameTime = (gameNumber: number): string => {
    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0); // Tournament starts at 8:00 AM
    
    const gameLength = tournamentData.settings.gameLength;
    const courtCount = tournamentData.settings.courtCount;
    
    // Calculate which "slot" this game is in considering multiple courts
    const slotNumber = Math.floor((gameNumber - 1) / courtCount);
    const totalMinutes = slotNumber * (gameLength + 5); // 5 minute buffer between games
    
    startTime.setMinutes(startTime.getMinutes() + totalMinutes);
    
    return startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const regenerateBrackets = () => {
    const clearedData: TournamentData = {
      ...tournamentData,
      games: [],
      status: 'teams-assigned'
    };
    onBracketsGenerated(clearedData);
  };

  const estimatedTournamentDuration = () => {
    const teamCount = tournamentData.teams.length;
    const totalGames = (teamCount * (teamCount - 1)) / 2; // Round robin formula
    const gameLength = tournamentData.settings.gameLength;
    const courtCount = tournamentData.settings.courtCount;
    
    const gamesPerSlot = courtCount;
    const totalSlots = Math.ceil(totalGames / gamesPerSlot);
    const totalMinutes = totalSlots * (gameLength + 5); // 5 minute buffer
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { hours, minutes, totalGames };
  };

  const { hours, minutes, totalGames } = estimatedTournamentDuration();
  const hasGeneratedBrackets = tournamentData.games.length > 0;

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate Tournament Brackets</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create the tournament schedule with round-robin format where each team plays every other team once.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Tournament Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tournamentData.teams.length}</div>
              <div className="text-sm text-gray-600">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalGames}</div>
              <div className="text-sm text-gray-600">Total Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{tournamentData.settings.courtCount}</div>
              <div className="text-sm text-gray-600">Courts Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {hours}h {minutes}m
              </div>
              <div className="text-sm text-gray-600">Estimated Duration</div>
            </div>
          </div>
        </div>

        {/* Team List */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Tournament Teams ({tournamentData.teams.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournamentData.teams.map((team) => (
              <div 
                key={team.id} 
                className="flex items-center p-4 rounded-lg border-2"
                style={{ borderColor: team.color || '#6B7280' }}
              >
                <div 
                  className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: team.color || '#6B7280' }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{team.name}</p>
                  <p className="text-sm text-gray-600">{team.players.length} players</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Brackets Section */}
        {!hasGeneratedBrackets ? (
          <div className="text-center space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-semibold text-blue-900">Tournament Schedule Preview</h4>
              </div>
              <div className="space-y-2 text-blue-800">
                <p><strong>Format:</strong> Round Robin (each team plays every other team)</p>
                <p><strong>Games per team:</strong> {tournamentData.teams.length - 1}</p>
                <p><strong>Start time:</strong> 8:00 AM</p>
                <p><strong>Game length:</strong> {tournamentData.settings.gameLength} minutes</p>
                <p><strong>Estimated finish:</strong> {
                  (() => {
                    const endTime = new Date();
                    endTime.setHours(8, 0, 0, 0);
                    endTime.setMinutes(endTime.getMinutes() + (hours * 60) + minutes);
                    return endTime.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    });
                  })()
                }</p>
              </div>
            </div>

            <Button
              onClick={generateRoundRobinBracket}
              disabled={isGenerating}
              className="bg-yellow-600 hover:bg-yellow-700 px-8 py-4 text-lg"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Tournament Brackets...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Shuffle className="w-5 h-5" />
                  <span>Generate Round Robin Brackets</span>
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generated Brackets Display */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-semibold text-green-900">Tournament Brackets Generated</h4>
                </div>
                <Button
                  onClick={regenerateBrackets}
                  variant="outline"
                  className="text-sm"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <p className="text-green-800">
                {tournamentData.games.length} games scheduled across {tournamentData.settings.courtCount} court(s)
              </p>
            </div>

            {/* Game Schedule */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Game Schedule
              </h4>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {tournamentData.games.map((game) => {
                  const teamA = tournamentData.teams.find(t => t.id === game.teamA);
                  const teamB = tournamentData.teams.find(t => t.id === game.teamB);
                  
                  return (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-600">
                          Game {game.gameNumber}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: teamA?.color || '#6B7280' }}
                          />
                          <span className="font-medium">{teamA?.name}</span>
                          <span className="text-gray-500">vs</span>
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: teamB?.color || '#6B7280' }}
                          />
                          <span className="font-medium">{teamB?.name}</span>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium text-gray-900">{game.scheduledTime}</div>
                        <div className="text-gray-600">Court {game.court}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center space-x-2 px-6 py-3"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Team Assignment</span>
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {hasGeneratedBrackets ? 'Brackets ready for tournament' : 'Generate brackets to continue'}
            </p>
            <Button
              onClick={onNext}
              disabled={!hasGeneratedBrackets}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3"
            >
              <Target className="w-4 h-4 mr-2" />
              Start Score Tracking ({tournamentData.games.length} games)
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};