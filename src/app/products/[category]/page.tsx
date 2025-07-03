import { Metadata } from "next";
import { CategoryPageClient } from "./CategoryPageClient";
import productsData from "@/data/products.json";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category: categorySlug } = resolvedParams;
  
  // Find products in this category to get category info
  const categoryProducts = productsData.products.filter(
    product => product.categorySlug === categorySlug
  );
  
  if (categoryProducts.length === 0) {
    return {
      title: "Category Not Found | Thiasil",
      description: "The requested category was not found.",
    };
  }
  
  const categoryName = categoryProducts[0].category || categorySlug;
  const title = `${categoryName} | Thiasil Laboratory Glassware`;
  const description = `Explore our ${categoryName} collection of premium laboratory glassware and equipment. High-quality products for scientific research and analytical chemistry.`;
  
  return {
    title,
    description,
    keywords: [
      categoryName.toLowerCase(),
      "laboratory glassware",
      "scientific equipment",
      "thiasil products",
      "analytical chemistry",
      "research equipment",
      "premium glassware",
      "laboratory supplies"
    ],
    openGraph: {
      title,
      description,
      url: `https://thiasil.com/products/${categorySlug}`,
      type: "website",
      images: [
        {
          url: "/images/category-og.jpg",
          width: 1200,
          height: 630,
          alt: `${categoryName} - Thiasil Laboratory Glassware`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/category-og.jpg"],
    },
    alternates: {
      canonical: `https://thiasil.com/products/${categorySlug}`,
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  return <CategoryPageClient params={params} />;
} 