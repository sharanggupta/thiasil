import productsData from "@/data/products.json";
import Image from "next/image";
import { notFound } from "next/navigation";
import 'swiper/css';
import styles from "./ProductDetails.module.css";
import VariantCarousel from './VariantCarousel';

// SVG icons
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

export default async function ProductDetailsPage({ params }) {
  console.log('ProductDetailsPage params:', params);
  const { product } = params;
  // Find the main product by catNo only (case-insensitive, decode URL param)
  const productData = productsData.products.find(
    (p) => p.catNo.toLowerCase() === decodeURIComponent(product).toLowerCase()
  );
  console.log('Resolved productData:', productData);
  if (!productData) return notFound();

  // Get base catalog number (series) from catNo, e.g., '1110' from '1110 Series'
  const baseCatNo = productData.catNo.split(' ')[0];
  const categorySlug = productData.categorySlug;
  // Only show variants whose catNo starts with the baseCatNo + '/'
  const variants =
    productsData.productVariants?.[categorySlug]?.variants?.filter(
      v => v.catNo.startsWith(baseCatNo + '/')
    ) || [];

  // Fallback for missing image
  let imageSrc = productData.image;
  if (!imageSrc) {
    console.warn('No image found for product, using placeholder:', productData.catNo);
    imageSrc = '/images/products/placeholder.png';
  }
  console.log('Product image src:', imageSrc);

  return (
    <div className="flex flex-col items-center px-2 py-12 w-full min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      {/* Accent blobs */}
      <div className={styles.accentBlob} style={{top: 40, left: -60}} />
      <div className={styles.accentBlob} style={{bottom: 60, right: -80}} />
      <div className="flex relative flex-col gap-0 items-center p-0 mx-auto w-full max-w-5xl rounded-3xl shadow-2xl" style={{background: 'rgba(255,255,255,0.60)', backdropFilter: 'blur(32px)'}}>
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center px-4 pt-12 pb-8 w-full">
          <div className={styles.heroImage}>
            <div className={styles.heroImageBg}></div>
            <Image
              src={imageSrc}
              alt={productData.name}
              fill
              style={{objectFit: 'contain'}}
              className="drop-shadow-xl"
              priority
              sizes="(max-width: 768px) 80vw, 420px"
            />
            <div className={styles.heroOverlay}></div>
          </div>
          <h1 className={styles.productName}>{productData.name}</h1>
          <span className={styles.productCatNo}>{productData.catNo}</span>
          <p className={styles.productDescription}>{productData.description}</p>
          <ul className="mb-2 text-base list-disc list-inside text-gray-600">
            {productData.features && productData.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
        {/* Variant Carousel Section */}
        <div className="px-2 mt-4 mb-12 w-full md:px-8">
          <VariantCarousel variants={variants} />
        </div>
      </div>
    </div>
  );
} 