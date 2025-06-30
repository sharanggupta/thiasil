"use client";
import { useEffect, useState } from "react";
import productsData from '@/data/products.json';
import { useAdminBackups } from '@/lib/hooks/useAdminBackups';
import { useAdminCoupons } from '@/lib/hooks/useAdminCoupons';
import { useAdminProducts } from '@/lib/hooks/useAdminProducts';
import { useAdminSession } from '@/lib/hooks/useAdminSession';
import {
    GlassButton,
    GlassCard,
    GlassIcon,
    GlassInput,
    GlassContainer,
    NeonBubblesBackground
} from "@/app/components/Glassmorphism";
import Navbar from "@/app/components/Navbar/Navbar";
import Heading from "@/app/components/common/Heading";
import StockStatusBadge from "@/app/components/common/StockStatusBadge";
import AdminLayout from "@/app/components/admin/AdminLayout";
import BackupManagement from "@/app/components/admin/BackupManagement";
import PriceManagement from "@/app/components/admin/PriceManagement";
import InventoryManagement from "@/app/components/admin/InventoryManagement";
import ProductAddition from "@/app/components/admin/ProductAddition";
import CouponManagement from "@/app/components/admin/CouponManagement";


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

  // Image cleanup states
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

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

  // Image cleanup functions
  const analyzeImages = async () => {
    if (!isAuthenticated) {
      setMessage("Please login first");
      return;
    }

    setIsImageLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          action: 'analyze_images'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setImageAnalysis(data.analysis);
        setMessage(data.message);
      } else {
        setMessage(data.error || "Failed to analyze images");
      }
    } catch (error) {
      console.error('Error analyzing images:', error);
      setMessage("Network error. Please try again.");
    } finally {
      setIsImageLoading(false);
    }
  };

  const cleanupImages = async () => {
    if (!isAuthenticated) {
      setMessage("Please login first");
      return;
    }

    if (!imageAnalysis?.unusedCount) {
      setMessage("No unused images found. Run analysis first.");
      return;
    }

    setIsImageLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          action: 'cleanup_images'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Refresh analysis after cleanup
        setTimeout(() => analyzeImages(), 1000);
      } else {
        setMessage(data.error || "Failed to cleanup images");
      }
    } catch (error) {
      console.error('Error cleaning up images:', error);
      setMessage("Network error. Please try again.");
    } finally {
      setIsImageLoading(false);
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
      <AdminLayout isAuthenticated={false}>
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
                <GlassInput
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  disabled={isLocked || isLoading}
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <GlassInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isAuthenticated={true} username={username} handleLogout={handleLogout}>
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

                <GlassContainer>
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
                </GlassContainer>
              </div>
            )}

            {/* Price Management Tab */}
            {activeTab === 'prices' && (
              <PriceManagement
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categoryProducts={categoryProducts}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                priceChangePercent={priceChangePercent}
                setPriceChangePercent={setPriceChangePercent}
                updatePrices={updatePrices}
                isLoading={isLoading}
              />
            )}

            {/* Inventory Management Tab */}
            {activeTab === 'inventory' && (
              <InventoryManagement
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categoryProducts={categoryProducts}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                stockStatus={stockStatus}
                setStockStatus={setStockStatus}
                quantity={quantity}
                setQuantity={setQuantity}
                updateInventory={updateInventory}
                isLoading={isLoading}
              />
            )}

            {/* Add Products Tab */}
            {activeTab === 'add-products' && (
              <ProductAddition
                categoryForm={categoryForm}
                setCategoryForm={setCategoryForm}
                productForm={productForm}
                setProductForm={setProductForm}
                newDimensionField={newDimensionField}
                setNewDimensionField={setNewDimensionField}
                newFeature={newFeature}
                setNewFeature={setNewFeature}
                isAddLoading={isAddLoading}
                isUploading={isUploading}
                selectedImage={selectedImage}
                imagePreview={imagePreview}
                addCategory={addCategory}
                addProduct={addProduct}
                addDimensionField={addDimensionField}
                removeDimensionField={removeDimensionField}
                handleImageSelect={handleImageSelect}
                handleImageUpload={handleImageUpload}
              />
            )}

            {/* Backup Management Tab */}
            {activeTab === 'backups' && (
              <BackupManagement
                backups={backups}
                selectedBackup={selectedBackup}
                setSelectedBackup={setSelectedBackup}
                isBackupLoading={isBackupLoading || isImageLoading}
                restoreBackup={restoreBackup}
                resetToDefault={resetToDefault}
                cleanupBackups={cleanupBackups}
                deleteBackup={deleteBackup}
                analyzeImages={analyzeImages}
                cleanupImages={cleanupImages}
                imageAnalysis={imageAnalysis}
              />
            )}

            {/* Coupon Management Tab */}
            {activeTab === 'coupons' && (
              <CouponManagement
                coupons={coupons}
                isCouponLoading={isCouponLoading}
                couponForm={couponForm}
                setCouponForm={setCouponForm}
                createCoupon={createCoupon}
                deleteCoupon={deleteCoupon}
              />
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
                <GlassContainer key={product.id} padding="small">
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
                </GlassContainer>
              ))}
            </div>
          </GlassCard>
        </section>
    </AdminLayout>
  );
} 