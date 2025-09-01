// Supabase client configuration for Basketball Tournament App
import { createClient } from '@supabase/supabase-js'
import { sendRegistrationEmails, sendVolunteerEmails } from './email'

// =============================================================================
// MULTI-ENVIRONMENT CONFIGURATION
// =============================================================================

// Determine which environment to use
const isStaging = import.meta.env.VITE_STAGING_MODE === 'true'

// Get environment variables based on staging mode
const supabaseUrl = isStaging 
  ? import.meta.env.VITE_STAGING_SUPABASE_URL
  : import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey = isStaging
  ? import.meta.env.VITE_STAGING_SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY

// Log which environment is being used
if (isStaging) {
  console.log('🧪 STAGING MODE: Using staging database')
  console.log('📊 Safe to test - production data is protected')
} else {
  console.log('🚀 PRODUCTION MODE: Using live database')
  console.warn('⚠️  CAUTION: You are connected to LIVE PRODUCTION DATA!')
}

// Validate environment variables
const envPrefix = isStaging ? 'STAGING_' : ''
if (!supabaseUrl || supabaseUrl.includes('your-staging-project-url-here') || supabaseUrl === 'https://your-project-reference.supabase.co') {
  console.error(`❌ ${envPrefix}SUPABASE_URL not configured. Please update your .env.local file.`)
  console.error('📖 Follow the setup guide: SUPABASE_SETUP.md or STAGING_SETUP.md')
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-staging-project-anon-key-here') || supabaseAnonKey.includes('your-actual-anon-key-here')) {
  console.error(`❌ ${envPrefix}SUPABASE_ANON_KEY not configured. Please update your .env.local file.`)
  console.error('📖 Follow the setup guide: SUPABASE_SETUP.md or STAGING_SETUP.md')
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
      'X-Client-Info': `basketball-tournament-app-${isStaging ? 'staging' : 'production'}`
    }
  }
})

