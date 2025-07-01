import NavMenuItems from "./NavMenuItems";

export default function FullscreenMenu({ 
  active, 
  closing, 
  onNavItemClick, 
  onSmoothScroll, 
  theme 
}) {
  return (
    <div
      className={`navbar-menu-bg fixed z-30 top-0 right-0 bottom-0 left-0 transition-transform duration-500 ease-in-out ${
        active && !closing ? "menu-open" : "menu-closed"
      }`}
    >
      <nav role="navigation" aria-label="Main Navigation" className="navbar">
        <NavMenuItems
          active={active}
          closing={closing}
          onNavItemClick={onNavItemClick}
          onSmoothScroll={onSmoothScroll}
          theme={theme}
        />
      </nav>
    </div>
  );
}