// Supabase client configuration for Basketball Tournament App
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'https://your-project-reference.supabase.co') {
  console.error('❌ SUPABASE_URL not configured. Please update your .env.local file.')
  console.error('📖 Follow the setup guide: SUPABASE_SETUP.md')
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-actual-anon-key-here')) {
  console.error('❌ SUPABASE_ANON_KEY not configured. Please update your .env.local file.')
  console.error('📖 Follow the setup guide: SUPABASE_SETUP.md')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'basketball-tournament-app'
    }
  }
})

// =============================================================================
// DATABASE CONNECTION FUNCTIONS
// =============================================================================

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    return false
  }
}

// =============================================================================
// FUNDRAISING STATISTICS
// =============================================================================

// Get comprehensive fundraising statistics
export const getFundraisingStats = async () => {
  try {
    // Query teams and calculate stats directly
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('donation_amount, approved')
    
    if (teamsError) throw teamsError
    
    // Query total players count
    const { count: playersCount, error: playersError } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
    
    if (playersError) throw playersError
    
    // Query sponsors count
    const { count: sponsorsCount, error: sponsorsError } = await supabase
      .from('sponsors')
      .select('*', { count: 'exact', head: true })
    
    if (sponsorsError) throw sponsorsError
    
    // Calculate stats from the data
    const registeredTeams = teams?.length || 0
    const approvedTeams = teams?.filter(team => team.approved)?.length || 0
    const totalRaised = teams?.reduce((sum, team) => sum + (team.donation_amount || 0), 0) || 0
    
    const stats = {
      total_raised: totalRaised,
      goal: 400,
      registered_teams: registeredTeams,
      registered_players: playersCount || 0,
      total_sponsors: sponsorsCount || 0,
      approved_teams: approvedTeams,
      approved_sponsors: sponsorsCount || 0
    }
    
    console.log('📊 Fundraising stats calculated:', stats)
    
    return { data: stats, error: null }
  } catch (error) {
    console.error('Error fetching fundraising stats:', error)
    // Return fallback data if database isn't configured yet
    return {
      data: {
        total_raised: 0,
        goal: 400,
        registered_teams: 0,
        registered_players: 0,
        total_sponsors: 0,
        approved_teams: 0,
        approved_sponsors: 0
      },
      error
    }
  }
}

// =============================================================================
// TEAM MANAGEMENT
// =============================================================================

// Get all teams (for public display)
export const getTeams = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
    
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching teams:', error)
    return { data: [], error }
  }
}

// Get teams for admin (all teams regardless of approval status)
export const getTeamsForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        players (*)
      `)
      .order('created_at', { ascending: false })
    
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching teams for admin:', error)
    return { data: [], error }
  }
}

// Register a new team with players
export const registerTeam = async (teamData: any) => {
  try {
    console.log('🔥 registerTeam called with data:', teamData);
    
    // Extract contact info from first player
    const firstPlayer = teamData.players[0];
    const contactName = firstPlayer?.name || 'Unknown';
    const contactEmail = firstPlayer?.email || '';
    const contactPhone = firstPlayer?.contactPhone || firstPlayer?.emergencyContactPhone || '';
    const ageCategory = firstPlayer?.ageCategory || 'high-school-adult';
    
    // Start transaction: Insert team first
    console.log('💾 Inserting team record...');
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        team_name: teamData.teamName || `${contactName}'s Team`,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        age_category: ageCategory,
        registration_type: teamData.registrationType || 'individual',
        entry_fee_paid: false,
        payment_method: null,
        payment_amount: 0,
        donation_amount: teamData.donationAmount || 0,
        waiver_signed: true, // Form requires this to be checked
        medical_treatment_consent: teamData.medicalTreatmentConsent || false,
        additional_notes: null,
        approved: false, // Requires admin approval
        status: 'pending'
      })
      .select()
      .single()

    if (teamError) {
      console.error('❌ Team insert error:', teamError);
      throw teamError;
    }
    
    console.log('✅ Team inserted successfully:', team);

    // Insert players if provided
    if (teamData.players && teamData.players.length > 0) {
      console.log(`💾 Inserting ${teamData.players.length} players...`);
      
      const playersToInsert = teamData.players.map((player: any) => ({
        team_id: team.id,
        player_name: player.name,
        email: player.email || '',
        contact_phone: player.contactPhone || '',
        grade_level: player.gradeLevel,
        age_category: player.ageCategory,
        birthdate: player.birthdate,
        emergency_contact_name: player.emergencyContactName,
        emergency_contact_phone: player.emergencyContactPhone,
        medical_info: player.medicalInfo || '',
        parent_consent: player.parentConsent || false
      }));
      
      console.log('💾 Players to insert:', playersToInsert);

      const { error: playersError } = await supabase
        .from('players')
        .insert(playersToInsert)

      if (playersError) {
        console.error('❌ Players insert error:', playersError);
        throw playersError;
      }
      
      console.log('✅ Players inserted successfully');
    }

    console.log('🎉 Registration completed successfully!');
    return { data: team, error: null };
  } catch (error) {
    console.error('❌ Error registering team:', error);
    return { data: null, error };
  }
}

