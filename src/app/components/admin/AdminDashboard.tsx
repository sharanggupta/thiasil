"use client";
import React, { useState } from 'react';
import { GlassCard, GlassIcon, GlassButton, GlassContainer } from "@/app/components/Glassmorphism";
import Heading from "@/app/components/common/Heading";

interface AdminDashboardProps {
  products: any[];
  categories: any[];
  backups: any[];
  coupons: any[];
  onTabChange: (tabId: string) => void;
}

export default function AdminDashboard({ 
  products, 
  categories, 
  backups, 
  coupons, 
  onTabChange 
}: AdminDashboardProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  // Calculate current products to display
  const startIndex = currentPage * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <span>📊</span>
        Dashboard
      </h2>
      
      {/* Statistics Cards */}
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

      {/* Quick Actions */}
      <GlassContainer>
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GlassButton
            onClick={() => onTabChange('prices')}
            variant="accent"
            size="large"
            className="w-full"
          >
            <span>💰</span>
            <span>Update Prices</span>
          </GlassButton>
          <GlassButton
            onClick={() => onTabChange('inventory')}
            variant="accent"
            size="large"
            className="w-full"
          >
            <span>📦</span>
            <span>Manage Inventory</span>
          </GlassButton>
          <GlassButton
            onClick={() => onTabChange('add-products')}
            variant="accent"
            size="large"
            className="w-full"
          >
            <span>➕</span>
            <span>Add Products</span>
          </GlassButton>
        </div>
      </GlassContainer>

      {/* Products Overview */}
      <GlassContainer className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Products Overview</h3>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
            </div>
          )}
        </div>
        
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProducts.map((product, index) => (
                <GlassCard key={startIndex + index} variant="secondary" padding="default" className="bg-white/10">
                  <div className="flex items-center gap-3">
                    <GlassIcon icon="📦" variant="secondary" size="small" />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{product.name}</h4>
                      <p className="text-white/70 text-xs">{product.category}</p>
                      {product.priceRange && (
                        <p className="text-white/90 text-xs font-medium">{product.priceRange}</p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-white/70 text-sm">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, products.length)} of {products.length} products
                </div>
                <div className="flex items-center gap-2">
                  <GlassButton
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    variant="secondary"
                    size="small"
                    className={`${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    ← Previous
                  </GlassButton>
                  <GlassButton
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    variant="secondary"
                    size="small"
                    className={`${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Next →
                  </GlassButton>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <GlassIcon icon="📦" variant="secondary" size="large" className="mx-auto mb-2" />
            <p className="text-white/70">No products found</p>
          </div>
        )}
      </GlassContainer>
    </div>
  );
}