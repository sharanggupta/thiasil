import { Suspense } from 'react';
import CompanyPageClient from './CompanyPageClient';
import { CompanyStatsServer } from '@/app/components/server/CompanyInfoServer';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

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
