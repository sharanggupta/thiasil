# Visual Regression Testing

This document outlines the visual regression testing strategy for the Thiasil application, ensuring UI consistency across changes and deployments.

## Overview

Visual regression testing helps:
- Catch unintended UI changes
- Maintain design consistency
- Prevent visual bugs in production
- Ensure cross-browser compatibility
- Validate responsive design implementations

## Tools and Setup

### Primary Tools
- **Playwright**: For browser automation and screenshot capture
- **Chromatic**: For visual testing in Storybook
- **Percy**: For advanced visual testing and collaboration
- **Backstop.js**: For lightweight visual regression testing

### Browser Testing Matrix
```yaml
browsers:
  - name: "Chrome"
    versions: ["latest", "latest-1"]
  - name: "Firefox" 
    versions: ["latest"]
  - name: "Safari"
    versions: ["latest"]
  - name: "Edge"
    versions: ["latest"]

viewports:
  - name: "mobile"
    width: 375
    height: 812
  - name: "tablet"
    width: 768
    height: 1024
  - name: "desktop"
    width: 1440
    height: 900
  - name: "large"
    width: 1920
    height: 1080
```

## Playwright Visual Testing

### Configuration
Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/visual-results.xml' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Visual Test Examples
Create `tests/visual/homepage.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Tests', () => {
  test('homepage desktop view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Hide dynamic content
    await page.addStyleTag({
      content: `
        .animate-pulse { animation: none !important; }
        .loading-spinner { display: none !important; }
        .dynamic-timestamp { visibility: hidden !important; }
      `
    });
    
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('homepage mobile view', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot(`homepage-mobile-${browserName}.png`, {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('navigation menu states', async ({ page }) => {
    await page.goto('/');
    
    // Test closed menu
    await expect(page.locator('nav')).toHaveScreenshot('nav-closed.png');
    
    // Test open menu
    await page.click('[data-testid="menu-toggle"]');
    await page.waitForSelector('[data-testid="mobile-menu"]', { state: 'visible' });
    await expect(page.locator('nav')).toHaveScreenshot('nav-open.png');
  });
});
```

Create `tests/visual/products.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Products Page Visual Tests', () => {
  test('products grid layout', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    // Wait for images to load
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.every(img => img.complete);
    });
    
    await expect(page.locator('[data-testid="products-grid"]')).toHaveScreenshot('products-grid.png');
  });

  test('product card hover states', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    
    // Normal state
    await expect(firstCard).toHaveScreenshot('product-card-normal.png');
    
    // Hover state
    await firstCard.hover();
    await expect(firstCard).toHaveScreenshot('product-card-hover.png');
  });

  test('loading states', async ({ page }) => {
    // Intercept API calls to simulate loading
    await page.route('/api/products', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    await page.goto('/products');
    
    // Capture loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toHaveScreenshot('products-loading.png');
  });
});
```

## Storybook Visual Testing with Chromatic

### Setup Chromatic
```bash
npm install --save-dev chromatic
```

### Configure Chromatic
Add to `package.json`:

```json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<your-project-token>",
    "visual-test": "chromatic --exit-zero-on-changes"
  }
}
```

### Storybook Configuration
Update `.storybook/main.js`:

```javascript
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook'
  ],
  
  // Chromatic configuration
  features: {
    buildStoriesJson: true
  }
};
```

### Story Examples for Visual Testing
Create `src/components/ui/Button.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    // Chromatic configuration
    chromatic: {
      viewports: [320, 768, 1200],
      delay: 300,
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'Primary Button',
    bgColor: '#0A6EBD',
    color: '#fff',
    size: 'medium',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button name="Small" size="small" />
      <Button name="Medium" size="medium" />
      <Button name="Large" size="large" />
    </div>
  ),
  parameters: {
    chromatic: { 
      modes: {
        mobile: { viewport: 'mobile' },
        desktop: { viewport: 'desktop' },
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Button name="Normal" />
      <Button name="Hover" className="hover" />
      <Button name="Disabled" disabled />
      <Button name="Loading" className="loading" />
    </div>
  ),
};
```

