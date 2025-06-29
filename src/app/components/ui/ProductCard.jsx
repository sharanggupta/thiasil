import { getBaseCatalogNumber } from "../../../lib/utils";
import Button from "../MainButton/Button";
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
          <div
            className={styles["variant-card-picture"]}
            style={{
              backgroundImage: `linear-gradient(to right bottom, rgba(41, 152, 255, 0.7), rgba(86, 67, 250, 0.7)), url('/images/products/${getBaseCatalogNumber(product.catNo)}.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundBlendMode: 'screen',
            }}
          />
          <div className={styles["variant-card-labelContainer"]}>
            <span className={styles["variant-card-label"]}>
              {product.name || product.catNo}
            </span>
          </div>
          <div className={styles["variant-card-info"]}>
            <p>Cat No: {product.catNo}</p>
            {product.capacity && <p>capacity: {product.capacity}</p>}
            {product.packaging && <p>packaging: {product.packaging}</p>}
          </div>
        </div>
        
        {/* Back Side */}
        <div className={styles["variant-card-backRect"]}>
          <div className="flex flex-col items-center justify-center h-full w-full">
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