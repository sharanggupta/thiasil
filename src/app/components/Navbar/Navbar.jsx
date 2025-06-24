"use client";
import { useState } from "react";
import "./Navbar.css"; // Include the custom CSS for the animations

const Navbar = ({ theme = "default" }) => {
  const [active, setActive] = useState(false);
  const [closing, setClosing] = useState(false); // To handle closing animation

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

  // Theme-based styles
  const isProductsTheme = theme === "products";
  const menuBackground = isProductsTheme
    ? "linear-gradient(135deg, rgba(58,143,255,0.85) 0%, rgba(162,89,255,0.85) 100%)"
    : "linear-gradient(to right bottom, rgba(0, 159, 253, 0.95), rgba(42, 42, 114, 1))";
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
            active ? "transform translate-y-2 rotate-45" : ""
          }`}
        ></div>
        <div
          className={`w-6 md:w-8 h-[2px] ${barColor} my-[7px] transition-opacity duration-300 ease-in-out ${
            active ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-6 md:w-8 h-[2px] ${barColor} transition-transform duration-300 ease-in-out ${
            active ? "transform -translate-y-2 -rotate-45" : ""
          }`}
        ></div>
      </div>

      {/* Fullscreen Menu */}
      <div
        className={`fixed z-30 top-0 right-0 bottom-0 left-0 transition-transform duration-500 ease-in-out ${
          active && !closing ? "menu-open" : "menu-closed"
        }`}
        style={{
          background: menuBackground,
        }}
      >
        <nav role="navigation" aria-label="Main Navigation" className="navbar">
          <ul className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center list-none">
            {[
              { label: "HOME", href: "/" },
              { label: "ABOUT US", href: "/company" },
              { label: "OUR PRODUCTS", href: "/products" },
              { label: "FEATURES", href: "#thiasil-benefits" },
              { label: "TESTIMONIALS", href: "#reviews" },
              { label: "CONTACT US", href: "/contact" },
            ].map((item, index) => (
              <li className="my-1" key={index}>
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
