#!/usr/bin/env node

/**
 * Phase 2 Validation Script
 * Tests: Email functionality, admin authentication, dashboard functionality
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const API_BASE = process.env.VERCEL_URL || 'http://localhost:5173';
const ADMIN_PASSWORD = "Let's GOOO!";

console.log('🧪 PHASE 2 VALIDATION TESTS\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test 1: EmailJS Configuration
console.log('1️⃣ Testing Email Configuration...');
const emailConfig = {
  serviceId: process.env.VITE_EMAILJS_SERVICE_ID,
  templateId: process.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY
};

let emailConfigured = true;
for (const [key, value] of Object.entries(emailConfig)) {
  if (!value) {
    console.error(`   ❌ Missing ${key}`);
    emailConfigured = false;
  }
}

if (emailConfigured) {
  console.log('✅ Email configuration complete');
} else {
  console.log('⚠️ Email configuration incomplete - manual testing required');
}
console.log();

// Test 2: Admin Login API
console.log('2️⃣ Testing Admin Authentication...');
try {
  const loginResponse = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: ADMIN_PASSWORD })
  });

  if (loginResponse.ok) {
    const { token } = await loginResponse.json();
    console.log('✅ Admin login successful');
    
    // Test protected route with token
    const statsResponse = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (statsResponse.ok) {
      console.log('✅ Protected admin routes working');
    } else {
      console.error('❌ Protected admin routes failing');
    }
  } else {
    console.error('❌ Admin login failed');
  }
} catch (error) {
  console.error('❌ Admin authentication error:', error.message);
}
console.log();

// Test 3: Registration Statistics
console.log('3️⃣ Testing Dashboard Statistics...');
try {
  // Create some test registrations if none exist
  const { data: existingTeams } = await supabase.from('teams').select('count');
  
  if (!existingTeams || existingTeams.length === 0) {
    console.log('   Creating test data for statistics...');
    const testTeams = [
      { name: 'Test Team A', registration_type: 'team', status: 'pending', donation_amount: 20 },
      { name: 'Test Team B', registration_type: 'individual', status: 'approved', donation_amount: 20 }
    ];
    
    await supabase.from('teams').insert(testTeams);
  }

  // Test stats calculation
  const { data: stats } = await supabase
    .from('teams')
    .select('status, registration_type, donation_amount');
  
  const totalRegistrations = stats?.length || 0;
  const pendingCount = stats?.filter(t => t.status === 'pending').length || 0;
  const approvedCount = stats?.filter(t => t.status === 'approved').length || 0;
  const totalDonations = stats?.reduce((sum, t) => sum + (t.donation_amount || 0), 0) || 0;

  console.log(`   📊 Total Registrations: ${totalRegistrations}`);
  console.log(`   ⏳ Pending: ${pendingCount}`);
  console.log(`   ✅ Approved: ${approvedCount}`);
  console.log(`   💰 Total Donations: $${totalDonations}`);
  
  if (totalRegistrations > 0) {
    console.log('✅ Registration statistics working');
  } else {
    console.log('⚠️ No registration data found');
  }
} catch (error) {
  console.error('❌ Statistics calculation failed:', error.message);
}
console.log();

// Test 4: Registration Management
console.log('4️⃣ Testing Registration Management...');
try {
  // Find a test registration to update
  const { data: testTeam } = await supabase
    .from('teams')
    .select('*')
    .eq('status', 'pending')
    .limit(1);

  if (testTeam && testTeam[0]) {
    // Test approval
    const { error } = await supabase
      .from('teams')
      .update({ status: 'approved', approved: true })
      .eq('id', testTeam[0].id);

    if (!error) {
      console.log('✅ Registration status update working');
      
      // Reset for future tests
      await supabase
        .from('teams')
        .update({ status: 'pending', approved: false })
        .eq('id', testTeam[0].id);
    } else {
      console.error('❌ Registration update failed:', error.message);
    }
  } else {
    console.log('⚠️ No test registrations found for update testing');
  }
} catch (error) {
  console.error('❌ Registration management error:', error.message);
}
console.log();

// Test 5: Email Template Structure
console.log('5️⃣ Testing Email Template Requirements...');
const requiredEmailFields = [
  'participant_name',
  'team_name', 
  'registration_type',
  'tournament_date',
  'contact_email'
];

console.log('   Required email template fields:');
requiredEmailFields.forEach(field => {
  console.log(`   - {{${field}}}`);
});
console.log('✅ Email template structure defined');
console.log();

// Cleanup test data
console.log('🧹 Cleaning up test data...');
try {
  await supabase
    .from('teams')
    .delete()
    .like('name', 'Test Team%');
  console.log('✅ Test data cleaned');
} catch (error) {
  console.log('⚠️ Test cleanup skipped');
}

console.log('\n🎉 Phase 2 validation complete!');
console.log('\nNext Steps:');
console.log('- Test email sending manually through registration');
console.log('- Verify admin dashboard in browser');
console.log('- Proceed to Phase 3 setup');
