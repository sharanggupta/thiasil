"use client";
import { useState } from "react";
import productsData from "@/data/products.json";
import { useProductManager } from "@/lib/hooks/useProductManager";
import { getBaseCatalogNumber } from "@/lib/utils";
import dynamic from "next/dynamic";
import Footer from "@/app/components/Footer/Footer";
import Navbar from "@/app/components/Navbar/Navbar";
import Breadcrumb from "@/app/components/common/Breadcrumb";
import ProductCard from "@/app/components/ui/ProductCard";

const CouponInput = dynamic(() => import("@/app/components/coupons").then(mod => ({ default: mod.CouponInput })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
});

const CouponDisplay = dynamic(() => import("@/app/components/coupons").then(mod => ({ default: mod.CouponDisplay })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
});

export function ProductsPageClient() {
  const [products] = useState(productsData.products);

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
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-xs bg-white focus:outline-hidden"
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
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base font-semibold text-gray-800 rounded-xl border border-blue-100 shadow-xs transition bg-white focus:outline-hidden hover:bg-blue-50"
                onClick={handleStockStatusChange}
              >
                Availability: {stockStatusFilters[stockStatusIndex].label}
              </button>
              <select
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-xs bg-white focus:outline-hidden"
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
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-xs bg-white focus:outline-hidden"
                placeholder="Min Price"
                value={filters.filters.minPrice}
                onChange={e => filters.updateFilter('minPrice', e.target.value)}
                min={0}
              />
              <input
                type="number"
                className="flex-1 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-800 rounded-xl border border-blue-100 shadow-xs bg-white focus:outline-hidden"
                placeholder="Max Price"
                value={filters.filters.maxPrice}
                onChange={e => filters.updateFilter('maxPrice', e.target.value)}
                min={0}
              />
              <a
                href="/pricelist.pdf"
                download
                className="shrink-0 min-w-[90px] flex items-center gap-2 px-3 py-1 sm:px-5 sm:py-2 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-sm transition border border-blue-200 focus:outline-hidden focus:ring-2 focus:ring-blue-400 justify-center"
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
              {/* Coupon input */}
              <div className="flex shrink-0 w-full sm:w-auto ml-0 sm:ml-2 mt-2 sm:mt-0">
                <CouponInput 
                  compact={true}
                  placeholder="Enter coupon code"
                  showLastUsed={true}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Active Coupon Display */}
        <div className="mb-6">
          <CouponDisplay 
            compact={true}
            showDetails={false}
            className="max-w-md"
          />
        </div>
        
        {/* Product Grid with PDP-style Flip Cards */}
        <div className="grid z-10 grid-cols-1 gap-12 mt-8 mb-20 sm:grid-cols-2 md:grid-cols-3" style={{ contain: 'layout' }}>
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
              <ProductCard
                key={product.catNo || (product.name + '-' + index)}
                product={product}
                displayPrice={fromPrice}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}