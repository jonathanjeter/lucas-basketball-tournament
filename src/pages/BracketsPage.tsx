import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trophy, Calendar, MapPin, Clock, Users, Award, Target, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const BracketsPage: React.FC = () => {
  const tournamentRules = [
    {
      icon: Users,
      title: "Team Composition",
      description: "3 players per team with 1 substitute allowed. All players must be from the same division."
    },
    {
      icon: Clock,
      title: "Game Format",
      description: "Games are played to 21 points (win by 2) or 15 minutes, whichever comes first."
    },
    {
      icon: Target,
      title: "Scoring",
      description: "All baskets inside the arc = 1 point, outside the arc = 2 points. Make it, take it format."
    },
    {
      icon: Award,
      title: "Tournament Style",
      description: "Round-robin format ensuring every team plays multiple games. Winners determined by overall record."
    }
  ];

  const schedule = [
    { time: "7:30 AM", event: "Check-in Opens", description: "Team registration and payment collection - Walk-ins welcome!" },
    { time: "8:00 AM", event: "Tournament Begins", description: "Games start - Both divisions play simultaneously" },
    { time: "9:00 AM", event: "Round 1 Continues", description: "First round of tournament games" },
    { time: "10:00 AM", event: "Round 2", description: "Second round of games" },
    { time: "11:00 AM", event: "Championship Rounds", description: "Final games and championships" },
    { time: "12:00 PM", event: "Tournament Ends", description: "Tournament concludes - Thank you for playing!" }
  ];


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-orange-100 rounded-full">
          <Trophy className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
          Tournament Brackets & Information
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Get ready for an exciting day of 3-on-3 basketball supporting Lucas's Eagle Scout 
          cemetery restoration project. Tournament brackets will be available here on game day!
        </p>
      </motion.div>

      {/* Tournament Details */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Tournament Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Date & Time</h3>
              <p className="text-gray-600">Saturday, August 30, 2025<br />7:30 AM Check-in | 8:00 AM - 12:00 PM Tournament</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">Finley Junior High School Gym<br />2401 Brown St, Waxahachie, TX 75165</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Divisions</h3>
              <p className="text-gray-600">Junior (6th-8th Grade)<br />Senior (9th-Adult)</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tournament Rules */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Tournament Rules
          </h2>
          <p className="text-xl text-gray-600">
            Fair play and sportsmanship are our top priorities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tournamentRules.map((rule, index) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg flex-shrink-0">
                    <rule.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{rule.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{rule.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tournament Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Tournament Day Schedule
          </h2>
          <p className="text-xl text-gray-600">
            Plan your day with our complete tournament timeline
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            {schedule.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0"
              >
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold text-sm min-w-[80px] text-center">
                  {item.time}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.event}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>


      {/* Live Brackets Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="p-8 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
          <Trophy className="h-16 w-16 mx-auto mb-6 text-orange-100" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Live Tournament Brackets
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Tournament brackets and live scoring will be available here on game day! 
            Check back on Saturday, August 30th for real-time updates and results.
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
                Supporting Lucas's Eagle Scout Project
              </p>
            </div>
            <p className="text-green-700 text-sm">
              Every game played brings us closer to our $400 fundraising goal for cemetery restoration supplies. 
              Funds raised above our goal will be donated to the Sons of American Revolution.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              asChild
              variant="secondary" 
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              <a href="/register">Register Your Team</a>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              <a href="/sponsors">Become a Sponsor</a>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};