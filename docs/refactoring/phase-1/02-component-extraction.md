# 🧩 Static Component Extraction

## 📋 Task Checklist
- [ ] Extract `Footer.jsx` into smaller subcomponents (links, social, company info)
- [ ] Split `Navbar.jsx` into menu items and mobile navigation components
- [ ] Break down `HeroSection.jsx` into hero content and hero media components
- [ ] Extract `Breadcrumb.jsx` logic into a reusable navigation hook
- [ ] Create separate components for repeated UI patterns (buttons, badges)

---

## 🔧 Task 1: Extract Footer Components

### Current State:
`src/app/components/Footer/Footer.jsx` (98 lines) - monolithic footer component

### Target Structure:
```
src/app/components/Footer/
├── Footer.jsx              # Main footer container
├── FooterLinks.jsx         # Navigation links section
├── FooterSocial.jsx        # Social media links
├── FooterCompanyInfo.jsx   # Company information
└── FooterContact.jsx       # Contact information
```

### Steps:

#### 1. Create FooterLinks Component
```jsx
// src/app/components/Footer/FooterLinks.jsx
export default function FooterLinks() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/company', label: 'Company' },
    { href: '/contact', label: 'Contact' },
    { href: '/policy', label: 'Privacy Policy' },
  ];

  return (
    <div className="footer-links-section">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="footer-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### 2. Create FooterCompanyInfo Component
```jsx
// src/app/components/Footer/FooterCompanyInfo.jsx
export default function FooterCompanyInfo() {
  return (
    <div className="footer-company-section">
      <h3 className="text-lg font-semibold text-white mb-4">Thiasil</h3>
      <p className="text-gray-300 mb-4">
        Premium laboratory equipment and glassware for scientific excellence.
      </p>
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} Thiasil. All rights reserved.
      </p>
    </div>
  );
}
```

#### 3. Create FooterContact Component
```jsx
// src/app/components/Footer/FooterContact.jsx
export default function FooterContact() {
  return (
    <div className="footer-contact-section">
      <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
      <div className="space-y-2 text-gray-300">
        <p>Email: info@thiasil.com</p>
        <p>Phone: +91 XXX XXX XXXX</p>
        <p>Address: Your Business Address</p>
      </div>
    </div>
  );
}
```

#### 4. Update Main Footer Component
```jsx
// src/app/components/Footer/Footer.jsx
import FooterLinks from './FooterLinks';
import FooterCompanyInfo from './FooterCompanyInfo';
import FooterContact from './FooterContact';

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FooterCompanyInfo />
          <FooterLinks />
          <FooterContact />
        </div>
      </div>
    </footer>
  );
}
```

### Validation:
- [ ] Footer appears identical to original
- [ ] All links work correctly
- [ ] Responsive behavior is preserved
- [ ] CSS classes and styling unchanged

---

## 🔧 Task 2: Split Navbar Components

### Current State:
`src/app/components/Navbar/Navbar.jsx` (136 lines) - complex navigation with mobile menu

### Target Structure:
```
src/app/components/Navbar/
├── Navbar.jsx              # Main navigation container
├── NavbarLogo.jsx          # Logo component
├── NavbarMenu.jsx          # Desktop menu items
├── NavbarMobile.jsx        # Mobile menu
└── NavbarActions.jsx       # Action buttons (admin, cart, etc.)
```

### Steps:

#### 1. Extract Logo Component
```jsx
// src/app/components/Navbar/NavbarLogo.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function NavbarLogo() {
  return (
    <Link href="/" className="navbar-logo">
      <Image
        src="/images/thiasil-logo.webp"
        alt="Thiasil Logo"
        width={40}
        height={40}
        className="navbar-logo-image"
      />
      <span className="navbar-brand-text">Thiasil</span>
    </Link>
  );
}
```

#### 2. Extract Desktop Menu
```jsx
// src/app/components/Navbar/NavbarMenu.jsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavbarMenu() {
  const router = useRouter();
  
  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/company', label: 'Company' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar-menu hidden md:flex">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`navbar-menu-item ${
            router.pathname === item.href ? 'active' : ''
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

