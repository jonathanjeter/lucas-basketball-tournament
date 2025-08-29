import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Users, Gift, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { addContactInquiry } from '../lib/supabase';
import toast from 'react-hot-toast';

type InquiryType = 'general' | 'tournament' | 'sponsorship' | 'volunteering';

const baseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
});

const generalSchema = baseSchema.extend({
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const tournamentSchema = baseSchema.extend({
  phone: z.string().optional(),
  registrationType: z.enum(['team', 'individual']),
  playerCount: z.number().min(1).max(20),
  ageDivision: z.enum(['middle-school', 'high-school-adult']),
  questions: z.string().min(1, 'Please describe your questions'),
});

const sponsorshipSchema = baseSchema.extend({
  company: z.string().optional(), // Made optional for individual supporters
  phone: z.string().min(1, 'Phone number is required'),
  donationType: z.enum(['monetary', 'items']),
  amount: z.number().min(20).optional(), // Changed from 40 to 20 for individual supporters
  itemDescription: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  questions: z.string().optional(),
}).refine((data) => {
  if (data.donationType === 'monetary') {
    // Individual supporters: $20 minimum, Business sponsors: $40 minimum
    const minimumAmount = data.company && data.company.trim() ? 40 : 20;
    if (!data.amount || data.amount < minimumAmount) {
      return false;
    }
  }
  if (data.donationType === 'items' && !data.itemDescription) {
    return false;
  }
  return true;
}, {
  message: 'Please provide required donation details',
  path: ['donationType'],
});

const volunteeringSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  ageRank: z.string().min(1, 'Age/Scout rank is required'),
  datesAvailable: z.string().min(1, 'Available dates are required'),
  skills: z.string().optional(),
  transportation: z.enum(['yes', 'no', 'sometimes']),
  questions: z.string().optional(),
}).refine((data) => {
  return data.email || data.phone;
}, {
  message: 'Either email or phone is required',
  path: ['email'],
});

type FormData = z.infer<typeof generalSchema> | 
                z.infer<typeof tournamentSchema> | 
                z.infer<typeof sponsorshipSchema> | 
                z.infer<typeof volunteeringSchema>;

