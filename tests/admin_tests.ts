import { test, expect, Page } from '@playwright/test';

/**
 * Admin Dashboard Tests
 * Tests admin authentication and management functionality
 */

const ADMIN_PASSWORD = "Let's GOOO!";

test.describe('Admin Authentication', () => {
  test('should require password to access admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    
    // Should show login form
    await expect(page.locator('[data-testid="admin-login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="admin-password-input"]')).toBeVisible();
  });

  test('should authenticate with correct password', async ({ page }) => {
    await page.goto('/admin');
    
    // Enter correct password
    await page.fill('[data-testid="admin-password-input"]', ADMIN_PASSWORD);
    await page.click('[data-testid="admin-login-submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*admin\/dashboard.*/);
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  });

  test('should reject incorrect password', async ({ page }) => {
    await page.goto('/admin');
    
    // Enter incorrect password
    await page.fill('[data-testid="admin-password-input"]', 'wrong-password');
    await page.click('[data-testid="admin-login-submit"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid password');
  });

  test('should maintain session after refresh', async ({ page }) => {
    // Login first
    await page.goto('/admin');
    await page.fill('[data-testid="admin-password-input"]', ADMIN_PASSWORD);
    await page.click('[data-testid="admin-login-submit"]');
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Should still be authenticated
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/admin');
    await page.fill('[data-testid="admin-password-input"]', ADMIN_PASSWORD);
    await page.click('[data-testid="admin-login-submit"]');
    
    // Logout
    await page.click('[data-testid="admin-logout"]');
    
    // Should redirect to login
    await expect(page.locator('[data-testid="admin-login-form"]')).toBeVisible();
  });
});

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/admin');
    await page.fill('[data-testid="admin-password-input"]', ADMIN_PASSWORD);
    await page.click('[data-testid="admin-login-submit"]');
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  });

  test('should display registration statistics', async ({ page }) => {
    // Check for statistics cards
    await expect(page.locator('[data-testid="stat-total-registrations"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-pending-approvals"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-total-donations"]')).toBeVisible();
    
    // Statistics should show numbers
    const totalRegistrations = await page.locator('[data-testid="stat-total-registrations"] .stat-value').textContent();
    expect(totalRegistrations).toMatch(/^\d+$/);
  });

  test('should list all registrations', async ({ page }) => {
    await page.click('[data-testid="view-registrations"]');
    
    // Should show registrations table
    await expect(page.locator('[data-testid="registrations-table"]')).toBeVisible();
    
    // Table headers should be present
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Type")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('should filter registrations by status', async ({ page }) => {
    await page.click('[data-testid="view-registrations"]');
    
    // Filter by pending
    await page.selectOption('[data-testid="status-filter"]', 'pending');
    
    // Should only show pending registrations
    const statusCells = page.locator('[data-testid^="registration-status-"]');
    const statusCount = await statusCells.count();
    
    if (statusCount > 0) {
      for (let i = 0; i < statusCount; i++) {
        const statusText = await statusCells.nth(i).textContent();
        expect(statusText?.toLowerCase()).toContain('pending');
      }
    }
  });

  test('should search registrations', async ({ page }) => {
    await page.click('[data-testid="view-registrations"]');
    
    // Enter search term
    await page.fill('[data-testid="search-registrations"]', 'Test');
    
    // Should filter results
    const searchResults = page.locator('[data-testid="registrations-table"] tbody tr');
    const resultCount = await searchResults.count();
    
    // All visible results should contain search term
    for (let i = 0; i < resultCount; i++) {
      const rowText = await searchResults.nth(i).textContent();
      expect(rowText?.toLowerCase()).toContain('test');
    }
  });

  test('should approve registration', async ({ page }) => {
    await page.click('[data-testid="view-registrations"]');
    
    // Find first pending registration
    const approveButton = page.locator('[data-testid^="approve-registration-"]').first();
    
    if (await approveButton.isVisible()) {
      await approveButton.click();
      
      // Should show confirmation dialog
      await expect(page.locator('[data-testid="approve-confirmation"]')).toBeVisible();
      await page.click('[data-testid="confirm-approve"]');
      
      // Should show success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('approved');
    }
  });

  test('should reject registration', async ({ page }) => {
    await page.click('[data-testid="view-registrations"]');
    
    // Find first pending registration  
    const rejectButton = page.locator('[data-testid^="reject-registration-"]').first();
    
    if (await rejectButton.isVisible()) {
      await rejectButton.click();
      
      // Should show confirmation dialog
      await expect(page.locator('[data-testid="reject-confirmation"]')).toBeVisible();
      await page.click('[data-testid="confirm-reject"]');
      
      // Should show success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('rejected');
    }
  });

  test('should view registration details', async ({ page }) => {
    await page.click('[data-testid="view-registrations"]');
    
    // Click on first registration details
    const viewButton = page.locator('[data-testid^="view-registration-"]').first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should show registration details modal
      await expect(page.locator('[data-testid="registration-details-modal"]')).toBeVisible();
      
      // Should show registration information
      await expect(page.locator('[data-testid="registration-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="registration-email"]')).toBeVisible();
      await expect(page.locator('[data-testid="registration-type"]')).toBeVisible();
    }
  });

  test('should export registrations', async ({ page }) => {
    await page.click('[data-testid="view-registrations"]');
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-registrations"]');
    const download = await downloadPromise;
    
    // Should download CSV file
    expect(download.suggestedFilename()).toMatch(/registrations.*\.csv$/);
  });
});

