import React from 'react';
import { Calendar, MapPin, Target, Users, Clock, AlertTriangle, Heart } from 'lucide-react';
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
  
  // Countdown to September 6, 2025, 7:30 AM
  const [timeLeft, setTimeLeft] = React.useState('');
  
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
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400 animate-pulse" />
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                URGENT: VOLUNTEERS NEEDED!
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cemetery Restoration
              <span className="block text-orange-400">THIS SATURDAY</span>
            </h1>
            
            <div className="space-y-4 mb-8 text-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-orange-400" />
                <div>
                  <div>Saturday, September 6, 2025</div>
                  <div className="text-sm text-blue-200">7:30 AM - 12:00 PM | Headstone Preservation</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-orange-400" />
                <div>
                  <div>Pioneer Cemetery, Waxahachie, TX</div>
                  <div className="text-sm text-blue-200">Historic cemetery restoration with SAR training</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-orange-400" />
                <div>
                  <div>Only 1 volunteer signed up - NEED 8-10 MINIMUM!</div>
                  <div className="text-sm text-blue-200">Manual labor, no experience needed, equipment provided</div>
                </div>
              </div>
            </div>

            <p className="text-xl mb-6 text-blue-100">
              Help preserve local history! Join our Eagle Scout project to restore historic headstones 
              with the Sons of American Revolution. Minors welcome with supervision.
            </p>

            {/* Countdown Timer */}
            <div className="bg-red-500 border-2 border-red-400 rounded-lg p-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Clock className="h-6 w-6 text-white" />
                  <div className="text-2xl font-bold text-white">Time Until Project:</div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{timeLeft}</div>
                <div className="text-red-100 text-sm">
                  Equipment provided • Training included • Community service hours • Preserve history
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/project">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 text-lg">
                  <Heart className="h-5 w-5 mr-2" />
                  VOLUNTEER NOW
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
                Learn More About Project
              </Button>
            </div>
          </motion.div>

          {/* Fundraising Progress */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Eagle Scout Project Progress</h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Goal: $400</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "68%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">$270</div>
                  <div className="text-sm text-blue-100">Tournament Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">$130</div>
                  <div className="text-sm text-blue-100">Still Needed</div>
                </div>
              </div>

              <div className="text-center bg-green-500/20 rounded-lg p-4 mb-4">
                <div className="text-lg font-bold text-green-400">🏀 Tournament Success!</div>
                <div className="text-sm text-green-200">Basketball tournament raised $270 for cemetery restoration supplies</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">1</div>
                <div className="text-sm text-blue-100">Volunteer Signed Up</div>
                <div className="text-xs text-red-200 font-medium mt-1">NEED 7-9 MORE!</div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
};