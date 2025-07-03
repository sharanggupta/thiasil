"use client";
import { STOCK_STATUSES } from '../../../lib/constants';
import { GlassButton, GlassInput, GlassContainer } from "@/app/components/Glassmorphism";

export default function InventoryManagement({
  categories,
  selectedCategory,
  setSelectedCategory,
  categoryProducts,
  selectedProductId,
  setSelectedProductId,
  stockStatus,
  setStockStatus,
  quantity,
  setQuantity,
  updateInventory,
  isLoading
}) {
  return (
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
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-hidden focus:border-[#3a8fff] transition-colors"
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
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-hidden focus:border-[#3a8fff] transition-colors"
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
      <GlassContainer className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Stock Status</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-hidden focus:border-[#3a8fff] transition-colors"
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
            <GlassInput
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Leave empty for made-to-order"
              min={0}
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
        <GlassContainer padding="small">
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
        </GlassContainer>
      </GlassContainer>
    </div>
  );
}