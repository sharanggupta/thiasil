"use client";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { SIDEBAR_NAVIGATION } from "../../../lib/constants/navigation";
import { GlassButton, GlassCard, GlassIcon, NeonBubblesBackground } from "../../components/Glassmorphism";
import Modal from '../../components/Modals/Modal';
import Navbar from "../../components/Navbar/Navbar";
import Heading from "../../components/common/Heading";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const router = useRouter();

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
            <Heading as="h1" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-4" size="primary">
              Category Not Found
            </Heading>
            <p className="text-gray-300 mb-8">The requested category could not be found.</p>
            <Link href="/products">
              <GlassButton variant="primary">Back to Products</GlassButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#009ffd] via-[#3a8fff] to-[#2a2a72] overflow-x-hidden">
      <Navbar />
      <NeonBubblesBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#009ffd]/30 via-[#3a8fff]/20 to-[#2a2a72]/80 pointer-events-none z-0" />

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
              <Heading as="h1" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-4" size="primary">
                {categoryData.title || categoryData.name || "Product Category"}
              </Heading>
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
              <Link href="/products" passHref legacyBehavior>
                <a style={{ textDecoration: 'none' }}>
                  <GlassButton variant="secondary" size="large">
                    <span>←</span>
                    <span>Back to All Products</span>
                  </GlassButton>
                </a>
              </Link>
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
                        src={`/images/products/${getBaseCatalogNumber(variant.catNo).replace(/[^\d]+/g, "")}.png`}
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
                      <div key={`${variant.id}-feature-${index}`} className="flex items-center gap-2 text-xs">
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

                <button
                  className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#009ffd] to-[#2a2a72] text-white font-bold shadow hover:from-[#2a2a72] hover:to-[#009ffd] transition-all"
                  onClick={e => { e.stopPropagation(); setModalProduct(variant); setIsModalOpen(true); }}
                >
                  Get Quote
                </button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
          <p className="mb-6 text-sm text-gray-700">By proceeding, you agree to our terms and conditions for product inquiries and purchases.</p>
          <button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#009ffd] to-[#2a2a72] text-white font-bold shadow hover:from-[#2a2a72] hover:to-[#009ffd] transition-all"
            onClick={() => {
              setIsModalOpen(false);
              router.push(`/contact?product=${encodeURIComponent(modalProduct?.name || '')}`);
            }}
          >
            Buy / Enquire
          </button>
        </div>
      </Modal>
    </div>
  );
} 