"use client";
import Footer from "@/app/components/Footer/Footer";
import "@/app/components/HeroSection/Hero.css";
import Button from "@/app/components/MainButton/Button";
import Navbar from "@/app/components/Navbar/Navbar";
import productsData from "@/data/products.json";
import Image from "next/image";
import styles from "./ProductVariantCard.module.css";

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

  // Determine image URL
  const imageUrl = variant.image || productImage || "/images/catalog/catalog-000.jpg";

  return (
    <div className={`${styles["variant-card"]} ${isOutOfStock ? styles["out-of-stock"] : ""}`}>
      <div className={styles["variant-card-inner"]}>
        {/* Front Side */}
        <div className={styles["variant-card-front"]}>
          <div
            className={styles["variant-card-picture"]}
            style={{
              backgroundImage: `linear-gradient(to right bottom, rgba(41, 152, 255, 0.7), rgba(86, 67, 250, 0.7)), url('${imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundBlendMode: 'screen',
            }}
          />
          <div className={styles["variant-card-labelContainer"]}>
            <span className={styles["variant-card-label"]}>
              {variant.capacity ? `${variant.capacity}` : variant.name}
            </span>
          </div>
          <div className={styles["variant-card-info"]}>
            <p>Cat No: {variant.catNo}</p>
            {variant.capacity && <p>capacity: {variant.capacity}</p>}
            {variant.packaging && <p>packaging: {variant.packaging}</p>}
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

export default function ProductDetailsPage({ params }) {
  // Get product from params
  const { product } = params || {};
  const productData = productsData.products.find(
    (p) => p.catNo.toLowerCase() === decodeURIComponent(product || "").toLowerCase()
  );
  if (!productData) return null;

  // Get all variants for this product's category
  const variants = productsData.productVariants?.[productData.categorySlug]?.variants || [];

  return (
    <>
      <Navbar theme="products" />
      <div className="main-margin bg-[#f7f7f7] min-h-screen">
        {/* Hero Section - gradient only, no background image */}
        <div className="relative h-[70vh] min-h-[400px]" id="product-hero">
          {/* Gradient overlay with steeper homepage angle */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #0A6EBD 60%, #6C5CE7 100%)',
              clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
              WebkitClipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
            }}
          ></div>
          {/* Content - product title from data */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full h-full">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] mt-[-7rem] mb-0 md:mb-5 uppercase"
              style={{ letterSpacing: '0.16em' }}
            >
              {productData.name.toUpperCase()}
            </h1>
            <p
              className="text-base md:text-xl leading-5 md:leading-10 font-semibold mt-8 max-w-2xl mx-auto uppercase"
              style={{ letterSpacing: '0.08em' }}
            >
              {productData.description}
            </p>
          </div>
          {/* Product image as a large, circular avatar overlapping the cut, much larger and more left */}
          {productData.image && (
            <div
              className="absolute z-10 flex justify-center items-center w-[55vw] h-[55vw] max-w-[180px] max-h-[180px] md:w-[350px] md:h-[350px] md:max-w-[350px] md:max-h-[350px] left-1/2 -translate-x-1/2 bottom-[-40px] md:left-[20%] md:-translate-x-[30%] md:bottom-[-160px] md:translate-x-0"
              id="product-image-avatar"
            >
              <div className="relative rounded-full border-4 border-white shadow-xl bg-white overflow-hidden w-full h-full flex items-center justify-center">
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
        <div className="max-w-5xl mx-auto py-32 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-[80px] md:mt-[180px]">
            {variants.map((variant) => (
              <ProductVariantCard key={variant.catNo} variant={variant} productImage={productData.image} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
