"use client";
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from "react";
import {
    GlassButton,
    GlassCard,
    GlassIcon,
    NeonBubblesBackground
} from "../../components/Glassmorphism";
import favicon from "../../images/favicon.png";

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

// Helper function to apply discount to price
const applyDiscountToPrice = (price, discountPercent) => {
  if (!price || !discountPercent) return price;
  
  // Extract number from price (e.g., "₹294.00" -> 294.00)
  const number = price.match(/₹(\d+\.?\d*)/);
  if (!number) return price;
  
  const numPrice = parseFloat(number[1]);
  const discountedPrice = numPrice * (1 - discountPercent / 100);
  return `₹${discountedPrice.toFixed(2)}`;
};

// Helper function to extract base catalog number for image paths
const getBaseCatalogNumber = (catNo) => {
  if (!catNo) return '';
  // Handle both "1100 Series" and "1100/50" formats
  return catNo.split(/[\s\/]/)[0];
};

export default function CategoryPage({ params }) {
  const [category, setCategory] = useState("");
  const [categoryData, setCategoryData] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params?.category) {
      setCategory(params.category);
      fetchCategoryData(params.category);
    }
  }, [params]);

  const fetchCategoryData = async (categorySlug) => {
    try {
      const response = await fetch(`/api/products?category=${categorySlug}`);
      if (response.ok) {
        const data = await response.json();
        setCategoryData(data);
      } else {
        setCategoryData(null);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      setCategoryData(null);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <NeonBubblesBackground />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Loading...</h1>
            <p className="text-gray-300 mb-8">Please wait while we load the category data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <NeonBubblesBackground />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Category Not Found</h1>
            <p className="text-gray-300 mb-8">The requested category could not be found.</p>
            <Link href="/products">
              <GlassButton>Back to Products</GlassButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#2e026d] via-[#15162c] to-[#0a0a23] overflow-x-hidden">
      <NeonBubblesBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a8fff]/30 via-[#a259ff]/20 to-[#0a0a23]/80 pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <aside className="fixed top-6 left-6 z-30 flex flex-col items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 w-20 h-[80vh] min-h-[400px] max-h-[90vh] justify-between">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-lg mb-2 overflow-hidden">
            <Image src={favicon} alt="Thiasil Logo" width={40} height={40} className="object-contain w-8 h-8" />
          </div>
        </div>
        <nav className="flex flex-col gap-6 items-center mt-4">
          {sidebarNav.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center group"
              title={item.label}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-md group-hover:bg-gradient-to-br group-hover:from-[#3a8fff]/60 group-hover:to-[#a259ff]/60 transition-all">
                <span className="text-2xl text-white drop-shadow-lg">{item.icon}</span>
              </div>
              <span className="text-xs text-white/60 mt-1 group-hover:text-white transition-all">{item.label}</span>
            </a>
          ))}
        </nav>
        <div />
      </aside>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-20 ml-0 md:ml-32">
        {/* Breadcrumb Navigation */}
        <nav className="pt-32 pb-4">
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-white font-medium">
              {categoryData.title || categoryData.name || "Category"}
            </span>
          </div>
        </nav>

        {/* Hero Glass Card */}
        <section className="flex flex-col items-center justify-center pb-10">
          <GlassCard variant="primary" padding="large" className="w-full max-w-4xl flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-6">
              <GlassIcon icon={categoryData.icon || "🧪"} variant="primary" size="large" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_16px_rgba(58,143,255,0.7)]">
                {categoryData.title || categoryData.name || "Product Category"}
              </h1>
            </div>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {categoryData.description}
            </p>
            
            {/* Product Image Display */}
            {categoryData.image && (
              <div className="mb-8">
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="aspect-square w-64 h-64 mx-auto overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5">
                    <img
                      src={categoryData.image}
                      alt={categoryData.name || categoryData.title}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Enhanced overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3a8fff]/10 to-[#a259ff]/10 rounded-2xl pointer-events-none"></div>
                    {/* Subtle border glow */}
                    <div className="absolute inset-0 rounded-2xl border border-white/30 shadow-[0_0_20px_rgba(58,143,255,0.3)] pointer-events-none"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Coupon Section */}
            <div className="w-full max-w-md mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span>🎫</span>
                  Apply Coupon
                </h3>
                
                {!activeCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#3a8fff] transition-colors"
                      maxLength={20}
                    />
                    <GlassButton
                      onClick={applyCoupon}
                      variant="accent"
                      size="small"
                      disabled={isApplyingCoupon}
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </GlassButton>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                    <div>
                      <div className="text-green-300 font-medium">{activeCoupon.code}</div>
                      <div className="text-green-300/80 text-sm">{activeCoupon.discountPercent}% discount active</div>
                    </div>
                    <GlassButton
                      onClick={clearCoupon}
                      variant="secondary"
                      size="small"
                    >
                      <span>✕</span>
                    </GlassButton>
                  </div>
                )}
                
                {couponMessage && (
                  <div className={`mt-3 p-2 rounded-lg text-sm ${
                    couponMessage.includes('applied') || couponMessage.includes('active') 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {couponMessage}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <GlassButton href="/products" variant="secondary" size="large">
                <span>←</span>
                <span>Back to All Products</span>
              </GlassButton>
              <GlassButton href="/contact" variant="accent" size="large">
                <span>Get Quote</span>
                <span>→</span>
              </GlassButton>
            </div>
          </GlassCard>
        </section>

        {/* Product Variants Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {categoryData.variants.map((variant) => (
            <GlassCard key={variant.id} variant="secondary" padding="default" className="group hover:scale-105 transition-transform duration-300 h-full flex flex-col">
              <div className="flex flex-col h-full">
                {/* Product Image - Use catalog number from variant */}
                {variant.catNo && (
                  <div className="mb-4 relative">
                    <div className="aspect-square w-full h-24 overflow-hidden rounded-xl border border-white/20 shadow-lg bg-gradient-to-br from-white/10 to-white/5">
                      <Image
                        src={`/images/products/${getBaseCatalogNumber(variant.catNo)}.png`}
                        alt={variant.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover object-center"
                      />
                      {/* Light overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                  </div>
                )}
                
                {/* Product Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#3a8fff] transition-colors">
                    {variant.name}
                  </h3>
                  {variant.catNo && (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <GlassIcon icon="🏷️" variant="accent" size="small" />
                      <span className="text-white/80">CAT. NO.: <span className="text-white font-mono font-medium">{variant.catNo}</span></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <GlassIcon icon="📏" variant="accent" size="small" />
                    <span className="text-white/80">
                      {variant.capacity || variant.size}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GlassIcon icon="📦" variant="accent" size="small" />
                    <span className="text-white/80">
                      {variant.packaging}
                    </span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {getStockStatusDisplay(variant.stockStatus || 'in_stock')}
                  {variant.quantity !== undefined && variant.quantity !== null && (
                    <span className="ml-2 text-sm text-white/60">
                      Qty: {variant.quantity}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-[#3a8fff]/20 to-[#a259ff]/20 rounded-xl p-4 border border-white/20">
                    <div className="text-center">
                      <p className="text-sm text-white/60 mb-1">Price per piece</p>
                      <p className="text-3xl font-bold text-white">{variant.price}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 flex-grow">
                  <h4 className="text-sm font-semibold text-white/90 mb-2">Features:</h4>
                  <div className="space-y-1">
                    {variant.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 bg-[#3a8fff] rounded-full"></div>
                        <span className="text-white/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  <GlassButton
                    href="/contact"
                    variant="primary"
                    size="medium"
                    className="w-full justify-center"
                  >
                    <span>Order Now</span>
                    <span>→</span>
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <GlassCard variant="accent" padding="large" className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Bulk Quantities?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Contact us for bulk orders, custom specifications, or special pricing for large quantities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton href="/contact" variant="primary" size="large">
                <span>Contact Us</span>
                <span>→</span>
              </GlassButton>
              <GlassButton href="/products" variant="secondary" size="large">
                <span>←</span>
                <span>View All Products</span>
              </GlassButton>
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
} 