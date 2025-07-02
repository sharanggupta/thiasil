import { memo } from "react";
import { NavigationItem, NAVIGATION_ITEMS, CSS_CLASSES } from "./constants";

/**
 * Builds the complete className string for navigation items based on current state
 * @param active - Whether the menu is currently active/open
 * @param closing - Whether the menu is in the process of closing
 * @param isProductsTheme - Whether to apply the products theme styling
 * @returns Complete className string for the navigation item
 */
function buildNavItemClassName(active: boolean, closing: boolean, isProductsTheme: boolean): string {
  const animationClass = active && !closing 
    ? CSS_CLASSES.menuItemOpen 
    : closing 
    ? CSS_CLASSES.menuItemClose 
    : "";
  
  const themeClass = isProductsTheme ? CSS_CLASSES.productsTheme : "";
  
  return `${CSS_CLASSES.navLink} ${animationClass} ${themeClass}`.trim();
}

/**
 * Returns appropriate target and rel attributes for external links
 * @param item - Navigation item to check for external flag
 * @returns Object with target and rel properties
 */
function getExternalLinkProps(item: NavigationItem) {
  if (!item.external) {
    return { target: "_self", rel: "" };
  }
  return { target: "_blank", rel: "noopener noreferrer" };
}

/**
 * Validates that a navigation item has the required properties
 * @param item - Navigation item to validate
 * @returns True if the item has a label and either href or section
 */
function isValidNavigationItem(item: NavigationItem): boolean {
  return !!(item.label && (item.href || item.section));
}

interface NavMenuItemsProps {
  /** Whether the menu is currently active/open */
  active: boolean;
  /** Whether the menu is in the process of closing */
  closing: boolean;
  /** Callback function when a navigation item is clicked */
  onNavItemClick: () => void;
  /** Callback function for smooth scrolling to a section */
  onSmoothScroll: (sectionId: string) => void;
  /** Theme variant for styling */
  theme?: "default" | "products";
}

/**
 * Navigation menu items component that renders the list of navigation links
 * Features smooth scrolling, external link handling, and theme support
 */
const NavMenuItems = memo(function NavMenuItems({
  active,
  closing,
  onNavItemClick,
  onSmoothScroll,
  theme = "default",
}: NavMenuItemsProps) {
  // Defensive programming - ensure callbacks exist
  const safeOnNavItemClick = onNavItemClick || (() => {});
  const safeOnSmoothScroll = onSmoothScroll || (() => {});
  
  const isProductsTheme = theme === "products";
  const itemClassName = buildNavItemClassName(active, closing, isProductsTheme);

  return (
    <ul className={CSS_CLASSES.container} style={{top: '50vh', transform: 'translateX(-50%) translateY(-50%)'}}>
      {NAVIGATION_ITEMS.filter(isValidNavigationItem).map((item, index) => {
        const { target, rel } = getExternalLinkProps(item);
        
        return (
          <li className={CSS_CLASSES.listItem} key={item.label + index}>
            {item.section ? (
              <button
                type="button"
                className={itemClassName}
                onClick={() => safeOnSmoothScroll(item.section)}
                aria-label={`Navigate to ${item.label} section`}
              >
                <span>{item.label}</span>
              </button>
            ) : (
              <a
                href={item.href || "#"}
                target={target}
                rel={rel}
                className={itemClassName}
                onClick={safeOnNavItemClick}
                aria-label={`Navigate to ${item.label} page`}
              >
                <span>{item.label}</span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
});

export default NavMenuItems;