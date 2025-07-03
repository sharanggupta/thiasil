import { Metadata } from "next";
import { ProductDetailsPageClient } from "./ProductDetailsPageClient";
import productsData from "@/data/products.json";

interface PageProps {
  params: Promise<{ category: string; product: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { product } = resolvedParams;
  
  // Find product data
  const productData = productsData.products.find(
    (p) => p.catNo.toLowerCase() === decodeURIComponent(product || "").toLowerCase()
  );
  
  if (!productData) {
    return {
      title: "Product Not Found | Thiasil",
      description: "The requested product was not found.",
    };
  }
  
  const title = `${productData.name} | Thiasil Laboratory Glassware`;
  const description = `${productData.description} - Premium laboratory glassware from Thiasil. Cat No: ${productData.catNo}. High-quality scientific equipment for research and analytical applications.`;
  
  return {
    title,
    description,
    keywords: [
      productData.name?.toLowerCase(),
      productData.catNo,
      "laboratory glassware",
      "scientific equipment",
      "thiasil products",
      "analytical chemistry",
      "research equipment",
      "premium glassware",
      productData.category?.toLowerCase()
    ],
    openGraph: {
      title,
      description,
      url: `https://thiasil.com/products/${resolvedParams.category}/${product}`,
      type: "website",
      images: [
        {
          url: productData.image || "/images/product-og.jpg",
          width: 1200,
          height: 630,
          alt: `${productData.name} - Thiasil Laboratory Glassware`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [productData.image || "/images/product-og.jpg"],
    },
    alternates: {
      canonical: `https://thiasil.com/products/${resolvedParams.category}/${product}`,
    },
  };
}

export default function ProductDetailsPage({ params }: PageProps) {
  return <ProductDetailsPageClient params={params} />;
}
