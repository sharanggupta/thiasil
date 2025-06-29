"use client";
import { GlassButton, GlassInput, GlassContainer } from "../Glassmorphism";

export default function PriceManagement({
  categories,
  selectedCategory,
  setSelectedCategory,
  categoryProducts,
  selectedProductId,
  setSelectedProductId,
  priceChangePercent,
  setPriceChangePercent,
  updatePrices,
  isLoading
}) {
  return (
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
      <GlassContainer className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Price Change (%)</label>
            <GlassInput
              type="number"
              value={priceChangePercent}
              onChange={(e) => setPriceChangePercent(e.target.value)}
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
      </GlassContainer>
    </div>
  );
}