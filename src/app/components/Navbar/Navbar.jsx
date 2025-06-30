"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import "./Navbar.css";
import HamburgerIcon from "./HamburgerIcon";
import FullscreenMenu from "./FullscreenMenu";

const Navbar = ({ theme = "default" }) => {
  const [active, setActive] = useState(false);
  const [closing, setClosing] = useState(false);
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
      setClosing(false);
    }, 700);
  };

  const handleNavItemClick = () => {
    handleCloseMenu();
  };

  const handleSmoothScroll = (sectionId) => {
    handleCloseMenu();
    if (pathname === "/") {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    } else {
      router.push("/#" + sectionId);
    }
  };

  return (
    <div className="relative">
      <HamburgerIcon
        active={active}
        onClick={handleClick}
        theme={theme}
      />
      
      <FullscreenMenu
        active={active}
        closing={closing}
        onNavItemClick={handleNavItemClick}
        onSmoothScroll={handleSmoothScroll}
        theme={theme}
      />
    </div>
  );
};

export default Navbar;

<style jsx global>{`
  .products-nav-link {
    text-shadow: 0 2px 8px rgba(30,58,138,0.18), 0 1px 0 rgba(255,255,255,0.12);
  }
`}</style>
