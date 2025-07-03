import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Hide dynamic content that changes between runs
    await page.addStyleTag({
      content: `
        .animate-pulse { animation: none !important; }
        .loading-spinner { display: none !important; }
        .dynamic-timestamp { visibility: hidden !important; }
        * { scroll-behavior: auto !important; }
      `
    });
  });

  test('homepage desktop view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for images to load
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.every(img => img.complete);
    });
    
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
    });
  });

  test('homepage mobile view', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot(`homepage-mobile-${browserName}.png`, {
      fullPage: true,
    });
  });

  test('hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('main');
    
    const heroSection = page.locator('main').first();
    await expect(heroSection).toHaveScreenshot('hero-section.png');
  });
});