"use client";
import { use } from "react";
import { useCoupons } from "@/lib/hooks/useCoupons";
import { useCategoryData } from "@/lib/hooks/useCategoryData";
import { NeonBubblesBackground } from "@/app/components/Glassmorphism";
import Navbar from "@/app/components/Navbar/Navbar";
import Breadcrumb from "@/app/components/common/Breadcrumb";
import CategoryLoadingState from "@/app/components/category/CategoryLoadingState";
import CategoryNotFound from "@/app/components/category/CategoryNotFound";
import CategoryHero from "@/app/components/category/CategoryHero";
import CategoryProductGrid from "@/app/components/category/CategoryProductGrid";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  // Get category from params using React.use()
  const resolvedParams = use(params);
  const { category: categorySlug } = resolvedParams;
  
  // Use custom hooks for data fetching and coupon management
  const { categoryData, isLoading, error } = useCategoryData(categorySlug);
  const {
    couponCode,
    setCouponCode,
    activeCoupon,
    couponMessage,
    isApplyingCoupon,
    applyCoupon,
    clearCoupon
  } = useCoupons();


  if (isLoading) {
    return <CategoryLoadingState />;
  }

  if (error || !categoryData) {
    return <CategoryNotFound error={error} />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--dark-primary-gradient)' }}>
      <Navbar />
      <NeonBubblesBackground />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'var(--primary-gradient)', opacity: 0.3 }} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24 flex flex-col gap-20 ml-0 md:ml-32">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
            { label: categoryData.title || categoryData.name || "Category" }
          ]}
        />

        {/* Hero Section */}
        <CategoryHero
          categoryData={categoryData}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          activeCoupon={activeCoupon}
          couponMessage={couponMessage}
          isApplyingCoupon={isApplyingCoupon}
          applyCoupon={applyCoupon}
          clearCoupon={clearCoupon}
        />

        {/* Product Grid */}
        <CategoryProductGrid
          variants={categoryData.variants}
          activeCoupon={activeCoupon}
        />
      </main>
    </div>
  );
} 