import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { 
  sendParticipantConfirmation, 
  sendAdminNotification,
  buildParticipantEmailData,
  buildAdminEmailData,
  getEmailConfigStatus
} from '../lib/email';
import { environmentInfo } from '../lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader, 
  Mail, 
  Send, 
  TestTube,
  User,
  Shield,
  Eye,
  Settings,
  Clock,
  AlertTriangle,
  FileText,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailDeliveryLog {
  id: string;
  timestamp: Date;
  type: 'participant' | 'admin';
  recipient: string;
  status: 'success' | 'failed' | 'retrying';
  attempts: number;
  error?: string;
  duration?: number;
}

interface AdminEmailTestingProps {
  setActiveTab?: (tab: string) => void;
}

export const AdminEmailTesting: React.FC<AdminEmailTestingProps> = ({ setActiveTab }) => {
  const [testingParticipant, setTestingParticipant] = useState(false);
  const [testingAdmin, setTestingAdmin] = useState(false);
  const [participantResult, setParticipantResult] = useState<any>(null);
  const [adminResult, setAdminResult] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [showPreview, setShowPreview] = useState<'participant' | 'admin' | null>(null);
  const [deliveryLogs, setDeliveryLogs] = useState<EmailDeliveryLog[]>([]);
  
  const emailConfig = getEmailConfigStatus();
  
  // Add delivery log entry
  const addDeliveryLog = (entry: Omit<EmailDeliveryLog, 'id' | 'timestamp'>) => {
    const logEntry: EmailDeliveryLog = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setDeliveryLogs(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

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

  // Staging mode protection
  const isStagingMode = environmentInfo.isStaging;
  const canSendTestEmails = isStagingMode && emailConfig.configured;

  const testParticipantEmail = async () => {
    if (!canSendTestEmails) {
      toast.error('Email testing only available in staging mode with EmailJS configured');
      return;
    }

    if (!testEmail) {
      toast.error('Please enter a test email address first');
      return;
    }

    setTestingParticipant(true);
    setParticipantResult(null);
    const startTime = Date.now();

    try {
      addDeliveryLog({
        type: 'participant',
        recipient: testEmail,
        status: 'retrying',
        attempts: 0
      });

      const emailData = buildParticipantEmailData({
        ...sampleRegistrationData,
        players: [{ ...sampleRegistrationData.players[0], email: testEmail }]
      });
      
      console.log('📧 Testing participant email with data:', emailData);
      const result = await sendParticipantConfirmation(emailData);
      const duration = Date.now() - startTime;
      
      setParticipantResult(result);
      
      addDeliveryLog({
        type: 'participant',
        recipient: testEmail,
        status: result.success ? 'success' : 'failed',
        attempts: result.attempts || 1,
        error: result.error,
        duration
      });

      if (result.success) {
        toast.success(`✅ Participant email sent successfully after ${result.attempts} attempts (${duration}ms)`);
      } else {
        toast.error(`❌ Participant email failed: ${result.error}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('Error testing participant email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setParticipantResult({
        success: false,
        error: errorMessage
      });

      addDeliveryLog({
        type: 'participant',
        recipient: testEmail,
        status: 'failed',
        attempts: 1,
        error: errorMessage,
        duration
      });

      toast.error(`❌ Participant email error: ${errorMessage}`);
    } finally {
      setTestingParticipant(false);
    }
  };

  const testAdminEmail = async () => {
    if (!canSendTestEmails) {
      toast.error('Email testing only available in staging mode with EmailJS configured');
      return;
    }

    const targetEmail = adminEmail || testEmail;
    if (!targetEmail) {
      toast.error('Please enter an admin email address first');
      return;
    }

    setTestingAdmin(true);
    setAdminResult(null);
    const startTime = Date.now();

    try {
      addDeliveryLog({
        type: 'admin',
        recipient: targetEmail,
        status: 'retrying',
        attempts: 0
      });

      // Build admin email data with override for testing
      const emailData = buildAdminEmailData(sampleRegistrationData);
      emailData.admin_dashboard_url = `${window.location.origin}/admin`;
      
      console.log('📧 Testing admin email with data:', emailData);
      const result = await sendAdminNotification(emailData);
      const duration = Date.now() - startTime;
      
      setAdminResult(result);
      
      addDeliveryLog({
        type: 'admin',
        recipient: targetEmail,
        status: result.success ? 'success' : 'failed',
        attempts: result.attempts || 1,
        error: result.error,
        duration
      });

      if (result.success) {
        toast.success(`✅ Admin email sent successfully after ${result.attempts} attempts (${duration}ms)`);
      } else {
        toast.error(`❌ Admin email failed: ${result.error}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('Error testing admin email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setAdminResult({
        success: false,
        error: errorMessage
      });

      addDeliveryLog({
        type: 'admin',
        recipient: targetEmail,
        status: 'failed',
        attempts: 1,
        error: errorMessage,
        duration
      });

      toast.error(`❌ Admin email error: ${errorMessage}`);
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

  const renderEmailPreview = (type: 'participant' | 'admin') => {
    const emailData = type === 'participant' 
      ? buildParticipantEmailData({
          ...sampleRegistrationData,
          players: [{ ...sampleRegistrationData.players[0], email: testEmail || 'test@example.com' }]
        })
      : buildAdminEmailData(sampleRegistrationData);

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Email Data Preview:</h4>
          <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-auto max-h-40">
            {JSON.stringify(emailData, null, 2)}
          </pre>
        </div>
        <div className="text-sm text-gray-600">
          <p><strong>Subject:</strong> {type === 'participant' 
            ? '🏀 Registration Confirmed - 3-on-3 Basketball Tournament'
            : '🚨 New Tournament Registration - Test Warriors (PENDING APPROVAL)'
          }</p>
          <p><strong>Template:</strong> {type === 'participant' ? 'Participant Confirmation' : 'Admin Notification'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Environment & Configuration Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Environment Status */}
        <Card className="p-4">
          <div className="flex items-center mb-3">
            <TestTube className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Environment Status</h3>
          </div>
          
          <div className={`p-3 rounded-lg border-2 ${
            isStagingMode 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {isStagingMode ? (
                <CheckCircle className="h-5 w-5 text-orange-600 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${
                isStagingMode ? 'text-orange-700' : 'text-red-700'
              }`}>
                {isStagingMode ? '🧪 STAGING MODE' : '🚀 PRODUCTION MODE'}
              </span>
            </div>
            <p className={`text-sm ${
              isStagingMode ? 'text-orange-600' : 'text-red-600'
            }`}>
              {isStagingMode 
                ? 'Safe for email testing - no production data affected'
                : '⚠️ EMAIL TESTING DISABLED - Switch to staging mode to test emails safely'
              }
            </p>
          </div>
        </Card>

        {/* Email Configuration */}
        <Card className="p-4">
          <div className="flex items-center mb-3">
            <Settings className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">EmailJS Configuration</h3>
          </div>
          
          <div className="space-y-2">
            {[
              { key: 'serviceId', name: 'Service ID', status: emailConfig.serviceId },
              { key: 'publicKey', name: 'Public Key', status: emailConfig.publicKey },
              { key: 'participantTemplate', name: 'Participant Template', status: emailConfig.participantTemplate },
              { key: 'adminTemplate', name: 'Admin Template', status: emailConfig.adminTemplate }
            ].map(({ key, name, status }) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span>{name}:</span>
                <div className="flex items-center">
                  {status ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={status ? 'text-green-600' : 'text-red-600'}>
                    {status ? 'Configured' : 'Missing'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3">
            <div className={`p-2 rounded text-center text-sm font-medium ${
              emailConfig.configured 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {emailConfig.configured ? '✅ Ready for Testing' : '❌ Configuration Required'}
            </div>
          </div>
        </Card>
      </div>

      {/* Test Email Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Email Testing Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Participant Email
            </label>
            <Input
              type="email"
              placeholder="Enter test email for participant confirmations"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full"
              disabled={!canSendTestEmails}
            />
            <p className="text-xs text-gray-500 mt-1">
              This email will receive participant confirmation tests
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notification Email (Optional)
            </label>
            <Input
              type="email"
              placeholder="Enter admin email (defaults to test email)"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full"
              disabled={!canSendTestEmails}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to use the test email above
            </p>
          </div>
        </div>

        {!canSendTestEmails && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <p className="text-yellow-700 text-sm">
              <strong>Email testing is disabled.</strong> 
              {!isStagingMode && " Switch to staging mode and "}
              {!emailConfig.configured && " configure EmailJS environment variables to enable testing."}
            </p>
          </div>
        )}
      </Card>

      {/* Email Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participant Email Test */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Participant Email Test</h3>
                <p className="text-sm text-gray-600">Tournament registration confirmation</p>
              </div>
            </div>
            {getStatusIcon(participantResult, testingParticipant)}
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Status:</strong> {getStatusText(participantResult, testingParticipant)}
            </p>
            {participantResult && !participantResult.success && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                <strong>Error:</strong> {participantResult.error}
              </p>
            )}
          </div>

          <div className="flex space-x-2 mb-4">
            <Button
              onClick={testParticipantEmail}
              disabled={testingParticipant || !canSendTestEmails || !testEmail}
              loading={testingParticipant}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Test Email</span>
            </Button>
            
            <Button
              onClick={() => setShowPreview(showPreview === 'participant' ? null : 'participant')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
          </div>

          {showPreview === 'participant' && renderEmailPreview('participant')}
        </Card>

        {/* Admin Email Test */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-purple-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Admin Notification Test</h3>
                <p className="text-sm text-gray-600">New registration alert</p>
              </div>
            </div>
            {getStatusIcon(adminResult, testingAdmin)}
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Status:</strong> {getStatusText(adminResult, testingAdmin)}
            </p>
            {adminResult && !adminResult.success && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                <strong>Error:</strong> {adminResult.error}
              </p>
            )}
          </div>

          <div className="flex space-x-2 mb-4">
            <Button
              onClick={testAdminEmail}
              disabled={testingAdmin || !canSendTestEmails || (!testEmail && !adminEmail)}
              loading={testingAdmin}
              variant="outline"
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Test Email</span>
            </Button>
            
            <Button
              onClick={() => setShowPreview(showPreview === 'admin' ? null : 'admin')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
          </div>

          {showPreview === 'admin' && renderEmailPreview('admin')}
        </Card>
      </div>

      {/* Delivery Logs */}
      {deliveryLogs.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Email Delivery Logs
            </h3>
            <Button
              onClick={() => setDeliveryLogs([])}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Recipient</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Attempts</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {deliveryLogs.map((log) => (
                  <tr key={log.id} className="border-b last:border-b-0">
                    <td className="p-2 font-mono text-xs">
                      {log.timestamp.toLocaleTimeString()}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.type === 'participant' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-2 font-mono text-xs">{log.recipient}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.status === 'success' 
                          ? 'bg-green-100 text-green-700'
                          : log.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-2">{log.attempts}</td>
                    <td className="p-2">{log.duration ? `${log.duration}ms` : '-'}</td>
                    <td className="p-2 text-xs text-red-600 max-w-xs truncate" title={log.error}>
                      {log.error || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Documentation & Resources
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => window.open('/EMAIL_SETUP.md', '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            <span>EmailJS Setup Guide</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => window.open('https://www.emailjs.com/', '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            <span>EmailJS Dashboard</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => setActiveTab?.('dashboard')}
          >
            <Settings className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};