import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBasket as Basketball, Menu, X, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { environmentInfo } from '../lib/supabase';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Eagle Scout Project', href: '/project' },
    { name: 'Register', href: '/register' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Brackets', href: '/brackets' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <Basketball className="h-8 w-8 text-orange-500" />
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">3-on-3 Hoops</h1>
                {/* Environment Indicator - Only show in staging mode */}
                {(() => {
                  console.log('🔍 [Header] Environment debug:', {
                    'VITE_STAGING_MODE': import.meta.env.VITE_STAGING_MODE,
                    'environmentInfo.isStaging': environmentInfo.isStaging,
                    'environmentInfo.environment': environmentInfo.environment
                  });
                  return environmentInfo.isStaging;
                })() && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                    <Database className="w-3 h-3 mr-1" />
                    STAGING
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">Eagle Scout Fundraiser</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-base font-medium hover:bg-blue-700 transition-colors w-fit"
              >
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};