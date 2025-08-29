import React from 'react';
import { Hero } from '../components/Hero';
import { Sponsors } from '../components/Sponsors';
import { EventDetails } from '../components/EventDetails';
import { DatabaseTest } from '../components/DatabaseTest';
import { getFundraisingStats } from '../lib/supabase';

export const HomePage: React.FC = () => {
  const [fundraisingStats, setFundraisingStats] = React.useState({
    totalRaised: 0,
    goal: 400,
    registeredTeams: 0,
    registeredPlayers: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [showDatabaseTest, setShowDatabaseTest] = React.useState(false);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await getFundraisingStats();
        if (error) {
          console.error('Error fetching stats:', error);
          // Use mock data if Supabase isn't configured yet
          setFundraisingStats({
            totalRaised: 0,
            goal: 400,
            registeredTeams: 0,
            registeredPlayers: 0,
          });
        } else {
          setFundraisingStats({
            totalRaised: Number(data.total_raised || 0),
            goal: Number(data.goal || 400),
            registeredTeams: Number(data.registered_teams || 0),
            registeredPlayers: Number(data.registered_players || 0),
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Set default values on error
        setFundraisingStats({
          totalRaised: 0,
          goal: 400,
          registeredTeams: 0,
          registeredPlayers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Hero fundraisingStats={fundraisingStats} loading={loading} />
      
      {/* Database Test Toggle - Only show in development */}
      {import.meta.env.VITE_DEV_MODE === 'true' && (
        <div className="bg-yellow-50 border-b border-yellow-200 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-800">Development Mode</span>
              <button
                onClick={() => setShowDatabaseTest(!showDatabaseTest)}
                className="text-sm text-yellow-600 hover:text-yellow-800 underline"
              >
                {showDatabaseTest ? 'Hide' : 'Show'} Database Test
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDatabaseTest && <DatabaseTest />}
      
      <Sponsors />
      <EventDetails />
    </div>
  );
};