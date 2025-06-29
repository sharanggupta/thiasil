"use client";
import { useEffect, useState } from "react";
import productsData from '../../data/products.json';
import { STOCK_STATUSES } from '../../lib/constants';
import { SIDEBAR_NAVIGATION } from '../../lib/constants/navigation';
import { useAdminBackups } from '../../lib/hooks/useAdminBackups';
import { useAdminCoupons } from '../../lib/hooks/useAdminCoupons';
import { useAdminProducts } from '../../lib/hooks/useAdminProducts';
import { useAdminSession } from '../../lib/hooks/useAdminSession';
import {
    GlassButton,
    GlassCard,
    GlassIcon,
    NeonBubblesBackground
} from "../components/Glassmorphism";
import Navbar from "../components/Navbar/Navbar";
import Heading from "../components/common/Heading";
import StockStatusBadge from "../components/common/StockStatusBadge";

const sidebarNav = SIDEBAR_NAVIGATION;

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Admin tabs configuration
const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'prices', label: 'Price Management', icon: '💰' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'add-products', label: 'Add Products', icon: '➕' },
  { id: 'backups', label: 'Backups', icon: '💾' },
  { id: 'coupons', label: 'Coupons', icon: '🎫' }
];

export default function AdminPage() {
  // Use the custom session hook
  const session = useAdminSession();
  const {
    isAuthenticated,
    username,
    setUsername,
    password,
    setPassword,
    loginAttempts,
    isLocked,
    message,
    setMessage,
    isLoading,
    setIsLoading,
    handleLogin,
    handleLogout,
    startSessionTimer,
    clearSessionTimer,
    setIsAuthenticated
  } = session;

  // Use the custom products hook
  const productsApi = useAdminProducts({ isAuthenticated, setMessage, username, password });
  const {
    products,
    setProducts,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    categoryProducts,
    setCategoryProducts,
    selectedProductId,
    setSelectedProductId,
    productForm,
    setProductForm,
    categoryForm,
    setCategoryForm,
    newDimensionField,
    setNewDimensionField,
    newFeature,
    setNewFeature,
    isAddLoading,
    setIsAddLoading,
    isUploading,
    setIsUploading,
    selectedImage,
    setSelectedImage,
    imagePreview,
    setImagePreview,
    loadProducts,
    addCategory,
    addProduct,
    addDimensionField,
    removeDimensionField,
    handleImageUpload,
    handleImageSelect
  } = productsApi;

  // Use the custom backups hook
  const backupsApi = useAdminBackups({ setMessage, loadProducts, username, password });
  const {
    backups,
    setBackups,
    selectedBackup,
    setSelectedBackup,
    isBackupLoading,
    setIsBackupLoading,
    loadBackups,
    restoreBackup,
    resetToDefault,
    cleanupBackups,
    deleteBackup
  } = backupsApi;

  // Use the custom coupons hook
  const couponsApi = useAdminCoupons({ setMessage, username, password });
  const {
    coupons,
    setCoupons,
    isCouponLoading,
    setIsCouponLoading,
    couponForm,
    setCouponForm,
    loadCoupons,
    createCoupon,
    deleteCoupon
  } = couponsApi;

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Unified management states
  const [priceChangePercent, setPriceChangePercent] = useState(10);
  const [stockStatus, setStockStatus] = useState("in_stock");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      loadBackups();
      loadCoupons();
    }
  }, [isAuthenticated]);

  // Input sanitization
  const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '').trim();
  };

  const updatePrices = async () => {
    if (!isAuthenticated) {
      setMessage("Please login first");
      return;
    }

    const percent = parseFloat(priceChangePercent);
    if (isNaN(percent) || percent < -50 || percent > 100) {
      setMessage("Price change percentage must be between -50 and 100");
      return;
    }

    const credentials = { username, password };
    if (!credentials) {
      setMessage("Session expired. Please login again.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/admin/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          category: selectedCategory,
          priceChangePercent: percent,
          productId: selectedProductId !== "all" ? selectedProductId : undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Successfully updated prices for ${data.updatedCount} items.`);
        loadProducts(); // Refresh products
      } else {
        setMessage(data.error || "Failed to update prices");
      }
    } catch (error) {
      console.error('Error updating prices:', error);
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateInventory = async () => {
    if (!isAuthenticated) {
      setMessage("Please login first");
      return;
    }

    const credentials = { username, password };
    if (!credentials) {
      setMessage("Session expired. Please login again.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/admin/update-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          category: selectedCategory,
          stockStatus,
          quantity: quantity ? parseInt(quantity) : null,
          productId: selectedProductId !== "all" ? selectedProductId : undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Successfully updated inventory for ${data.updatedCount} items.`);
        loadProducts(); // Refresh products
      } else {
        setMessage(data.error || "Failed to update inventory");
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update categoryProducts when selectedCategory changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all" && products.length > 0) {
      // Find all products/variants in the selected category
      const variants = [];
      // Find main product
      products.forEach((p) => {
        if (p.categorySlug === selectedCategory) {
          variants.push({
            id: p.id,
            name: p.name,
            type: "product"
          });
        }
      });
      // Find variants from productVariants
      const allVariants = productsData.productVariants?.[selectedCategory]?.variants || [];
      allVariants.forEach((v) => {
        variants.push({
          id: v.id,
          name: v.name + (v.capacity ? ` (${v.capacity})` : ""),
          type: "variant"
        });
      });
      setCategoryProducts(variants);
      setSelectedProductId("all");
    } else {
      setCategoryProducts([]);
      setSelectedProductId("all");
    }
  }, [selectedCategory, products]);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#3a8fff] via-[#009ffd] to-[#2a2a72] overflow-x-hidden">
        <Navbar />
        <NeonBubblesBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-[#009ffd]/30 via-[#3a8fff]/20 to-[#2a2a72]/80 pointer-events-none z-0" />

        <main className="relative z-10 max-w-4xl mx-auto px-4 pb-24 flex flex-col gap-20 ml-0 md:ml-32">
          <section className="flex flex-col items-center justify-center pt-32 pb-10">
            <GlassCard variant="primary" padding="large" className="w-full max-w-md flex flex-col items-center text-center bg-white/20 text-white/95 shadow-2xl">
              <div className="text-center mb-8">
                <GlassIcon icon="🔐" variant="primary" size="large" />
                <Heading as="h1" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mt-4 mb-2" size="secondary">
                  Admin Access
                </Heading>
                <p className="text-white/80">Enter credentials to access admin panel</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#3a8fff] transition-colors"
                    placeholder="Enter username"
                    required
                    disabled={isLocked || isLoading}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#3a8fff] transition-colors"
                    placeholder="Enter password"
                    required
                    disabled={isLocked || isLoading}
                    maxLength={100}
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-xl text-sm ${message.includes('successful') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {message}
                  </div>
                )}

                <GlassButton
                  type="submit"
                  variant="accent"
                  size="large"
                  className="w-full"
                  disabled={isLocked || isLoading}
                >
                  {isLoading ? (
                    <span>Logging in...</span>
                  ) : isLocked ? (
                    <span>Account Locked</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <span>→</span>
                    </>
                  )}
                </GlassButton>
              </form>

              {isLocked && (
                <div className="mt-4 p-3 bg-red-500/20 rounded-xl text-sm text-red-300">
                  Account temporarily locked due to multiple failed attempts.
                </div>
              )}
            </GlassCard>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#3a8fff] via-[#009ffd] to-[#2a2a72] overflow-x-hidden">
      <Navbar theme="products" />
      <NeonBubblesBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#009ffd]/30 via-[#3a8fff]/20 to-[#2a2a72]/80 pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-8 ml-0 md:ml-32">
        {/* Hero Glass Card */}
        <section className="flex flex-col items-center justify-center pt-32 pb-10">
          <GlassCard variant="primary" padding="large" className="w-full max-w-4xl flex flex-col items-center text-center bg-white/20 text-white/95 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <GlassIcon icon="⚙️" variant="primary" size="large" />
              <Heading
                as="h1"
                gradient="linear-gradient(90deg, #fff, #009ffd 60%, #2a2a72 100%)"
                className="mb-4 drop-shadow-lg font-extrabold text-4xl md:text-5xl text-transparent bg-clip-text"
                size="primary"
              >
                ADMIN PANEL
              </Heading>
            </div>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Manage product prices, inventory, and backups in one unified interface
            </p>
            <div className="flex flex-col items-center gap-4 mt-4">
              <div className="text-sm text-white/60 text-center mb-2">
                Logged in as: <span className="text-white font-medium">{username}</span>
              </div>
              <GlassButton onClick={handleLogout} variant="secondary" size="large" className="mx-auto">
                <span>Logout</span>
                <span>←</span>
              </GlassButton>
            </div>
          </GlassCard>
        </section>
        {/* Tab Navigation */}
        <section className="w-full">
          <GlassCard variant="secondary" padding="medium" className="w-full">
            <div className="flex gap-1 md:gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent px-1 md:px-0 justify-center md:justify-start">
              {ADMIN_TABS.map((tab) => (
                <GlassButton
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "primary" : "secondary"}
                  size="medium"
                  className={`flex items-center gap-2 uppercase font-bold tracking-wide px-3 py-2 md:px-5 md:py-2 rounded-2xl transition-all duration-200 min-w-[120px] ${activeTab === tab.id ? "shadow-lg shadow-blue-400/30" : ""}`}
                >
                  <span className="flex items-center text-lg md:text-xl">{tab.icon}</span>
                  <span className="text-sm md:text-base">{tab.label}</span>
                </GlassButton>
              ))}
            </div>
          </GlassCard>
        </section>
        {/* Tab Content */}
        <section className="w-full">
          <GlassCard variant="secondary" padding="large" className="w-full">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📊</span>
                  Dashboard
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <GlassCard variant="primary" padding="default" className="w-full max-w-xs flex flex-col items-center text-center bg-white/20 text-white/95">
                    <GlassIcon icon="📦" variant="primary" size="medium" className="mb-2" />
                    <Heading as="h2" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="secondary">
                      Total Products
                    </Heading>
                    <div className="text-2xl font-bold text-white">{products.length}</div>
                  </GlassCard>
                  <GlassCard variant="primary" padding="default" className="w-full max-w-xs flex flex-col items-center text-center bg-white/20 text-white/95">
                    <GlassIcon icon="🏷️" variant="primary" size="medium" className="mb-2" />
                    <Heading as="h2" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="secondary">
                      Categories
                    </Heading>
                    <div className="text-2xl font-bold text-white">{categories.length}</div>
                  </GlassCard>
                  <GlassCard variant="primary" padding="default" className="w-full max-w-xs flex flex-col items-center text-center bg-white/20 text-white/95">
                    <GlassIcon icon="💾" variant="primary" size="medium" className="mb-2" />
                    <Heading as="h2" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="secondary">
                      Backups
                    </Heading>
                    <div className="text-2xl font-bold text-white">{backups.length}</div>
                  </GlassCard>
                  <GlassCard variant="primary" padding="default" className="w-full max-w-xs flex flex-col items-center text-center bg-white/20 text-white/95">
                    <GlassIcon icon="🎫" variant="primary" size="medium" className="mb-2" />
                    <Heading as="h2" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-1 text-base md:text-lg" size="secondary">
                      Active Coupons
                    </Heading>
                    <div className="text-2xl font-bold text-white">{coupons.length}</div>
                  </GlassCard>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <GlassButton
                      onClick={() => setActiveTab('prices')}
                      variant="accent"
                      size="large"
                      className="w-full"
                    >
                      <span>💰</span>
                      <span>Update Prices</span>
                    </GlassButton>
                    <GlassButton
                      onClick={() => setActiveTab('inventory')}
                      variant="accent"
                      size="large"
                      className="w-full"
                    >
                      <span>📦</span>
                      <span>Manage Inventory</span>
                    </GlassButton>
                    <GlassButton
                      onClick={() => setActiveTab('add-products')}
                      variant="accent"
                      size="large"
                      className="w-full"
                    >
                      <span>➕</span>
                      <span>Add Products</span>
                    </GlassButton>
                  </div>
                </div>
              </div>
            )}

            {/* Price Management Tab */}
            {activeTab === 'prices' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>💰</span>
                  Price Management
                </h2>
                
                {/* Category and Product Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product/Variant selection if category is not all */}
                  {selectedCategory !== "all" && categoryProducts.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Product/Variant</label>
                      <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                      >
                        <option value="all">All in Category</option>
                        {categoryProducts.map((prod) => (
                          <option key={prod.type + '-' + prod.id} value={prod.id}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Price Update Form */}
                <div className="bg-white/5 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Price Change (%)</label>
                      <input
                        type="number"
                        value={priceChangePercent}
                        onChange={(e) => setPriceChangePercent(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        placeholder="10"
                        min="-50"
                        max="100"
                        step="0.1"
                      />
                      <p className="text-xs text-white/60 mt-1">Range: -50% to +100%</p>
                    </div>

                    <div className="flex items-end">
                      <GlassButton
                        onClick={updatePrices}
                        variant="accent"
                        size="large"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span>Updating...</span>
                        ) : (
                          <>
                            <span>Update Prices</span>
                            <span>→</span>
                          </>
                        )}
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Management Tab */}
            {activeTab === 'inventory' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📦</span>
                  Inventory Management
                </h2>
                
                {/* Category and Product Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product/Variant selection if category is not all */}
                  {selectedCategory !== "all" && categoryProducts.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Product/Variant</label>
                      <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                      >
                        <option value="all">All in Category</option>
                        {categoryProducts.map((prod) => (
                          <option key={prod.type + '-' + prod.id} value={prod.id}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Inventory Update Form */}
                <div className="bg-white/5 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Stock Status</label>
                      <select
                        value={stockStatus}
                        onChange={(e) => setStockStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                      >
                        {Object.values(STOCK_STATUSES).map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Quantity (Optional)</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        placeholder="Leave empty for made-to-order"
                        min="0"
                      />
                      <p className="text-xs text-white/60 mt-1">Leave empty for made-to-order</p>
                    </div>

                    <div className="flex items-end">
                      <GlassButton
                        onClick={updateInventory}
                        variant="accent"
                        size="large"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span>Updating...</span>
                        ) : (
                          <>
                            <span>Update Inventory</span>
                            <span>→</span>
                          </>
                        )}
                      </GlassButton>
                    </div>
                  </div>

                  {/* Stock Status Legend */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Stock Status Guide</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.values(STOCK_STATUSES).map((status) => (
                        <div key={status.value} className="flex items-center gap-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} min-w-[100px] text-center`}>
                            {status.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Products Tab */}
            {activeTab === 'add-products' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>➕</span>
                  Add Categories & Products
                </h2>
                
                {/* Add Category Form */}
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Add New Category</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Category Name</label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        placeholder="e.g., Test Tubes"
                        maxLength={50}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Category Slug</label>
                      <input
                        type="text"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        placeholder="e.g., test-tubes"
                        maxLength={30}
                      />
                      <p className="text-xs text-white/60 mt-1">Auto-converted to lowercase with hyphens</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                      placeholder="Category description..."
                      rows="3"
                      maxLength={200}
                    />
                  </div>

                  {/* Dimension Fields */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/80 mb-2">Dimension Fields</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <input
                          type="text"
                          value={newDimensionField.name}
                          onChange={(e) => setNewDimensionField({...newDimensionField, name: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                          placeholder="Field name (e.g., Length)"
                          maxLength={20}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newDimensionField.unit}
                          onChange={(e) => setNewDimensionField({...newDimensionField, unit: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                          placeholder="Unit (e.g., mm)"
                          maxLength={10}
                        />
                      </div>
                      <div className="flex items-end">
                        <GlassButton
                          onClick={addDimensionField}
                          variant="primary"
                          size="large"
                          className="w-full bg-gradient-to-r from-[#009ffd] to-[#3a8fff] text-white font-bold shadow-lg shadow-blue-400/30 border border-white/30 rounded-xl hover:from-[#3a8fff] hover:to-[#009ffd] transition-all"
                        >
                          <span>Add Field</span>
                        </GlassButton>
                      </div>
                    </div>

                    {categoryForm.dimensionFields.length > 0 && (
                      <div className="bg-white/5 rounded-xl p-3">
                        <h5 className="text-sm font-medium text-white/80 mb-2">Added Fields:</h5>
                        <div className="space-y-2">
                          {categoryForm.dimensionFields.map((field, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                              <span className="text-white text-sm">
                                {field.name} ({field.unit})
                              </span>
                              <GlassButton
                                onClick={() => removeDimensionField(index)}
                                variant="secondary"
                                size="small"
                              >
                                <span>🗑️</span>
                              </GlassButton>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <GlassButton
                      onClick={addCategory}
                      variant="accent"
                      size="large"
                      disabled={isAddLoading}
                    >
                      {isAddLoading ? (
                        <span>Adding...</span>
                      ) : (
                        <>
                          <span>Add Category</span>
                          <span>➕</span>
                        </>
                      )}
                    </GlassButton>
                  </div>
                </div>

                {/* Add Product Form */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Add New Product</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        placeholder="e.g., 15ml Test Tube"
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                      >
                        <option value="">Select a category</option>
                        {Object.keys(productsData.productVariants || {}).map((category) => (
                          <option key={category} value={category}>
                            {productsData.productVariants[category].name || category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Stock Status</label>
                      <select
                        value={productForm.stockStatus}
                        onChange={(e) => setProductForm({...productForm, stockStatus: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                      >
                        {Object.values(STOCK_STATUSES).map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Quantity (Optional)</label>
                      <input
                        type="number"
                        value={productForm.quantity}
                        onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        placeholder="Leave empty for made-to-order"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Dynamic Dimension Fields */}
                  {productForm.category && productsData.productVariants?.[productForm.category]?.dimensionFields?.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white/80 mb-2">Dimensions</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {productsData.productVariants[productForm.category].dimensionFields.map((field) => (
                          <div key={field.name}>
                            <label className="block text-xs text-white/60 mb-1">{field.name} ({field.unit})</label>
                            <input
                              type="text"
                              value={productForm.dimensions[field.name] || ""}
                              onChange={(e) => setProductForm({
                                ...productForm,
                                dimensions: {
                                  ...productForm.dimensions,
                                  [field.name]: e.target.value
                                }
                              })}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                              placeholder={`Enter ${field.name.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/80 mb-2">Features (Optional)</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={e => setNewFeature(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        placeholder="Enter a feature and click Add"
                        maxLength={100}
                      />
                      <GlassButton
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          if (newFeature.trim()) {
                            setProductForm(prev => ({
                              ...prev,
                              features: [...(prev.features || []), newFeature.trim()]
                            }));
                            setNewFeature("");
                          }
                        }}
                        disabled={!newFeature.trim()}
                      >
                        <span>Add</span>
                      </GlassButton>
                    </div>
                    {productForm.features && productForm.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {productForm.features.map((feature, idx) => (
                          <span key={idx} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                            {feature}
                            <button
                              type="button"
                              className="ml-1 text-red-300 hover:text-red-500"
                              onClick={() => setProductForm(prev => ({
                                ...prev,
                                features: prev.features.filter((_, i) => i !== idx)
                              }))}
                              aria-label="Remove feature"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/80 mb-2">Product Image</label>
                    <div className="flex gap-2 items-center">
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <GlassButton
                        as="label"
                        htmlFor="product-image-upload"
                        variant="secondary"
                        size="medium"
                        className="cursor-pointer flex items-center gap-2"
                        tabIndex={0}
                        aria-label="Upload product image"
                      >
                        <span>Upload</span>
                        <span aria-hidden="true">
                          {/* Upload icon: arrow up, glassmorphic style */}
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 16V4" stroke="#3a8fff" strokeWidth="2.2" strokeLinecap="round"/>
                            <path d="M6 8l4-4 4 4" stroke="#3a8fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </GlassButton>
                      <span className="text-white/80 text-sm truncate max-w-xs">
                        {selectedImage ? selectedImage.name : "No file chosen"}
                      </span>
                      {selectedImage && (
                        <GlassButton
                          onClick={() => handleImageUpload(selectedImage)}
                          variant="accent"
                          size="small"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <span>Uploading...</span>
                          ) : (
                            <>
                              <span>Upload</span>
                              <span>
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10 16V4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                                  <path d="M6 8l4-4 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </span>
                            </>
                          )}
                        </GlassButton>
                      )}
                    </div>
                  </div>

                  {/* Image Preview */}
                  {(imagePreview || productForm.image) && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white/80 mb-2">Image Preview</label>
                      <div className="h-32 w-32 overflow-hidden rounded-lg border border-white/20">
                        <img
                          src={imagePreview || productForm.image}
                          alt="Product Image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {productForm.image && (
                        <p className="text-xs text-white/60 mt-1">Image uploaded: {productForm.image}</p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center">
                    <GlassButton
                      onClick={addProduct}
                      variant="accent"
                      size="large"
                      disabled={isAddLoading || !productForm.category}
                    >
                      {isAddLoading ? (
                        <span>Adding...</span>
                      ) : (
                        <>
                          <span>Add Product</span>
                          <span>➕</span>
                        </>
                      )}
                    </GlassButton>
                  </div>
                </div>

                {/* Information */}
                <div className="bg-white/5 rounded-xl p-4 mt-4">
                  <h4 className="text-lg font-semibold text-white mb-3">How to Use</h4>
                  <div className="space-y-2 text-sm text-white/80">
                    <p>• <strong>Categories:</strong> Create new product categories with custom dimension fields</p>
                    <p>• <strong>Dimension Fields:</strong> Define custom measurement fields (e.g., Length, Width, Height) with units</p>
                    <p>• <strong>Products:</strong> Add product variants to existing categories with specific dimensions</p>
                    <p>• <strong>Dynamic Forms:</strong> Product forms automatically adapt to category dimension fields</p>
                    <p>• <strong>Auto-backup:</strong> All changes are automatically backed up before saving</p>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Management Tab */}
            {activeTab === 'backups' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>💾</span>
                  Backup Management
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Backup Actions</h3>
                    <div className="space-y-4">
                      <GlassButton
                        onClick={restoreBackup}
                        variant="accent"
                        size="large"
                        className="w-full"
                        disabled={isBackupLoading || !selectedBackup}
                      >
                        {isBackupLoading ? (
                          <span>Restoring...</span>
                        ) : (
                          <>
                            <span>Restore Backup</span>
                            <span>↩️</span>
                          </>
                        )}
                      </GlassButton>
                      
                      <GlassButton
                        onClick={resetToDefault}
                        variant="secondary"
                        size="large"
                        className="w-full"
                        disabled={isBackupLoading}
                      >
                        {isBackupLoading ? (
                          <span>Resetting...</span>
                        ) : (
                          <>
                            <span>Reset to Default</span>
                            <span>🔄</span>
                          </>
                        )}
                      </GlassButton>
                      
                      <GlassButton
                        onClick={cleanupBackups}
                        variant="secondary"
                        size="large"
                        className="w-full"
                        disabled={isBackupLoading}
                      >
                        {isBackupLoading ? (
                          <span>Cleaning...</span>
                        ) : (
                          <>
                            <span>Cleanup Old Backups</span>
                            <span>🧹</span>
                          </>
                        )}
                      </GlassButton>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Available Backups</h3>
                    {backups.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {backups.map((backup) => (
                          <div
                            key={backup.filename}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedBackup === backup.filename
                                ? 'bg-[#3a8fff]/20 border-[#3a8fff]'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => setSelectedBackup(backup.filename)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white truncate">
                                  {backup.filename}
                                </div>
                                <div className="text-xs text-white/60">
                                  {new Date(backup.created).toLocaleString()} • {(backup.size / 1024).toFixed(1)} KB
                                </div>
                              </div>
                              <GlassButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBackup(backup.filename);
                                }}
                                variant="secondary"
                                size="small"
                                disabled={isBackupLoading}
                              >
                                <span>🗑️</span>
                              </GlassButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-white/60 py-8">
                        <div className="text-4xl mb-2">💾</div>
                        <p>No backups available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Backup Information</h4>
                  <div className="space-y-2 text-sm text-white/80">
                    <p>• <strong>Auto-backup:</strong> Backups are automatically created before any changes</p>
                    <p>• <strong>Restore:</strong> Select a backup and click "Restore Backup" to revert changes</p>
                    <p>• <strong>Reset:</strong> Reset to the original default product data</p>
                    <p>• <strong>Cleanup:</strong> Automatically removes old backups, keeping only the last 10</p>
                    <p>• <strong>Manual Delete:</strong> Click the trash icon to delete specific backups</p>
                  </div>
                </div>
              </div>
            )}

            {/* Coupon Management Tab */}
            {activeTab === 'coupons' && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>🎫</span>
                  Coupon Management
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Create Coupon Form */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Create New Coupon</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Coupon Code</label>
                        <input
                          type="text"
                          value={couponForm.code}
                          onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                          placeholder="e.g., SAVE20"
                          maxLength={20}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Discount Percentage</label>
                        <input
                          type="number"
                          value={couponForm.discountPercent}
                          onChange={(e) => setCouponForm({...couponForm, discountPercent: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                          placeholder="20"
                          min="1"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Expiry Date</label>
                        <input
                          type="date"
                          value={couponForm.expiryDate}
                          onChange={(e) => setCouponForm({...couponForm, expiryDate: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Max Uses (Optional)</label>
                        <input
                          type="number"
                          value={couponForm.maxUses}
                          onChange={(e) => setCouponForm({...couponForm, maxUses: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                          placeholder="Leave empty for unlimited"
                          min="1"
                        />
                      </div>

                      <GlassButton
                        onClick={createCoupon}
                        variant="accent"
                        size="large"
                        className="w-full"
                        disabled={isCouponLoading}
                      >
                        {isCouponLoading ? (
                          <span>Creating...</span>
                        ) : (
                          <>
                            <span>Create Coupon</span>
                            <span>🎫</span>
                          </>
                        )}
                      </GlassButton>
                    </div>
                  </div>

                  {/* Active Coupons List */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Active Coupons</h3>
                    
                    {coupons.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {coupons.map((coupon) => {
                          const isExpired = new Date(coupon.expiryDate) < new Date();
                          const isMaxedOut = coupon.maxUses && coupon.usageCount >= coupon.maxUses;
                          
                          return (
                            <div key={coupon.code} className="bg-white/5 rounded-lg p-4 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-white">{coupon.code}</span>
                                  <span className="text-sm text-white/60">-{coupon.discountPercent}%</span>
                                </div>
                                <GlassButton
                                  onClick={() => deleteCoupon(coupon.code)}
                                  variant="secondary"
                                  size="small"
                                  disabled={isCouponLoading}
                                >
                                  <span>🗑️</span>
                                </GlassButton>
                              </div>
                              
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-white/80">Expires:</span>
                                  <span className={`${isExpired ? 'text-red-400' : 'text-white'}`}>
                                    {new Date(coupon.expiryDate).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/80">Usage:</span>
                                  <span className={`${isMaxedOut ? 'text-red-400' : 'text-white'}`}>
                                    {coupon.usageCount || 0}
                                    {coupon.maxUses && ` / ${coupon.maxUses}`}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/80">Status:</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isExpired || isMaxedOut 
                                      ? 'bg-red-500/20 text-red-400' 
                                      : 'bg-green-500/20 text-green-400'
                                  }`}>
                                    {isExpired ? 'Expired' : isMaxedOut ? 'Maxed Out' : 'Active'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-white/60 py-8">
                        <div className="text-4xl mb-2">🎫</div>
                        <p>No active coupons</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Coupon Info */}
                <div className="bg-white/5 rounded-xl p-4 mt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Coupon Information</h4>
                  <div className="space-y-2 text-sm text-white/80">
                    <p>• <strong>Code:</strong> Unique coupon code (automatically converted to uppercase)</p>
                    <p>• <strong>Discount:</strong> Percentage discount applied to product prices</p>
                    <p>• <strong>Expiry:</strong> Date when the coupon becomes invalid</p>
                    <p>• <strong>Max Uses:</strong> Optional limit on how many times the coupon can be used</p>
                    <p>• <strong>Usage Tracking:</strong> Coupon usage is automatically tracked and incremented</p>
                    <p>• <strong>Validation:</strong> Coupons are validated on the products page for customers</p>
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className={`p-4 rounded-xl text-sm ${message.includes('Successfully') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {message}
              </div>
            )}
          </GlassCard>
        </section>

        {/* Products Preview */}
        <section className="w-full">
          <GlassCard variant="secondary" padding="large" className="w-full">
            <Heading as="h2" gradient="linear-gradient(to right, #009ffd, #2a2a72)" className="mb-6" size="secondary">Current Products</Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider bg-white/10 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-xs text-white/60">{product.catNo}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-white/70 mb-3">{product.description}</p>
                  
                  {/* Stock Status */}
                  <div className="mb-3">
                    <StockStatusBadge status={product.stockStatus || 'in_stock'} />
                    {product.quantity !== undefined && product.quantity !== null && (
                      <span className="ml-2 text-sm text-white/60">
                        Qty: {product.quantity}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Price Range:</span>
                      <span className="text-white font-medium">{product.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Capacity:</span>
                      <span className="text-white">{product.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Packaging:</span>
                      <span className="text-white">{product.packaging}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
} 