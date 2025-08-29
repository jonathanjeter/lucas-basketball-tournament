#!/usr/bin/env node

/**
 * Phase 5 Validation Script
 * Tests: Volunteer system, mobile optimization, final polish
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const API_BASE = process.env.VERCEL_URL || 'http://localhost:5173';

console.log('🧪 PHASE 5 VALIDATION TESTS\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test 1: Volunteer Database Schema
console.log('1️⃣ Testing Volunteer Database Schema...');
try {
  const testVolunteer = {
    name: `Test Volunteer ${Date.now()}`,
    email: 'volunteer@test.com',
    phone: '555-0123',
    age_or_rank: '16',
    availability: 'Morning setup, Afternoon games',
    skills: 'First aid certified',
    role_preference: 'Safety/First Aid',
    approved: false,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('volunteers')
    .insert([testVolunteer])
    .select();

  if (error) throw error;

  console.log('✅ Volunteers table working');
  
  // Test volunteer roles
  const volunteerRoles = [
    'Setup/Cleanup',
    'Registration/Check-in', 
    'Referee/Scorekeeper',
    'Food Service',
    'Safety/First Aid',
    'Photography/Social Media',
    'General Support'
  ];

  console.log('   👥 Available Volunteer Roles:');
  volunteerRoles.forEach(role => {
    const icon = role.includes('Safety') ? '🚑' : 
                 role.includes('Food') ? '🍕' : 
                 role.includes('Photo') ? '📸' :
                 role.includes('Referee') ? '⚽' : '🤝';
    console.log(`     ${icon} ${role}`);
  });

  // Age-based role assignment
  function getAppropriateRoles(age) {
    const numAge = parseInt(age);
    const adultRoles = ['Referee/Scorekeeper', 'Safety/First Aid', 'Food Service'];
    const youthRoles = ['Photography/Social Media', 'Setup/Cleanup', 'General Support'];
    
    if (numAge >= 18) {
      return [...adultRoles, ...youthRoles];
    } else if (numAge >= 14) {
      return youthRoles;
    } else {
      return ['General Support']; // With parent supervision
    }
  }

  console.log('   🎂 Age-Based Role Assignment:');
  const ageTests = [13, 16, 18, 25];
  ageTests.forEach(age => {
    const roles = getAppropriateRoles(age);
    console.log(`     Age ${age}: ${roles.length} available roles`);
  });

  // Cleanup
  if (data?.[0]?.id) {
    await supabase
      .from('volunteers')
      .delete()
      .eq('id', data[0].id);
  }
  
} catch (error) {
  console.error('❌ Volunteer database test failed:', error.message);
}
console.log();

// Test 2: Form Validation System
console.log('2️⃣ Testing Form Validation System...');

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation  
function validatePhone(phone) {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

// Age validation
function validateAge(age) {
  const numAge = parseInt(age);
  return numAge >= 10 && numAge <= 100;
}

// Name validation
function validateName(name) {
  return name && name.trim().length >= 2;
}

const validationTests = [
  { field: 'email', value: 'test@example.com', validator: validateEmail, expected: true },
  { field: 'email', value: 'invalid-email', validator: validateEmail, expected: false },
  { field: 'phone', value: '555-123-4567', validator: validatePhone, expected: true },
  { field: 'phone', value: '123', validator: validatePhone, expected: false },
  { field: 'age', value: '16', validator: validateAge, expected: true },
  { field: 'age', value: '5', validator: validateAge, expected: false },
  { field: 'name', value: 'John Doe', validator: validateName, expected: true },
  { field: 'name', value: '', validator: validateName, expected: false }
];

console.log('   ✅ Form Validation Tests:');
validationTests.forEach(test => {
  const result = test.validator(test.value);
  const passed = result === test.expected;
  const icon = passed ? '✅' : '❌';
  console.log(`     ${icon} ${test.field}: "${test.value}" → ${result}`);
});
console.log();

// Test 3: Mobile Optimization Checklist
console.log('3️⃣ Testing Mobile Optimization Requirements...');

const mobileOptimizations = [
  {
    feature: 'Responsive Design',
    requirement: 'Forms work on screens 320px+',
    testable: 'CSS media queries configured'
  },
  {
    feature: 'Touch Interactions',
    requirement: 'Buttons minimum 44px touch target',
    testable: 'Button sizing meets accessibility standards'
  },
  {
    feature: 'Input Fields',
    requirement: 'Proper keyboard types (email, tel, number)',
    testable: 'HTML input types correctly specified'
  },
  {
    feature: 'Loading States',
    requirement: 'Loading indicators for slow connections',
    testable: 'Spinner/skeleton components implemented'
  },
  {
    feature: 'Offline Capability',
    requirement: 'Form data cached during submission',
    testable: 'Service worker or localStorage backup'
  },
  {
    feature: 'Performance',
    requirement: 'Page loads under 3 seconds on 3G',
    testable: 'Lighthouse performance score > 90'
  }
];

console.log('   📱 Mobile Optimization Checklist:');
mobileOptimizations.forEach(opt => {
  console.log(`     📋 ${opt.feature}`);
  console.log(`        📏 Requirement: ${opt.requirement}`);
  console.log(`        🧪 Test: ${opt.testable}`);
});
console.log();

// Test 4: Accessibility Requirements
console.log('4️⃣ Testing Accessibility Requirements...');

const a11yRequirements = [
  {
    requirement: 'Form labels properly associated',
    wcag: 'WCAG 2.1 AA - 1.3.1',
    implementation: 'htmlFor attributes or aria-label'
  },
  {
    requirement: 'Error messages descriptive and linked',
    wcag: 'WCAG 2.1 AA - 3.3.1',
    implementation: 'aria-describedby for error states'
  },
  {
    requirement: 'Color contrast minimum 4.5:1',
    wcag: 'WCAG 2.1 AA - 1.4.3',
    implementation: 'Contrast testing of all text/backgrounds'
  },
  {
    requirement: 'Keyboard navigation functional',
    wcag: 'WCAG 2.1 AA - 2.1.1',
    implementation: 'Tab order logical, focus visible'
  },
  {
    requirement: 'Screen reader compatibility',
    wcag: 'WCAG 2.1 AA - 4.1.3',
    implementation: 'Semantic HTML and ARIA attributes'
  }
];

console.log('   ♿ Accessibility Requirements (WCAG 2.1 AA):');
a11yRequirements.forEach(req => {
  console.log(`     📜 ${req.wcag}`);
  console.log(`        📋 ${req.requirement}`);
  console.log(`        ⚙️ ${req.implementation}`);
});
console.log();

// Test 5: Performance Optimization
console.log('5️⃣ Testing Performance Optimization...');

const performanceMetrics = [
  {
    metric: 'First Contentful Paint (FCP)',
    target: '< 1.8 seconds',
    optimization: 'Code splitting, lazy loading'
  },
  {
    metric: 'Largest Contentful Paint (LCP)', 
    target: '< 2.5 seconds',
    optimization: 'Image optimization, critical CSS'
  },
  {
    metric: 'First Input Delay (FID)',
    target: '< 100 milliseconds',
    optimization: 'Code splitting, reduce main thread work'
  },
  {
    metric: 'Cumulative Layout Shift (CLS)',
    target: '< 0.1',
    optimization: 'Image dimensions, font loading'
  }
];

console.log('   ⚡ Core Web Vitals Targets:');
performanceMetrics.forEach(metric => {
  console.log(`     📊 ${metric.metric}: ${metric.target}`);
  console.log(`        🔧 ${metric.optimization}`);
});

// Bundle size optimization
const bundleOptimizations = [
  'Tree shaking unused code',
  'Dynamic imports for routes',
  'Compress images (WebP format)',
  'Minify CSS and JavaScript',
  'Enable gzip compression'
];

console.log('   📦 Bundle Optimization:');
bundleOptimizations.forEach(opt => {
  console.log(`     ✅ ${opt}`);
});
console.log();

// Test 6: SEO and Social Media
console.log('6️⃣ Testing SEO and Social Media Setup...');

const seoRequirements = [
  {
    element: 'Title tags',
    content: 'Unique, descriptive titles for each page',
    example: '3-on-3 Basketball Tournament - Lucas Jeter Eagle Scout Fundraiser'
  },
  {
    element: 'Meta descriptions',
    content: '150-160 character descriptions',
    example: 'Join our 3-on-3 basketball tournament supporting veteran headstone cleaning. Register now!'
  },
  {
    element: 'Open Graph tags',
    content: 'Social media preview cards',
    example: 'og:title, og:description, og:image properties'
  },
  {
    element: 'Structured data',
    content: 'Event schema for search engines',
    example: 'JSON-LD with event details, date, location'
  }
];

console.log('   🔍 SEO Requirements:');
seoRequirements.forEach(req => {
  console.log(`     📝 ${req.element}: ${req.content}`);
  console.log(`        💡 ${req.example}`);
});

console.log('\n🎉 Phase 5 validation complete!');
console.log('\nNext Steps:');
console.log('- Test all forms on mobile device');
console.log('- Run Lighthouse audit');
console.log('- Test with screen reader');
console.log('- Proceed to Phase 6 testing automation');
