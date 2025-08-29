// EmailJS configuration for Basketball Tournament App
import emailjs from '@emailjs/browser'

// =============================================================================
// EMAILJS CONFIGURATION
// =============================================================================

// Get EmailJS configuration from environment
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// Template IDs for different email types
const PARTICIPANT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID

// Initialize EmailJS (call once on app start)
export const initializeEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY)
    console.log('📧 EmailJS initialized successfully')
  } else {
    console.warn('⚠️ EmailJS not configured - email notifications disabled')
  }
}

// Check if EmailJS is properly configured
export const isEmailConfigured = (): boolean => {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY && PARTICIPANT_TEMPLATE_ID && ADMIN_TEMPLATE_ID)
}

// Debug function to check EmailJS configuration
export const debugEmailConfig = () => {
  console.log('🔍 EmailJS Configuration Debug:')
  console.log('SERVICE_ID:', EMAILJS_SERVICE_ID ? 'SET' : 'MISSING')
  console.log('PUBLIC_KEY:', EMAILJS_PUBLIC_KEY ? 'SET' : 'MISSING') 
  console.log('PARTICIPANT_TEMPLATE_ID:', PARTICIPANT_TEMPLATE_ID ? 'SET' : 'MISSING')
  console.log('ADMIN_TEMPLATE_ID:', ADMIN_TEMPLATE_ID ? 'SET' : 'MISSING')
  console.log('Is Configured:', isEmailConfigured())
  
  if (!isEmailConfigured()) {
    console.log('❌ Missing environment variables:')
    if (!EMAILJS_SERVICE_ID) console.log('  - VITE_EMAILJS_SERVICE_ID')
    if (!EMAILJS_PUBLIC_KEY) console.log('  - VITE_EMAILJS_PUBLIC_KEY')
    if (!PARTICIPANT_TEMPLATE_ID) console.log('  - VITE_EMAILJS_TEMPLATE_ID')
    if (!ADMIN_TEMPLATE_ID) console.log('  - VITE_EMAILJS_ADMIN_TEMPLATE_ID')
  }
}

// =============================================================================
// EMAIL TEMPLATE DATA TYPES
// =============================================================================

export interface ParticipantEmailData {
  // Participant info
  participant_name: string
  participant_email: string
  team_name: string
  registration_type: string
  
  // Tournament details
  tournament_name: string
  tournament_date: string
  tournament_time: string
  tournament_location: string
  tournament_address: string
  
  // Registration details
  players_count: number
  age_category: string
  donation_amount: number
  
  // Contact info
  contact_name: string
  contact_phone: string
  contact_email: string
  
  // Additional info
  next_steps: string
  payment_info: string
}

export interface AdminEmailData {
  // Registration summary
  team_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
  registration_type: string
  age_category: string
  players_count: number
  donation_amount: number
  
  // Players list
  players_list: string
  
  // Timestamp
  registration_date: string
  
  // Admin info
  admin_dashboard_url: string
}

