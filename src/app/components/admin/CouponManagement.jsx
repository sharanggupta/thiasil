"use client";
import { GlassButton, GlassInput, GlassContainer, GlassBadge } from "../Glassmorphism";

export default function CouponManagement({
  coupons,
  isCouponLoading,
  couponForm,
  setCouponForm,
  createCoupon,
  deleteCoupon
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <span>🎫</span>
        Coupon Management
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Coupon Form */}
        <GlassContainer>
          <h3 className="text-xl font-bold text-white mb-4">Create New Coupon</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Coupon Code</label>
              <GlassInput
                type="text"
                value={couponForm.code}
                onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                placeholder="e.g., SAVE20"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Discount Percentage</label>
              <GlassInput
                type="number"
                value={couponForm.discountPercent}
                onChange={(e) => setCouponForm({...couponForm, discountPercent: e.target.value})}
                placeholder="20"
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Expiry Date</label>
              <GlassInput
                type="date"
                value={couponForm.expiryDate}
                onChange={(e) => setCouponForm({...couponForm, expiryDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Max Uses (Optional)</label>
              <GlassInput
                type="number"
                value={couponForm.maxUses}
                onChange={(e) => setCouponForm({...couponForm, maxUses: e.target.value})}
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
        </GlassContainer>

        {/* Active Coupons List */}
        <GlassContainer>
          <h3 className="text-xl font-bold text-white mb-4">Active Coupons</h3>
          
          {coupons.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {coupons.map((coupon) => {
                const isExpired = new Date(coupon.expiryDate) < new Date();
                const isMaxedOut = coupon.maxUses && coupon.usageCount >= coupon.maxUses;
                
                return (
                  <GlassContainer key={coupon.code} variant="nested" padding="small">
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
                        <GlassBadge variant={isExpired || isMaxedOut ? 'error' : 'success'}>
                          {isExpired ? 'Expired' : isMaxedOut ? 'Maxed Out' : 'Active'}
                        </GlassBadge>
                      </div>
                    </div>
                  </GlassContainer>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-white/60 py-8">
              <div className="text-4xl mb-2">🎫</div>
              <p>No active coupons</p>
            </div>
          )}
        </GlassContainer>
      </div>

      {/* Coupon Info */}
      <GlassContainer padding="small" className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-3">Coupon Information</h4>
        <div className="space-y-2 text-sm text-white/80">
          <p>• <strong>Code:</strong> Unique coupon code (automatically converted to uppercase)</p>
          <p>• <strong>Discount:</strong> Percentage discount applied to product prices</p>
          <p>• <strong>Expiry:</strong> Date when the coupon becomes invalid</p>
          <p>• <strong>Max Uses:</strong> Optional limit on how many times the coupon can be used</p>
          <p>• <strong>Usage Tracking:</strong> Coupon usage is automatically tracked and incremented</p>
          <p>• <strong>Validation:</strong> Coupons are validated on the products page for customers</p>
        </div>
      </GlassContainer>
    </div>
  );
}