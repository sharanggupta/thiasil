"use client";
import { useEffect, useState } from "react";
import productsData from '@/data/products.json';
import { useAdminBackups } from '@/lib/hooks/useAdminBackups';
import { useAdminCoupons } from '@/lib/hooks/useAdminCoupons';
import { useAdminProducts } from '@/lib/hooks/useAdminProducts';
import { useAdminSession } from '@/lib/hooks/useAdminSession';
import { GlassCard, GlassIcon, GlassInput } from "@/app/components/Glassmorphism";
import AdminLayout from "@/app/components/admin/AdminLayout";
import AdminTabNavigation from "@/app/components/admin/AdminTabNavigation";
import AdminTabContent from "@/app/components/admin/AdminTabContent";

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
    lockTimeRemaining,
    message,
    setMessage,
    isLoading,
    setIsLoading,
    handleLogin,
    handleLogout
  } = session;

  // Use the products hook
  const productsApi = useAdminProducts({ username, password }, setMessage);
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedProductId,
    setSelectedProductId,
    categoryForm,
    setCategoryForm,
    productForm,
    setProductForm,
    newDimensionField,
    setNewDimensionField,
    newFeature,
    setNewFeature,
    isAdding: isAddLoading,
    isUploading,
    selectedImage,
    imagePreview,
    addCategory,
    addProduct,
    addDimensionField,
    removeDimensionField,
    handleImageSelect,
    handleImageUpload,
    loadProducts
  } = productsApi;

  // Use the backups hook
  const backupsApi = useAdminBackups({ username, password }, setMessage);
  const {
    backups,
    isLoading: isBackupLoading,
    createBackup,
    downloadBackup,
    deleteBackup,
    restoreBackup,
    handleBackupFileSelect,
    selectedBackupFile,
    uploadAndRestoreBackup
  } = backupsApi;

  // Use the coupons hook
  const couponsApi = useAdminCoupons({ username, password }, setMessage);
  const {
    coupons,
    couponForm,
    setCouponForm,
    isLoading: isCouponLoading,
    createCoupon,
    deleteCoupon
  } = couponsApi;

  // Local state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Unified management states
  const [priceChangePercent, setPriceChangePercent] = useState("10");
  const [stockStatus, setStockStatus] = useState("in_stock");
  const [quantity, setQuantity] = useState("");

  // Image cleanup states
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && username && password) {
      // Load all admin data
      loadProducts();
    }
  }, [isAuthenticated, username, password, loadProducts]);

  // Auto-logout timer
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        handleLogout();
        setMessage("Session expired due to inactivity");
      }, SESSION_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Input sanitization
  const sanitizeInput = (input: string) => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceChangePercent: percent,
          credentials
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message || 'Prices updated successfully!'}`);
        loadProducts();
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to update prices'}`);
      }
    } catch (error) {
      console.error('Price update error:', error);
      setMessage(`❌ Error: Failed to update prices. Please try again.`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockStatus,
          quantity: quantity || null,
          selectedCategory: selectedCategory === "all" ? null : selectedCategory,
          selectedProductId: selectedProductId === "all" ? null : selectedProductId,
          credentials
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message || 'Inventory updated successfully!'}`);
        loadProducts();
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to update inventory'}`);
      }
    } catch (error) {
      console.error('Inventory update error:', error);
      setMessage(`❌ Error: Failed to update inventory. Please try again.`);
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
      const response = await fetch('/api/admin/analyze-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setImageAnalysis(data.analysis);
        setMessage(`✅ Analysis complete: Found ${data.analysis.unusedCount} unused images (${data.analysis.totalSize})`);
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to analyze images'}`);
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      setMessage(`❌ Error: Failed to analyze images. Please try again.`);
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
      const response = await fetch('/api/admin/cleanup-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setImageAnalysis(null);
        setMessage(`✅ Cleanup complete: ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to cleanup images'}`);
      }
    } catch (error) {
      console.error('Image cleanup error:', error);
      setMessage(`❌ Error: Failed to cleanup images. Please try again.`);
    } finally {
      setIsImageLoading(false);
    }
  };

  // Update selected product when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const categoryProducts = products.filter(p => p.categorySlug === selectedCategory);
      if (categoryProducts.length > 0) {
        setSelectedProductId(String(categoryProducts[0].id));
      } else {
        setSelectedProductId("all");
      }
    } else {
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
              <h1 className="text-2xl font-bold mt-4 mb-2">Admin Login</h1>
              <p className="text-white/80">Enter your admin credentials to continue</p>
            </div>

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && loginAttempts < 3 && (
              <div className="w-full mb-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  ⚠️ {3 - loginAttempts} attempt{3 - loginAttempts !== 1 ? 's' : ''} remaining
                </p>
              </div>
            )}

            {/* Account Locked Warning */}
            {isLocked && (
              <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                <p className="text-red-200 text-sm">
                  🔒 Account locked. Try again in {Math.ceil(lockTimeRemaining / 1000)} seconds
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                <GlassInput
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(sanitizeInput(e.target.value))}
                  placeholder="Username"
                  required
                  disabled={isLocked}
                  maxLength={50}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <GlassInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  disabled={isLocked}
                  maxLength={100}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>

              {message && (
                <div className={`text-sm p-3 rounded-lg ${
                  message.includes('✅') 
                    ? 'bg-green-500/20 border border-green-400/30 text-green-200' 
                    : 'bg-red-500/20 border border-red-400/30 text-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isLoading || isLocked}
                  className="glass-button glass-button--primary glass-button--large w-full"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          </GlassCard>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isAuthenticated={true} username={username} handleLogout={handleLogout}>
      <AdminTabNavigation 
        tabs={ADMIN_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <AdminTabContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        products={products}
        categories={categories}
        backups={backups}
        coupons={coupons}
        isAuthenticated={isAuthenticated}
        username={username}
        password={password}
        setMessage={setMessage}
        priceChangePercent={priceChangePercent}
        setPriceChangePercent={setPriceChangePercent}
        stockStatus={stockStatus}
        setStockStatus={setStockStatus}
        quantity={quantity}
        setQuantity={setQuantity}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        updatePrices={updatePrices}
        updateInventory={updateInventory}
        loadProducts={loadProducts}
        imageAnalysis={imageAnalysis}
        setImageAnalysis={setImageAnalysis}
        isImageLoading={isImageLoading}
        setIsImageLoading={setIsImageLoading}
        analyzeImages={analyzeImages}
        cleanupImages={cleanupImages}
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
        couponForm={couponForm}
        setCouponForm={setCouponForm}
        isCouponLoading={isCouponLoading}
        createCoupon={createCoupon}
        deleteCoupon={deleteCoupon}
      />
    </AdminLayout>
  );
}