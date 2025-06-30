"use client";
import { use } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { SIDEBAR_NAVIGATION } from "@/lib/constants/navigation";
import { useCoupons } from "@/lib/hooks/useCoupons";
import { getBaseCatalogNumber, getStockStatusDisplay } from "@/lib/utils";
import { getProductImageInfo } from "@/lib/image-utils";
import { GlassButton, GlassCard, GlassIcon, NeonBubblesBackground } from "@/app/components/Glassmorphism";
import Modal from '@/app/components/Modals/Modal';
import Navbar from "@/app/components/Navbar/Navbar";
import Breadcrumb from "@/app/components/common/Breadcrumb";
import Heading from "@/app/components/common/Heading";

const sidebarNav = SIDEBAR_NAVIGATION;

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

export default function CategoryPage({ params }) {
  // Get category from params using React.use()
  const resolvedParams = use(params);
  const { category: categorySlug } = resolvedParams || {};
  const [category, setCategory] = useState("");
  const [categoryData, setCategoryData] = useState(null);
  
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
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (categorySlug) {
      setCategory(categorySlug);
      fetchCategoryData(categorySlug);
    }
  }, [categorySlug]);

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


  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--dark-primary-gradient)' }}>
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
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--dark-primary-gradient)' }}>
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
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--dark-primary-gradient)' }}>
      <Navbar />
      <NeonBubblesBackground />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'var(--primary-gradient)', opacity: 0.3 }} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-20 ml-0 md:ml-32">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
            { label: categoryData.title || categoryData.name || "Category" }
          ]}
        />

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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
          {categoryData.variants.map((variant) => (
            <GlassCard key={variant.id} variant="secondary" padding="default" className="group hover:scale-105 transition-transform duration-300 h-full flex flex-col">
              <div className="flex flex-col h-full">
                {/* Product Image - Use dynamic image utility */}
                {(() => {
                  const { url: imageUrl, hasImage } = getProductImageInfo(variant);
                  return hasImage ? (
                    <div className="mb-4 relative">
                      <div className="aspect-square w-full h-24 overflow-hidden rounded-xl border border-white/20 shadow-lg bg-gradient-to-br from-white/10 to-white/5">
                        <Image
                          src={imageUrl}
                          alt={variant.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            // Hide image if it fails to load
                            e.target.style.display = 'none';
                          }}
                        />
                        {/* Light overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  ) : null;
                })()}
                
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
                  {/* Capacity */}
                  {variant.capacity && variant.capacity !== 'N/A' && variant.capacity !== 'Custom' && (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <GlassIcon icon="🧪" variant="accent" size="small" />
                      <span className="text-white/80">
                        Capacity: {variant.capacity}
                      </span>
                    </div>
                  )}
                  
                  {/* Dimensions */}
                  {variant.dimensions && Object.keys(variant.dimensions).length > 0 && (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <GlassIcon icon="📏" variant="accent" size="small" />
                      <span className="text-white/80">
                        {Object.entries(variant.dimensions)
                          .filter(([key, value]) => value && value !== 'N/A' && value.toString().trim() !== '')
                          .map(([key, value]) => {
                            const shortKey = key === 'length' ? 'L' : key === 'width' ? 'W' : key === 'height' ? 'H' : key === 'diameter' ? 'D' : key.charAt(0).toUpperCase();
                            return `${shortKey}: ${value}`;
                          })
                          .join('mm, ')}mm
                      </span>
                    </div>
                  )}
                  
                  {/* Fallback to size if neither capacity nor dimensions */}
                  {!variant.capacity && (!variant.dimensions || Object.keys(variant.dimensions).length === 0) && variant.size && (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <GlassIcon icon="📏" variant="accent" size="small" />
                      <span className="text-white/80">
                        Size: {variant.size}
                      </span>
                    </div>
                  )}
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
                  <div className="rounded-xl p-4 border border-white/20" style={{ background: 'var(--primary-gradient)', opacity: 0.2 }}>
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
                  className="mt-4 px-4 py-2 rounded-lg text-white font-bold shadow transition-all"
                  style={{ background: 'var(--dark-primary-gradient)' }}
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
            className="px-6 py-2 rounded-lg text-white font-bold shadow transition-all"
            style={{ background: 'var(--dark-primary-gradient)' }}
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