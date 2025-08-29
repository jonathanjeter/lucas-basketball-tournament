import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const LiabilityWaiverPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Shield className="h-16 w-16 mx-auto mb-6 text-orange-500" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Liability Waiver & Release
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          3-on-3 Basketball Tournament - BSA Eagle Scout Fundraiser
        </p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 rounded-lg">
          <Shield className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm text-blue-800 font-medium">BSA Troop 232 - Waxahachie, TX</span>
        </div>
      </motion.div>

      <Card className="p-8 mb-8">
        <div className="flex items-start mb-6">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Important Safety Information
            </h2>
            <p className="text-gray-600">
              Please read this liability waiver carefully before participating in the tournament. 
              This document affects your legal rights and must be agreed to by all participants.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Event:</strong> 3-on-3 Basketball Tournament</p>
                <p><strong>Date:</strong> Saturday, August 30, 2025</p>
                <p><strong>Time:</strong> 8:00 AM - 12:00 PM</p>
              </div>
              <div>
                <p><strong>Location:</strong> Finley Junior High School Gym</p>
                <p><strong>Address:</strong> 2401 Brown St, Waxahachie, TX 75165</p>
                <p><strong>Organizer:</strong> BSA Troop 232 Eagle Scout Project</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assumption of Risk</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              I understand that participation in basketball activities involves inherent risks including, but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Physical injury from contact with other players</li>
              <li>Falls, collisions, and impacts</li>
              <li>Strains, sprains, and other physical injuries</li>
              <li>Equipment-related injuries</li>
              <li>Injuries resulting from facility conditions</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              I voluntarily assume all risks associated with participation in this basketball tournament.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Release and Waiver</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              In consideration of being allowed to participate in the 3-on-3 Basketball Tournament, 
              I hereby release, waive, discharge, and covenant not to sue:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Boy Scouts of America Troop 232</li>
              <li>Tournament organizers and volunteers</li>
              <li>Finley Junior High School and Waxahachie ISD</li>
              <li>All sponsors and supporting organizations</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              From any and all liability, claims, demands, or causes of action arising from my 
              participation in this basketball tournament, including those resulting from negligence.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Emergency Authorization</h3>
            <p className="text-gray-700 leading-relaxed">
              I authorize tournament officials to secure emergency medical treatment for me/my child 
              if necessary during the event. I understand that I am responsible for all medical costs 
              incurred. I confirm that I have adequate medical insurance coverage for participation in this event.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">BSA Youth Protection Policy</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              This event operates under Boy Scouts of America Youth Protection guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>All adult volunteers have completed Youth Protection Training</li>
              <li>Appropriate supervision ratios will be maintained</li>
              <li>Two-deep leadership is required for all activities</li>
              <li>Background checks have been completed for all adult leaders</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Parental/Guardian Consent (Under 18)</h3>
            <p className="text-gray-700 leading-relaxed">
              For participants under 18 years of age: As parent/legal guardian, I give permission 
              for my child to participate in this tournament. I have read and understood this waiver 
              and agree to its terms on behalf of my child. I understand that my child must follow 
              all tournament rules and adult supervision instructions.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photography and Media Release</h3>
            <p className="text-gray-700 leading-relaxed">
              I consent to the use of photographs, videos, and other media taken during the tournament 
              for promotional purposes by BSA Troop 232, tournament organizers, and sponsors. 
              No compensation will be provided for such use.
            </p>
          </section>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <Heart className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Eagle Scout Project Information
            </h3>
            <p className="text-blue-800 leading-relaxed mb-4">
              This tournament is organized as part of an Eagle Scout service project to raise funds 
              for cemetery restoration work honoring military veterans. The project is conducted in 
              partnership with the Sons of the American Revolution and has been approved by both 
              BSA leadership and local authorities.
            </p>
            <div className="text-sm text-blue-700">
              <p><strong>Project Leader:</strong> Lucas Jeter, Eagle Scout Candidate</p>
              <p><strong>Troop:</strong> BSA Troop 232, Waxahachie, Texas</p>
              <p><strong>Project Beneficiary:</strong> Waxahachie Cemetery Restoration</p>
              <p><strong>Contact:</strong> lucas@thejeters.com | <a href="https://troop232.org" className="underline">troop232.org</a></p>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">
          By registering for the tournament, you acknowledge that you have read, understood, 
          and agree to be bound by this liability waiver and release.
        </p>
        <p className="text-sm text-gray-500">
          Last updated: January 2025 | Questions? Contact lucas@thejeters.com
        </p>
      </div>
    </div>
  );
};