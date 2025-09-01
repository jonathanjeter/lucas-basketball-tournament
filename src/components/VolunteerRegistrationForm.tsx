import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { Heart, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateEmail, validateUSPhone } from '../utils/validation';
import { sendVolunteerEmails } from '../lib/email';

export const VolunteerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ageOrRank: '',
    skills: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    // Require at least email or phone
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact = 'Please provide either email or phone number';
    } else {
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (formData.phone && !validateUSPhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid US phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Insert volunteer data
      const volunteerData = {
        volunteer_name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        age_or_rank: formData.ageOrRank.trim() || null,
        dates_available: 'Saturday September 6, 2025 - Cemetery Headstone Restoration Project',
        skills: formData.skills.trim() || null,
        transportation: 'To be confirmed',
        questions: formData.notes.trim() || null,
        role_preference: null
      };
      
      const { error: dbError } = await supabase.from('volunteers').insert([volunteerData]);
      
      if (dbError) throw dbError;
      
      // Send confirmation emails
      try {
        await sendVolunteerEmails({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          ageRank: formData.ageOrRank.trim()
        });
      } catch (emailError) {
        console.warn('Failed to send confirmation emails:', emailError);
        // Don't fail the registration if email fails
      }
      
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error registering volunteer:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-100" />
              <h3 className="text-2xl font-bold mb-4">Thank You for Volunteering! 🎉</h3>
              <div className="text-lg mb-6">
                <p className="mb-2">Your volunteer registration has been received!</p>
                <p className="text-green-100">
                  {formData.email 
                    ? 'A confirmation email has been sent with project details.'
                    : 'You\'ll receive a call/text with project details soon.'
                  }
                </p>
              </div>
              <div className="bg-green-600/30 rounded-lg p-4 inline-block text-left">
                <div className="font-semibold mb-2">📅 Project Details Reminder:</div>
                <div className="text-sm space-y-1">
                  <div>• Saturday, September 6, 2025</div>
                  <div>• 7:30 AM - 12:00 PM</div>
                  <div>• Pioneer Cemetery, Waxahachie, TX</div>
                  <div>• Equipment and training provided</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <AlertCircle className="h-8 w-8 text-red-500 animate-pulse" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  VOLUNTEER REGISTRATION
                </h2>
                <AlertCircle className="h-8 w-8 text-red-500 animate-pulse" />
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold">
                  🚨 URGENT: Only 1 volunteer signed up - Need 7-9 MORE!
                </p>
                <p className="text-red-700 text-sm mt-1">
                  Cemetery project is THIS SATURDAY, September 6, 2025
                </p>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join Lucas's Eagle Scout project to preserve local history. No experience needed - 
                all equipment and training provided by the Sons of American Revolution.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`text-lg ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`text-lg ${errors.email || errors.contact ? 'border-red-500' : ''}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`text-lg ${errors.phone || errors.contact ? 'border-red-500' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {errors.contact && (
                <p className="text-red-500 text-sm -mt-3">{errors.contact}</p>
              )}

              {/* Age/Rank */}
              <div>
                <label htmlFor="ageOrRank" className="block text-sm font-medium text-gray-700 mb-2">
                  Age or Scout Rank (Optional)
                </label>
                <Input
                  id="ageOrRank"
                  type="text"
                  value={formData.ageOrRank}
                  onChange={(e) => setFormData({...formData, ageOrRank: e.target.value})}
                  className="text-lg"
                  placeholder="e.g., 16, Eagle Scout, Adult"
                />
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                  Skills or Experience (Optional)
                </label>
                <textarea
                  id="skills"
                  rows={3}
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any relevant skills, tools, or experience you can bring..."
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Questions or Comments (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any questions about the project or special accommodations needed..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                {errors.submit && (
                  <p className="text-red-500 text-center mb-4">{errors.submit}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 min-h-[56px]"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2" />
                      REGISTER TO VOLUNTEER
                    </>
                  )}
                </Button>
              </div>

              {/* Project Info */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Project Details</h4>
                    <div className="text-blue-800 text-sm space-y-1">
                      <div>📅 <strong>Date:</strong> Saturday, September 6, 2025</div>
                      <div>🕢 <strong>Time:</strong> 7:30 AM - 12:00 PM (4.5 hours)</div>
                      <div>📍 <strong>Location:</strong> Pioneer Cemetery, Waxahachie, TX</div>
                      <div>🛠️ <strong>Work:</strong> Headstone restoration with SAR training</div>
                      <div>👥 <strong>Ages:</strong> All welcome (minors with supervision)</div>
                      <div>🎒 <strong>Bring:</strong> Water, work gloves, work clothes</div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};