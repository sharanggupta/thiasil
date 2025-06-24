"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import productsData from "../../data/products.json";
import { NeonBubblesBackground } from "../components/Glassmorphism";
import Navbar from "../components/Navbar/Navbar";

const sidebarNav = [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🧪", label: "Products", href: "/products" },
  { icon: "🏢", label: "About", href: "/company" },
  { icon: "✉️", label: "Contact", href: "/contact" },
];

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] to-[#e5eaf1] flex flex-col items-center pt-32 relative overflow-x-hidden">
      <Navbar theme="products" />
      <NeonBubblesBackground />
      <div className="flex z-10 gap-4 justify-center items-center mb-10">
        <div className="flex flex-row gap-3 items-center">
          <a
            href="/catalog.pdf"
            download
            aria-label="Download Price List (PDF)"
            title="Download Price List (PDF)"
            className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem', minHeight: '2.5rem', lineHeight: 0, boxShadow: '0 4px 24px 0 rgba(58,143,255,0.18)', marginRight: '0.75rem' }}
          >
            <svg width="2.5rem" height="2.5rem" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
              <circle cx="28" cy="28" r="26" fill="#fff" stroke="#3a8fff" strokeWidth="4" />
              <circle cx="28" cy="28" r="20" fill="#fff" filter="url(#glassShadow)" />
              <path d="M28 18v13" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M22.5 27.5L28 33l5.5-5.5" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="20" y="36" width="16" height="4" rx="2" fill="#374151" />
              <defs>
                <filter id="glassShadow" x="6" y="6" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3a8fff" floodOpacity="0.10" />
                </filter>
              </defs>
            </svg>
          </a>
          <h1
            className="heading"
            style={{
              backgroundImage: 'linear-gradient(to right, #009ffd, #2a2a72)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '0.2rem',
              fontWeight: 700,
              fontSize: '2.5rem',
              margin: 0,
              display: 'inline-block',
              textTransform: 'uppercase',
            }}
          >
            Explore Premium Labware
          </h1>
        </div>
      </div>
      {/* Filters and Coupon as cards */}
      <div className="flex z-10 flex-wrap gap-8 justify-center mb-12">
        {/* Filters Card */}
        <div className="bg-white/90 backdrop-blur-lg border border-blue-100 rounded-3xl shadow-2xl p-6 flex flex-wrap gap-4 items-center min-w-[340px]">
          <select
            className="px-4 py-2 text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white/90 focus:outline-none"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Category: All</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {/* Availability Toggle */}
          <button
            type="button"
            className="px-4 py-2 font-semibold text-gray-800 rounded-xl border border-blue-100 shadow-sm transition bg-white/90 focus:outline-none hover:bg-blue-50"
            onClick={() => setStockStatusIndex((stockStatusIndex + 1) % stockStatusFilters.length)}
          >
            Availability: {stockStatusFilters[stockStatusIndex].label}
          </button>
          <select
            className="px-4 py-2 text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white/90 focus:outline-none"
            value={selectedPackaging}
            onChange={e => setSelectedPackaging(e.target.value)}
          >
            <option value="">Packaging: All</option>
            {packagingOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input
            type="number"
            className="px-4 py-2 w-28 text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white/90 focus:outline-none"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            min={0}
          />
          <input
            type="number"
            className="px-4 py-2 w-28 text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white/90 focus:outline-none"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            min={0}
          />
        </div>
        {/* Coupon Card */}
        <div className="bg-white/90 backdrop-blur-lg border border-blue-100 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 min-w-[340px] relative">
          <label className="text-lg font-bold text-blue-900">Coupon Code</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="px-4 py-2 w-40 text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white/90 focus:outline-none"
              placeholder="Coupon code"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              disabled={!!activeCoupon}
            />
            <button
              className="relative px-6 py-2 font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-700 rounded-full border border-blue-200 shadow transition hover:from-cyan-500 hover:to-blue-800 disabled:opacity-60"
              onClick={activeCoupon ? clearCoupon : applyCoupon}
              disabled={isApplyingCoupon}
            >
              {activeCoupon ? "Clear" : isApplyingCoupon ? "Applying..." : "Apply"}
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/60 rounded-full blur-[2px]" />
            </button>
          </div>
          {couponMessage && (
            <span className="px-3 py-1 text-sm text-blue-900 bg-blue-100 rounded shadow">{couponMessage}</span>
          )}
        </div>
      </div>
      {/* Product Grid */}
      <div className="grid z-10 grid-cols-1 gap-16 mt-16 sm:grid-cols-2 md:grid-cols-3">
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
          return (
            <Link
              key={product.catNo || (product.name + '-' + index)}
              href={`/products/${product.categorySlug || product.category.toLowerCase()}/${encodeURIComponent(product.catNo)}`}
              className="relative bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-2xl p-6 flex flex-col items-center w-80 h-96 group overflow-visible transition-transform duration-300 ease-out hover:scale-105"
              style={{
                boxShadow: '0 0 24px 6px rgba(58,240,252,0.18), 0 8px 40px 0 rgba(31,38,135,0.10)'
              }}
            >
              {/* Glowing gradient border using pseudo-element */}
              <span className="pointer-events-none absolute inset-0 rounded-[2.5rem] z-10 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:blur-[10px] group-hover:brightness-125" aria-hidden="true" style={{
                boxShadow: '0 0 0 6px rgba(58,240,252,0.10), 0 0 32px 0 rgba(58,240,252,0.18)',
                border: 'none',
                background: 'linear-gradient(135deg,rgba(58,240,252,0.18) 0%,rgba(30,58,138,0.10) 100%)',
                filter: 'blur(6px)',
                opacity: 0.7
              }} />
              {/* Catalog Number badge at top left */}
              <div className="absolute top-5 left-7 z-20 px-3 py-1 text-xs font-semibold text-blue-700 rounded-full border border-blue-100 shadow-sm bg-white/70">Cat No: {product.catNo}</div>
              {/* Product Image with soft glow */}
              <div className="flex flex-col justify-center items-center mt-6 mb-4">
                <div className="absolute top-16 left-1/2 w-20 h-6 bg-gradient-to-r from-cyan-300 to-blue-200 rounded-full opacity-40 blur-2xl -translate-x-1/2 -z-10" />
                <img
                  src={`/images/products/${getBaseCatalogNumber(product.catNo)}.png`}
                  alt={product.name}
                  className="object-contain w-20 h-20 drop-shadow-xl"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;utf8,<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" rx="20" fill="%23e0e7ef"/><text x="50%" y="54%" text-anchor="middle" fill="%2399aabb" font-size="12" font-family="Arial" dy=".3em">No Image</text></svg>';
                  }}
                />
              </div>
              {/* Product Name */}
              <div className="mb-1 w-full text-lg font-extrabold text-center text-blue-900 truncate" title={product.name}>{product.name}</div>
              {/* Stock Badge */}
              <div className="flex gap-2 justify-center items-center mb-1">
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold border border-blue-700 text-blue-700 bg-white/80">{getStockStatusDisplay(product.stockStatus).props.children}</span>
              </div>
              {/* Packaging */}
              {product.packaging && (
                <div className="mb-1 text-xs text-center text-blue-800">Packaging: {product.packaging}</div>
              )}
              {/* Capacity */}
              {product.capacity && (
                <div className="mb-1 text-xs text-center text-blue-800">Capacity: {product.capacity}</div>
              )}
              {/* Dimensions */}
              {product.dimensions && (
                <div className="mb-1 text-xs text-center text-blue-800">Dimensions: {product.dimensions}</div>
              )}
              {/* Description */}
              {product.description && (
                <div className="mb-2 text-xs text-center text-gray-500 line-clamp-2">{product.description}</div>
              )}
              {/* Price at the bottom, prominent */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] flex justify-center z-20">
                <div className="px-6 py-2 w-full text-xl font-bold text-center text-blue-900 rounded-full border border-blue-100 shadow bg-white/90">
                  {fromPrice || 'Contact for pricing'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <style jsx>{`
        .glassmorphic-card {
          background: rgba(255,255,255,0.90);
          border-radius: 1.5rem;
          box-shadow: 0 8px 40px 0 rgba(31,38,135,0.10), 0 0 0 4px rgba(58,240,252,0.08);
          border: 4px solid transparent;
          backdrop-filter: blur(18px);
        }
        .glass-fab-download {
          box-shadow: 0 2px 16px 0 rgba(58,143,255,0.12), 0 0 0 2px rgba(58,143,255,0.10);
          background: linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(58,143,255,0.08) 100%);
          transition: box-shadow 0.2s, background 0.2s;
        }
        .glass-fab-download:hover, .glass-fab-download:focus {
          box-shadow: 0 4px 32px 0 rgba(58,143,255,0.22), 0 0 0 4px rgba(58,143,255,0.18);
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 60%, rgba(58,143,255,0.16) 100%);
        }
      `}</style>
    </div>
  );
} 