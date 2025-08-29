import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Playwright Configuration for Basketball Tournament Testing
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Global test timeout
  timeout: 30000,
  
  // Expect timeout
  expect: {
    timeout: 10000
  },
  
  // Shared settings for all the projects below
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Ignore HTTPS errors during testing
    ignoreHTTPSErrors: true,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet testing  
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    }
  ],

  // Test environments
  projects: [
    // Development environment
    {
      name: 'development',
      use: {
        baseURL: 'http://localhost:5173',
      },
      testMatch: /.*\.dev\.spec\.ts/,
    },
    
    // Staging environment  
    {
      name: 'staging',
      use: {
        baseURL: process.env.STAGING_URL || 'https://staging-lucas-tournament.vercel.app',
      },
      testMatch: /.*\.staging\.spec\.ts/,
    },
    
    // Production environment (smoke tests only)
    {
      name: 'production',
      use: {
        baseURL: process.env.PRODUCTION_URL || 'https://lucasjeter.com',
      },
      testMatch: /.*\.prod\.spec\.ts/,
    }
  ],

  // Web Server for development
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
