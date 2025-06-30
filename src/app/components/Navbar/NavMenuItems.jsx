const navigationItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/company" },
  { label: "OUR PRODUCTS", href: "/products" },
  { label: "FEATURES", section: "thiasil-benefits" },
  { label: "TESTIMONIALS", section: "reviews" },
  { label: "CONTACT US", href: "/contact" },
];

export default function NavMenuItems({ 
  active, 
  closing, 
  onNavItemClick, 
  onSmoothScroll, 
  theme = "default" 
}) {
  const isProductsTheme = theme === "products";

  return (
    <ul className="absolute top-1/2 left-1/2 list-none text-center transform -translate-x-1/2 -translate-y-1/2">
      {navigationItems.map((item, index) => (
        <li className="my-1" key={index}>
          {item.section ? (
            <button
              type="button"
              className={`navbar-link relative text-white text-nowrap text-xl md:text-4xl font-light py-2 px-3 md:px-6 inline-block transition-all duration-300 ease-in-out ${
                active && !closing
                  ? "menu-item-open"
                  : closing
                  ? "menu-item-close"
                  : ""
              } focus:outline-none focus:ring-2 focus:ring-[#3a8fff] ${isProductsTheme ? "products-nav-link" : ""}`}
              onClick={() => onSmoothScroll(item.section)}
            >
              <span>{item.label}</span>
            </button>
          ) : (
            <a
              href={item.href}
              target={item.external ? "_blank" : "_self"}
              rel={item.external ? "noopener noreferrer" : ""}
              className={`navbar-link relative text-white text-nowrap text-xl md:text-4xl font-light py-2 px-3 md:px-6 inline-block transition-all duration-300 ease-in-out ${
                active && !closing
                  ? "menu-item-open"
                  : closing
                  ? "menu-item-close"
                  : ""
              } focus:outline-none focus:ring-2 focus:ring-[#3a8fff] ${isProductsTheme ? "products-nav-link" : ""}`}
              onClick={onNavItemClick}
            >
              <span>{item.label}</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}