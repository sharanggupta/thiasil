import Button from "@/app/components/MainButton/Button";
import { getProductImageInfo } from "@/lib/image-utils";
import styles from "./ProductCard.module.css";

const ProductCard = ({
  product,
  activeCoupon = null,
  displayPrice = null,
  onCardClick = null,
  className = "",
  ...props
}) => {
  const isOutOfStock = product.stockStatus !== 'in_stock';
  
  // Get image info using dynamic utility
  const { url: imageUrl, hasImage } = getProductImageInfo(product);
  
  return (
    <div 
      key={product.catNo || product.name} 
      className={`${styles["variant-card"]} ${isOutOfStock ? styles["out-of-stock"] : ""} ${className}`}
      onClick={onCardClick}
      {...props}
    > 
      <div className={styles["variant-card-inner"]}>
        {/* Front Side */}
        <div className={styles["variant-card-front"]}>
          {hasImage ? (
            <div
              className={styles["variant-card-picture"]}
              style={{
                backgroundImage: `var(--card-overlay-gradient), url('${imageUrl}')`,
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
              {product.name || product.catNo}
            </span>
          </div>
          <div className={styles["variant-card-info"]}>
            <p>Cat No: {product.catNo}</p>
            {product.capacity && product.capacity !== 'N/A' && product.capacity !== 'Custom' && <p>capacity: {product.capacity}</p>}
            {product.dimensions && Object.keys(product.dimensions).length > 0 && (
              <p>
                {Object.entries(product.dimensions)
                  .filter(([key, value]) => value && value !== 'N/A' && value.toString().trim() !== '')
                  .map(([key, value]) => {
                    const shortKey = key === 'length' ? 'L' : key === 'width' ? 'W' : key === 'height' ? 'H' : key === 'diameter' ? 'D' : key.charAt(0).toUpperCase();
                    return `${shortKey}: ${value}`;
                  })
                  .join('mm, ')}mm
              </p>
            )}
            {product.packaging && product.packaging !== 'N/A' && product.packaging !== '1 piece' && <p>packaging: {product.packaging}</p>}
          </div>
        </div>
        
        {/* Back Side */}
        <div className={styles["variant-card-backRect"]}>
          <div className="flex flex-col justify-center items-center w-full h-full">
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
              name={isOutOfStock ? "Unavailable" : "Details"}
              color="#0A6EBD"
              bgColor="#fff"
              size="medium"
              className="w-full max-w-[140px] mx-auto mt-2"
              href={isOutOfStock ? undefined : `/products/${product.categorySlug || product.category.toLowerCase()}/${encodeURIComponent(product.catNo)}`}
              disabled={isOutOfStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;