import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { testConnection, getFundraisingStats } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, Loader, Database, BarChart3 } from 'lucide-react';

export const DatabaseTest: React.FC = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingStats, setIsTestingStats] = useState(false);
  const [connectionResult, setConnectionResult] = useState<boolean | null>(null);
  const [statsResult, setStatsResult] = useState<any>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const testDatabaseConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    
    try {
      const result = await testConnection();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult(false);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testFundraisingStats = async () => {
    setIsTestingStats(true);
    setStatsResult(null);
    setStatsError(null);
    
    try {
      const { data, error } = await getFundraisingStats();
      if (error) {
        setStatsError(error.message || 'Unknown error occurred');
      } else {
        setStatsResult(data);
      }
    } catch (error) {
      setStatsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsTestingStats(false);
    }
  };

  const getStatusIcon = (status: boolean | null, loading: boolean) => {
    if (loading) return <Loader className="h-5 w-5 animate-spin text-blue-500" />;
    if (status === null) return <AlertCircle className="h-5 w-5 text-gray-400" />;
    if (status) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = (status: boolean | null, loading: boolean) => {
    if (loading) return 'Testing...';
    if (status === null) return 'Not tested';
    if (status) return 'Success';
    return 'Failed';
  };

  const hasValidConfig = import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('your-project-reference') &&
    !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-actual-anon-key');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Database className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Database Connection Test</h2>
            <p className="text-gray-600">Verify your Supabase configuration and connection</p>
          </div>
        </div>
        
        {/* Environment Variables Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Configuration Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span className="font-medium">Supabase URL:</span>
              <div className="flex items-center">
                {import.meta.env.VITE_SUPABASE_URL && 
                 !import.meta.env.VITE_SUPABASE_URL.includes('your-project-reference') ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className={`text-sm font-mono ${
                  hasValidConfig ? 'text-green-600' : 'text-red-600'
                }`}>
                  {import.meta.env.VITE_SUPABASE_URL && 
                   !import.meta.env.VITE_SUPABASE_URL.includes('your-project-reference') 
                    ? '✓ Configured' 
                    : '✗ Not configured'
                  }
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span className="font-medium">Anon Key:</span>
              <div className="flex items-center">
                {import.meta.env.VITE_SUPABASE_ANON_KEY && 
                 !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-actual-anon-key') ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className={`text-sm font-mono ${
                  hasValidConfig ? 'text-green-600' : 'text-red-600'
                }`}>
                  {import.meta.env.VITE_SUPABASE_ANON_KEY && 
                   !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-actual-anon-key')
                    ? '✓ Configured' 
                    : '✗ Not configured'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Tests */}
        <div className="space-y-4">
          {/* Basic Connection Test */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(connectionResult, isTestingConnection)}
              <div>
                <h4 className="font-semibold flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Database Connection
                </h4>
                <p className="text-sm text-gray-600">
                  Status: {getStatusText(connectionResult, isTestingConnection)}
                </p>
                {connectionResult === false && (
                  <p className="text-xs text-red-600 mt-1">
                    Check your Supabase configuration and database schema
                  </p>
                )}
              </div>
            </div>
            <Button 
              onClick={testDatabaseConnection}
              disabled={isTestingConnection || !hasValidConfig}
              variant="outline"
              size="sm"
            >
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>

          {/* Fundraising Stats Test */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(statsResult !== null && !statsError, isTestingStats)}
              <div>
                <h4 className="font-semibold flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Fundraising Stats Function
                </h4>
                <p className="text-sm text-gray-600">
                  {isTestingStats ? 'Testing function...' : 
                   statsError ? `Error: ${statsError}` : 
                   statsResult ? 'Function working correctly' : 'Not tested'}
                </p>
                {statsError && (
                  <p className="text-xs text-red-600 mt-1">
                    Ensure database schema was executed completely
                  </p>
                )}
              </div>
            </div>
            <Button 
              onClick={testFundraisingStats}
              disabled={isTestingStats || !hasValidConfig}
              variant="outline"
              size="sm"
            >
              {isTestingStats ? 'Testing...' : 'Test Function'}
            </Button>
          </div>
        </div>

        {/* Results Display */}
        {statsResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Database Function Test Results:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-green-700">Total Raised</div>
                <div className="text-lg font-bold">${statsResult.total_raised}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-green-700">Goal</div>
                <div className="text-lg font-bold">${statsResult.goal}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-green-700">Teams</div>
                <div className="text-lg font-bold">{statsResult.registered_teams}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-green-700">Players</div>
                <div className="text-lg font-bold">{statsResult.registered_players}</div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Help */}
        {!hasValidConfig && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Configuration Required
            </h4>
            <p className="text-sm text-yellow-700 mb-3">
              Your Supabase credentials are not configured yet. Follow these steps:
            </p>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Read the setup guide: <code className="bg-yellow-100 px-1 rounded">SUPABASE_SETUP.md</code></li>
              <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
              <li>Get your project URL and anon key from Settings → API</li>
              <li>Update your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file with real values</li>
              <li>Run the <code className="bg-yellow-100 px-1 rounded">database-schema.sql</code> in your Supabase SQL Editor</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        )}

        {/* Success State */}
        {hasValidConfig && connectionResult && statsResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Database Setup Complete! 🎉
            </h4>
            <p className="text-sm text-green-700 mb-3">
              Your Supabase database is working correctly. You can now:
            </p>
            <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
              <li>Register teams using the registration form</li>
              <li>Accept sponsor applications</li>
              <li>Manage volunteers</li>
              <li>View real-time fundraising statistics</li>
              <li>Access the admin dashboard</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};