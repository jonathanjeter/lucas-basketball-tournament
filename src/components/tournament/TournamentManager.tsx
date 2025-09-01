import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  UserPlus, 
  Users, 
  Trophy, 
  Target, 
  Award, 
  ChevronRight,
  ChevronLeft,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { TournamentData, TournamentStep } from '../../types/tournament';
import { DataImport } from './DataImport';
import { WalkInRegistration } from './WalkInRegistration';
import { TeamAssignment } from './TeamAssignment';
import { BracketGenerator } from './BracketGenerator';
import { ScoreTracker } from './ScoreTracker';
import { TournamentResults } from './TournamentResults';

const TOURNAMENT_STORAGE_KEY = 'basketball-tournament-data';

export const TournamentManagerComponent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<TournamentStep>('import-data');
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initialize tournament data
  useEffect(() => {
    const savedData = localStorage.getItem(TOURNAMENT_STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTournamentData(data);
        // Set current step based on tournament status
        if (data.status === 'completed') setCurrentStep('tournament-results');
        else if (data.status === 'in-progress') setCurrentStep('score-tracking');
        else if (data.status === 'brackets-generated') setCurrentStep('score-tracking');
        else if (data.status === 'teams-assigned') setCurrentStep('bracket-generation');
        else if (data.status === 'registration') setCurrentStep('walk-in-registration');
      } catch (error) {
        console.error('Failed to load tournament data:', error);
      }
    } else {
      // Initialize new tournament
      const newTournament: TournamentData = {
        id: `tournament-${Date.now()}`,
        name: '3-on-3 Basketball Tournament',
        date: '2025-08-30',
        status: 'setup',
        participants: [],
        teams: [],
        games: [],
        settings: {
          courtCount: 2,
          gameLength: 15,
          maxPlayersPerTeam: 4,
          minPlayersPerTeam: 3,
          tournamentStyle: 'round-robin',
          allowWalkIns: true
        },
        createdAt: new Date(),
        lastModified: new Date()
      };
      setTournamentData(newTournament);
      saveTournamentData(newTournament);
    }
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveTournamentData = (data: TournamentData) => {
    const updatedData = {
      ...data,
      lastModified: new Date()
    };
    localStorage.setItem(TOURNAMENT_STORAGE_KEY, JSON.stringify(updatedData));
    setTournamentData(updatedData);
  };

  const steps = [
    { 
      id: 'import-data' as TournamentStep, 
      name: 'Import Data', 
      icon: Database,
      description: 'Import existing registrations from database'
    },
    { 
      id: 'walk-in-registration' as TournamentStep, 
      name: 'Walk-in Registration', 
      icon: UserPlus,
      description: 'Register walk-in participants (7:30-8:00 AM)'
    },
    { 
      id: 'team-assignment' as TournamentStep, 
      name: 'Team Assignment', 
      icon: Users,
      description: 'Assign players to teams'
    },
    { 
      id: 'bracket-generation' as TournamentStep, 
      name: 'Generate Brackets', 
      icon: Trophy,
      description: 'Create tournament brackets and schedule'
    },
    { 
      id: 'score-tracking' as TournamentStep, 
      name: 'Score Tracking', 
      icon: Target,
      description: 'Track game scores and standings'
    },
    { 
      id: 'tournament-results' as TournamentStep, 
      name: 'Results & Export', 
      icon: Award,
      description: 'View results and export data'
    }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  
  const canGoToStep = (stepId: TournamentStep): boolean => {
    if (!tournamentData) return false;
    
    switch (stepId) {
      case 'import-data': return true;
      case 'walk-in-registration': return true;
      case 'team-assignment': return tournamentData.participants.length >= 6; // minimum for 2 teams
      case 'bracket-generation': return tournamentData.teams.length >= 2;
      case 'score-tracking': return tournamentData.games.length > 0;
      case 'tournament-results': return tournamentData.games.some(g => g.status === 'completed');
      default: return false;
    }
  };

  const renderStep = () => {
    if (!tournamentData) return null;

    switch (currentStep) {
      case 'import-data':
        return (
          <DataImport
            tournamentData={tournamentData}
            onDataImported={saveTournamentData}
            onNext={() => setCurrentStep('walk-in-registration')}
          />
        );
      case 'walk-in-registration':
        return (
          <WalkInRegistration
            tournamentData={tournamentData}
            onParticipantAdded={saveTournamentData}
            onNext={() => setCurrentStep('team-assignment')}
            onBack={() => setCurrentStep('import-data')}
          />
        );
      case 'team-assignment':
        return (
          <TeamAssignment
            tournamentData={tournamentData}
            onTeamsAssigned={saveTournamentData}
            onNext={() => setCurrentStep('bracket-generation')}
            onBack={() => setCurrentStep('walk-in-registration')}
          />
        );
      case 'bracket-generation':
        return (
          <BracketGenerator
            tournamentData={tournamentData}
            onBracketsGenerated={saveTournamentData}
            onNext={() => setCurrentStep('score-tracking')}
            onBack={() => setCurrentStep('team-assignment')}
          />
        );
      case 'score-tracking':
        return (
          <ScoreTracker
            tournamentData={tournamentData}
            onScoreUpdated={saveTournamentData}
            onTournamentComplete={() => setCurrentStep('tournament-results')}
            onBack={() => setCurrentStep('bracket-generation')}
          />
        );
      case 'tournament-results':
        return (
          <TournamentResults
            tournamentData={tournamentData}
            onBack={() => setCurrentStep('score-tracking')}
          />
        );
      default:
        return null;
    }
  };

  if (!tournamentData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tournament data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Online/Offline Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <div className="text-sm text-gray-600">
            Last saved: {new Date(tournamentData.lastModified).toLocaleTimeString()}
          </div>
        </div>
        
        {/* Tournament Stats */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {tournamentData.participants.length} Players
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {tournamentData.teams.length} Teams
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            {tournamentData.games.filter(g => g.status === 'completed').length}/{tournamentData.games.length} Games Complete
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tournament Progress</h2>
          <div className="text-sm text-gray-600">
            Step {getCurrentStepIndex() + 1} of {steps.length}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-4">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = getCurrentStepIndex() > index;
            const isAvailable = canGoToStep(step.id);
            const Icon = step.icon;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => isAvailable && setCurrentStep(step.id)}
                  disabled={!isAvailable}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all min-w-[140px] ${
                    isActive 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' 
                        : isAvailable
                          ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium text-center">{step.name}</span>
                  <span className="text-xs text-center mt-1 opacity-75">{step.description}</span>
                </button>
                
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};