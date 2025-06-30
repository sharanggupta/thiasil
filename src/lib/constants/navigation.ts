// Navigation Item Type Definition
export interface NavigationItem {
  icon?: string;
  label: string;
  href: string;
}

// Navigation constants for consistent sidebar navigation across the application
export const SIDEBAR_NAVIGATION: NavigationItem[] = [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🧪", label: "Products", href: "/products" },
  { icon: "🏢", label: "About", href: "/company" },
  { icon: "✉️", label: "Contact", href: "/contact" },
];

// Admin-specific navigation items
export const ADMIN_NAVIGATION: NavigationItem[] = [
  ...SIDEBAR_NAVIGATION,
  { icon: "🔐", label: "Admin", href: "/admin" }
];

// Legacy Navigation Structure (for backward compatibility)
export const NAVIGATION = {
  SIDEBAR_NAV: SIDEBAR_NAVIGATION,
  FOOTER_LINKS: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/company" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/policy" },
  ] as NavigationItem[],
} as const;