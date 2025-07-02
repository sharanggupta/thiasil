"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import "./Navbar.css";
import HamburgerIcon from "./HamburgerIcon";
import FullscreenMenu from "./FullscreenMenu";
import { NavbarErrorBoundary } from "./ErrorBoundary";

import { TIMING, HOME_PATH } from "./constants";

interface NavbarProps {
  theme?: "default" | "products";
}

const Navbar = ({ theme = "default" }: NavbarProps) => {
  const [active, setActive] = useState(false);
  const [closing, setClosing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = useCallback(() => {
    if (active) {
      handleCloseMenu();
    } else {
      setActive(true);
    }
  }, [active]);

  const handleCloseMenu = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setActive(false);
      setClosing(false);
    }, TIMING.MENU_CLOSE_DELAY);
  }, []);

  const handleNavItemClick = useCallback(() => {
    handleCloseMenu();
  }, [handleCloseMenu]);

  // Helper function for smooth scrolling to a section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSmoothScroll = useCallback((sectionId: string) => {
    handleCloseMenu();
    if (pathname === HOME_PATH) {
      setTimeout(() => scrollToSection(sectionId), TIMING.SCROLL_DELAY);
    } else {
      router.push(`/#${sectionId}`);
    }
  }, [pathname, handleCloseMenu, scrollToSection, router]);

  return (
    <div className="relative">
      <NavbarErrorBoundary fallback={<div className="fixed z-40 right-[1rem] top-[1.1rem] text-red-500">Menu Error</div>}>
        <HamburgerIcon
          active={active}
          onClick={handleClick}
          theme={theme}
        />
      </NavbarErrorBoundary>
      
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