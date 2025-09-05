import React from 'react';
import { MapPin, Clock, Users, Wrench, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export const CemeteryProjectOverview: React.FC = () => {
  const projectDetails = [
    {
      icon: MapPin,
      title: 'Project Location',
      description: 'Waxahachie Cemetery, Waxahachie, TX\n802 Water St, Waxahachie, TX 75165\nHistoric cemetery with headstones dating to 1800s'
    },
    {
      icon: Clock,
      title: 'Project Schedule',
      description: 'Saturday, September 6, 2025\n7:30 AM - 12:00 PM (4.5 hours)\nTraining provided by Sons of American Revolution'
    },
    {
      icon: Users,
      title: 'Volunteers Needed',
      description: 'Currently: 1 volunteer signed up\nMinimum needed: 8-10 volunteers\nAge range: All ages welcome (minors with supervision)'
    },
    {
      icon: Wrench,
      title: 'What We\'ll Do',
      description: 'Headstone preservation and restoration\nClearing vegetation and debris\nDocumentation and photography\nAll equipment and training provided'
    }
  ];

  const requirements = [
    'Manual labor capability (no special skills needed)',
    'Bring water bottle and work gloves if available',
    'Wear work clothes and closed-toe shoes',
    'Minors must have parent/guardian supervision'
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
            Cemetery Restoration Project
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Lucas's Eagle Scout project to preserve local history by restoring historic headstones 
            at Waxahachie Cemetery with professional SAR training and equipment.
          </p>
        </motion.div>

        {/* Urgent Volunteer Call */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-r from-red-500 to-red-600 text-white text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-100 animate-pulse" />
            <div className="text-3xl font-bold mb-2">VOLUNTEERS URGENTLY NEEDED!</div>
            <div className="text-xl mb-4">Only 1 volunteer signed up - Need 7-9 MORE!</div>
            <div className="text-lg mb-6">
              This Saturday, September 6, 2025 • 7:30 AM - 12:00 PM
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/project">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-bold px-8 py-4 text-lg">
                  <Heart className="h-5 w-5 mr-2" />
                  VOLUNTEER NOW
                </Button>
              </Link>
            </div>
            <div className="text-sm mt-4 text-red-100 bg-red-600/30 rounded-lg px-4 py-2 inline-block">
              💡 Community service hours available • Help preserve local history • No experience needed
            </div>
          </Card>
        </motion.div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {projectDetails.map((detail, index) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="p-6 h-full">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <detail.icon className="h-6 w-6 text-blue-600" />
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

        {/* What to Expect Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                What to Expect on Project Day
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Requirements
                </h4>
                <ul className="space-y-2 text-gray-600">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Wrench className="h-5 w-5 text-orange-500 mr-2" />
                  Provided by SAR
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Professional headstone restoration equipment
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Training on proper techniques
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Safety gear and supervision
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Documentation materials
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Project Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-blue-100" />
            <h3 className="text-2xl font-bold mb-4">
              Help Preserve Local History
            </h3>
            <p className="text-xl mb-6 text-blue-100">
              Waxahachie Cemetery contains headstones dating back to the 1800s. Your volunteer work 
              will help preserve these historical markers for future generations while earning 
              community service hours.
            </p>
            <div className="text-lg font-semibold">
              Together, we can make a lasting impact on our community's heritage.
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};