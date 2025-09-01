import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Download, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { TournamentData, TournamentPlayer, ImportedPlayerData } from '../../types/tournament';
import { supabase } from '../../lib/supabase';

interface DataImportProps {
  tournamentData: TournamentData;
  onDataImported: (data: TournamentData) => void;
  onNext: () => void;
}

export const DataImport: React.FC<DataImportProps> = ({
  tournamentData,
  onDataImported,
  onNext
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const importPlayersFromDatabase = async () => {
    setIsLoading(true);
    setImportStatus('loading');
    
    try {
      console.log('🔍 [DataImport] Importing players from database...');
      
      // Get all players from registered teams
      const { data: players, error } = await supabase
        .from('players')
        .select(`
          id,
          player_name,
          age_category,
          grade_level,
          contact_phone,
          teams!inner(team_name, status, approved)
        `)
        .eq('teams.approved', true);

      if (error) {
        console.error('❌ [DataImport] Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!players || players.length === 0) {
        console.log('📊 [DataImport] No approved players found in database');
        setImportStatus('success');
        setImportedCount(0);
        return;
      }

      // Transform database players to tournament players
      const tournamentPlayers: TournamentPlayer[] = players.map((player: any) => ({
        id: player.id,
        name: player.player_name,
        age: player.grade_level || 'Unknown',
        phone: player.contact_phone || undefined,
        gradeLevel: player.grade_level,
        ageCategory: player.age_category,
        isWalkIn: false,
        registeredAt: new Date()
      }));

      console.log('✅ [DataImport] Successfully imported players:', tournamentPlayers);

      // Update tournament data
      const updatedTournamentData: TournamentData = {
        ...tournamentData,
        participants: [...tournamentData.participants, ...tournamentPlayers],
        status: 'registration'
      };

      onDataImported(updatedTournamentData);
      setImportedCount(tournamentPlayers.length);
      setImportStatus('success');
      
    } catch (error) {
      console.error('❌ [DataImport] Import failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setImportStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearImportedData = () => {
    const clearedData: TournamentData = {
      ...tournamentData,
      participants: tournamentData.participants.filter(p => p.isWalkIn),
      teams: [],
      games: [],
      status: 'setup'
    };
    onDataImported(clearedData);
    setImportStatus('idle');
    setImportedCount(0);
    setErrorMessage('');
  };

  const existingImportedPlayers = tournamentData.participants.filter(p => !p.isWalkIn);
  const hasImportedData = existingImportedPlayers.length > 0;

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Import Tournament Data</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Import existing player registrations from the main database to start your tournament with pre-registered participants.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Current Status */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tournament Data</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {existingImportedPlayers.length}
              </div>
              <div className="text-sm text-gray-600">Imported Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tournamentData.participants.filter(p => p.isWalkIn).length}
              </div>
              <div className="text-sm text-gray-600">Walk-in Players</div>
            </div>
          </div>
        </div>

        {/* Import Actions */}
        <div className="space-y-4">
          {!hasImportedData ? (
            <Button
              onClick={importPlayersFromDatabase}
              disabled={isLoading}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Importing players from database...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5" />
                  <span>Import Players from Database</span>
                </div>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">
                      Successfully imported {existingImportedPlayers.length} player(s)
                    </p>
                    <p className="text-green-600 text-sm">
                      Players are ready for team assignment
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={clearImportedData}
                variant="outline"
                className="w-full"
              >
                Re-import Data (Clear Current Import)
              </Button>
            </div>
          )}

          {/* Import Status Messages */}
          {importStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">Import Failed</p>
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {importStatus === 'success' && importedCount === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-medium">No Players Found</p>
                  <p className="text-yellow-600 text-sm">
                    No approved players found in the database. You can proceed to register walk-in participants.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Player List Preview */}
        {existingImportedPlayers.length > 0 && (
          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Imported Players ({existingImportedPlayers.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {existingImportedPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{player.name}</p>
                    <p className="text-sm text-gray-600">
                      {player.gradeLevel} • {player.ageCategory}
                    </p>
                  </div>
                  {player.phone && (
                    <p className="text-sm text-gray-500">{player.phone}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={onNext}
            className="bg-orange-600 hover:bg-orange-700 px-8 py-3"
          >
            Continue to Walk-in Registration
          </Button>
        </div>
      </div>
    </Card>
  );
};