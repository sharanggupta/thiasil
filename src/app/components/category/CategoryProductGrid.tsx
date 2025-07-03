"use client";
import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProductImageInfo } from "@/lib/image-utils";
import { GlassButton, GlassCard, GlassIcon } from "@/app/components/Glassmorphism";
import Modal from '@/app/components/Modals/Modal';
import StockStatusBadge from "@/app/components/common/StockStatusBadge";

interface CategoryProductGridProps {
  variants: any[];
  activeCoupon?: any;
}

// Helper function to apply discount to price
const applyDiscountToPrice = (price: string, discountPercent: number) => {
  if (!price || !discountPercent) return price;
  
  // Extract number from price (e.g., "₹294.00" -> 294.00)
  const number = price.match(/₹(\d+\.?\d*)/);
  if (!number) return price;
  
  const numPrice = parseFloat(number[1]);
  const discountedPrice = numPrice * (1 - discountPercent / 100);
  return `₹${discountedPrice.toFixed(2)}`;
};

export default function CategoryProductGrid({ variants, activeCoupon }: CategoryProductGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<any>(null);
  const router = useRouter();

  return (
    <>
      {/* Product Variants Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
        {variants.map((variant) => (
          <GlassCard key={variant.id} variant="secondary" padding="default" className="group hover:scale-105 transition-transform duration-300 h-full flex flex-col">
            <div className="flex flex-col h-full">
              {/* Product Image - Use dynamic image utility */}
              {(() => {
                const { url: imageUrl, hasImage } = getProductImageInfo(variant);
                return hasImage ? (
                  <div className="mb-4 relative">
                    <div className="aspect-square w-full h-24 overflow-hidden rounded-xl border border-white/20 shadow-lg bg-linear-to-br from-white/10 to-white/5">
                      <Image
                        src={imageUrl}
                        alt={variant.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          // Hide image if it fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {/* Light overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
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
                <StockStatusBadge status={variant.stockStatus || 'in_stock'} />
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
                    {activeCoupon ? (
                      <div>
                        <p className="text-lg text-white/60 line-through">{variant.price}</p>
                        <p className="text-3xl font-bold text-green-300">
                          {applyDiscountToPrice(variant.price, activeCoupon.discountPercent)}
                        </p>
                        <p className="text-sm text-green-300/80">
                          {activeCoupon.discountPercent}% discount applied
                        </p>
                      </div>
                    ) : (
                      <p className="text-3xl font-bold text-white">{variant.price}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 grow">
                <h4 className="text-sm font-semibold text-white/90 mb-2">Features:</h4>
                <div className="space-y-1">
                  {variant.features.map((feature: string, index: number) => (
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
                className="mt-4 px-4 py-2 rounded-lg text-white font-bold shadow-sm transition-all"
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
          <p className="mb-6 text-sm text-gray-700">By proceeding, you agree to our terms and conditions for product inquiries and purchases.</p>
          <button
            className="px-6 py-2 rounded-lg text-white font-bold shadow-sm transition-all"
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
    </>
  );
}