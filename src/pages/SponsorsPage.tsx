import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';
import { getSponsors, addSponsor } from '../lib/supabase';
import { Upload, Building, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { validateEmailOrPhone, validateEmail, validateUSPhone } from '../utils/validation';

export const SponsorsPage: React.FC = () => {
  const [sponsors, setSponsors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [sponsorType, setSponsorType] = React.useState<'business' | 'individual'>('business');
  const [donationType, setDonationType] = React.useState<'monetary' | 'item'>('monetary');
  const [donationAmount, setDonationAmount] = React.useState('');
  const [itemValue, setItemValue] = React.useState('');
  const [showLogoUpload, setShowLogoUpload] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<{[key: string]: string}>({});

  React.useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const result = await getSponsors();
        setSponsors(result.data || []);
      } catch (error) {
        console.error('Failed to fetch sponsors:', error);
        setSponsors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // Check if logo upload should be shown
  React.useEffect(() => {
    const amount = donationType === 'monetary' ? parseInt(donationAmount) : parseInt(itemValue);
    setShowLogoUpload(amount >= 40);
  }, [donationType, donationAmount, itemValue]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        toast.error('Please select a valid image file (JPG, PNG, GIF)');
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors({});
    
    const formData = new FormData(e.currentTarget);
    const donationType = formData.get('donationType') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    
    // Validation for individual supporters
    if (sponsorType === 'individual') {
      const validation = validateEmailOrPhone(email, phone);
      if (!validation.isValid) {
        setValidationErrors({ contact: validation.message || '' });
        setSubmitting(false);
        toast.error(validation.message || 'Please provide valid contact information');
        return;
      }
    }
    
    const sponsorData = {
      name: sponsorType === 'business' ? formData.get('companyName') as string : formData.get('individualName') as string,
      contact_name: sponsorType === 'business' ? formData.get('contactName') as string : null,
      email: email || null,
      phone: phone || null,
      sponsor_type: sponsorType,
      donation_type: donationType,
      donation_amount: donationType === 'monetary' ? parseFloat(formData.get('donationAmount') as string) : null,
      item_description: donationType === 'item' ? formData.get('itemDescription') as string : null,
      estimated_value: donationType === 'item' ? parseFloat(formData.get('estimatedValue') as string) : null,
      website: formData.get('website') as string || null,
      logo_file: selectedFile,
    };

    try {
      await addSponsor(sponsorData);
      toast.success('Thank you for becoming a sponsor!');
      // Refresh sponsors list
      const result = await getSponsors();
      setSponsors(result.data || []);
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Sponsor submission error:', error);
      toast.error('Failed to submit sponsorship. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Tournament Sponsors
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Support our Eagle Scout fundraising tournament through monetary donations or item contributions. 
          We're seeking local businesses to donate items like water, Gatorade, snacks, and prizes for winning teams. 
          All contributions help Lucas reach his fundraising goal! <strong>For item donations, we offer free local 
          pickup if notified by noon on Friday, August 29th.</strong>
        </p>
      </motion.div>

      {/* Prize Sponsorship Call to Action */}
      <Card className="p-8 mb-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="text-center">
          <Gift className="h-12 w-12 mx-auto mb-4 text-blue-100" />
          <h2 className="text-2xl font-semibold mb-4">
            🎁 Tournament Sponsors Needed!
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            Help us reach our fundraising goal! We're seeking local businesses to sponsor 
            our tournament and support our Eagle Scout cemetery restoration project.
          </p>
          <div className="flex justify-center">
            <a 
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact us about tournament sponsorship
            </a>
          </div>
        </div>
      </Card>

      {/* Existing Sponsors */}
      {!loading && sponsors.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Our Amazing Sponsors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6 text-center">
                  {sponsor.logo_url ? (
                    <img
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      className="w-full h-32 object-contain mb-4 rounded"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-4">
                      <Building className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {sponsor.name}
                  </h3>
                  <p className="text-orange-600 font-medium">
                    ${sponsor.donation_amount} Donation
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading sponsors...</div>
        </div>
      )}

      {/* Sponsorship Form */}
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Become a Sponsor or Individual Supporter
          </h2>
          <p className="text-gray-600 mb-6">
            Support our Eagle Scout fundraising tournament through monetary donations or item contributions. 
            We're seeking local businesses to donate items like water, Gatorade, snacks, and prizes for winning teams. 
            All contributions help Lucas reach his fundraising goal! <strong>For item donations, we offer free local 
            pickup if notified by noon on Friday, August 29th.</strong>
          </p>
        </div>

        {/* $40 Recognition Callout */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">🏆 Sponsor Recognition</h3>
          <p className="text-blue-700 text-sm">
            Sponsors contributing $40 or more (monetary donations or estimated item value) 
            will be featured with their business logo on our homepage and recognized at the tournament. 
            All contributions, regardless of amount, directly support Lucas's Eagle Scout cemetery restoration project.
          </p>
        </div>

        {/* Tab Interface */}
        <div className="flex space-x-1 mb-6 border-b">
          <button
            type="button"
            onClick={() => setSponsorType('business')}
            className={`pb-3 px-6 font-medium transition-colors ${
              sponsorType === 'business' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Business Sponsor
          </button>
          <button
            type="button"
            onClick={() => setSponsorType('individual')}
            className={`pb-3 px-6 font-medium transition-colors ${
              sponsorType === 'individual' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Individual Supporter
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSponsorSubmit}>
          {/* Form Content Based on Type */}
          {sponsorType === 'business' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  name="companyName"
                  required
                />
                <Input
                  label="Contact Person"
                  name="contactName"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  name="email"
                  type="email"
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>
              <Input
                label="Company Website"
                name="website"
                type="url"
                placeholder="https://"
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  name="individualName"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  error={validationErrors.contact}
                  helper="Either email or phone is required"
                />
              </div>
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="(XXX) XXX-XXXX"
                error={validationErrors.contact}
                helper="US format only. Either email or phone is required"
              />
              {validationErrors.contact && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{validationErrors.contact}</p>
                </div>
              )}
            </>
          )}

          {/* Donation Type Selection */}
          <div>
            <label className="text-base font-medium mb-3 block">Contribution Type*</label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="donationType"
                  value="monetary"
                  checked={donationType === 'monetary'}
                  onChange={(e) => setDonationType(e.target.value as 'monetary' | 'item')}
                  className="text-blue-600"
                />
                <span>Monetary Donation</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="donationType"
                  value="item"
                  checked={donationType === 'item'}
                  onChange={(e) => setDonationType(e.target.value as 'monetary' | 'item')}
                  className="text-blue-600"
                />
                <span>Item Donation</span>
              </label>
            </div>
          </div>

          {/* Conditional Fields Based on Donation Type */}
          {donationType === 'monetary' ? (
            <div>
              <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700 mb-2">Donation Amount*</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="donationAmount"
                  name="donationAmount"
                  type="number"
                  min="1"
                  className="pl-8"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-2">Item Description*</label>
                <textarea
                  id="itemDescription"
                  name="itemDescription"
                  required
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Describe the items you're donating (e.g., cases of water, Gatorade, prizes, etc.)"
                />
              </div>
              <div>
                <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-2">Estimated Value*</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="estimatedValue"
                    name="estimatedValue"
                    type="number"
                    min="1"
                    className="pl-8"
                    value={itemValue}
                    onChange={(e) => setItemValue(e.target.value)}
                    required
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Help us track total fundraising value. Estimates are fine!
                </p>
              </div>
            </>
          )}

          {/* Logo Upload (Conditional on $40+) */}
          {showLogoUpload && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label htmlFor="logo" className="text-blue-800 font-medium block mb-2">Upload Logo (Optional)</label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileChange}
              />
              <p className="text-sm text-blue-700 mt-2">
                Sponsors contributing $40+ will be featured with logo on our homepage! 
                Accepted formats: JPG, PNG, GIF (max 2MB)
              </p>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sponsorship Benefits
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Logo displayed on tournament website
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Recognition at tournament event
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Social media mentions and thank you posts
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Supporting a meaningful Eagle Scout project
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
            <p className="text-green-800 font-medium">
              Funds raised above our $400 goal will be donated to the Sons of American Revolution 
              to support their mission of preserving American history and honoring our founding fathers.
            </p>
          </div>

          {/* reCAPTCHA and Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Sponsorship Application'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};