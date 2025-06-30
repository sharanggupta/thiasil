"use client";
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getStockStatusDisplay } from '@/lib/utils';
import styles from './ProductDetails.module.css';

// SVG icons (copied from page.jsx)
const CapacityIcon = () => (
  <svg className={styles.variantIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12M4 19h16M4 19a2 2 0 002 2h12a2 2 0 002-2" /></svg>
);
const PackagingIcon = () => (
  <svg className={styles.variantIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" strokeWidth={2} /><path d="M16 3v4M8 3v4" strokeWidth={2} /></svg>
);
const PriceIcon = () => (
  <svg className={styles.variantIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0a4 4 0 100-8 4 4 0 000 8z" /></svg>
);
const CatNoIcon = () => (
  <svg className={styles.variantIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} /><path d="M8 8h8v8H8z" strokeWidth={2} /></svg>
);
const StockIcon = ({ inStock }) => inStock ? (
  <svg className={styles.variantIcon} fill="none" viewBox="0 0 24 24" stroke="#059669"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path d="M8 12l2 2 4-4" strokeWidth={2} /></svg>
) : (
  <svg className={styles.variantIcon} fill="none" viewBox="0 0 24 24" stroke="#dc2626"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path d="M8 8l8 8M16 8l-8 8" strokeWidth={2} /></svg>
);

export default function VariantCarousel({ variants }) {
  if (!variants?.length) return null;
  return (
    <Swiper
      spaceBetween={32}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1 },
        900: { slidesPerView: 2 },
        1200: { slidesPerView: 2.5 },
      }}
      style={{ padding: '0 0 2rem 0', width: '100%' }}
    >
      {variants.map((variant) => (
        <SwiperSlide key={variant.catNo}>
          <div className={styles.variantCard}>
            <div className={styles.variantLabel}><CapacityIcon /> Capacity <span className={styles.variantValue}>{variant.capacity}</span></div>
            <div className={styles.variantLabel}><PackagingIcon /> Packaging <span className={styles.variantValue}>{variant.packaging}</span></div>
            <div className={styles.variantLabel}><PriceIcon /> <span className={styles.variantPrice}>{variant.price}</span></div>
            <div className={styles.variantLabel}><CatNoIcon /> Cat No <span className={styles.variantValue}>{variant.catNo}</span></div>
            <div className={styles.variantLabel}><StockIcon inStock={variant.stockStatus === 'in_stock'} />
              <span className={`${styles.variantStock} ${variant.stockStatus !== 'in_stock' ? styles.variantStock + ' out' : ''}`}>{getStockStatusDisplay(variant.stockStatus || 'in_stock').label}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
} 