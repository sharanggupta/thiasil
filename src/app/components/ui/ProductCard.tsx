import { memo } from "react";
import Button from "@/app/components/MainButton/Button";
import { shouldShowCapacity, shouldShowPackaging, getButtonText, PRODUCT_CARD_CONFIG } from "./productUtils";
import { useProductCard } from "./hooks";
import { ProductCardProps } from "./types";
import styles from "./ProductCard.module.css";

/**
 * ProductCard component for displaying product information with interactive features
 * 
 * This component follows Clean Code principles with:
 * - Single Responsibility: Focused solely on product card display
 * - Separation of Concerns: Logic extracted to custom hooks and utilities
 * - Defensive Programming: Comprehensive error handling and input validation
 * - Performance Optimization: React.memo and useCallback implementations
 * - Type Safety: Full TypeScript coverage with proper interfaces
 * 
 * Features:
 * - Product image display with fallback for missing images
 * - Stock status indication and out-of-stock handling
 * - Coupon integration with discount display
 * - Customizable action buttons and click handlers
 * - Responsive design with card flip animation
 * - Error boundaries and graceful degradation
 * 
 * @param props - ProductCard props containing product data and configuration
 * @returns JSX element representing the product card
 */
const ProductCard = memo(function ProductCard(props: ProductCardProps) {
  const {
    activeCoupon = null,
    displayPrice = null,
    className = "",
    backContent = null,
    buttonText = null,
    buttonHref = null
  } = props;

  // Use custom hook for component logic
  const {
    isValid,
    safeProduct,
    displayInfo,
    isOutOfStock,
    handleCardClick,
    handleButtonClick,
    restProps
  } = useProductCard(props);

  // Input validation
  if (!isValid) {
    return (
      <div className={`${styles["variant-card"]} ${className}`}>
        <div className="flex items-center justify-center h-full text-gray-500">
          Invalid Product Data
        </div>
      </div>
    );
  }

  // Filter out non-DOM props to prevent React warnings
  const { loading, ...domProps } = restProps;
  
  return (
    <div 
      key={safeProduct.catNo || safeProduct.name} 
      className={`${styles["variant-card"]} ${isOutOfStock ? styles["out-of-stock"] : ""} ${className}`}
      onClick={handleCardClick}
      {...domProps}
    > 
      <div className={styles["variant-card-inner"]}>
        {/* Front Side */}
        <div className={styles["variant-card-front"]}>
          {displayInfo.hasImage ? (
            <div
              className={styles["variant-card-picture"]}
              style={{
                backgroundImage: `var(--card-overlay-gradient), url('${displayInfo.imageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'screen',
              }}
            />
          ) : (
            <div
              className={styles["variant-card-picture"]}
              style={{
                background: 'var(--card-overlay-gradient)',
                backgroundBlendMode: 'screen',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="flex flex-col items-center justify-center text-gray-400">
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-40"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" opacity="0.6"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
                </svg>
                <span className="text-xs mt-2 opacity-60">No Image</span>
              </div>
            </div>
          )}
          <div className={styles["variant-card-labelContainer"]}>
            <span className={styles["variant-card-label"]}>
              {displayInfo.displayName}
            </span>
          </div>
          <div className={styles["variant-card-info"]}>
            <p>Cat No: {safeProduct.catNo}</p>
            {shouldShowCapacity(safeProduct.capacity) && <p>capacity: {safeProduct.capacity}</p>}
            {displayInfo.formattedDimensions && (
              <p>{displayInfo.formattedDimensions}</p>
            )}
            {shouldShowPackaging(safeProduct.packaging) && <p>packaging: {safeProduct.packaging}</p>}
          </div>
        </div>
        
        {/* Back Side */}
        <div className={styles["variant-card-backRect"]}>
          <div className="flex flex-col justify-center items-center w-full h-full">
            {/* Custom back content or default price display */}
            {backContent ? (
              backContent
            ) : (
              <>
                {/* Price Display */}
                <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 18 }}>
                  {displayPrice ? displayPrice : "Contact for pricing"}
                  {activeCoupon && (
                    <div style={{ fontSize: "0.8rem", color: "#10b981", marginTop: 4 }}>
                      {activeCoupon.discountPercent}% off with {activeCoupon.code}
                    </div>
                  )}
                </div>
                
                {/* Action Button */}
                <Button
                  name={getButtonText(isOutOfStock, buttonText)}
                  color="#0A6EBD"
                  bgColor="#fff"
                  size="medium"
                  padding="px-4 py-2"
                  textSize="text-sm"
                  className="w-full max-w-[140px] mx-auto mt-2"
                  href={isOutOfStock ? undefined : (buttonHref || `/products/${safeProduct.categorySlug || safeProduct.category?.toLowerCase() || PRODUCT_CARD_CONFIG.FALLBACK_VALUES.DEFAULT_CATEGORY}/${encodeURIComponent(safeProduct.catNo)}`)}
                  onClick={handleButtonClick}
                  disabled={isOutOfStock}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;