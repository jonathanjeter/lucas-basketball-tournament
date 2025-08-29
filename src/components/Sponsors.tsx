import React from 'react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';

export const Sponsors: React.FC = () => {
  const sponsors = [
    {
      id: 'seigga-group',
      name: 'Seigga Group',
      website: 'https://www.seiggagroup.com/',
      logo: '/sponsor-logos/seigga_group_logo.jpeg',
    },
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
            Our Tournament Sponsors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thank you to these amazing sponsors who make this tournament possible!
          </p>
        </motion.div>

        <div className="flex justify-center">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {sponsor.website ? (
                <a 
                  href={sponsor.website}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card hover className="p-6 text-center h-full transition-transform hover:scale-105">
                    <SponsorContent sponsor={sponsor} />
                  </Card>
                </a>
              ) : (
                <Card className="p-6 text-center h-full">
                  <SponsorContent sponsor={sponsor} />
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SponsorContent: React.FC<{ sponsor: any }> = ({ sponsor }) => (
  <>
    <div className="w-full h-24 rounded flex items-center justify-center mb-4">
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="max-h-20 max-w-full object-contain"
        />
      ) : sponsor.id === 'seigga-group' ? (
        <div className="w-full h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
          <span className="text-white text-lg font-bold">SEIGGA GROUP</span>
        </div>
      ) : (
        <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
          <Building className="h-12 w-12 text-gray-400" />
        </div>
      )}
    </div>
    <h4 className="text-lg font-semibold text-gray-900">
      {sponsor.name}
    </h4>
  </>
);