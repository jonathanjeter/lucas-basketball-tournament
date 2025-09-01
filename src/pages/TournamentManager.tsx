import React from 'react';
import { motion } from 'framer-motion';
import { TournamentManagerComponent } from '../components/tournament/TournamentManager';

export const TournamentManager: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏀 Tournament Manager
          </h1>
          <p className="text-xl text-gray-600">
            Complete tournament management system for August 30, 2025
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            Ready for Tournament Day
          </div>
        </motion.div>
        
        <TournamentManagerComponent />
      </div>
    </div>
  );
};