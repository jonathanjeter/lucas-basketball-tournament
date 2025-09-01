import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Heart, Shield, Brush } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { addVolunteer } from '../lib/supabase';
import toast from 'react-hot-toast';

const volunteerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  phone: z.string().optional(),
  ageOrRank: z.string().optional(),
}).refine((data) => {
  const hasEmail = data.email && data.email !== '';
  const hasPhone = data.phone && data.phone.length >= 10;
  return hasEmail || hasPhone;
}, {
  message: 'Either email or phone number is required',
  path: ['email'],
}).refine((data) => {
  if (data.phone && data.phone !== '') {
    // US phone format validation: (XXX) XXX-XXXX or (XXX)-XXX-XXXX or XXX-XXX-XXXX
    const phoneRegex = /^(\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(data.phone);
  }
  return true;
}, {
  message: 'Phone must be in US format: (XXX) XXX-XXXX',
  path: ['phone'],
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

export const ProjectPage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerFormData) => {
    setLoading(true);
    try {
      const result = await addVolunteer({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        ageRank: data.ageOrRank || null
      });
      
      toast.success('Thank you for volunteering! We\'ll be in touch with project details.');
      reset();
    } catch (error: any) {
      console.error('Volunteer signup error:', error);
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const projectDetails = [
    {
      icon: Calendar,
      title: 'Project Date',
      description: 'Saturday, September 6, 2025'
    },
    {
      icon: MapPin,
      title: 'Location',
      description: 'Waxahachie Cemetery\n300 S Hawkins St, Waxahachie, TX 75165\nProject starts at 8:00 AM'
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'Sons of the American Revolution (SAR)'
    },
    {
      icon: Heart,
      title: 'Mission',
      description: 'Honor military veterans through cemetery restoration'
    }
  ];

  const fundingNeeds = [
    {
      icon: Brush,
      title: 'Biological Cleaning Solutions',
      description: 'Safe, non-damaging cleaners specifically designed for historic headstones'
    },
    {
      icon: Shield,
      title: 'Protective Equipment',
      description: 'Gloves, safety materials, and protective gear for all volunteers'
    },
    {
      icon: Users,
      title: 'Tools & Brushes',
      description: 'Specialized brushes and cleaning tools for different stone types'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
          <img 
            src="/media/Scouting_America_Eagle_Scout_Logo.webp" 
            alt="Eagle Scout Logo" 
            className="w-16 h-16 object-contain"
            onError={(e) => {
              // Fallback to Shield icon if logo not found
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling!.style.display = 'flex';
            }}
          />
          <div className="items-center justify-center w-16 h-16 bg-blue-100 rounded-full hidden">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
          Eagle Scout Service Project
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Supporting our community by honoring the memory of military veterans through 
          cemetery restoration and preservation efforts.
        </p>
      </motion.div>

      {/* Project Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Project Overview
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              This Eagle Scout service project is conducted in partnership with the 
              <strong> Sons of the American Revolution (SAR)</strong> to honor and preserve 
              the memory of military veterans. The Sons of the American Revolution is a patriotic 
              organization dedicated to perpetuating the memory of those who fought for American independence.
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mt-4">
              We are actively seeking volunteers to help with our cemetery restoration project! 
              Volunteers of all ages and backgrounds are welcome. No prior experience is needed – 
              we'll provide training and guidance on-site at Waxahachie Cemetery.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6 max-w-4xl mx-auto">
              <p className="text-green-800 font-medium">
                Funds raised above our $400 goal will be donated to the Sons of American Revolution 
                to support their mission of preserving American history and honoring our founding fathers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectDetails.map((detail, index) => (
              <motion.div
                key={detail.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                  <detail.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{detail.title}</h3>
                <p className="text-sm text-gray-600">{detail.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What We'll Accomplish
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                On Saturday, September 6, 2025, volunteers will gather at Waxahachie Cemetery 
                (300 S Hawkins St, Waxahachie, TX 75165) at 8:00 AM to participate in a meaningful 
                service project that honors our military veterans.
              </p>
              <p className="leading-relaxed">
                Using specialized, non-damaging cleaning techniques, we'll carefully restore 
                headstones that have been weathered by time and the elements. This work not 
                only preserves important historical markers but also ensures that the memory 
                of those who served our country continues to be honored for future generations.
              </p>
              <p className="leading-relaxed">
                We are actively seeking volunteers to help with this important project. The work 
                emphasizes respect, historical preservation, and community service while teaching 
                participants about proper cemetery restoration techniques.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How Tournament Funds Help
            </h2>
            <div className="space-y-6">
              {fundingNeeds.map((need, index) => (
                <div key={need.title} className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg flex-shrink-0">
                    <need.icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{need.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{need.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-800 text-sm font-medium">
                <strong>Goal:</strong> Raise $400 to purchase all necessary supplies and materials 
                for a successful restoration project.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Volunteer Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Join Us as a Volunteer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We welcome volunteers of all ages and backgrounds! No prior experience is needed – 
            we'll provide training and guidance on-site.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              What to Expect
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Training Provided:</strong> Learn proper headstone cleaning techniques from experienced volunteers</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>All Ages Welcome:</strong> Families, Scout groups, and individuals are encouraged to participate</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Meaningful Work:</strong> Directly contribute to honoring veterans and preserving history</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Community Service:</strong> Earn volunteer hours while making a real difference</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>What to Bring:</strong> Comfortable work clothes, water bottle, and a willingness to serve. 
                All cleaning supplies and protective equipment will be provided.<br/>
                <strong>When & Where:</strong> Saturday, September 6, 2025 at 8:00 AM<br/>
                Waxahachie Cemetery, 300 S Hawkins St, Waxahachie, TX 75165
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Volunteer Sign-Up
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                {...register('name')}
                error={errors.name?.message}
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email (required if no phone)"
                {...register('email')}
                error={errors.email?.message}
                helper="Either email or phone is required"
              />
              
              <Input
                label="Phone Number"
                type="tel"
                placeholder="(XXX) XXX-XXXX"
                {...register('phone')}
                error={errors.phone?.message}
                helper="US format only. Either email or phone is required"
              />
              
              <Input
                label="Age or Scout Rank (Optional)"
                placeholder="e.g., 16 years old, Eagle Scout, Adult Leader"
                {...register('ageOrRank')}
                helper="This helps us plan appropriate activities and group assignments"
              />

              <Button 
                type="submit" 
                loading={loading}
                className="w-full"
                size="lg"
              >
                Sign Up to Volunteer
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Questions about volunteering? Contact us at{' '}
                <a href="mailto:volunteer@3on3hoops.com" className="text-blue-600 hover:underline">
                  volunteer@3on3hoops.com
                </a>
              </p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="p-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Make a Difference in Your Community
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Whether you play in our tournament, sponsor our cause, or volunteer for the project, 
            you're helping honor our veterans and strengthen our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 text-lg"
            >
              <a href="/register">Register for Tournament</a>
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