// Export environment info for UI components
export const environmentInfo = {
  isStaging,
  environment: isStaging ? 'staging' : 'production',
  databaseUrl: supabaseUrl
}

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
    
    // Send confirmation emails
    console.log('📧 Sending confirmation emails...');
    try {
      const emailResult = await sendRegistrationEmails(teamData);
      console.log('📧 Email results:', emailResult);
      
      // Return success with email status
      return { 
        data: team, 
        error: null,
        emailStatus: {
          participantEmailSent: emailResult.participantSuccess,
          adminEmailSent: emailResult.adminSuccess,
          emailErrors: emailResult.errors
        }
      };
    } catch (emailError) {
      console.warn('📧 Email sending failed, but registration was successful:', emailError);
      // Don't fail the registration if email fails
      return { 
        data: team, 
        error: null,
        emailStatus: {
          participantEmailSent: false,
          adminEmailSent: false,
          emailErrors: ['Email sending failed']
        }
      };
    }
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
    console.log('🔍 [addSponsor] Input data:', sponsorData)
    
    // Handle both field name formats for backward compatibility
    const sponsorName = sponsorData.sponsorName || sponsorData.name
    
    // Image upload processing FIRST (before database insert)
    let uploadedLogoUrl = null;
    if (sponsorData.logoFile) {
      console.log('🖼️ [addSponsor] Processing logo upload for file:', sponsorData.logoFile.name)
      const uploadResult = await uploadSponsorLogo(sponsorData.logoFile, sponsorName);
      if (uploadResult.error) {
        console.error('❌ [addSponsor] Logo upload failed:', uploadResult.error)
        // Continue with submission without logo rather than failing entirely
      } else {
        uploadedLogoUrl = uploadResult.logoUrl;
        console.log('✅ [addSponsor] Logo uploaded successfully:', uploadedLogoUrl)
      }
    }
    const contactName = sponsorData.contactName || sponsorData.name
    
    // Map donation type correctly - this is the CONTRIBUTION TYPE (monetary/items/services)
    // NOT the sponsor type (business/individual)
    let donationType = sponsorData.donationType
    if (!donationType && sponsorData.sponsor_type) {
      // If we get sponsor_type instead of donationType, we have a mapping error
      console.warn('⚠️ [addSponsor] Received sponsor_type instead of donationType. This suggests form field mapping issue.')
      // Don't use sponsor_type as donationType - they are different concepts
      donationType = null
    }
    
    // Validate donation_type against database constraint
    const validDonationTypes = ['monetary', 'items', 'services']
    if (donationType && !validDonationTypes.includes(donationType)) {
      const error = new Error(`Invalid donation_type: ${donationType}. Must be one of: ${validDonationTypes.join(', ')}`)
      console.error('❌ [addSponsor] Invalid donation_type:', error.message)
      return { data: null, error }
    }
    
    // Validate required fields
    if (!sponsorName || !sponsorData.email || !donationType) {
      const error = new Error('Missing required fields: name/sponsorName, email, or donationType (monetary/items/services)')
      console.error('❌ [addSponsor] Validation error:', error.message)
      console.error('❌ [addSponsor] Received fields:', {
        sponsorName: sponsorName,
        email: sponsorData.email,
        donationType: donationType,
        rawSponsorType: sponsorData.sponsor_type,
        rawDonationType: sponsorData.donationType
      })
      return { data: null, error }
    }

    // Handle sponsor type (business/individual) - inferred from company field
    // If sponsor_type is provided, use it to guide field mapping
    let company = sponsorData.company;
    if (sponsorData.sponsor_type === 'individual') {
      // For individuals, clear company field even if accidentally provided
      company = null;
    } else if (sponsorData.sponsor_type === 'business' && !company) {
      // For businesses without company name, use sponsor name as company
      company = sponsorName;
    }

    // Prepare database insert object with correct field mapping
    const insertData = {
      sponsor_name: sponsorName,
      contact_name: contactName,
      email: sponsorData.email,
      phone: sponsorData.phone,
      company: company,
      donation_type: donationType, // This is the CONTRIBUTION type (monetary/items/services)
      donation_amount: sponsorData.donationAmount || sponsorData.amount,
      item_description: sponsorData.itemDescription || sponsorData.item_description,
      website: sponsorData.website,
      sponsor_level: sponsorData.sponsorLevel || sponsorData.sponsor_level || 'bronze',
      display_on_website: sponsorData.displayOnWebsite !== false,
      approved: sponsorData.approved !== undefined ? sponsorData.approved : false,
      questions: sponsorData.questions,
      logo_url: uploadedLogoUrl || sponsorData.logoUrl || sponsorData.logo_url || null
    }
    
    console.log('📝 [addSponsor] Database insert data:', insertData)
    console.log('📝 [addSponsor] Field mapping summary:', {
      'sponsor_type (business/individual)': sponsorData.sponsor_type,
      'donationType (contribution type)': donationType,
      'company field': company,
      'inferred sponsor category': company ? 'business' : 'individual'
    })

    const { data, error } = await supabase
      .from('sponsors')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ [addSponsor] Database error:', error)
      return { data: null, error }
    }

    console.log('✅ [addSponsor] Success:', data)
    return { data, error: null }
  } catch (error) {
    console.error('❌ [addSponsor] Unexpected error:', error)
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

// Get approved sponsors for homepage display
export const getApprovedSponsors = async () => {
  try {
    console.log('🔍 [getApprovedSponsors] Fetching approved sponsors...')
    
    const { data, error } = await supabase
      .from('sponsors')
      .select('id, sponsor_name, website, logo_url, donation_amount, sponsor_level, company')
      .eq('approved', true)
      .eq('display_on_website', true)
      .order('donation_amount', { ascending: false, nullsFirst: false })
    
    if (error) {
      console.error('❌ [getApprovedSponsors] Database error:', error)
      return { data: [], error }
    }

    console.log('✅ [getApprovedSponsors] Found sponsors:', data?.length || 0)
    return { data: data || [], error: null }
  } catch (error) {
    console.error('❌ [getApprovedSponsors] Unexpected error:', error)
    return { data: [], error }
  }
}

// Upload sponsor logo to Supabase storage
export const uploadSponsorLogo = async (file: File, sponsorName: string) => {
  try {
    console.log('📤 [uploadSponsorLogo] Starting upload process...')
    console.log('   - Sponsor name:', sponsorName)
    console.log('   - File name:', file.name)
    console.log('   - File type:', file.type)
    console.log('   - File size:', `${(file.size / 1024 / 1024).toFixed(2)} MB`)
    console.log('   - Supabase URL:', environmentInfo.databaseUrl)
    console.log('   - Environment:', environmentInfo.environment)
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      const errorMsg = `Invalid file type: ${file.type}. Please upload a JPEG, PNG, or WebP image.`;
      console.error('❌ [uploadSponsorLogo] File type validation failed:', errorMsg)
      throw new Error(errorMsg);
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      const errorMsg = `File size too large: ${(file.size / 1024 / 1024).toFixed(2)} MB. Please upload an image smaller than 5MB.`;
      console.error('❌ [uploadSponsorLogo] File size validation failed:', errorMsg)
      throw new Error(errorMsg);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${sponsorName.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
    const filePath = `sponsor-logos/${fileName}`;

    console.log('📂 [uploadSponsorLogo] Upload details:')
    console.log('   - Generated filename:', fileName)
    console.log('   - Full path:', filePath)
    console.log('   - Storage bucket: tournament-files')

    // Check if storage is accessible first
    console.log('🔍 [uploadSponsorLogo] Testing storage bucket access...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    if (bucketError) {
      console.error('❌ [uploadSponsorLogo] Cannot access storage buckets:', bucketError)
      throw new Error(`Storage access failed: ${bucketError.message}`);
    } else {
      console.log('✅ [uploadSponsorLogo] Storage accessible. Available buckets:', buckets?.map(b => b.name))
      
      // Check if tournament-files bucket exists
      const tournamentBucket = buckets?.find(b => b.name === 'tournament-files')
      if (!tournamentBucket) {
        console.error('❌ [uploadSponsorLogo] tournament-files bucket does not exist!')
        console.log('📦 Available buckets:', buckets?.map(b => b.name) || 'none')
        throw new Error('tournament-files storage bucket not found. Please create the bucket in Supabase dashboard or contact admin.');
      }
    }

    // Upload to Supabase storage
    console.log('🚀 [uploadSponsorLogo] Starting file upload...')
    const { data, error } = await supabase.storage
      .from('tournament-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ [uploadSponsorLogo] Upload failed with error:', error)
      console.error('   - Error code:', error.statusCode || 'unknown')
      console.error('   - Error message:', error.message)
      console.error('   - Error details:', error)
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('✅ [uploadSponsorLogo] Upload successful:', data)

    // Get public URL
    console.log('🔗 [uploadSponsorLogo] Generating public URL...')
    const { data: { publicUrl } } = supabase.storage
      .from('tournament-files')
      .getPublicUrl(filePath);

    console.log('✅ [uploadSponsorLogo] Public URL generated:', publicUrl)
    return { logoUrl: publicUrl, error: null };
  } catch (error) {
    console.error('❌ [uploadSponsorLogo] Unexpected error:', error)
    return { logoUrl: null, error: error instanceof Error ? error.message : 'Unknown error' };
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
    console.log('🔍 [addVolunteer] Input data:', volunteerData)
    
    // First, save volunteer to database with proper field mapping
    const { data, error } = await supabase
      .from('volunteers')
      .insert({
        volunteer_name: volunteerData.name,
        age_or_rank: volunteerData.ageRank || volunteerData.ageOrRank || 'Adult', // Handle both field names
        email: volunteerData.email || 'noemail@provided.com',
        phone: volunteerData.phone || 'No phone provided',
        dates_available: 'Saturday September 6, 2025 - Cemetery Headstone Restoration Project',
        transportation: 'yes', // Default for cemetery project volunteers
        skills: volunteerData.skills || null,
        role_preference: volunteerData.rolePreference || null,
        questions: volunteerData.questions || null
      })
      .select()
      .single()

    if (error) {
      console.error('❌ [addVolunteer] Database error:', error)
      return { data: null, error }
    }

    console.log('✅ [addVolunteer] Success:', data)

    // Send volunteer confirmation emails
    console.log('📧 Sending volunteer confirmation emails...')
    try {
      // Prepare email data with cemetery project details
      const emailData = {
        name: volunteerData.name,
        email: volunteerData.email,
        phone: volunteerData.phone,
        ageRank: volunteerData.ageRank || volunteerData.ageOrRank || 'Adult',
        projectDate: 'Saturday, September 6, 2025',
        projectTime: '7:30 AM - 12:00 PM',
        projectLocation: 'Pioneer Cemetery, Waxahachie, TX',
        projectDescription: 'Cemetery headstone restoration with Sons of American Revolution'
      }
      
      const emailResult = await sendVolunteerEmails(emailData)
      console.log('📧 Email results:', emailResult)
    } catch (emailError) {
      console.warn('📧 Failed to send volunteer emails:', emailError)
      // Don't fail the whole operation if email fails
    }

    return { data, error: null }
  } catch (error) {
    console.error('❌ [addVolunteer] Unexpected error:', error)
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