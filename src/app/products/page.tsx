import { Metadata } from "next";
import { ProductsPageClient } from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "Premium Laboratory Glassware & Equipment | Thiasil Products",
  description: "Explore Thiasil's comprehensive range of premium laboratory glassware, silica crucibles, and scientific equipment. High-quality products for analytical chemistry and research applications.",
  keywords: [
    "laboratory glassware products",
    "silica crucibles catalog",
    "thiasil products",
    "scientific equipment",
    "analytical chemistry glassware",
    "quartz crucibles",
    "laboratory supplies",
    "premium glassware catalog",
    "research equipment",
    "scientific instruments"
  ],
  openGraph: {
    title: "Premium Laboratory Glassware & Equipment | Thiasil Products",
    description: "Explore Thiasil's comprehensive range of premium laboratory glassware, silica crucibles, and scientific equipment.",
    url: "https://thiasil.com/products",
    type: "website",
    images: [
      {
        url: "/images/products-og.jpg",
        width: 1200,
        height: 630,
        alt: "Thiasil Laboratory Glassware Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Laboratory Glassware & Equipment | Thiasil Products",
    description: "Explore Thiasil's comprehensive range of premium laboratory glassware, silica crucibles, and scientific equipment.",
    images: ["/images/products-og.jpg"],
  },
  alternates: {
    canonical: "https://thiasil.com/products",
  },
};

export default function Products() {
  return <ProductsPageClient />;
} 