#### 3. Extract Mobile Menu
```jsx
// src/app/components/Navbar/NavbarMobile.jsx
import { useState } from 'react';
import Link from 'next/link';

export default function NavbarMobile() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/company', label: 'Company' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="navbar-mobile md:hidden">
      <button
        className="navbar-mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open menu</span>
        {/* Hamburger icon */}
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {isOpen && (
        <div className="navbar-mobile-menu">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="navbar-mobile-item"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 4. Update Main Navbar Component
```jsx
// src/app/components/Navbar/Navbar.jsx
import NavbarLogo from './NavbarLogo';
import NavbarMenu from './NavbarMenu';
import NavbarMobile from './NavbarMobile';

export default function Navbar() {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-content">
          <NavbarLogo />
          <NavbarMenu />
          <NavbarMobile />
        </div>
      </div>
    </header>
  );
}
```

### Validation:
- [ ] Navigation looks identical to original
- [ ] Mobile menu functions correctly
- [ ] All navigation links work
- [ ] Active states are preserved
- [ ] Responsive behavior is maintained

---

## 🔧 Task 3: Break Down HeroSection

### Current State:
`src/app/components/HeroSection/Hero.jsx` - contains content and media together

### Target Structure:
```
src/app/components/HeroSection/
├── Hero.jsx                # Main hero container
├── HeroContent.jsx         # Text content and CTAs
├── HeroMedia.jsx           # Images and visual elements
└── HeroBackground.jsx      # Background effects
```

### Steps:

#### 1. Extract Hero Content
```jsx
// src/app/components/HeroSection/HeroContent.jsx
import { GlassButton } from '../Glassmorphism';

export default function HeroContent() {
  return (
    <div className="hero-content">
      <div className="hero-text">
        <h1 className="hero-title">
          Premium Laboratory Equipment
        </h1>
        <p className="hero-subtitle">
          High-quality scientific glassware and equipment for research excellence
        </p>
      </div>
      
      <div className="hero-actions">
        <GlassButton
          href="/products"
          variant="primary"
          size="large"
        >
          Explore Products
        </GlassButton>
        <GlassButton
          href="/contact"
          variant="secondary"
          size="large"
        >
          Get Quote
        </GlassButton>
      </div>
    </div>
  );
}
```

#### 2. Extract Hero Media
```jsx
// src/app/components/HeroSection/HeroMedia.jsx
import Image from 'next/image';

export default function HeroMedia() {
  return (
    <div className="hero-media">
      <div className="hero-image-container">
        <Image
          src="/images/hero-product.webp"
          alt="Laboratory Equipment"
          width={600}
          height={400}
          className="hero-image"
          priority
        />
      </div>
    </div>
  );
}
```

#### 3. Update Main Hero Component
```jsx
// src/app/components/HeroSection/Hero.jsx
import HeroContent from './HeroContent';
import HeroMedia from './HeroMedia';
import { NeonBubblesBackground } from '../NeonBubblesBackground';

export default function Hero() {
  return (
    <section className="hero-section">
      <NeonBubblesBackground />
      <div className="hero-container">
        <div className="hero-layout">
          <HeroContent />
          <HeroMedia />
        </div>
      </div>
    </section>
  );
}
```

### Validation:
- [ ] Hero section looks identical
- [ ] All animations and effects work
- [ ] Responsive layout is preserved
- [ ] CTA buttons function correctly

---

## 🔧 Task 4: Extract Breadcrumb Logic to Hook

### Current State:
Breadcrumb logic is embedded in the component

### Target Structure:
```
src/lib/hooks/
└── useNavigation.js        # Navigation utilities hook

src/app/components/common/
└── Breadcrumb.jsx          # Simplified breadcrumb component
```

### Steps:

#### 1. Create Navigation Hook
```javascript
// src/lib/hooks/useNavigation.js
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function useNavigation() {
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    const path = router.pathname;
    const segments = path.split('/').filter(Boolean);
    
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      return {
        href,
        label: label.replace('-', ' '),
        isLast: index === segments.length - 1,
      };
    });
  }, [router.pathname]);

  const currentPageTitle = useMemo(() => {
    const segments = router.pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    return lastSegment 
      ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
      : 'Home';
  }, [router.pathname]);

  return {
    breadcrumbs,
    currentPageTitle,
    isHomePage: router.pathname === '/',
  };
}
```

#### 2. Simplify Breadcrumb Component
```jsx
// src/app/components/common/Breadcrumb.jsx
import Link from 'next/link';
import { useNavigation } from '@/lib/hooks/useNavigation';

