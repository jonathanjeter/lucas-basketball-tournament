import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { 
  sendParticipantConfirmation, 
  sendAdminNotification,
  buildParticipantEmailData,
  buildAdminEmailData,
  getEmailConfigStatus
} from '../lib/email';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader, 
  Mail, 
  Send, 
  TestTube,
  User,
  Shield
} from 'lucide-react';

export const EmailTest: React.FC = () => {
  const [testingParticipant, setTestingParticipant] = useState(false);
  const [testingAdmin, setTestingAdmin] = useState(false);
  const [participantResult, setParticipantResult] = useState<any>(null);
  const [adminResult, setAdminResult] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('');
  
  const emailConfig = getEmailConfigStatus();
  
  // Sample registration data for testing
  const sampleRegistrationData = {
    teamName: 'Test Warriors',
    registrationType: 'full-team',
    donationAmount: 60,
    players: [
      {
        name: 'John Test Player',
        email: testEmail || 'test@example.com',
        contactPhone: '(555) 123-4567',
        gradeLevel: '9th-12th',
        ageCategory: 'high-school-adult',
        birthdate: '2006-05-15',
        emergencyContactName: 'Jane Parent',
        emergencyContactPhone: '(555) 987-6543',
        medicalInfo: 'No known allergies',
        parentConsent: true
      },
      {
        name: 'Sarah Test Player',
        email: '',
        contactPhone: '(555) 234-5678',
        gradeLevel: '9th-12th',
        ageCategory: 'high-school-adult',
        birthdate: '2007-03-20',
        emergencyContactName: 'Mike Parent',
        emergencyContactPhone: '(555) 876-5432',
        medicalInfo: '',
        parentConsent: true
      },
      {
        name: 'Mike Test Player',
        email: '',
        contactPhone: '(555) 345-6789',
        gradeLevel: '9th-12th',
        ageCategory: 'high-school-adult',
        birthdate: '2006-11-08',
        emergencyContactName: 'Lisa Parent',
        emergencyContactPhone: '(555) 765-4321',
        medicalInfo: 'Wears contact lenses',
        parentConsent: true
      }
    ]
  };

  const testParticipantEmail = async () => {
    if (!emailConfig.configured) {
      alert('EmailJS is not configured. Please set up your environment variables first.');
      return;
    }

    if (!testEmail) {
      alert('Please enter a test email address first.');
      return;
    }

    setTestingParticipant(true);
    setParticipantResult(null);

    try {
      const emailData = buildParticipantEmailData({
        ...sampleRegistrationData,
        players: [{ ...sampleRegistrationData.players[0], email: testEmail }]
      });
      
      console.log('📧 Testing participant email with data:', emailData);
      const result = await sendParticipantConfirmation(emailData);
      
      setParticipantResult(result);
    } catch (error) {
      console.error('Error testing participant email:', error);
      setParticipantResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTestingParticipant(false);
    }
  };

  const testAdminEmail = async () => {
    if (!emailConfig.configured) {
      alert('EmailJS is not configured. Please set up your environment variables first.');
      return;
    }

    if (!testEmail) {
      alert('Please enter a test email address (this will be used as admin email) first.');
      return;
    }

    setTestingAdmin(true);
    setAdminResult(null);

    try {
      // Override admin dashboard URL for testing
      const emailData = buildAdminEmailData(sampleRegistrationData);
      emailData.admin_dashboard_url = `${window.location.origin}/admin`;
      
      console.log('📧 Testing admin email with data:', emailData);
      const result = await sendAdminNotification(emailData);
      
      setAdminResult(result);
    } catch (error) {
      console.error('Error testing admin email:', error);
      setAdminResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTestingAdmin(false);
    }
  };

  const getStatusIcon = (result: any, loading: boolean) => {
    if (loading) return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
    if (!result) return <AlertCircle className="h-4 w-4 text-gray-400" />;
    if (result.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (result: any, loading: boolean) => {
    if (loading) return 'Sending...';
    if (!result) return 'Not tested';
    if (result.success) return `Sent successfully${result.attempts ? ` (${result.attempts} attempts)` : ''}`;
    return `Failed: ${result.error}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <TestTube className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Email System Testing</h2>
            <p className="text-gray-600">Test email templates and delivery in staging environment</p>
          </div>
        </div>

        {/* Configuration Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            EmailJS Configuration Status
          </h3>
          <div className={`p-3 rounded-lg ${
            emailConfig.configured 
              ? 'bg-green-100 border border-green-200' 
              : 'bg-red-100 border border-red-200'
          }`}>
            <div className="flex items-center">
              {emailConfig.configured ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${
                emailConfig.configured ? 'text-green-700' : 'text-red-700'
              }`}>
                {emailConfig.configured 
                  ? '✅ EmailJS is properly configured and ready for testing'
                  : '❌ EmailJS is not configured - please set up environment variables'
                }
              </span>
            </div>
            {!emailConfig.configured && (
              <p className="text-sm text-red-600 mt-2 ml-7">
                Follow <code>EMAIL_SETUP.md</code> to configure EmailJS before testing.
              </p>
            )}
          </div>
        </div>

        {/* Test Email Input */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Test Email Address</h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email to receive test emails"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            💡 Enter your email address to receive test confirmation emails. Admin emails will also be sent to this address.
          </p>
        </div>

        {/* Sample Data Preview */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Sample Registration Data</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Team:</strong> {sampleRegistrationData.teamName}</p>
            <p><strong>Type:</strong> {sampleRegistrationData.registrationType}</p>
            <p><strong>Players:</strong> {sampleRegistrationData.players.length}</p>
            <p><strong>Donation:</strong> ${sampleRegistrationData.donationAmount}</p>
            <p><strong>Contact:</strong> {sampleRegistrationData.players[0].name}</p>
          </div>
        </div>

        {/* Email Tests */}
        <div className="space-y-4">
          {/* Participant Email Test */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <User className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold">Participant Confirmation Email</h3>
                  <p className="text-sm text-gray-600">Tests the email sent to participants after registration</p>
                </div>
              </div>
              {getStatusIcon(participantResult, testingParticipant)}
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Status:</strong> {getStatusText(participantResult, testingParticipant)}
              </p>
              {participantResult && !participantResult.success && (
                <p className="text-sm text-red-600">
                  <strong>Error:</strong> {participantResult.error}
                </p>
              )}
            </div>

            <Button
              onClick={testParticipantEmail}
              disabled={testingParticipant || !emailConfig.configured || !testEmail}
              loading={testingParticipant}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Test Participant Email</span>
            </Button>
          </div>

          {/* Admin Email Test */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-purple-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold">Admin Notification Email</h3>
                  <p className="text-sm text-gray-600">Tests the email sent to admins for new registrations</p>
                </div>
              </div>
              {getStatusIcon(adminResult, testingAdmin)}
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Status:</strong> {getStatusText(adminResult, testingAdmin)}
              </p>
              {adminResult && !adminResult.success && (
                <p className="text-sm text-red-600">
                  <strong>Error:</strong> {adminResult.error}
                </p>
              )}
            </div>

            <Button
              onClick={testAdminEmail}
              disabled={testingAdmin || !emailConfig.configured || !testEmail}
              loading={testingAdmin}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Test Admin Email</span>
            </Button>
          </div>
        </div>

        {/* Test Results Summary */}
        {(participantResult || adminResult) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Test Results Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Participant Email:</span>
                <span className={participantResult?.success ? 'text-green-600' : 'text-red-600'}>
                  {participantResult ? (participantResult.success ? '✅ Success' : '❌ Failed') : '⏳ Not tested'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Admin Email:</span>
                <span className={adminResult?.success ? 'text-green-600' : 'text-red-600'}>
                  {adminResult ? (adminResult.success ? '✅ Success' : '❌ Failed') : '⏳ Not tested'}
                </span>
              </div>
            </div>
            
            {participantResult?.success && adminResult?.success && (
              <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded">
                <p className="text-green-700 font-medium">
                  🎉 All email tests passed! Your email system is working correctly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Important Notes */}
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="text-orange-800 font-semibold mb-2">📋 Testing Notes</h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• These tests use sample data that mimics real registrations</li>
            <li>• Emails are sent immediately - check your inbox and spam folder</li>
            <li>• Test both email types to ensure complete functionality</li>
            <li>• EmailJS free plan allows 200 emails per month</li>
            <li>• Make sure you're in staging mode to avoid affecting production data</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};