export const ContactPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<InquiryType>('general');
  const [loading, setLoading] = React.useState(false);

  const getSchema = (type: InquiryType) => {
    switch (type) {
      case 'general': return generalSchema;
      case 'tournament': return tournamentSchema;
      case 'sponsorship': return sponsorshipSchema;
      case 'volunteering': return volunteeringSchema;
    }
  };

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(getSchema(activeTab)),
  });

  React.useEffect(() => {
    reset();
  }, [activeTab, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      // Map form data to database format
      const inquiryData = {
        inquiryType: activeTab,
        name: data.name,
        email: data.email,
        phone: (data as any).phone || null,
        organization: (data as any).company || null,
        message: (data as any).message || (data as any).questions || 'No message provided',
        sponsorshipType: activeTab === 'sponsorship' ? (data as any).donationType : null,
        volunteerExperience: activeTab === 'volunteering' ? (data as any).skills : null
      };

      const result = await addContactInquiry(inquiryData);
      
      // Generate confirmation message with inquiry ID
      const confirmationMessages = {
        general: `Thank you for contacting us! Your inquiry ID is ${result.data.inquiryId}. We'll respond within 1-2 business days.`,
        tournament: `Thank you for your tournament inquiry! Your inquiry ID is ${result.data.inquiryId}. We'll contact you with registration details.`,
        sponsorship: `Thank you for your sponsorship interest! Your inquiry ID is ${result.data.inquiryId}. We'll review your information and contact you within 2 business days.`,
        volunteering: `Thank you for volunteering! Your inquiry ID is ${result.data.inquiryId}. We'll contact you with project details and schedule information.`
      };
      
      toast.success(confirmationMessages[activeTab]);
      reset();
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error(error.message || 'Failed to send message. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general' as InquiryType, name: 'General', icon: MessageSquare },
    { id: 'tournament' as InquiryType, name: 'Tournament', icon: Users },
    { id: 'sponsorship' as InquiryType, name: 'Sponsorship', icon: Gift },
    { id: 'volunteering' as InquiryType, name: 'Volunteering', icon: Heart },
  ];

  const donationType = watch('donationType' as any);
  const company = watch('company' as any);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600">
          Have questions about the tournament, want to sponsor, or volunteer? We'd love to hear from you!
        </p>
      </motion.div>

      <Card className="p-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white border-b-2 border-orange-500'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Inquiry Form */}
          {activeTab === 'general' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  {...register('name')}
                  error={errors.name?.message}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
              </div>
              <Input
                label="Phone (Optional)"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <Input
                label="Subject"
                {...register('subject')}
                error={errors.subject?.message}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>
            </>
          )}

          {/* Tournament Inquiry Form */}
          {activeTab === 'tournament' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  {...register('name')}
                  error={errors.name?.message}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
              </div>
              <Input
                label="Phone (Optional)"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type *</label>
                  <select
                    {...register('registrationType')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="individual">Individual Player</option>
                    <option value="team">Full Team</option>
                  </select>
                </div>
                <Input
                  label="Number of Players"
                  type="number"
                  min="1"
                  max="20"
                  {...register('playerCount', { valueAsNumber: true })}
                  error={errors.playerCount?.message}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Division *</label>
                  <select
                    {...register('ageDivision')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select division</option>
                    <option value="middle-school">Middle School</option>
                    <option value="high-school-adult">High School/Adult</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Questions/Comments *
                </label>
                <textarea
                  {...register('questions')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Please describe what you'd like to know about the tournament..."
                  required
                />
                {errors.questions && (
                  <p className="mt-1 text-sm text-red-600">{errors.questions.message}</p>
                )}
              </div>
            </>
          )}

          {/* Sponsorship Inquiry Form */}
          {activeTab === 'sponsorship' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company/Organization Name (Optional for Individuals)"
                  {...register('company')}
                  error={errors.company?.message}
                  helper="Leave blank if donating as an individual"
                />
                <Input
                  label="Contact Name"
                  {...register('name')}
                  error={errors.name?.message}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="monetary"
                      {...register('donationType')}
                      className="mr-2"
                      required
                    />
                    Monetary Donation
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="items"
                      {...register('donationType')}
                      className="mr-2"
                      required
                    />
                    Item Donation
                  </label>
                </div>
              </div>
              {donationType === 'monetary' && (
                <Input
                  label="Donation Amount"
                  type="number"
                  min={company && company.trim() ? "40" : "20"}
                  {...register('amount', { valueAsNumber: true })}
                  error={errors.amount?.message}
                  helper={company && company.trim() ? "Minimum $40 for business sponsors (logo display)" : "Minimum $20 for individual supporters"}
                  required
                />
              )}
              {donationType === 'items' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Description & Estimated Value *
                  </label>
                  <textarea
                    {...register('itemDescription')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe the items you'd like to donate and their estimated value..."
                    required={donationType === 'items'}
                  />
                  {errors.itemDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.itemDescription.message}</p>
                  )}
                </div>
              )}
              <Input
                label="Website (Optional)"
                type="url"
                {...register('website')}
                error={errors.website?.message}
                placeholder="https://yourwebsite.com"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Questions
                </label>
                <textarea
                  {...register('questions')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Any specific questions about sponsorship opportunities..."
                />
              </div>
            </>
          )}

          {/* Volunteering Inquiry Form */}
          {activeTab === 'volunteering' && (
            <>
              <Input
                label="Name"
                {...register('name')}
                error={errors.name?.message}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  helper="Either email or phone is required"
                />
                <Input
                  label="Phone"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                  helper="Either email or phone is required"
                />
              </div>
              <Input
                label="Age/Scout Rank"
                {...register('ageRank')}
                error={errors.ageRank?.message}
                placeholder="e.g., Adult, Eagle Scout, Life Scout, etc."
                required
              />
              <Input
                label="Dates Available"
                {...register('datesAvailable')}
                error={errors.datesAvailable?.message}
                placeholder="e.g., Weekends, August 25-30, etc."
                required
              />
              <Input
                label="Skills/Experience (Optional)"
                {...register('skills')}
                placeholder="e.g., Cemetery restoration, landscaping, organization, etc."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transportation *</label>
                <select
                  {...register('transportation')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">I have reliable transportation</option>
                  <option value="no">I need transportation assistance</option>
                  <option value="sometimes">Sometimes available</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Questions/Comments
                </label>
                <textarea
                  {...register('questions')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Any questions about the project or volunteer opportunities..."
                />
              </div>
            </>
          )}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Send Message
          </Button>
        </form>
      </Card>

      {/* Contact Information */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-6 w-6 text-orange-500" />
            <h3 className="text-lg font-semibold">Email Us</h3>
          </div>
          <p className="text-gray-600 mb-2">General inquiries:</p>
          <a href="mailto:lucas@thejeters.com" className="text-orange-500 hover:underline">
            lucas@thejeters.com
          </a>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="h-6 w-6 text-orange-500" />
            <h3 className="text-lg font-semibold">Call Us</h3>
          </div>
          <p className="text-gray-600 mb-2">For urgent matters:</p>
          <a href="tel:+1234567890" className="text-orange-500 hover:underline">
            (123) 456-7890
          </a>
        </Card>
      </div>
    </div>
  );
};