import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Users, Download, Upload, Printer, ChevronLeft, Medal, Target, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { TournamentData, TournamentStanding } from '../../types/tournament';
import { supabase } from '../../lib/supabase';

interface TournamentResultsProps {
  tournamentData: TournamentData;
  onBack: () => void;
}

export const TournamentResults: React.FC<TournamentResultsProps> = ({
  tournamentData,
  onBack
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const calculateFinalStandings = (): TournamentStanding[] => {
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

    standings.sort((a, b) => {
      if (a.wins !== b.wins) return b.wins - a.wins;
      if (a.pointDifferential !== b.pointDifferential) return b.pointDifferential - a.pointDifferential;
      return b.pointsFor - a.pointsFor;
    });

    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    return standings;
  };

  const exportToDatabase = async () => {
    setIsExporting(true);
    setExportStatus('idle');

    try {
      console.log('🚀 [TournamentResults] Exporting tournament results to database...');

      // Create tournament record
      const { data: tournamentRecord, error: tournamentError } = await supabase
        .from('tournaments')
        .insert([{
          name: tournamentData.name,
          date: tournamentData.date,
          status: 'completed',
          settings: tournamentData.settings
        }])
        .select()
        .single();

      if (tournamentError) {
        throw new Error(`Failed to create tournament record: ${tournamentError.message}`);
      }

      // Export teams
      for (const team of tournamentData.teams) {
        const { error: teamError } = await supabase
          .from('tournament_teams')
          .insert([{
            tournament_id: tournamentRecord.id,
            team_name: team.name,
            wins: team.wins,
            losses: team.losses,
            points_for: team.pointsFor,
            points_against: team.pointsAgainst,
            final_rank: calculateFinalStandings().find(s => s.team.id === team.id)?.rank || 0
          }]);

        if (teamError) {
          console.warn('Failed to export team:', team.name, teamError);
        }
      }

      // Export games
      for (const game of tournamentData.games) {
        const teamAName = tournamentData.teams.find(t => t.id === game.teamA)?.name;
        const teamBName = tournamentData.teams.find(t => t.id === game.teamB)?.name;
        const winnerName = game.winner ? 
          tournamentData.teams.find(t => t.id === game.winner)?.name : null;

        const { error: gameError } = await supabase
          .from('tournament_games')
          .insert([{
            tournament_id: tournamentRecord.id,
            game_number: game.gameNumber,
            team_a: teamAName,
            team_b: teamBName,
            score_a: game.scoreA || 0,
            score_b: game.scoreB || 0,
            winner: winnerName,
            court: game.court,
            scheduled_time: game.scheduledTime,
            completed_at: game.completedAt
          }]);

        if (gameError) {
          console.warn('Failed to export game:', game.gameNumber, gameError);
        }
      }

      console.log('✅ [TournamentResults] Tournament results exported successfully');
      setExportStatus('success');

    } catch (error) {
      console.error('❌ [TournamentResults] Export failed:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadResults = () => {
    const standings = calculateFinalStandings();
    const results = {
      tournament: {
        name: tournamentData.name,
        date: tournamentData.date,
        completedAt: new Date().toISOString()
      },
      finalStandings: standings.map(s => ({
        rank: s.rank,
        team: s.team.name,
        wins: s.wins,
        losses: s.losses,
        pointsFor: s.pointsFor,
        pointsAgainst: s.pointsAgainst,
        pointDifferential: s.pointDifferential,
        winPercentage: Math.round(s.winPercentage * 100)
      })),
      games: tournamentData.games.map(game => ({
        gameNumber: game.gameNumber,
        teamA: tournamentData.teams.find(t => t.id === game.teamA)?.name,
        teamB: tournamentData.teams.find(t => t.id === game.teamB)?.name,
        scoreA: game.scoreA,
        scoreB: game.scoreB,
        winner: game.winner ? tournamentData.teams.find(t => t.id === game.winner)?.name : null,
        court: game.court,
        scheduledTime: game.scheduledTime
      })),
      teams: tournamentData.teams.map(team => ({
        name: team.name,
        players: team.players.map(p => ({
          name: p.name,
          age: p.age,
          ageCategory: p.ageCategory,
          isWalkIn: p.isWalkIn
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tournament-results-${tournamentData.date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printResults = () => {
    window.print();
  };

  const standings = calculateFinalStandings();
  const champion = standings[0];
  const runnerUp = standings[1];
  const thirdPlace = standings[2];

  const totalGames = tournamentData.games.length;
  const averageScore = tournamentData.games.reduce((sum, game) => 
    sum + (game.scoreA || 0) + (game.scoreB || 0), 0) / (totalGames * 2);

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="text-center mb-8">
          <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tournament Results</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Final standings and complete tournament results for {tournamentData.name}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-medium">{tournamentData.date}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Champion Podium */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Tournament Champions</h3>
            
            <div className="flex items-end justify-center space-x-8">
              {/* Runner Up */}
              {runnerUp && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="bg-gray-400 text-white w-20 h-16 flex items-center justify-center rounded-t-lg font-bold text-xl mb-4">
                    2nd
                  </div>
                  <div 
                    className="w-6 h-6 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: runnerUp.team.color }}
                  />
                  <div className="font-bold text-lg">{runnerUp.team.name}</div>
                  <div className="text-gray-600">{runnerUp.wins}-{runnerUp.losses}</div>
                  <Medal className="w-8 h-8 text-gray-400 mx-auto mt-2" />
                </motion.div>
              )}

              {/* Champion */}
              {champion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="bg-yellow-500 text-white w-24 h-20 flex items-center justify-center rounded-t-lg font-bold text-2xl mb-4">
                    1st
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-3"
                    style={{ backgroundColor: champion.team.color }}
                  />
                  <div className="font-bold text-2xl text-yellow-600">{champion.team.name}</div>
                  <div className="text-gray-600 text-lg">{champion.wins}-{champion.losses}</div>
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mt-3" />
                </motion.div>
              )}

              {/* Third Place */}
              {thirdPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="bg-amber-600 text-white w-20 h-12 flex items-center justify-center rounded-t-lg font-bold text-lg mb-4">
                    3rd
                  </div>
                  <div 
                    className="w-6 h-6 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: thirdPlace.team.color }}
                  />
                  <div className="font-bold text-lg">{thirdPlace.team.name}</div>
                  <div className="text-gray-600">{thirdPlace.wins}-{thirdPlace.losses}</div>
                  <Medal className="w-8 h-8 text-amber-600 mx-auto mt-2" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Tournament Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{totalGames}</div>
              <div className="text-sm text-blue-800">Total Games</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{tournamentData.teams.length}</div>
              <div className="text-sm text-green-800">Teams</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{tournamentData.participants.length}</div>
              <div className="text-sm text-purple-800">Players</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <Trophy className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{Math.round(averageScore)}</div>
              <div className="text-sm text-orange-800">Avg Score</div>
            </div>
          </div>

          {/* Final Standings Table */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Final Standings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Rank</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Team</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">W-L</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Win %</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">PF</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">PA</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {standings.map((standing) => (
                    <tr key={standing.team.id} className={standing.rank <= 3 ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">#{standing.rank}</span>
                          {standing.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                          {standing.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                          {standing.rank === 3 && <Medal className="w-5 h-5 text-amber-600" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: standing.team.color }}
                          />
                          <span className="font-medium">{standing.team.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        {standing.wins}-{standing.losses}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {Math.round(standing.winPercentage * 100)}%
                      </td>
                      <td className="px-6 py-4 text-center">{standing.pointsFor}</td>
                      <td className="px-6 py-4 text-center">{standing.pointsAgainst}</td>
                      <td className={`px-6 py-4 text-center font-medium ${
                        standing.pointDifferential > 0 ? 'text-green-600' : 
                        standing.pointDifferential < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {standing.pointDifferential > 0 ? '+' : ''}{standing.pointDifferential}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Actions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Results</h3>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={exportToDatabase}
                disabled={isExporting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isExporting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting to Database...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Export to Database</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={downloadResults}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>

              <Button
                onClick={printResults}
                variant="outline"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Results
              </Button>
            </div>

            {exportStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3"
              >
                <p className="text-green-800 font-medium">✅ Tournament results exported to database successfully!</p>
              </motion.div>
            )}

            {exportStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p className="text-red-800 font-medium">❌ Failed to export results. Please check your connection and try again.</p>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center space-x-2 px-6 py-3"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Score Tracking</span>
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                🎉 Tournament completed successfully!
              </p>
              <p className="text-xs text-gray-500">
                Results saved locally and ready for export
              </p>
            </div>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .print-area * {
            visibility: visible;
          }
          
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};