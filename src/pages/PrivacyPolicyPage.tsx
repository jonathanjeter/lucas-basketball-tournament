import React from 'react';
import { Card } from '../components/ui/Card';
import { Shield, Lock, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Shield className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          How we collect, use, and protect your personal information for Lucas's Eagle Scout Basketball Tournament
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Last Updated: August 27, 2025
        </p>
      </motion.div>

      <Card className="p-8 mb-8">
        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">BSA Compliance & Youth Protection</h2>
          <p className="text-gray-700 mb-4">
            This tournament operates under the guidelines of Boy Scouts of America (BSA) Troop 232 and adheres to 
            BSA Youth Protection policies. We are committed to protecting the privacy and safety of all participants, 
            especially youth under 18.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Information We Collect</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tournament Registration</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Player names and contact information</li>
            <li>Grade level and age category for division assignment</li>
            <li>Emergency contact information</li>
            <li>Parent/guardian consent for minors</li>
            <li>Liability waiver agreements</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sponsorship Information</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Business or individual sponsor name</li>
            <li>Contact email for communication</li>
            <li>Optional website URL for recognition</li>
            <li>Logo files for display purposes</li>
            <li>Donation amounts and payment preferences</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Volunteer Information</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Name and contact information</li>
            <li>Availability and role preferences</li>
            <li>BSA membership status (if applicable)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Tournament organization and team management</li>
            <li>Emergency contact during the event</li>
            <li>Sponsor recognition and acknowledgment</li>
            <li>Eagle Scout project documentation and reporting</li>
            <li>Communication about tournament updates</li>
            <li>Compliance with BSA reporting requirements</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Information Sharing & Protection</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">We Do NOT Share Personal Information</h4>
                <p className="text-green-800 text-sm">
                  Your personal information is never sold, shared with third parties, or used for commercial purposes 
                  outside of this Eagle Scout project.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Limited Sharing for Project Purposes</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>BSA Troop 232 leadership for project oversight</li>
            <li>School facility coordinators for safety compliance</li>
            <li>Eagle Scout Board of Review for project documentation</li>
            <li>Parent/guardian emergency contacts as needed</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Data Security & Storage</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Information stored securely using encrypted cloud services</li>
            <li>Access limited to tournament organizers and BSA adult leaders</li>
            <li>Regular backups to prevent data loss</li>
            <li>Data retained only as long as necessary for project completion</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Your Rights</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Request access to your personal information</li>
            <li>Request corrections to inaccurate information</li>
            <li>Request deletion of your information (after tournament completion)</li>
            <li>Withdraw consent for non-essential communications</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Minors' Privacy</h2>
          <p className="text-gray-700 mb-4">
            Special care is taken with information from participants under 18. All interactions with minors 
            follow BSA Youth Protection guidelines. Parent/guardian consent is required for all data collection 
            and use involving minors.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Contact Information</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 mb-2">
              <strong>For privacy concerns or questions about your information:</strong>
            </p>
            <div className="space-y-2 text-blue-800">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:tournament@lucasjeter.com" className="hover:underline">
                  tournament@lucasjeter.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+1234567890" className="hover:underline">
                  (123) 456-7890
                </a>
              </div>
              <p className="text-sm">
                Lucas Jeter - Eagle Scout Candidate, BSA Troop 232
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Policy Updates</h2>
          <p className="text-gray-700">
            This privacy policy may be updated to reflect changes in our practices or legal requirements. 
            Any significant changes will be communicated to registered participants via email. The "Last Updated" 
            date at the top of this page indicates when the policy was last revised.
          </p>
        </div>
      </Card>
    </div>
  );
};