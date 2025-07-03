"use client";
import { use } from "react";
import Footer from "@/app/components/Footer/Footer";
import "@/app/components/HeroSection/Hero.css";
import Navbar from "@/app/components/Navbar/Navbar";
import { getBaseCatalogNumber } from "@/lib/utils";
import productsData from "@/data/products.json";
import { ProductStructuredData, BreadcrumbStructuredData } from "@/app/components/seo/StructuredData";
import { ProductHero, VariantsGrid } from "./components";

interface ProductDetailsPageClientProps {
  params: Promise<{ category: string; product: string }>;
}

function ProductNotFound({ product }: { product: string }) {
  return (
    <div className="main-margin bg-[#f7f7f7] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600">The requested product &quot;{decodeURIComponent(product || "")}&quot; could not be found.</p>
        <p className="text-sm text-gray-500 mt-2">Available products: {productsData.products.map(p => p.catNo).join(', ')}</p>
      </div>
    </div>
  );
}

function getFilteredVariants(productData: any, baseCatalogNumber: string) {
  const allVariants = productsData.productVariants?.[productData.categorySlug]?.variants || [];
  return allVariants.filter(variant => {
    // For variants without catNo (new admin-created products), show all variants in the category
    if (!variant.catNo) {
      return true;
    }
    
    // For legacy variants with catNo, filter by matching base catalog number
    const variantBaseNumber = getBaseCatalogNumber(variant.catNo);
    return variantBaseNumber === baseCatalogNumber;
  });
}

export function ProductDetailsPageClient({ params }: ProductDetailsPageClientProps) {
  const resolvedParams = use(params);
  const { product, category } = resolvedParams;
  
  const productData = productsData.products.find(
    (p) => p.catNo.toLowerCase() === decodeURIComponent(product || "").toLowerCase()
  );
  
  if (!productData) {
    return <ProductNotFound product={product} />;
  }

  const baseCatalogNumber = getBaseCatalogNumber(productData.catNo);
  const variants = getFilteredVariants(productData, baseCatalogNumber);
  const currentUrl = `https://thiasil.com/products/${category}/${product}`;

  return (
    <div className="main-margin bg-[#f7f7f7] min-h-screen">
      <ProductStructuredData 
        product={{
          name: productData.name,
          catNo: productData.catNo,
          description: productData.description,
          image: productData.image,
          category: productData.category,
          price: productData.price,
          priceRange: productData.priceRange,
          availability: productData.stockStatus || "in_stock"
        }}
        url={currentUrl}
      />
      <BreadcrumbStructuredData 
        items={[
          { name: "Home", url: "https://thiasil.com" },
          { name: "Products", url: "https://thiasil.com/products" },
          { name: productData.category || "Category", url: `https://thiasil.com/products/${category}` },
          { name: productData.name, url: currentUrl }
        ]} 
      />
      <Navbar theme="products" />
      
      <ProductHero 
        product={{
          name: productData.name,
          description: productData.description,
          image: productData.image
        }}
        category={category}
      />
      
      <VariantsGrid 
        variants={variants} 
        productImage={productData.image || ''} 
      />
      
      <Footer />
    </div>
  );
}