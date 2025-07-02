"use client";
import { use } from "react";
import Footer from "@/app/components/Footer/Footer";
import "@/app/components/HeroSection/Hero.css";
import Button from "@/app/components/MainButton/Button";
import ProductCard from "@/app/components/ui/ProductCard";
import Navbar from "@/app/components/Navbar/Navbar";
import { getBaseCatalogNumber } from "@/lib/utils";
import { getProductImageInfo } from "@/lib/image-utils";
import productsData from "@/data/products.json";
import { GRADIENTS } from "@/lib/constants/gradients";
import Image from "next/image";
import styles from "./ProductVariantCard.module.css";
import productDetailsStyles from "./ProductDetails.module.css";

function parseNumber(str) {
  // Extract the first number from a string (e.g., '36 pieces' -> 36)
  if (!str) return null;
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function parsePrice(str) {
  // Extract the first number from a price string (e.g., '₹300.00' -> 300)
  if (!str) return null;
  const match = str.replace(/[^\d.]/g, '');
  return match ? parseFloat(match) : null;
}

function ProductVariantCard({ variant, productImage }) {
  const isOutOfStock = variant.stockStatus !== 'in_stock';
  const packagingQty = parseNumber(variant.packaging);
  const pricePerPiece = parsePrice(variant.price);
  const totalCost = (packagingQty && pricePerPiece) ? (packagingQty * pricePerPiece) : null;

  // Format total cost: no thousands separator, just plain string
  function formatRupee(val) {
    if (val == null) return "-";
    if (Number.isInteger(val)) return `₹${val}`;
    return `₹${val.toFixed(2)}`;
  }

  // Compose prefill message for contact form
  const prefillMessage = encodeURIComponent(
    `Product Inquiry:\n` +
    `Name: ${variant.name || ''}\n` +
    `Cat No: ${variant.catNo || ''}\n` +
    `Capacity: ${variant.capacity || ''}\n` +
    `Packaging: ${variant.packaging || ''}\n` +
    `Price per piece: ${variant.price || ''}\n` +
    (totalCost ? `Total cost for one pack: ${formatRupee(totalCost)}` : '')
  );

  const handleBuyNow = () => {
    window.location.href = `/contact?message=${prefillMessage}`;
  };

  // Get image info using dynamic utility with productImage as fallback
  const { url: imageUrl, hasImage } = getProductImageInfo(variant, productImage);

  return (
    <div className={`${styles["variant-card"]} ${isOutOfStock ? styles["out-of-stock"] : ""}`}>
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
            /* Image placeholder - shown when no image available */
            <div
              className={styles["variant-card-picture"]}
              style={{
                background: 'var(--card-overlay-gradient)',
                backgroundBlendMode: 'screen',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}
            >
              <div className="flex flex-col items-center justify-center text-gray-400 mb-2">
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
              </div>
            </div>
          )}
          <div className={styles["variant-card-labelContainer"]}>
            <span className={styles["variant-card-label"]}>
              {variant.capacity ? `${variant.capacity}` : variant.name}
            </span>
          </div>
          <div className={styles["variant-card-info"]}>
            <p>Cat No: {variant.catNo}</p>
            {variant.capacity && variant.capacity !== 'N/A' && variant.capacity !== 'Custom' && <p>capacity: {variant.capacity}</p>}
            {variant.dimensions && Object.keys(variant.dimensions).length > 0 && (
              <p>
                {Object.entries(variant.dimensions)
                  .filter(([key, value]) => value && value !== 'N/A' && value.toString().trim() !== '')
                  .map(([key, value]) => {
                    const shortKey = key === 'length' ? 'L' : key === 'width' ? 'W' : key === 'height' ? 'H' : key === 'diameter' ? 'D' : key.charAt(0).toUpperCase();
                    return `${shortKey}: ${value}`;
                  })
                  .join('mm, ')}mm
              </p>
            )}
            {variant.packaging && variant.packaging !== 'N/A' && <p>packaging: {variant.packaging}</p>}
            <p>pricing: {variant.price ? variant.price : 'varies with size'}</p>
          </div>
        </div>
        {/* Back Side */}
        <div className={styles["variant-card-backRect"]}>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>Total Cost</div>
            <div style={{ fontSize: "2.1rem", fontWeight: 200, marginBottom: 0 }}>
              {totalCost ? formatRupee(totalCost) : "-"}
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: 18 }}>
              {totalCost ? "per pack" : ""}
            </div>
            <Button
              name={isOutOfStock ? "Unavailable" : "Buy Now!"}
              color="#0A6EBD"
              bgColor="#fff"
              size="medium"
              padding="px-4 py-2"
              textSize="text-sm"
              className="w-full max-w-[140px] mx-auto mt-2"
              onClick={isOutOfStock ? undefined : handleBuyNow}
              disabled={isOutOfStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ category: string; product: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  // Get product from params using React.use()
  const resolvedParams = use(params);
  const { product } = resolvedParams;
  const productData = productsData.products.find(
    (p) => p.catNo.toLowerCase() === decodeURIComponent(product || "").toLowerCase()
  );
  
  if (!productData) {
    return (
      <div className="main-margin bg-[#f7f7f7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The requested product "{decodeURIComponent(product || "")}" could not be found.</p>
          <p className="text-sm text-gray-500 mt-2">Available products: {productsData.products.map(p => p.catNo).join(', ')}</p>
        </div>
      </div>
    );
  }

  // Get the base catalog number for this product (e.g., "1170" from "1170 Series")
  const baseCatalogNumber = getBaseCatalogNumber(productData.catNo);

  // Get all variants for this product's category, but filter to only show variants
  // that belong to this specific product (matching the base catalog number)
  const allVariants = productsData.productVariants?.[productData.categorySlug]?.variants || [];
  const variants = allVariants.filter(variant => {
    // For variants without catNo (new admin-created products), show all variants in the category
    if (!variant.catNo) {
      return true;
    }
    
    // For legacy variants with catNo, filter by matching base catalog number
    const variantBaseNumber = getBaseCatalogNumber(variant.catNo);
    return variantBaseNumber === baseCatalogNumber;
  });
  

  return (
    <div className="main-margin bg-[#f7f7f7] min-h-screen">
      <Navbar theme="products" />
      {/* Hero Section - gradient only, no background image */}
      <div className="relative w-full" style={{ minHeight: '500px' }} id="product-hero">
        {/* Background gradient with clip-path */}
        <div className="absolute inset-0 z-0" style={{ background: 'var(--primary-gradient)', clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)', WebkitClipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' }} />
        {/* Hero content */}
        <div className="flex relative z-10 flex-col justify-center items-center py-32 w-full h-full text-center text-white">
          <h1
            className={`leading-[1.1] mb-0 md:mb-5 uppercase ${productDetailsStyles.productDetailsTitle}`}
            style={{ letterSpacing: '0.16em' }}
          >
            {(productData.name || "").toUpperCase()}
          </h1>
          <p
            className="mx-auto mt-8 max-w-2xl text-base font-semibold leading-5 uppercase md:text-xl md:leading-10"
            style={{ letterSpacing: '0.08em' }}
          >
            {productData.description}
          </p>
        </div>
        {/* Product image as a large, circular avatar overlapping the cut, much larger and more left */}
        {productData.image && (
          <div
            className="absolute z-20 flex justify-center items-center w-[55vw] h-[55vw] max-w-[180px] max-h-[180px] md:w-[350px] md:h-[350px] md:max-w-[350px] md:max-h-[350px] left-1/2 -translate-x-1/2 bottom-[-40px] md:left-[20%] md:-translate-x-[30%] md:bottom-[-160px] md:translate-x-0"
            id="product-image-avatar"
          >
            <div className="flex overflow-hidden relative justify-center items-center w-full h-full bg-white rounded-full border-4 border-white shadow-xl">
              <Image
                src={productData.image}
                alt={productData.name}
                width={350}
                height={350}
                className="object-cover w-full h-full rounded-full"
                priority
              />
            </div>
          </div>
        )}
      </div>
      {/* Product Variants Grid */}
      <div className="px-4 py-32 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-[80px] md:mt-[180px]">
          {variants.map((variant) => (
            <ProductVariantCard key={variant.catNo} variant={variant} productImage={productData.image} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
