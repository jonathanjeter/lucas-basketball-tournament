import React from 'react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';
import { getApprovedSponsors } from '../lib/supabase';

interface Sponsor {
  id: string;
  sponsor_name: string;
  website?: string;
  logo_url?: string;
  donation_amount?: number;
  sponsor_level?: string;
  company?: string;
}

export const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { data, error } = await getApprovedSponsors();
        if (!error && data) {
          setSponsors(data);
        } else {
          console.error('Failed to fetch sponsors:', error);
          // Fallback to hardcoded sponsors if database fails
          setSponsors([
            {
              id: 'seigga-group',
              sponsor_name: 'Seigga Group',
              website: 'https://www.seiggagroup.com/',
              logo_url: '/sponsor-logos/seigga_group_logo.jpeg',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
        // Fallback to hardcoded sponsors
        setSponsors([
          {
            id: 'seigga-group',
            sponsor_name: 'Seigga Group',
            website: 'https://www.seiggagroup.com/',
            logo_url: '/sponsor-logos/seigga_group_logo.jpeg',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-600">Loading sponsors...</div>
          </div>
        </div>
      </section>
    );
  }

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

const SponsorContent: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => (
  <>
    <div className="w-full h-24 rounded flex items-center justify-center mb-4">
      {sponsor.logo_url ? (
        <img
          src={sponsor.logo_url}
          alt={sponsor.sponsor_name}
          className="max-h-20 max-w-full object-contain"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-gray-400 text-sm font-medium">${sponsor.sponsor_name}</div>
                  </div>
                </div>
              `;
            }
          }}
        />
      ) : sponsor.id === 'seigga-group' ? (
        <div className="w-full h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
          <span className="text-white text-lg font-bold">SEIGGA GROUP</span>
        </div>
      ) : (
        <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
          <div className="text-center">
            <Building className="h-8 w-8 text-gray-400 mx-auto mb-1" />
            <div className="text-gray-600 text-xs font-medium">{sponsor.sponsor_name}</div>
          </div>
        </div>
      )}
    </div>
    <h4 className="text-lg font-semibold text-gray-900">
      {sponsor.sponsor_name}
    </h4>
    {sponsor.donation_amount && sponsor.donation_amount >= 40 && (
      <p className="text-sm text-orange-600 font-medium mt-1">
        Premium Sponsor
      </p>
    )}
  </>
);