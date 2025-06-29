"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import "./Navbar.css"; // Include the custom CSS for the animations

const Navbar = ({ theme = "default" }) => {
  const [active, setActive] = useState(false);
  const [closing, setClosing] = useState(false); // To handle closing animation
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (active) {
      handleCloseMenu();
    } else {
      setActive(true);
    }
  };

  const handleCloseMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setActive(false);
      setClosing(false); // Reset closing state after animation ends
    }, 700); // Duration of the closing animation (matches the CSS duration)
  };

  const handleNavItemClick = () => {
    handleCloseMenu();
  };

  // Smooth scroll handler for homepage sections
  const handleSmoothScroll = (sectionId) => {
    handleCloseMenu();
    if (pathname === "/") {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 400); // Wait for menu close animation
    } else {
      router.push("/#" + sectionId);
    }
  };

  // Theme-based styles
  const isProductsTheme = theme === "products";
  const hamburgerBg = isProductsTheme ? "bg-blue-200/80" : "bg-white";
  const barColor = isProductsTheme ? "bg-blue-900" : "bg-black";

  return (
    <div className="relative">
      {/* Hamburger Icon - 3 Bars */}
      <div
        className={`fixed z-40 right-[1rem] md:right-[4rem] top-[1.1rem] md:top-[4rem] h-[60px] w-[60px] md:h-[70px] md:w-[70px] flex flex-col justify-center items-center cursor-pointer rounded-full shadow-2xl ${hamburgerBg} transition-all duration-300 ease-in-out`}
        onClick={handleClick}
      >
        <div
          className={`w-6 md:w-8 h-[2px] ${barColor} transition-transform duration-300 ease-in-out ${
            active ? "transform rotate-45 translate-y-2" : ""}`}
        ></div>
        <div
          className={`w-6 md:w-8 h-[2px] ${barColor} my-[7px] transition-opacity duration-300 ease-in-out ${
            active ? "opacity-0" : ""}`}
        ></div>
        <div
          className={`w-6 md:w-8 h-[2px] ${barColor} transition-transform duration-300 ease-in-out ${
            active ? "transform -rotate-45 -translate-y-2" : ""}`}
        ></div>
      </div>

      {/* Fullscreen Menu */}
      <div
        className={`navbar-menu-bg fixed z-30 top-0 right-0 bottom-0 left-0 transition-transform duration-500 ease-in-out ${
          active && !closing ? "menu-open" : "menu-closed"
        }`}
      >
        <nav role="navigation" aria-label="Main Navigation" className="navbar">
          <ul className="absolute top-1/2 left-1/2 list-none text-center transform -translate-x-1/2 -translate-y-1/2">
            {[
              { label: "HOME", href: "/" },
              { label: "ABOUT US", href: "/company" },
              { label: "OUR PRODUCTS", href: "/products" },
              { label: "FEATURES", section: "thiasil-benefits" },
              { label: "TESTIMONIALS", section: "reviews" },
              { label: "CONTACT US", href: "/contact" },
            ].map((item, index) => (
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
                    onClick={() => handleSmoothScroll(item.section)}
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
                    onClick={handleNavItemClick}
                  >
                    <span>{item.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

<style jsx global>{`
  .products-nav-link {
    text-shadow: 0 2px 8px rgba(30,58,138,0.18), 0 1px 0 rgba(255,255,255,0.12);
  }
`}</style>
