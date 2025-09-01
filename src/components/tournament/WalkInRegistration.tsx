import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Clock, Trash2, Edit, ChevronLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { TournamentData, TournamentPlayer } from '../../types/tournament';

interface WalkInRegistrationProps {
  tournamentData: TournamentData;
  onParticipantAdded: (data: TournamentData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WalkInRegistration: React.FC<WalkInRegistrationProps> = ({
  tournamentData,
  onParticipantAdded,
  onNext,
  onBack
}) => {
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    ageCategory: 'high-school-adult' as 'middle-school' | 'high-school-adult'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      phone: '',
      ageCategory: 'high-school-adult'
    });
    setIsAddingPlayer(false);
    setEditingPlayer(null);
  };

  const addWalkInPlayer = () => {
    if (!formData.name.trim()) return;

    const newPlayer: TournamentPlayer = {
      id: `walkin-${Date.now()}`,
      name: formData.name.trim(),
      age: formData.age || undefined,
      phone: formData.phone || undefined,
      ageCategory: formData.ageCategory,
      isWalkIn: true,
      registeredAt: new Date()
    };

    const updatedData: TournamentData = {
      ...tournamentData,
      participants: [...tournamentData.participants, newPlayer],
      status: 'registration'
    };

    onParticipantAdded(updatedData);
    resetForm();
  };

  const updatePlayer = () => {
    if (!editingPlayer || !formData.name.trim()) return;

    const updatedData: TournamentData = {
      ...tournamentData,
      participants: tournamentData.participants.map(p => 
        p.id === editingPlayer 
          ? {
              ...p,
              name: formData.name.trim(),
              age: formData.age || undefined,
              phone: formData.phone || undefined,
              ageCategory: formData.ageCategory
            }
          : p
      )
    };

    onParticipantAdded(updatedData);
    resetForm();
  };

  const removePlayer = (playerId: string) => {
    const updatedData: TournamentData = {
      ...tournamentData,
      participants: tournamentData.participants.filter(p => p.id !== playerId)
    };
    onParticipantAdded(updatedData);
  };

  const startEditingPlayer = (player: TournamentPlayer) => {
    setFormData({
      name: player.name,
      age: player.age || '',
      phone: player.phone || '',
      ageCategory: player.ageCategory || 'high-school-adult'
    });
    setEditingPlayer(player.id);
    setIsAddingPlayer(true);
  };

  const walkInPlayers = tournamentData.participants.filter(p => p.isWalkIn);
  const importedPlayers = tournamentData.participants.filter(p => !p.isWalkIn);

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <UserPlus className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Walk-in Registration</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Register participants who arrive on tournament day. Quick and easy registration for walk-ins during 7:30-8:00 AM.
        </p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Clock className="w-5 h-5 text-orange-600" />
          <span className="text-orange-600 font-medium">Registration Window: 7:30 AM - 8:00 AM</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Participants Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Participants</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{importedPlayers.length}</div>
              <div className="text-sm text-gray-600">Pre-registered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{walkInPlayers.length}</div>
              <div className="text-sm text-gray-600">Walk-ins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{tournamentData.participants.length}</div>
              <div className="text-sm text-gray-600">Total Players</div>
            </div>
          </div>
        </div>

        {/* Add/Edit Player Form */}
        {isAddingPlayer ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-orange-200 rounded-lg p-6"
          >
            <h4 className="text-xl font-semibold text-gray-900 mb-6">
              {editingPlayer ? 'Edit Player' : 'Add Walk-in Player'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Player Name *"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter player name"
                className="text-lg"
              />
              
              <Input
                label="Age/Grade"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="e.g., 16, 10th grade, Adult"
                className="text-lg"
              />
              
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 123-4567"
                type="tel"
                className="text-lg"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Category *
                </label>
                <select
                  value={formData.ageCategory}
                  onChange={(e) => setFormData({...formData, ageCategory: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="middle-school">Middle School (6th-8th Grade)</option>
                  <option value="high-school-adult">High School/Adult (9th Grade+)</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-6">
              <Button
                onClick={editingPlayer ? updatePlayer : addWalkInPlayer}
                disabled={!formData.name.trim()}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg"
              >
                {editingPlayer ? 'Update Player' : 'Add Player'}
              </Button>
              
              <Button
                onClick={resetForm}
                variant="outline"
                className="px-6 py-3 text-lg"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center">
            <Button
              onClick={() => setIsAddingPlayer(true)}
              className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Walk-in Player
            </Button>
          </div>
        )}

        {/* Player Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Walk-in Players */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-green-600" />
              Walk-in Players ({walkInPlayers.length})
            </h4>
            
            {walkInPlayers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No walk-in players yet</p>
                <p className="text-sm">Add players as they arrive for registration</p>
              </div>
            ) : (
              <div className="space-y-2">
                {walkInPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{player.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {player.age && <span>Age: {player.age}</span>}
                        <span className="capitalize">{player.ageCategory?.replace('-', ' ')}</span>
                      </div>
                      {player.phone && (
                        <p className="text-sm text-gray-500 mt-1">{player.phone}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditingPlayer(player)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pre-registered Players */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Pre-registered Players ({importedPlayers.length})
            </h4>
            
            {importedPlayers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No pre-registered players</p>
                <p className="text-sm">Import players from the database first</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {importedPlayers.map((player) => (
                  <div key={player.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-gray-900">{player.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {player.gradeLevel && <span>Grade: {player.gradeLevel}</span>}
                      <span className="capitalize">{player.ageCategory?.replace('-', ' ')}</span>
                    </div>
                    {player.phone && (
                      <p className="text-sm text-gray-500 mt-1">{player.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
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
            <span>Back to Data Import</span>
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Minimum 6 players needed for tournament
            </p>
            <Button
              onClick={onNext}
              disabled={tournamentData.participants.length < 6}
              className="bg-orange-600 hover:bg-orange-700 px-8 py-3"
            >
              Continue to Team Assignment ({tournamentData.participants.length} players)
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};