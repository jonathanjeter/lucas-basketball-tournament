import React from 'react';
import { Clock, Users, Trophy, DollarSign, MapPin, Gift, Building } from 'lucide-react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { getSponsors } from '../lib/supabase';

export const EventDetails: React.FC = () => {
  const [sponsors, setSponsors] = React.useState<any[]>([]);
  const [sponsorsLoading, setSponsorsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const result = await getSponsors();
        // Filter sponsors with donation amount >= $40 for display
        const displaySponsors = (result.data || []).filter((sponsor: any) => 
          sponsor.donation_amount >= 40
        );
        setSponsors(displaySponsors);
      } catch (error) {
        console.error('Failed to fetch sponsors:', error);
        setSponsors([]);
      } finally {
        setSponsorsLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const details = [
    {
      icon: MapPin,
      title: 'Tournament Location',
      description: 'Finley Junior High School Gym\n2401 Brown St, Waxahachie, TX 75165\nEasy parking and accessible facilities'
    },
    {
      icon: Clock,
      title: 'Tournament Schedule',
      description: 'Registration/Team Assignment: 7:30-8:00 AM\nTournament Play: 8:00 AM - 12:00 PM (Noon)\n🏀 Walk-ins Welcome - No Pre-registration Required!'
    },
    {
      icon: Users,
      title: 'Team Format',
      description: '3 players on court + 1 substitute\nMiddle School/Junior High division\nHigh School/Adult division'
    },
    {
      icon: Gift,
      title: 'Sponsors Needed',
      description: 'Seeking local business sponsors!\nSupport our Eagle Scout project\nRecognition for all sponsors'
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Event Details
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about the tournament format, schedule, and what to expect on game day.
          </p>
        </motion.div>

        {/* Walk-in Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
            <div className="text-3xl mb-4">🏀 WALK-INS WELCOME! 🏀</div>
            <div className="text-xl mb-2">No Registration Required!</div>
            <div className="text-lg">Just show up Saturday, August 30th at 7:30 AM ready to play.</div>
            <div className="text-sm mt-3 opacity-90">
              <div className="mb-1">Bring $10 suggested donation per player • Basketball shoes • Water bottle</div>
              <div className="text-xs bg-white/20 rounded-lg px-4 py-2 inline-block">
                💚 Entry fee supports the Eagle Scout project - donations appreciated but not required!
                <br />Come have fun playing basketball while supporting a great cause!
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {details.map((detail, index) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="p-6 h-full">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                  <detail.icon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {detail.title}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {detail.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sponsors Section */}
        {!sponsorsLoading && sponsors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Tournament Sponsors
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Thank you to these amazing local businesses supporting our Eagle Scout project!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="p-4 text-center h-full">
                    {sponsor.logo_url ? (
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="w-full h-20 object-contain mb-3 rounded"
                      />
                    ) : (
                      <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center mb-3">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {sponsor.name}
                    </h4>
                    <p className="text-orange-600 font-medium text-sm">
                      ${sponsor.donation_amount} Sponsor
                    </p>
                    {sponsor.website && (
                      <a 
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs mt-1 block"
                      >
                        Visit Website
                      </a>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action for Sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center">
            <Gift className="h-12 w-12 mx-auto mb-4 text-orange-100" />
            <h3 className="text-2xl font-bold mb-4">
              Get Involved!
            </h3>
            <p className="text-xl mb-6 text-orange-100">
              Join our tournament, support as a sponsor, or volunteer for our Eagle Scout cemetery restoration project!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register"
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Register (Optional)
              </a>
              <a 
                href="/project"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Volunteer for Project
              </a>
              <a 
                href="/sponsors"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Become a Sponsor
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};