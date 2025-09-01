import React from 'react';
import { Trophy, DollarSign, Users, Calendar } from 'lucide-react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';

export const TournamentSuccessCallout: React.FC = () => {
  const tournamentStats = [
    {
      icon: DollarSign,
      title: '$270 Raised',
      description: 'Tournament fundraising goal exceeded',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: '12 Teams',
      description: 'Great community participation',
      color: 'text-blue-500'
    },
    {
      icon: Trophy,
      title: 'August 30',
      description: 'Successfully completed tournament',
      color: 'text-orange-500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tournament Success! 🏀
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thank you to everyone who participated in our basketball tournament on August 30th. 
            Your support helped fund the cemetery restoration project supplies!
          </p>
        </motion.div>

        {/* Success Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tournamentStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="p-6 text-center">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {stat.title}
                </h3>
                <p className="text-gray-600">
                  {stat.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Success Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-8 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="text-center">
              <Trophy className="h-16 w-16 mx-auto mb-6 text-green-100" />
              <h3 className="text-2xl font-bold mb-4">
                Mission Accomplished: Tournament Phase Complete!
              </h3>
              <p className="text-lg mb-6 text-green-100 max-w-4xl mx-auto">
                Our 3-on-3 basketball tournament was a huge success! Thanks to the incredible 
                support from players, families, and local businesses, we raised $270 toward 
                cemetery restoration supplies. The funds will purchase headstone cleaning materials, 
                documentation supplies, and safety equipment for the September 6th project.
              </p>
              <div className="bg-green-600/30 rounded-lg p-4 inline-block">
                <div className="text-sm font-semibold">Next Phase:</div>
                <div className="text-lg">Now we need YOUR HELP volunteering for the actual project!</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Photo Gallery Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gray-50">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Tournament Memories
              </h4>
              <p className="text-gray-600 mb-4">
                Photos and highlights from our successful August 30th tournament coming soon!
              </p>
              <div className="text-sm text-gray-500">
                Check back later for tournament photos and team highlights.
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};