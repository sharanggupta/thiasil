// Navigation constants for consistent sidebar navigation across the application
export const SIDEBAR_NAVIGATION = [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🧪", label: "Products", href: "/products" },
  { icon: "🏢", label: "About", href: "/company" },
  { icon: "✉️", label: "Contact", href: "/contact" },
];

// Admin-specific navigation items
export const ADMIN_NAVIGATION = [
  ...SIDEBAR_NAVIGATION,
  { icon: "🔐", label: "Admin", href: "/admin" }
];