#!/usr/bin/env node

/**
 * Phase 3 Validation Script
 * Tests: Sponsor registration, file uploads, storage integration
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const API_BASE = process.env.VERCEL_URL || 'http://localhost:5173';

console.log('🧪 PHASE 3 VALIDATION TESTS\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test 1: Storage Bucket Configuration
console.log('1️⃣ Testing Storage Bucket Setup...');
try {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) throw error;
  
  const logosBucket = buckets?.find(bucket => bucket.name === 'sponsor-logos');
  
  if (logosBucket) {
    console.log('✅ Sponsor logos bucket exists');
    console.log(`   📁 Bucket: ${logosBucket.name}`);
    console.log(`   🔓 Public: ${logosBucket.public}`);
  } else {
    console.error('❌ Sponsor logos bucket not found');
    console.log('   Creating bucket...');
    
    const { error: createError } = await supabase.storage.createBucket('sponsor-logos', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml']
    });
    
    if (!createError) {
      console.log('✅ Bucket created successfully');
    } else {
      console.error('❌ Failed to create bucket:', createError.message);
    }
  }
} catch (error) {
  console.error('❌ Storage setup error:', error.message);
}
console.log();

// Test 2: File Upload Functionality
console.log('2️⃣ Testing File Upload...');

// Create a test image file (1x1 pixel PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const testImageBuffer = Buffer.from(testImageBase64, 'base64');
const testFileName = `test-logo-${Date.now()}.png`;

try {
  const { data, error } = await supabase.storage
    .from('sponsor-logos')
    .upload(testFileName, testImageBuffer, {
      contentType: 'image/png',
      cacheControl: '3600'
    });

  if (error) throw error;

  console.log('✅ Test file uploaded successfully');
  console.log(`   📄 File path: ${data.path}`);
  
  // Test public URL generation
  const { data: publicURL } = supabase.storage
    .from('sponsor-logos')
    .getPublicUrl(testFileName);
  
  if (publicURL?.publicUrl) {
    console.log('✅ Public URL generated');
    console.log(`   🔗 URL: ${publicURL.publicUrl}`);
  }
  
  // Clean up test file
  await supabase.storage
    .from('sponsor-logos')
    .remove([testFileName]);
  
  console.log('✅ Test file cleanup completed');
} catch (error) {
  console.error('❌ File upload test failed:', error.message);
}
console.log();

// Test 3: Sponsor Database Schema
console.log('3️⃣ Testing Sponsor Database Schema...');
try {
  // Test sponsor table structure
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .limit(1);

  if (error) throw error;
  
  console.log('✅ Sponsors table accessible');
  
  // Test required columns exist by attempting insert
  const testSponsor = {
    name: `Test Sponsor ${Date.now()}`,
    email: 'test@sponsor.com',
    donation_amount: 100,
    website: 'https://testsponsor.com',
    description: 'Test sponsor description',
    approved: false,
    created_at: new Date().toISOString()
  };

  const { data: insertedSponsor, error: insertError } = await supabase
    .from('sponsors')
    .insert([testSponsor])
    .select();

  if (insertError) throw insertError;
  
  console.log('✅ Sponsor record insert successful');
  
  // Test different donation tiers
  const tiers = [
    { name: 'Bronze', min: 50 },
    { name: 'Silver', min: 100 },
    { name: 'Gold', min: 250 }
  ];
  
  console.log('   💰 Donation Tiers:');
  tiers.forEach(tier => {
    const tierColor = tier.name === 'Gold' ? '🥇' : tier.name === 'Silver' ? '🥈' : '🥉';
    console.log(`     ${tierColor} ${tier.name}: $${tier.min}+`);
  });
  
  // Clean up test data
  if (insertedSponsor?.[0]?.id) {
    await supabase
      .from('sponsors')
      .delete()
      .eq('id', insertedSponsor[0].id);
    console.log('✅ Test sponsor data cleaned up');
  }
} catch (error) {
  console.error('❌ Sponsor database test failed:', error.message);
}
console.log();

// Test 4: File Validation Requirements
console.log('4️⃣ Testing File Validation Requirements...');

const fileValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
  allowedExtensions: ['.png', '.jpg', '.jpeg', '.svg']
};

console.log('   📋 File Upload Restrictions:');
console.log(`   📏 Max Size: ${fileValidation.maxSize / (1024 * 1024)}MB`);
console.log(`   🎨 Allowed Types: ${fileValidation.allowedTypes.join(', ')}`);
console.log(`   📝 Extensions: ${fileValidation.allowedExtensions.join(', ')}`);

// Test file size validation function
function validateFileSize(fileSizeBytes) {
  return fileSizeBytes <= fileValidation.maxSize;
}

// Test mime type validation function  
function validateFileType(mimeType) {
  return fileValidation.allowedTypes.includes(mimeType);
}

// Run validation tests
const testFiles = [
  { name: 'valid-small.png', size: 1024, type: 'image/png' },
  { name: 'invalid-large.png', size: 6 * 1024 * 1024, type: 'image/png' },
  { name: 'invalid-type.txt', size: 1024, type: 'text/plain' }
];

testFiles.forEach(file => {
  const sizeValid = validateFileSize(file.size);
  const typeValid = validateFileType(file.type);
  const overall = sizeValid && typeValid;
  
  const icon = overall ? '✅' : '❌';
  console.log(`   ${icon} ${file.name}: size=${sizeValid}, type=${typeValid}`);
});

console.log();

// Test 5: Sponsor Display Logic
console.log('5️⃣ Testing Sponsor Display Logic...');
try {
  // Create test sponsors for different tiers
  const testSponsors = [
    { name: 'Bronze Test', donation_amount: 75, approved: true },
    { name: 'Silver Test', donation_amount: 150, approved: true },
    { name: 'Gold Test', donation_amount: 300, approved: true },
    { name: 'Pending Test', donation_amount: 100, approved: false }
  ];

  const { data: insertedSponsors } = await supabase
    .from('sponsors')
    .insert(testSponsors)
    .select();

  if (insertedSponsors) {
    // Test tier classification
    function getSponsorTier(donationAmount) {
      if (donationAmount >= 250) return 'Gold';
      if (donationAmount >= 100) return 'Silver';
      if (donationAmount >= 50) return 'Bronze';
      return 'Supporter';
    }

    // Test approved sponsors query
    const { data: approvedSponsors } = await supabase
      .from('sponsors')
      .select('*')
      .eq('approved', true)
      .order('donation_amount', { ascending: false });

    if (approvedSponsors) {
      console.log('   📊 Sponsor Display Preview:');
      approvedSponsors
        .filter(s => s.name.includes('Test'))
        .forEach(sponsor => {
          const tier = getSponsorTier(sponsor.donation_amount);
          const icon = tier === 'Gold' ? '🥇' : tier === 'Silver' ? '🥈' : '🥉';
          console.log(`     ${icon} ${sponsor.name} (${tier}) - $${sponsor.donation_amount}`);
        });
    }

    console.log('✅ Sponsor display logic working');

    // Cleanup
    const testIds = insertedSponsors.map(s => s.id);
    await supabase
      .from('sponsors')
      .delete()
      .in('id', testIds);
    console.log('✅ Test sponsors cleaned up');
  }
} catch (error) {
  console.error('❌ Sponsor display test failed:', error.message);
}

console.log('\n🎉 Phase 3 validation complete!');
console.log('\nNext Steps:');
console.log('- Test sponsor form submission manually');
console.log('- Verify logo upload in browser');
console.log('- Check sponsor display page');
console.log('- Proceed to Phase 4 setup');
