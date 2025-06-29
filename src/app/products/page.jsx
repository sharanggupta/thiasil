"use client";
import { useMemo, useState } from "react";
import productsData from "../../data/products.json";
import { SIDEBAR_NAVIGATION } from "../../lib/constants/navigation";
import Footer from "../components/Footer/Footer";
import Button from "../components/MainButton/Button";
import Navbar from "../components/Navbar/Navbar";
import styles from "../products/[category]/[product]/ProductVariantCard.module.css";

const sidebarNav = SIDEBAR_NAVIGATION;

// Stock status display helper
const getStockStatusDisplay = (status) => {
  const statusConfigs = {
    'in_stock': { label: 'In Stock', color: 'text-green-400', bg: 'bg-green-500/20' },
    'out_of_stock': { label: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-500/20' },
    'made_to_order': { label: 'Made to Order', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    'limited_stock': { label: 'Limited Stock', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
  };
  
  const config = statusConfigs[status] || statusConfigs['in_stock'];
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} min-w-[100px] text-center`}>
      {config.label}
    </span>
  );
};

// Helper function to apply discount to price range
const applyDiscountToPriceRange = (priceRange, discountPercent) => {
  if (!priceRange || !discountPercent) return priceRange;
  
  // Extract numbers from price range (e.g., "₹294.00 - ₹0.98" -> [294.00, 0.98])
  const numbers = priceRange.match(/₹(\d+\.?\d*)/g);
  if (!numbers || numbers.length === 0) return priceRange;
  
  const discountedPrices = numbers.map(price => {
    const numPrice = parseFloat(price.replace('₹', ''));
    const discountedPrice = numPrice * (1 - discountPercent / 100);
    return `₹${discountedPrice.toFixed(2)}`;
  });
  
  return discountedPrices.join(' - ');
};

// Helper function to extract base catalog number for image paths
const getBaseCatalogNumber = (catNo) => {
  if (!catNo) return '';
  // Handle both "1100 Series" and "1100/50" formats
  return catNo.split(/[\s\/]/)[0];
};

export default function Products() {
  const [products, setProducts] = useState(productsData.products);
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => [
    ...new Set(products.map((p) => p.category))
  ], [products]);

  // Extract unique packaging options
  const packagingOptions = useMemo(() => [
    ...new Set(products.map((p) => p.packaging).filter(Boolean))
  ], [products]);

  // Only two stock status filters: All and Out of Stock
  const stockStatusFilters = [
    { value: '', label: 'All' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ];
  const [stockStatusIndex, setStockStatusIndex] = useState(0);
  const selectedStock = stockStatusFilters[stockStatusIndex].value;

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) return false;
      // Stock status filter
      if (selectedStock && product.stockStatus !== selectedStock) return false;
      // Packaging filter
      if (selectedPackaging && product.packaging !== selectedPackaging) return false;
      // Price range filter (use lowest price)
      let price = 0;
      if (typeof product.price === 'string') {
        // Handle price range string like '₹343.00 - ₹686.00'
        const match = product.price.match(/₹([\d,.]+)/);
        if (match) price = parseFloat(match[1].replace(/,/g, ''));
      } else if (typeof product.price === 'number') {
        price = product.price;
      }
      if (minPrice && price < parseFloat(minPrice)) return false;
      if (maxPrice && price > parseFloat(maxPrice)) return false;
      return true;
    });
  }, [products, selectedCategory, selectedStock, selectedPackaging, minPrice, maxPrice]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponMessage("");

    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setActiveCoupon(data.coupon);
        setCouponMessage(`Coupon ${data.coupon.code} applied! ${data.coupon.discountPercent}% discount active.`);
      } else {
        setActiveCoupon(null);
        setCouponMessage(data.error || "Invalid coupon code");
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponMessage("Error applying coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const clearCoupon = () => {
    setActiveCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  return (
    <div className="main-margin bg-[#f7f7f7]">
      <Navbar theme="products" />
      {/* Hero/Header Section */}
      <div className="w-full relative mb-8" style={{ background: 'var(--primary-gradient)', clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)', WebkitClipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-wider uppercase">
            Our Products
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
            Discover our premium range of laboratory glassware and labware, crafted for precision and durability.
          </p>
        </div>
      </div>
      <div className="max-w-6xl w-full mx-auto px-4">
        {/* Modern Filter Bar */}
        <div className="w-full flex justify-center z-10 mb-10">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 items-center bg-white border border-blue-100 rounded-2xl shadow-lg px-2 sm:px-4 py-3 sm:py-4 mt-4 max-w-5xl w-full">
            {/* First row: main filters */}
            <div className="flex w-full gap-2 mb-2 sm:mb-0">
              <select
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white focus:outline-none"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">Category: All</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                type="button"
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base font-semibold text-gray-800 rounded-xl border border-blue-100 shadow-sm transition bg-white focus:outline-none hover:bg-blue-50"
                onClick={() => setStockStatusIndex((stockStatusIndex + 1) % stockStatusFilters.length)}
              >
                Availability: {stockStatusFilters[stockStatusIndex].label}
              </button>
              <select
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white focus:outline-none"
                value={selectedPackaging}
                onChange={e => setSelectedPackaging(e.target.value)}
              >
                <option value="">Packaging: All</option>
                {packagingOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {/* Second row: price and download */}
            <div className="flex w-full gap-2 items-center">
              <input
                type="number"
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white focus:outline-none"
                placeholder="Min Price"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                min={0}
              />
              <input
                type="number"
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white focus:outline-none"
                placeholder="Max Price"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                min={0}
              />
              <a
                href="/pricelist.pdf"
                download
                className="flex-shrink-0 min-w-[90px] flex items-center gap-2 px-3 py-1 sm:px-5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-700 text-white font-semibold text-xs sm:text-sm shadow hover:from-cyan-500 hover:to-blue-800 transition border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 justify-center"
                aria-label="Download Price List PDF"
                title="Download Price List (PDF)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4m-9 9h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="sm:inline hidden">Download Price List (PDF)</span>
                <span className="inline sm:hidden">PDF</span>
              </a>
            </div>
          </div>
        </div>
        {/* Product Grid with PDP-style Flip Cards */}
        <div className="grid z-10 grid-cols-1 gap-12 mt-8 mb-20 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-lg text-center text-blue-900/80">No products found.</div>
          )}
          {filteredProducts.map((product, index) => {
            // Extract min price from price or priceRange
            let fromPrice = null;
            if (product.priceRange) {
              const match = product.priceRange.match(/₹([\d,.]+)/);
              if (match) fromPrice = `From ₹${match[1]}`;
            } else if (product.price) {
              const match = product.price.match(/₹([\d,.]+)/);
              if (match) fromPrice = `From ₹${match[1]}`;
            }
            const isOutOfStock = product.stockStatus !== 'in_stock';
            // Card flip logic: always show flip on hover
            return (
              <div key={product.catNo || (product.name + '-' + index)} className={`${styles["variant-card"]} ${isOutOfStock ? styles["out-of-stock"] : ""}`}> 
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
                        {/* Show product title/name in the label */}
                        {product.name || product.catNo}
                      </span>
                    </div>
                    <div className={styles["variant-card-info"]}>
                      <p>Cat No: {product.catNo}</p>
                      {product.capacity && <p>capacity: {product.capacity}</p>}
                      {product.packaging && <p>packaging: {product.packaging}</p>}
                      {/* Remove price from front */}
                    </div>
                  </div>
                  {/* Back Side */}
                  <div className={styles["variant-card-backRect"]}>
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      {/* Show 'Starts from ₹xxx' or 'From ₹xxx' at the top */}
                      <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 18 }}>{fromPrice ? fromPrice : "Contact for pricing"}</div>
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
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
} 