// Admin functions for team management
export const approveTeam = async (teamId: string) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .update({ approved: true, status: 'approved' })
      .eq('id', teamId)
      .select()
    
    return { data, error }
  } catch (error) {
    console.error('Error approving team:', error)
    return { data: null, error }
  }
}

export const rejectTeam = async (teamId: string) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .update({ approved: false, status: 'rejected' })
      .eq('id', teamId)
      .select()
    
    return { data, error }
  } catch (error) {
    console.error('Error rejecting team:', error)
    return { data: null, error }
  }
}

// =============================================================================
// PLAYER MANAGEMENT
// =============================================================================

// Get players (optionally filtered by team)
export const getPlayers = async (teamId?: string) => {
  try {
    let query = supabase.from('players').select('*')
    
    if (teamId) {
      query = query.eq('team_id', teamId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching players:', error)
    return { data: [], error }
  }
}

// =============================================================================
// SPONSOR MANAGEMENT
// =============================================================================

// Get approved sponsors for public display
export const getSponsors = async () => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('display_on_website', true)
      .eq('approved', true)
      .order('sponsor_level', { ascending: false })
    
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return { data: [], error }
  }
}

// Get all sponsors for admin
export const getSponsorsForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching sponsors for admin:', error)
    return { data: [], error }
  }
}

// Add a new sponsor
export const addSponsor = async (sponsorData: any) => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .insert({
        sponsor_name: sponsorData.sponsorName,
        contact_name: sponsorData.contactName,
        email: sponsorData.email,
        phone: sponsorData.phone,
        company: sponsorData.company,
        donation_type: sponsorData.donationType,
        donation_amount: sponsorData.donationAmount,
        item_description: sponsorData.itemDescription,
        website: sponsorData.website,
        sponsor_level: sponsorData.sponsorLevel || 'bronze',
        display_on_website: sponsorData.displayOnWebsite !== false,
        questions: sponsorData.questions
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error adding sponsor:', error)
    return { data: null, error }
  }
}

// Admin sponsor management
export const approveSponsor = async (sponsorId: string) => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .update({ approved: true })
      .eq('id', sponsorId)
      .select()
    
    return { data, error }
  } catch (error) {
    console.error('Error approving sponsor:', error)
    return { data: null, error }
  }
}

export const rejectSponsor = async (sponsorId: string) => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .update({ approved: false })
      .eq('id', sponsorId)
      .select()
    
    return { data, error }
  } catch (error) {
    console.error('Error rejecting sponsor:', error)
    return { data: null, error }
  }
}

// =============================================================================
// VOLUNTEER MANAGEMENT
// =============================================================================

// Get approved volunteers
export const getVolunteers = async () => {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return { data: [], error }
  }
}

// Get all volunteers for admin
export const getVolunteersForAdmin = async () => {
  return getVolunteers() // Same function for now
}