export default function Breadcrumb() {
  const { breadcrumbs } = useNavigation();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link href="/" className="breadcrumb-link">
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb) => (
          <li key={crumb.href} className="breadcrumb-item">
            <span className="breadcrumb-separator">/</span>
            {crumb.isLast ? (
              <span className="breadcrumb-current">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="breadcrumb-link">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### Validation:
- [ ] Breadcrumbs display correctly on all pages
- [ ] Navigation hook provides correct data
- [ ] Links work as expected
- [ ] Current page is highlighted appropriately

---

## 🔧 Task 5: Create Reusable UI Pattern Components

### Current State:
Repeated UI patterns scattered across components

### Target Components:
```
src/app/components/ui/
├── LoadingSpinner.jsx      # Loading states
├── ErrorMessage.jsx        # Error display
├── EmptyState.jsx          # Empty data states
└── StatusBadge.jsx         # Status indicators
```

### Steps:

#### 1. Create Loading Spinner
```jsx
// src/app/components/ui/LoadingSpinner.jsx
export default function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`loading-spinner ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
```

#### 2. Create Error Message Component
```jsx
// src/app/components/ui/ErrorMessage.jsx
export default function ErrorMessage({ 
  message, 
  title = 'Error',
  onRetry,
  className = '' 
}) {
  return (
    <div className={`error-message ${className}`}>
      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-text">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="error-retry-btn"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
```

#### 3. Create Empty State Component
```jsx
// src/app/components/ui/EmptyState.jsx
export default function EmptyState({
  title = 'No data found',
  description,
  action,
  icon = '📭',
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-content">
        <div className="empty-state-icon">
          {icon}
        </div>
        <h3 className="empty-state-title">{title}</h3>
        {description && (
          <p className="empty-state-description">{description}</p>
        )}
        {action && (
          <div className="empty-state-action">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 4. Enhance Status Badge Component
```jsx
// src/app/components/common/StockStatusBadge.jsx
export default function StockStatusBadge({ status, className = '' }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'in_stock':
        return {
          label: 'In Stock',
          variant: 'success',
          icon: '✅',
        };
      case 'low_stock':
        return {
          label: 'Low Stock',
          variant: 'warning',
          icon: '⚠️',
        };
      case 'out_of_stock':
        return {
          label: 'Out of Stock',
          variant: 'error',
          icon: '❌',
        };
      default:
        return {
          label: 'Unknown',
          variant: 'neutral',
          icon: '❓',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`status-badge status-badge--${config.variant} ${className}`}>
      <span className="status-badge-icon">{config.icon}</span>
      <span className="status-badge-label">{config.label}</span>
    </span>
  );
}
```

### Validation:
- [ ] All UI pattern components render correctly
- [ ] Components are reusable across different contexts
- [ ] Styling is consistent with design system
- [ ] Accessibility attributes are included

---

## ✅ Phase 1.2 Completion Checklist

### Before Moving to Next Task:
- [ ] Footer extracted into logical subcomponents
- [ ] Navbar split into desktop and mobile components
- [ ] Hero section broken down into content and media
- [ ] Breadcrumb logic extracted to reusable hook
- [ ] Common UI patterns componentized
- [ ] All components look identical to originals
- [ ] No functionality regressions
- [ ] All links and interactions work correctly

### Files Created/Modified:
- [ ] Footer subcomponents (4 new files)
- [ ] Navbar subcomponents (4 new files)
- [ ] Hero subcomponents (3 new files)
- [ ] Navigation hook (1 new file)
- [ ] UI pattern components (4 new files)
- [ ] Updated imports in consuming components

### Time Estimate: 8-10 hours
### Risk Level: 🟢 Low