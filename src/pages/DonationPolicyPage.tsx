import React from 'react';
import { Card } from '../components/ui/Card';
import { Heart, DollarSign, Gift, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const DonationPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Heart className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Donation Policy
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Guidelines for donations supporting Lucas's Eagle Scout Cemetery Restoration Project
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Last Updated: August 27, 2025
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Project Overview */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Eagle Scout Service Project</h2>
            <p className="text-gray-700 text-lg">
              This fundraising tournament supports a meaningful community service project to restore and 
              maintain military veteran headstones at local cemeteries in partnership with the Sons of American Revolution.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Goal Amount</h4>
              <p className="text-2xl font-bold text-blue-600">$400</p>
              <p className="text-sm text-blue-700">For cleaning supplies & materials</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Project Scope</h4>
              <p className="text-green-800">Cemetery restoration & veteran headstone cleaning</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900">BSA Compliance</h4>
              <p className="text-orange-800">Operated under Troop 232 guidelines</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6">
            <p className="text-green-800 font-medium">
              Funds raised above our $400 goal will be donated to the Sons of American Revolution 
              to support their mission of preserving American history and honoring our founding fathers.
            </p>
          </div>
        </Card>

        {/* Donation Guidelines */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Donation Guidelines</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <Heart className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Core Principle: Inclusivity First</h3>
                <p className="text-green-800">
                  <strong>No one is excluded for financial reasons.</strong> While donations help us reach our project goal, 
                  participation in the tournament is never dependent on ability to pay. We welcome all community members 
                  regardless of financial circumstances.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 text-orange-500 mr-2" />
                Tournament Participants
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Suggested:</strong> $20 per player</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Custom amount:</strong> Any amount you choose</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Pay later:</strong> Decide at tournament</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>No payment:</strong> Participate without donation</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Gift className="h-5 w-5 text-purple-500 mr-2" />
                Individual Supporters & Sponsors
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Any amount welcome:</strong> Every contribution helps</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>$40+ recognition:</strong> Website listing & thanks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Business sponsors:</strong> Logo display & links</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Item donations:</strong> Gift cards, prizes, supplies</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Payment & Processing */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment & Processing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tournament Day Collection</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• All donations collected at tournament check-in</li>
                <li>• Cash, check, or other arrangements accepted</li>
                <li>• Receipts provided for all donations</li>
                <li>• No advance online payment required</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sponsor Processing</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Business checks preferred for records</li>
                <li>• Logo files collected with registration</li>
                <li>• Recognition begins immediately upon approval</li>
                <li>• Item donations scheduled for pickup</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Fund Management */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fund Management & Accountability</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">BSA Oversight & Transparency</h3>
            <p className="text-blue-800">
              All funds are managed under BSA Troop 232 supervision with adult leadership oversight. 
              Financial records are maintained for Eagle Scout Board of Review and project documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fund Use</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Cemetery cleaning supplies and materials</li>
                <li>• Tools for headstone restoration work</li>
                <li>• Transportation to project sites</li>
                <li>• Documentation and project reporting</li>
                <li>• Any excess donated to Sons of American Revolution</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Accountability</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Detailed receipts and records kept</li>
                <li>• Adult leader financial oversight</li>
                <li>• Regular project updates provided</li>
                <li>• Final report to Eagle Board of Review</li>
                <li>• Community project outcome sharing</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Refund Policy */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Refund & Cancellation Policy</h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">General Policy</h3>
              <p className="text-yellow-800">
                <strong>Donations are generally non-refundable</strong> as they directly support the Eagle Scout service project. 
                All funds raised go toward the cemetery restoration work and associated project costs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Circumstances</h3>
              <p className="text-gray-700 mb-3">Refunds may be considered in exceptional cases:</p>
              <ul className="space-y-1 text-gray-700 list-disc list-inside">
                <li>Tournament cancelled and cannot be rescheduled</li>
                <li>Medical emergency preventing participation</li>
                <li>Family financial hardship after donation made</li>
                <li>Processing errors or duplicate charges</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Process</h3>
              <ul className="space-y-1 text-gray-700 list-disc list-inside">
                <li>Contact tournament organizers with specific circumstances</li>
                <li>Request reviewed by adult BSA leadership</li>
                <li>Decision made within 48 hours when possible</li>
                <li>Refunds processed within 5-7 business days if approved</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Recognition & Thanks */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recognition & Appreciation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Public Recognition</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Tournament website sponsor display</li>
                <li>• Social media acknowledgments</li>
                <li>• Tournament day announcements</li>
                <li>• Eagle Scout project documentation</li>
                <li>• Community newsletter mentions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Thanks</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Individual thank you emails</li>
                <li>• Project completion updates</li>
                <li>• Photos of restored cemetery work</li>
                <li>• Eagle Scout Court of Honor invitations</li>
                <li>• Lasting gratitude for supporting Scouting</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions About Donations?</h2>
          <p className="text-gray-700 mb-4">
            We're here to help! If you have questions about donations, payments, or our Eagle Scout project, 
            please don't hesitate to reach out.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:tournament@lucasjeter.com?subject=Donation Question - Basketball Tournament"
              className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Email Us About Donations
            </a>
            <a 
              href="tel:+1234567890"
              className="inline-flex items-center justify-center border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
            >
              Call: (123) 456-7890
            </a>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Lucas Jeter - Eagle Scout Candidate</p>
            <p>BSA Troop 232 - Waxahachie, Texas</p>
          </div>
        </Card>
      </div>
    </div>
  );
};