// =============================================================================
// EMAIL SENDING FUNCTIONS WITH RETRY LOGIC
// =============================================================================

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Enhanced email sending with retry logic
async function sendEmailWithRetry(
  serviceId: string, 
  templateId: string, 
  data: any, 
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<{success: boolean, error?: string, attempts: number}> {
  let lastError: any = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${maxRetries}...`)
      
      const result = await emailjs.send(serviceId, templateId, data)
      
      if (result.status === 200) {
        console.log(`✅ Email sent successfully on attempt ${attempt}`)
        return { success: true, attempts: attempt }
      } else {
        lastError = `Email service returned status: ${result.status}`
        console.warn(`⚠️ Attempt ${attempt} failed with status ${result.status}`)
      }
    } catch (error) {
      lastError = error
      console.warn(`⚠️ Attempt ${attempt} failed:`, error)
    }
    
    // Wait before retry (except on last attempt)
    if (attempt < maxRetries) {
      console.log(`⏳ Waiting ${delayMs}ms before retry...`)
      await delay(delayMs)
      delayMs *= 1.5 // Exponential backoff
    }
  }
  
  const errorMessage = lastError instanceof Error ? lastError.message : String(lastError)
  console.error(`❌ All ${maxRetries} email attempts failed. Last error:`, errorMessage)
  return { success: false, error: errorMessage, attempts: maxRetries }
}

// Send confirmation email to participant
export const sendParticipantConfirmation = async (
  data: ParticipantEmailData, 
  retries: number = 3
): Promise<{success: boolean, error?: string, attempts?: number}> => {
  if (!isEmailConfigured()) {
    console.warn('📧 EmailJS not configured - skipping participant confirmation email')
    return { success: false, error: 'EmailJS not configured' }
  }

  try {
    console.log('📧 Sending participant confirmation email to:', data.participant_email)
    
    const result = await sendEmailWithRetry(
      EMAILJS_SERVICE_ID!,
      PARTICIPANT_TEMPLATE_ID!,
      data,
      retries
    )

    if (result.success) {
      console.log(`✅ Participant confirmation email sent successfully after ${result.attempts} attempts`)
      return { success: true, attempts: result.attempts }
    } else {
      console.error('❌ Failed to send participant confirmation email after all retries')
      return { success: false, error: result.error, attempts: result.attempts }
    }
  } catch (error) {
    console.error('❌ Unexpected error sending participant confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send notification email to admin
export const sendAdminNotification = async (
  data: AdminEmailData, 
  retries: number = 3
): Promise<{success: boolean, error?: string, attempts?: number}> => {
  if (!isEmailConfigured()) {
    console.warn('📧 EmailJS not configured - skipping admin notification email')
    return { success: false, error: 'EmailJS not configured' }
  }

  try {
    console.log('📧 Sending admin notification email for team:', data.team_name)
    
    const result = await sendEmailWithRetry(
      EMAILJS_SERVICE_ID!,
      ADMIN_TEMPLATE_ID!,
      data,
      retries
    )

    if (result.success) {
      console.log(`✅ Admin notification email sent successfully after ${result.attempts} attempts`)
      return { success: true, attempts: result.attempts }
    } else {
      console.error('❌ Failed to send admin notification email after all retries')
      return { success: false, error: result.error, attempts: result.attempts }
    }
  } catch (error) {
    console.error('❌ Unexpected error sending admin notification email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// =============================================================================
// TOURNAMENT-SPECIFIC EMAIL DATA BUILDERS
// =============================================================================

// Build participant confirmation email data from registration
export const buildParticipantEmailData = (registrationData: any): ParticipantEmailData => {
  const firstPlayer = registrationData.players?.[0]
  const contactName = firstPlayer?.name || 'Participant'
  const contactEmail = firstPlayer?.email || registrationData.contactEmail || ''
  
  return {
    // Participant info
    participant_name: contactName,
    participant_email: contactEmail,
    team_name: registrationData.teamName || `${contactName}'s Team`,
    registration_type: registrationData.registrationType || 'individual',
    
    // Tournament details - Correct date/time/location
    tournament_name: '3-on-3 Basketball Tournament',
    tournament_date: 'Saturday, August 30, 2025',
    tournament_time: 'Check-in: 7:30 AM | Tournament: 8:00 AM - 12:00 PM (Noon)',
    tournament_location: 'Finley Junior High School Gym',
    tournament_address: '2401 Brown Street, Waxahachie, TX 75165',
    
    // Registration details
    players_count: registrationData.players?.length || 1,
    age_category: firstPlayer?.ageCategory || 'high-school-adult',
    donation_amount: registrationData.donationAmount || 0,
    
    // Contact info
    contact_name: contactName,
    contact_phone: firstPlayer?.contactPhone || firstPlayer?.emergencyContactPhone || '',
    contact_email: contactEmail,
    
    // Additional info
    next_steps: 'Please arrive at 7:30 AM sharp for check-in. Bring water, basketball shoes, and your suggested donation ($10 per player)!',
    payment_info: registrationData.donationAmount > 0 
      ? `Thank you for your $${registrationData.donationAmount} donation to support Lucas's Eagle Scout project! Suggested donation ($10 per player) will be collected at check-in.`
      : 'Suggested donation is $10 per player, payable at check-in (cash or check made out to "Lucas Eagle Scout Project").  Donations appreciated but not required!'
  }
}

