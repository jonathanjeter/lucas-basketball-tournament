import React from 'react';
import { Users, Clock, DollarSign, Target, Trophy, Calendar, Mail, Settings, Plus, Heart, Building, MessageSquare, CheckCircle, XCircle, Shield, BarChart3, Edit, Eye, ExternalLink, Package, Download, Phone, UserCheck, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { AdminLogin } from '../components/AdminLogin';
import ManualSponsorEntry from '../components/ManualSponsorEntry';
import ManualVolunteerEntry from '../components/ManualVolunteerEntry';
import { AdminEmailTesting } from '../components/AdminEmailTesting';
import { getTeamsForAdmin, approveTeam, rejectTeam, updateTeamDivision, getSponsorsForAdmin, approveSponsor, rejectSponsor, schedulePickup, getVolunteersForAdmin, updateVolunteerStatus, exportVolunteers, updateTeamCheckIn, updateTeamPayment, getTournamentSettings, updateTournamentStatus, createBrackets, supabase, testConnection, testStorage } from '../lib/supabase';
import toast from 'react-hot-toast';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<'tournament' | 'project'>('tournament');
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [teams, setTeams] = React.useState<any[]>([]);
  const [teamsLoading, setTeamsLoading] = React.useState(false);
  const [processingTeam, setProcessingTeam] = React.useState<number | null>(null);
  const [sponsors, setSponsors] = React.useState<any[]>([]);
  const [sponsorsLoading, setSponsorsLoading] = React.useState(false);
  const [processingSponsor, setProcessingSponsor] = React.useState<number | null>(null);
  const [volunteers, setVolunteers] = React.useState<any[]>([]);
  const [volunteersLoading, setVolunteersLoading] = React.useState(false);
  
  // Real-time dashboard stats
  const [stats, setStats] = React.useState({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    totalFundsRaised: 0,
    goalProgress: 0,
    juniorTeams: 0,
    seniorTeams: 0,
    totalSponsors: 0,
    totalVolunteers: 0
  });

  // Check if user is already authenticated (simple session storage)
  React.useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('adminAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
  };

  // Fetch real-time stats from database
  const fetchRealStats = async () => {
    console.log('Fetching admin stats from database...');
    try {
      // Get team registrations
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, approved, donation_amount, age_category');
      
      // Get sponsors
      const { data: sponsors, error: sponsorsError } = await supabase
        .from('sponsors')
        .select('donation_amount, item_description, approved');
        
      // Get volunteers
      const { data: volunteers, error: volunteersError } = await supabase
        .from('volunteers')
        .select('id, status');
      
      if (teams && !teamsError) {
        const totalRegistrations = teams.length;
        const pendingRegistrations = teams.filter(t => t.approved === false).length;
        const juniorTeams = teams.filter(t => t.age_category === 'middle-school').length;
        const seniorTeams = teams.filter(t => t.age_category === 'high-school-adult').length;
        
        // Calculate total funds from approved teams
        const teamFunds = teams
          .filter(t => t.approved === true)
          .reduce((sum, t) => sum + (t.donation_amount || 0), 0);
        
        let sponsorFunds = 0;
        if (sponsors && !sponsorsError) {
          sponsorFunds = sponsors
            .filter(s => s.approved === true)
            .reduce((sum, s) => sum + (s.donation_amount || 0), 0);
        }
        
        const totalFundsRaised = teamFunds + sponsorFunds;
        const goalProgress = Math.round((totalFundsRaised / 400) * 100);
        
        setStats({
          totalRegistrations,
          pendingRegistrations,
          totalFundsRaised,
          goalProgress,
          juniorTeams,
          seniorTeams,
          totalSponsors: sponsors?.length || 0,
          totalVolunteers: volunteers?.length || 0
        });

        console.log('Stats fetched successfully:', {
          totalRegistrations,
          pendingRegistrations,
          totalFundsRaised,
          goalProgress
        });
      }
    } catch (error) {
      console.error('Database connection failed:', error);
      // Keep stats at current value if error
    }
  };

  // Fetch real-time stats when authenticated
  React.useEffect(() => {
    const initializeAdmin = async () => {
      if (isAuthenticated) {
        // Test connections first
        console.log('Testing database connection...');
        const dbOk = await testConnection();
        
        console.log('Testing storage connection...');  
        const storageOk = await testStorage();
        
        if (!dbOk) {
          console.error('Database connection failed - admin functionality limited');
        }
        
        if (!storageOk) {
          console.error('Storage connection failed - logo uploads disabled');
        }
        
        // Proceed with stats fetch
        fetchRealStats();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchRealStats, 30000);
        return () => clearInterval(interval);
      }
    };
    
    initializeAdmin();
  }, [isAuthenticated]);

  // Fetch teams for admin when authenticated and viewing registrations
  React.useEffect(() => {
    if (isAuthenticated && activeSection === 'tournament' && activeTab === 'registrations') {
      fetchTeams();
    }
  }, [isAuthenticated, activeSection, activeTab]);

  // Fetch sponsors for admin when authenticated and viewing sponsors
  React.useEffect(() => {
    if (isAuthenticated && activeSection === 'tournament' && activeTab === 'sponsors') {
      fetchSponsors();
    }
  }, [isAuthenticated, activeSection, activeTab]);

  // Fetch volunteers for admin when authenticated and viewing volunteers
  React.useEffect(() => {
    if (isAuthenticated && activeSection === 'project' && activeTab === 'volunteers') {
      fetchVolunteers();
    }
  }, [isAuthenticated, activeSection, activeTab]);

  const fetchTeams = async () => {
    setTeamsLoading(true);
    try {
      const result = await getTeamsForAdmin();
      setTeams(result.data || []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleApproveTeam = async (teamId: number) => {
    setProcessingTeam(teamId);
    try {
      await approveTeam(teamId);
      toast.success('Team approved successfully!');
      fetchTeams(); // Refresh the list
      fetchRealStats(); // Update dashboard stats
    } catch (error: any) {
      console.error('Failed to approve team:', error);
      toast.error(error.message || 'Failed to approve team');
    } finally {
      setProcessingTeam(null);
    }
  };

  const handleRejectTeam = async (teamId: number) => {
    setProcessingTeam(teamId);
    try {
      await rejectTeam(teamId, 'Rejected by admin');
      toast.success('Team rejected');
      fetchTeams(); // Refresh the list
      fetchRealStats(); // Update dashboard stats
    } catch (error: any) {
      console.error('Failed to reject team:', error);
      toast.error(error.message || 'Failed to reject team');
    } finally {
      setProcessingTeam(null);
    }
  };

  const handleUpdateDivision = async (teamId: number, division: 'junior' | 'senior') => {
    try {
      await updateTeamDivision(teamId, division);
      toast.success(`Team moved to ${division} division`);
      fetchTeams(); // Refresh the list
      fetchRealStats(); // Update dashboard stats
    } catch (error: any) {
      console.error('Failed to update division:', error);
      toast.error(error.message || 'Failed to update division');
    }
  };

  const fetchSponsors = async () => {
    setSponsorsLoading(true);
    try {
      const result = await getSponsorsForAdmin();
      setSponsors(result.data || []);
    } catch (error) {
      console.error('Failed to fetch sponsors:', error);
      toast.error('Failed to load sponsors');
    } finally {
      setSponsorsLoading(false);
    }
  };

  const handleApproveSponsor = async (sponsorId: number) => {
    setProcessingSponsor(sponsorId);
    try {
      await approveSponsor(sponsorId);
      toast.success('Sponsor approved! Logo will appear on homepage.');
      fetchSponsors(); // Refresh the list
      fetchRealStats(); // Update dashboard stats
    } catch (error: any) {
      console.error('Failed to approve sponsor:', error);
      toast.error(error.message || 'Failed to approve sponsor');
    } finally {
      setProcessingSponsor(null);
    }
  };

  const handleRejectSponsor = async (sponsorId: number) => {
    setProcessingSponsor(sponsorId);
    try {
      await rejectSponsor(sponsorId);
      toast.success('Sponsor rejected');
      fetchSponsors(); // Refresh the list
      fetchRealStats(); // Update dashboard stats
    } catch (error: any) {
      console.error('Failed to reject sponsor:', error);
      toast.error(error.message || 'Failed to reject sponsor');
    } finally {
      setProcessingSponsor(null);
    }
  };

  const handleSchedulePickup = async (sponsorId: number) => {
    try {
      await schedulePickup(sponsorId);
      toast.success('Pickup scheduled for Friday before tournament');
      fetchSponsors(); // Refresh the list
      fetchRealStats(); // Update dashboard stats
    } catch (error: any) {
      console.error('Failed to schedule pickup:', error);
      toast.error(error.message || 'Failed to schedule pickup');
    }
  };

  const fetchVolunteers = async () => {
    setVolunteersLoading(true);
    try {
      const result = await getVolunteersForAdmin();
      setVolunteers(result.data || []);
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
      toast.error('Failed to load volunteers');
    } finally {
      setVolunteersLoading(false);
    }
  };

  const handleUpdateVolunteerStatus = async (volunteerId: number, status: 'pending' | 'confirmed' | 'contacted') => {
    try {
      await updateVolunteerStatus(volunteerId, status);
      toast.success(`Volunteer status updated to ${status}`);
      fetchVolunteers(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to update volunteer status:', error);
      toast.error(error.message || 'Failed to update volunteer status');
    }
  };

  const handleExportVolunteers = async () => {
    try {
      const csvData = await exportVolunteers();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `volunteers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Volunteer list exported successfully');
    } catch (error: any) {
      console.error('Failed to export volunteers:', error);
      toast.error(error.message || 'Failed to export volunteers');
    }
  };

  // Tournament Day Operations Component
  const TournamentDayOps: React.FC<{ teams: any[], onTeamUpdate: () => void }> = ({ teams, onTeamUpdate }) => {
    const [checkedInTeams, setCheckedInTeams] = React.useState<Set<number>>(new Set());
    const [paymentReceived, setPaymentReceived] = React.useState<Map<number, number>>(new Map());
    const [activeView, setActiveView] = React.useState<'dashboard' | 'checkin' | 'brackets' | 'emergency'>('dashboard');
    const [tournamentStatus, setTournamentStatus] = React.useState<string>('Not Started');

    // Initialize with existing team data
    React.useEffect(() => {
      // Initialize checked-in teams from database
      const checkedIn = new Set<number>();
      const payments = new Map<number, number>();
      
      teams.forEach(team => {
        if (team.checked_in) {
          checkedIn.add(team.id);
        }
        if (team.donation_amount) {
          payments.set(team.id, team.donation_amount);
        }
      });
      
      setCheckedInTeams(checkedIn);
      setPaymentReceived(payments);
    }, [teams]);

    // Load tournament settings
    React.useEffect(() => {
      const loadTournamentSettings = async () => {
        try {
          const result = await getTournamentSettings();
          if (result.data && result.data.tournament_status) {
            const status = result.data.tournament_status;
            const displayStatus = status === 'in_progress' ? 'In Progress' : 
                                status === 'completed' ? 'Completed' : 'Not Started';
            setTournamentStatus(displayStatus);
          }
        } catch (error) {
          console.error('Failed to load tournament settings:', error);
        }
      };
      
      loadTournamentSettings();
    }, []);

    const approvedTeams = teams.filter(team => team.status === 'approved');
    const juniorTeams = approvedTeams.filter(team => team.division === 'junior');
    const seniorTeams = approvedTeams.filter(team => team.division === 'senior');

    const handleCheckIn = async (teamId: number) => {
      const isCurrentlyCheckedIn = checkedInTeams.has(teamId);
      const newStatus = !isCurrentlyCheckedIn;
      
      try {
        await updateTeamCheckIn(teamId, newStatus);
        
        const newCheckedIn = new Set(checkedInTeams);
        if (newStatus) {
          newCheckedIn.add(teamId);
          toast.success('Team checked in successfully');
        } else {
          newCheckedIn.delete(teamId);
          toast.success('Team check-in removed');
        }
        setCheckedInTeams(newCheckedIn);
        onTeamUpdate(); // Refresh team data
      } catch (error: any) {
        console.error('Failed to update check-in:', error);
        toast.error(error.message || 'Failed to update check-in status');
      }
    };

    const handlePaymentReceived = async (teamId: number, amount: number) => {
      if (amount < 0) return;
      
      try {
        await updateTeamPayment(teamId, amount);
        
        const newPayments = new Map(paymentReceived);
        newPayments.set(teamId, amount);
        setPaymentReceived(newPayments);
        toast.success(`Payment of $${amount} recorded for team`);
        onTeamUpdate(); // Refresh team data
      } catch (error: any) {
        console.error('Failed to update payment:', error);
        toast.error(error.message || 'Failed to record payment');
      }
    };

    const totalPaymentsReceived = Array.from(paymentReceived.values()).reduce((sum, amount) => sum + amount, 0);

    // Toggle team check-in
    const toggleCheckIn = (teamId: number) => {
      handleCheckIn(teamId);
    };

    // Handle tournament start/status update
    const handleStartTournament = async () => {
      let newStatus = 'not_started';
      if (tournamentStatus === 'Not Started' || tournamentStatus === 'not_started') {
        newStatus = 'in_progress';
      } else if (tournamentStatus === 'In Progress' || tournamentStatus === 'in_progress') {
        newStatus = 'completed';
      } else {
        newStatus = 'not_started';
      }
      
      try {
        await updateTournamentStatus(newStatus);
        
        const displayStatus = newStatus === 'in_progress' ? 'In Progress' : 
                            newStatus === 'completed' ? 'Completed' : 'Not Started';
        setTournamentStatus(displayStatus);
        toast.success(`Tournament status updated to: ${displayStatus}`);
      } catch (error: any) {
        console.error('Failed to update tournament status:', error);
        toast.error(error.message || 'Failed to update tournament status');
      }
    };

    // Calculate stats
    const stats = {
      totalTeams: approvedTeams.length,
      juniorTeams: juniorTeams.length,
      seniorTeams: seniorTeams.length,
      totalFunds: totalPaymentsReceived,
      checkedIn: checkedInTeams.size
    };

    return (
      <div className="space-y-6">
        {/* Tournament Day Header */}
        <Card className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-orange-100" />
            <h2 className="text-2xl font-bold mb-2">Tournament Day Operations</h2>
            <p className="text-orange-100 mb-4">
              Live tournament management and team check-in
            </p>
          </div>
        </Card>

        {/* Mobile-optimized navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['dashboard', 'checkin', 'brackets', 'emergency'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-6 py-3 rounded-lg font-medium min-h-[44px] min-w-[120px] ${
                activeView === view 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Tournament Day Dashboard */}
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800">Teams Registered</h3>
              <p className="text-2xl font-bold text-green-600">{stats.totalTeams}</p>
              <p className="text-sm text-green-600">
                Junior: {stats.juniorTeams} | Senior: {stats.seniorTeams}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800">Funds Raised</h3>
              <p className="text-2xl font-bold text-blue-600">${stats.totalFunds}</p>
              <p className="text-sm text-blue-600">
                Goal: $400 ({Math.round((stats.totalFunds / 400) * 100)}%)
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800">Check-in Status</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.checkedIn}/{stats.totalTeams}</p>
              <p className="text-sm text-yellow-600">Teams checked in</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800">Tournament Status</h3>
              <p className="text-lg font-bold text-purple-600">{tournamentStatus}</p>
              <button 
                onClick={handleStartTournament}
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm min-h-[44px]"
              >
                {tournamentStatus === 'Not Started' ? 'Start Tournament' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        {/* Team Check-in Interface */}
        {activeView === 'checkin' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Team Check-in</h2>
            {approvedTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{team.name || `Team ${team.id}`}</h3>
                  <p className="text-sm text-gray-600">
                    {team.division} Division | Players: {team.players?.length || 0} | 
                    Payment: {paymentReceived.has(team.id) ? `$${paymentReceived.get(team.id)}` : 'Pending'}
                  </p>
                </div>
                <button
                  onClick={() => toggleCheckIn(team.id)}
                  className={`px-6 py-2 rounded-lg font-medium min-h-[44px] min-w-[100px] ${
                    checkedInTeams.has(team.id) 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {checkedInTeams.has(team.id) ? 'Checked In' : 'Check In'}
                </button>
              </div>
            ))}
            {approvedTeams.length === 0 && (
              <p className="text-center text-gray-500 py-8">No approved teams yet</p>
            )}
          </div>
        )}

        {/* Tournament Brackets View */}
        {activeView === 'brackets' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Tournament Brackets
              </h3>
              
              {stats.checkedIn < 4 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Waiting for Check-Ins</h4>
                  <p className="text-gray-600">
                    Need at least 4 teams checked in to generate brackets. 
                    Currently have {stats.checkedIn} teams checked in.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-green-700">Junior Division Bracket (6th-8th Grade)</h4>
                    <div className="space-y-2">
                      {juniorTeams.filter(team => checkedInTeams.has(team.id)).map((team, index) => (
                        <div key={team.id} className="flex items-center justify-between p-3 border rounded min-h-[44px]">
                          <span className="font-medium">#{index + 1} {team.team_name || `Team ${team.id}`}</span>
                          <span className="text-sm text-gray-500">Seed {index + 1}</span>
                        </div>
                      ))}
                      {juniorTeams.filter(team => checkedInTeams.has(team.id)).length === 0 && (
                        <p className="text-center text-gray-500 py-4">No junior teams checked in</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 text-purple-700">Senior Division Bracket (9th-Adult)</h4>
                    <div className="space-y-2">
                      {seniorTeams.filter(team => checkedInTeams.has(team.id)).map((team, index) => (
                        <div key={team.id} className="flex items-center justify-between p-3 border rounded min-h-[44px]">
                          <span className="font-medium">#{index + 1} {team.team_name || `Team ${team.id}`}</span>
                          <span className="text-sm text-gray-500">Seed {index + 1}</span>
                        </div>
                      ))}
                      {seniorTeams.filter(team => checkedInTeams.has(team.id)).length === 0 && (
                        <p className="text-center text-gray-500 py-4">No senior teams checked in</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setActiveView('checkin')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium min-h-[44px] hover:bg-blue-700"
                >
                  Back to Check-in
                </button>
                <button
                  onClick={() => alert('Bracket management features coming soon!')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium min-h-[44px] hover:bg-green-700"
                  disabled={stats.checkedIn < 4}
                >
                  Generate Brackets
                </button>
              </div>
            </Card>
          </div>
        )}


        {/* Emergency Management View */}
        {activeView === 'emergency' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Emergency Management
              </h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Emergency Contacts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span><strong>911 Emergency</strong></span>
                      <a href="tel:911" className="bg-red-600 text-white px-4 py-2 rounded min-h-[44px] flex items-center">
                        Call 911
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span><strong>School Office:</strong> (XXX) XXX-XXXX</span>
                      <a href="tel:+1234567890" className="bg-blue-600 text-white px-4 py-2 rounded min-h-[44px] flex items-center">
                        Call School
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span><strong>Tournament Director:</strong> (XXX) XXX-XXXX</span>
                      <a href="tel:+1234567890" className="bg-green-600 text-white px-4 py-2 rounded min-h-[44px] flex items-center">
                        Call Director
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Quick Announcement Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button className="bg-white border border-blue-300 text-blue-900 px-4 py-2 rounded text-left min-h-[44px] hover:bg-blue-100">
                      "Tournament starting in 15 minutes"
                    </button>
                    <button className="bg-white border border-blue-300 text-blue-900 px-4 py-2 rounded text-left min-h-[44px] hover:bg-blue-100">
                      "Please check in at the front table"
                    </button>
                    <button className="bg-white border border-blue-300 text-blue-900 px-4 py-2 rounded text-left min-h-[44px] hover:bg-blue-100">
                      "Next games begin in 5 minutes"
                    </button>
                    <button className="bg-white border border-blue-300 text-blue-900 px-4 py-2 rounded text-left min-h-[44px] hover:bg-blue-100">
                      "Tournament concluding - thank you!"
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Emergency Procedures</h4>
                  <div className="text-sm text-yellow-800 space-y-2">
                    <p><strong>Medical Emergency:</strong> Call 911 immediately, then contact tournament director. Do not move injured person.</p>
                    <p><strong>Facility Emergency:</strong> Evacuate to parking lot, call 911, notify school administration.</p>
                    <p><strong>Weather Emergency:</strong> Move all participants inside, monitor weather alerts, suspend games if needed.</p>
                    <p><strong>BSA Incident:</strong> Document any incidents, notify BSA leadership and parents of minors involved.</p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Tournament Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button className="bg-orange-600 text-white px-4 py-3 rounded font-medium min-h-[44px] hover:bg-orange-700">
                      Pause All Games
                    </button>
                    <button className="bg-green-600 text-white px-4 py-3 rounded font-medium min-h-[44px] hover:bg-green-700">
                      Resume Tournament
                    </button>
                    <button className="bg-red-600 text-white px-4 py-3 rounded font-medium min-h-[44px] hover:bg-red-700">
                      End Tournament
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-3 rounded font-medium min-h-[44px] hover:bg-blue-700">
                      Send Alert
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const sections = [
    { id: 'tournament', name: 'Tournament Admin', icon: Trophy },
    { id: 'project', name: 'Scout Project Admin', icon: Shield },
  ];

  const tournamentTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'registrations', name: 'Registrations', icon: Users },
    { id: 'sponsors', name: 'Sponsors', icon: Building },
    { id: 'volunteers', name: 'Volunteers', icon: UserCheck },
    { id: 'manual-entry', name: 'Manual Entry', icon: Plus },
    { id: 'email-testing', name: 'Email Testing', icon: Mail },
    { id: 'brackets', name: 'Brackets', icon: Trophy },
  ];

  const projectTabs = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3 },
    { id: 'volunteers', name: 'Volunteers', icon: Heart },
    { id: 'contact', name: 'Contact Inquiries', icon: MessageSquare },
    { id: 'fundraising', name: 'Fundraising', icon: BarChart3 },
  ];

  const currentTabs = activeSection === 'tournament' ? tournamentTabs : projectTabs;

  // Use real stats from database
  const dashboardStats = {
    tournament: {
      totalRegistrations: stats.totalRegistrations,
      pendingApprovals: stats.pendingRegistrations,
      totalRaised: stats.totalFundsRaised,
      goalAmount: 400,
      juniorDivision: stats.juniorTeams,
      seniorDivision: stats.seniorTeams
    },
    project: {
      totalVolunteers: stats.totalVolunteers,
      contactInquiries: 0, // Could be fetched from a contacts table if exists
      sponsorsApproved: stats.totalSponsors,
      fundraisingProgress: stats.goalProgress
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm text-gray-600">Tournament: Aug 30, 2025</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-600 border-red-300 hover:bg-red-50 h-11 px-3"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Section Selector - Large Touch Targets */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id as 'tournament' | 'project');
                  setActiveTab('dashboard');
                }}
                className={`flex items-center justify-center py-4 px-6 font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                style={{ minHeight: '64px' }} // 44px minimum + padding
              >
                <section.icon className="h-5 w-5 mr-2" />
                <span className="text-sm md:text-base">{section.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation - Mobile Optimized */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-0">
            {currentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={{ minHeight: '52px', minWidth: '44px' }}
              >
                <tab.icon className="h-4 w-4 mr-1" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{stats.totalRegistrations}</p>
                    <p className="text-gray-600 text-sm">Registrations</p>
                  </div>
                  <div className="text-orange-500">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.pendingRegistrations}</p>
                    <p className="text-gray-600 text-sm">Pending</p>
                  </div>
                  <div className="text-red-500">
                    <Clock className="h-8 w-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">${stats.totalFundsRaised}</p>
                    <p className="text-gray-600 text-sm">Raised</p>
                  </div>
                  <div className="text-green-500">
                    <DollarSign className="h-8 w-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.goalProgress}%</p>
                    <p className="text-gray-600 text-sm">Goal</p>
                  </div>
                  <div className="text-blue-500">
                    <Target className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tournament Operations & Division Status */}
            {activeSection === 'tournament' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold mb-4">Tournament Day Operations</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('brackets')}
                      className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 min-h-[44px]"
                    >
                      Team Check-In
                    </button>
                    <button 
                      onClick={() => setActiveTab('brackets')}
                      className="w-full bg-orange-100 text-orange-700 py-3 px-4 rounded-lg font-medium hover:bg-orange-200 border border-orange-300 min-h-[44px]"
                    >
                      Update Brackets
                    </button>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold mb-4">Division Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Junior (6th-8th):</span>
                      <span className="font-semibold text-orange-600">{stats.juniorTeams} teams</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Senior (HS+Adult):</span>
                      <span className="font-semibold text-orange-600">{stats.seniorTeams} teams</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600">Total Volunteers:</span>
                      <span className="font-semibold text-green-600">{stats.totalVolunteers}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Project Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Volunteers:</span>
                      <span className="font-bold text-green-600">{dashboardStats.project.totalVolunteers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sponsors Approved:</span>
                      <span className="font-bold text-blue-600">{dashboardStats.project.sponsorsApproved}</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Fundraising Progress</h3>
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-orange-500 h-3 rounded-full transition-all"
                        style={{ width: `${(dashboardStats.tournament.totalRaised / dashboardStats.tournament.goalAmount) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      ${dashboardStats.tournament.totalRaised} of $400 goal
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Approval Required:</strong> All registrations need approval before appearing publicly.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-gray-900">{teams.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-red-600">
                  {teams.filter(t => !t.approved && t.status !== 'rejected').length}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-green-600">
                  {teams.filter(t => t.approved).length}
                </div>
                <div className="text-xs text-gray-600">Approved</div>
              </Card>
            </div>

            {/* Teams List - Mobile Optimized */}
            {teamsLoading ? (
              <Card className="p-6">
                <div className="text-center text-gray-600">Loading teams...</div>
              </Card>
            ) : teams.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-gray-600">No registrations yet</div>
              </Card>
            ) : (
              <div className="space-y-3">
                {teams.map((team) => (
                  <Card key={team.id} className="overflow-hidden">
                    {/* Team Header - Large Touch Area */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {team.name || 'Individual Registration'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">
                              {team.players?.length || 0} player{(team.players?.length || 0) !== 1 ? 's' : ''}
                            </span>
                            <span className="text-sm text-gray-600">•</span>
                            <span className="text-sm font-medium text-orange-600">
                              ${team.donation_amount || 0}
                            </span>
                            {team.division && (
                              <>
                                <span className="text-sm text-gray-600">•</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  team.division === 'junior' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {team.division === 'junior' ? 'Junior Division' : 'Senior Division'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          team.approved
                            ? 'bg-green-100 text-green-800'
                            : team.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {team.approved ? 'Approved' : team.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </div>
                      </div>

                      {/* Players Preview */}
                      <div className="space-y-2 mb-4">
                        {team.players?.slice(0, 2).map((player: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-gray-50 rounded px-3 py-2">
                            <div>
                              <span className="font-medium text-gray-900">{player.name}</span>
                              <span className="text-gray-600 ml-2">{player.email}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              player.age_category === 'middle-school'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {player.age_category === 'middle-school' ? 'MS' : 'HS/Adult'}
                            </span>
                          </div>
                        ))}
                        {(team.players?.length || 0) > 2 && (
                          <div className="text-sm text-gray-500 text-center">
                            +{(team.players?.length || 0) - 2} more player{(team.players?.length || 0) - 2 !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Large Touch Targets */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Approve/Reject Section */}
                        {!team.approved && team.status !== 'rejected' && (
                          <>
                            <Button
                              onClick={() => handleApproveTeam(team.id)}
                              disabled={processingTeam === team.id}
                              className="h-12 bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {processingTeam === team.id ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                              onClick={() => handleRejectTeam(team.id)}
                              disabled={processingTeam === team.id}
                              variant="outline"
                              className="h-12 border-red-300 text-red-600 hover:bg-red-50"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              {processingTeam === team.id ? 'Rejecting...' : 'Reject'}
                            </Button>
                          </>
                        )}
                        
                        {/* Division Assignment */}
                        {team.approved && (
                          <>
                            <Button
                              onClick={() => handleUpdateDivision(team.id, 'junior')}
                              variant={team.division === 'junior' ? 'default' : 'outline'}
                              className="h-12"
                              size="sm"
                            >
                              Junior (6th-8th)
                            </Button>
                            <Button
                              onClick={() => handleUpdateDivision(team.id, 'senior')}
                              variant={team.division === 'senior' ? 'default' : 'outline'}
                              className="h-12"
                              size="sm"
                            >
                              Senior (HS/Adult)
                            </Button>
                          </>
                        )}

                        {/* View Details */}
                        {(team.approved || team.status === 'rejected') && (
                          <Button
                            variant="outline"
                            className="h-12 col-span-2"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sponsors' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>$40+ Sponsors:</strong> Approved sponsors with $40+ donations automatically display on homepage.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-gray-900">{sponsors.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-red-600">
                  {sponsors.filter(s => !s.approved).length}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-green-600">
                  {sponsors.filter(s => s.approved).length}
                </div>
                <div className="text-xs text-gray-600">Approved</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-orange-600">
                  {sponsors.filter(s => s.donation_type === 'items' && !s.pickup_scheduled).length}
                </div>
                <div className="text-xs text-gray-600">Need Pickup</div>
              </Card>
            </div>

            {/* Sponsors List - Mobile Optimized */}
            {sponsorsLoading ? (
              <Card className="p-6">
                <div className="text-center text-gray-600">Loading sponsors...</div>
              </Card>
            ) : sponsors.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-gray-600">No sponsors yet</div>
              </Card>
            ) : (
              <div className="space-y-3">
                {sponsors.map((sponsor) => (
                  <Card key={sponsor.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {sponsor.sponsor_name}
                            </h3>
                            {sponsor.website && (
                              <a 
                                href={sponsor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{sponsor.email}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sponsor.donation_type === 'monetary'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {sponsor.donation_type === 'monetary' 
                                ? `$${sponsor.donation_amount} Donation` 
                                : 'Item Donation'
                              }
                            </span>
                            {sponsor.donation_type === 'items' && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sponsor.pickup_scheduled
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {sponsor.pickup_scheduled ? 'Pickup Scheduled' : 'Needs Pickup'}
                              </span>
                            )}
                            {sponsor.donation_amount >= 40 && sponsor.approved && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                Homepage Display
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sponsor.approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sponsor.approved ? 'Approved' : 'Pending'}
                        </div>
                      </div>

                      {/* Logo Preview */}
                      {sponsor.logo_url ? (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                          <div className="flex justify-center">
                            <img
                              src={sponsor.logo_url}
                              alt={`${sponsor.sponsor_name} logo`}
                              className="max-h-16 max-w-32 object-contain rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling!.style.display = 'flex';
                              }}
                            />
                            <div className="hidden items-center justify-center h-16 w-32 bg-gray-200 rounded">
                              <Building className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 text-center">No logo uploaded</p>
                        </div>
                      )}

                      {/* Item Description for Item Donations */}
                      {sponsor.donation_type === 'items' && sponsor.item_description && (
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-800">
                            <strong>Items:</strong> {sponsor.item_description}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons - Large Touch Targets */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Approve/Reject Section */}
                        {!sponsor.approved && (
                          <>
                            <Button
                              onClick={() => handleApproveSponsor(sponsor.id)}
                              disabled={processingSponsor === sponsor.id}
                              className="h-12 bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {processingSponsor === sponsor.id ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                              onClick={() => handleRejectSponsor(sponsor.id)}
                              disabled={processingSponsor === sponsor.id}
                              variant="outline"
                              className="h-12 border-red-300 text-red-600 hover:bg-red-50"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              {processingSponsor === sponsor.id ? 'Rejecting...' : 'Reject'}
                            </Button>
                          </>
                        )}

                        {/* Pickup Scheduling for Item Donations */}
                        {sponsor.approved && sponsor.donation_type === 'items' && !sponsor.pickup_scheduled && (
                          <Button
                            onClick={() => handleSchedulePickup(sponsor.id)}
                            className="h-12 col-span-2 bg-orange-600 hover:bg-orange-700 text-white"
                            size="sm"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Schedule Friday Pickup
                          </Button>
                        )}

                        {/* Individual/Business Categorization */}
                        {sponsor.approved && (
                          <div className="col-span-2 grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              className="h-10 text-sm"
                              size="sm"
                            >
                              Mark as Individual
                            </Button>
                            <Button
                              variant="outline"
                              className="h-10 text-sm"
                              size="sm"
                            >
                              Mark as Business
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                <strong>Project Date:</strong> Saturday, September 6, 2025 at Waxahachie Cemetery. Track volunteer coordination here.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <div className="text-lg font-bold text-gray-900">{volunteers.length}</div>
                <div className="text-xs text-gray-600">Total Volunteers</div>
              </Card>
              <Button
                onClick={handleExportVolunteers}
                className="h-16 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-5 w-5 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Volunteers List - Mobile Optimized */}
            {volunteersLoading ? (
              <Card className="p-6">
                <div className="text-center text-gray-600">Loading volunteers...</div>
              </Card>
            ) : volunteers.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-gray-600">No volunteers yet</div>
              </Card>
            ) : (
              <div className="space-y-3">
                {volunteers.map((volunteer) => (
                  <Card key={volunteer.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {volunteer.name}
                          </h3>
                          <div className="space-y-1 mt-1">
                            {volunteer.email && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {volunteer.email}
                              </p>
                            )}
                            {volunteer.phone && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {volunteer.phone}
                              </p>
                            )}
                            {volunteer.age_or_rank && (
                              <p className="text-sm text-gray-600">
                                <strong>Age/Rank:</strong> {volunteer.age_or_rank}
                              </p>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">
                              ID: {volunteer.volunteer_id}
                            </span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          volunteer.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : volunteer.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {volunteer.status === 'confirmed' 
                            ? 'Confirmed' 
                            : volunteer.status === 'contacted'
                            ? 'Contacted'
                            : 'Pending'
                          }
                        </div>
                      </div>

                      {/* Status Management - Large Touch Targets */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => handleUpdateVolunteerStatus(volunteer.id, 'pending')}
                          variant={volunteer.status === 'pending' ? 'default' : 'outline'}
                          className="h-10"
                          size="sm"
                        >
                          Pending
                        </Button>
                        <Button
                          onClick={() => handleUpdateVolunteerStatus(volunteer.id, 'contacted')}
                          variant={volunteer.status === 'contacted' ? 'default' : 'outline'}
                          className="h-10"
                          size="sm"
                        >
                          Contacted
                        </Button>
                        <Button
                          onClick={() => handleUpdateVolunteerStatus(volunteer.id, 'confirmed')}
                          variant={volunteer.status === 'confirmed' ? 'default' : 'outline'}
                          className="h-10"
                          size="sm"
                        >
                          Confirmed
                        </Button>
                      </div>

                      {/* Contact Actions */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {volunteer.email && (
                          <Button
                            variant="outline"
                            className="h-10"
                            size="sm"
                            onClick={() => window.location.href = `mailto:${volunteer.email}?subject=Eagle Scout Project - Cemetery Restoration Volunteer`}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        )}
                        {volunteer.phone && (
                          <Button
                            variant="outline"
                            className="h-10"
                            size="sm"
                            onClick={() => window.location.href = `tel:${volunteer.phone}`}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Contact Inquiries</h3>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">{dashboardStats.project.contactInquiries} inquiries</span>
              </div>
              <p className="text-gray-600 text-center py-8">Contact inquiry interface coming next...</p>
            </Card>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Project Volunteers</h2>
            {volunteers.length === 0 && !volunteersLoading ? (
              <Card className="p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Volunteers Yet</h3>
                <p className="text-gray-600">Volunteers who sign up for the Eagle Scout cemetery project will appear here.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {volunteers.map((volunteer) => (
                  <Card key={volunteer.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{volunteer.name}</h3>
                        <p className="text-gray-600">{volunteer.email}</p>
                        <p className="text-gray-600">{volunteer.phone}</p>
                        {volunteer.age_or_rank && (
                          <p className="text-sm text-gray-500">Age/Rank: {volunteer.age_or_rank}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={volunteer.status || 'pending'}
                          onChange={(e) => handleUpdateVolunteerStatus(volunteer.id, e.target.value as any)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="contacted">Contacted</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button onClick={handleExportVolunteers} className="min-h-[44px]">
                <Download className="h-4 w-4 mr-2" />
                Export Volunteers
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'manual-entry' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Manual Entry</h2>
              <p className="text-gray-600">Add sponsors and volunteers who contact us directly or sign up at the event.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ManualSponsorEntry onSponsorAdded={() => { fetchSponsors(); fetchRealStats(); }} />
              <ManualVolunteerEntry onVolunteerAdded={() => { fetchVolunteers(); fetchRealStats(); }} />
            </div>
          </div>
        )}

        {activeTab === 'email-testing' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Email System Testing</h2>
              <p className="text-gray-600">Test email templates and delivery in staging environment safely.</p>
            </div>
            
            <AdminEmailTesting setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'brackets' && (
          <TournamentDayOps teams={teams} onTeamUpdate={() => { fetchTeams(); fetchRealStats(); }} />
        )}

        {activeTab === 'fundraising' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Fundraising Dashboard</h3>
              <p className="text-gray-600 text-center py-8">Fundraising tracking interface coming next...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};