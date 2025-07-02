import NavMenuItems from "./NavMenuItems";
import { NavbarErrorBoundary } from "./ErrorBoundary";

interface FullscreenMenuProps {
  active: boolean;
  closing: boolean;
  onNavItemClick: () => void;
  onSmoothScroll: (sectionId: string) => void;
  theme?: "default" | "products";
}

export default function FullscreenMenu({
  active,
  closing,
  onNavItemClick,
  onSmoothScroll,
  theme,
}: FullscreenMenuProps) {
  return (
    <div
      className={`navbar-menu-bg fixed z-30 top-0 right-0 bottom-0 left-0 transition-transform duration-500 ease-in-out ${
        active && !closing ? "menu-open" : "menu-closed"
      }`}
    >
      <nav role="navigation" aria-label="Main Navigation" className="navbar">
        <NavbarErrorBoundary>
          <NavMenuItems
            active={active}
            closing={closing}
            onNavItemClick={onNavItemClick}
            onSmoothScroll={onSmoothScroll}
            theme={theme}
          />
        </NavbarErrorBoundary>
      </nav>
    </div>
  );
}