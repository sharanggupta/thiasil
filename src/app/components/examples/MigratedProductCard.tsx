"use client";
import React from 'react';
import { GlassCard, GlassButton, GlassIcon } from "@/app/components/Glassmorphism";
import { ProductPrice } from "@/app/components/coupons";
import StockStatusBadge from "@/app/components/common/StockStatusBadge";
import Image from 'next/image';

// Example of how to migrate an existing ProductCard to use centralized coupon state
interface MigratedProductCardProps {
  product: {
    id: string | number;
    name: string;
    category?: string;
    price: string;
    priceRange?: string;
    stockStatus?: string;
    quantity?: number;
    catNo?: string;
    capacity?: string;
    packaging?: string;
    features?: string[];
    image?: string;
    dimensions?: Record<string, any>;
  };
  variant?: 'card' | 'compact' | 'detailed';
  showImage?: boolean;
  showFeatures?: boolean;
  showActions?: boolean;
  onOrderClick?: (product: any) => void;
  onQuoteClick?: (product: any) => void;
  onViewClick?: (product: any) => void;
  className?: string;
}

export default function MigratedProductCard({
  product,
  variant = 'card',
  showImage = true,
  showFeatures = true,
  showActions = true,
  onOrderClick,
  onQuoteClick,
  onViewClick,
  className = ''
}: MigratedProductCardProps) {
  
  const renderCompactView = () => (
    <div className={`flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors ${className}`}>
      {/* Image */}
      {showImage && product.image && (
        <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg border border-white/20">
          <Image
            src={product.image}
            alt={product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white/90 truncate">{product.name}</h3>
        {product.catNo && (
          <p className="text-xs text-white/60">CAT: {product.catNo}</p>
        )}
        <div className="flex items-center gap-4 mt-2">
          {/* BEFORE: Manual price logic with props
          <span className="font-bold text-green-300">
            {activeCoupon ? applyDiscountToPrice(product.price, activeCoupon.discountPercent) : product.price}
          </span>
          */}
          
          {/* AFTER: Centralized coupon-aware price display */}
          <ProductPrice 
            price={product.price}
            variant="list"
            showSavings={false}
            showDiscountBadge={false}
          />
          
          {product.stockStatus && (
            <StockStatusBadge status={product.stockStatus} />
          )}
        </div>
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="flex-shrink-0 flex gap-2">
          {onViewClick && (
            <GlassButton
              onClick={() => onViewClick(product)}
              variant="secondary"
              size="small"
            >
              View
            </GlassButton>
          )}
          {onOrderClick && (
            <GlassButton
              onClick={() => onOrderClick(product)}
              variant="primary"
              size="small"
            >
              Order
            </GlassButton>
          )}
        </div>
      )}
    </div>
  );

  const renderCardView = () => (
    <GlassCard 
      variant="secondary" 
      padding="default" 
      className={`group hover:scale-105 transition-transform duration-300 h-full flex flex-col ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Product Image */}
        {showImage && product.image && (
          <div className="mb-4 relative">
            <div className="aspect-square w-full h-24 overflow-hidden rounded-xl border border-white/20 shadow-lg bg-gradient-to-br from-white/10 to-white/5">
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        )}
        
        {/* Product Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#3a8fff] transition-colors">
            {product.name}
          </h3>
          
          {product.catNo && (
            <div className="flex items-center gap-2 text-sm mb-2">
              <GlassIcon icon="🏷️" variant="accent" size="small" />
              <span className="text-white/80">CAT. NO.: <span className="text-white font-mono font-medium">{product.catNo}</span></span>
            </div>
          )}
          
          {product.capacity && product.capacity !== 'N/A' && (
            <div className="flex items-center gap-2 text-sm mb-2">
              <GlassIcon icon="🧪" variant="accent" size="small" />
              <span className="text-white/80">Capacity: {product.capacity}</span>
            </div>
          )}
          
          {product.packaging && (
            <div className="flex items-center gap-2 text-sm">
              <GlassIcon icon="📦" variant="accent" size="small" />
              <span className="text-white/80">{product.packaging}</span>
            </div>
          )}
        </div>

        {/* Stock Status */}
        {product.stockStatus && (
          <div className="mb-4">
            <StockStatusBadge status={product.stockStatus} />
            {product.quantity !== undefined && product.quantity !== null && (
              <span className="ml-2 text-sm text-white/60">
                Qty: {product.quantity}
              </span>
            )}
          </div>
        )}

        {/* Price Section - MIGRATED */}
        <div className="mb-6">
          <div className="rounded-xl p-4 border border-white/20" style={{ background: 'var(--primary-gradient)', opacity: 0.2 }}>
            <div className="text-center">
              <p className="text-sm text-white/60 mb-1">Price per piece</p>
              
              {/* BEFORE: Manual coupon logic
              {activeCoupon ? (
                <div>
                  <p className="text-lg text-white/60 line-through">{product.price}</p>
                  <p className="text-3xl font-bold text-green-300">
                    {applyDiscountToPrice(product.price, activeCoupon.discountPercent)}
                  </p>
                  <p className="text-sm text-green-300/80">
                    {activeCoupon.discountPercent}% discount applied
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-white">{product.price}</p>
              )}
              */}
              
              {/* AFTER: Centralized coupon-aware pricing */}
              <ProductPrice 
                price={product.price}
                priceRange={product.priceRange}
                variant="card"
                showOriginal={true}
                showSavings={true}
                showDiscountBadge={false}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        {showFeatures && product.features && product.features.length > 0 && (
          <div className="mb-6 flex-grow">
            <h4 className="text-sm font-semibold text-white/90 mb-2">Features:</h4>
            <div className="space-y-1">
              {product.features.slice(0, 3).map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-[#3a8fff] rounded-full"></div>
                  <span className="text-white/70">{feature}</span>
                </div>
              ))}
              {product.features.length > 3 && (
                <div className="text-xs text-white/50 italic">
                  +{product.features.length - 3} more features
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-auto space-y-2">
            {onOrderClick && (
              <GlassButton
                onClick={() => onOrderClick(product)}
                variant="primary"
                size="medium"
                className="w-full justify-center"
              >
                <span>Order Now</span>
                <span>→</span>
              </GlassButton>
            )}
            
            {onQuoteClick && (
              <GlassButton
                onClick={() => onQuoteClick(product)}
                variant="secondary"
                size="medium"
                className="w-full justify-center"
              >
                Get Quote
              </GlassButton>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );

  switch (variant) {
    case 'compact':
      return renderCompactView();
    case 'detailed':
      return renderCardView();
    default:
      return renderCardView();
  }
}

// Example migration notes:
/*
MIGRATION STEPS FROM LEGACY COUPON USAGE:

1. REMOVE coupon props from component interface:
   ❌ Remove: activeCoupon, onProductOrder, onProductQuote props
   
2. REPLACE manual price calculations:
   ❌ Old: {activeCoupon ? applyDiscountToPrice(product.price, activeCoupon.discountPercent) : product.price}
   ✅ New: <ProductPrice price={product.price} variant="card" />

3. REMOVE coupon prop drilling:
   ❌ Old: <ProductCard activeCoupon={activeCoupon} onProductOrder={handleOrder} />
   ✅ New: <ProductCard /> // Automatically gets coupon state from context

4. UPDATE parent components:
   ❌ Old: const { activeCoupon } = useCoupons(); <ProductCard activeCoupon={activeCoupon} />
   ✅ New: <ProductCard /> // No coupon props needed

5. BENEFITS after migration:
   ✅ Coupon state persists across navigation
   ✅ No prop drilling required
   ✅ Consistent discount calculations
   ✅ Automatic price updates when coupons change
   ✅ Built-in coupon validation and error handling
   ✅ Enhanced UX with coupon history and suggestions
*/