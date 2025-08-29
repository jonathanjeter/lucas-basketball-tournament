#!/usr/bin/env node

/**
 * Phase 1 Validation Script
 * Tests: Project setup, database connection, basic registration flow
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const VERCEL_URL = process.env.VERCEL_URL || 'http://localhost:5173';

console.log('🧪 PHASE 1 VALIDATION TESTS\n');

// Test 1: Environment Variables
console.log('1️⃣ Testing Environment Variables...');
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}
console.log('✅ Environment variables configured\n');

// Test 2: Supabase Connection
console.log('2️⃣ Testing Supabase Connection...');
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

try {
  const { data, error } = await supabase.from('teams').select('count').limit(1);
  if (error) throw error;
  console.log('✅ Supabase connection successful\n');
} catch (error) {
  console.error('❌ Supabase connection failed:', error.message);
  process.exit(1);
}

// Test 3: Database Schema
console.log('3️⃣ Testing Database Schema...');
const tables = ['teams', 'players', 'sponsors', 'volunteers'];

for (const table of tables) {
  try {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) throw error;
    console.log(`   ✅ Table '${table}' exists`);
  } catch (error) {
    console.error(`   ❌ Table '${table}' missing or inaccessible:`, error.message);
  }
}
console.log();

// Test 4: Registration Submission Test
console.log('4️⃣ Testing Registration Submission...');
const testRegistration = {
  name: 'Test Team ' + Date.now(),
  registration_type: 'team',
  donation_amount: 20,
  status: 'pending',
  approved: false,
  created_at: new Date().toISOString()
};

try {
  const { data, error } = await supabase
    .from('teams')
    .insert([testRegistration])
    .select();
  
  if (error) throw error;
  console.log('✅ Test registration inserted successfully');
  
  // Clean up test data
  if (data && data[0]) {
    await supabase.from('teams').delete().eq('id', data[0].id);
    console.log('✅ Test data cleaned up');
  }
} catch (error) {
  console.error('❌ Registration submission failed:', error.message);
}
console.log();

// Test 5: Frontend Accessibility (if deployed)
console.log('5️⃣ Testing Frontend Accessibility...');
try {
  const response = await fetch(VERCEL_URL);
  if (response.ok) {
    console.log(`✅ Frontend accessible at ${VERCEL_URL}`);
  } else {
    console.log(`⚠️ Frontend returned status: ${response.status}`);
  }
} catch (error) {
  console.log('⚠️ Frontend not accessible (may not be deployed yet)');
}

console.log('\n🎉 Phase 1 validation complete!');
console.log('\nNext Steps:');
console.log('- Deploy to Vercel: `vercel --prod`');
console.log('- Test registration form manually');
console.log('- Proceed to Phase 2 setup');
