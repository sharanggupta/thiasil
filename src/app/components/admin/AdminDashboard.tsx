"use client";
import React from 'react';
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
    </div>
  );
}