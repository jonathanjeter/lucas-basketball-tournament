import { test, expect, Page } from '@playwright/test';

/**
 * Registration Flow Tests
 * Tests the complete user registration journey
 */

// Test data
const testData = {
  team: {
    name: `Test Team ${Date.now()}`,
    players: [
      { name: 'John Doe', email: 'john@test.com', age: '16', grade: '10' },
      { name: 'Jane Smith', email: 'jane@test.com', age: '17', grade: '11' },
      { name: 'Bob Johnson', email: 'bob@test.com', age: '16', grade: '10' }
    ],
    emergencyContact: {
      name: 'Parent Name',
      phone: '555-0123',
      email: 'parent@test.com'
    }
  },
  individual: {
    name: 'Solo Player',
    email: 'solo@test.com',
    age: '25',
    phone: '555-0456'
  }
};

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');
    await expect(page).toHaveTitle(/Register.*Tournament/);
  });

  test('should display registration options', async ({ page }) => {
    // Check registration type options are visible
    await expect(page.locator('[data-testid="registration-type-individual"]')).toBeVisible();
    await expect(page.locator('[data-testid="registration-type-team"]')).toBeVisible();
    
    // Check pricing information
    await expect(page.locator('text=$20 per player')).toBeVisible();
  });

  test('should complete individual registration', async ({ page }) => {
    // Select individual registration
    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Fill individual form
    await page.fill('[data-testid="player-name"]', testData.individual.name);
    await page.fill('[data-testid="player-email"]', testData.individual.email);
    await page.fill('[data-testid="player-age"]', testData.individual.age);
    await page.fill('[data-testid="player-phone"]', testData.individual.phone);

    // Select age category
    await page.selectOption('[data-testid="age-category"]', 'high_school_adult');

    // Accept terms
    await page.check('[data-testid="terms-checkbox"]');

    // Submit form
    await page.click('[data-testid="submit-registration"]');

    // Should redirect to payment page
    await expect(page).toHaveURL(/.*payment.*/);
    await expect(page.locator('text=Individual Registration')).toBeVisible();
    await expect(page.locator('text=$20.00')).toBeVisible();
  });

  test('should complete team registration', async ({ page }) => {
    // Select team registration
    await page.click('[data-testid="registration-type-team"]');
    await page.click('[data-testid="continue-button"]');

    // Fill team name
    await page.fill('[data-testid="team-name"]', testData.team.name);

    // Add players
    for (let i = 0; i < testData.team.players.length; i++) {
      const player = testData.team.players[i];
      
      if (i > 0) {
        await page.click('[data-testid="add-player-button"]');
      }

      await page.fill(`[data-testid="player-${i}-name"]`, player.name);
      await page.fill(`[data-testid="player-${i}-email"]`, player.email);
      await page.fill(`[data-testid="player-${i}-age"]`, player.age);
      await page.fill(`[data-testid="player-${i}-grade"]`, player.grade);
    }

    // Fill emergency contact
    await page.fill('[data-testid="emergency-name"]', testData.team.emergencyContact.name);
    await page.fill('[data-testid="emergency-phone"]', testData.team.emergencyContact.phone);
    await page.fill('[data-testid="emergency-email"]', testData.team.emergencyContact.email);

    // Parent consent for minors
    await page.check('[data-testid="parent-consent"]');
    
    // Accept terms
    await page.check('[data-testid="terms-checkbox"]');

    // Submit form
    await page.click('[data-testid="submit-registration"]');

    // Should redirect to payment page
    await expect(page).toHaveURL(/.*payment.*/);
    await expect(page.locator(`text=${testData.team.name}`)).toBeVisible();
    await expect(page.locator('text=$60.00')).toBeVisible(); // 3 players × $20
  });

  test('should validate required fields', async ({ page }) => {
    // Select individual registration
    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Try to submit empty form
    await page.click('[data-testid="submit-registration"]');

    // Should show validation errors
    await expect(page.locator('[data-testid="error-player-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-player-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-terms-checkbox"]')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Enter invalid email
    await page.fill('[data-testid="player-email"]', 'invalid-email');
    await page.blur('[data-testid="player-email"]');

    // Should show email validation error
    await expect(page.locator('[data-testid="error-player-email"]')).toContainText('valid email');
  });

  test('should handle age category assignment', async ({ page }) => {
    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Test different ages
    const ageTests = [
      { age: '10', expectedCategory: 'elementary' },
      { age: '13', expectedCategory: 'middle' },
      { age: '16', expectedCategory: 'high_school_adult' },
      { age: '25', expectedCategory: 'high_school_adult' }
    ];

    for (const test of ageTests) {
      await page.fill('[data-testid="player-age"]', test.age);
      await page.blur('[data-testid="player-age"]');
      
      // Age category should auto-select or show appropriate option
      const categorySelect = page.locator('[data-testid="age-category"]');
      await expect(categorySelect).toBeVisible();
    }
  });

  test('should show loading state during submission', async ({ page }) => {
    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Fill minimum required fields
    await page.fill('[data-testid="player-name"]', testData.individual.name);
    await page.fill('[data-testid="player-email"]', testData.individual.email);
    await page.fill('[data-testid="player-age"]', testData.individual.age);
    await page.check('[data-testid="terms-checkbox"]');

    // Submit and check for loading state
    await page.click('[data-testid="submit-registration"]');
    
    // Should show loading indicator
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test('should handle form errors gracefully', async ({ page }) => {
    // Mock a server error
    await page.route('/api/register', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Fill and submit form
    await page.fill('[data-testid="player-name"]', testData.individual.name);
    await page.fill('[data-testid="player-email"]', testData.individual.email);
    await page.fill('[data-testid="player-age"]', testData.individual.age);
    await page.check('[data-testid="terms-checkbox"]');
    await page.click('[data-testid="submit-registration"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('error');
  });
});

test.describe('Mobile Registration', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test('should work on mobile devices', async ({ page }) => {
    await page.goto('/register');

    // Check mobile layout
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Registration options should be stacked vertically
    const registrationOptions = page.locator('[data-testid^="registration-type-"]');
    await expect(registrationOptions).toHaveCount(2);

    // Complete mobile registration
    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Form should be mobile-optimized
    const nameField = page.locator('[data-testid="player-name"]');
    await expect(nameField).toBeVisible();
    
    // Input should be large enough for touch
    const nameFieldBox = await nameField.boundingBox();
    expect(nameFieldBox?.height).toBeGreaterThan(44); // Minimum touch target
  });

  test('should handle mobile keyboard types', async ({ page }) => {
    await page.goto('/register');
    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Email field should trigger email keyboard
    const emailField = page.locator('[data-testid="player-email"]');
    await expect(emailField).toHaveAttribute('type', 'email');
    
    // Phone field should trigger numeric keyboard
    const phoneField = page.locator('[data-testid="player-phone"]');
    await expect(phoneField).toHaveAttribute('type', 'tel');
    
    // Age field should trigger numeric keyboard  
    const ageField = page.locator('[data-testid="player-age"]');
    await expect(ageField).toHaveAttribute('type', 'number');
  });
});

test.describe('Accessibility', () => {
  test('should meet accessibility standards', async ({ page }) => {
    await page.goto('/register');

    // Check for proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();

    // Check form labels
    const nameLabel = page.locator('label[for*="name"], [aria-label*="name"]');
    await expect(nameLabel).toBeVisible();

    // Check focus management
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']).toContain(focusedElement);
  });

  test('should announce form errors to screen readers', async ({ page }) => {
    await page.goto('/register');
    await page.click('[data-testid="registration-type-individual"]');
    await page.click('[data-testid="continue-button"]');

    // Submit empty form
    await page.click('[data-testid="submit-registration"]');

    // Error messages should have proper ARIA attributes
    const errorMessage = page.locator('[data-testid="error-player-name"]');
    await expect(errorMessage).toHaveAttribute('role', 'alert');
    await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });
});