// Add a new volunteer
export const addVolunteer = async (volunteerData: any) => {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .insert({
        volunteer_name: volunteerData.name,
        age_or_rank: volunteerData.ageRank,
        email: volunteerData.email,
        phone: volunteerData.phone,
        dates_available: volunteerData.datesAvailable,
        transportation: volunteerData.transportation,
        skills: volunteerData.skills,
        role_preference: volunteerData.rolePreference,
        questions: volunteerData.questions
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error adding volunteer:', error)
    return { data: null, error }
  }
}

// =============================================================================
// CONTACT & INQUIRY MANAGEMENT
// =============================================================================

// Add contact inquiry
export const addContactInquiry = async (contactData: any) => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert({
        inquiry_type: contactData.inquiryType || 'general',
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        subject: contactData.subject,
        message: contactData.message
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error adding contact inquiry:', error)
    return { data: null, error }
  }
}

// =============================================================================
// PAYMENT MANAGEMENT
// =============================================================================

// Record a payment
export const recordPayment = async (paymentData: any) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        team_id: paymentData.teamId,
        sponsor_id: paymentData.sponsorId,
        payment_type: paymentData.paymentType,
        amount: paymentData.amount,
        payment_method: paymentData.paymentMethod,
        payment_status: paymentData.paymentStatus || 'completed',
        transaction_id: paymentData.transactionId,
        notes: paymentData.notes,
        processed_by: paymentData.processedBy
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error recording payment:', error)
    return { data: null, error }
  }
}

// =============================================================================
// UTILITY FUNCTIONS (for backwards compatibility)
// =============================================================================

// Mock functions that might be referenced in existing components
export const updateTeamDivision = async (teamId: string, division: string) => {
  return await supabase
    .from('teams')
    .update({ age_category: division })
    .eq('id', teamId)
    .select()
}

export const schedulePickup = async (sponsorId: string, pickupInfo: any) => {
  return await supabase
    .from('sponsors')
    .update({ 
      pickup_scheduled: true,
      pickup_date: pickupInfo.date,
      pickup_notes: pickupInfo.notes 
    })
    .eq('id', sponsorId)
    .select()
}

export const updateVolunteerStatus = async (volunteerId: string, status: string) => {
  return await supabase
    .from('volunteers')
    .update({ status })
    .eq('id', volunteerId)
    .select()
}

export const exportVolunteers = async () => {
  return await getVolunteers()
}

export const updateTeamCheckIn = async (teamId: string, checkedIn: boolean) => {
  return await supabase
    .from('teams')
    .update({ status: checkedIn ? 'checked-in' : 'approved' })
    .eq('id', teamId)
    .select()
}

export const updateTeamPayment = async (teamId: string, paymentData: any) => {
  return await supabase
    .from('teams')
    .update({
      entry_fee_paid: paymentData.paid,
      payment_method: paymentData.method,
      payment_amount: paymentData.amount
    })
    .eq('id', teamId)
    .select()
}

export const getTournamentSettings = async () => {
  const settings = {
    tournament_name: import.meta.env.VITE_TOURNAMENT_NAME || '3-on-3 Basketball Tournament',
    tournament_date: import.meta.env.VITE_TOURNAMENT_DATE || '2025-08-30',
    fundraising_goal: import.meta.env.VITE_FUNDRAISING_GOAL || 400,
    registration_deadline: '2025-08-25',
    entry_fee: 30,
    max_teams: 32
  }
  
  return { data: settings, error: null }
}

export const updateTournamentStatus = async (status: string) => {
  console.log('Tournament status updated to:', status)
  return { data: { status }, error: null }
}

export const createBrackets = async () => {
  const { data: teams } = await getTeams()
  const brackets = {
    middle_school: teams.filter((team: any) => team.age_category === 'middle-school'),
    high_school_adult: teams.filter((team: any) => team.age_category === 'high-school-adult')
  }
  
  return { data: brackets, error: null }
}

// Test storage (for file upload features)
export const testStorage = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets()
    if (error) throw error
    return true
  } catch (error) {
    console.error('Storage test failed:', error)
    return false
  }
}