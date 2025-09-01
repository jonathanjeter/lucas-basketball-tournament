import React from 'react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { Smartphone, CreditCard, DollarSign, QrCode } from 'lucide-react';

export const PaymentMethods: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Support Our Tournament
          </h2>
          <p className="text-xl text-gray-600">
            Make a donation using any of these convenient payment methods
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Venmo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Venmo</h3>
              <p className="text-gray-600 mb-4">@techjeter</p>
              <a
                href="https://venmo.com/techjeter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Open Venmo
              </a>
            </Card>
          </motion.div>

          {/* PayPal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PayPal</h3>
              <p className="text-gray-600 mb-4">paypal.me/LucasJeter</p>
              <a
                href="https://paypal.me/LucasJeter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Pay with PayPal
              </a>
            </Card>
          </motion.div>

          {/* Zelle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zelle</h3>
              <p className="text-gray-600 mb-4">your-email@example.com</p>
              <p className="text-sm text-gray-500">
                Use your banking app to send via Zelle
              </p>
            </Card>
          </motion.div>

          {/* CashApp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cash App</h3>
              <p className="text-gray-600 mb-4">$LucasBasketball</p>
              <a
                href="https://cash.app/$LucasBasketball"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Open Cash App
              </a>
            </Card>
          </motion.div>
        </div>

        {/* Alternative: QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="p-8 bg-blue-50 border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Donate with QR Code
            </h3>
            <div className="flex justify-center mb-4">
              {/* Replace with actual QR code image */}
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
                <QrCode className="w-12 h-12 text-gray-500" />
              </div>
            </div>
            <p className="text-gray-600">
              Scan with your phone camera to donate via Venmo
            </p>
          </Card>
        </motion.div>

        {/* Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-6 bg-green-50 border border-green-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fundraising Goal: $400
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: '75%' }}
                ></div>
              </div>
              <p className="text-green-700">
                <strong>$300 raised</strong> • $100 remaining
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Supporting Lucas's Eagle Scout cemetery restoration project
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};