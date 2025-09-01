import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Shuffle, 
  ChevronLeft, 
  Trash2, 
  Edit, 
  RotateCcw 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { TournamentData, TournamentTeam, TournamentPlayer } from '../../types/tournament';

interface TeamAssignmentProps {
  tournamentData: TournamentData;
  onTeamsAssigned: (data: TournamentData) => void;
  onNext: () => void;
  onBack: () => void;
}

const TEAM_COLORS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
  '#06B6D4', // Cyan
];

const TEAM_NAMES = [
  'Lightning', 'Thunder', 'Storm', 'Blaze', 'Wolves', 'Eagles', 'Panthers', 'Hawks'
];

export const TeamAssignment: React.FC<TeamAssignmentProps> = ({
  tournamentData,
  onTeamsAssigned,
  onNext,
  onBack
}) => {
  const [unassignedPlayers, setUnassignedPlayers] = useState<TournamentPlayer[]>([]);
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [draggedPlayer, setDraggedPlayer] = useState<TournamentPlayer | null>(null);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [teamNameInput, setTeamNameInput] = useState('');

  // Initialize teams and players
  useEffect(() => {
    if (tournamentData.teams.length > 0) {
      // Load existing team assignments
      setTeams(tournamentData.teams);
      const assignedPlayerIds = new Set(tournamentData.teams.flatMap(t => t.players.map(p => p.id)));
      setUnassignedPlayers(tournamentData.participants.filter(p => !assignedPlayerIds.has(p.id)));
    } else {
      // Start fresh
      setUnassignedPlayers(tournamentData.participants);
      setTeams([]);
    }
  }, [tournamentData]);

  const createNewTeam = () => {
    const newTeam: TournamentTeam = {
      id: `team-${Date.now()}`,
      name: TEAM_NAMES[teams.length] || `Team ${teams.length + 1}`,
      players: [],
      color: TEAM_COLORS[teams.length % TEAM_COLORS.length],
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0
    };
    setTeams([...teams, newTeam]);
  };

  const deleteTeam = (teamId: string) => {
    const teamToDelete = teams.find(t => t.id === teamId);
    if (teamToDelete) {
      setUnassignedPlayers([...unassignedPlayers, ...teamToDelete.players]);
      setTeams(teams.filter(t => t.id !== teamId));
    }
  };

  const updateTeamName = (teamId: string, newName: string) => {
    setTeams(teams.map(t => t.id === teamId ? {...t, name: newName} : t));
    setEditingTeam(null);
    setTeamNameInput('');
  };

  const startEditingTeam = (team: TournamentTeam) => {
    setEditingTeam(team.id);
    setTeamNameInput(team.name);
  };

  const addPlayerToTeam = (player: TournamentPlayer, teamId: string) => {
    const targetTeam = teams.find(t => t.id === teamId);
    if (!targetTeam || targetTeam.players.length >= tournamentData.settings.maxPlayersPerTeam) {
      return;
    }

    setTeams(teams.map(t => 
      t.id === teamId 
        ? {...t, players: [...t.players, player]}
        : t
    ));
    setUnassignedPlayers(unassignedPlayers.filter(p => p.id !== player.id));
  };

  const removePlayerFromTeam = (playerId: string, teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const player = team.players.find(p => p.id === playerId);
    if (!player) return;

    setTeams(teams.map(t => 
      t.id === teamId 
        ? {...t, players: t.players.filter(p => p.id !== playerId)}
        : t
    ));
    setUnassignedPlayers([...unassignedPlayers, player]);
  };

  const autoAssignTeams = () => {
    const allPlayers = [...unassignedPlayers];
    teams.forEach(team => allPlayers.push(...team.players));
    
    // Shuffle players
    const shuffledPlayers = [...allPlayers].sort(() => Math.random() - 0.5);
    
    // Determine optimal team count
    const playerCount = shuffledPlayers.length;
    const optimalTeamCount = Math.ceil(playerCount / 4); // Aim for 4 players per team
    
    // Create teams if needed
    const newTeams: TournamentTeam[] = [];
    for (let i = 0; i < optimalTeamCount; i++) {
      newTeams.push({
        id: `team-${Date.now()}-${i}`,
        name: TEAM_NAMES[i] || `Team ${i + 1}`,
        players: [],
        color: TEAM_COLORS[i % TEAM_COLORS.length],
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0
      });
    }
    
    // Distribute players evenly
    shuffledPlayers.forEach((player, index) => {
      const teamIndex = index % optimalTeamCount;
      newTeams[teamIndex].players.push(player);
    });
    
    setTeams(newTeams);
    setUnassignedPlayers([]);
  };

  const resetAssignments = () => {
    setUnassignedPlayers(tournamentData.participants);
    setTeams([]);
  };

  const saveTeamAssignments = () => {
    const updatedData: TournamentData = {
      ...tournamentData,
      teams: teams,
      status: 'teams-assigned'
    };
    onTeamsAssigned(updatedData);
  };

  const handleDragStart = (e: React.DragEvent, player: TournamentPlayer) => {
    setDraggedPlayer(player);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, teamId: string) => {
    e.preventDefault();
    if (draggedPlayer) {
      // Remove from current location
      if (unassignedPlayers.find(p => p.id === draggedPlayer.id)) {
        setUnassignedPlayers(unassignedPlayers.filter(p => p.id !== draggedPlayer.id));
      } else {
        // Remove from current team
        setTeams(teams.map(t => ({
          ...t,
          players: t.players.filter(p => p.id !== draggedPlayer.id)
        })));
      }
      
      // Add to target team
      addPlayerToTeam(draggedPlayer, teamId);
      setDraggedPlayer(null);
    }
  };

  const canProceed = teams.length >= 2 && teams.every(t => t.players.length >= tournamentData.settings.minPlayersPerTeam);

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Team Assignment</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Assign players to teams for the tournament. You can drag and drop players between teams or use auto-assignment for balanced teams.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Team Management Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={createNewTeam}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team
          </Button>
          
          <Button
            onClick={autoAssignTeams}
            disabled={tournamentData.participants.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Auto-Assign Teams
          </Button>
          
          <Button
            onClick={resetAssignments}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </Button>
        </div>

        {/* Tournament Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{tournamentData.participants.length}</div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{teams.length}</div>
              <div className="text-sm text-gray-600">Teams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {teams.filter(t => t.players.length >= tournamentData.settings.minPlayersPerTeam).length}
              </div>
              <div className="text-sm text-gray-600">Ready Teams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{unassignedPlayers.length}</div>
              <div className="text-sm text-gray-600">Unassigned</div>
            </div>
          </div>
        </div>

        {/* Unassigned Players */}
        {unassignedPlayers.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">
              Unassigned Players ({unassignedPlayers.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {unassignedPlayers.map((player) => (
                <motion.div
                  key={player.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e as React.DragEvent<HTMLDivElement>, player)}
                  className="p-3 bg-white border border-yellow-300 rounded-lg cursor-move hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05 }}
                >
                  <p className="font-medium text-gray-900 text-sm">{player.name}</p>
                  <p className="text-xs text-gray-600">
                    {player.age && `${player.age} • `}
                    <span className="capitalize">{player.ageCategory?.replace('-', ' ')}</span>
                  </p>
                  {player.isWalkIn && (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                      Walk-in
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              className="border-2 border-gray-200 rounded-lg p-6"
              style={{ borderColor: team.color }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, team.id)}
            >
              {/* Team Header */}
              <div className="flex items-center justify-between mb-4">
                {editingTeam === team.id ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      value={teamNameInput}
                      onChange={(e) => setTeamNameInput(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && updateTeamName(team.id, teamNameInput)}
                    />
                    <Button
                      onClick={() => updateTeamName(team.id, teamNameInput)}
                      size="sm"
                      disabled={!teamNameInput.trim()}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                    onClick={() => startEditingTeam(team)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {team.players.length}/{tournamentData.settings.maxPlayersPerTeam}
                  </span>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Team Status */}
              <div className="mb-4">
                {team.players.length < tournamentData.settings.minPlayersPerTeam ? (
                  <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    Need {tournamentData.settings.minPlayersPerTeam - team.players.length} more player(s)
                  </div>
                ) : (
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    Team Ready
                  </div>
                )}
              </div>

              {/* Team Players */}
              <div className="space-y-2 min-h-[120px]">
                {team.players.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Drag players here</p>
                  </div>
                ) : (
                  team.players.map((player) => (
                    <motion.div
                      key={player.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as React.DragEvent<HTMLDivElement>, player)}
                      className="p-3 bg-gray-50 border rounded-lg cursor-move hover:bg-gray-100 transition-colors group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{player.name}</p>
                          <p className="text-xs text-gray-600">
                            {player.age && `${player.age} • `}
                            <span className="capitalize">{player.ageCategory?.replace('-', ' ')}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => removePlayerFromTeam(player.id, team.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-100 rounded transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Team Prompt */}
        {teams.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">Create teams to start assigning players</p>
            <Button
              onClick={createNewTeam}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create First Team
            </Button>
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
            <span>Back to Registration</span>
          </Button>
          
          <div className="text-center">
            {!canProceed && (
              <p className="text-sm text-red-600 mb-2">
                Each team needs at least {tournamentData.settings.minPlayersPerTeam} players
              </p>
            )}
            <Button
              onClick={() => {
                saveTeamAssignments();
                onNext();
              }}
              disabled={!canProceed}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3"
            >
              Continue to Bracket Generation
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};