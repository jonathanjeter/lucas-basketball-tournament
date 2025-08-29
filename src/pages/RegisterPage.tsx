import React from 'react';
import { RegistrationForm } from '../components/RegistrationForm';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Heart, Gift, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage: React.FC = () => {
  return (
    <div>
      {/* Individual Donation Call-to-Action - Prominent */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-green-600 py-8"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Just Want to Donate?
              </h2>
            </div>
            <p className="text-gray-700 mb-6 text-lg">
              Support our Eagle Scout cemetery restoration project without playing in the tournament. 
              Every donation helps us honor military veterans!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/sponsors"
                className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Gift className="h-5 w-5 mr-2" />
                Donate as Individual Supporter
              </a>
              <div className="flex items-center text-green-700">
                <ArrowRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Use our sponsor form - No business required!</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              $40+ donations receive recognition. Individual supporters welcome alongside businesses.
            </p>
          </Card>
        </div>
      </motion.div>

      {/* Registration Form */}
      <RegistrationForm />
    </div>
  );
};