import React from 'react';
import { Hero } from '../components/Hero';
import { Sponsors } from '../components/Sponsors';
import { CemeteryProjectOverview } from '../components/CemeteryProjectOverview';
import { TournamentSuccessCallout } from '../components/TournamentSuccessCallout';
import { VolunteerRegistrationForm } from '../components/VolunteerRegistrationForm';
import { CemeteryFundraisingProgress } from '../components/CemeteryFundraisingProgress';
import { DatabaseTest } from '../components/DatabaseTest';
import { getFundraisingStats } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Users, Clock, AlertTriangle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [fundraisingStats, setFundraisingStats] = React.useState({
    totalRaised: 0,
    goal: 400,
    registeredTeams: 0,
    registeredPlayers: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [showDatabaseTest, setShowDatabaseTest] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState('');

  // Countdown to September 6, 2025
  React.useEffect(() => {
    const targetDate = new Date('2025-09-06T07:30:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setTimeLeft(`${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`);
        } else if (hours > 0) {
          setTimeLeft(`${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        } else {
          setTimeLeft(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }
      } else {
        setTimeLeft('Project has started!');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

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
      
      {/* Prominent Volunteer Registration Form - Above Fold */}
      <VolunteerRegistrationForm />
      
      {/* Emergency Volunteer Recruitment Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-8 w-8 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold">URGENT: Volunteers Needed THIS SATURDAY!</h3>
                <p className="text-red-100">Waxahachie Cemetery Project - Only 2-3 volunteers signed up, need 8-10+ minimum!</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-1" />
                <p className="text-sm font-semibold">{timeLeft}</p>
                <p className="text-xs text-red-200">until project start</p>
              </div>
              <Link 
                to="/project" 
                className="bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:bg-red-50 transition-colors shadow-lg"
              >
                <Users className="inline h-5 w-5 mr-2" />
                VOLUNTEER NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
      
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
      
      {/* Cemetery Project Overview Section */}
      <CemeteryProjectOverview />
      
      {/* Tournament Success Callout */}
      <TournamentSuccessCallout />
      
      {/* Updated Sponsors Section */}
      <Sponsors />
      
      {/* Cemetery Project Fundraising Progress */}
      <CemeteryFundraisingProgress />
    </div>
  );
};