// Build admin notification email data from registration
export const buildAdminEmailData = (registrationData: any): AdminEmailData => {
  const firstPlayer = registrationData.players?.[0]
  const contactName = firstPlayer?.name || 'Unknown'
  const contactEmail = firstPlayer?.email || 'No email provided'
  const contactPhone = firstPlayer?.contactPhone || firstPlayer?.emergencyContactPhone || 'No phone provided'
  
  // Build players list
  const playersList = registrationData.players?.map((player: any, index: number) => 
    `${index + 1}. ${player.name} (${player.gradeLevel}, ${player.ageCategory})`
  ).join('\n') || 'No player details'
  
  return {
    // Registration summary
    team_name: registrationData.teamName || `${contactName}'s Team`,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    registration_type: registrationData.registrationType || 'individual',
    age_category: firstPlayer?.ageCategory || 'high-school-adult',
    players_count: registrationData.players?.length || 1,
    donation_amount: registrationData.donationAmount || 0,
    
    // Players list
    players_list: playersList,
    
    // Timestamp
    registration_date: new Date().toLocaleString(),
    
    // Admin info
    admin_dashboard_url: `${window.location.origin}/admin`
  }
}

// =============================================================================
// BULK EMAIL FUNCTIONS (for future use)
// =============================================================================

// Send emails to both participant and admin with detailed reporting
export const sendRegistrationEmails = async (registrationData: any): Promise<{
  participantSuccess: boolean
  adminSuccess: boolean
  errors: string[]
  details: {
    participantAttempts?: number
    adminAttempts?: number
    participantError?: string
    adminError?: string
  }
}> => {
  console.log('📧 Starting registration email sequence...')
  const errors: string[] = []
  const details: any = {}
  
  // Send participant confirmation
  console.log('📧 Step 1: Sending participant confirmation...')
  const participantData = buildParticipantEmailData(registrationData)
  const participantResult = await sendParticipantConfirmation(participantData)
  
  details.participantAttempts = participantResult.attempts
  if (!participantResult.success && participantResult.error) {
    details.participantError = participantResult.error
    errors.push(`Participant email failed after ${participantResult.attempts} attempts: ${participantResult.error}`)
  }
  
  // Send admin notification (continue even if participant email failed)
  console.log('📧 Step 2: Sending admin notification...')
  const adminData = buildAdminEmailData(registrationData)
  const adminResult = await sendAdminNotification(adminData)
  
  details.adminAttempts = adminResult.attempts
  if (!adminResult.success && adminResult.error) {
    details.adminError = adminResult.error
    errors.push(`Admin email failed after ${adminResult.attempts} attempts: ${adminResult.error}`)
  }
  
  // Log final results
  const summary = {
    participantSuccess: participantResult.success,
    adminSuccess: adminResult.success,
    totalErrors: errors.length
  }
  console.log('📧 Registration email sequence complete:', summary)
  
  return {
    participantSuccess: participantResult.success,
    adminSuccess: adminResult.success,
    errors,
    details
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Get configuration status for debugging
export const getEmailConfigStatus = () => {
  return {
    configured: isEmailConfigured(),
    serviceId: !!EMAILJS_SERVICE_ID,
    publicKey: !!EMAILJS_PUBLIC_KEY,
    participantTemplate: !!PARTICIPANT_TEMPLATE_ID,
    adminTemplate: !!ADMIN_TEMPLATE_ID
  }
}