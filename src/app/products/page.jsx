"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import productsData from "../../data/products.json";
import {
    GlassButton,
    GlassCard,
    GlassIcon,
    NeonBubblesBackground
} from "../components/Glassmorphism";
import favicon from "../images/favicon.png";

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

  // Stock status options
  const stockOptions = [
    { value: '', label: 'All' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'made_to_order', label: 'Made to Order' },
    { value: 'limited_stock', label: 'Limited Stock' },
  ];

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
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
            <span className="text-white font-medium">
              Products
            </span>
          </div>
        </nav>

        {/* Hero Glass Card */}
        <section className="flex flex-col items-center justify-center pb-10">
          <GlassCard variant="primary" padding="large" className="w-full max-w-4xl flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 drop-shadow-[0_2px_16px_rgba(58,143,255,0.7)]">
              Product Catalog
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Discover our complete range of high-quality fused silica laboratory ware. Each product is individually oxy-gas fired for maximum purity and performance.
            </p>
            
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
              <Link href="/catalog.pdf" target="_blank">
                <GlassButton
                  variant="accent"
                  size="large"
                  className="min-w-[200px]"
                >
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span>Download PDF Catalog</span>
                  </div>
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </section>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover our comprehensive range of premium laboratory equipment and supplies
          </p>
          
          {/* Generate PDF Button */}
          <div className="mt-6">
            <GlassButton
              onClick={() => window.open('/api/generate-catalog', '_blank')}
              variant="accent"
              size="large"
              className="mx-auto"
            >
              <span>📄 Generate PDF Catalog</span>
              <span>⬇️</span>
            </GlassButton>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8 bg-white/10 rounded-xl p-4 shadow-lg backdrop-blur-md">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-white/80 mb-1 text-sm font-medium">Category</label>
            <select
              className="w-full rounded-lg px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* Stock Status Filter */}
          <div className="flex-1">
            <label className="block text-white/80 mb-1 text-sm font-medium">Stock Status</label>
            <select
              className="w-full rounded-lg px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedStock}
              onChange={e => setSelectedStock(e.target.value)}
            >
              {stockOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* Packaging Filter */}
          <div className="flex-1">
            <label className="block text-white/80 mb-1 text-sm font-medium">Packaging</label>
            <select
              className="w-full rounded-lg px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedPackaging}
              onChange={e => setSelectedPackaging(e.target.value)}
            >
              <option value="">All</option>
              {packagingOptions.map((pkg) => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>
          {/* Price Range Filter */}
          <div className="flex-1 flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-white/80 mb-1 text-sm font-medium">Min Price (₹)</label>
              <input
                type="number"
                className="w-full rounded-lg px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={minPrice}
                min={0}
                onChange={e => setMinPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white/80 mb-1 text-sm font-medium">Max Price (₹)</label>
              <input
                type="number"
                className="w-full rounded-lg px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={maxPrice}
                min={0}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filteredProducts.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.categorySlug}`}
              className="block group h-full"
            >
              <GlassCard variant="secondary" padding="default" className="group hover:scale-105 transition-transform duration-300 cursor-pointer h-full flex flex-col">
                <div className="flex flex-col h-full">
                  {/* Product Image */}
                  {product.catNo && (
                    <div className="mb-4 relative">
                      <div className="aspect-square w-full h-32 overflow-hidden rounded-xl border border-white/20 shadow-lg bg-gradient-to-br from-white/10 to-white/5">
                        <Image
                          src={`/images/products/${getBaseCatalogNumber(product.catNo)}.png`}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover object-center"
                        />
                        {/* Light overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3a8fff]/5 to-[#a259ff]/5 rounded-xl pointer-events-none"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Product Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white/60 uppercase tracking-wider bg-white/10 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <GlassIcon icon="🧪" variant="primary" size="small" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#3a8fff] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {product.description}
                    </p>
                    {product.catNo && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <GlassIcon icon="🏷️" variant="accent" size="small" />
                        <span className="text-white/80">CAT. NO.: <span className="text-white font-mono font-medium">{product.catNo}</span></span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-sm">
                      <GlassIcon icon="📏" variant="accent" size="small" />
                      <span className="text-white/80">Capacity: <span className="text-white font-medium">{product.capacity}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GlassIcon icon="📦" variant="accent" size="small" />
                      <span className="text-white/80">Packaging: <span className="text-white font-medium">{product.packaging}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GlassIcon icon="💰" variant="accent" size="small" />
                      <div className="flex flex-col">
                        <span className="text-white/80">Price Range:</span>
                        <span className="text-white font-medium">
                          {activeCoupon 
                            ? applyDiscountToPriceRange(product.priceRange, activeCoupon.discountPercent)
                            : product.priceRange
                          }
                        </span>
                        {activeCoupon && (
                          <span className="text-green-400 text-xs">
                            {activeCoupon.discountPercent}% off with {activeCoupon.code}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white/90 mb-2">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {product.features && product.features.length > 0 ? (
                        product.features.map((feature, index) => (
                          <div key={`${product.id}-${product.catNo}-feature-${index}`} className="flex items-center gap-1 text-xs">
                            <div className="w-1 h-1 bg-[#3a8fff] rounded-full"></div>
                            <span className="text-white/70">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-white/50 italic">
                          Features not specified
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {getStockStatusDisplay(product.stockStatus || 'in_stock')}
                    {product.quantity !== undefined && product.quantity !== null && (
                      <span className="ml-2 text-sm text-white/60">
                        Qty: {product.quantity}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <div className="w-full px-4 py-3 bg-gradient-to-r from-[#3a8fff]/20 to-[#a259ff]/20 rounded-xl border border-white/20 text-center group-hover:from-[#3a8fff]/30 group-hover:to-[#a259ff]/30 transition-all">
                      <span className="text-white font-medium">View Variants & Pricing</span>
                      <span className="text-white ml-2">→</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </a>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <GlassCard variant="accent" padding="large" className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Order?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Contact us for bulk orders, custom specifications, or any questions about our products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton href="/contact" variant="primary" size="large">
                <span>Contact Us</span>
                <span>→</span>
              </GlassButton>
              <Link href="/catalog.pdf" target="_blank">
                <GlassButton
                  variant="secondary"
                  size="large"
                >
                  <span>📄</span>
                  <span>Download Full Catalog</span>
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
} 