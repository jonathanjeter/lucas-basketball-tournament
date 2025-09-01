import React from 'react';
import { DollarSign, Target, CheckCircle, ShoppingCart } from 'lucide-react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';

export const CemeteryFundraisingProgress: React.FC = () => {
  const totalRaised = 270;
  const goal = 400;
  const progressPercentage = Math.round((totalRaised / goal) * 100);
  const remaining = goal - totalRaised;

  const fundingBreakdown = [
    {
      item: 'Headstone cleaning supplies',
      cost: 150,
      status: 'funded',
      description: 'Professional cleaning solutions and brushes'
    },
    {
      item: 'Documentation materials',
      cost: 80,
      status: 'funded',
      description: 'Cameras, forms, and preservation records'
    },
    {
      item: 'Safety equipment',
      cost: 40,
      status: 'funded',
      description: 'Gloves, knee pads, and safety gear'
    },
    {
      item: 'Additional restoration tools',
      cost: 130,
      status: 'needed',
      description: 'Specialized tools for difficult headstones'
    }
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
            Cemetery Project Fundraising
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track our progress toward the $400 goal needed for professional headstone restoration supplies and equipment.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Funding Progress</h3>
                <span className="text-lg font-bold text-green-600">{progressPercentage}% Complete</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">${totalRaised}</span>
                  </div>
                  <div className="text-sm text-gray-600">Tournament Raised</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-5 w-5 text-blue-600 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">${goal}</span>
                  </div>
                  <div className="text-sm text-gray-600">Total Goal</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <ShoppingCart className="h-5 w-5 text-orange-600 mr-1" />
                    <span className="text-2xl font-bold text-orange-600">${remaining}</span>
                  </div>
                  <div className="text-sm text-gray-600">Still Needed</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tournament Success */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-gradient-to-br from-green-500 to-green-600 text-white h-full">
              <CheckCircle className="h-12 w-12 mb-4 text-green-100" />
              <h3 className="text-xl font-bold mb-2">Tournament Success!</h3>
              <p className="text-green-100 text-sm mb-4">
                Our basketball tournament on August 30th exceeded expectations, raising 68% of our goal!
              </p>
              <div className="bg-green-600/30 rounded-lg p-3">
                <div className="text-lg font-bold">${totalRaised} Raised</div>
                <div className="text-sm text-green-200">From 12 participating teams</div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Funding Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How Your Donations Are Being Used
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fundingBreakdown.map((item, index) => (
                <motion.div
                  key={item.item}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    item.status === 'funded' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${
                      item.status === 'funded' ? 'text-green-900' : 'text-orange-900'
                    }`}>
                      {item.item}
                    </h4>
                    <div className="flex items-center">
                      {item.status === 'funded' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <ShoppingCart className="h-5 w-5 text-orange-600 mr-2" />
                      )}
                      <span className={`font-bold ${
                        item.status === 'funded' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        ${item.cost}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm ${
                    item.status === 'funded' ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    {item.description}
                  </p>
                  <div className={`text-xs font-medium mt-2 ${
                    item.status === 'funded' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {item.status === 'funded' ? '✅ FUNDED' : '🎯 STILL NEEDED'}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">We're Almost There!</h3>
            <p className="text-lg mb-6 text-blue-100">
              Thanks to our tournament success, we have the basic supplies needed. 
              Additional donations will help us purchase specialized restoration tools 
              for the most challenging headstone preservation work.
            </p>
            <div className="bg-blue-700/30 rounded-lg p-4 inline-block">
              <div className="font-semibold">Most Important Now:</div>
              <div className="text-lg">We need YOUR HANDS to do the actual work!</div>
              <div className="text-sm text-blue-200 mt-1">Volunteer for September 6th project</div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};