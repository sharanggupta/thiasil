"use client";
import { useState } from "react";
import productsData from "@/data/products.json";
import { useCoupons } from "@/lib/hooks/useCoupons";
import { useProductManager } from "@/lib/hooks/useProductManager";
import { getBaseCatalogNumber } from "@/lib/utils";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import ProductCard from "@/app/components/ui/ProductCard";
import Breadcrumb from "@/app/components/common/Breadcrumb";


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

export default function Products() {
  const [products] = useState(productsData.products);
  
  // Use the coupon hook instead of inline state
  const {
    couponCode,
    setCouponCode,
    activeCoupon,
    couponMessage,
    isApplyingCoupon,
    applyCoupon,
    clearCoupon
  } = useCoupons();

  // Use the new product manager hook for filtering, search, and sorting
  const productManager = useProductManager(products, {
    enableSearch: false, // We'll add search later if needed
    enableSort: false,   // We'll add sorting later if needed
    enableFilters: true,
  });

  const { filters } = productManager;
  const filteredProducts = productManager.products;

  // Only two stock status filters: All and Out of Stock
  const stockStatusFilters = [
    { value: '', label: 'All' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ];
  const [stockStatusIndex, setStockStatusIndex] = useState(0);
  const selectedStock = stockStatusFilters[stockStatusIndex].value;

  // Update stock status when button is clicked
  const handleStockStatusChange = () => {
    const newIndex = (stockStatusIndex + 1) % stockStatusFilters.length;
    setStockStatusIndex(newIndex);
    filters.updateFilter('stockStatus', stockStatusFilters[newIndex].value);
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
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { href: "/", label: "Home" },
            { label: "Products" }
          ]}
          className="text-sm text-gray-600 mb-6"
        />

        {/* Modern Filter Bar */}
        <div className="w-full flex justify-center z-10 mb-10">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 items-center bg-white border border-blue-100 rounded-2xl shadow-lg px-2 sm:px-4 py-3 sm:py-4 mt-4 max-w-5xl w-full">
            {/* First row: main filters */}
            <div className="flex w-full gap-2 mb-2 sm:mb-0">
              <select
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white focus:outline-none"
                value={filters.filters.category}
                onChange={e => filters.updateFilter('category', e.target.value)}
              >
                <option value="">Category: All</option>
                {filters.filterOptions.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                type="button"
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base font-semibold text-gray-800 rounded-xl border border-blue-100 shadow-sm transition bg-white focus:outline-none hover:bg-blue-50"
                onClick={handleStockStatusChange}
              >
                Availability: {stockStatusFilters[stockStatusIndex].label}
              </button>
              <select
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white focus:outline-none"
                value={filters.filters.packaging}
                onChange={e => filters.updateFilter('packaging', e.target.value)}
              >
                <option value="">Packaging: All</option>
                {filters.filterOptions.packagingOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {/* Second row: price, download, and coupon */}
            <div className="flex w-full gap-2 items-center flex-wrap">
              <input
                type="number"
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white focus:outline-none"
                placeholder="Min Price"
                value={filters.filters.minPrice}
                onChange={e => filters.updateFilter('minPrice', e.target.value)}
                min={0}
              />
              <input
                type="number"
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-sm bg-white focus:outline-none"
                placeholder="Max Price"
                value={filters.filters.maxPrice}
                onChange={e => filters.updateFilter('maxPrice', e.target.value)}
                min={0}
              />
              <a
                href="/pricelist.pdf"
                download
                className="flex-shrink-0 min-w-[90px] flex items-center gap-2 px-3 py-1 sm:px-5 sm:py-2 rounded-xl text-white font-semibold text-xs sm:text-sm shadow transition border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 justify-center"
                style={{ background: 'var(--dark-primary-gradient)' }}
                aria-label="Download Price List PDF"
                title="Download Price List (PDF)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4m-9 9h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="sm:inline hidden">Download Price List (PDF)</span>
                <span className="inline sm:hidden">PDF</span>
              </a>
              {/* Coupon input and button group */}
              <div className="flex flex-shrink-0 w-full sm:w-auto ml-0 sm:ml-2 mt-2 sm:mt-0">
                <div className="flex w-full bg-white border border-blue-200 rounded-xl shadow px-2 py-1 gap-2 items-center">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 min-w-0 px-2 py-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                    maxLength={20}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={isApplyingCoupon}
                    className="px-4 py-2 text-white font-semibold rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'var(--dark-primary-gradient)' }}
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>
            </div>
            {/* Coupon feedback message */}
            {couponMessage && (
              <div className={`w-full mt-2 p-2 rounded-lg text-sm ${
                couponMessage.includes('applied') || couponMessage.includes('active') 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {couponMessage}
              </div>
            )}
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
            
            // Apply discount if coupon is active
            let displayPrice = fromPrice;
            if (activeCoupon && fromPrice) {
              const discountedPriceRange = applyDiscountToPriceRange(product.priceRange || product.price, activeCoupon.discountPercent);
              if (discountedPriceRange) {
                displayPrice = `From ${discountedPriceRange.split(' - ')[0]}`;
              }
            }
            
            return (
              <ProductCard
                key={product.catNo || (product.name + '-' + index)}
                product={product}
                activeCoupon={activeCoupon}
                displayPrice={displayPrice}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
} 