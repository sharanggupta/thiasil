"use client";
import { useState } from "react";
import "./Navbar.css"; // Include the custom CSS for the animations

const Navbar = () => {
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

  return (
    <div className="relative">
      {/* Hamburger Icon - 3 Bars */}
      <div
        className={`fixed z-40 right-[1rem] md:right-[4rem] top-[1.1rem] md:top-[4rem] h-[60px] w-[60px] md:h-[70px] md:w-[70px] flex flex-col justify-center items-center cursor-pointer rounded-full shadow-2xl bg-white transition-all duration-300 ease-in-out`}
        onClick={handleClick}
      >
        <div
          className={`w-6 md:w-8 h-[2px] bg-black transition-transform duration-300 ease-in-out ${
            active ? "transform translate-y-2 rotate-45" : ""
          }`}
        ></div>
        <div
          className={`w-6 md:w-8 h-[2px] bg-black my-[7px] transition-opacity duration-300 ease-in-out ${
            active ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-6 md:w-8 h-[2px] bg-black transition-transform duration-300 ease-in-out ${
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
          background:
            "linear-gradient(to right bottom, rgba(0, 159, 253, 0.95), rgba(42, 42, 114, 1))",
        }}
      >
        <nav role="navigation" aria-label="Main Navigation" className="navbar">
          <ul className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center list-none">
            {[
              { label: "HOME", href: "/" },
              { label: "ABOUT US", href: "/company" },
              { label: "OUR PRODUCTS", href: "/products" },
              { label: "FEATURES", href: "#thiasil-benefits" },
              { label: "POPULAR PRODUCTS", href: "#popular-products" },
              { label: "TESTIMONIALS", href: "#reviews" },
              { label: "CONTACT US", href: "/contact" },
              { label: "PRIVACY POLICY", href: "/policy" },
              { label: "CALL US", href: "tel:+919820576045", external: true },
              { label: "ADMIN", href: "/admin", admin: true },
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
                  } ${item.admin ? "opacity-50 hover:opacity-100" : ""} focus:outline-none focus:ring-2 focus:ring-[#3a8fff]`}
                  onClick={handleNavItemClick}
                  title={item.admin ? "Admin Panel (Restricted Access)" : ""}
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
