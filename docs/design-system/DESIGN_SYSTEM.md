# Thiasil Design System

A comprehensive design system for the Thiasil laboratory glassware application, ensuring consistency and scalability across all user interfaces.

## Brand Colors

### Primary Colors
```css
/* Primary Blue */
--primary-blue: #0A6EBD;
--primary-blue-light: #3a8fff;
--primary-blue-dark: #0858a3;

/* Background Gradients */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--dark-primary-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
--primary-overlay: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
```

### Secondary Colors
```css
/* Accent Colors */
--accent-purple: #764ba2;
--accent-teal: #4ecdc4;
--accent-orange: #ff6b6b;

/* Semantic Colors */
--success: #4ade80;
--warning: #fbbf24;
--error: #ef4444;
--info: #3b82f6;
```

### Neutral Colors
```css
/* Grays */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Special */
--white: #ffffff;
--black: #000000;
--transparent: rgba(255, 255, 255, 0);
```

## Typography

### Font Families
```css
/* Primary Font Stack */
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Monospace Font Stack */
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```

### Font Scales
```css
/* Heading Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
```

### Font Weights
```css
--font-thin: 100;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Line Heights
```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## Spacing Scale

### Base Spacing Units
```css
/* Spacing Scale (based on 0.25rem = 4px) */
--space-0: 0;
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
```

## Border Radius

### Radius Scale
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Fully rounded */
```

## Shadows

### Shadow System
```css
/* Drop Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Glass Shadows */
--shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
--shadow-glass-lg: 0 16px 64px 0 rgba(31, 38, 135, 0.3);
```

## Glassmorphism Effects

### Glass Cards
```css
/* Base Glass Effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-glass);
}

/* Glass Variants */
.glass-primary {
  background: rgba(58, 143, 255, 0.1);
  border: 1px solid rgba(58, 143, 255, 0.2);
}

.glass-secondary {
  background: rgba(118, 75, 162, 0.1);
  border: 1px solid rgba(118, 75, 162, 0.2);
}

.glass-accent {
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.2);
}
```

## Component Patterns

### Button Variants
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

/* Glass Button */
.btn-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

/* Button Sizes */
.btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); }
.btn-md { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
.btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-lg); }
```

### Card Patterns
```css
/* Base Card */
.card-base {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
}

/* Product Card */
.card-product {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-product:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

## Layout Grid

### Breakpoints
```css
/* Mobile First Breakpoints */
--breakpoint-sm: 640px;   /* Tablet */
--breakpoint-md: 768px;   /* Small laptop */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Container Sizes
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) { .container { max-width: 640px; } }
@media (min-width: 768px) { .container { max-width: 768px; } }
@media (min-width: 1024px) { .container { max-width: 1024px; } }
@media (min-width: 1280px) { .container { max-width: 1280px; } }
```

## Animation & Transitions

### Duration Scale
```css
--duration-fast: 0.15s;
--duration-normal: 0.25s;
--duration-slow: 0.4s;
--duration-slower: 0.6s;
```

### Easing Functions
```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Transitions
```css
/* Hover Effects */
.transition-colors { transition: color var(--duration-normal) var(--ease-in-out), background-color var(--duration-normal) var(--ease-in-out); }
.transition-transform { transition: transform var(--duration-normal) var(--ease-in-out); }
.transition-all { transition: all var(--duration-normal) var(--ease-in-out); }

/* Loading States */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```

## Accessibility

### Focus States
```css
/* Focus Ring */
.focus-ring {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Skip to Content */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-blue);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}
```

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 ratio)
- Interactive elements must have clear focus indicators
- Use semantic colors for consistent meaning

## Implementation Guidelines

### CSS Custom Properties
```css
/* Use CSS custom properties for theming */
.component {
  background: var(--component-bg, var(--gray-100));
  color: var(--component-text, var(--gray-900));
}
```

### Responsive Design
```css
/* Mobile-first approach */
.responsive-component {
  font-size: var(--text-sm);
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .responsive-component {
    font-size: var(--text-base);
    padding: var(--space-6);
  }
}
```

### Component Composition
- Use composition over inheritance
- Prefer utility classes for spacing and layout
- Keep component styles scoped and predictable
- Use design tokens consistently across components

## Usage Examples

### Implementing a Glass Card
```tsx
<div className="glass-effect rounded-xl p-6">
  <h3 className="text-xl font-semibold text-white mb-4">
    Card Title
  </h3>
  <p className="text-white/80">
    Card content with proper typography and spacing.
  </p>
</div>
```

### Creating Consistent Spacing
```tsx
<div className="space-y-6">
  <div className="mb-4">Section 1</div>
  <div className="mb-4">Section 2</div>
  <div>Section 3</div>
</div>
```

This design system ensures consistency, accessibility, and maintainability across the entire Thiasil application.