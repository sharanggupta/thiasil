"use client";
import React, { useState } from 'react';
import ProductGrid from './ProductGrid';
import ProductList from './ProductList';
import ProductLayoutCard from './ProductLayoutCard';
import ViewToggle, { ViewMode } from './ViewToggle';

export interface ProductLayoutProps {
  products: any[];
  loading?: boolean;
  loadingCount?: number;
  defaultView?: ViewMode;
  availableViews?: ViewMode[];
  showViewToggle?: boolean;
  onProductOrder?: (product: any) => void;
  onProductQuote?: (product: any) => void;
  onProductView?: (product: any) => void;
  emptyState?: React.ReactNode;
  className?: string;
  gridProps?: {
    columns?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: 'small' | 'medium' | 'large';
    responsive?: boolean;
    minItemWidth?: string;
  };
  listProps?: {
    spacing?: 'compact' | 'comfortable' | 'spacious';
    dividers?: boolean;
  };
}

export default function ProductLayout({
  products,
  loading = false,
  loadingCount = 6,
  defaultView = 'grid',
  availableViews = ['grid', 'list'],
  showViewToggle = true,
  onProductOrder,
  onProductQuote,
  onProductView,
  emptyState,
  className = '',
  gridProps = {},
  listProps = {}
}: ProductLayoutProps) {
  const [currentView, setCurrentView] = useState<ViewMode>(defaultView);

  const renderProducts = () => {
    const productElements = products.map((product) => (
      <ProductLayoutCard
        key={product.id}
        product={product}
        variant={currentView === 'grid' ? 'card' : 'compact'}
        onOrderClick={onProductOrder}
        onQuoteClick={onProductQuote}
        onViewClick={onProductView}
      />
    ));

    if (currentView === 'grid') {
      return (
        <ProductGrid
          loading={loading}
          loadingCount={loadingCount}
          {...gridProps}
        >
          {productElements}
        </ProductGrid>
      );
    } else {
      return (
        <ProductList
          loading={loading}
          loadingCount={loadingCount}
          emptyState={emptyState}
          {...listProps}
        >
          {productElements}
        </ProductList>
      );
    }
  };

  const renderEmptyState = () => {
    if (emptyState) {
      return emptyState;
    }

    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-white/90 mb-2">No Products Found</h3>
        <p className="text-white/70 max-w-md mx-auto">
          We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  };

  return (
    <div className={`product-layout ${className}`}>
      {/* View Toggle */}
      {showViewToggle && availableViews.length > 1 && (
        <div className="flex justify-end mb-6">
          <ViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
            availableViews={availableViews}
          />
        </div>
      )}

      {/* Products Display */}
      {loading || products.length > 0 ? (
        renderProducts()
      ) : (
        renderEmptyState()
      )}

      {/* Results Summary */}
      {!loading && products.length > 0 && (
        <div className="mt-8 text-center text-white/60 text-sm">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}