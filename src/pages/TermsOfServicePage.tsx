import React from 'react';
import { Card } from '../components/ui/Card';
import { FileText, Shield, AlertTriangle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Terms and conditions for participation in Lucas's Eagle Scout 3-on-3 Basketball Tournament
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Last Updated: August 27, 2025
        </p>
      </motion.div>

      <Card className="p-8 mb-8">
        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 mb-4">
            By registering for, participating in, or supporting the 3-on-3 Basketball Tournament organized by 
            Lucas Jeter as part of his Eagle Scout project, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not participate in the tournament.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Tournament Overview</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Trophy className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">Eagle Scout Fundraising Project</h4>
                <p className="text-orange-800 text-sm">
                  This tournament is organized as part of an Eagle Scout service project to raise funds for 
                  cemetery restoration in partnership with the Sons of American Revolution.
                </p>
              </div>
            </div>
          </div>

          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Date:</strong> August 30, 2025</li>
            <li><strong>Location:</strong> Finley Junior High School Gym, 2401 Brown St, Waxahachie, TX 75165</li>
            <li><strong>Time:</strong> Check-in 7:30 AM, Games begin 8:00 AM</li>
            <li><strong>Organizing Entity:</strong> BSA Troop 232 / Lucas Jeter Eagle Scout Project</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Registration & Participation</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Eligibility</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Tournament is open to players in 6th grade through adult</li>
            <li>Teams are divided into Junior (6th-8th grade) and Senior (9th-Adult) divisions</li>
            <li>Parent/guardian consent required for all minors under 18</li>
            <li>All players must complete liability waiver and BSA guidelines agreement</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Process</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Registration subject to review and approval by tournament organizers</li>
            <li>Team assignments and divisions determined by tournament director</li>
            <li>Registration may be limited by facility capacity</li>
            <li>Changes to registration must be requested at least 24 hours before tournament</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Payment & Donations</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">No One Excluded for Financial Reasons</h4>
                <p className="text-green-800 text-sm">
                  While we suggest a $10 per player donation to support our Eagle Scout project, 
                  financial hardship will never prevent participation.
                </p>
              </div>
            </div>
          </div>

          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Suggested donation: $10 per player (optional)</li>
            <li>All payments collected at tournament check-in</li>
            <li>Donations are voluntary and support cemetery restoration project</li>
            <li>No refunds for donations (all funds go to Eagle Scout project)</li>
            <li>Payment options: cash, check, or other arrangements at tournament</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Tournament Rules & Conduct</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Game Rules</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Standard 3-on-3 basketball rules apply</li>
            <li>Game duration and scoring determined by tournament format</li>
            <li>Referees' decisions are final</li>
            <li>Tournament director reserves right to modify rules for safety or fairness</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Conduct Expectations</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>All participants must follow BSA values: trustworthy, loyal, helpful, friendly, courteous, kind</li>
            <li>Good sportsmanship required from all players, coaches, and spectators</li>
            <li>Inappropriate conduct may result in disqualification</li>
            <li>Zero tolerance for harassment, discrimination, or unsafe behavior</li>
            <li>School facility rules must be observed at all times</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Safety & Liability</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Assumption of Risk</h4>
                <p className="text-red-800 text-sm">
                  Basketball is a physical sport with inherent risks. All participants acknowledge 
                  and assume responsibility for potential injuries.
                </p>
              </div>
            </div>
          </div>

          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Liability waiver required for all participants</li>
            <li>Emergency contact information must be provided</li>
            <li>First aid available on site, but participants responsible for medical costs</li>
            <li>Tournament may be cancelled or postponed for safety reasons</li>
            <li>Participants must follow all safety guidelines and facility rules</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">BSA Compliance</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Tournament operates under BSA Troop 232 guidelines</li>
            <li>BSA Youth Protection policies apply to all interactions with minors</li>
            <li>All adult volunteers have completed BSA training requirements</li>
            <li>Two-deep leadership maintained for all youth activities</li>
            <li>Reporting requirements followed for any incidents</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Sponsorship & Recognition</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Sponsor logos displayed on website and tournament materials</li>
            <li>Recognition provided at tournament and on social media</li>
            <li>Sponsors may not use participation for commercial gain beyond agreed recognition</li>
            <li>Tournament organizers retain right to refuse inappropriate sponsorships</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Cancellation & Changes</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Tournament organizers reserve right to cancel due to weather, safety, or other circumstances</li>
            <li>Participants will be notified of changes via registered email addresses</li>
            <li>No refunds for voluntary donations in case of cancellation</li>
            <li>Makeup dates may be arranged if possible</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Privacy & Data Use</h2>
          <p className="text-gray-700 mb-4">
            All personal information is handled according to our Privacy Policy. Registration information 
            may be used for tournament organization, BSA project documentation, and emergency contact purposes. 
            Photos and videos may be taken during the tournament for project documentation and recognition purposes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            Participation is voluntary and at your own risk. BSA Troop 232, Lucas Jeter, tournament organizers, 
            volunteers, and the school facility are not liable for injuries, property damage, or other losses 
            incurred during participation. This limitation applies to the fullest extent permitted by law.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Modifications to Terms</h2>
          <p className="text-gray-700 mb-4">
            These terms may be updated to reflect changes in tournament organization or legal requirements. 
            Significant changes will be communicated to registered participants. Continued participation 
            after changes indicates acceptance of modified terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Contact Information</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 mb-2">
              <strong>Questions about these terms or the tournament:</strong>
            </p>
            <div className="space-y-1 text-blue-800">
              <p>Email: <a href="mailto:tournament@lucasjeter.com" className="hover:underline">tournament@lucasjeter.com</a></p>
              <p>Phone: <a href="tel:+1234567890" className="hover:underline">(123) 456-7890</a></p>
              <p className="text-sm">Lucas Jeter - Eagle Scout Candidate, BSA Troop 232</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};