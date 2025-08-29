import React from 'react';
import { Heart, Shield, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo & Mission */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg mr-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold">3-on-3 Hoops</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Supporting Lucas's Eagle Scout cemetery restoration project through 
              community basketball tournament fundraising.
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-sm text-gray-300">Serving Our Community</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-sm text-gray-300">BSA Troop 232</span>
              </div>
              <a 
                href="https://troop232.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
              >
                Visit troop232.org
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Home
              </a>
              <a href="/register" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Register for Tournament
              </a>
              <a href="/project" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Eagle Scout Project
              </a>
              <a href="/sponsors" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Become a Sponsor
              </a>
              <a href="/brackets" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Tournament Brackets
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Contact Us
              </a>
            </nav>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Policies</h4>
            <nav className="space-y-2">
              <a href="/privacy-policy" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="/donation-policy" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Donation Policy
              </a>
              <a href="/liability-waiver" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Liability Waiver
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Contact & Support
              </a>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-orange-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">General Inquiries:</p>
                  <a 
                    href="mailto:lucas@thejeters.com" 
                    className="text-sm text-white hover:text-orange-300 transition-colors"
                  >
                    lucas@thejeters.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-orange-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Phone Support:</p>
                  <a 
                    href="tel:+1234567890" 
                    className="text-sm text-white hover:text-orange-300 transition-colors"
                  >
                    (123) 456-7890
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-orange-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Tournament Location:</p>
                  <p className="text-sm text-white">
                    Finley Junior High School Gym<br />
                    2401 Brown St, Waxahachie, TX 75165
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-400">
                © {currentYear} 3-on-3 Hoops Tournament. All rights reserved.
              </p>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Eagle Scout Service Project - BSA Troop 232</span>
                </div>
                <p className="text-xs text-gray-500">
                  This fundraiser has been approved by BSA and operates under Youth Protection guidelines.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-xs text-gray-400">
                Fundraising Goal: $400
              </p>
              <div className="w-16 h-2 bg-gray-800 rounded-full">
                <div className="w-0 h-2 bg-orange-500 rounded-full transition-all duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};