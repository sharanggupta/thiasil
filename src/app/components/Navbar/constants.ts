/**
 * Navigation configuration constants for the navbar component
 */

/**
 * Represents a single navigation item in the navbar
 */
export interface NavigationItem {
  /** Display text for the navigation item */
  label: string;
  /** URL path for page navigation (mutually exclusive with section) */
  href?: string;
  /** Section ID for smooth scrolling (mutually exclusive with href) */
  section?: string;
  /** Whether the link opens in a new tab */
  external?: boolean;
}

/** Main navigation items configuration */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/company" },
  { label: "OUR PRODUCTS", href: "/products" },
  { label: "FEATURES", section: "thiasil-benefits" },
  { label: "TESTIMONIALS", section: "reviews" },
  { label: "CONTACT US", href: "/contact" },
];

/** CSS class names used throughout the navbar components */
export const CSS_CLASSES = {
  container: "absolute left-1/2 transform list-none text-center",
  listItem: "my-1",
  navLink: "navbar-link relative text-white text-nowrap text-xl md:text-4xl font-light py-2 px-3 md:px-6 inline-block transition-all duration-300 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#3a8fff]",
  productsTheme: "products-nav-link",
  menuItemOpen: "menu-item-open",
  menuItemClose: "menu-item-close",
} as const;

/** Timing constants for animations and delays */
export const TIMING = {
  /** Duration for menu close animation in milliseconds */
  MENU_CLOSE_DELAY: 700,
  /** Delay before smooth scroll starts in milliseconds */
  SCROLL_DELAY: 400,
} as const;

/** Home page path constant */
export const HOME_PATH = "/";