## GitHub Actions Integration

### Visual Testing Workflow
Create `.github/workflows/visual-tests.yml`:

```yaml
name: Visual Regression Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        
      - name: Run Playwright visual tests
        run: npx playwright test --project=chromium
        env:
          CI: true
          
      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
          
      - name: Run Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: 'build-storybook'
          onlyChanged: true
          exitOnceUploaded: true
```

## Test Organization

### Test Structure
```
tests/
├── visual/
│   ├── components/
│   │   ├── buttons.spec.ts
│   │   ├── forms.spec.ts
│   │   └── cards.spec.ts
│   ├── pages/
│   │   ├── homepage.spec.ts
│   │   ├── products.spec.ts
│   │   └── contact.spec.ts
│   ├── flows/
│   │   ├── user-journey.spec.ts
│   │   └── checkout-flow.spec.ts
│   └── cross-browser/
│       ├── responsive.spec.ts
│       └── compatibility.spec.ts
```

### Test Categories

1. **Component Tests**
   - Individual component variations
   - State changes and interactions
   - Props combinations

2. **Page Tests**
   - Full page layouts
   - Responsive breakpoints
   - Loading states

3. **Flow Tests**
   - Multi-step user journeys
   - Form submissions
   - Navigation flows

4. **Cross-browser Tests**
   - Browser-specific rendering
   - CSS compatibility
   - JavaScript behavior

## Baseline Management

### Creating Baselines
```bash
# Generate new baselines for all tests
npx playwright test --update-snapshots

# Update specific test baselines
npx playwright test homepage.spec.ts --update-snapshots

# Update for specific browser
npx playwright test --project=webkit --update-snapshots
```

### Baseline Review Process
1. **Automated Updates**: Patch-level dependency updates
2. **Manual Review**: Feature changes and major updates
3. **Team Review**: Breaking changes and design updates

### Baseline Storage
```
tests/
├── visual/
│   └── screenshots/
│       ├── chromium/
│       ├── firefox/
│       ├── webkit/
│       └── mobile/
```

## Handling Dynamic Content

### Masking Dynamic Elements
```typescript
test('page with dynamic content', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Mask dynamic timestamps
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('[data-testid="timestamp"]'),
      page.locator('.last-updated'),
      page.locator('.real-time-data'),
    ],
  });
});
```

### Stabilizing Animations
```typescript
test('animated components', async ({ page }) => {
  await page.goto('/animations');
  
  // Disable animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: -1ms !important;
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        background-attachment: initial !important;
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
  
  await expect(page).toHaveScreenshot('no-animations.png');
});
```

## Performance Considerations

### Optimization Strategies
1. **Parallel Execution**: Run tests across multiple workers
2. **Selective Testing**: Only test changed components
3. **Screenshot Compression**: Optimize image sizes
4. **Baseline Caching**: Cache baseline images

### CI/CD Optimization
```yaml
# Optimize CI performance
- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}
    
- name: Run tests in parallel
  run: npx playwright test --workers=4
```

## Reporting and Analysis

### Test Reports
```typescript
// Custom reporter for visual tests
class VisualTestReporter {
  onTestEnd(test, result) {
    if (result.status === 'failed' && result.attachments) {
      console.log(`Visual diff available: ${result.attachments[0].path}`);
    }
  }
}
```

### Metrics Tracking
- Test execution time
- Screenshot generation time
- Baseline update frequency
- False positive rates

## Best Practices

### 1. Test Design
- Focus on critical user paths
- Test across multiple viewports
- Include edge cases and error states
- Validate loading and empty states

### 2. Maintenance
- Regular baseline reviews
- Automated cleanup of old screenshots
- Documentation of visual changes
- Team training on visual testing

### 3. Collaboration
- Shared baseline approval process
- Clear change documentation
- Visual change notifications
- Design system integration

### 4. Performance
- Optimize test execution time
- Use efficient screenshot strategies
- Implement smart retry mechanisms
- Monitor resource usage

This comprehensive visual regression testing strategy ensures UI consistency and quality across the Thiasil application.