test.describe('Sponsor Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/admin');
    await page.fill('[data-testid="admin-password-input"]', ADMIN_PASSWORD);
    await page.click('[data-testid="admin-login-submit"]');
    await page.click('[data-testid="view-sponsors"]');
  });

  test('should list all sponsors', async ({ page }) => {
    await expect(page.locator('[data-testid="sponsors-table"]')).toBeVisible();
    
    // Check table headers
    await expect(page.locator('th:has-text("Sponsor Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Donation Amount")')).toBeVisible();
    await expect(page.locator('th:has-text("Tier")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
  });

  test('should display sponsor tiers correctly', async ({ page }) => {
    // Check that sponsors are categorized by tier
    const tierLabels = page.locator('[data-testid^="sponsor-tier-"]');
    const tierCount = await tierLabels.count();
    
    for (let i = 0; i < tierCount; i++) {
      const tierText = await tierLabels.nth(i).textContent();
      expect(['Bronze', 'Silver', 'Gold']).toContain(tierText);
    }
  });

  test('should approve sponsor', async ({ page }) => {
    const approveButton = page.locator('[data-testid^="approve-sponsor-"]').first();
    
    if (await approveButton.isVisible()) {
      await approveButton.click();
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    }
  });

  test('should view sponsor logo', async ({ page }) => {
    const logoButton = page.locator('[data-testid^="view-sponsor-logo-"]').first();
    
    if (await logoButton.isVisible()) {
      await logoButton.click();
      
      // Should show logo modal
      await expect(page.locator('[data-testid="logo-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="sponsor-logo-preview"]')).toBeVisible();
    }
  });
});

test.describe('Volunteer Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to volunteers
    await page.goto('/admin');
    await page.fill('[data-testid="admin-password-input"]', ADMIN_PASSWORD);
    await page.click('[data-testid="admin-login-submit"]');
    await page.click('[data-testid="view-volunteers"]');
  });

  test('should list all volunteers', async ({ page }) => {
    await expect(page.locator('[data-testid="volunteers-table"]')).toBeVisible();
    
    // Check for volunteer information
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Role Preference")')).toBeVisible();
  });

  test('should assign volunteer roles', async ({ page }) => {
    const assignButton = page.locator('[data-testid^="assign-volunteer-"]').first();
    
    if (await assignButton.isVisible()) {
      await assignButton.click();
      
      // Should show role assignment modal
      await expect(page.locator('[data-testid="role-assignment-modal"]')).toBeVisible();
      
      // Select a role
      await page.selectOption('[data-testid="volunteer-role-select"]', 'Setup/Cleanup');
      await page.click('[data-testid="confirm-assignment"]');
      
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    }
  });
});

test.describe('Payment Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.fill('[data-testid="admin-password-input"]', ADMIN_PASSWORD);
    await page.click('[data-testid="admin-login-submit"]');
    await page.click('[data-testid="view-payments"]');
  });

  test('should display payment summary', async ({ page }) => {
    await expect(page.locator('[data-testid="payments-summary"]')).toBeVisible();
    
    // Check summary statistics
    await expect(page.locator('[data-testid="total-payments-amount"]')).toBeVisible();
    await expect(page.locator('[data-testid="pending-payments-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="completed-payments-count"]')).toBeVisible();
  });

  test('should list all payments', async ({ page }) => {
    await expect(page.locator('[data-testid="payments-table"]')).toBeVisible();
    
    // Check payment information columns
    await expect(page.locator('th:has-text("Registration")')).toBeVisible();
    await expect(page.locator('th:has-text("Amount")')).toBeVisible();
    await expect(page.locator('th:has-text("Method")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
  });

  test('should filter payments by status', async ({ page }) => {
    await page.selectOption('[data-testid="payment-status-filter"]', 'completed');
    
    // Should show only completed payments
    const paymentRows = page.locator('[data-testid="payments-table"] tbody tr');
    const rowCount = await paymentRows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const statusText = await paymentRows.nth(i).locator('[data-testid^="payment-status-"]').textContent();
      expect(statusText?.toLowerCase()).toContain('completed');
    }
  });
});
