import { Metadata } from 'next';
import { Suspense } from 'react';
import CompanyPageClient from './CompanyPageClient';
import { CompanyStatsServer } from '@/app/components/server/CompanyInfoServer';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: "About Us | Thiasil Laboratory Glassware Company",
  description: "Learn about Thiasil's legacy in manufacturing premium laboratory glassware and silica crucibles since our founding. Discover our commitment to quality, innovation, and international standards.",
  keywords: [
    "thiasil company",
    "laboratory glassware manufacturer",
    "about thiasil",
    "silica crucibles manufacturer",
    "laboratory equipment company",
    "Mumbai glassware manufacturer",
    "thiasil history",
    "premium laboratory glassware",
    "company profile thiasil",
    "scientific glassware manufacturer"
  ],
  openGraph: {
    title: "About Us | Thiasil Laboratory Glassware Company",
    description: "Learn about Thiasil's legacy in manufacturing premium laboratory glassware and silica crucibles. Discover our commitment to quality and innovation.",
    url: "https://thiasil.com/company",
    type: "website",
    images: [
      {
        url: "/images/company-og.jpg",
        width: 1200,
        height: 630,
        alt: "Thiasil Laboratory Glassware Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Thiasil Laboratory Glassware Company",
    description: "Learn about Thiasil's legacy in manufacturing premium laboratory glassware and silica crucibles.",
    images: ["/images/company-og.jpg"],
  },
  alternates: {
    canonical: "https://thiasil.com/company",
  },
};

// Server component - runs on server, generates metadata
export default function Company() {
  return (
    <CompanyPageClient>
      {/* Server-rendered company stats */}
      <section className="flex flex-col items-center justify-center gap-8">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/10 rounded-xl h-24"></div>
            ))}
          </div>
        }>
          <CompanyStatsServer />
        </Suspense>
      </section>
    </CompanyPageClient>
  );
}
