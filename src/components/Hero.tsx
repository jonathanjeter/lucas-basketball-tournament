import React from 'react';
import { Calendar, MapPin, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface HeroProps {
  fundraisingStats: {
    totalRaised: number;
    goal: number;
    registeredTeams: number;
    registeredPlayers: number;
  };
  loading?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ fundraisingStats, loading = false }) => {
  const progressPercentage = (fundraisingStats.totalRaised / fundraisingStats.goal) * 100;

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              3-on-3 Basketball
              <span className="block text-orange-400">Tournament</span>
            </h1>
            
            <div className="space-y-4 mb-8 text-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-orange-400" />
                <div>
                  <div>Saturday, August 30, 2025</div>
                  <div className="text-sm text-blue-200">Check-in: 7:30-8:00 AM | Tournament: 8:00 AM-12:00 PM</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-orange-400" />
                <div>
                  <div>Finley Junior High School Gym</div>
                  <div className="text-sm text-blue-200">2401 Brown St, Waxahachie, TX 75165</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-orange-400" />
                <span>Eagle Scout Project Fundraiser</span>
              </div>
            </div>

            <p className="text-xl mb-6 text-blue-100">
              Join us for an exciting day of basketball competition while supporting a great cause! 
              All proceeds go toward funding an Eagle Scout service project.
            </p>

            {/* Walk-in Welcome Banner */}
            <div className="bg-orange-500 border-2 border-orange-400 rounded-lg p-4 mb-8">
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-2">🏀 WALK-INS WELCOME! 🏀</div>
                <div className="text-white mb-2">
                  No pre-registration required! Just show up tomorrow morning at 7:30 AM ready to play.
                </div>
                <div className="text-sm text-orange-100">
                  $10 suggested donation per player supports the Eagle Scout project - donations appreciated but not required!
                  <br />The goal is to have fun playing basketball while supporting a great cause!
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Register (Optional)
                </Button>
              </Link>
              <Link to="/project">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
                  Learn About Our Cause
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Fundraising Progress */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Fundraising Progress</h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Goal: ${fundraisingStats.goal}</span>
                  <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-4 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    {loading ? '...' : `$${fundraisingStats.totalRaised}`}
                  </div>
                  <div className="text-sm text-blue-100">Raised So Far</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    {loading ? '...' : fundraisingStats.registeredTeams}
                  </div>
                  <div className="text-sm text-blue-100">Teams Registered</div>
                </div>
              </div>

              <div className="text-center mt-6">
                <div className="text-2xl font-bold text-orange-400">
                  {loading ? '...' : fundraisingStats.registeredPlayers}
                </div>
                <div className="text-sm text-blue-100">Players Ready to Play</div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
};